-- Socialdia Nexus — Supabase schema
-- شغّل الملف ده مرة واحدة في Supabase → SQL Editor → New query → Run
-- (آمن تشغّله تاني: كله if not exists / drop policy if exists)

-- ============ 1) بيانات المستخدمين: عملاء / مهام / بوستات ============
do $$
declare tb text;
begin
  foreach tb in array array['clients', 'tasks', 'posts'] loop
    execute format($f$
      create table if not exists public.%I (
        owner      uuid not null default auth.uid() references auth.users(id) on delete cascade,
        id         text not null,
        data       jsonb not null,
        updated_at timestamptz not null default now(),
        primary key (owner, id)
      )$f$, tb);

    execute format('alter table public.%I enable row level security', tb);
    execute format('grant select, insert, update, delete on public.%I to authenticated', tb);
    execute format('drop policy if exists "own rows" on public.%I', tb);
    -- كل مستخدم يشوف ويعدّل بياناته هو بس
    execute format($f$
      create policy "own rows" on public.%I
        for all to authenticated
        using (owner = (select auth.uid()))
        with check (owner = (select auth.uid()))$f$, tb);
  end loop;
end $$;

-- ============ 2) الأدمن ============
-- الأدمن = مستخدم موجود هنا. بيتضاف من SQL Editor بس (مفيش أي طريقة من الموقع نفسه).
create table if not exists public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;
grant select on public.admins to authenticated;
drop policy if exists "read own admin row" on public.admins;
create policy "read own admin row" on public.admins
  for select to authenticated
  using (user_id = (select auth.uid()));

-- ============ 3) محتوى الموقع العام (الصفحة الرئيسية، الباقات، الألوان...) ============
create table if not exists public.site_settings (
  id         text primary key,
  data       jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.site_settings enable row level security;
grant select on public.site_settings to anon, authenticated;
grant insert, update, delete on public.site_settings to authenticated;

drop policy if exists "public read" on public.site_settings;
create policy "public read" on public.site_settings
  for select to anon, authenticated
  using (true);

drop policy if exists "admin write" on public.site_settings;
create policy "admin write" on public.site_settings
  for all to authenticated
  using (exists (select 1 from public.admins a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.admins a where a.user_id = (select auth.uid())));

-- ============ 4) الاشتراكات ============
-- صف واحد لكل مستخدم عنده باقة. المستخدم يقرا صفه بس، والتعديل من لوحة الأدمن بس (admin_set_plan).
--   max_clients: null = بلا حد
--   status: active | suspended (موقوف: التطبيق بيقفل والإضافة مرفوضة)
--   expires_at: بعد التاريخ ده الحساب بيرجع لحدود "بدون اشتراك"
create table if not exists public.subscriptions (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  plan_id     text not null,
  status      text not null default 'active' check (status in ('active', 'suspended')),
  max_clients int check (max_clients is null or max_clients >= 0),
  expires_at  timestamptz,
  updated_at  timestamptz not null default now()
);
alter table public.subscriptions enable row level security;
grant select on public.subscriptions to authenticated;
drop policy if exists "read own subscription" on public.subscriptions;
create policy "read own subscription" on public.subscriptions
  for select to authenticated
  using (user_id = (select auth.uid()));

-- ============ 5) دوال الأدمن (security definer + فحص إن المستدعي أدمن) ============
create or replace function public.admin_list_users()
returns table (
  id uuid, email text, created_at timestamptz, last_sign_in_at timestamptz,
  plan_id text, status text, max_clients int, expires_at timestamptz,
  is_admin boolean, clients bigint, tasks bigint, posts bigint
)
language plpgsql security definer set search_path = ''
as $$
#variable_conflict use_column
begin
  if not exists (select 1 from public.admins a where a.user_id = (select auth.uid())) then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  return query
    select u.id, u.email::text, u.created_at, u.last_sign_in_at,
           s.plan_id, s.status, s.max_clients, s.expires_at,
           exists (select 1 from public.admins a where a.user_id = u.id),
           (select count(*) from public.clients c where c.owner = u.id),
           (select count(*) from public.tasks t where t.owner = u.id),
           (select count(*) from public.posts p where p.owner = u.id)
    from auth.users u
    left join public.subscriptions s on s.user_id = u.id
    order by u.created_at desc
    limit 1000;
end $$;

