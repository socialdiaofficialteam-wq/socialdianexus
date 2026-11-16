-- Socialdia Nexus — Supabase schema
-- شغّل الملف ده مرة واحدة في Supabase → SQL Editor → New query → Run
-- (آمن تشغّله تاني: كله if not exists / drop policy if exists)

-- ============ 0) الموظفين وصلاحية الوصول لبيانات الشركة ============
-- كل موظف له مستخدم في Supabase Auth (بيتعمل من الـ Worker فقط بمفتاح service role) + صف هنا بيربطه بشركته.
--   owner      = صاحب الشركة (حساب الـ Auth بتاعه)
--   member_id  = id الموظف في فريق الشركة (profiles.data.team)
-- الكتابة هنا من الـ Worker بس. صاحب الشركة والموظف نفسه بيقروا.
create table if not exists public.staff_members (
  owner         uuid not null references auth.users(id) on delete cascade,
  member_id     text not null,
  staff_user_id uuid not null unique references auth.users(id) on delete cascade,
  username      text not null unique check (username ~ '^[a-z0-9._-]{3,30}$'),
  created_at    timestamptz not null default now(),
  primary key (owner, member_id)
);
alter table public.staff_members enable row level security;
grant select on public.staff_members to authenticated;
drop policy if exists "read own staff" on public.staff_members;
create policy "read own staff" on public.staff_members
  for select to authenticated
  using (owner = (select auth.uid()) or staff_user_id = (select auth.uid()));

-- بترجّع "الشركة" اللي المستخدم الحالي شغال فيها: لو موظف = صاحب شركته، وغير كده = نفسه.
create or replace function public.my_company()
returns uuid
language sql stable security definer set search_path = ''
as $$
  select coalesce(
    (select s.owner from public.staff_members s where s.staff_user_id = (select auth.uid()) limit 1),
    (select auth.uid()));
$$;
revoke all on function public.my_company() from public, anon;
grant execute on function public.my_company() to authenticated;

-- ============ 1) بيانات الشركة: عملاء / مهام / بوستات / بروفايل الشركة والفريق ============
-- صاحب الشركة وموظفينه بيشوفوا ويعدّلوا نفس البيانات (clients/tasks/posts). بروفايل الشركة والفريق: التعديل لصاحب الشركة بس.
do $$
declare tb text;
begin
  foreach tb in array array['clients', 'tasks', 'posts', 'profiles'] loop
    if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = tb)
       and not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = tb and column_name = 'owner') then
      raise exception 'الجدول public.% موجود من نسخة قديمة وناقصه عمود owner. لو بياناته مش مهمة شغّل: drop table public.% cascade;  وبعدين شغّل الملف تاني.', tb, tb;
    end if;
  end loop;
end $$;

do $$
declare tb text; wr text;
begin
  foreach tb in array array['clients', 'tasks', 'posts', 'profiles'] loop
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
    execute format('drop policy if exists "company read" on public.%I', tb);
    execute format('drop policy if exists "company insert" on public.%I', tb);
    execute format('drop policy if exists "company update" on public.%I', tb);
    execute format('drop policy if exists "company delete" on public.%I', tb);

    execute format($f$create policy "company read" on public.%I for select to authenticated
      using (owner = (select public.my_company()))$f$, tb);

    if tb = 'profiles' then
      wr := '(select auth.uid())';          -- صاحب الشركة بس
      execute format('alter table public.%I alter column owner set default auth.uid()', tb);
    else
      wr := '(select public.my_company())'; -- صاحب الشركة + موظفينه
      execute format('alter table public.%I alter column owner set default public.my_company()', tb);
    end if;
    execute format($f$create policy "company insert" on public.%I for insert to authenticated
      with check (owner = %s)$f$, tb, wr);
    execute format($f$create policy "company update" on public.%I for update to authenticated
      using (owner = %s) with check (owner = %s)$f$, tb, wr, wr);
    execute format($f$create policy "company delete" on public.%I for delete to authenticated
      using (owner = %s)$f$, tb, wr);
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
-- الموظف بيشوف اشتراك شركته (عشان الحدود والباقة)
drop policy if exists "read own subscription" on public.subscriptions;
create policy "read own subscription" on public.subscriptions
  for select to authenticated
  using (user_id = (select public.my_company()));

-- ============ 5) دوال الأدمن (security definer + فحص إن المستدعي أدمن) ============
drop function if exists public.admin_list_users();
create or replace function public.admin_list_users()
returns table (
  id uuid, email text, created_at timestamptz, last_sign_in_at timestamptz,
  plan_id text, status text, max_clients int, expires_at timestamptz,
  is_admin boolean, clients bigint, tasks bigint, posts bigint, company text
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
           (select count(*) from public.posts p where p.owner = u.id),
           (select pr.data->>'company' from public.profiles pr where pr.owner = u.id and pr.id = 'me')
    from auth.users u
    left join public.subscriptions s on s.user_id = u.id
    where not exists (select 1 from public.staff_members sm where sm.staff_user_id = u.id)  -- حسابات الموظفين مش بتظهر هنا
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
  foreach tb in array array['clients', 'tasks', 'posts', 'profiles'] loop
    execute format('drop trigger if exists plan_guard on public.%I', tb);
    execute format('create trigger plan_guard before insert on public.%I for each row execute function public.enforce_plan()', tb);
  end loop;
end $$;

-- ============ 6ب) شات الشركة (أعضاء الشركة بس) ============
create table if not exists public.chat_messages (
  id          uuid primary key default gen_random_uuid(),
  owner       uuid not null default public.my_company() references auth.users(id) on delete cascade,
  sender      uuid not null default auth.uid(),
  sender_name text not null check (char_length(sender_name) between 1 and 80),
  body        text not null check (char_length(body) between 1 and 2000),
  created_at  timestamptz not null default now()
);
create index if not exists chat_messages_owner_time on public.chat_messages (owner, created_at desc);
alter table public.chat_messages enable row level security;
grant select, insert, delete on public.chat_messages to authenticated;
drop policy if exists "chat read" on public.chat_messages;
create policy "chat read" on public.chat_messages for select to authenticated
  using (owner = (select public.my_company()));
drop policy if exists "chat send" on public.chat_messages;
create policy "chat send" on public.chat_messages for insert to authenticated
  with check (owner = (select public.my_company()) and sender = (select auth.uid()));
drop policy if exists "chat delete" on public.chat_messages;
create policy "chat delete" on public.chat_messages for delete to authenticated
  using (owner = (select auth.uid()) or sender = (select auth.uid()));   -- صاحب الشركة يمسح أي رسالة، والموظف رسايله بس

-- تحديث لحظي (Realtime) للشات وبيانات الشركة
do $$
declare tb text;
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    foreach tb in array array['chat_messages', 'clients', 'tasks', 'posts', 'profiles'] loop
      begin
        execute format('alter publication supabase_realtime add table public.%I', tb);
      exception when duplicate_object then null;
      end;
    end loop;
  end if;
end $$;

-- ============ 7) تنظيف (اختياري) ============
-- لو كنت شغّلت نسخة سابقة فيها ربط مباشر مع السوشيال، الجداول دي مبقتش مستخدمة. تقدر تمسحها بأمان:
-- drop table if exists public.social_tokens;
-- drop table if exists public.social_accounts;

-- ============ 8) تعيين أول أدمن ============
-- 1) سجّل حساب عادي من الموقع بإيميلك.
-- 2) بدّل الإيميل تحت بإيميلك وشغّل السطرين دول لوحدهم:
--
insert into public.admins (user_id)
 select id from auth.users where email = 'admin@adsocialdia.app'
 on conflict do nothing;
