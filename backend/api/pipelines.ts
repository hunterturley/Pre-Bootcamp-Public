import type { VercelRequest, VercelResponse } from '@vercel/node';

import { resolveLocation } from '../lib/auth.js';
import { listPipelines } from '../lib/ghl.js';
import { route } from '../lib/http.js';

/**
 * GET /pipelines
 * Returns the agent's GHL pipelines + stages so the Review picker is live.
 */
export default route('GET', async (req: VercelRequest, res: VercelResponse) => {
  const auth = await resolveLocation(req);
  const pipelines = await listPipelines(auth);
  res.status(200).json({ pipelines });
});
