'use strict';
/* =========================================================
   حسابات الموظفين + شات الشركة + التحديث اللحظي لبيانات الشركة.
   بيتحمّل بعد features.js وقبل site.js.
   ========================================================= */
Object.assign(T.ar, {
  nav_chat: 'شات الفريق',
  auth_tab_owner: 'صاحب الشركة', auth_tab_staff: 'تسجيل كموظف', auth_staff_title: 'دخول الموظفين', auth_staff_sub: 'ادخل باليوزرنيم والباسورد اللي مديرك عملهولك.', auth_username: 'اسم المستخدم',
  staff_bad_login: 'اسم المستخدم أو الباسورد غلط', staff_throttle: 'محاولات كتير. استنى شوية وجرّب تاني.', staff_not_ready: 'دخول الموظفين لسه ما اتفعّلش. كلّم مدير الشركة.', staff_removed: 'الحساب ده اتحذف أو اتوقّف. كلّم مدير الشركة.',
  staff_works_at: 'بتشتغل في', staff_company: 'الشركة', staff_role_lbl: 'موظف',
  login_title: 'حساب دخول للموظف', login_sub: 'اختياري: اعمل يوزرنيم وباسورد عشان الموظف يدخل من (تسجيل كموظف) ويشوف بيانات الشركة.',
  login_have: 'الموظف عنده حساب دخول. غيّر اليوزرنيم، أو اكتب باسورد جديد لو عايز تغيّره.', login_newpass: 'باسورد جديد (اختياري)', login_pass_hint: '8 حروف أو أرقام على الأقل',
  login_saved: 'اتحفظ حساب الدخول. اليوزرنيم: {u}', login_has: 'عنده حساب دخول', login_confirm_del: 'هيتحذف الموظف وحساب دخوله ومش هيقدر يدخل تاني. متأكد؟',
  serr_username_invalid: 'اليوزرنيم حروف إنجليزي صغيرة وأرقام و . _ - بس (من 3 لـ 30)', serr_weak_password: 'الباسورد لازم 8 حروف أو أرقام على الأقل', serr_need_password: 'اكتب باسورد للموظف',
  serr_username_taken: 'اليوزرنيم ده مستخدم، اختار غيره', serr_member_not_found: 'الموظف لسه ما اتحفظش. جرّب تاني', serr_limit_reached: 'وصلت للحد الأقصى من حسابات الدخول (50)',
  serr_not_deployed: 'سيرفر الموظفين لسه مش متحدّث: ارفع src/staff.js و src/worker.js وانتظر Deploy يخلص.', serr_bad_request: 'بيانات ناقصة أو غلط، راجع اليوزرنيم والباسورد', serr_not_found: 'المسار مش موجود على السيرفر', serr_forbidden: 'مش مسموح للموظف يعمل ده', serr_unauthorized: 'سجّل دخول تاني', serr_not_configured: 'ميزة الموظفين مش مفعّلة على السيرفر. راجع الإعداد (SUPABASE_SERVICE_ROLE_KEY).', serr_upstream: 'السيرفر مش متاح دلوقتي، جرّب تاني',
  chat_title: 'شات الفريق', chat_sub: 'محادثة خاصة بأعضاء الشركة بس.', chat_ph: 'اكتب رسالة…', chat_send: 'إرسال', chat_empty: 'مفيش رسائل لسه. ابدأ المحادثة.', chat_owner: 'المدير', chat_del: 'مسح الرسالة', chat_today: 'النهارده', chat_err: 'الرسالة ماتبعتتش، جرّب تاني', chat_members: 'أعضاء الشركة'
});
Object.assign(T.en, {
  nav_chat: 'Team chat',
  auth_tab_owner: 'Company owner', auth_tab_staff: 'Sign in as staff', auth_staff_title: 'Staff sign-in', auth_staff_sub: 'Use the username and password your manager created for you.', auth_username: 'Username',
  staff_bad_login: 'Wrong username or password', staff_throttle: 'Too many attempts. Wait a bit and try again.', staff_not_ready: 'Staff sign-in is not enabled yet. Ask your manager.', staff_removed: 'This account was removed or disabled. Ask your manager.',
  staff_works_at: 'You work at', staff_company: 'Company', staff_role_lbl: 'Staff',
  login_title: 'Staff sign-in account', login_sub: 'Optional: create a username and password so this person can sign in via “Sign in as staff” and see the company’s data.',
  login_have: 'This person has a sign-in account. Change the username, or type a new password to reset it.', login_newpass: 'New password (optional)', login_pass_hint: 'At least 8 characters',
  login_saved: 'Sign-in saved. Username: {u}', login_has: 'Has a sign-in account', login_confirm_del: 'This deletes the member and their sign-in. They won’t be able to log in again. Sure?',
  serr_username_invalid: 'Username: lowercase English letters, numbers and . _ - only (3–30)', serr_weak_password: 'Password must be at least 8 characters', serr_need_password: 'Enter a password for this member',
  serr_username_taken: 'That username is taken, pick another', serr_member_not_found: 'The member isn’t saved yet. Try again', serr_limit_reached: 'You reached the limit of 50 sign-in accounts',
  serr_not_deployed: 'The staff server isn’t updated yet: upload src/staff.js and src/worker.js and wait for the deploy.', serr_bad_request: 'Missing or invalid data, check the username and password', serr_not_found: 'Route not found on the server', serr_forbidden: 'Staff can’t do this', serr_unauthorized: 'Please sign in again', serr_not_configured: 'Staff accounts aren’t enabled on the server. Check the setup (SUPABASE_SERVICE_ROLE_KEY).', serr_upstream: 'Server unavailable right now, try again',
  chat_title: 'Team chat', chat_sub: 'A private conversation for your company’s members only.', chat_ph: 'Write a message…', chat_send: 'Send', chat_empty: 'No messages yet. Start the conversation.', chat_owner: 'Manager', chat_del: 'Delete message', chat_today: 'Today', chat_err: 'Message not sent, try again', chat_members: 'Company members'
});

