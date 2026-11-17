'use strict';
/* =========================================================
   مساعد NEXUS: شات بيجاوب عن المنصة، بيكتب محتوى، وبينفّذ أوامر (بعد تأكيدك).
   الذكاء من /api/assistant (موديل مفتوح على Cloudflare). لو مش متاح بيرد من مكتبة المساعدة (/kb.json) من غير أي API.
   ========================================================= */
Object.assign(T.ar, {
  nav_assistant: 'مساعد NEXUS',
  asst_title: 'مساعد NEXUS', asst_sub: 'اسأل عن المنصة، اطلب كابشنز وأفكار، أو قوله يضيف عميل أو مهمة أو بوست.',
  asst_ph: 'اكتب سؤالك أو أمرك…', asst_send: 'إرسال', asst_clear: 'محادثة جديدة', asst_thinking: 'بفكّر…',
  asst_hello: 'أهلاً! أنا مساعد NEXUS. أقدر أشرحلك أي خدمة في المنصة، أكتبلك محتوى، وأضيفلك عملاء ومهام وبوستات (هطلبلك تأكيد قبل أي تنفيذ). جرّب واحدة من دول:',
  asst_chip1: 'اشرحلي كل خدمات المنصة', asst_chip2: 'أضف عميل جديد', asst_chip3: 'جهّزلي 3 بوستات إنستجرام الأسبوع ده', asst_chip4: 'إزاي أعمل حساب دخول لموظف؟', asst_chip5: 'اكتب كابشن لعرض خصم نهاية الأسبوع',
  asst_ready: 'جهّزت الأوامر دي، راجعها ونفّذها:', asst_run: 'نفّذ', asst_run_all: 'نفّذ الكل', asst_skip: 'تجاهل', asst_done: 'اتنفّذ', asst_skipped: 'اتجاهل',
  asst_offline: 'ده رد من مكتبة المساعدة. المساعد الذكي مش متاح دلوقتي.', asst_quota: 'الحصة اليومية المجانية للمساعد الذكي خلصت وبتتجدد بكرة. ده رد من مكتبة المساعدة.',
  asst_none: 'مش لاقي إجابة واضحة في مكتبة المساعدة. جرّب تسأل عن: العملاء، المهام، التقويم، المحتوى، الهاشتاجات، الباقات والدفع، الموظفين، الشات.',
  asst_more: 'كمان ممكن يفيدك: ', asst_unauth: 'سجّل دخول الأول عشان تستخدم المساعد.',
  act_add_client: 'إضافة عميل', act_add_task: 'إضافة مهمة', act_add_post: 'إضافة بوست', act_open: 'فتح صفحة',
  act_exists: 'العميل ده موجود بالفعل', act_no_client: 'العميل مش موجود فاتضافت من غير عميل', act_limit: 'وصلت للحد الأقصى من العملاء في باقتك'
});
Object.assign(T.en, {
  nav_assistant: 'NEXUS Assistant',
  asst_title: 'NEXUS Assistant', asst_sub: 'Ask about the platform, request captions and ideas, or tell it to add a client, task or post.',
  asst_ph: 'Type your question or command…', asst_send: 'Send', asst_clear: 'New chat', asst_thinking: 'Thinking…',
  asst_hello: 'Hi! I’m the NEXUS assistant. I can explain any service, write content, and add clients, tasks and posts for you (I’ll ask you to confirm before anything is done). Try one:',
  asst_chip1: 'Explain all the platform’s services', asst_chip2: 'Add a new client', asst_chip3: 'Prepare 3 Instagram posts for this week', asst_chip4: 'How do I create a staff login?', asst_chip5: 'Write a caption for a weekend discount',
  asst_ready: 'I prepared these actions. Review and run them:', asst_run: 'Run', asst_run_all: 'Run all', asst_skip: 'Skip', asst_done: 'Done', asst_skipped: 'Skipped',
  asst_offline: 'This is an answer from the help library. The smart assistant isn’t available right now.', asst_quota: 'The assistant’s free daily quota is used up and resets tomorrow. This is an answer from the help library.',
  asst_none: 'I couldn’t find a clear answer in the help library. Try asking about: clients, tasks, calendar, content, hashtags, plans and payment, staff, chat.',
  asst_more: 'You may also need: ', asst_unauth: 'Please sign in first to use the assistant.',
  act_add_client: 'Add client', act_add_task: 'Add task', act_add_post: 'Add post', act_open: 'Open page',
  act_exists: 'This client already exists', act_no_client: 'Client not found, added without a client', act_limit: 'You reached the client limit of your plan'
});

