'use strict';
/* =========================================================
   ميزات المنصة: المحتوى حسب المنصة (مربوط بالتقويم)، بروفايل الشركة والفريق،
   وباحث الهاشتاجات الرائجة. بيتحمّل بعد app.js وقبل site.js.
   ========================================================= */

/* ---------------- النصوص ---------------- */
Object.assign(T.ar, {
  f_time: 'الساعة', err_default: 'حصلت مشكلة، حاول تاني', ld_pay: 'طرق الدفع', pay_holder: 'باسم', pay_copy: 'نسخ الرقم', num_copied: 'اتنسخ الرقم', pay_send: 'ابعت إيصال التحويل', pay_wa_msg: 'حوّلت اشتراك {brand} وده إيصال التحويل. إيميل حسابي: ',
  nav_content: 'المحتوى', nav_trends: 'الهاشتاجات الرائجة', nav_profile: 'بروفايل الشركة',
  open_plat: 'فتح المنصة', hub_copy: 'نسخ الكابشن', hub_mark: 'تم النشر', hub_cal: 'التقويم',
  hub_sub: 'رتّب محتوى كل منصة وافتحها بضغطة واحدة. كل بوست هنا هو نفسه اللي في التقويم.',
  hub_all: 'كل المنصات', hub_planned: 'مخطط', hub_published: 'منشور', hub_clients: 'كل العملاء',
  hub_st_open: 'لسه ما اتنشرش', hub_st_pub: 'المنشور', hub_st_all: 'الكل',
  hub_late: 'متأخر ولسه ما اتنشرش', hub_today: 'النهارده', hub_week: 'خلال أسبوع', hub_later: 'بعد كده', hub_done: 'اتنشر',
  hub_none: 'مفيش بوستات هنا. ضيف بوست جديد وهيظهر هنا وفي التقويم.', hub_cal_btn: 'تقويم المحتوى',
  hub_opened: 'اتفتحت المنصة والكابشن اتنسخ. الصقه هناك.', hub_opened_x: 'اتفتح محرر X والكابشن جاهز فيه.', hub_marked: 'اتسجل كمنشور', hub_no_url: 'المنصة دي ملهاش رابط مباشر',
  prof_title: 'بيانات الشركة', prof_sub: 'الاسم بيظهر في الترحيب بلوحة التحكم.', prof_company: 'اسم الشركة', prof_desc: 'وصف الشركة', prof_loc: 'المكان', prof_email: 'الإيميل', prof_save: 'حفظ البيانات', prof_saved: 'اتحفظت بيانات الشركة',
  team_title: 'فريق العمل', team_sub: 'موظفين الشركة، وتقدر تكلمهم على واتساب بضغطة.', team_add: 'إضافة موظف', team_name: 'الاسم', team_role: 'الوظيفة', team_wa: 'رقم الواتساب',
  team_wa_hint: 'بالصيغة الدولية (201012345678) أو رقم مصري يبدأ بـ 01', team_none: 'لسه مفيش موظفين. ضيف أول واحد.', team_wa_btn: 'واتساب', team_bad_wa: 'رقم الواتساب مش صحيح', team_n: 'موظف',
  tr_sub: 'اختار الدولة والمجال، وهتلاقي الهاشتاجات اللي الناس بتدوّر عليها دلوقتي مع اقتراحات جاهزة للنسخ.',
  tr_country: 'الدولة', tr_niche: 'المجال', tr_custom: 'مجال تاني (اختياري)', tr_custom_ph: 'مثال: مغاسل سيارات', tr_platform: 'المنصة', tr_lang: 'لغة الهاشتاجات',
  tr_go: 'ابحث', tr_busy: 'جاري البحث…', tr_pop: 'الأكثر استخداماً', tr_all: 'كل الدول',
  tr_now: 'الناس بتدوّر عليه دلوقتي في {c}', tr_none_g: 'مفيش ترندات بحث متاحة للدولة دي حالياً.',
  tr_copy_all: 'نسخ الكل', tr_copy_sel: 'نسخ المحدد ({n})', tr_save: 'حفظ كبوست', tr_copied: 'اتنسخت الهاشتاجات', tr_clear: 'إلغاء التحديد',
  tr_open: 'افتح الهاشتاج على {p}', tr_empty: 'اختار الدولة والمجال واضغط ابحث.',
  trg_trending: 'ترند دلوقتي', trg_niche: 'متخصصة في مجالك', trg_broad: 'عامة وواسعة الانتشار', trg_local: 'محلية للبلد',
  tr_src_google: 'ترندات بحث حية من Google Trends', tr_src_ai: 'اقتراحات بالذكاء الاصطناعي', tr_src_local: 'قائمة جاهزة (السيرفر مش متصل أو المفتاح مش متضاف)',
  tr_note: 'الترند الحي مصدره عمليات البحث الحالية على Google Trends، والهاشتاجات المقترحة بيولّدها الذكاء الاصطناعي على أساسه. إنستجرام وتيك توك مبيوفروش أرقام الهاشتاجات مجاناً، فاتأكد من الشعبية بزر فتح الهاشتاج قبل ما تعتمد عليه.',
  tr_limit: 'وصلت للحد الساعي، جرّب بعد شوية', tr_err: 'حصلت مشكلة في البحث، اتعرضت قائمة جاهزة بدلها'
});
Object.assign(T.en, {
  f_time: 'Time', err_default: 'Something went wrong, try again', ld_pay: 'Payments', pay_holder: 'Account name', pay_copy: 'Copy number', num_copied: 'Number copied', pay_send: 'Send the transfer receipt', pay_wa_msg: 'I paid for {brand}, here is my transfer receipt. My account email: ',
  nav_content: 'Content', nav_trends: 'Trending hashtags', nav_profile: 'Company profile',
  open_plat: 'Open platform', hub_copy: 'Copy caption', hub_mark: 'Mark published', hub_cal: 'Calendar',
  hub_sub: 'Organise each platform’s content and open it in one click. Every post here is the same one in the calendar.',
  hub_all: 'All platforms', hub_planned: 'planned', hub_published: 'published', hub_clients: 'All clients',
  hub_st_open: 'Not published yet', hub_st_pub: 'Published', hub_st_all: 'All',
  hub_late: 'Overdue, not published', hub_today: 'Today', hub_week: 'Within a week', hub_later: 'Later', hub_done: 'Published',
  hub_none: 'No posts here. Add a post and it appears here and in the calendar.', hub_cal_btn: 'Content calendar',
  hub_opened: 'Platform opened and caption copied. Paste it there.', hub_opened_x: 'X composer opened with your caption.', hub_marked: 'Marked as published', hub_no_url: 'No direct link for this platform',
  prof_title: 'Company details', prof_sub: 'The name appears in your dashboard greeting.', prof_company: 'Company name', prof_desc: 'Description', prof_loc: 'Location', prof_email: 'Email', prof_save: 'Save details', prof_saved: 'Company details saved',
  team_title: 'Team', team_sub: 'Your company’s staff, one tap from a WhatsApp chat.', team_add: 'Add team member', team_name: 'Name', team_role: 'Job title', team_wa: 'WhatsApp number',
  team_wa_hint: 'International format (201012345678) or an Egyptian number starting with 01', team_none: 'No team members yet. Add the first one.', team_wa_btn: 'WhatsApp', team_bad_wa: 'Invalid WhatsApp number', team_n: 'members',
  tr_sub: 'Pick a country and a field to see what people are searching right now, plus ready-to-copy hashtag suggestions.',
  tr_country: 'Country', tr_niche: 'Field', tr_custom: 'Another field (optional)', tr_custom_ph: 'e.g. car washes', tr_platform: 'Platform', tr_lang: 'Hashtag language',
  tr_go: 'Search', tr_busy: 'Searching…', tr_pop: 'Most used', tr_all: 'All countries',
  tr_now: 'People are searching for this now in {c}', tr_none_g: 'No live search trends available for this country right now.',
  tr_copy_all: 'Copy all', tr_copy_sel: 'Copy selected ({n})', tr_save: 'Save as post', tr_copied: 'Hashtags copied', tr_clear: 'Clear selection',
  tr_open: 'Open hashtag on {p}', tr_empty: 'Choose a country and a field, then search.',
  trg_trending: 'Trending now', trg_niche: 'Specific to your field', trg_broad: 'Broad reach', trg_local: 'Local to the country',
  tr_src_google: 'Live search trends from Google Trends', tr_src_ai: 'AI suggestions', tr_src_local: 'Built-in list (server offline or no key set)',
  tr_note: 'Live trends come from current Google Trends searches, and the suggested hashtags are generated by AI on top of them. Instagram and TikTok offer no free hashtag volume data, so check popularity with the open-hashtag button before relying on one.',
  tr_limit: 'Hourly limit reached, try again later', tr_err: 'The search failed, showing a built-in list instead'
});

