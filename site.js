'use strict';
/* =========================================================
   Socialdia Nexus — الصفحة الرئيسية + لوحة تحكم الأدمن
   كل محتوى الموقع العام (نصوص، باقات، ألوان، شعار، تواصل) في كائن SITE،
   وبيتعدّل من لوحة الأدمن (#site) ويتخزّن في Supabase (جدول site_settings).
   ========================================================= */
const SITE_KEY = 'nexus_site_v1';
const clone = o => JSON.parse(JSON.stringify(o));

const DEFAULT_SITE = {
  brand: 'Socialdia Nexus',
  logo: 'logo-mark.png',
  colors: { primary: '#f40268', magenta: '#f01ddc', secondary: '#05c7ea', accent: '#ffc20e', success: '#2e9a02', dark: '#12161c' },
  announce: {
    on: false,
    text_ar: 'نسخة تجريبية مفتوحة — شاركنا رأيك لتطوير المنصة',
    text_en: 'Open beta — share your feedback to help us improve'
  },
  options: { show_signup: true, free_max_clients: 3 },
  hero: {
    title_ar: 'كل شغل وكالتك في مكان واحد',
    title_en: 'Run your whole agency from one place',
    sub_ar: 'Socialdia Nexus منصة اشتراك شهري لوكالات التسويق: عملاء، مهام، تقويم محتوى، وأدوات ذكاء اصطناعي بتكتب لك الكابشنز والإعلانات والسكريبتات.',
    sub_en: 'Socialdia Nexus is a monthly-subscription platform for marketing agencies: clients, tasks, a content calendar, and AI tools that write captions, ads and scripts for you.',
    cta1_ar: 'ابدأ الآن', cta1_en: 'Get started',
    cta2_ar: 'شوف الباقات', cta2_en: 'See plans'
  },
  about: {
    title_ar: 'إيه هو Socialdia Nexus؟',
    title_en: 'What is Socialdia Nexus?',
    text_ar: 'نظام مصمم لوكالات التسويق والـ freelancers في مصر والوطن العربي. بدل ما شغلك يتوزع بين واتساب وشيتات وأدوات كتير، بتلاقي كل حاجة في لوحة واحدة: بتنظّم عملاءك، بتوزّع المهام، بتخطط المحتوى على تقويم واضح، وبتسرّع الكتابة بأدوات الذكاء الاصطناعي.',
    text_en: 'A system built for marketing agencies and freelancers in Egypt and the Arab world. Instead of work scattered across WhatsApp, spreadsheets and many tools, you get one dashboard: organise clients, assign tasks, plan content on a clear calendar, and speed up writing with AI tools.'
  },
  sections: {
    features_title_ar: 'كل اللي تحتاجه لإدارة وكالتك', features_title_en: 'Everything you need to run your agency',
    features_sub_ar: 'أدوات بسيطة وسريعة، مصممة لطريقة شغل الوكالات.', features_sub_en: 'Simple, fast tools designed for how agencies work.',
    steps_title_ar: 'إزاي تبدأ؟', steps_title_en: 'How to get started',
    plans_title_ar: 'الباقات والأسعار', plans_title_en: 'Plans & pricing',
    plans_sub_ar: 'الأسعار بالجنيه المصري، والاشتراك شهري.', plans_sub_en: 'Prices in Egyptian pounds, billed monthly.',
    faq_title_ar: 'أسئلة شائعة', faq_title_en: 'Frequently asked questions'
  },
  stats: [
    { num: '5', label_ar: 'أدوات ذكاء اصطناعي للمحتوى', label_en: 'AI content tools' },
    { num: '6', label_ar: 'منصات سوشيال في تقويم واحد', label_en: 'social platforms in one calendar' },
    { num: '2', label_ar: 'لغتين بدعم كامل للعربي', label_en: 'languages, Arabic-first' },
    { num: '1', label_ar: 'لوحة واحدة لشغل الوكالة كله', label_en: 'dashboard for the whole agency' }
  ],
  features: [
    { icon: '👥', title_ar: 'إدارة العملاء', title_en: 'Client management', text_ar: 'ملف لكل عميل: المجال، الاشتراك الشهري، بيانات التواصل، وكل مهامه وبوستاته.', text_en: 'A profile per client: industry, monthly retainer, contact details, plus all their tasks and posts.' },
    { icon: '✅', title_ar: 'لوحة مهام Kanban', title_en: 'Kanban task board', text_ar: 'اسحب المهمة بين للتنفيذ وقيد التنفيذ وتم، مع أولويات ومواعيد تسليم.', text_en: 'Drag tasks across To do, In progress and Done, with priorities and due dates.' },
    { icon: '📅', title_ar: 'تقويم المحتوى', title_en: 'Content calendar', text_ar: 'خطط بوستات الشهر لكل منصة، وتابع حالة كل بوست من مسودة لحد منشور.', text_en: 'Plan the month’s posts per platform and track each from draft to published.' },
    { icon: '✨', title_ar: 'أدوات الذكاء الاصطناعي', title_en: 'AI tools', text_ar: 'كابشنز وإعلانات وسكريبتات وأفكار وبريفات بنبرة كل براند وبالعامية المصرية.', text_en: 'Captions, ads, scripts, ideas and briefs in each brand’s tone, including Egyptian Arabic.' },
    { icon: '🌐', title_ar: 'عربي وإنجليزي', title_en: 'Arabic & English', text_ar: 'واجهة كاملة بدعم RTL وتبديل فوري بين اللغتين.', text_en: 'A full interface with RTL support and instant language switching.' },
    { icon: '🔒', title_ar: 'بياناتك محمية', title_en: 'Your data is protected', text_ar: 'كل حساب ليه بياناته المنفصلة والمحمية، وتقدر تحمّل نسخة احتياطية في أي وقت.', text_en: 'Every account has separate, protected data, and you can download a backup any time.' }
  ],
  steps: [
    { title_ar: 'أنشئ حسابك', title_en: 'Create your account', text_ar: 'سجّل بالإيميل في أقل من دقيقة وابدأ على طول.', text_en: 'Sign up with your email in under a minute.' },
    { title_ar: 'أضف عملاءك', title_en: 'Add your clients', text_ar: 'سجّل بيانات كل عميل واشتراكه الشهري.', text_en: 'Record each client and their monthly retainer.' },
    { title_ar: 'نظّم الشغل', title_en: 'Organise the work', text_ar: 'وزّع المهام وخطط المحتوى على التقويم.', text_en: 'Assign tasks and plan content on the calendar.' },
    { title_ar: 'سرّع بالـ AI', title_en: 'Speed up with AI', text_ar: 'ولّد كابشنز وسكريبتات وأفكار في ثواني واحفظها كبوستات.', text_en: 'Generate captions, scripts and ideas in seconds and save them as posts.' }
  ],
  plans: [
    {
      id: 'starter', name_ar: 'الأساسية', name_en: 'Starter', price: 299, max_clients: 5, popular: false,
      desc_ar: 'للـ freelancers والوكالات الصغيرة', desc_en: 'For freelancers and small agencies',
      features_ar: 'لوحة مهام Kanban\nتقويم المحتوى\nأدوات الذكاء الاصطناعي (بحد شهري)\nدعم عبر واتساب',
      features_en: 'Kanban task board\nContent calendar\nAI tools (monthly allowance)\nWhatsApp support',
      cta_ar: 'اشترك الآن', cta_en: 'Subscribe'
    },
    {
      id: 'pro', name_ar: 'الاحترافية', name_en: 'Pro', price: 699, max_clients: 25, popular: true,
      desc_ar: 'للوكالات اللي بتكبر', desc_en: 'For growing agencies',
      features_ar: 'كل مميزات الأساسية\nحد أعلى لأدوات الذكاء الاصطناعي\nأعضاء فريق (قريباً)\nأولوية في الدعم',
      features_en: 'Everything in Starter\nHigher AI allowance\nTeam members (coming soon)\nPriority support',
      cta_ar: 'اشترك الآن', cta_en: 'Subscribe'
    },
    {
      id: 'agency', name_ar: 'الوكالات', name_en: 'Agency', price: 1499, max_clients: 0, popular: false,
      desc_ar: 'للوكالات الكبيرة والفرق', desc_en: 'For large agencies and teams',
      features_ar: 'كل مميزات الاحترافية\nأعلى حد للذكاء الاصطناعي\nبوابة العميل (قريباً)\nتقارير بشعار الوكالة (قريباً)\nدعم مخصص',
      features_en: 'Everything in Pro\nHighest AI allowance\nClient portal (coming soon)\nWhite-label reports (coming soon)\nDedicated support',
      cta_ar: 'اشترك الآن', cta_en: 'Subscribe'
    }
  ],
  faq: [
    { q_ar: 'إزاي أدفع وأفعّل اشتراكي؟', q_en: 'How do I pay and activate my plan?', a_ar: 'حالياً الاشتراك بيتم بالتواصل معانا عبر واتساب، وبنفعّل حسابك بعد التأكيد. الدفع الإلكتروني قريباً.', a_en: 'For now, subscriptions are arranged by contacting us on WhatsApp and we activate your account after confirmation. Online payment is coming soon.' },
    { q_ar: 'هل بياناتي آمنة؟', q_en: 'Is my data safe?', a_ar: 'كل حساب ليه بياناته المنفصلة والمحمية، ومتاح تصدّر نسخة احتياطية في أي وقت.', a_en: 'Each account has its own protected data, and you can export a backup at any time.' },
    { q_ar: 'ينفع أستخدم المنصة بالإنجليزي؟', q_en: 'Can I use the platform in English?', a_ar: 'أيوه، الواجهة عربي وإنجليزي مع تبديل فوري من الزرار أعلى الصفحة.', a_en: 'Yes, the interface is Arabic and English with instant switching from the button at the top.' },
    { q_ar: 'ينفع أغيّر الباقة بعدين؟', q_en: 'Can I change my plan later?', a_ar: 'طبعاً، تقدر تترقّى أو تغيّر باقتك في أي وقت بالتواصل معانا.', a_en: 'Of course, you can upgrade or change your plan at any time by contacting us.' }
  ],
  cta: {
    title_ar: 'جاهز تنظّم شغل وكالتك؟', title_en: 'Ready to organise your agency?',
    sub_ar: 'سجّل حسابك وابدأ في دقايق.', sub_en: 'Create your account and start in minutes.',
    btn_ar: 'ابدأ الآن', btn_en: 'Get started'
  },
  contact: { whatsapp: '', phone: '', email: '', facebook: '', instagram: '', tiktok: '', linkedin: '', address_ar: '', address_en: '' },
  footer: { text_ar: 'منصة لإدارة وكالات التسويق — من SOCIALDIA AGENCY', text_en: 'A marketing-agency platform — by SOCIALDIA AGENCY' }
};

