// POST /api/assistant — مساعد NEXUS
//   body: { messages:[{role,content}], context:{ today:'YYYY-MM-DD', lang:'ar'|'en', clients:[{name}], staff:boolean } }
//   رد: { reply, actions:[...] }  والأوامر بتتنفّذ في المتصفح بعد تأكيد المستخدم (السيرفر مش بيغيّر أي بيانات).
// الموديل: Cloudflare Workers AI (موديل مفتوح) من غير مفاتيح خارجية، ومعرفة المنصة من public/kb.json.
import { authUser, allowed, json, callModel, clip } from '../functions/api/ai.js';

const VIEWS = ['dashboard', 'clients', 'tasks', 'calendar', 'chat', 'content', 'trends', 'ai', 'profile', 'settings', 'assistant'];
const PLATFORMS = ['Instagram', 'Facebook', 'TikTok', 'LinkedIn', 'X', 'YouTube'];
const DAYS_AR = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const DATE = /^\d{4}-\d{2}-\d{2}$/, TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

let kbCache = null;
async function loadKB(env, origin) {
  if (kbCache) return kbCache;
  try {
    const r = await env.ASSETS.fetch(new Request(origin + '/kb.json'));
    if (r.ok) { const j = await r.json(); if (Array.isArray(j)) kbCache = j; }
  } catch (e) {}
  return kbCache || [];
}

export function buildSystem(kb, ctx, who) {
  const today = DATE.test(ctx.today) ? ctx.today : new Date().toISOString().slice(0, 10);
  const wd = DAYS_AR[new Date(today + 'T12:00:00Z').getUTCDay()];
  const clients = (ctx.clients || []).slice(0, 40).map(c => clip(c && c.name, 60)).filter(Boolean);
  const kbText = kb.map(k => `## ${k.title}\n${k.text}`).join('\n\n');
  return `أنت "مساعد NEXUS"، المساعد الذكي الرسمي لمنصة Socialdia Nexus لوكالات التسويق.
مهامك:
1) تجاوب أسئلة المستخدم عن المنصة وخدماتها اعتماداً على "معرفة المنصة" تحت فقط. لو السؤال عن حاجة مش مذكورة فيها قول إنك مش متأكد، ومتخترعش ميزات أو أسعار أو أرقام.
2) تكتب محتوى تسويقي وكابشنز وأفكار وخطط محتوى لما يُطلب منك.
3) تنفّذ أوامر جوه المنصة عن طريق actions.

اللغة: ردّ بنفس لغة المستخدم. لو بالعربي استخدم العامية المصرية المبسطة. نص عادي من غير markdown (من غير ** أو # أو جداول)، قصير ومباشر.

شكل الرد: كائن JSON واحد بس ومن غير أي نص خارجه:
{"reply":"ردك للمستخدم","actions":[]}

الأوامر المتاحة داخل actions (كل أمر كائن):
{"type":"add_client","name":"","industry":"","fee":0}
{"type":"add_task","title":"","client":"","due":"YYYY-MM-DD","priority":"low|med|high"}
{"type":"add_post","client":"","platform":"Instagram|Facebook|TikTok|LinkedIn|X|YouTube","date":"YYYY-MM-DD","time":"HH:MM","caption":"","status":"draft"}
{"type":"open","view":"dashboard|clients|tasks|calendar|chat|content|trends|ai|profile|settings"}

قواعد الأوامر:
- نفّذ أمر بس لو المستخدم طلبه صراحة (أضف، اعمل، جهّز، افتح...). لو في بيان أساسي ناقص (اسم العميل الجديد أو عنوان المهمة) اسأل بدل ما تخمّن واترك actions فاضية.
- التواريخ بصيغة YYYY-MM-DD. النهارده ${today} (${wd}). "بكرة" = اليوم + 1، و"بعد بكرة" = اليوم + 2، و"الأسبوع الجاي" = اليوم + 7.
- client لازم يكون اسماً من قائمة العملاء الحالية بالظبط، أو "" لو مش محدد.
- الكابشن في add_post اكتبه كامل وجاهز للنشر بأسلوب مناسب للمنصة.
- مفيش حذف ولا تعديل اشتراكات أو إعدادات ولا نشر على حسابات السوشيال (المنصة مش بتنشر تلقائياً). لو طلب حاجة من دي اشرح إنها مش متاحة وقدّم البديل.
- أقصى عدد أوامر 5.

المستخدم: ${who === 'staff' ? 'موظف في شركة' : 'صاحب شركة'}.
العملاء الحاليين: ${clients.length ? clients.join('، ') : 'لا يوجد عملاء'}.

معرفة المنصة:
${kbText}`;
}

