// Cloudflare Pages Function — المسار: /api/ai
// Cloudflare → Pages → المشروع → Settings → Variables and Secrets:
//   GEMINI_API_KEY      (Secret) مفتاح Google Gemini  } واحد منهم على الأقل. لو الاتنين موجودين
//   ANTHROPIC_API_KEY   (Secret) مفتاح Claude          } بيتستخدم Gemini
//   GEMINI_MODEL        اختياري، الافتراضي gemini-2.5-flash
//   SUPABASE_URL        نفس الـ Project URL        } الاتنين موجودين: الدخول إجباري
//   SUPABASE_ANON_KEY   نفس الـ anon key           } والحد الساعي لكل مستخدم
//   AI_HOURLY_LIMIT     اختياري، الافتراضي 30 طلب/ساعة لكل مستخدم
//   AI_MODEL            اختياري (لـ Claude)، الافتراضي claude-haiku-5-5

const hits = new Map(); // best-effort: بيتصفّر لما الـ isolate يتبدّل

const TOOLS = {
  caption: 'Write 2 alternative social media captions with a hook, short body, call-to-action and relevant hashtags.',
  ad: 'Write a paid-ad copy set: 3 headlines (max 40 chars), 2 primary texts, and 2 call-to-action options.',
  script: 'Write a 30-45 second short-video script as scenes: Hook (first 3s), Scenes with on-screen visual + voiceover, and CTA.',
  ideas: 'Give 8 creative content ideas (format + one-line concept each) mixed between reels, carousels, stories and posts.',
  brief: 'Write a concise campaign brief: objective, target audience, key message, content pillars, deliverables, KPIs.'
};

const clip = (v, n) => String(v || '').slice(0, n);

async function authUser(request, SB_URL, SB_KEY) {
  if (!SB_URL || !SB_KEY) return { id: 'anon' }; // وضع مفتوح (للتجربة بس)
  const h = request.headers.get('authorization') || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : '';
  if (!token) return null;
  try {
    const r = await fetch(SB_URL + '/auth/v1/user', { headers: { apikey: SB_KEY, Authorization: 'Bearer ' + token } });
    if (!r.ok) return null;
    const u = await r.json();
    return u && u.id ? { id: u.id } : null;
  } catch (e) {
    return null;
  }
}

function allowed(id, LIMIT) {
  const now = Date.now();
  const arr = (hits.get(id) || []).filter(ts => now - ts < 3600e3);
  if (arr.length >= LIMIT) { hits.set(id, arr); return false; }
  arr.push(now);
  hits.set(id, arr);
  return true;
}

const json = (obj, status = 200, extra = {}) =>
  new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json', ...extra } });

export async function onRequest({ request, env }) {
  if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405, { Allow: 'POST' });
  const gKey = env.GEMINI_API_KEY, aKey = env.ANTHROPIC_API_KEY;
  if (!gKey && !aKey) return json({ error: 'no_key' }, 503);

  const SB_URL = (env.SUPABASE_URL || '').replace(/\/$/, '');
  const SB_KEY = env.SUPABASE_ANON_KEY || '';
  const LIMIT = Number(env.AI_HOURLY_LIMIT) || 30;

  const u = await authUser(request, SB_URL, SB_KEY);
  if (!u) return json({ error: 'unauthorized' }, 401);
  if (!allowed(u.id, LIMIT)) return json({ error: 'rate_limited' }, 429);

  let b = {};
  try { b = (await request.json()) || {}; } catch (e) { b = {}; }

  const tool = TOOLS[b.tool] ? b.tool : 'caption';
  const lang = b.lang === 'en' ? 'English' : 'Egyptian Arabic (colloquial, natural, not stiff)';

  const system =
    'You are a senior copywriter and strategist at a marketing agency. ' +
    'Be specific, creative and practical. No filler or meta-commentary. Plain text only, no markdown symbols like ** or # (except hashtags).';

  const user = [
    TOOLS[tool],
    `Output language: ${lang}.`,
    b.brand ? `Brand: ${clip(b.brand, 80)}` : '',
    b.industry ? `Industry: ${clip(b.industry, 80)}` : '',
    b.tone ? `Brand tone: ${clip(b.tone, 120)}` : '',
    `Topic / product: ${clip(b.topic, 600)}`
  ].filter(Boolean).join('\n');

  try {
    const text = await callModel(env, system, user, { maxTokens: 2000 });
    if (!text) return json({ error: 'empty' }, 502);
    return json({ text });
  } catch (e) {
    return json({ error: e && e.status ? 'upstream_' + e.status : 'server_error' }, e && e.status ? 502 : 500);
  }
}

// نداء موحّد للنموذج (Gemini أو Claude). opts.json = true بيطلب JSON بس. بيرمي { status } لو الـ API رجّع خطأ.
export async function callModel(env, system, user, opts = {}) {
  const gKey = env.GEMINI_API_KEY, aKey = env.ANTHROPIC_API_KEY;
  if (!gKey && !aKey) throw Object.assign(new Error('no_key'), { code: 'no_key' });
  let r, text;
  if (gKey) {
    const gm = env.GEMINI_MODEL || 'gemini-2.5-flash';
    const gen = { maxOutputTokens: opts.maxTokens || 2000 };
    if (opts.json) gen.responseMimeType = 'application/json';
    if (/flash/.test(gm)) gen.thinkingConfig = { thinkingBudget: 0 }; // بدون تفكير داخلي: أسرع وأرخص
    r = await fetch('https://generativelanguage.googleapis.com/v1beta/models/' + encodeURIComponent(gm) + ':generateContent', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-goog-api-key': gKey },
      body: JSON.stringify({ systemInstruction: { parts: [{ text: system }] }, contents: [{ role: 'user', parts: [{ text: user }] }], generationConfig: gen })
    });
    if (!r.ok) throw Object.assign(new Error('upstream'), { status: r.status });
    const j = await r.json();
    text = ((j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts) || []).map(p => p.text || '').join('').trim();
  } else {
    r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': aKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: env.AI_MODEL || 'claude-haiku-5-5', max_tokens: Math.min(opts.maxTokens || 1200, 4000), system, messages: [{ role: 'user', content: user }] })
    });
    if (!r.ok) throw Object.assign(new Error('upstream'), { status: r.status });
    const j = await r.json();
    text = (j.content || []).map(p => p.text || '').join('').trim();
  }
  return text;
}

export { authUser, allowed, json, clip };
