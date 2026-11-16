'use strict';
/* =========================================================
   Socialdia Nexus — منصة لإدارة وكالات التسويق
   وضعين: سحابي (Supabase، لو config.js متعبّي) أو محلي في المتصفح.
   ========================================================= */
const KEY = 'nexus_v1';
const OLD_KEY = 'agencyhub_v1';
const LANG_KEY = 'nexus_lang';
const CFG = (typeof window !== 'undefined' && window.NEXUS_CONFIG) || {};
const CLOUD = !!(CFG.supabaseUrl && CFG.supabaseAnonKey && typeof window !== 'undefined' && window.supabase);
if (CFG.supabaseUrl && !CLOUD) console.warn('Supabase config found but the supabase-js library did not load; running in local mode.');
const TABLES = ['clients', 'tasks', 'posts', 'profiles'];
// ألوان العملاء: من ألوان لوجو Socialdia Nexus
const COLORS = ['#f40268', '#05c7ea', '#f59e0b', '#2e9a02', '#f01ddc', '#7c3aed', '#ff6b35'];
const PLATFORMS = ['Instagram', 'Facebook', 'TikTok', 'LinkedIn', 'X', 'YouTube'];

const $ = (s, r = document) => r.querySelector(s);
const uid = () => Math.random().toString(36).slice(2, 10);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------------- الترجمة ---------------- */
const T = {
  ar: {
    nav_dashboard: 'لوحة التحكم', nav_clients: 'العملاء', nav_tasks: 'المهام', nav_calendar: 'تقويم المحتوى', nav_ai: 'أدوات AI', nav_settings: 'الإعدادات',
    cur: 'ج.م', stat_clients: 'العملاء', stat_mrr: 'الإيراد الشهري', stat_open: 'مهام مفتوحة', stat_posts: 'بوستات الشهر',
    upcoming_tasks: 'أقرب المهام', upcoming_posts: 'أقرب البوستات', empty: 'لسه مفيش حاجة هنا',
    add_client: 'عميل جديد', add_task: 'مهمة جديدة', add_post: 'بوست جديد', edit: 'تعديل', del: 'حذف', save: 'حفظ', cancel: 'إلغاء', next: 'نقل للخطوة الجاية',
    f_name: 'اسم العميل', f_industry: 'المجال', f_fee: 'الاشتراك الشهري', f_contact: 'التواصل', f_title: 'العنوان', f_client: 'العميل',
    f_due: 'الموعد', f_pri: 'الأولوية', f_status: 'الحالة', f_platform: 'المنصة', f_date: 'التاريخ', f_caption: 'نص البوست', no_client: 'بدون عميل',
    pri_low: 'عادية', pri_med: 'متوسطة', pri_high: 'عاجلة', st_todo: 'للتنفيذ', st_doing: 'قيد التنفيذ', st_done: 'تم',
    ps_draft: 'مسودة', ps_pending: 'بانتظار الموافقة', ps_approved: 'معتمد', ps_published: 'منشور',
    tasks_n: 'مهام', posts_n: 'بوستات', confirm: 'متأكد من الحذف؟',
    ai_title: 'مساعد المحتوى الذكي', ai_tool: 'نوع المحتوى', tool_caption: 'كابشن سوشيال', tool_ad: 'إعلان مدفوع', tool_script: 'سكريبت فيديو',
    tool_ideas: 'أفكار محتوى', tool_brief: 'بريف حملة', ai_client: 'العميل', ai_tone: 'نبرة البراند', ai_tone_ph: 'مثال: ودودة، شبابية، فخمة',
    ai_topic: 'الموضوع / المنتج', ai_topic_ph: 'مثال: عرض الصيف على الوجبات العائلية', ai_lang: 'لغة الناتج', lang_ar: 'عربي (مصري)', lang_en: 'English',
    ai_gen: 'ولّد', ai_busy: 'جاري التوليد...', ai_out: 'الناتج', ai_copy: 'نسخ', ai_save: 'احفظ كبوست في التقويم',
    ai_demo: 'ده ناتج تجريبي من قوالب جاهزة. أضف مفتاح AI على Vercel عشان تاخد نتائج حقيقية.', ai_need_topic: 'اكتب الموضوع الأول', copied: 'تم النسخ ✓',
    set_data: 'بياناتك', set_note: 'البيانات محفوظة في متصفحك فقط. لتشغيلها فعلياً مع عملاء وفرق، اربطها بقاعدة بيانات (Supabase).',
    export: 'تصدير نسخة احتياطية', import: 'استيراد نسخة', clear: 'مسح كل البيانات', cleared: 'تم المسح', imported: 'تم الاستيراد ✓', bad_file: 'ملف غير صالح',
    foot: 'نسخة MVP', hi: 'نظرة سريعة على وكالتك',
    tagline: 'منصة إدارة وكالات التسويق', auth_login: 'تسجيل الدخول', auth_signup: 'إنشاء حساب', auth_email: 'البريد الإلكتروني', auth_pass: 'كلمة المرور',
    auth_to_signup: 'مفيش عندك حساب؟ أنشئ حساب', auth_to_login: 'عندك حساب؟ سجّل دخول', auth_check_mail: 'تم إنشاء الحساب. افتح بريدك واضغط على رابط التأكيد، وبعدها سجّل دخول.',
    auth_err: 'حصل خطأ، حاول تاني', logout: 'خروج', sync_err: 'تعذّر الحفظ على السحابة، هنحاول تاني مع أول تعديل', ai_limit: 'وصلت للحد الأقصى من التوليد في الساعة، حاول بعد شوية', cloud_on: 'الحفظ السحابي شغّال: بياناتك محفوظة على حسابك.',
    nav_site: 'إدارة الموقع', nav_home: 'الصفحة الرئيسية', ld_features: 'المميزات', ld_how: 'كيف يعمل', ld_plans: 'الباقات', ld_faq: 'الأسئلة', ld_contact: 'تواصل',
    open_app: 'لوحة التحكم', per_month: 'شهرياً', popular: 'الأكثر طلباً', subscribe: 'اشترك الآن', wa_msg: 'أرغب في الاشتراك في باقة {plan} على {brand}',
    whatsapp: 'واتساب',
    good_am: 'صباح الخير', good_pm: 'مساء الخير', late_n: 'عندك {n} مهام متأخرة محتاجة متابعة', all_good: 'مفيش مهام متأخرة، كمّل',
    task_status: 'حالة المهام', post_status: 'حالة البوستات', done_rate: 'نسبة الإنجاز', no_tasks: 'لسه مفيش مهام', no_posts: 'لسه مفيش بوستات',
    
    
    
    
    
    
    ps_scheduled: 'مجدول', ps_publishing: 'جاري النشر', ps_failed: 'فشل',
    
    
    
    wait_sync: 'جاري الحفظ…',
    mk_done: 'تم اعتماد البوست', mk_ai: 'كابشن جاهز في ثواني', ld_platforms: 'نظّم محتوى كل منصاتك في تقويم واحد',
    limit_reached: 'وصلت للحد الأقصى من العملاء في باقتك. تواصل معنا للترقية.', suspended_err: 'الحساب موقوف حالياً.',
    plan_label: 'الباقة', no_plan: 'بدون اشتراك', role_admin: 'أدمن', unlimited: 'غير محدود', clients_usage: 'العملاء',
    up_to_clients: 'حتى {n} عميل', unlimited_clients: 'عملاء غير محدودين',
    blocked_title: 'الحساب موقوف', blocked_text: 'تم إيقاف حسابك مؤقتاً. تواصل معنا لإعادة التفعيل.', rights: 'جميع الحقوق محفوظة', back_home: 'الصفحة الرئيسية', saved: 'تم الحفظ ✓', site_save_err: 'تعذّر الحفظ. تأكد إنك أدمن وإنك شغّلت schema.sql في Supabase.'
  },
  en: {
    nav_dashboard: 'Dashboard', nav_clients: 'Clients', nav_tasks: 'Tasks', nav_calendar: 'Content Calendar', nav_ai: 'AI Tools', nav_settings: 'Settings',
    cur: 'EGP', stat_clients: 'Clients', stat_mrr: 'Monthly revenue', stat_open: 'Open tasks', stat_posts: 'Posts this month',
    upcoming_tasks: 'Upcoming tasks', upcoming_posts: 'Upcoming posts', empty: 'Nothing here yet',
    add_client: 'New client', add_task: 'New task', add_post: 'New post', edit: 'Edit', del: 'Delete', save: 'Save', cancel: 'Cancel', next: 'Move to next stage',
    f_name: 'Client name', f_industry: 'Industry', f_fee: 'Monthly retainer', f_contact: 'Contact', f_title: 'Title', f_client: 'Client',
    f_due: 'Due date', f_pri: 'Priority', f_status: 'Status', f_platform: 'Platform', f_date: 'Date', f_caption: 'Post copy', no_client: 'No client',
    pri_low: 'Low', pri_med: 'Medium', pri_high: 'Urgent', st_todo: 'To do', st_doing: 'In progress', st_done: 'Done',
    ps_draft: 'Draft', ps_pending: 'Pending approval', ps_approved: 'Approved', ps_published: 'Published',
    tasks_n: 'tasks', posts_n: 'posts', confirm: 'Delete this item?',
    ai_title: 'Smart content assistant', ai_tool: 'Content type', tool_caption: 'Social caption', tool_ad: 'Paid ad', tool_script: 'Video script',
    tool_ideas: 'Content ideas', tool_brief: 'Campaign brief', ai_client: 'Client', ai_tone: 'Brand tone', ai_tone_ph: 'e.g. friendly, youthful, premium',
    ai_topic: 'Topic / product', ai_topic_ph: 'e.g. Summer offer on family meals', ai_lang: 'Output language', lang_ar: 'Arabic (Egyptian)', lang_en: 'English',
    ai_gen: 'Generate', ai_busy: 'Generating...', ai_out: 'Result', ai_copy: 'Copy', ai_save: 'Save as post in calendar',
    ai_demo: 'Demo output from built-in templates. Add an AI key on Vercel for real results.', ai_need_topic: 'Enter a topic first', copied: 'Copied ✓',
    set_data: 'Your data', set_note: 'Data is stored in your browser only. To run it with real clients and teams, connect a database (Supabase).',
    export: 'Export backup', import: 'Import backup', clear: 'Clear all data', cleared: 'Cleared', imported: 'Imported ✓', bad_file: 'Invalid file',
    foot: 'MVP build', hi: 'A quick look at your agency',
    tagline: 'Marketing agency OS', auth_login: 'Sign in', auth_signup: 'Create account', auth_email: 'Email', auth_pass: 'Password',
    auth_to_signup: "No account? Create one", auth_to_login: 'Have an account? Sign in', auth_check_mail: 'Account created. Open your email, click the confirmation link, then sign in.',
    auth_err: 'Something went wrong, try again', logout: 'Sign out', sync_err: "Couldn't save to the cloud; we'll retry on your next change", ai_limit: 'Hourly generation limit reached, try again later', cloud_on: 'Cloud saving is on: your data is stored on your account.',
    nav_site: 'Site admin', nav_home: 'Home page', ld_features: 'Features', ld_how: 'How it works', ld_plans: 'Plans', ld_faq: 'FAQ', ld_contact: 'Contact',
    open_app: 'Dashboard', per_month: 'month', popular: 'Most popular', subscribe: 'Subscribe', wa_msg: 'I would like to subscribe to the {plan} plan on {brand}',
    whatsapp: 'WhatsApp',
    good_am: 'Good morning', good_pm: 'Good evening', late_n: 'You have {n} overdue tasks to follow up', all_good: 'Nothing overdue, keep going',
    task_status: 'Task status', post_status: 'Post status', done_rate: 'Completion rate', no_tasks: 'No tasks yet', no_posts: 'No posts yet',
    
    
    
    
    
    
    ps_scheduled: 'Scheduled', ps_publishing: 'Publishing', ps_failed: 'Failed',
    
    
    
    wait_sync: 'Saving…',
    mk_done: 'Post approved', mk_ai: 'Caption ready in seconds', ld_platforms: 'Plan content for every platform in one calendar',
    limit_reached: 'You reached the client limit of your plan. Contact us to upgrade.', suspended_err: 'This account is suspended.',
    plan_label: 'Plan', no_plan: 'No subscription', role_admin: 'Admin', unlimited: 'Unlimited', clients_usage: 'Clients',
    up_to_clients: 'Up to {n} clients', unlimited_clients: 'Unlimited clients',
    blocked_title: 'Account suspended', blocked_text: 'Your account is temporarily suspended. Contact us to reactivate it.', rights: 'All rights reserved', back_home: 'Home page', saved: 'Saved ✓', site_save_err: "Couldn't save. Make sure you are an admin and that you ran schema.sql in Supabase."
  }
};