const ASST = { msgs: [], busy: false, kb: null };
const ASST_CHIPS = ['asst_chip1', 'asst_chip2', 'asst_chip3', 'asst_chip4', 'asst_chip5'];

/* ---------- مكتبة المساعدة (بدون API) ---------- */
const arNorm = s => String(s || '').toLowerCase().replace(/[ً-ْـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/[^\p{L}\p{N}\s]/gu, ' ');
async function asstKB() {
  if (ASST.kb) return ASST.kb;
  try { const r = await fetch('/kb.json'); if (r.ok) { const j = await r.json(); if (Array.isArray(j)) ASST.kb = j; } } catch (e) {}
  return ASST.kb || [];
}
function kbAnswer(kb, q) {
  const nq = arNorm(q), toks = nq.split(/\s+/).filter(w => w.length >= 2);
  const scored = kb.map(k => {
    let sc = 0;
    (k.keys || []).forEach(key => { const nk = arNorm(key).trim(); if (nk.length >= 4 || nk.includes(' ') ? nq.includes(nk) : (nk.length >= 2 && toks.includes(nk))) sc += 3 + Math.min(nk.length, 8) / 8; });
    const body = arNorm(k.title + ' ' + k.text);
    toks.forEach(w => { if (body.includes(w)) sc += 0.6; });
    return { k, sc };
  }).filter(x => x.sc > 0).sort((a, b) => b.sc - a.sc);
  if (!scored.length || scored[0].sc < 1.5) return t('asst_none');
  let out = scored[0].k.title + '\n' + scored[0].k.text;
  if (scored[1] && scored[1].sc >= scored[0].sc * 0.6) out += '\n\n' + t('asst_more') + scored[1].k.title;
  return out;
}

/* ---------- عرض المحادثة ---------- */
const ACT_ICON = { add_client: 'users', add_task: 'tasks', add_post: 'calendar', open: 'link' };
function actClient(a) { const n = String(a.client || '').trim().toLowerCase(); if (!n) return null; return S.clients.find(c => c.name.trim().toLowerCase() === n) || S.clients.find(c => c.name.toLowerCase().includes(n) || n.includes(c.name.trim().toLowerCase())) || null; }
function actText(a) {
  const c = actClient(a), pri = { low: 'pri_low', med: 'pri_med', high: 'pri_high' };
  if (a.type === 'add_client') return `<b>${t('act_add_client')}:</b> ${esc(a.name)}${a.industry ? ' · ' + esc(a.industry) : ''}${a.fee ? ' · ' + (+a.fee).toLocaleString(loc()) : ''}`;
  if (a.type === 'add_task') return `<b>${t('act_add_task')}:</b> ${esc(a.title)}${c ? ' · ' + esc(c.name) : ''}${a.due ? ' · ' + esc(a.due) : ''} · ${t(pri[a.priority] || 'pri_med')}`;
  if (a.type === 'add_post') return `<b>${t('act_add_post')}:</b> ${esc(a.platform)} · ${esc(a.date)}${a.time ? ' ' + esc(a.time) : ''}${c ? ' · ' + esc(c.name) : ''}<br><small>${esc(a.caption.length > 140 ? a.caption.slice(0, 140) + '…' : a.caption)}</small>`;
  return `<b>${t('act_open')}:</b> ${esc(t('nav_' + a.view))}`;
}
function actCards(mi, m) {
  if (!m.actions || !m.actions.length) return '';
  const pending = m.actions.filter((_, i) => !(m.state && m.state[i])).length;
  return `<div class="act-list">${m.actions.map((a, i) => {
    const st = (m.state && m.state[i]) || '';
    const tail = st === 'done' ? `<span class="pill ok">${ic('check')} ${t('asst_done')}</span>` : st === 'skip' ? `<span class="pill">${t('asst_skipped')}</span>`
      : st ? `<span class="pill bad">${esc(st)}</span>`
      : `<button class="btn sm primary" data-action="asst-run" data-id="${mi}:${i}">${t('asst_run')}</button><button class="btn sm ghost" data-action="asst-skip" data-id="${mi}:${i}">${t('asst_skip')}</button>`;
    return `<div class="act-card"><span class="ai">${ic(ACT_ICON[a.type] || 'zap')}</span><div class="at">${actText(a)}</div><div class="ab">${tail}</div></div>`;
  }).join('')}${pending > 1 ? `<button class="btn sm" data-action="asst-run-all" data-id="${mi}">${t('asst_run_all')}</button>` : ''}</div>`;
}
function asstHtml() {
  let out = '';
  if (!ASST.msgs.length) {
    out += `<div class="msg"><div class="bub"><b class="who">${t('asst_title')}</b><p>${t('asst_hello')}</p></div></div><div class="asst-chips">${ASST_CHIPS.map((k, i) => `<button class="sug" data-action="asst-chip" data-id="${i}">${t(k)}</button>`).join('')}</div>`;
  }
  ASST.msgs.forEach((m, i) => {
    const mine = m.role === 'user';
    out += `<div class="msg ${mine ? 'mine' : ''}"><div class="bub">${mine ? '' : `<b class="who">${t('asst_title')}</b>`}<p>${esc(m.content)}</p>${actCards(i, m)}</div></div>`;
  });
  if (ASST.busy) out += `<div class="msg"><div class="bub"><div class="typing" aria-label="${t('asst_thinking')}"><i></i><i></i><i></i></div></div></div>`;
  return out;
}
function asstPaint(stick = true) {
  const el = $('#asst-list'); if (!el) return;
  el.innerHTML = asstHtml(); if (stick) el.scrollTop = el.scrollHeight;
}
VIEWS.assistant = function () {
  setTimeout(() => { asstPaint(); const i = $('#asst-input'); if (i && !('ontouchstart' in window)) i.focus(); }, 0);
  return `<section class="card chat-card asst"><div class="chat-head"><span class="ic">${ic('bot')}</span><div><h3>${t('asst_title')}</h3><small class="mut">${t('asst_sub')}</small></div>
      <button class="btn sm ghost" data-action="asst-clear" style="margin-inline-start:auto">${t('asst_clear')}</button></div>
    <div id="asst-list" class="chat-list" aria-live="polite"></div>
    <form id="asst-form" class="chat-form" autocomplete="off"><textarea id="asst-input" rows="1" maxlength="1500" placeholder="${t('asst_ph')}" aria-label="${t('asst_ph')}"></textarea>
      <button class="btn primary" type="submit" aria-label="${t('asst_send')}">${ic('send')}</button></form></section>`;
};

/* ---------- الإرسال ---------- */
async function asstSend(text) {
  text = String(text || '').trim(); if (!text || ASST.busy) return;
  ASST.msgs.push({ role: 'user', content: text }); ASST.busy = true; asstPaint();
  const msgs = ASST.msgs.slice(-10).map(m => ({ role: m.role, content: m.content }));
  const context = { today: dstr(new Date()), lang: S.lang, clients: S.clients.slice(0, 40).map(c => ({ name: c.name })), staff: isStaff() };
  let reply = '', actions = [], note = '';
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (CLOUD && sb) { const { data } = await sb.auth.getSession(); if (data && data.session) headers.Authorization = 'Bearer ' + data.session.access_token; }
    const r = await fetch('/api/assistant', { method: 'POST', headers, body: JSON.stringify({ messages: msgs, context }) });
    if (r.status === 429) { const j = await r.json().catch(() => ({})); throw Object.assign(new Error('rl'), { show: t('ai_limit') }); }
    if (r.status === 401) throw Object.assign(new Error('auth'), { show: t('asst_unauth') });
    let j = {}; try { j = await r.json(); } catch (e) {}
    if (!r.ok) throw Object.assign(new Error('x'), { quota: j.error === 'quota' });
    reply = j.reply || ''; actions = Array.isArray(j.actions) ? j.actions : [];
    if (!reply && actions.length) reply = t('asst_ready');
  } catch (e) {
    if (e && e.show) { reply = e.show; }
    else { reply = kbAnswer(await asstKB(), text); note = e && e.quota ? t('asst_quota') : t('asst_offline'); }
  }
  ASST.busy = false;
  ASST.msgs.push({ role: 'assistant', content: note ? reply + '\n\n— ' + note : reply, actions, state: [] });
  asstPaint();
}

