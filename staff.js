// /api/staff/* — حسابات الموظفين (بيتعملوا من صاحب الشركة، ويسجلوا دخول بيوزرنيم وباسورد)
//   POST /api/staff/login   {username, password}        → جلسة Supabase للموظف (من غير توكن)
//   POST /api/staff/save    {member_id, username, password?}  (صاحب الشركة) إنشاء/تعديل حساب دخول لموظف
//   POST /api/staff/remove  {member_id}                         (صاحب الشركة) حذف حساب الدخول
// المتغيرات (Cloudflare → Worker → Settings → Variables and Secrets):
//   SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY (Secret، مهم جداً مايبانش في المتصفح)
//   STAFF_EMAIL_DOMAIN  اختياري: نطاق وهمي للإيميل الداخلي للموظف (الافتراضي staff.socialdia-nexus.app). مفيش إيميلات بتتبعت عليه.
import { json } from '../functions/api/ai.js';

const UNAME = /^[a-z0-9._-]{3,30}$/;
const MID = /^[A-Za-z0-9_-]{1,64}$/;
const MAX_STAFF = 50;
const tries = new Map(); // best-effort: بيتصفّر لما الـ isolate يتبدّل

const cfg = env => ({
  url: String(env.SUPABASE_URL || '').replace(/\/$/, ''), anon: env.SUPABASE_ANON_KEY || '', srv: env.SUPABASE_SERVICE_ROLE_KEY || '',
  domain: String(env.STAFF_EMAIL_DOMAIN || 'staff.socialdia-nexus.app').toLowerCase()
});
const emailOf = (c, username) => `${username}@${c.domain}`;
const enc = encodeURIComponent;

function throttle(key, max) {
  const now = Date.now(), arr = (tries.get(key) || []).filter(t => now - t < 600e3);
  if (arr.length >= max) { tries.set(key, arr); return false; }
  arr.push(now); tries.set(key, arr); return true;
}

const srvHeaders = c => ({ apikey: c.srv, Authorization: 'Bearer ' + c.srv, 'content-type': 'application/json' });
async function rest(c, path, opts = {}) {
  const r = await fetch(c.url + '/rest/v1/' + path, { ...opts, headers: { ...srvHeaders(c), ...(opts.headers || {}) } });
  let body = null; try { body = await r.json(); } catch (e) {}
  return { ok: r.ok, status: r.status, body };
}
async function admin(c, method, path, payload) {
  const r = await fetch(c.url + '/auth/v1/admin/users' + path, { method, headers: srvHeaders(c), body: payload ? JSON.stringify(payload) : undefined });
  let body = null; try { body = await r.json(); } catch (e) {}
  return { ok: r.ok, status: r.status, body };
}

// صاحب الشركة (مش موظف) من التوكن
async function owner(request, c) {
  const h = request.headers.get('authorization') || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : '';
  if (!token) return { err: json({ error: 'unauthorized' }, 401) };
  let u = null;
  try {
    const r = await fetch(c.url + '/auth/v1/user', { headers: { apikey: c.anon, Authorization: 'Bearer ' + token } });
    if (r.ok) u = await r.json();
  } catch (e) {}
  if (!u || !u.id) return { err: json({ error: 'unauthorized' }, 401) };
  if (u.app_metadata && u.app_metadata.role === 'staff') return { err: json({ error: 'forbidden' }, 403) };
  return { user: u };
}

async function login(request, c, b) {
  const username = String(b.username || '').trim().toLowerCase(), password = String(b.password || '');
  if (!UNAME.test(username) || !password || password.length > 200) return json({ error: 'invalid_credentials' }, 401);
  const ip = request.headers.get('cf-connecting-ip') || 'x';
  if (!throttle('ip:' + ip, 30) || !throttle('u:' + username, 8)) return json({ error: 'too_many_attempts' }, 429);
  let r;
  try {
    r = await fetch(c.url + '/auth/v1/token?grant_type=password', {
      method: 'POST', headers: { apikey: c.anon, 'content-type': 'application/json' },
      body: JSON.stringify({ email: emailOf(c, username), password })
    });
  } catch (e) { return json({ error: 'upstream' }, 502); }
  if (!r.ok) return json({ error: 'invalid_credentials' }, 401);
  const d = await r.json();
  if (!d.access_token || !d.user || !d.user.app_metadata || d.user.app_metadata.role !== 'staff') return json({ error: 'invalid_credentials' }, 401);
  return json({ access_token: d.access_token, refresh_token: d.refresh_token, expires_in: d.expires_in });
}