/* ---------------- الحالة ---------------- */
const savedLang = () => { try { return localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'ar'; } catch (e) { return 'ar'; } };
const emptyState = lang => ({ lang, clients: [], tasks: [], posts: [], profiles: [] });
let S = CLOUD ? emptyState(savedLang()) : load();
let sb = null, user = null, booting = CLOUD, authMode = 'login';
let SUB = null; // اشتراك المستخدم الحالي (من جدول subscriptions)
let isAdmin = !CLOUD; // في الوضع المحلي (تجربة) صاحب الجهاز هو الأدمن
let synced = { clients: {}, tasks: {}, posts: {}, profiles: {} };
let syncChain = Promise.resolve();
let route = 'dashboard', lastView = '';
let cal = { y: new Date().getFullYear(), m: new Date().getMonth() };
let AI = { tool: 'caption', client: '', tone: '', topic: '', lang: 'ar', out: '', note: '', busy: false };
let modalDelete = null;

function dstr(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
function inDays(n) { const d = new Date(); d.setDate(d.getDate() + n); return dstr(d); }

function seed() {
  const c = [
    { id: uid(), name: 'مطعم نكهة', industry: 'مطاعم', fee: 4500, contact: '0100 000 0001', color: COLORS[1] },
    { id: uid(), name: 'عيادة لمسة', industry: 'طبي', fee: 6000, contact: '0100 000 0002', color: COLORS[2] },
    { id: uid(), name: 'براند ستايل', industry: 'أزياء', fee: 5500, contact: '0100 000 0003', color: COLORS[0] }
  ];
  return {
    lang: 'ar', profiles: [], clients: c,
    tasks: [
      { id: uid(), title: 'تصميم بوستات أسبوع رمضان', client: c[0].id, due: inDays(2), priority: 'high', status: 'doing' },
      { id: uid(), title: 'سكريبت ريل عن الخدمات', client: c[1].id, due: inDays(4), priority: 'med', status: 'todo' },
      { id: uid(), title: 'تقرير أداء الشهر', client: c[2].id, due: inDays(-1), priority: 'med', status: 'todo' },
      { id: uid(), title: 'إعداد حملة إعلانية', client: c[2].id, due: inDays(7), priority: 'low', status: 'done' }
    ],
    posts: [
      { id: uid(), client: c[0].id, platform: 'Instagram', date: inDays(1), status: 'approved', caption: 'عرض الويك إند 🍔' },
      { id: uid(), client: c[1].id, platform: 'Facebook', date: inDays(3), status: 'pending', caption: 'نصيحة اليوم من الدكتور' },
      { id: uid(), client: c[2].id, platform: 'TikTok', date: inDays(5), status: 'draft', caption: 'كولكشن الشتا وصل' }
    ]
  };
}
function load() {
  for (const k of [KEY, OLD_KEY]) {
    try { const d = JSON.parse(localStorage.getItem(k)); if (d && Array.isArray(d.clients)) { if (!Array.isArray(d.profiles)) d.profiles = []; return d; } } catch (e) {}
  }
  return seed();
}
function save() {
  try {
    localStorage.setItem(LANG_KEY, S.lang);
    if (!CLOUD) localStorage.setItem(KEY, JSON.stringify(S)); // في الوضع السحابي مبنخزنش بيانات العملاء في المتصفح
  } catch (e) {}
  if (CLOUD && user) queueSync();
}

/* ---------------- المزامنة مع Supabase ---------------- */
// كل جدول: owner (uuid) + id + data (jsonb). الأمان عن طريق RLS في schema.sql.
async function pushCloud() {
  if (!sb || !user) return;
  for (const tb of TABLES) {
    const cur = {};
    S[tb].forEach(x => { cur[x.id] = JSON.stringify(x); });
    const up = S[tb].filter(x => synced[tb][x.id] !== cur[x.id]);
    const del = Object.keys(synced[tb]).filter(id => !(id in cur));
    if (up.length) {
      const now = new Date().toISOString();
      const { error } = await sb.from(tb).upsert(up.map(x => ({ owner: user.id, id: x.id, data: x, updated_at: now })), { onConflict: 'owner,id' });
      if (error) throw error;
      up.forEach(x => { synced[tb][x.id] = cur[x.id]; });
    }
    if (del.length) {
      const { error } = await sb.from(tb).delete().eq('owner', user.id).in('id', del);
      if (error) throw error;
      del.forEach(id => { delete synced[tb][id]; });
    }
  }
}
function queueSync() {
  syncChain = syncChain.then(pushCloud).catch(async e => {
    const m = String((e && e.message) || '');
    if (m.includes('client_limit_reached') || m.includes('account_suspended')) {
      toast(t(m.includes('account_suspended') ? 'suspended_err' : 'limit_reached'));
      try { await pullCloud(); } catch (_) {}   // نرجّع الحالة زي ما هي على السيرفر
      render();
    } else toast(t('sync_err'));
  });
  return syncChain;
}
async function pullCloud() {
  const out = emptyState(S.lang);
  const map = { clients: {}, tasks: {}, posts: {}, profiles: {} };
  for (const tb of TABLES) {
    const { data, error } = await sb.from(tb).select('id,data').eq('owner', user.id).limit(5000);
    if (error) throw error;
    out[tb] = (data || []).map(r => ({ ...r.data, id: r.id }));
    out[tb].forEach(x => { map[tb][x.id] = JSON.stringify(x); });
  }
  S = out; synced = map;
  try {
    const r = await sb.from('subscriptions').select('plan_id,status,max_clients,expires_at').eq('user_id', user.id).maybeSingle();
    SUB = r.error ? null : r.data;
  } catch (e) { SUB = null; }
}
function resetState() { SUB = null; S = emptyState(S.lang); synced = { clients: {}, tasks: {}, posts: {}, profiles: {} }; }
/* ---------------- الاشتراك والحدود ---------------- */
const subActive = () => !!SUB && SUB.status === 'active' && (!SUB.expires_at || new Date(SUB.expires_at) > new Date());
const isSuspended = () => CLOUD && !isAdmin && !!SUB && SUB.status === 'suspended';
// null = بلا حد
function clientLimit() {
  if (!CLOUD || isAdmin) return null;
  if (subActive()) return SUB.max_clients == null ? null : SUB.max_clients;
  const f = SITE.options && SITE.options.free_max_clients;
  const n = typeof f === 'number' ? f : 3;
  return n === 0 ? null : n;
}
const atLimit = () => { const l = clientLimit(); return l !== null && S.clients.length >= l; };
function planLine() {
  if (!CLOUD || !user) return '';
  const p = subActive() ? (SITE.plans || []).find(x => x.id === SUB.plan_id) : null;
  const name = isAdmin ? t('role_admin') : subActive() ? (p ? tx(p, 'name') : SUB.plan_id) : t('no_plan');
  const l = clientLimit(), n = S.clients.length.toLocaleString(loc());
  return `<div class="planline"><span>${t('plan_label')}: <b>${esc(name)}</b></span><span>${t('clients_usage')}: ${n} / ${l === null ? '∞' : l.toLocaleString(loc())}</span></div>`;
}
function renderBlocked() {
  const wa = String((SITE.contact || {}).whatsapp || '').replace(/\D/g, '');
  $('#auth').innerHTML = `<div class="auth-card"><div class="logo">${brandLockup()}</div>
    <h2>${t('blocked_title')}</h2><p class="auth-sub">${t('blocked_text')}</p>
    ${wa ? `<a class="btn primary" target="_blank" rel="noopener" href="https://wa.me/${wa}">${t('whatsapp')}</a>` : ''}
    <button type="button" class="btn ghost" data-action="logout">${t('logout')}</button></div>`;
}
// الأدمن = مستخدم موجود في جدول admins (بيتضاف من SQL Editor، شوف schema.sql)
async function checkAdmin() {
  const { data, error } = await sb.from('admins').select('user_id').eq('user_id', user.id).maybeSingle();
  return !error && !!data;
}
function bootCloud() {
  sb = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey);
  loadSiteCloud(); // محتوى الموقع العام (متاح للزوار قبل تسجيل الدخول)
  // مهم: مفيش نداء مباشر لـ Supabase جوه الـ callback نفسه، عشان كده setTimeout
  sb.auth.onAuthStateChange((ev, session) => {
    const u = (session && session.user) || null;
    setTimeout(async () => {
      if (u && (!user || user.id !== u.id)) {
        user = u;
        try { await pullCloud(); } catch (e) { toast(t('sync_err')); }
        try { isAdmin = await checkAdmin(); } catch (e) { isAdmin = false; }
        booting = false;
        if (route === 'login') go('dashboard'); else render();
      } else if (!u) {
        const was = user; user = null; isAdmin = false; booting = false;
        if (was) { resetState(); go('home'); } else render();
      }
    }, 0);
  });
}

