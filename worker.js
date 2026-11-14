// Worker: /api/* للـ AI، وأي مسار تاني بيرجع الملفات الثابتة من فولدر public
import { onRequest } from '../functions/api/ai.js';

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/ai') return onRequest({ request, env });
    return env.ASSETS.fetch(request);
  }
};