async function save(c, o, b) {
  const memberId = String(b.member_id || ''), username = String(b.username || '').trim().toLowerCase(), password = String(b.password || '');
  if (!MID.test(memberId)) return json({ error: 'bad_request' }, 400);
  if (username && !UNAME.test(username)) return json({ error: 'username_invalid' }, 400);
  if (password && (password.length < 8 || password.length > 72)) return json({ error: 'weak_password' }, 400);

  // الموظف لازم يكون فعلاً في فريق الشركة
  const pr = await rest(c, `profiles?owner=eq.${enc(o.id)}&id=eq.me&select=data`);
  const team = pr.ok && pr.body && pr.body[0] && pr.body[0].data && pr.body[0].data.team;
  if (!Array.isArray(team) || !team.some(m => m && m.id === memberId)) return json({ error: 'member_not_found' }, 404);

  const ex = await rest(c, `staff_members?owner=eq.${enc(o.id)}&member_id=eq.${enc(memberId)}&select=staff_user_id,username`);
  if (!ex.ok) return json({ error: 'upstream' }, 502);
  const cur = ex.body && ex.body[0];
  const taken = async name => { const q = await rest(c, `staff_members?username=eq.${enc(name)}&select=member_id`); return !q.ok || (q.body && q.body.length > 0); };

  if (cur) {
    const upd = {};
    if (password) upd.password = password;
    if (username && username !== cur.username) {
      if (await taken(username)) return json({ error: 'username_taken' }, 409);
      upd.email = emailOf(c, username); upd.email_confirm = true;
    }
    if (!Object.keys(upd).length) return json({ ok: true, username: cur.username });
    const r = await admin(c, 'PUT', '/' + cur.staff_user_id, upd);
    if (!r.ok) return json({ error: 'upstream' }, 502);
    if (upd.email) {
      const p = await rest(c, `staff_members?owner=eq.${enc(o.id)}&member_id=eq.${enc(memberId)}`, { method: 'PATCH', body: JSON.stringify({ username }), headers: { Prefer: 'return=minimal' } });
      if (!p.ok) { await admin(c, 'PUT', '/' + cur.staff_user_id, { email: emailOf(c, cur.username), email_confirm: true }); return json({ error: 'upstream' }, 502); }
    }
    return json({ ok: true, username: username || cur.username });
  }

  if (!username || !password) return json({ error: 'bad_request' }, 400);
  const cnt = await rest(c, `staff_members?owner=eq.${enc(o.id)}&select=member_id`);
  if (cnt.ok && cnt.body && cnt.body.length >= MAX_STAFF) return json({ error: 'limit_reached' }, 400);
  if (await taken(username)) return json({ error: 'username_taken' }, 409);
  const cr = await admin(c, 'POST', '', {
    email: emailOf(c, username), password, email_confirm: true,
    app_metadata: { role: 'staff', owner: o.id, member_id: memberId }, user_metadata: { username }
  });
  if (!cr.ok || !cr.body || !cr.body.id) return json({ error: cr.status === 422 ? 'username_taken' : 'upstream' }, cr.status === 422 ? 409 : 502);
  const ins = await rest(c, 'staff_members', { method: 'POST', body: JSON.stringify({ owner: o.id, member_id: memberId, staff_user_id: cr.body.id, username }), headers: { Prefer: 'return=minimal' } });
  if (!ins.ok) { await admin(c, 'DELETE', '/' + cr.body.id); return json({ error: ins.status === 409 ? 'username_taken' : 'upstream' }, ins.status === 409 ? 409 : 502); }
  return json({ ok: true, username });
}

async function remove(c, o, b) {
  const memberId = String(b.member_id || '');
  if (!MID.test(memberId)) return json({ error: 'bad_request' }, 400);
  const ex = await rest(c, `staff_members?owner=eq.${enc(o.id)}&member_id=eq.${enc(memberId)}&select=staff_user_id`);
  if (!ex.ok) return json({ error: 'upstream' }, 502);
  const cur = ex.body && ex.body[0];
  if (!cur) return json({ ok: true });
  const d = await rest(c, `staff_members?owner=eq.${enc(o.id)}&member_id=eq.${enc(memberId)}`, { method: 'DELETE', headers: { Prefer: 'return=minimal' } });
  if (!d.ok) return json({ error: 'upstream' }, 502);     // أول حاجة نقفل الوصول
  const r = await admin(c, 'DELETE', '/' + cur.staff_user_id);
  if (!r.ok && r.status !== 404) return json({ error: 'upstream' }, 502);
  return json({ ok: true });
}

export async function handleStaff(request, env) {
  const path = new URL(request.url).pathname.replace(/\/$/, '');
  const action = path.split('/').pop();
  if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405, { Allow: 'POST' });
  const c = cfg(env);
  if (!c.url || !c.anon || !c.srv) return json({ error: 'not_configured' }, 503);
  let b = {};
  try { b = (await request.json()) || {}; } catch (e) { b = {}; }
  if (action === 'login') return login(request, c, b);
  if (action !== 'save' && action !== 'remove') return json({ error: 'not_found' }, 404);
  const o = await owner(request, c);
  if (o.err) return o.err;
  return action === 'save' ? save(c, o.user, b) : remove(c, o.user, b);
}