/* ---------------- التنقل ---------------- */
// home / login صفحات عامة، والباقي (VIEWS) جوه التطبيق
function readRoute() {
  const r = location.hash.slice(1).replace(/^\//, '');
  route = (r === 'home' || r === 'login' || VIEWS[r]) ? r : (CLOUD && user ? 'dashboard' : 'home');
}
function go(r) {
  route = r;
  if (location.hash.slice(1) !== r) location.hash = r;
  render();
  if (window.scrollTo) window.scrollTo(0, 0);
}

const t = k => (T[S.lang] || T.ar)[k] ?? k;
const loc = () => (S.lang === 'ar' ? 'ar-EG' : 'en-US');
const money = n => Number(n || 0).toLocaleString(loc()) + ' ' + t('cur');
const fmtDate = s => new Date(s + 'T00:00').toLocaleDateString(loc(), { day: 'numeric', month: 'short' });
const client = id => S.clients.find(c => c.id === id);

/* ---------------- مكونات صغيرة ---------------- */
const chip = id => { const c = client(id); return c ? `<span class="chip" style="--c:${c.color}">${esc(c.name)}</span>` : ''; };
const stat = (ic, label, val, c = '--brand', n = null, suf = '') => `<div class="card stat" style="--c:var(${c})"><div class="ic">${ic}</div><div><b${n === null ? '' : ` data-n="${n}" data-suf="${esc(suf)}"`}>${esc(val)}</b><span>${esc(label)}</span></div></div>`;
const empty = () => `<div class="empty">${t('empty')}</div>`;
const fld = (name, label, val = '', type = 'text', extra = '') => `<label class="f ${extra.includes('full') ? 'full' : ''}">${label}<input name="${name}" type="${type}" value="${esc(val)}" ${extra.replace('full', '')}></label>`;
const area = (name, label, val = '') => `<label class="f full">${label}<textarea name="${name}">${esc(val)}</textarea></label>`;
const sel = (name, label, opts, val, extra = '') => `<label class="f ${extra}">${label}<select name="${name}">${opts.map(([v, l]) => `<option value="${esc(v)}" ${String(v) === String(val) ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select></label>`;
const clientOpts = (withNone = true) => [...(withNone ? [['', t('no_client')]] : []), ...S.clients.map(c => [c.id, c.name])];

/* ---------------- الواجهات ---------------- */
const VIEWS = {
  dashboard() {
    const today = dstr(new Date());
    const open = S.tasks.filter(x => x.status !== 'done');
    const mrr = S.clients.reduce((a, c) => a + (+c.fee || 0), 0);
    const pm = S.posts.filter(p => p.date.startsWith(today.slice(0, 7))).length;
    const tasks = [...open].sort((a, b) => (a.due || '9999') > (b.due || '9999') ? 1 : -1).slice(0, 5);
    const posts = S.posts.filter(p => p.date >= today).sort((a, b) => a.date > b.date ? 1 : -1).slice(0, 5);
    const total = S.tasks.length, done = total - open.length, pct = total ? Math.round(done / total * 100) : 0;
    const late = open.filter(x => x.due && x.due < today).length;
    const co = (typeof me === 'function' ? me().company : '') || '';
    const name = co.trim() || (user && user.email ? user.email.split('@')[0] : '');
    const greet = new Date().getHours() < 12 ? t('good_am') : t('good_pm');
    const dateStr = new Date().toLocaleDateString(loc(), { weekday: 'long', day: 'numeric', month: 'long' });
    const seg = (items) => { const n = items.reduce((a, x) => a + x[1], 0); return n ? `<div class="seg">${items.map(([k, v, c]) => v ? `<i style="--v:${v};--c:${c}" title="${esc(k)}: ${v}"></i>` : '').join('')}</div>` : ''; };
    const leg = items => `<div class="leg">${items.map(([k, v, c]) => `<span><i style="background:${c}"></i>${esc(k)} <b>${v.toLocaleString(loc())}</b></span>`).join('')}</div>`;
    const tItems = ['todo', 'doing', 'done'].map((k, i) => [t('st_' + k), S.tasks.filter(x => x.status === k).length, ['var(--acc)', 'var(--sec)', 'var(--ok)'][i]]);
    const pItems = ['draft', 'pending', 'approved', 'published'].map((k, i) => [t('ps_' + k), S.posts.filter(x => x.status === k).length, ['#9ca3af', 'var(--acc)', 'var(--sec)', 'var(--ok)'][i]]);
    return `<section class="dash-hero">
        <div class="aurora" aria-hidden="true"><i></i><i></i></div>
        <div class="dh-text"><small>${esc(dateStr)}</small><h2>${greet}${name ? '، ' + esc(name) : ''}</h2><p>${late ? t('late_n').replace('{n}', late.toLocaleString(loc())) : t('all_good')}</p></div>
        <div class="dh-acts"><button class="btn primary" data-action="add-client">${ic('plus')} ${t('add_client')}</button><button class="btn glass" data-action="add-task">${ic('plus')} ${t('add_task')}</button><button class="btn glass" data-action="add-post">${ic('plus')} ${t('add_post')}</button></div>
      </section>
      <div class="stats">${stat(ic('users'), t('stat_clients'), S.clients.length.toLocaleString(loc()), '--brand', S.clients.length)}${stat(ic('cash'), t('stat_mrr'), money(mrr), '--ok', mrr, ' ' + t('cur'))}${stat(ic('tasks'), t('stat_open'), open.length.toLocaleString(loc()), '--sec', open.length)}${stat(ic('calendar'), t('stat_posts'), pm.toLocaleString(loc()), '--acc', pm)}</div>
      <div class="two ovw">
        <section class="card"><h3>${t('task_status')}</h3>${total ? `<div class="ovw-body"><div class="ring" style="--p:${pct}"><b><bdi dir="ltr" data-n="${pct}" data-suf="%">${pct.toLocaleString(loc())}%</bdi></b><small>${t('done_rate')}</small></div><div class="ovw-side">${seg(tItems)}${leg(tItems)}</div></div>` : `<div class="empty">${t('no_tasks')}</div>`}</section>
        <section class="card"><h3>${t('post_status')}</h3>${S.posts.length ? `<div class="ovw-side wide">${seg(pItems)}${leg(pItems)}</div>` : `<div class="empty">${t('no_posts')}</div>`}</section>
      </div>
      <div class="two">
        <section class="card"><h3>${t('upcoming_tasks')}</h3>${tasks.length ? tasks.map(x => `<div class="row"><div class="grow"><b>${esc(x.title)}</b><br><small class="${x.due && x.due < today ? 'late' : ''}">${x.due ? ic('clock') + ' ' + fmtDate(x.due) : ''}</small></div>${chip(x.client)}</div>`).join('') : empty()}</section>
        <section class="card"><h3>${t('upcoming_posts')}</h3>${posts.length ? posts.map(p => `<div class="row">${typeof platBadge === 'function' ? platBadge(p.platform) : ''}<div class="grow"><b>${esc(p.platform)}</b> · <small>${fmtDate(p.date)}</small><br><small>${esc((p.caption || '').slice(0, 50))}</small></div>${chip(p.client)}</div>`).join('') : empty()}</section>
      </div>`;
  },

  clients() {
    const cards = S.clients.map(c => {
      const tn = S.tasks.filter(x => x.client === c.id).length;
      const pn = S.posts.filter(x => x.client === c.id).length;
      return `<div class="card client" style="--c:${c.color}">
        <div class="head"><div class="avatar">${esc(c.name.trim().charAt(0).toUpperCase())}</div><div><b>${esc(c.name)}</b><br><small style="color:var(--mut)">${esc(c.industry)}</small></div></div>
        <div class="fee">${money(c.fee)}</div>
        <div class="meta"><span>${ic('tasks')} ${tn} ${t('tasks_n')}</span><span>${ic('calendar')} ${pn} ${t('posts_n')}</span></div>
        <div class="meta"><span>${ic('call')} <bdi dir="ltr">${esc(c.contact || '—')}</bdi></span></div>
        <div class="acts"><button class="btn sm" data-action="edit-client" data-id="${c.id}">${t('edit')}</button></div></div>`;
    }).join('');
    return `<div class="bar"><button class="btn primary" data-action="add-client">${ic('plus')} ${t('add_client')}</button></div>
      ${S.clients.length ? `<div class="grid">${cards}</div>` : `<div class="card">${empty()}</div>`}`;
  },

  tasks() {
    const today = dstr(new Date());
    const card = x => `<div class="task" draggable="true" data-id="${x.id}">
      <div class="t-title">${esc(x.title)}</div>
      <div class="t-meta">${chip(x.client)}<span class="pri ${x.priority}">${t('pri_' + x.priority)}</span>${x.due ? `<span class="${x.due < today && x.status !== 'done' ? 'late' : ''}">${ic('clock')} ${fmtDate(x.due)}</span>` : ''}</div>
      <div class="t-act">${x.status !== 'done' ? `<button class="btn sm" data-action="next-task" data-id="${x.id}">${t('next')}</button>` : ''}<button class="btn sm" data-action="edit-task" data-id="${x.id}">${t('edit')}</button></div></div>`;
    const cols = ['todo', 'doing', 'done'].map(c => {
      const list = S.tasks.filter(x => x.status === c);
      return `<div class="col"><h4>${t('st_' + c)} <span class="count">${list.length}</span></h4><div class="col-body" data-status="${c}">${list.map(card).join('')}</div></div>`;
    }).join('');
    return `<div class="bar"><button class="btn primary" data-action="add-task">${ic('plus')} ${t('add_task')}</button></div><div class="kanban">${cols}</div>`;
  },

  calendar() {
    const startDay = S.lang === 'ar' ? 6 : 0;
    const first = new Date(cal.y, cal.m, 1);
    const offset = (first.getDay() - startDay + 7) % 7;
    const start = new Date(cal.y, cal.m, 1 - offset);
    const today = dstr(new Date());
    const dows = Array.from({ length: 7 }, (_, i) => new Date(2024, 0, 6 + ((startDay + i) % 7)).toLocaleDateString(loc(), { weekday: 'short' }));
    const daysInMonth = new Date(cal.y, cal.m + 1, 0).getDate();
    const weeks = Math.ceil((offset + daysInMonth) / 7);
    let cells = '';
    for (let i = 0; i < weeks * 7; i++) {
      const d = new Date(start); d.setDate(start.getDate() + i);
      const ds = dstr(d);
      const list = S.posts.filter(p => p.date === ds);
      const chips = list.slice(0, 3).map(p => `<div class="post ${p.status}" style="--c:${client(p.client)?.color || '#999'}" data-action="edit-post" data-id="${p.id}" title="${esc(p.caption)}">${platIc(p.platform)} ${esc(p.platform)} · ${esc((p.caption || '').slice(0, 18))}</div>`).join('');
      cells += `<div class="day ${d.getMonth() !== cal.m ? 'out' : ''} ${ds === today ? 'today' : ''}" data-action="add-post" data-id="${ds}"><span class="n">${d.getDate()}</span>${chips}${list.length > 3 ? `<span class="more">+${list.length - 3}</span>` : ''}</div>`;
    }
    const title = new Date(cal.y, cal.m, 1).toLocaleDateString(loc(), { month: 'long', year: 'numeric' });
    const rtl = S.lang === 'ar';
    return `<div class="cal-head"><button class="btn" data-action="prev-month">${rtl ? '›' : '‹'}</button><h2>${title}</h2><button class="btn" data-action="next-month">${rtl ? '‹' : '›'}</button><span class="spacer"></span><button class="btn" data-action="go-content">${ic('layers')} ${t('nav_content')}</button><button class="btn primary" data-action="add-post" data-id="${today}">${ic('plus')} ${t('add_post')}</button></div>
      <div class="cal">${dows.map(d => `<div class="dow">${d}</div>`).join('')}${cells}</div>
      <div class="legend"><span class="post draft">${t('ps_draft')}</span><span class="post pending">${t('ps_pending')}</span><span class="post approved">${t('ps_approved')}</span><span class="post published">${t('ps_published')}</span></div>`;
  },

  ai() {
    const tools = ['caption', 'ad', 'script', 'ideas', 'brief'].map(k => [k, t('tool_' + k)]);
    return `<div class="two" style="align-items:start">
      <section class="card"><h3>${t('ai_title')}</h3><div class="form">
        ${sel('', t('ai_tool'), tools, AI.tool).replace('<select name=""', '<select data-ai="tool"')}
        ${sel('', t('ai_client'), clientOpts(), AI.client).replace('<select name=""', '<select data-ai="client"')}
        <label class="f">${t('ai_tone')}<input data-ai="tone" value="${esc(AI.tone)}" placeholder="${t('ai_tone_ph')}"></label>
        ${sel('', t('ai_lang'), [['ar', t('lang_ar')], ['en', t('lang_en')]], AI.lang).replace('<select name=""', '<select data-ai="lang"')}
        <label class="f full">${t('ai_topic')}<textarea data-ai="topic" placeholder="${t('ai_topic_ph')}">${esc(AI.topic)}</textarea></label>
        <div class="full"><button class="btn primary" data-action="ai-gen" ${AI.busy ? 'disabled' : ''}>${AI.busy ? t('ai_busy') : ic('sparkles') + ' ' + t('ai_gen')}</button></div>
      </div></section>
      <section class="card"><h3>${t('ai_out')}</h3>
        ${AI.note ? `<div class="note">${esc(AI.note)}</div>` : ''}
        <div class="out">${esc(AI.out) || '<span style="color:var(--mut)">…</span>'}</div>
        ${AI.out ? `<div class="bar" style="margin:12px 0 0"><button class="btn" data-action="ai-copy">${t('ai_copy')}</button><button class="btn" data-action="ai-save">${t('ai_save')}</button></div>` : ''}
      </section></div>`;
  },

  settings() {
    return `<section class="card" style="max-width:640px"><h3>${t('set_data')}</h3>
      <p style="color:var(--mut)">${CLOUD ? t('cloud_on') : t('set_note')}</p>
      <div class="bar"><button class="btn" data-action="export">${t('export')}</button><button class="btn" data-action="import">${t('import')}</button><button class="btn danger" data-action="clear">${t('clear')}</button></div>
      <input type="file" id="imp" accept="application/json" hidden></section>`;
  }
};

/* ---------------- الرسم ---------------- */
const NAV = [['dashboard', 'dashboard'], ['clients', 'users'], ['tasks', 'tasks'], ['calendar', 'calendar'], ['content', 'layers'], ['trends', 'flame'], ['ai', 'sparkles'], ['profile', 'building'], ['settings', 'sliders'], ['site', 'shield', 'admin'], ['home', 'home']];
function renderAuth() {
  const su = authMode === 'signup' && SITE.options.show_signup;
  $('#auth').innerHTML = booting
    ? `<div class="auth-card"><div class="logo">${brandLockup()}</div></div>`
    : `<form id="auth-form" class="auth-card" novalidate>
        <div class="auth-top"><div class="logo">${brandLockup()}</div><button type="button" class="btn ghost sm" data-action="lang">${S.lang === 'ar' ? 'EN' : 'عربي'}</button></div>
        <p class="auth-sub">${t('tagline')}</p>
        <h2>${su ? t('auth_signup') : t('auth_login')}</h2>
        <label class="f">${t('auth_email')}<input name="email" type="email" required autocomplete="email" dir="ltr"></label>
        <label class="f">${t('auth_pass')}<input name="password" type="password" required minlength="6" autocomplete="${su ? 'new-password' : 'current-password'}" dir="ltr"></label>
        <div id="auth-msg" class="auth-msg" role="alert"></div>
        <button class="btn primary" id="auth-btn" type="submit">${su ? t('auth_signup') : t('auth_login')}</button>
        ${SITE.options.show_signup ? `<button type="button" class="btn ghost" data-action="auth-toggle">${su ? t('auth_to_login') : t('auth_to_signup')}</button>` : ''}
        <button type="button" class="btn ghost" data-action="go-home">← ${t('back_home')}</button>
      </form>`;
}
function show(which) {
  $('.app').hidden = which !== 'app';
  $('#auth').hidden = which !== 'auth';
  $('#landing').hidden = which !== 'landing';
}
function render() {
  document.documentElement.lang = S.lang;
  document.documentElement.dir = S.lang === 'ar' ? 'rtl' : 'ltr';
  applyTheme();
  let r = route;
  if (r === 'login' && (!CLOUD || user)) r = 'dashboard';   // مفيش داعي لشاشة الدخول
  if (r === 'site' && !isAdmin) r = 'dashboard';            // صفحة الأدمن للأدمن بس
  if (r === 'home') { show('landing'); renderLanding(); document.title = SITE.brand; return; }
  if (r === 'login' || (VIEWS[r] && CLOUD && !user)) { show('auth'); renderAuth(); document.title = SITE.brand; return; }
  if (!VIEWS[r]) r = 'dashboard';
  if (isSuspended()) { show('auth'); renderBlocked(); document.title = SITE.brand; return; }
  show('app');
  const foot = user ? `${planLine()}<div class="who" dir="ltr">${esc(user.email)}</div><button class="btn sm ghost" data-action="logout">${t('logout')}</button>` : t('foot');
  const nav = NAV.filter(n => n[2] !== 'admin' || isAdmin).map(([k, icn], i) => `<a href="#${k}" style="--i:${i}" class="${k === r ? 'on' : ''}"><span>${ic(icn)}</span>${t('nav_' + k)}</a>`).join('');
  $('#side').innerHTML = `<div class="logo">${brandLockup()}</div><nav class="nav">${nav}</nav><div class="side-foot">${foot}</div>`;
  $('#title').textContent = t('nav_' + r);
  $('#langbtn').textContent = S.lang === 'ar' ? 'EN' : 'عربي';
  $('#modal-cancel').textContent = t('cancel');
  $('#modal-ok').textContent = t('save');
  $('#modal-del').textContent = t('del');
  $('#view').innerHTML = VIEWS[r]();
  const vw = $('#view');
  if (lastView !== r && vw.classList) {
    vw.classList.remove('enter'); void vw.offsetWidth; vw.classList.add('enter');
    if (vw.querySelectorAll) {
      Array.from(vw.querySelectorAll('.row,.task,.day,.client,.col,.leg span')).forEach((el, i) => el.style.setProperty('--i', i));
      Array.from(vw.querySelectorAll('[data-n]')).forEach(animateNum);
    }
    if (!lastView) { const sd = $('#side'); if (sd.classList) { sd.classList.add('intro'); setTimeout(() => sd.classList.remove('intro'), 1200); } }
  }
  lastView = r;
  document.title = t('nav_' + r) + ' · ' + SITE.brand;
}

// عدّاد للأرقام: بيعدّ من صفر للرقم الحقيقي مرة واحدة عند دخول الصفحة
function animateNum(el) {
  const to = Number(el.dataset.n), suf = el.dataset.suf || '';
  if (!isFinite(to) || to <= 0 || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
  const t0 = performance.now(), dur = 1100;
  const f = now => {
    const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
    el.textContent = Math.round(to * e).toLocaleString(loc()) + suf;
    if (k < 1) requestAnimationFrame(f);
  };
  requestAnimationFrame(f);
}

/* ---------------- نافذة الإدخال ---------------- */
function modal(title, body, onOk, onDelete) {
  $('#modal-title').textContent = title;
  $('#modal-body').innerHTML = `<div class="form">${body}</div>`;
  modalDelete = onDelete || null;
  $('#modal-del').hidden = !onDelete;
  const f = $('#modal-form');
  f.onsubmit = e => {
    e.preventDefault();
    const fin = () => { closeModal(); save(); render(); };
    let r;
    try { r = onOk(Object.fromEntries(new FormData(f))); } catch (err) { toast((err && err.message) || t('err_default')); return; }
    if (r && typeof r.then === 'function') {        // نموذج بيرفع ملف أو بينشر: نستنى
      const ok = $('#modal-ok'); ok.disabled = true;
      r.then(fin, err => toast((err && err.message) || t('err_default'))).then(() => { ok.disabled = false; });
    } else fin();
  };
  $('#modal').hidden = false;
  const first = $('#modal-body input,#modal-body textarea,#modal-body select'); if (first) first.focus();
}
function closeModal() { $('#modal').hidden = true; modalDelete = null; }
let toastTimer;
function toast(msg) { const el = $('#toast'); el.textContent = msg; el.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => el.hidden = true, Math.max(2000, String(msg).length * 70)); }

/* ---------------- نماذج الإدخال ---------------- */
function clientForm(c) {
  const isNew = !c; c = c || { name: '', industry: '', fee: '', contact: '' };
  modal(isNew ? t('add_client') : t('edit'),
    fld('name', t('f_name'), c.name, 'text', 'required full') + fld('industry', t('f_industry'), c.industry) + fld('fee', t('f_fee'), c.fee, 'number', 'min="0"') + fld('contact', t('f_contact'), c.contact, 'text', 'full'),
    d => {
      if (isNew) S.clients.push({ id: uid(), name: d.name.trim(), industry: d.industry, fee: +d.fee || 0, contact: d.contact, color: COLORS[S.clients.length % COLORS.length] });
      else Object.assign(c, { name: d.name.trim(), industry: d.industry, fee: +d.fee || 0, contact: d.contact });
    },
    isNew ? null : () => { if (confirm(t('confirm'))) { S.clients = S.clients.filter(x => x.id !== c.id); S.tasks = S.tasks.filter(x => x.client !== c.id); S.posts = S.posts.filter(x => x.client !== c.id); closeModal(); save(); render(); } });
}
function taskForm(x) {
  const isNew = !x; x = x || { title: '', client: '', due: '', priority: 'med', status: 'todo' };
  modal(isNew ? t('add_task') : t('edit'),
    fld('title', t('f_title'), x.title, 'text', 'required full') + sel('client', t('f_client'), clientOpts(), x.client) + fld('due', t('f_due'), x.due, 'date') +
    sel('priority', t('f_pri'), [['low', t('pri_low')], ['med', t('pri_med')], ['high', t('pri_high')]], x.priority) +
    sel('status', t('f_status'), [['todo', t('st_todo')], ['doing', t('st_doing')], ['done', t('st_done')]], x.status),
    d => { if (isNew) S.tasks.push({ id: uid(), ...d, title: d.title.trim() }); else Object.assign(x, d, { title: d.title.trim() }); },
    isNew ? null : () => { if (confirm(t('confirm'))) { S.tasks = S.tasks.filter(y => y.id !== x.id); closeModal(); save(); render(); } });
}
/* ---------------- توليد المحتوى ---------------- */
function localAI(p) {
  const ar = p.lang !== 'en', b = p.brand, tp = p.topic.trim();
  const tag = '#' + (b || p.industry || (ar ? 'عرض' : 'offer')).replace(/\s+/g, '_');
  const A = {
    caption: `✨ ${tp}\n\n${b ? b + ' — ' : ''}جرّبها النهارده وهتفرق معاك فعلاً.\n\n👇 قولنا رأيك في الكومنتات!\n${tag}\n\n— — —\n\n🔥 ${tp}\nمتفوتش الفرصة، الكمية محدودة.\nاطلب دلوقتي من اللينك في البايو.\n${tag}`,
    ad: `العناوين:\n1) ${tp}\n2) ${b || 'جرّب'} دلوقتي واكتشف الفرق\n3) عرض لفترة محدودة\n\nالنص الأساسي:\n- ${tp}. اتصل أو ابعت رسالة وهنرد عليك فوراً.\n- ${b ? b + ' ' : ''}بيقدملك الأفضل بسعر يناسبك.\n\nالـ CTA: اطلب الآن / اعرف أكتر`,
    script: `🎬 سكريبت 30 ثانية\n\nالهوك (0-3 ث): "تعرف إن ${tp}؟"\n\nمشهد 1: لقطة قريبة للمنتج/الخدمة — فويس: المشكلة اللي بيواجهها الناس.\nمشهد 2: الحل — فويس: ${b || 'إحنا'} بنقدم ${tp}.\nمشهد 3: نتيجة/رد فعل العميل.\n\nCTA: "ابعتلنا رسالة دلوقتي".`,
    ideas: `1) ريل "ورا الكواليس" عن ${tp}\n2) كاروسيل: 5 أسئلة بيسألها العملاء\n3) ستوري تصويت: أنهي أحسن؟\n4) فيديو قبل/بعد\n5) رأي عميل حقيقي + صورة\n6) ريل ترند بنكهة ${b || 'البراند'}\n7) بوست تعليمي: 3 نصايح سريعة\n8) مسابقة لزيادة التفاعل`,
    brief: `بريف حملة\n\nالهدف: زيادة الوعي والمبيعات حول "${tp}"\nالجمهور: ${p.industry || 'الجمهور المستهدف'} — حدد السن والموقع والاهتمامات\nالرسالة الرئيسية: ${tp}\nأعمدة المحتوى: تعليمي، ترفيهي، عروض، آراء عملاء\nالمخرجات: 12 بوست، 4 ريلز، 8 ستوري شهرياً\nمؤشرات النجاح: وصول، تفاعل، رسائل واردة، مبيعات`
  };
  const E = {
    caption: `✨ ${tp}\n\n${b ? b + ' — ' : ''}Try it today and feel the difference.\n\n👇 Tell us what you think!\n${tag}\n\n— — —\n\n🔥 ${tp}\nLimited availability. Order now via the link in bio.\n${tag}`,
    ad: `Headlines:\n1) ${tp}\n2) Discover the difference with ${b || 'us'}\n3) Limited-time offer\n\nPrimary text:\n- ${tp}. Message us and we'll reply right away.\n- ${b ? b + ' ' : ''}brings you the best at a price that fits.\n\nCTA: Order now / Learn more`,
    script: `🎬 30-second script\n\nHook (0-3s): "Did you know ${tp}?"\n\nScene 1: Close-up of the product — VO: the problem people face.\nScene 2: The solution — VO: ${b || 'We'} offer ${tp}.\nScene 3: Result / customer reaction.\n\nCTA: "Message us now."`,
    ideas: `1) Behind-the-scenes reel about ${tp}\n2) Carousel: 5 questions customers ask\n3) Story poll: which one is better?\n4) Before/after video\n5) Real customer review + photo\n6) Trend reel with ${b || 'brand'} flavour\n7) Educational post: 3 quick tips\n8) Giveaway for engagement`,
    brief: `Campaign brief\n\nObjective: raise awareness and sales around "${tp}"\nAudience: ${p.industry || 'target audience'} — define age, location, interests\nKey message: ${tp}\nContent pillars: educational, entertaining, offers, testimonials\nDeliverables: 12 posts, 4 reels, 8 stories per month\nKPIs: reach, engagement, inbound messages, sales`
  };
  return (ar ? A : E)[p.tool];
}
async function aiGen() {
  if (!AI.topic.trim()) return toast(t('ai_need_topic'));
  AI.busy = true; AI.note = ''; render();
  const c = client(AI.client);
  const payload = { tool: AI.tool, brand: c ? c.name : '', industry: c ? c.industry : '', tone: AI.tone, topic: AI.topic, lang: AI.lang };
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (CLOUD && sb) {
      const { data } = await sb.auth.getSession();
      if (data && data.session) headers.Authorization = 'Bearer ' + data.session.access_token;
    }
    const r = await fetch('/api/ai', { method: 'POST', headers, body: JSON.stringify(payload) });
    if (r.status === 429) { AI.busy = false; AI.note = t('ai_limit'); render(); return; }
    if (!r.ok) throw new Error('x');
    const j = await r.json();
    if (!j.text) throw new Error('x');
    AI.out = j.text;
  } catch (e) {
    AI.out = localAI(payload); AI.note = t('ai_demo');
  }
  AI.busy = false; render();
}