// بيطلّع JSON من رد الموديل حتى لو لفّه في code fence أو كتب كلام قبله
export function parseReply(text) {
  const raw = String(text || '').replace(/```(?:json)?/gi, '').trim();
  const a = raw.indexOf('{'), b = raw.lastIndexOf('}');
  if (a >= 0 && b > a) {
    try {
      const j = JSON.parse(raw.slice(a, b + 1));
      if (j && typeof j === 'object') return { reply: clip(j.reply, 3000).trim(), actions: cleanActions(j.actions) };
    } catch (e) {}
  }
  return { reply: raw.slice(0, 3000), actions: [] };
}

export function cleanActions(list) {
  if (!Array.isArray(list)) return [];
  const out = [];
  for (const a of list.slice(0, 5)) {
    if (!a || typeof a !== 'object') continue;
    if (a.type === 'add_client') {
      const name = clip(a.name, 80).trim(); if (!name) continue;
      out.push({ type: 'add_client', name, industry: clip(a.industry, 80).trim(), fee: Math.max(0, Math.min(10000000, Number(a.fee) || 0)) });
    } else if (a.type === 'add_task') {
      const title = clip(a.title, 160).trim(); if (!title) continue;
      out.push({ type: 'add_task', title, client: clip(a.client, 80).trim(), due: DATE.test(a.due) ? a.due : '', priority: ['low', 'med', 'high'].includes(a.priority) ? a.priority : 'med' });
    } else if (a.type === 'add_post') {
      const caption = clip(a.caption, 2200).trim();
      if (!caption || !DATE.test(a.date)) continue;
      out.push({ type: 'add_post', client: clip(a.client, 80).trim(), platform: PLATFORMS.includes(a.platform) ? a.platform : 'Instagram', date: a.date, time: TIME.test(a.time) ? a.time : '', caption, status: 'draft' });
    } else if (a.type === 'open' && VIEWS.includes(a.view)) {
      out.push({ type: 'open', view: a.view });
    }
  }
  return out;
}

export async function handleAssistant(request, env) {
  if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405, { Allow: 'POST' });
  if (!env.AI && !env.GEMINI_API_KEY && !env.ANTHROPIC_API_KEY) return json({ error: 'no_key' }, 503);
  const SB_URL = (env.SUPABASE_URL || '').replace(/\/$/, ''), SB_KEY = env.SUPABASE_ANON_KEY || '';
  const u = await authUser(request, SB_URL, SB_KEY);
  if (!u) return json({ error: 'unauthorized' }, 401);
  if (!allowed('asst:' + u.id, (Number(env.AI_HOURLY_LIMIT) || 30) * 2)) return json({ error: 'rate_limited' }, 429);

  let b = {};
  try { b = (await request.json()) || {}; } catch (e) { b = {}; }
  const msgs = (Array.isArray(b.messages) ? b.messages : []).slice(-10)
    .map(m => ({ role: m && m.role === 'assistant' ? 'assistant' : 'user', content: clip(m && m.content, 1500).trim() }))
    .filter(m => m.content);
  if (!msgs.length || msgs[msgs.length - 1].role !== 'user') return json({ error: 'bad_request' }, 400);
  const ctx = b.context && typeof b.context === 'object' ? b.context : {};

  const kb = await loadKB(env, new URL(request.url).origin);
  const system = buildSystem(kb, ctx, ctx.staff ? 'staff' : 'owner');
  try {
    const text = await callModel(env, system, null, { messages: msgs, maxTokens: 1500, temperature: 0.4, json: true });
    const r = parseReply(text);
    if (!r.reply && !r.actions.length) return json({ error: 'empty' }, 502);
    return json(r);
  } catch (e) {
    if (e && e.code === 'quota') return json({ error: 'quota' }, 503);
    return json({ error: e && e.status ? 'upstream_' + e.status : 'server_error' }, 502);
  }
}
