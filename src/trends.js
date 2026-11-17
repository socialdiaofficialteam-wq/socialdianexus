// /api/trends — باحث الهاشتاجات الرائجة
//   المصدر 1: Google Trends (عمليات البحث الرائجة الآن في الدولة) — مجاني بدون مفتاح
//   المصدر 2: الذكاء الاصطناعي (Gemini/Claude) بيقترح هاشتاجات للمجال والمنصة بناءً على الترند الحقيقي
// ملاحظة: مفيش API رسمي مجاني لعدّاد هاشتاجات إنستجرام/تيك توك، فمش بنعرض أرقام مستخدمة منهم.
import { authUser, allowed, json, callModel, clip } from '../functions/api/ai.js';

const PLATS = ['instagram', 'tiktok', 'facebook', 'x', 'linkedin', 'youtube'];

const decode = s => String(s || '').replace(/<!\[CDATA\[|\]\]>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'").trim();

export function parseTrendsRss(xml) {
  const out = [];
  for (const it of String(xml || '').match(/<item>[\s\S]*?<\/item>/g) || []) {
    const t = /<title>([\s\S]*?)<\/title>/.exec(it), tr = /<ht:approx_traffic>([\s\S]*?)<\/ht:approx_traffic>/.exec(it);
    const topic = t ? decode(t[1]) : '';
    if (topic) out.push({ topic, traffic: tr ? decode(tr[1]) : '' });
  }
  return out.slice(0, 25);
}

// نص → هاشتاج صالح (حروف/أرقام/_ بأي لغة)
export const toTag = s => String(s || '').normalize('NFKC').replace(/^#+/, '').replace(/[\s\-.]+/g, '_')
  .replace(/[^\p{L}\p{N}_]/gu, '').replace(/_+/g, '_').replace(/^_|_$/g, '').slice(0, 40);

async function googleTrends(geo) {
  for (const url of [`https://trends.google.com/trending/rss?geo=${geo}`, `https://trends.google.com/trends/trendingsearches/daily/rss?geo=${geo}`]) {
    try {
      const ctl = new AbortController(), tm = setTimeout(() => ctl.abort(), 6000);
      const r = await fetch(url, { signal: ctl.signal, headers: { 'user-agent': 'Mozilla/5.0 (compatible; SocialdiaNexus/1.0)', accept: 'application/rss+xml,application/xml,text/xml' }, cf: { cacheTtl: 1800, cacheEverything: true } });
      clearTimeout(tm);
      if (!r.ok) continue;
      const list = parseTrendsRss(await r.text());
      if (list.length) return list;
    } catch (e) { /* نجرّب اللي بعده */ }
  }
  return [];
}

function parseJson(txt) {
  const m = String(txt || '').replace(/```(?:json)?/gi, '').trim();
  const a = m.indexOf('{'), b = m.lastIndexOf('}');
  if (a < 0 || b <= a) return null;
  try { return JSON.parse(m.slice(a, b + 1)); } catch (e) { return null; }
}

function countryEn(geo) { try { return new Intl.DisplayNames(['en'], { type: 'region' }).of(geo) || geo; } catch (e) { return geo; } }

async function aiGroups(env, { geo, niche, platform, lang, topics }) {
  const country = countryEn(geo);
  const L = lang === 'en' ? 'English' : 'Arabic (Modern Standard or the local dialect hashtag style people really use)';
  const system = 'You are a senior social media strategist who knows which hashtags real audiences use on each platform in each country. ' +
    'Never invent follower counts or post counts. Reply with JSON only.';
  const user = [
    `Country: ${country} (${geo}). Business field: ${niche}. Platform: ${platform}. Hashtag language: ${L}.`,
    topics.length ? `Real search trends in this country right now (from Google Trends): ${topics.slice(0, 15).map(x => x.topic).join(' | ')}` : 'No live trend data is available for this country.',
    'Return JSON: {"niche":[{"tag":"","why":""}],"broad":[{"tag":"","why":""}],"local":[{"tag":"","why":""}]}',
    '- niche: 12 hashtags specific to the business field and what works on this platform.',
    '- broad: 8 high-reach hashtags commonly used on this platform that fit the field.',
    '- local: 8 hashtags tied to this country/culture/seasonal moments (use the country’s own language if that is how locals tag, otherwise the requested language).',
    '- Where a real trend above genuinely fits the field, build a hashtag from it.',
    '- tag: no # symbol, no spaces (use _ between words), max 30 chars. why: max 10 words, plain.'
  ].join('\n');
  const txt = await callModel(env, system, user, { json: true, maxTokens: 1800 });
  const j = parseJson(txt);
  if (!j) return [];
  const seen = new Set(), out = [];
  for (const key of ['niche', 'broad', 'local']) {
    const tags = [];
    for (const x of Array.isArray(j[key]) ? j[key] : []) {
      const tag = toTag(x && (x.tag || x)), low = tag.toLowerCase();
      if (tag.length < 2 || seen.has(low)) continue;
      seen.add(low); tags.push({ tag, why: clip(x && x.why, 120) });
      if (tags.length >= 14) break;
    }
    if (tags.length) out.push({ key, tags });
  }
  return out;
}

export async function handleTrends(request, env) {
  if (request.method !== 'GET') return json({ error: 'method_not_allowed' }, 405, { Allow: 'GET' });
  const SB_URL = (env.SUPABASE_URL || '').replace(/\/$/, ''), SB_KEY = env.SUPABASE_ANON_KEY || '';
  const u = await authUser(request, SB_URL, SB_KEY);
  if (!u) return json({ error: 'unauthorized' }, 401);

  const q = new URL(request.url).searchParams;
  const geo = String(q.get('country') || '').toUpperCase();
  if (!/^[A-Z]{2}$/.test(geo)) return json({ error: 'bad_country' }, 400);
  const niche = clip(q.get('niche') || 'general', 80).replace(/[\r\n]+/g, ' ').trim() || 'general';
  const platform = PLATS.includes(q.get('platform')) ? q.get('platform') : 'instagram';
  const lang = q.get('lang') === 'en' ? 'en' : 'ar';

  const cacheKey = new Request(`https://cache.nexus.internal/trends/${geo}/${platform}/${lang}/${encodeURIComponent(niche.toLowerCase())}`);
  const cache = typeof caches !== 'undefined' ? caches.default : null;
  if (cache) { const hit = await cache.match(cacheKey); if (hit) return new Response(hit.body, { headers: { 'content-type': 'application/json', 'x-cache': 'hit' } }); }

  if (!allowed('trends:' + u.id, Number(env.TRENDS_HOURLY_LIMIT) || 20)) return json({ error: 'rate_limited' }, 429);

  const topics = await googleTrends(geo);
  const trending = topics.map(x => ({ topic: x.topic, traffic: x.traffic, tag: toTag(x.topic) })).filter(x => x.tag.length >= 2).slice(0, 15);
  const sources = [];
  if (trending.length) sources.push('google');
  let groups = [];
  if (env.AI || env.GEMINI_API_KEY || env.ANTHROPIC_API_KEY) {
    try { groups = await aiGroups(env, { geo, niche, platform, lang, topics }); } catch (e) { groups = []; }
    if (groups.length) sources.push('ai');
  }
  if (!sources.length) return json({ error: 'no_data' }, 503);
  const body = JSON.stringify({ country: geo, sources, trending, groups, updated: new Date().toISOString() });
  if (cache) { try { await cache.put(cacheKey, new Response(body, { headers: { 'content-type': 'application/json', 'cache-control': 'public, max-age=3600' } })); } catch (e) {} }
  return new Response(body, { headers: { 'content-type': 'application/json', 'x-cache': 'miss' } });
}