/* ---------------- الأحداث ---------------- */
const ACTIONS = {
  menu() { $('#side').classList.toggle('open'); },
  lang() { S.lang = S.lang === 'ar' ? 'en' : 'ar'; save(); render(); },
  'auth-toggle'() { authMode = authMode === 'login' ? 'signup' : 'login'; render(); },
  logout() { if (sb) sb.auth.signOut(); },  close() { closeModal(); },
  'modal-del'() { if (modalDelete) modalDelete(); },
  'add-client'() { if (atLimit()) { toast(t('limit_reached')); return; } clientForm(); },
  'edit-client'(id) { clientForm(client(id)); },
  'add-task'() { taskForm(); },
  'edit-task'(id) { taskForm(S.tasks.find(x => x.id === id)); },
  'next-task'(id) { const x = S.tasks.find(y => y.id === id); x.status = x.status === 'todo' ? 'doing' : 'done'; save(); render(); },
  'add-post'(id) { postForm(null, id); },
  'edit-post'(id) { postForm(S.posts.find(x => x.id === id)); },
  'prev-month'() { cal.m--; if (cal.m < 0) { cal.m = 11; cal.y--; } render(); },
  'next-month'() { cal.m++; if (cal.m > 11) { cal.m = 0; cal.y++; } render(); },
  'ai-gen'() { aiGen(); },
  'ai-copy'() { (navigator.clipboard ? navigator.clipboard.writeText(AI.out) : Promise.reject()).then(() => toast(t('copied'))).catch(() => toast(t('copied'))); },
  'ai-save'() { postForm(null, dstr(new Date()), AI.out); },
  export() {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' }));
    a.download = 'socialdia-nexus-backup-' + dstr(new Date()) + '.json'; a.click();
  },
  import() { $('#imp').click(); },
  clear() { if (confirm(t('confirm'))) { S = { lang: S.lang, clients: [], tasks: [], posts: [], profiles: S.profiles || [] }; save(); render(); toast(t('cleared')); } }
};
document.addEventListener('click', e => {
  const el = e.target.closest('[data-action]');
  if (el && ACTIONS[el.dataset.action]) { ACTIONS[el.dataset.action](el.dataset.id, el, e); return; }
  if (e.target.id === 'modal') closeModal();
  if (e.target.closest('.nav a')) $('#side').classList.remove('open');
});
document.addEventListener('input', e => { const k = e.target.dataset && e.target.dataset.ai; if (k) AI[k] = e.target.value; });
document.addEventListener('change', async e => {
  const k = e.target.dataset && e.target.dataset.ai; if (k) AI[k] = e.target.value;
  if (e.target.id === 'imp' && e.target.files[0]) {
    const rd = new FileReader();
    rd.onload = () => {
      try {
        const d = JSON.parse(rd.result);
        if (!Array.isArray(d.clients) || !Array.isArray(d.tasks) || !Array.isArray(d.posts)) throw new Error('bad');
        S = { lang: d.lang === 'en' ? 'en' : 'ar', clients: d.clients, tasks: d.tasks, posts: d.posts, profiles: Array.isArray(d.profiles) ? d.profiles : (S.profiles || []) };
        save(); render(); toast(t('imported'));
      } catch (err) { toast(t('bad_file')); }
    };
    rd.readAsText(e.target.files[0]);
  }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* تسجيل الدخول / إنشاء حساب */
document.addEventListener('submit', async e => {
  if (!e.target || e.target.id !== 'auth-form') return;
  e.preventDefault();
  const f = new FormData(e.target);
  const email = String(f.get('email') || '').trim(), password = String(f.get('password') || '');
  const msg = $('#auth-msg'), btn = $('#auth-btn');
  btn.disabled = true; msg.className = 'auth-msg'; msg.textContent = '';
  try {
    if (authMode === 'signup' && SITE.options.show_signup) {
      const { data, error } = await sb.auth.signUp({ email, password });
      if (error) throw error;
      if (!data.session) { msg.className = 'auth-msg ok'; msg.textContent = t('auth_check_mail'); }
    } else {
      const { error } = await sb.auth.signInWithPassword({ email, password });
      if (error) throw error;
    }
  } catch (err) { msg.className = 'auth-msg'; msg.textContent = (err && err.message) || t('auth_err'); }
  btn.disabled = false;
});

/* السحب والإفلات في لوحة المهام */
let dragId = null;
document.addEventListener('dragstart', e => { const c = e.target.closest && e.target.closest('.task'); if (c) { dragId = c.dataset.id; c.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; try { e.dataTransfer.setData('text/plain', dragId); } catch (x) {} } });
document.addEventListener('dragend', e => { const c = e.target.closest && e.target.closest('.task'); if (c) c.classList.remove('dragging'); document.querySelectorAll('.col-body.over').forEach(x => x.classList.remove('over')); });
document.addEventListener('dragover', e => { const b = e.target.closest && e.target.closest('.col-body'); if (b) { e.preventDefault(); document.querySelectorAll('.col-body.over').forEach(x => x !== b && x.classList.remove('over')); b.classList.add('over'); } });
document.addEventListener('drop', e => {
  const b = e.target.closest && e.target.closest('.col-body');
  if (!b || !dragId) return;
  e.preventDefault();
  const x = S.tasks.find(y => y.id === dragId);
  if (x) { x.status = b.dataset.status; save(); }
  dragId = null; render();
});

/* التشغيل: بيتنادى من آخر سطر في site.js بعد ما كل الملفات تتحمّل */
window.addEventListener('hashchange', () => { readRoute(); render(); });
function startApp() {
  readRoute(); render();
  if (CLOUD) bootCloud();
}