const serrMsg = code => { const k = 'serr_' + code, v = t(k); return v === k ? t('err_default') : v; };

/* ---------------- الاتصال بالـ Worker ---------------- */
async function staffApi(action, body) {
  const { data } = await sb.auth.getSession();
  const tok = data && data.session && data.session.access_token;
  let r, j = {};
  try {
    r = await fetch('/api/staff/' + action, { method: 'POST', headers: { 'content-type': 'application/json', authorization: 'Bearer ' + (tok || '') }, body: JSON.stringify(body) });
    try { j = await r.json(); } catch (e) {}
  } catch (e) { throw new Error(serrMsg('upstream')); }
  if (!r.ok) {
    if (!j.error) throw new Error(r.status === 404 || r.status === 405 ? t('serr_not_deployed') : t('err_default') + ' (HTTP ' + r.status + ')');
    const extra = j.step ? ` [${j.step} ${j.status || ''}${j.msg ? ': ' + j.msg : ''}]` : '';
    throw new Error(serrMsg(j.error) + extra);
  }
  return j;
}
async function staffLogin(username, password) {
  let r, j = {};
  try {
    r = await fetch('/api/staff/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ username, password }) });
    try { j = await r.json(); } catch (e) {}
  } catch (e) { throw new Error(t('staff_not_ready')); }
  if (r.status === 429) throw new Error(t('staff_throttle'));
  if (r.status === 503 || r.status === 404) throw new Error(t('staff_not_ready'));
  if (!r.ok || !j.access_token) throw new Error(t('staff_bad_login'));
  const { error } = await sb.auth.setSession({ access_token: j.access_token, refresh_token: j.refresh_token });
  if (error) throw new Error(t('staff_bad_login'));
}

/* ---------------- هوية الموظف في الواجهة ---------------- */
function staffMember() { return STAFF ? ((S.profiles && S.profiles[0] && S.profiles[0].team) || []).find(m => m.id === STAFF.member_id) || null : null; }
function staffName() { const m = staffMember(); return (m && m.name) || (STAFF && STAFF.username) || ''; }
function staffFoot() {
  const m = staffMember(), co = (S.profiles && S.profiles[0] && S.profiles[0].company) || '';
  return `<div class="planline"><span>${t('staff_company')}: <b>${esc(co || '—')}</b></span><span>${esc((m && m.role) || t('staff_role_lbl'))}</span></div>
    <div class="who">${esc(staffName())}</div><button class="btn sm ghost" data-action="logout">${t('logout')}</button>`;
}
function myChatName() { return isStaff() ? (staffName() || 'staff') : (((S.profiles && S.profiles[0] && S.profiles[0].company) || '').trim() ? t('chat_owner') + ' · ' + S.profiles[0].company.trim() : t('chat_owner')); }

/* ---------------- الشات ---------------- */
const CHAT = { msgs: [], unread: 0, loaded: false };
const seenKey = () => 'nexus_chat_seen_' + (user ? user.id : '');
const getSeen = () => { try { return Number(localStorage.getItem(seenKey())) || 0; } catch (e) { return 0; } };
const setSeen = n => { try { localStorage.setItem(seenKey(), String(n)); } catch (e) {} };
const lastTs = () => CHAT.msgs.length ? new Date(CHAT.msgs[CHAT.msgs.length - 1].created_at).getTime() : 0;
function calcUnread() {
  const seen = getSeen();
  CHAT.unread = CHAT.msgs.filter(m => m.sender !== (user && user.id) && new Date(m.created_at).getTime() > seen).length;
}
function paintBadge() {
  const a = $('#side a[href="#chat"]'); if (!a) return;
  let b = a.querySelector('.bdg');
  if (CHAT.unread > 0) { if (!b) { b = document.createElement('em'); b.className = 'bdg'; a.appendChild(b); } b.textContent = CHAT.unread > 99 ? '99+' : String(CHAT.unread); }
  else if (b) b.remove();
}
function markSeen() { setSeen(lastTs()); CHAT.unread = 0; paintBadge(); }   // بنقارن بتوقيت السيرفر بس (مفيش اعتماد على ساعة الجهاز)
function chatHtml() {
  if (!CHAT.msgs.length) return `<div class="empty">${CHAT.loaded ? t('chat_empty') : '…'}</div>`;
  let day = '', out = '';
  for (const m of CHAT.msgs) {
    const d = new Date(m.created_at), dk = d.toDateString();
    if (dk !== day) { day = dk; out += `<div class="chat-day"><span>${dk === new Date().toDateString() ? t('chat_today') : d.toLocaleDateString(loc(), { weekday: 'long', day: 'numeric', month: 'long' })}</span></div>`; }
    const mine = user && m.sender === user.id, canDel = mine || (!isStaff() && user);
    out += `<div class="msg ${mine ? 'mine' : ''}"><div class="bub"><b class="who">${mine ? '' : esc(m.sender_name)}</b><p>${esc(m.body)}</p>
      <small>${d.toLocaleTimeString(loc(), { hour: '2-digit', minute: '2-digit' })}${canDel ? ` <button class="mdel" data-action="chat-del" data-id="${esc(m.id)}" title="${t('chat_del')}" aria-label="${t('chat_del')}">${ic('trash')}</button>` : ''}</small></div></div>`;
  }
  return out;
}
function chatPaint(stick) {
  const el = $('#chat-list'); if (!el) return;
  const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  el.innerHTML = chatHtml();
  if (stick || nearBottom) el.scrollTop = el.scrollHeight;
}
async function chatLoad() {
  if (!sb || !user) return;
  try {
    const { data, error } = await sb.from('chat_messages').select('id,sender,sender_name,body,created_at').eq('owner', companyId()).order('created_at', { ascending: false }).limit(200);
    if (error) return;
    CHAT.msgs = (data || []).reverse(); CHAT.loaded = true;
    if (route === 'chat') { chatPaint(); markSeen(); } else { calcUnread(); paintBadge(); }
  } catch (e) { /* الدورة الجاية */ }
}
function chatIncoming(row) {
  if (!row || !row.id || CHAT.msgs.some(m => m.id === row.id)) return;
  CHAT.msgs.push(row);
  if (route === 'chat') { chatPaint(); markSeen(); }
  else { calcUnread(); paintBadge(); }
}
VIEWS.chat = function () {
  setTimeout(() => { chatPaint(true); markSeen(); const i = $('#chat-input'); if (i && !('ontouchstart' in window)) i.focus(); }, 0);
  const team = (S.profiles && S.profiles[0] && S.profiles[0].team) || [];
  return `<section class="card chat-card"><div class="chat-head"><span class="ic">${ic('chat')}</span><div><h3>${t('chat_title')}</h3><small class="mut">${t('chat_sub')}</small></div>
      <span class="count" title="${t('chat_members')}">${(team.filter(m => STAFFROWS[m.id]).length + 1).toLocaleString(loc())}</span></div>
    <div id="chat-list" class="chat-list" aria-live="polite"></div>
    <form id="chat-form" class="chat-form" autocomplete="off"><textarea id="chat-input" name="body" rows="1" maxlength="2000" placeholder="${t('chat_ph')}" aria-label="${t('chat_ph')}"></textarea>
      <button class="btn primary" type="submit" aria-label="${t('chat_send')}">${ic('send')}</button></form></section>`;
};
let chatSending = false;
async function chatSend() {
  const inp = $('#chat-input'); if (!inp || chatSending) return;
  const body = inp.value.trim(); if (!body) return;
  chatSending = true;
  try {
    const { data, error } = await sb.from('chat_messages').insert({ sender_name: myChatName().slice(0, 80), body }).select('id,sender,sender_name,body,created_at').single();
    if (error) throw error;
    inp.value = ''; inp.style.height = '';
    chatIncoming(data); chatPaint(true);
  } catch (e) { toast(t('chat_err')); }
  chatSending = false; inp.focus();
}
document.addEventListener('submit', e => { if (e.target && e.target.id === 'chat-form') { e.preventDefault(); chatSend(); } });
document.addEventListener('keydown', e => {
  if (e.target && e.target.id === 'chat-input' && e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); chatSend(); }
});
document.addEventListener('input', e => { const el = e.target; if (el && el.id === 'chat-input') { el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight, 140) + 'px'; } });
Object.assign(ACTIONS, {
  async 'chat-del'(id) {
    if (!confirm(t('confirm'))) return;
    const { error } = await sb.from('chat_messages').delete().eq('id', id);
    if (error) { toast(t('err_default')); return; }
    CHAT.msgs = CHAT.msgs.filter(m => m.id !== id); chatPaint();
  }
});

