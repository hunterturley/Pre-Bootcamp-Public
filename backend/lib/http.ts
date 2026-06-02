import type { VercelRequest, VercelResponse } from '@vercel/node';

import { HttpError } from './auth.js';

type Handler = (req: VercelRequest, res: VercelResponse) => Promise<void>;

/** Wrap a handler: enforce method, JSON errors, and consistent shape. */
export function route(method: 'GET' | 'POST', handler: Handler): Handler {
  return async (req, res) => {
    if (req.method !== method) {
      res.status(405).json({ error: `Method not allowed, use ${method}` });
      return;
    }
    try {
      await handler(req, res);
    } catch (err) {
      if (err instanceof HttpError) {
        res.status(err.status).json({ error: err.message });
        return;
      }
      // eslint-disable-next-line no-console
      console.error(err);
      const message = err instanceof Error ? err.message : 'Internal error';
      res.status(500).json({ error: message });
    }
  };
}