-- p_plan فاضي + p_status = active  => إلغاء الاشتراك (يرجع لحدود "بدون اشتراك")
-- p_plan فاضي + p_status = suspended => إيقاف حساب بدون باقة
create or replace function public.admin_set_plan(
  p_user uuid, p_plan text, p_status text, p_max int, p_expires timestamptz
) returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if not exists (select 1 from public.admins a where a.user_id = (select auth.uid())) then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  if p_status is null or p_status not in ('active', 'suspended') then
    raise exception 'bad status';
  end if;
  if p_plan is null or p_plan = '' then
    if p_status = 'active' then
      delete from public.subscriptions where user_id = p_user;
      return;
    end if;
    p_plan := 'free';
  end if;
  if p_max is not null and p_max < 0 then raise exception 'bad limit'; end if;
  insert into public.subscriptions as s (user_id, plan_id, status, max_clients, expires_at, updated_at)
  values (p_user, p_plan, p_status, p_max, p_expires, now())
  on conflict (user_id) do update
    set plan_id = excluded.plan_id, status = excluded.status, max_clients = excluded.max_clients,
        expires_at = excluded.expires_at, updated_at = now();
end $$;

create or replace function public.admin_set_admin(p_user uuid, p_admin boolean)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if not exists (select 1 from public.admins a where a.user_id = (select auth.uid())) then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  if p_admin then
    insert into public.admins (user_id) values (p_user) on conflict do nothing;
  else
    if p_user = (select auth.uid()) then raise exception 'cannot remove yourself'; end if;
    delete from public.admins where user_id = p_user;
  end if;
end $$;

revoke all on function public.admin_list_users() from public, anon;
revoke all on function public.admin_set_plan(uuid, text, text, int, timestamptz) from public, anon;
revoke all on function public.admin_set_admin(uuid, boolean) from public, anon;
grant execute on function public.admin_list_users() to authenticated;
grant execute on function public.admin_set_plan(uuid, text, text, int, timestamptz) to authenticated;
grant execute on function public.admin_set_admin(uuid, boolean) to authenticated;

-- ============ 6) فرض الحدود على مستوى قاعدة البيانات ============
-- قبل أي إضافة (insert) في clients/tasks/posts:
--   * الأدمن مستثنى
--   * حساب موقوف  => مرفوض (account_suspended)
--   * إضافة عميل جديد فوق الحد => مرفوض (client_limit_reached)
--     الحد = max_clients من اشتراكه الساري، وإلا options.free_max_clients من إعدادات الموقع (الافتراضي 3، و0 = بلا حد)
-- تعديل صف موجود أو حذفه مش بيتأثر.
create or replace function public.enforce_plan()
returns trigger
language plpgsql security definer set search_path = ''
as $$
declare
  sub public.subscriptions%rowtype;
  has_sub boolean;
  lim int;
  cnt int;
begin
  if exists (select 1 from public.admins a where a.user_id = new.owner) then
    return new;
  end if;

  select * into sub from public.subscriptions s where s.user_id = new.owner;
  has_sub := found;
  if has_sub and sub.status = 'suspended' then
    raise exception 'account_suspended' using errcode = 'P0001';
  end if;

  if tg_table_name <> 'clients' then
    return new;
  end if;
  -- upsert على عميل موجود = تعديل، مش إضافة
  if exists (select 1 from public.clients c where c.owner = new.owner and c.id = new.id) then
    return new;
  end if;

  if has_sub and sub.status = 'active' and (sub.expires_at is null or sub.expires_at > now()) then
    lim := sub.max_clients;                 -- null = بلا حد
  else
    select nullif(ss.data -> 'options' ->> 'free_max_clients', '')::int into lim
      from public.site_settings ss where ss.id = 'main';
    if lim is null then lim := 3; end if;
    if lim = 0 then lim := null; end if;
  end if;

  if lim is not null then
    select count(*) into cnt from public.clients c where c.owner = new.owner;
    if cnt >= lim then
      raise exception 'client_limit_reached' using errcode = 'P0001';
    end if;
  end if;
  return new;
end $$;

do $$
declare tb text;
begin
  foreach tb in array array['clients', 'tasks', 'posts'] loop
    execute format('drop trigger if exists plan_guard on public.%I', tb);
    execute format('create trigger plan_guard before insert on public.%I for each row execute function public.enforce_plan()', tb);
  end loop;
end $$;

-- ============ 7) تعيين أول أدمن ============
-- 1) سجّل حساب عادي من الموقع بإيميلك.
-- 2) بدّل الإيميل تحت بإيميلك وشغّل السطرين دول لوحدهم:
--
-- insert into public.admins (user_id)
--   select id from auth.users where email = 'YOUR_EMAIL@example.com'
--   on conflict do nothing;