/* ---------- تنفيذ الأوامر (بعد تأكيد المستخدم) ---------- */
function asstExec(a) {
  if (a.type === 'open') { if (VIEWS[a.view]) location.hash = a.view; return 'done'; }
  if (a.type === 'add_client') {
    if (S.clients.some(c => c.name.trim().toLowerCase() === a.name.trim().toLowerCase())) return t('act_exists');
    if (atLimit()) return t('act_limit');
    S.clients.push({ id: uid(), name: a.name, industry: a.industry || '', fee: +a.fee || 0, contact: '', color: COLORS[S.clients.length % COLORS.length] });
    save(); return 'done';
  }
  const c = actClient(a);
  if (a.type === 'add_task') { S.tasks.push({ id: uid(), title: a.title, client: c ? c.id : '', due: a.due || '', priority: a.priority || 'med', status: 'todo' }); save(); return c || !a.client ? 'done' : t('act_no_client'); }
  if (a.type === 'add_post') { S.posts.push({ id: uid(), client: c ? c.id : '', platform: a.platform, date: a.date, time: a.time || '', status: 'draft', caption: a.caption }); save(); return c || !a.client ? 'done' : t('act_no_client'); }
  return 'skip';
}
function asstRunOne(mi, ai) {
  const m = ASST.msgs[mi]; if (!m || !m.actions || !m.actions[ai] || (m.state && m.state[ai])) return;
  m.state = m.state || []; const res = asstExec(m.actions[ai]);
  m.state[ai] = res; if (m.actions[ai].type !== 'open') { toast(res === 'done' ? t('asst_done') : res); }
}
Object.assign(ACTIONS, {
  'asst-chip'(id) { asstSend(t(ASST_CHIPS[+id])); },
  'asst-clear'() { ASST.msgs = []; ASST.busy = false; asstPaint(false); },
  'asst-run'(id) { const [m, a] = id.split(':').map(Number); asstRunOne(m, a); if (!(ASST.msgs[m].actions[a].type === 'open')) asstPaint(false); },
  'asst-skip'(id) { const [m, a] = id.split(':').map(Number); const x = ASST.msgs[m]; if (x && !(x.state && x.state[a])) { x.state = x.state || []; x.state[a] = 'skip'; asstPaint(false); } },
  'asst-run-all'(id) {
    const m = +id, x = ASST.msgs[m]; if (!x) return;
    let navTo = null;
    x.actions.forEach((a, i) => { if (x.state && x.state[i]) return; if (a.type === 'open') { navTo = a; x.state = x.state || []; x.state[i] = 'done'; } else asstRunOne(m, i); });
    asstPaint(false); if (navTo) location.hash = navTo.view;
  }
});
document.addEventListener('submit', e => {
  if (e.target && e.target.id === 'asst-form') { e.preventDefault(); const i = $('#asst-input'); if (i) { const v = i.value; i.value = ''; i.style.height = ''; asstSend(v); } }
});
document.addEventListener('keydown', e => {
  if (e.target && e.target.id === 'asst-input' && e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); const f = $('#asst-form'); if (f) f.requestSubmit ? f.requestSubmit() : f.dispatchEvent(new Event('submit', { cancelable: true })); }
});
document.addEventListener('input', e => { const el = e.target; if (el && el.id === 'asst-input') { el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight, 140) + 'px'; } });