/* ---------------- التحديث اللحظي: أي إضافة/تعديل من أي عضو بتظهر للكل ---------------- */
const LIVE = { ch: null, t1: null, t2: null, busy: false, wait: null };
const modalOpen = () => { const m = $('#modal'); return !!m && !m.hidden; };
function scheduleRefresh() { clearTimeout(LIVE.wait); LIVE.wait = setTimeout(refreshData, 700); }
async function refreshData() {
  if (!sb || !user || LIVE.busy || modalOpen() || document.hidden) return;
  LIVE.busy = true;
  try {
    await syncChain;                                  // اللي اتعدّل عندنا يترفع الأول
    const stamp = savedAt;
    const r = await fetchCloud();
    if (savedAt !== stamp || modalOpen()) return;     // فيه تعديل محلي جديد (أو نموذج مفتوح): نستنى الدورة الجاية
    const same = JSON.stringify([S.clients, S.tasks, S.posts, S.profiles]) === JSON.stringify([r.out.clients, r.out.tasks, r.out.posts, r.out.profiles]);
    const subSame = JSON.stringify(SUB) === JSON.stringify(r.sub);
    if (same && subSame) { if (r.rows) STAFFROWS = r.rows; return; }
    applyCloud(r);
    const ae = document.activeElement;
    const typing = ae && /^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName) && ae.closest && ae.closest('#view');
    if (route !== 'chat' && !typing) render();
  } catch (e) { /* مش مشكلة، الدورة الجاية */ }
  finally { LIVE.busy = false; }
}
function startLive() {
  stopLive();
  if (!sb || !user) return;
  const id = companyId();
  try {
    let ch = sb.channel('co-' + id)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: 'owner=eq.' + id }, p => chatIncoming(p.new))
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'chat_messages' }, () => chatLoad());
    TABLES.forEach(tb => { ch = ch.on('postgres_changes', { event: '*', schema: 'public', table: tb, filter: 'owner=eq.' + id }, scheduleRefresh); });
    LIVE.ch = ch.subscribe();
  } catch (e) { LIVE.ch = null; }
  // احتياطي لو الـ Realtime مش شغّال: فحص دوري
  LIVE.t1 = setInterval(() => { if (!document.hidden) scheduleRefresh(); }, 25000);
  let tick = 0;
  LIVE.t2 = setInterval(() => { tick++; if (!document.hidden && (route === 'chat' || tick % 5 === 0)) chatLoad(); }, 6000);
  chatLoad();
}
function stopLive() {
  clearTimeout(LIVE.wait); clearInterval(LIVE.t1); clearInterval(LIVE.t2); LIVE.t1 = LIVE.t2 = null;
  if (LIVE.ch && sb) { try { sb.removeChannel(LIVE.ch); } catch (e) {} }
  LIVE.ch = null;
}
function teamReset() { stopLive(); CHAT.msgs = []; CHAT.unread = 0; CHAT.loaded = false; }
document.addEventListener('visibilitychange', () => { if (!document.hidden && user) { scheduleRefresh(); chatLoad(); } });
