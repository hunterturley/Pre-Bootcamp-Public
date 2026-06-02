import type { VercelRequest } from '@vercel/node';

import { defaultLocation, LocationAuth } from './ghl.js';

/**
 * Resolve the GHL location for the authenticated agent.
 *
 * v1: single sub-account — every request maps to the env-configured location.
 * Multi-team: replace this with a lookup that maps the bearer token (an agent
 * session issued by Switchboard) to that agent's GHL location + token. This is
 * the per-location routing decision flagged in the build spec.
 */
export async function resolveLocation(req: VercelRequest): Promise<LocationAuth> {
  const token = bearer(req);
  if (!token) {
    throw new HttpError(401, 'Missing session token');
  }
  // TODO(multi-team): look up agent -> location from the Switchboard identity
  // store keyed by `token`. For now, route to the single configured location.
  return defaultLocation();
}

export function bearer(req: VercelRequest): string | null {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return null;
  return header.slice('Bearer '.length).trim() || null;
}

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}
