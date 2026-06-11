import axios from 'axios';

/**
 * Minimal GoHighLevel (LeadConnector) API v2 client. v1 uses a per-deploy
 * location API key. For multi-team rollout, resolve the location token from
 * the agent's session instead of the env default (see /push routing note).
 */

const GHL_BASE = 'https://services.leadconnector.co';
const API_VERSION = '2021-07-28';

export type LocationAuth = { locationId: string; apiKey: string };

export function defaultLocation(): LocationAuth {
  const locationId = process.env.GHL_LOCATION_ID;
  const apiKey = process.env.GHL_LOCATION_API_KEY;
  if (!locationId || !apiKey) {
    throw new Error('GHL location is not configured');
  }
  return { locationId, apiKey };
}

function headers(auth: LocationAuth) {
  return {
    Authorization: `Bearer ${auth.apiKey}`,
    Version: API_VERSION,
    'Content-Type': 'application/json',
  };
}

export type GhlContactInput = {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  companyName?: string;
  website?: string;
  tags: string[];
  source?: string;
};

/** Upsert a contact. GHL dedupes on email/phone within the location. */
export async function upsertContact(
  auth: LocationAuth,
  input: GhlContactInput,
): Promise<{ contactId: string }> {
  const { data } = await axios.post(
    `${GHL_BASE}/contacts/upsert`,
    { locationId: auth.locationId, ...input },
    { headers: headers(auth), timeout: 20000 },
  );
  const contactId = data?.contact?.id ?? data?.id;
  if (!contactId) throw new Error('GHL did not return a contact id');
  return { contactId };
}

/** Create an opportunity in a pipeline/stage for the contact. */
export async function createOpportunity(
  auth: LocationAuth,
  opts: { contactId: string; pipelineId: string; stageId: string; name: string; monetaryValue?: number },
): Promise<{ opportunityId: string }> {
  const { data } = await axios.post(
    `${GHL_BASE}/opportunities/`,
    {
      locationId: auth.locationId,
      contactId: opts.contactId,
      pipelineId: opts.pipelineId,
      pipelineStageId: opts.stageId,
      name: opts.name,
      status: 'open',
      monetaryValue: opts.monetaryValue,
    },
    { headers: headers(auth), timeout: 20000 },
  );
  const opportunityId = data?.opportunity?.id ?? data?.id;
  return { opportunityId };
}

/** Append a note to the contact's timeline. */
export async function addNote(auth: LocationAuth, contactId: string, body: string): Promise<void> {
  await axios.post(
    `${GHL_BASE}/contacts/${contactId}/notes`,
    { body },
    { headers: headers(auth), timeout: 20000 },
  );
}

export type GhlPipeline = {
  id: string;
  name: string;
  stages: { id: string; name: string }[];
};

/** Fetch pipelines + stages for the location. */
export async function listPipelines(auth: LocationAuth): Promise<GhlPipeline[]> {
  const { data } = await axios.get(
    `${GHL_BASE}/opportunities/pipelines?locationId=${auth.locationId}`,
    { headers: headers(auth), timeout: 20000 },
  );
  const pipelines = data?.pipelines ?? [];
  return pipelines.map((p: any) => ({
    id: p.id,
    name: p.name,
    stages: (p.stages ?? []).map((s: any) => ({ id: s.id, name: s.name })),
  }));
}
