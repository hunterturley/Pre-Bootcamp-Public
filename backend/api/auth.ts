import type { VercelRequest, VercelResponse } from '@vercel/node';

import { route } from '../lib/http.js';

/**
 * POST /auth
 * Body: { email }
 *
 * v1 dev placeholder: exchange an agent email for an opaque session token.
 * Phase 3 replaces this with real Switchboard account auth, and the issued
 * token becomes the key that `resolveLocation()` maps to a GHL location.
 */
export default route('POST', async (req: VercelRequest, res: VercelResponse) => {
  const email: string | undefined = req.body?.email;
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    res.status(400).json({ error: 'A valid email is required' });
    return;
  }

  // TODO(phase-3): verify against the Switchboard identity store and issue a
  // signed, expiring token. For now, an opaque token keyed off the email.
  const token = 'sb.' + Buffer.from(`${email}:${Date.now()}`).toString('base64url');
  res.status(200).json({ token });
});
