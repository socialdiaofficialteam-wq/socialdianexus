// Cloudflare Worker: ملفات ثابتة (public/) + مسارات الـ API
import { onRequest as aiHandler } from '../functions/api/ai.js';
import { handleTrends } from './trends.js';

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/ai') return aiHandler({ request, env });
    if (pathname === '/api/trends') return handleTrends(request, env);
    return env.ASSETS.fetch(request);
  }
};