/* ---------------- تحميل / حفظ ---------------- */
function deepMerge(base, over) {
  if (over === undefined || over === null) return clone(base);
  if (Array.isArray(base)) return Array.isArray(over) ? clone(over) : clone(base);
  if (base && typeof base === 'object') {
    if (typeof over !== 'object' || Array.isArray(over)) return clone(base);
    const out = {};
    for (const k of new Set([...Object.keys(base), ...Object.keys(over)])) out[k] = k in base ? deepMerge(base[k], over[k]) : over[k];
    return out;
  }
  return typeof over === typeof base ? over : base;
}
function loadSiteLocal() {
  try { const d = JSON.parse(localStorage.getItem(SITE_KEY)); if (d) return deepMerge(DEFAULT_SITE, d); } catch (e) {}
  return clone(DEFAULT_SITE);
}
function cacheSite() { try { localStorage.setItem(SITE_KEY, JSON.stringify(SITE)); } catch (e) {} }
let SITE = loadSiteLocal();

async function loadSiteCloud() {
  if (!sb) return;
  try {
    const { data, error } = await sb.from('site_settings').select('data').eq('id', 'main').maybeSingle();
    if (error) throw error;
    if (data && data.data) { SITE = deepMerge(DEFAULT_SITE, data.data); cacheSite(); }
  } catch (e) { /* الجدول لسه متعملش أو مفيش اتصال: نكمّل بالافتراضي/المحفوظ */ }
  render();
}
async function saveSite(next) {
  const merged = deepMerge(DEFAULT_SITE, next);
  if (CLOUD && sb) {
    const { error } = await sb.from('site_settings').upsert({ id: 'main', data: merged, updated_at: new Date().toISOString() }, { onConflict: 'id' });
    if (error) throw error;
  }
  SITE = merged; cacheSite();
}

