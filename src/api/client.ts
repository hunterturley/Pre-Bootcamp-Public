import axios from 'axios';
import Constants from 'expo-constants';

import { ParsedCard, Pipeline, PushResult, ScannedContact } from '../types';
import { deleteSecure, getSecure, setSecure } from '../storage/secure';
import { delay, DEMO_PIPELINES, isDemo, nextDemoCard } from './demo';

/**
 * Thin client for the Switchboard backend proxy. The app never holds OCR,
 * Anthropic, or GHL keys. Every call goes through the proxy, which injects
 * server-side secrets and routes to the agent's GHL location.
 *
 * When no real backend is configured (the base URL is a placeholder), the
 * client serves offline demo data so the flow is clickable in a web build or
 * Expo Go with no backend running.
 */

const baseURL =
  (Constants.expoConfig?.extra?.apiBaseUrl as string | undefined) ??
  'https://api.switchboard.example/v1';

const DEMO = isDemo(baseURL);

const SESSION_TOKEN_KEY = 'switchboard.sessionToken';

const http = axios.create({ baseURL, timeout: 30000 });

http.interceptors.request.use(async (config) => {
  const token = await getSecure(SESSION_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function setSessionToken(token: string): Promise<void> {
  await setSecure(SESSION_TOKEN_KEY, token);
}

export async function clearSessionToken(): Promise<void> {
  await deleteSecure(SESSION_TOKEN_KEY);
}

export async function getSessionToken(): Promise<string | null> {
  return getSecure(SESSION_TOKEN_KEY);
}

/**
 * POST /auth — exchange an agent email for a session token and persist it.
 * v1 is a dev placeholder; this maps to Switchboard identity in Phase 3.
 */
export async function signIn(email: string): Promise<string> {
  if (DEMO) {
    await delay(500);
    const token = 'demo.' + Math.random().toString(36).slice(2);
    await setSessionToken(token);
    return token;
  }
  const { data } = await http.post<{ token: string }>('/auth', { email });
  await setSessionToken(data.token);
  return data.token;
}

/** POST /scan — OCR + Claude parse. Returns structured draft fields. */
export async function scanCard(imageBase64: string): Promise<ParsedCard> {
  if (DEMO) {
    await delay(1400);
    return nextDemoCard();
  }
  const { data } = await http.post<ParsedCard>('/scan', { imageBase64 });
  return data;
}

/** GET /pipelines — live GHL pipelines + stages for the Review picker. */
export async function fetchPipelines(): Promise<Pipeline[]> {
  if (DEMO) {
    await delay(150);
    return DEMO_PIPELINES;
  }
  const { data } = await http.get<{ pipelines: Pipeline[] }>('/pipelines');
  return data.pipelines;
}

/** POST /push — upsert contact, add to pipeline, enroll in workflow. */
export async function pushContact(contact: ScannedContact): Promise<PushResult> {
  if (DEMO) {
    await delay(700);
    return {
      contactId: 'ct_' + Math.random().toString(36).slice(2, 10),
      opportunityId: contact.pipelineId ? 'op_' + Math.random().toString(36).slice(2, 10) : undefined,
      workflowEnrolled: true,
    };
  }
  const { data } = await http.post<PushResult>('/push', { contact });
  return data;
}
