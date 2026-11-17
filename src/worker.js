// Cloudflare Worker: ملفات ثابتة (public/) + مسارات الـ API
import { onRequest as aiHandler } from '../functions/api/ai.js';
import { handleTrends } from './trends.js';
import { handleStaff } from './staff.js';
import { handleAssistant } from './assistant.js';

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/ai') return aiHandler({ request, env });
    if (pathname === '/api/trends') return handleTrends(request, env);
    if (pathname.startsWith('/api/staff/')) return handleStaff(request, env);
    if (pathname === '/api/assistant') return handleAssistant(request, env);
    return env.ASSETS.fetch(request);
  }
};