/* ---------------- الثيم والمساعدات ---------------- */
const safeColor = (v, d) => (/^#[0-9a-f]{6}$/i.test(String(v)) ? v : d);
function applyTheme(s = SITE) {
  const c = s.colors || {}, d = DEFAULT_SITE.colors, r = document.documentElement.style;
  r.setProperty('--brand', safeColor(c.primary, d.primary));
  r.setProperty('--brand-2', safeColor(c.magenta, d.magenta));
  r.setProperty('--sec', safeColor(c.secondary, d.secondary));
  r.setProperty('--acc', safeColor(c.accent, d.accent));
  r.setProperty('--ok', safeColor(c.success, d.success));
  r.setProperty('--dark', safeColor(c.dark, d.dark));
  const ic = document.querySelector('link[rel="icon"]');
  if (ic && s.logo) ic.href = s.logo;
}
const tx = (o, k) => (o && (o[k + '_' + S.lang] || o[k + '_ar'])) || '';
const lines = s => String(s || '').split('\n').map(x => x.trim()).filter(Boolean);
const safeUrl = u => (/^https?:\/\//i.test(String(u || '').trim()) ? String(u).trim() : '');
function brandHTML() {
  const parts = String(SITE.brand || '').trim().split(/\s+/);
  const a = parts.shift() || '';
  return `<span class="bn"><b>${esc(a)}</b>${parts.length ? ` <em>${esc(parts.join(' '))}</em>` : ''}</span>`;
}
function brandLockup() {
  return `<span class="lockup">${SITE.logo ? `<img class="mark" src="${esc(SITE.logo)}" alt="">` : ''}${brandHTML()}</span>`;
}

const numText = raw => {
  const m = /^(\D*)(\d+(?:\.\d+)?)(.*)$/.exec(String(raw == null ? '' : raw).trim());
  return m ? m[1] + Number(m[2]).toLocaleString(loc()) + m[3] : String(raw == null ? '' : raw);
};
let fxScroll = false;
function initLandingFx() {
  const L = $('#landing');
  if (!L || !L.querySelectorAll) return;
  const reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const count = el => {
    const m = /^(\D*)(\d+(?:\.\d+)?)(.*)$/.exec(String(el.dataset.raw || ''));
    if (!m || reduce) return;
    const to = Number(m[2]), t0 = performance.now(), dur = 1500;
    const f = now => {
      const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = m[1] + Math.round(to * e).toLocaleString(loc()) + m[3];
      if (k < 1) requestAnimationFrame(f);
    };
    requestAnimationFrame(f);
  };
  const items = Array.from(L.querySelectorAll('.rv, .cnt'));
  if (typeof IntersectionObserver === 'undefined' || reduce) return;
  L.classList.add('fx');
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target; io.unobserve(el);
    if (el.classList.contains('cnt')) { count(el); return; }
    el.classList.add('in');
    setTimeout(() => el.classList.add('done'), 1000 + (Number(el.style.getPropertyValue('--i')) || 0) * 90);
  }), { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
  items.forEach(el => io.observe(el));

  // ميل لوحة الهيرو مع الماوس
  const stage = L.querySelector('.ld-stage'), mock = L.querySelector('.ld-mock');
  if (stage && mock) {
    stage.addEventListener('mousemove', e => {
      const r = stage.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      mock.style.setProperty('--ry', (x * 14).toFixed(2) + 'deg');
      mock.style.setProperty('--rx', (-y * 10).toFixed(2) + 'deg');
    });
    stage.addEventListener('mouseleave', () => { mock.style.removeProperty('--ry'); mock.style.removeProperty('--rx'); });
  }
  if (!L._fx) {
    L._fx = true;
    // بقعة ضوء بتتبع الماوس على الكروت
    L.addEventListener('mousemove', e => {
      const c = e.target.closest && e.target.closest('.ld-card, .plan');
      if (!c) return;
      const r = c.getBoundingClientRect();
      c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      c.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  }
  if (!fxScroll) {
    fxScroll = true;
    let tick = false;
    const upd = () => {
      tick = false;
      const h = document.querySelector('.ld-head'), pg = document.querySelector('.ld-progress');
      const y = window.scrollY || 0, max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      if (h && h.classList) h.classList.toggle('scrolled', y > 24);
      if (pg && pg.style) pg.style.setProperty('--p', Math.min(1, y / max).toFixed(4));
    };
    window.addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true });
  }
  if (document.querySelector) { const h = document.querySelector('.ld-head'); if (h && h.classList) h.classList.toggle('scrolled', (window.scrollY || 0) > 24); }
}

function planBullets(p) {
  const b = lines(tx(p, 'features'));
  if (typeof p.max_clients === 'number') {
    const n = p.max_clients;
    b.unshift(n > 0 ? t('up_to_clients').replace('{n}', n.toLocaleString(loc())) : t('unlimited_clients'));
  }
  return b;
}

/* ---------------- الصفحة الرئيسية ---------------- */
function renderLanding() {
  const s = SITE, h = s.hero, ab = s.about, sc = s.sections, c = s.contact;
  const wa = String(c.whatsapp || '').replace(/\D/g, '');
  const inApp = !CLOUD || !!user;
  const tints = ['--brand', '--sec', '--acc', '--ok'];
  const socials = [['Facebook', c.facebook], ['Instagram', c.instagram], ['TikTok', c.tiktok], ['LinkedIn', c.linkedin]]
    .map(([n, u]) => [n, safeUrl(u)]).filter(x => x[1]);
  const email = /^[^\s@]+@[^\s@]+$/.test(String(c.email || '').trim()) ? c.email.trim() : '';
  const phone = String(c.phone || '').trim();

  const features = s.features.map((f, i) => `
    <div class="card ld-card rv zoom" style="--c:var(${tints[i % 4]});--i:${i % 3}">
      <div class="ld-ic">${esc(f.icon || '⭐')}</div>
      <h3>${esc(tx(f, 'title'))}</h3>
      <p>${esc(tx(f, 'text'))}</p>
    </div>`).join('');

  const steps = s.steps.map((f, i) => `
    <div class="card ld-step rv" style="--c:var(${tints[i % 4]});--i:${i}">
      <div class="n">${(i + 1).toLocaleString(loc())}</div>
      <h3>${esc(tx(f, 'title'))}</h3>
      <p>${esc(tx(f, 'text'))}</p>
    </div>`).join('');

  const words = tx(h, 'title').split(/\s+/).filter(Boolean).map((w, i) => `<span class="w" style="--i:${i}">${esc(w)}</span>`).join(' ');
  const stats = (s.stats || []).map((x, i) => `<div class="ld-stat rv" style="--i:${i}"><b class="cnt" data-raw="${esc(x.num)}">${esc(numText(x.num))}</b><span>${esc(tx(x, 'label'))}</span></div>`).join('');
  const pcols = ['--brand', '--sec', '--acc', '--ok', '--brand-2', '--sec'];
  const pf = ['Instagram', 'Facebook', 'TikTok', 'LinkedIn', 'X', 'YouTube'].map((n, i) => `<span class="pf" style="--c:var(${pcols[i]})">${n}</span>`).join('');
  const bars = [.55, .8, .45, .95, .7, 1].map((h2, i) => `<i style="--h:${h2};--i:${i};--c:var(${pcols[i % 4]})"></i>`).join('');
  const plans = s.plans.map(p => {
    const name = tx(p, 'name');
    const label = esc(tx(p, 'cta') || t('subscribe'));
    const cta = wa
      ? `<a class="btn block ${p.popular ? 'primary' : ''}" target="_blank" rel="noopener" href="https://wa.me/${wa}?text=${encodeURIComponent(t('wa_msg').replace('{plan}', name).replace('{brand}', s.brand))}">${label}</a>`
      : `<button class="btn block ${p.popular ? 'primary' : ''}" data-action="go-signup">${label}</button>`;
    return `
    <div class="card plan rv zoom ${p.popular ? 'pop' : ''}" style="--i:${s.plans.indexOf(p)}">
      ${p.popular ? `<span class="badge">${t('popular')}</span>` : ''}
      <h3>${esc(name)}</h3>
      <p class="pdesc">${esc(tx(p, 'desc'))}</p>
      <div class="price"><b class="cnt" data-raw="${Number(p.price || 0)}">${Number(p.price || 0).toLocaleString(loc())}</b> <span>${t('cur')}</span> <small>/ ${t('per_month')}</small></div>
      <ul>${planBullets(p).map(x => `<li>${esc(x)}</li>`).join('')}</ul>
      ${cta}
    </div>`;
  }).join('');

  const faq = s.faq.map((q, i) => `<details class="card faq rv" style="--i:${i % 4}"><summary>${esc(tx(q, 'q'))}</summary><p>${esc(tx(q, 'a'))}</p></details>`).join('');

  const contactBits = [
    wa ? `<a href="https://wa.me/${wa}" target="_blank" rel="noopener">💬 ${t('whatsapp')}</a>` : '',
    phone ? `<a href="tel:${esc(phone.replace(/[^\d+]/g, ''))}" dir="ltr">📞 ${esc(phone)}</a>` : '',
    email ? `<a href="mailto:${esc(email)}" dir="ltr">✉️ ${esc(email)}</a>` : '',
    ...socials.map(([n, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${n}</a>`)
  ].filter(Boolean).join('');

  $('#landing').innerHTML = `
    <div class="ld-progress" aria-hidden="true"></div>
    ${s.announce.on ? `<div class="ld-announce">${esc(tx(s.announce, 'text'))}</div>` : ''}
    <header class="ld-head"><div class="ld-wrap ld-nav">
      <button class="brandbtn" data-action="go-home" aria-label="home">${brandLockup()}</button>
      <nav class="links">
        <button class="navlink" data-action="scroll" data-id="features">${t('ld_features')}</button>
        <button class="navlink" data-action="scroll" data-id="how">${t('ld_how')}</button>
        <button class="navlink" data-action="scroll" data-id="plans">${t('ld_plans')}</button>
        <button class="navlink" data-action="scroll" data-id="faq">${t('ld_faq')}</button>
        <button class="navlink" data-action="scroll" data-id="contact">${t('ld_contact')}</button>
      </nav>
      <span class="spacer"></span>
      <button class="btn ghost" data-action="lang">${S.lang === 'ar' ? 'EN' : 'عربي'}</button>
      <button class="btn primary" data-action="go-login">${inApp && CLOUD ? t('open_app') : t('auth_login')}</button>
    </div></header>

    <section class="ld-hero">
      <div class="aurora" aria-hidden="true"><i></i><i></i><i></i></div>
      <div class="ld-wrap hero-grid">
        <div>
          <h1 class="ld-title">${words}</h1>
          <p class="ld-lead">${esc(tx(h, 'sub'))}</p>
          <div class="ld-cta">
            <button class="btn primary lg" data-action="go-signup">${esc(tx(h, 'cta1'))}</button>
            <button class="btn glass lg" data-action="scroll" data-id="plans">${esc(tx(h, 'cta2'))}</button>
          </div>
        </div>
        <div class="ld-stage" aria-hidden="true"><div class="ld-float">
          <div class="fchip c2"><i>✨</i>${t('mk_ai')}</div>
          <div class="fchip c1"><i>✓</i>${t('mk_done')}</div>
          <div class="ld-mock">
            <div class="mk-top"><i></i><i></i><i></i><u></u></div>
            <div class="mk-stats">
              <div style="--c:var(--brand)"><b class="cnt" data-raw="12">${(12).toLocaleString(loc())}</b><u></u></div>
              <div style="--c:var(--sec)"><b class="cnt" data-raw="48">${(48).toLocaleString(loc())}</b><u></u></div>
              <div style="--c:var(--ok)"><b class="cnt" data-raw="7">${(7).toLocaleString(loc())}</b><u></u></div>
            </div>
            <div class="mk-board">
              <div class="mk-col"><h5>${t('st_todo')}</h5><div class="mk-slot"><div class="mk-mv"><span></span><u></u><u class="s"></u><b>✓</b></div></div><div class="mk-card" style="--c:var(--acc)"><span></span><u></u></div></div>
              <div class="mk-col"><h5>${t('st_doing')}</h5><div class="mk-slot"></div><div class="mk-card" style="--c:var(--brand)"><span></span><u></u><u class="s"></u></div></div>
              <div class="mk-col"><h5>${t('st_done')}</h5><div class="mk-slot"></div><div class="mk-card" style="--c:var(--ok)"><span></span><u></u></div></div>
            </div>
            <div class="mk-bars">${bars}</div>
          </div>
        </div></div>
      </div>
    </section>

    <section class="ld-marq" aria-hidden="true">
      <p>${t('ld_platforms')}</p>
      <div class="mq"><div class="trk">${pf}${pf}</div></div>
    </section>

    ${stats ? `<section class="ld-stats"><div class="ld-wrap stats-grid">${stats}</div></section>` : ''}

    <section class="ld-sec alt"><div class="ld-wrap narrow">
      <h2 class="rv">${esc(tx(ab, 'title'))}</h2>
      <p class="ld-about rv slide" style="--i:1">${esc(tx(ab, 'text'))}</p>
    </div></section>

    <section class="ld-sec" id="sec-features"><div class="ld-wrap">
      <h2>${esc(tx(sc, 'features_title'))}</h2><p class="ld-sub">${esc(tx(sc, 'features_sub'))}</p>
      <div class="ld-grid">${features}</div>
    </div></section>

    <section class="ld-sec alt" id="sec-how"><div class="ld-wrap">
      <h2>${esc(tx(sc, 'steps_title'))}</h2>
      <div class="ld-steps">${steps}</div>
    </div></section>

    <section class="ld-sec" id="sec-plans"><div class="ld-wrap">
      <h2>${esc(tx(sc, 'plans_title'))}</h2><p class="ld-sub">${esc(tx(sc, 'plans_sub'))}</p>
      <div class="ld-plans">${plans}</div>
    </div></section>

    <section class="ld-sec alt" id="sec-faq"><div class="ld-wrap narrow">
      <h2>${esc(tx(sc, 'faq_title'))}</h2>
      <div class="ld-faq">${faq}</div>
    </div></section>

    <section class="ld-band"><div class="ld-wrap">
      <i></i><i></i><i></i>
      <h2 class="rv">${esc(tx(s.cta, 'title'))}</h2><p class="rv" style="--i:1">${esc(tx(s.cta, 'sub'))}</p>
      <button class="btn lg light" data-action="go-signup">${esc(tx(s.cta, 'btn'))}</button>
    </div></section>

    <footer class="ld-foot" id="sec-contact"><div class="ld-wrap">
      <div class="foot-top">${brandLockup()}<p>${esc(tx(s.footer, 'text'))}</p></div>
      ${contactBits ? `<div class="foot-links">${contactBits}</div>` : ''}
      ${tx(c, 'address') ? `<p class="foot-addr">📍 ${esc(tx(c, 'address'))}</p>` : ''}
      <p class="foot-copy">© ${new Date().getFullYear().toLocaleString('en-US', { useGrouping: false })} ${esc(s.brand)} — ${t('rights')}</p>
    </div></footer>
    ${wa ? `<a class="wa-float" href="https://wa.me/${wa}" target="_blank" rel="noopener" aria-label="WhatsApp">💬</a>` : ''}`;

  initLandingFx();}

/* ---------------- لوحة الأدمن: محرر الموقع ---------------- */
let draft = null, siteTab = CLOUD ? 'users' : 'general';
const TABS = ['users', 'general', 'hero', 'stats', 'features', 'steps', 'plans', 'faq', 'contact'];
const TAB_LABEL = { users: 'المستخدمون والاشتراكات', general: 'الهوية والألوان', hero: 'الواجهة والعناوين', stats: 'الأرقام', features: 'المميزات', steps: 'الخطوات', plans: 'الباقات والأسعار', faq: 'الأسئلة الشائعة', contact: 'التواصل والفوتر' };
const bi = (k, l, t = 'text', extra = {}) => [{ k: k + '_ar', l: l + ' (عربي)', t, ...extra }, { k: k + '_en', l: l + ' (English)', t, ...extra }];

const EDIT = {
  general: [
    { h: 'الهوية' },
    { k: 'brand', l: 'اسم المنصة', t: 'text', full: 1 },
    { k: 'logo', l: 'الشعار (صورة مربعة بخلفية شفافة أفضل)', t: 'image', full: 1 },
    { h: 'ألوان الموقع (من ألوان اللوجو)' },
    { k: 'colors.primary', l: 'الأساسي: الأزرار والعناصر النشطة', t: 'color' },
    { k: 'colors.magenta', l: 'لون التدرج مع الأساسي', t: 'color' },
    { k: 'colors.secondary', l: 'الثانوي', t: 'color' },
    { k: 'colors.accent', l: 'التمييز', t: 'color' },
    { k: 'colors.success', l: 'النجاح / الأخضر', t: 'color' },
    { k: 'colors.dark', l: 'الشريط الجانبي والخلفيات الداكنة', t: 'color' },
    { h: 'شريط إعلان أعلى الصفحة الرئيسية' },
    { k: 'announce.on', l: 'إظهار الشريط', t: 'check', full: 1 },
    ...bi('announce.text', 'نص الإعلان', 'text'),
    { h: 'خيارات' },
    { k: 'options.free_max_clients', l: 'حد العملاء للحساب بدون اشتراك (0 = بلا حد)', t: 'num', note: 'بيتطبق على أي حساب جديد أو انتهى اشتراكه. الأدمن مستثنى.' },
    { k: 'options.show_signup', l: 'إظهار "إنشاء حساب" في شاشة الدخول', t: 'check', full: 1, note: 'ده بيخفي الزرار بس. لإيقاف التسجيل فعلياً: Supabase ← Authentication ← Sign In / Providers ← تعطيل Sign-ups.' }
  ],
  hero: [
    { h: 'أعلى الصفحة' },
    ...bi('hero.title', 'العنوان الرئيسي'), ...bi('hero.sub', 'الوصف', 'area'),
    ...bi('hero.cta1', 'نص الزر الأساسي'), ...bi('hero.cta2', 'نص الزر الثاني'),
    { h: 'إيه هو النظام؟' },
    ...bi('about.title', 'العنوان'), ...bi('about.text', 'الشرح', 'area'),
    { h: 'عناوين الأقسام' },
    ...bi('sections.features_title', 'عنوان المميزات'), ...bi('sections.features_sub', 'وصف المميزات'),
    ...bi('sections.steps_title', 'عنوان الخطوات'),
    ...bi('sections.plans_title', 'عنوان الباقات'), ...bi('sections.plans_sub', 'وصف الباقات'),
    ...bi('sections.faq_title', 'عنوان الأسئلة'),
    { h: 'الدعوة الختامية (قبل الفوتر)' },
    ...bi('cta.title', 'العنوان'), ...bi('cta.sub', 'الوصف'), ...bi('cta.btn', 'نص الزر')
  ],
  contact: [
    { h: 'بيانات التواصل (اللي مش مكتوب مش هيظهر)' },
    { k: 'contact.whatsapp', l: 'واتساب بالصيغة الدولية بدون + (مثال 201012345678)', t: 'text', ph: '201012345678' },
    { k: 'contact.phone', l: 'تليفون', t: 'text' },
    { k: 'contact.email', l: 'الإيميل', t: 'text' },
    { k: 'contact.facebook', l: 'رابط فيسبوك', t: 'text', ph: 'https://' },
    { k: 'contact.instagram', l: 'رابط إنستجرام', t: 'text', ph: 'https://' },
    { k: 'contact.tiktok', l: 'رابط تيك توك', t: 'text', ph: 'https://' },
    { k: 'contact.linkedin', l: 'رابط لينكدإن', t: 'text', ph: 'https://' },
    ...bi('contact.address', 'العنوان'),
    { h: 'الفوتر' },
    ...bi('footer.text', 'نص الفوتر', 'area')
  ]
};
const LISTS = {
  features: { add: 'ميزة جديدة', label: i => i.title_ar, fields: [{ k: 'icon', l: 'الأيقونة (إيموجي)', t: 'text', full: 1 }, ...bi('title', 'العنوان'), ...bi('text', 'الوصف', 'area')] },
  stats: { add: 'رقم جديد', label: i => `${i.num} — ${i.label_ar}`, fields: [{ k: 'num', l: 'الرقم (ممكن تكتب +500 أو 98%)', t: 'text', full: 1 }, ...bi('label', 'الوصف')] },
  steps: { add: 'خطوة جديدة', label: i => i.title_ar, fields: [...bi('title', 'العنوان'), ...bi('text', 'الوصف', 'area')] },
  plans: {
    add: 'باقة جديدة', label: i => `${i.name_ar} — ${Number(i.price || 0)} ج.م`,
    fields: [...bi('name', 'اسم الباقة'), { k: 'price', l: 'السعر الشهري (جنيه)', t: 'num' }, { k: 'max_clients', l: 'حد العملاء (0 = بلا حد)', t: 'num' }, { k: 'popular', l: 'علّمها "الأكثر طلباً"', t: 'check' },
      ...bi('desc', 'وصف قصير'), ...bi('features', 'المميزات (سطر لكل ميزة)', 'area'), ...bi('cta', 'نص زر الاشتراك')]
  },
  faq: { add: 'سؤال جديد', label: i => i.q_ar, fields: [...bi('q', 'السؤال'), ...bi('a', 'الإجابة', 'area')] }
};
const NEW_ITEM = {
  features: () => ({ icon: '⭐', title_ar: 'ميزة جديدة', title_en: 'New feature', text_ar: '', text_en: '' }),
  stats: () => ({ num: '100', label_ar: 'وصف الرقم', label_en: 'Stat label' }),
  steps: () => ({ title_ar: 'خطوة جديدة', title_en: 'New step', text_ar: '', text_en: '' }),
  plans: () => ({ id: uid(), name_ar: 'باقة جديدة', name_en: 'New plan', price: 0, max_clients: 10, popular: false, desc_ar: '', desc_en: '', features_ar: '', features_en: '', cta_ar: 'اشترك الآن', cta_en: 'Subscribe' }),
  faq: () => ({ q_ar: 'سؤال جديد', q_en: 'New question', a_ar: '', a_en: '' })
};

const getp = (o, p) => p.split('.').reduce((a, k) => (a == null ? a : a[k]), o);
function setp(o, p, v) {
  const ks = p.split('.'), last = ks.pop();
  const tgt = ks.reduce((a, k) => a[k], o);
  tgt[last] = v;
}
function fieldHTML(f, base) {
  const path = base ? `${base}.${f.k}` : f.k, v = getp(draft, path), cls = f.full ? 'full' : '';
  const ph = f.ph ? ` placeholder="${esc(f.ph)}"` : '';
  if (f.t === 'area') return `<label class="f ${cls}">${f.l}<textarea data-path="${path}"${ph}>${esc(v)}</textarea></label>`;
  if (f.t === 'num') return `<label class="f ${cls}">${f.l}<input type="number" min="0" data-path="${path}" data-type="num" value="${esc(v)}">${f.note ? `<small>${f.note}</small>` : ''}</label>`;
  if (f.t === 'color') return `<label class="f ${cls}">${f.l}<span class="colorrow"><input type="color" data-path="${path}" data-type="color" value="${esc(safeColor(v, '#000000'))}"><code>${esc(v)}</code></span></label>`;
  if (f.t === 'check') return `<label class="f chk ${cls}"><span><input type="checkbox" data-path="${path}" data-type="bool" ${v ? 'checked' : ''}> ${f.l}</span>${f.note ? `<small>${f.note}</small>` : ''}</label>`;
  if (f.t === 'image') return `<div class="f ${cls}"><span>${f.l}</span><div class="imgrow">${v ? `<img class="mark big" src="${esc(v)}" alt="">` : ''}<input type="file" accept="image/*" data-logo="${path}"><button type="button" class="btn sm" data-action="site-logo-reset">استرجاع الشعار الافتراضي</button></div></div>`;
  return `<label class="f ${cls}">${f.l}<input data-path="${path}" value="${esc(v)}"${ph}></label>`;
}
function listHTML(key) {
  const def = LISTS[key], items = draft[key];
  return `<div class="bar"><button class="btn primary" data-action="site-add" data-id="${key}">＋ ${def.add}</button></div>` +
    (items.length ? items.map((it, i) => `
      <div class="card item">
        <div class="item-head"><b>${i + 1}. ${esc(def.label(it) || '—')}</b><span class="spacer"></span>
          <button type="button" class="btn sm" data-action="site-up" data-id="${key}.${i}" ${i === 0 ? 'disabled' : ''}>↑</button>
          <button type="button" class="btn sm" data-action="site-down" data-id="${key}.${i}" ${i === items.length - 1 ? 'disabled' : ''}>↓</button>
          <button type="button" class="btn sm danger" data-action="site-del" data-id="${key}.${i}">حذف</button>
        </div>
        <div class="form">${def.fields.map(f => fieldHTML(f, `${key}.${i}`)).join('')}</div>
      </div>`).join('') : `<div class="card">${empty()}</div>`);
}

/* ---------------- المستخدمون والاشتراكات ---------------- */
let USERS = null, UERR = '', uq = '', uLoading = false;
const planOf = id => (SITE.plans || []).find(p => p.id === id);
const subLive = u => u.plan_id && u.status === 'active' && (!u.expires_at || new Date(u.expires_at) > new Date());
async function loadUsers() {
  if (!CLOUD || !sb || uLoading) return;
  uLoading = true; UERR = '';
  const { data, error } = await sb.rpc('admin_list_users');
  uLoading = false;
  if (error) UERR = error.message || 'error'; else USERS = data || [];
  if (route === 'site' && siteTab === 'users') render();
}
function usersStats() {
  const us = USERS || [];
  const live = us.filter(u => subLive(u) && u.plan_id !== 'free');
  return {
    total: us.length, live: live.length,
    sus: us.filter(u => u.status === 'suspended').length,
    mrr: live.reduce((a, u) => a + Number((planOf(u.plan_id) || {}).price || 0), 0)
  };
}
function userRow(u) {
  const exp = u.expires_at ? dstr(new Date(u.expires_at)) : '';
  const known = (SITE.plans || []).some(p => p.id === u.plan_id);
  const opts = [`<option value="">بدون اشتراك</option>`]
    .concat((SITE.plans || []).map(p => `<option value="${esc(p.id)}" ${p.id === u.plan_id ? 'selected' : ''}>${esc(p.name_ar)} — ${Number(p.price || 0)} ج.م</option>`))
    .concat(u.plan_id && !known ? [`<option value="${esc(u.plan_id)}" selected>${esc(u.plan_id)}</option>`] : []).join('');
  const expired = u.plan_id && u.expires_at && new Date(u.expires_at) <= new Date();
  const badge = u.is_admin ? '<span class="pill ok">أدمن</span>'
    : u.status === 'suspended' ? '<span class="pill bad">موقوف</span>'
    : expired ? '<span class="pill warn">منتهي</span>'
    : u.plan_id ? '<span class="pill ok">مشترك</span>' : '<span class="pill">بدون اشتراك</span>';
  const last = u.last_sign_in_at ? dstr(new Date(u.last_sign_in_at)) : '—';
  return `<div class="card urow" data-uid="${esc(u.id)}">
    <div class="uhead"><b dir="ltr">${esc(u.email || '—')}</b> ${badge}
      <small>${Number(u.clients)} عميل · ${Number(u.tasks)} مهمة · ${Number(u.posts)} بوست · آخر دخول ${last}</small></div>
    <div class="form">
      <label class="f">الباقة<select data-u="plan">${opts}</select></label>
      <label class="f">حد العملاء (فاضي = بلا حد)<input type="number" min="0" data-u="max" value="${u.max_clients == null ? '' : Number(u.max_clients)}"></label>
      <label class="f">ينتهي في (فاضي = بلا انتهاء)<input type="date" data-u="exp" value="${esc(exp)}"></label>
      <label class="f">الحالة<select data-u="status"><option value="active" ${u.status !== 'suspended' ? 'selected' : ''}>نشط</option><option value="suspended" ${u.status === 'suspended' ? 'selected' : ''}>موقوف</option></select></label>
    </div>
    <div class="uact">
      <button type="button" class="btn primary sm" data-action="user-save" data-id="${esc(u.id)}">حفظ</button>
      <button type="button" class="btn sm" data-action="user-admin" data-id="${esc(u.id)}" data-on="${u.is_admin ? 0 : 1}">${u.is_admin ? 'إلغاء الأدمن' : 'ترقية لأدمن'}</button>
    </div>
  </div>`;
}
function userListHTML() {
  const q = uq.trim().toLowerCase();
  const rows = (USERS || []).filter(u => !q || String(u.email || '').toLowerCase().includes(q));
  return rows.length ? rows.map(userRow).join('') : `<div class="card">${empty()}</div>`;
}
function usersTab() {
  if (!CLOUD) return `<div class="card"><p>إدارة المستخدمين والاشتراكات محتاجة ربط Supabase (الوضع المحلي بيشتغل لمستخدم واحد). اتبع خطوات README.</p></div>`;
  if (UERR) return `<div class="card"><p>تعذر تحميل المستخدمين: <code dir="ltr">${esc(UERR)}</code></p><p><small>اتأكد إنك شغّلت أحدث schema.sql وإن حسابك موجود في جدول admins.</small></p><button type="button" class="btn" data-action="users-reload">إعادة المحاولة</button></div>`;
  if (!USERS) { if (!uLoading) setTimeout(loadUsers, 0); return `<div class="card"><p>جاري التحميل…</p></div>`; }
  const st = usersStats(), n = x => Number(x).toLocaleString(loc());
  return `<div class="ustats">
      <div class="card"><small>المستخدمون</small><b>${n(st.total)}</b></div>
      <div class="card"><small>مشتركون نشطون</small><b>${n(st.live)}</b></div>
      <div class="card"><small>حسابات موقوفة</small><b>${n(st.sus)}</b></div>
      <div class="card"><small>الدخل الشهري المتوقع</small><b>${n(st.mrr)} ${t('cur')}</b></div>
    </div>
    <div class="bar"><input id="usearch" data-usearch placeholder="ابحث بالإيميل…" value="${esc(uq)}"><button type="button" class="btn" data-action="users-reload">تحديث</button></div>
    <div id="ulist">${userListHTML()}</div>`;
}
function userRowVals(id) {
  const row = Array.from(document.querySelectorAll('.urow')).find(r => r.dataset.uid === id);
  if (!row) return null;
  const g = k => row.querySelector(`[data-u="${k}"]`);
  return { row, plan: g('plan').value, max: g('max').value, exp: g('exp').value, status: g('status').value };
}

VIEWS.site = function () {
  if (siteTab === 'users') {
    const tabs = TABS.map(k => `<button type="button" class="tab ${k === siteTab ? 'on' : ''}" data-action="site-tab" data-id="${k}">${TAB_LABEL[k]}</button>`).join('');
    return `<div class="tabs">${tabs}</div>${usersTab()}`;
  }
  if (!draft) draft = clone(SITE);
  const tabs = TABS.map(k => `<button type="button" class="tab ${k === siteTab ? 'on' : ''}" data-action="site-tab" data-id="${k}">${TAB_LABEL[k]}</button>`).join('');
  const body = LISTS[siteTab]
    ? listHTML(siteTab)
    : `<div class="card"><div class="form">${EDIT[siteTab].map(f => (f.h ? `<h4 class="eh full">${f.h}</h4>` : fieldHTML(f, ''))).join('')}</div></div>`;
  return `
    <div class="sitebar card">
      <div class="grow"><b>إدارة الموقع</b><br><small>${CLOUD ? 'التغييرات بتظهر لكل الزوار بعد الحفظ.' : 'الوضع المحلي: التغييرات محفوظة في متصفحك فقط. اربط Supabase عشان تظهر لكل الزوار.'}</small></div>
      <button type="button" class="btn" data-action="site-discard">تراجع</button>
      <button type="button" class="btn" data-action="site-reset">الافتراضي</button>
      <button type="button" class="btn" data-action="site-save-view">حفظ ومعاينة</button>
      <button type="button" class="btn primary" data-action="site-save">حفظ التغييرات</button>
    </div>
    <div class="tabs">${tabs}</div>${body}`;
};

function readImage(file, max = 256) {
  return new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onerror = rej;
    fr.onload = () => {
      const im = new Image();
      im.onerror = rej;
      im.onload = () => {
        const k = Math.min(1, max / Math.max(im.width, im.height));
        const c = document.createElement('canvas');
        c.width = Math.max(1, Math.round(im.width * k)); c.height = Math.max(1, Math.round(im.height * k));
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
        res(c.toDataURL('image/png'));
      };
      im.src = fr.result;
    };
    fr.readAsDataURL(file);
  });
}
async function doSave(thenView) {
  try {
    await saveSite(draft);
    draft = null; applyTheme(); toast(t('saved'));
    if (thenView) go('home'); else render();
  } catch (e) { toast(t('site_save_err')); }
}
function setVal(el) {
  if (!draft || !el.dataset || !el.dataset.path) return;
  const ty = el.dataset.type;
  let v = el.value;
  if (ty === 'bool') v = !!el.checked;
  else if (ty === 'num') v = Math.max(0, Number(el.value) || 0);
  else if (ty === 'color') { if (el.nextElementSibling) el.nextElementSibling.textContent = v; }
  setp(draft, el.dataset.path, v);
  if (ty === 'color') applyTheme(draft);
}
const swap = (arr, i, j) => { [arr[i], arr[j]] = [arr[j], arr[i]]; };

Object.assign(ACTIONS, {
  'go-home'() { go('home'); },
  'go-login'() { if (!CLOUD || user) go('dashboard'); else { authMode = 'login'; go('login'); } },
  'go-signup'() { if (!CLOUD || user) go('dashboard'); else { authMode = SITE.options.show_signup ? 'signup' : 'login'; go('login'); } },
  scroll(id) { const el = document.getElementById('sec-' + id); if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); },
  'site-tab'(id) { siteTab = id; render(); },
  'site-add'(id) { if (NEW_ITEM[id]) { draft[id].push(NEW_ITEM[id]()); render(); } },
  'site-del'(id) { const [k, i] = id.split('.'); if (confirm('متأكد من الحذف؟')) { draft[k].splice(+i, 1); render(); } },
  'site-up'(id) { const [k, i] = id.split('.'); if (+i > 0) { swap(draft[k], +i, +i - 1); render(); } },
  'site-down'(id) { const [k, i] = id.split('.'); if (+i < draft[k].length - 1) { swap(draft[k], +i, +i + 1); render(); } },
  'site-save'() { return doSave(false); },
  'site-save-view'() { return doSave(true); },
  'site-discard'() { draft = clone(SITE); applyTheme(); render(); },
  'site-reset'() { if (confirm('استرجاع كل محتوى الموقع للقيم الافتراضية؟ (مش هيتحفظ غير لما تضغط حفظ)')) { draft = clone(DEFAULT_SITE); applyTheme(draft); render(); } },
  async 'user-save'(id) {
    const v = userRowVals(id); if (!v) return;
    const suspended = v.status === 'suspended';
    const maxN = v.max === '' ? null : Math.max(0, parseInt(v.max, 10) || 0);
    const exp = v.exp ? new Date(v.exp + 'T23:59:59').toISOString() : null;
    const { error } = await sb.rpc('admin_set_plan', { p_user: id, p_plan: v.plan, p_status: v.status, p_max: v.plan || suspended ? maxN : null, p_expires: v.plan || suspended ? exp : null });
    if (error) { toast(t('site_save_err')); return; }
    toast(t('saved')); USERS = null; loadUsers();
  },
  async 'user-admin'(id, el) {
    const on = el && el.dataset && el.dataset.on === '1';
    if (!confirm(on ? 'ترقية المستخدم ده لأدمن؟ هيقدر يتحكم في الموقع والمستخدمين.' : 'إلغاء صلاحية الأدمن؟')) return;
    const { error } = await sb.rpc('admin_set_admin', { p_user: id, p_admin: on });
    if (error) { toast(t('site_save_err')); return; }
    toast(t('saved')); USERS = null; loadUsers();
  },
  'users-reload'() { USERS = null; UERR = ''; render(); },
  'site-logo-reset'() { if (draft) { draft.logo = DEFAULT_SITE.logo; render(); } }
});
document.addEventListener('input', e => {
  const el = e.target;
  if (el && el.dataset && 'usearch' in el.dataset) { uq = el.value; const l = $('#ulist'); if (l) l.innerHTML = userListHTML(); return; }
  setVal(el);
});
document.addEventListener('change', async e => {
  const el = e.target;
  if (el && el.dataset && el.dataset.path) setVal(el);
  if (el && el.dataset && el.dataset.u === 'plan') {   // اختيار باقة بيملا الحد والتاريخ تلقائياً
    const row = el.closest ? el.closest('.urow') : null, p = planOf(el.value);
    if (row && p) {
      const mx = row.querySelector('[data-u="max"]'), ex = row.querySelector('[data-u="exp"]');
      if (mx) mx.value = p.max_clients > 0 ? p.max_clients : '';
      if (ex && !ex.value) ex.value = inDays(30);
    } else if (row && !el.value) {
      const mx = row.querySelector('[data-u="max"]'), ex = row.querySelector('[data-u="exp"]');
      if (mx) mx.value = ''; if (ex) ex.value = '';
    }
  }
  if (el && el.dataset && el.dataset.logo && el.files && el.files[0] && draft) {
    try { setp(draft, el.dataset.logo, await readImage(el.files[0])); render(); } catch (err) { toast(t('bad_file')); }
  }
});
window.addEventListener('hashchange', () => { if (route !== 'site') { draft = null; USERS = null; UERR = ''; } });

startApp();
