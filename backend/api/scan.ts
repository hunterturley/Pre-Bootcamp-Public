import type { VercelRequest, VercelResponse } from '@vercel/node';

import { resolveLocation } from '../lib/auth.js';
import { route } from '../lib/http.js';
import { ocrImage } from '../lib/ocr.js';
import { parseCard } from '../lib/parse.js';

/**
 * POST /scan
 * Body: { imageBase64 }
 * 1. OCR the image (Google Vision).
 * 2. Parse the raw text into structured fields (Claude).
 * 3. Return the draft ParsedCard.
 */
export default route('POST', async (req: VercelRequest, res: VercelResponse) => {
  // Auth gate (also confirms the agent maps to a location) before doing work.
  await resolveLocation(req);

  const imageBase64: string | undefined = req.body?.imageBase64;
  if (!imageBase64 || typeof imageBase64 !== 'string') {
    res.status(400).json({ error: 'imageBase64 is required' });
    return;
  }

  const ocrText = await ocrImage(imageBase64);
  const parsed = await parseCard(ocrText);

  res.status(200).json(parsed);
});