/* ---------------- المنصات ---------------- */
const PLAT_COLOR = { instagram: '#e1306c', facebook: '#1877f2', tiktok: '#111827', linkedin: '#0a66c2', x: '#111827', youtube: '#ff0000' };
const pkey = p => String(p || '').toLowerCase();
function platformUrl(p, caption) {
  const k = pkey(p);
  if (k === 'facebook') return 'https://business.facebook.com/latest/composer';
  if (k === 'instagram') return 'https://www.instagram.com/';
  if (k === 'tiktok') return 'https://www.tiktok.com/tiktokstudio/upload';
  if (k === 'linkedin') return 'https://www.linkedin.com/feed/';
  if (k === 'youtube') return 'https://studio.youtube.com/';
  if (k === 'x' || k === 'twitter') return 'https://x.com/intent/post?text=' + encodeURIComponent(String(caption || '').slice(0, 270));
  return '';
}
function hashtagUrl(p, tag) {
  const k = pkey(p), h = encodeURIComponent(String(tag).replace(/^#/, ''));
  if (k === 'instagram') return 'https://www.instagram.com/explore/tags/' + h + '/';
  if (k === 'tiktok') return 'https://www.tiktok.com/tag/' + h;
  if (k === 'facebook') return 'https://www.facebook.com/hashtag/' + h;
  if (k === 'linkedin') return 'https://www.linkedin.com/feed/hashtag/' + h + '/';
  if (k === 'youtube') return 'https://www.youtube.com/hashtag/' + h;
  if (k === 'x' || k === 'twitter') return 'https://x.com/hashtag/' + h;
  return '';
}
function copyText(txt) { try { if (navigator.clipboard) navigator.clipboard.writeText(txt).catch(() => {}); } catch (e) {} }
function openPlatform(p, caption) {
  const url = platformUrl(p, caption);
  if (!url) { toast(t('hub_no_url')); return; }
  if (caption && pkey(p) !== 'x') copyText(caption);
  try { window.open(url, '_blank', 'noopener'); } catch (e) {}
  toast(pkey(p) === 'x' ? t('hub_opened_x') : (caption ? t('hub_opened') : t('open_plat')));
}
const fullDate = s => new Date(s + 'T00:00').toLocaleDateString(loc(), { weekday: 'long', day: 'numeric', month: 'short' });
const platBadge = p => `<span class="pbadge" style="--c:${PLAT_COLOR[pkey(p)] || '#64748b'}">${platIc(p)}</span>`;

/* ---------------- فورم البوست ---------------- */
function postForm(p, dateDefault, captionDefault) {
  const isNew = !p;
  p = p || { client: '', platform: 'Instagram', date: dateDefault || dstr(new Date()), time: '', status: 'draft', caption: captionDefault || '' };
  const sts = ['draft', 'pending', 'approved', 'published'];
  if (!sts.includes(p.status)) sts.push(p.status);
  modal(isNew ? t('add_post') : t('edit'),
    sel('client', t('f_client'), clientOpts(), p.client) + sel('platform', t('f_platform'), PLATFORMS.map(x => [x, x]), p.platform) +
    fld('date', t('f_date'), p.date, 'date', 'required') + fld('time', t('f_time'), p.time || '', 'time') +
    sel('status', t('f_status'), sts.map(k => [k, t('ps_' + k)]), p.status, 'full') +
    area('caption', t('f_caption'), p.caption) +
    `<div class="full hp-formacts"><button type="button" class="btn sm primary" data-action="form-open">${ic('link')} ${t('open_plat')}</button><button type="button" class="btn sm" data-action="form-copy">${ic('copy')} ${t('hub_copy')}</button></div>`,
    d => {
      const rec = { client: d.client, platform: d.platform, date: d.date, time: d.time || '', status: d.status, caption: d.caption };
      if (isNew) S.posts.push({ id: uid(), ...rec }); else Object.assign(p, rec);
    },
    isNew ? null : () => { if (confirm(t('confirm'))) { S.posts = S.posts.filter(y => y.id !== p.id); closeModal(); save(); render(); } });
}
const formVal = n => { const el = $('#modal-body [name="' + n + '"]'); return el ? el.value : ''; };

/* ---------------- المحتوى حسب المنصة ---------------- */
let HUB = { plat: 'all', client: '', st: 'open' };
function hubCard(p) {
  const k = PLAT_COLOR[pkey(p.platform)] || '#64748b';
  const stt = p.status === 'published';
  return `<div class="card hpost" style="--c:${k}">
    ${platBadge(p.platform)}
    <div class="hp-main">
      <div class="hp-top"><b>${esc(p.platform)}</b>${chip(p.client)}<span class="post ${esc(p.status)}">${esc(t('ps_' + p.status))}</span></div>
      <div class="hp-cap">${esc((p.caption || '').slice(0, 160)) || '<span class="mut">—</span>'}</div>
      <small class="hp-when">${ic('clock')} ${esc(fullDate(p.date))}${p.time ? ' · <bdi dir="ltr">' + esc(p.time) + '</bdi>' : ''}</small>
    </div>
    <div class="hp-act">
      <button class="btn sm primary" data-action="open-post" data-id="${p.id}">${ic('link')} ${t('open_plat')}</button>
      <button class="btn sm ico" data-action="copy-post" data-id="${p.id}" title="${t('hub_copy')}" aria-label="${t('hub_copy')}">${ic('copy')}</button>
      ${stt ? '' : `<button class="btn sm ico ok" data-action="mark-pub" data-id="${p.id}" title="${t('hub_mark')}" aria-label="${t('hub_mark')}">${ic('check')}</button>`}
      <button class="btn sm ico" data-action="goto-cal" data-id="${p.id}" title="${t('hub_cal')}" aria-label="${t('hub_cal')}">${ic('calendar')}</button>
      <button class="btn sm ico" data-action="edit-post" data-id="${p.id}" title="${t('edit')}" aria-label="${t('edit')}">${ic('edit')}</button>
    </div></div>`;
}
VIEWS.content = function () {
  const today = dstr(new Date()), wk = inDays(7);
  const plats = PLATFORMS.filter(p => ['Facebook', 'Instagram', 'TikTok'].includes(p) || S.posts.some(x => x.platform === p));
  const cards = plats.map(p => {
    const mine = S.posts.filter(x => x.platform === p), pub = mine.filter(x => x.status === 'published').length;
    return `<div class="card hp-plat ${HUB.plat === p ? 'on' : ''}" style="--c:${PLAT_COLOR[pkey(p)] || '#64748b'}" data-action="hub-plat" data-id="${p}" role="button" tabindex="0">
      ${platBadge(p)}<div class="grow"><b>${p}</b><small>${(mine.length - pub).toLocaleString(loc())} ${t('hub_planned')} · ${pub.toLocaleString(loc())} ${t('hub_published')}</small></div>
      <button class="btn sm ico" data-action="open-plat" data-id="${p}" title="${t('open_plat')}" aria-label="${t('open_plat')} ${p}">${ic('link')}</button></div>`;
  }).join('');
  const list = S.posts.filter(x => (HUB.plat === 'all' || x.platform === HUB.plat) && (!HUB.client || x.client === HUB.client) &&
    (HUB.st === 'all' || (HUB.st === 'published') === (x.status === 'published')));
  const key = x => x.date + ' ' + (x.time || '00:00');
  const open = list.filter(x => x.status !== 'published').sort((a, b) => key(a) > key(b) ? 1 : -1);
  const done = list.filter(x => x.status === 'published').sort((a, b) => key(a) < key(b) ? 1 : -1);
  const groups = [
    ['hub_late', open.filter(x => x.date < today), 'bad'], ['hub_today', open.filter(x => x.date === today), 'brand'],
    ['hub_week', open.filter(x => x.date > today && x.date <= wk), ''], ['hub_later', open.filter(x => x.date > wk), ''], ['hub_done', done, 'ok']
  ].filter(g => g[1].length);
  const body = groups.length ? groups.map(([k, items, c]) => `<h4 class="hp-h ${c}">${t(k)} <span class="count">${items.length.toLocaleString(loc())}</span></h4><div class="hp-list">${items.map(hubCard).join('')}</div>`).join('')
    : `<div class="card"><div class="empty">${t('hub_none')}</div></div>`;
  const cl = sel('', '', [['', t('hub_clients')], ...S.clients.map(c => [c.id, c.name])], HUB.client).replace('<select name=""', '<select data-hub="client"');
  const st = sel('', '', [['open', t('hub_st_open')], ['published', t('hub_st_pub')], ['all', t('hub_st_all')]], HUB.st).replace('<select name=""', '<select data-hub="st"');
  return `<p class="sub">${t('hub_sub')}</p>
    <div class="bar"><button class="btn primary" data-action="add-post" data-id="${today}">${ic('plus')} ${t('add_post')}</button><button class="btn" data-action="go-cal">${ic('calendar')} ${t('hub_cal_btn')}</button></div>
    <div class="hp-plats">${cards}</div>
    <div class="hp-filters"><button class="tab ${HUB.plat === 'all' ? 'on' : ''}" data-action="hub-plat" data-id="all">${t('hub_all')}</button>${cl}${st}</div>
    ${body}`;
};

/* ---------------- بروفايل الشركة والفريق ---------------- */
const me = () => (S.profiles && S.profiles[0]) || { id: 'me', company: '', desc: '', location: '', team: [] };
function ensureMe() {
  if (!Array.isArray(S.profiles)) S.profiles = [];
  if (!S.profiles[0]) S.profiles.push({ id: 'me', company: '', desc: '', location: '', team: [] });
  if (!Array.isArray(S.profiles[0].team)) S.profiles[0].team = [];
  return S.profiles[0];
}
// بيحوّل الرقم لصيغة wa.me: أرقام عربية → إنجليزي، 01xxxxxxxxx → 201xxxxxxxxx، 00 أو + بتتشال
function waDigits(n) {
  let d = String(n || '').replace(/[٠-٩]/g, c => String(c.charCodeAt(0) - 1632)).replace(/[۰-۹]/g, c => String(c.charCodeAt(0) - 1776));
  d = d.replace(/[^\d]/g, '');
  if (String(n || '').trim().startsWith('+')) return d;
  if (d.startsWith('00')) d = d.slice(2);
  else if (/^01\d{9}$/.test(d)) d = '20' + d.slice(1);
  return /^\d{8,15}$/.test(d) ? d : '';
}
function memberForm(m) {
  let cur = m || null;                       // بعد أول حفظ ناجح بنكمل على نفس الموظف (مش بنكرره لو حصل خطأ في الحساب)
  const base = m || { name: '', role: '', wa: '' };
  const login = cur && STAFFROWS[cur.id] ? STAFFROWS[cur.id] : '';
  const canLogin = CLOUD && !isStaff();
  const loginBox = canLogin ? `<div class="full login-box"><h4>${ic('lock')} ${t('login_title')}</h4><p class="sub">${login ? t('login_have') : t('login_sub')}</p>
      <div class="form">${fld('username', t('auth_username'), login, 'text', 'autocomplete="off" autocapitalize="none" spellcheck="false" dir="ltr" maxlength="30" placeholder="ahmed.ali"')}
      <label class="f">${login ? t('login_newpass') : t('auth_pass')}<input name="password" type="text" autocomplete="off" spellcheck="false" dir="ltr" maxlength="72" placeholder="${t('login_pass_hint')}"></label></div></div>` : '';
  modal(m ? t('edit') : t('team_add'),
    fld('name', t('team_name'), base.name, 'text', 'required full') + fld('role', t('team_role'), base.role, 'text', 'full') +
    `<label class="f full">${t('team_wa')}<input name="wa" type="tel" dir="ltr" value="${esc(base.wa)}" placeholder="201012345678"><small class="mut">${t('team_wa_hint')}</small></label>` + loginBox,
    async d => {
      if (d.wa && !waDigits(d.wa)) throw new Error(t('team_bad_wa'));
      const rec = { name: d.name.trim(), role: d.role.trim(), wa: d.wa.trim() };
      const un = String(d.username || '').trim().toLowerCase(), pw = String(d.password || '').trim();
      if (canLogin && (un || pw)) {
        if (!/^[a-z0-9._-]{3,30}$/.test(un)) throw new Error(t('serr_username_invalid'));
        if (!login && !pw) throw new Error(t('serr_need_password'));
        if (pw && pw.length < 8) throw new Error(t('serr_weak_password'));
      }
      const p = ensureMe();
      if (!cur) { cur = { id: uid(), ...rec }; p.team.push(cur); } else Object.assign(cur, rec);
      if (canLogin && (un || pw)) {
        save(); await syncChain;                                  // الموظف لازم يكون اتحفظ في فريق الشركة الأول
        const r = await staffApi('save', { member_id: cur.id, username: un, password: pw });
        STAFFROWS[cur.id] = r.username;
        toast(t('login_saved').replace('{u}', r.username));
      }
    },
    m ? () => {
      if (!confirm(login ? t('login_confirm_del') : t('confirm'))) return;
      (async () => {
        try {
          if (STAFFROWS[m.id]) { await staffApi('remove', { member_id: m.id }); delete STAFFROWS[m.id]; }
          const p = ensureMe(); p.team = p.team.filter(x => x.id !== m.id); closeModal(); save(); render();
        } catch (e) { toast((e && e.message) || t('err_default')); }
      })();
    } : null);
}
VIEWS.profile = function () {
  const p = me(), team = p.team || [], ro = isStaff();
  const rows = team.map(m => {
    const d = waDigits(m.wa);
    return `<div class="row member"><span class="avatar sm">${esc((m.name || '?').trim().charAt(0).toUpperCase())}</span>
      <div class="grow"><b>${esc(m.name)}</b>${STAFFROWS[m.id] && !ro ? ` <span class="pill ok" title="${t('login_has')}">${ic('lock')} <bdi dir="ltr">${esc(STAFFROWS[m.id])}</bdi></span>` : ''}<br><small>${esc(m.role || '—')}${m.wa ? ` · <bdi dir="ltr">${esc(m.wa)}</bdi>` : ''}</small></div>
      ${d ? `<a class="btn sm wa" href="https://wa.me/${d}" target="_blank" rel="noopener">${ic('chat')} ${t('team_wa_btn')}</a>` : ''}
      ${ro ? '' : `<button class="btn sm ico" data-action="edit-member" data-id="${m.id}" title="${t('edit')}" aria-label="${t('edit')}">${ic('edit')}</button>`}</div>`;
  }).join('');
  return `<div class="two prof" style="align-items:start">
    <section class="card"><h3>${t('prof_title')}</h3><p class="sub">${t('prof_sub')}</p>
      <form id="prof-form" class="form" autocomplete="off">
        ${fld('company', t('prof_company'), p.company, 'text', 'full maxlength="80"' + (ro ? ' disabled' : ''))}
        ${fld('location', t('prof_loc'), p.location, 'text', 'full maxlength="120"' + (ro ? ' disabled' : ''))}
        <label class="f full">${t('prof_desc')}<textarea name="desc" maxlength="600"${ro ? ' disabled' : ''}>${esc(p.desc)}</textarea></label>
        ${user && user.email && !ro ? `<label class="f full">${t('prof_email')}<input value="${esc(user.email)}" dir="ltr" disabled></label>` : ''}
        ${ro ? '' : `<div class="full"><button class="btn primary" type="submit">${t('prof_save')}</button></div>`}
      </form></section>
    <section class="card"><h3>${t('team_title')} <span class="count">${team.length.toLocaleString(loc())}</span></h3><p class="sub">${t('team_sub')}</p>
      ${rows || `<div class="empty">${t('team_none')}</div>`}
      ${ro ? '' : `<div class="bar" style="margin:14px 0 0"><button class="btn primary" data-action="add-member">${ic('plus')} ${t('team_add')}</button></div>`}</section></div>`;
};

/* ---------------- باحث الهاشتاجات ---------------- */
const NICHES = [
  ['fashion', 'أزياء وموضة', 'Fashion', 'موضة,ستايل,ملابس', 'fashion,style,ootd'],
  ['beauty', 'تجميل وعناية', 'Beauty & skincare', 'مكياج,عناية_بالبشرة,جمال', 'beauty,skincare,makeup'],
  ['food', 'مطاعم وأكل', 'Food & restaurants', 'اكل,مطاعم,وصفات', 'foodie,restaurant,recipes'],
  ['cafe', 'كافيهات وقهوة', 'Cafes & coffee', 'قهوة,كافيه,مشروبات', 'coffee,cafe,latte'],
  ['real_estate', 'عقارات', 'Real estate', 'عقارات,شقق_للبيع,استثمار_عقاري', 'realestate,property,homesforsale'],
  ['health', 'طبي وصحة', 'Medical & health', 'صحة,طب,نصائح_طبية', 'health,wellness,doctor'],
  ['dental', 'أسنان', 'Dentistry', 'اسنان,طبيب_اسنان,ابتسامة', 'dentist,dental,smile'],
  ['fitness', 'لياقة وجيم', 'Fitness & gym', 'جيم,لياقة,تمارين', 'fitness,gym,workout'],
  ['tech', 'تكنولوجيا', 'Technology', 'تكنولوجيا,تقنية,موبايلات', 'tech,gadgets,innovation'],
  ['ecommerce', 'متاجر إلكترونية', 'E-commerce', 'تسوق_اونلاين,عروض,متجر_الكتروني', 'onlineshopping,ecommerce,sale'],
  ['education', 'تعليم وكورسات', 'Education & courses', 'تعليم,كورسات,تعلم', 'education,learning,onlinecourses'],
  ['auto', 'سيارات', 'Automotive', 'سيارات,عالم_السيارات,سيارات_للبيع', 'cars,automotive,carsofinstagram'],
  ['travel', 'سفر وسياحة', 'Travel & tourism', 'سفر,سياحة,رحلات', 'travel,wanderlust,vacation'],
  ['hotels', 'فنادق ومنتجعات', 'Hotels & resorts', 'فنادق,منتجعات,اجازة', 'hotel,resort,staycation'],
  ['finance', 'مال واستثمار', 'Finance & investing', 'استثمار,اقتصاد,ادارة_الاموال', 'investing,finance,money'],
  ['gaming', 'ألعاب', 'Gaming', 'العاب,جيمنج,بلايستيشن', 'gaming,gamer,esports'],
  ['entertainment', 'ترفيه وسينما', 'Entertainment', 'افلام,مسلسلات,ترفيه', 'movies,series,entertainment'],
  ['sports', 'رياضة', 'Sports', 'رياضة,كرة_القدم,مباريات', 'sports,football,match'],
  ['parenting', 'أمومة وأطفال', 'Parenting & kids', 'امومة,اطفال,تربية', 'parenting,kids,momlife'],
  ['home', 'ديكور ومنزل', 'Home & decor', 'ديكور,تصميم_داخلي,منزل', 'homedecor,interiordesign,home'],
  ['wedding', 'أفراح ومناسبات', 'Weddings & events', 'فرح,مناسبات,عروسة', 'wedding,bride,events'],
  ['photo', 'تصوير', 'Photography', 'تصوير,فوتوغرافيا,لقطات', 'photography,photooftheday,portrait'],
  ['marketing', 'تسويق وأعمال', 'Marketing & business', 'تسويق,ريادة_اعمال,بزنس', 'marketing,entrepreneur,smallbusiness'],
  ['legal', 'محاماة وقانون', 'Legal', 'قانون,محاماة,استشارات_قانونية', 'law,lawyer,legaladvice'],
  ['ngo', 'جمعيات ومبادرات', 'NGOs & charity', 'خير,تبرع,مبادرات', 'charity,donate,volunteer'],
  ['pets', 'حيوانات أليفة', 'Pets', 'حيوانات_اليفة,قطط,كلاب', 'pets,dogsofinstagram,catsofinstagram'],
  ['music', 'موسيقى', 'Music', 'موسيقى,اغاني,فنانين', 'music,newmusic,livemusic'],
  ['art', 'فن وتصميم', 'Art & design', 'فن,تصميم,جرافيك', 'art,design,graphicdesign'],
  ['jewelry', 'مجوهرات وإكسسوارات', 'Jewelry & accessories', 'مجوهرات,ذهب,اكسسوارات', 'jewelry,gold,accessories'],
  ['perfume', 'عطور', 'Perfumes', 'عطور,برفان,روائح', 'perfume,fragrance,scent'],
  ['construction', 'مقاولات وبناء', 'Construction', 'مقاولات,بناء,تشطيبات', 'construction,building,renovation'],
  ['jobs', 'وظائف وتوظيف', 'Jobs & hiring', 'وظائف,فرص_عمل,توظيف', 'jobs,hiring,careers'],
  ['agri', 'زراعة وغذاء', 'Agriculture', 'زراعة,مزارع,اغذية', 'farming,agriculture,organic'],
  ['news', 'أخبار ومحتوى عام', 'News & general', 'اخبار,معلومات,ثقافة', 'news,facts,trending']
];
const TOP_COUNTRIES = ['EG', 'SA', 'AE', 'KW', 'QA', 'BH', 'OM', 'JO', 'LB', 'IQ', 'MA', 'DZ', 'TN', 'LY', 'SD', 'PS', 'SY', 'YE', 'US', 'GB', 'FR', 'DE', 'TR', 'IN', 'BR'];
const COUNTRIES = ('AD AE AF AG AI AL AM AO AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GT GU GW GY HK HN HR HT HU ID IE IL IM IN IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW').split(' ');
let _dn = {};
function countryName(code) {
  try { const l = S.lang; _dn[l] = _dn[l] || new Intl.DisplayNames([l], { type: 'region' }); return _dn[l].of(code) || code; } catch (e) { return code; }
}
const TR_PLATS = [['instagram', 'Instagram'], ['tiktok', 'TikTok'], ['facebook', 'Facebook'], ['x', 'X'], ['linkedin', 'LinkedIn'], ['youtube', 'YouTube']];
let TR = { country: 'EG', niche: 'marketing', custom: '', platform: 'instagram', lang: 'ar', busy: false, res: null, note: '', sel: new Set() };
const cleanTag = s => String(s || '').replace(/^#+/, '').replace(/[\s\-.]+/g, '_').replace(/[^\p{L}\p{N}_]/gu, '').replace(/_+/g, '_').replace(/^_|_$/g, '').slice(0, 40);

// قائمة جاهزة لما السيرفر مش متاح: كلمات المجال + هاشتاجات المنصة المعروفة
const PLAT_TAGS = { instagram: ['reels', 'explore', 'instagood', 'instadaily'], tiktok: ['fyp', 'foryou', 'viral', 'trending'], facebook: ['facebookreels', 'viral', 'trending'], x: ['trending'], linkedin: ['linkedin', 'careers', 'leadership', 'business'], youtube: ['shorts', 'youtubeshorts', 'viral'] };
function localTrends() {
  const n = NICHES.find(x => x[0] === TR.niche), ar = TR.lang !== 'en';
  const kw = n ? (ar ? n[3] : n[4]).split(',') : [];
  const custom = cleanTag(TR.custom);
  return {
    country: TR.country, sources: ['local'], trending: [],
    groups: [
      { key: 'niche', tags: [...(custom ? [{ tag: custom }] : []), ...kw.map(tag => ({ tag }))] },
      { key: 'broad', tags: (PLAT_TAGS[TR.platform] || []).map(tag => ({ tag })) }
    ].filter(g => g.tags.length)
  };
}
async function trendsGo() {
  TR.busy = true; TR.note = ''; render();
  const n = NICHES.find(x => x[0] === TR.niche);
  const niche = TR.custom.trim() || (n ? n[2] : 'general');
  try {
    const headers = {};
    if (CLOUD && sb) { const { data } = await sb.auth.getSession(); if (data && data.session) headers.Authorization = 'Bearer ' + data.session.access_token; }
    const r = await fetch('/api/trends?' + new URLSearchParams({ country: TR.country, niche, platform: TR.platform, lang: TR.lang }), { headers });
    if (r.status === 429) { TR.res = localTrends(); TR.note = t('tr_limit'); }
    else if (!r.ok) throw new Error('x');
    else TR.res = await r.json();
  } catch (e) { TR.res = localTrends(); TR.note = t('tr_err'); }
  TR.sel = new Set(); TR.busy = false; render();
}
function trChip(tag, why) {
  const on = TR.sel.has(tag), u = hashtagUrl(TR.platform, tag);
  const pn = (TR_PLATS.find(x => x[0] === TR.platform) || [0, ''])[1];
  return `<span class="tagc ${on ? 'on' : ''}"><button type="button" class="tg" data-action="tr-pick" data-id="${esc(tag)}" ${why ? `title="${esc(why)}"` : ''}>#${esc(tag)}</button>${u ? `<a class="tg-go" href="${esc(u)}" target="_blank" rel="noopener" title="${esc(t('tr_open').replace('{p}', pn))}" aria-label="${esc(t('tr_open').replace('{p}', pn))}">${ic('link', 14)}</a>` : ''}</span>`;
}
VIEWS.trends = function () {
  const top = TOP_COUNTRIES.map(c => [c, countryName(c)]);
  const rest = COUNTRIES.filter(c => !TOP_COUNTRIES.includes(c)).map(c => [c, countryName(c)]).sort((a, b) => a[1].localeCompare(b[1], S.lang));
  const opt = ([c, n]) => `<option value="${c}" ${c === TR.country ? 'selected' : ''}>${esc(n)}</option>`;
  const nOpts = NICHES.map(n => `<option value="${n[0]}" ${n[0] === TR.niche ? 'selected' : ''}>${esc(S.lang === 'ar' ? n[1] : n[2])}</option>`).join('');
  const pOpts = TR_PLATS.map(([k, n]) => `<option value="${k}" ${k === TR.platform ? 'selected' : ''}>${n}</option>`).join('');
  const form = `<section class="card tr-form"><div class="form">
      <label class="f">${t('tr_country')}<select data-tr="country"><optgroup label="${t('tr_pop')}">${top.map(opt).join('')}</optgroup><optgroup label="${t('tr_all')}">${rest.map(opt).join('')}</optgroup></select></label>
      <label class="f">${t('tr_niche')}<select data-tr="niche">${nOpts}</select></label>
      <label class="f">${t('tr_custom')}<input data-tr="custom" value="${esc(TR.custom)}" placeholder="${t('tr_custom_ph')}" maxlength="60"></label>
      <label class="f">${t('tr_platform')}<select data-tr="platform">${pOpts}</select></label>
      <label class="f">${t('tr_lang')}<select data-tr="lang"><option value="ar" ${TR.lang === 'ar' ? 'selected' : ''}>${t('lang_ar')}</option><option value="en" ${TR.lang === 'en' ? 'selected' : ''}>${t('lang_en')}</option></select></label>
      <div class="f tr-go"><button class="btn primary" data-action="tr-go" ${TR.busy ? 'disabled' : ''}>${ic('search')} ${TR.busy ? t('tr_busy') : t('tr_go')}</button></div>
    </div></section>`;
  const r = TR.res;
  if (!r) return `<p class="sub">${t('tr_sub')}</p>${form}<div class="card"><div class="empty">${t('tr_empty')}</div></div><p class="mut tr-note">${t('tr_note')}</p>`;
  const srcs = r.sources || [], isLocal = srcs.includes('local');
  const cname = countryName(r.country || TR.country);
  const trending = (r.trending || []).length
    ? `<section class="card"><h3>${ic('flame')} ${t('tr_now').replace('{c}', esc(cname))}</h3><div class="tags">${r.trending.map(x => trChip(x.tag, x.topic + (x.traffic ? ' — ' + x.traffic : ''))).join('')}</div></section>`
    : (!isLocal ? `<section class="card"><h3>${ic('flame')} ${t('tr_now').replace('{c}', esc(cname))}</h3><div class="empty">${t('tr_none_g')}</div></section>` : '');
  const groups = (r.groups || []).map(g => `<section class="card"><h3>${ic('hash')} ${t('trg_' + g.key) === 'trg_' + g.key ? esc(g.key) : t('trg_' + g.key)}</h3><div class="tags">${g.tags.map(x => trChip(x.tag, x.why)).join('')}</div></section>`).join('');
  const nsel = TR.sel.size;
  return `<p class="sub">${t('tr_sub')}</p>${form}
    <div class="tr-meta">${srcs.map(k => `<span class="pill ${k === 'local' ? 'warn' : 'ok'}">${t('tr_src_' + k)}</span>`).join('')}${TR.note ? `<span class="pill warn">${esc(TR.note)}</span>` : ''}</div>
    <div class="bar tr-bar"><button class="btn" data-action="tr-copy">${ic('copy')} ${nsel ? t('tr_copy_sel').replace('{n}', nsel.toLocaleString(loc())) : t('tr_copy_all')}</button><button class="btn" data-action="tr-save">${ic('plus')} ${t('tr_save')}</button>${nsel ? `<button class="btn ghost" data-action="tr-clear">${t('tr_clear')}</button>` : ''}</div>
    ${trending}${groups}<p class="mut tr-note">${t('tr_note')}</p>`;
};
function trAllTags() {
  const r = TR.res; if (!r) return [];
  const all = [...(r.trending || []).map(x => x.tag), ...(r.groups || []).flatMap(g => g.tags.map(x => x.tag))];
  return [...new Set(all)];
}
const trChosen = () => (TR.sel.size ? [...TR.sel] : trAllTags()).map(x => '#' + x);

/* ---------------- الأحداث ---------------- */
Object.assign(ACTIONS, {
  'hub-plat'(id) { HUB.plat = id; render(); },
  'open-plat'(id) { openPlatform(id, ''); },
  'open-post'(id) { const p = S.posts.find(x => x.id === id); if (p) openPlatform(p.platform, p.caption); },
  'copy-post'(id) { const p = S.posts.find(x => x.id === id); if (p) { copyText(p.caption || ''); toast(t('copied')); } },
  'mark-pub'(id) { const p = S.posts.find(x => x.id === id); if (p) { p.status = 'published'; save(); render(); toast(t('hub_marked')); } },
  'goto-cal'(id) { const p = S.posts.find(x => x.id === id); if (p) { const d = new Date(p.date + 'T00:00'); cal.y = d.getFullYear(); cal.m = d.getMonth(); } go('calendar'); },
  'go-cal'() { go('calendar'); },
  'go-content'() { go('content'); },
  'form-open'() { openPlatform(formVal('platform'), formVal('caption')); },
  'form-copy'() { copyText(formVal('caption')); toast(t('copied')); },
  'add-member'() { memberForm(); },
  'edit-member'(id) { const m = (me().team || []).find(x => x.id === id); if (m) memberForm(m); },
  'tr-go'() { trendsGo(); },
  'tr-pick'(id) { if (TR.sel.has(id)) TR.sel.delete(id); else TR.sel.add(id); render(); },
  'tr-clear'() { TR.sel = new Set(); render(); },
  'tr-copy'() { const tg = trChosen(); if (tg.length) { copyText(tg.join(' ')); toast(t('tr_copied')); } },
  'tr-save'() { const tg = trChosen(); if (tg.length) postForm(null, dstr(new Date()), tg.join(' ')); }
});
document.addEventListener('change', e => {
  const el = e.target, d = el && el.dataset;
  if (!d) return;
  if (d.hub) { HUB[d.hub] = el.value; render(); }
  if (d.tr) { TR[d.tr] = el.value; }
});
document.addEventListener('input', e => { const d = e.target && e.target.dataset; if (d && d.tr === 'custom') TR.custom = e.target.value; });
document.addEventListener('keydown', e => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target && e.target.dataset && e.target.dataset.action === 'hub-plat') { e.preventDefault(); HUB.plat = e.target.dataset.id; render(); }
});
document.addEventListener('submit', e => {
  if (!e.target || e.target.id !== 'prof-form') return;
  e.preventDefault();
  const f = Object.fromEntries(new FormData(e.target));
  const p = ensureMe();
  p.company = String(f.company || '').trim(); p.location = String(f.location || '').trim(); p.desc = String(f.desc || '').trim();
  save(); render(); toast(t('prof_saved'));
});
