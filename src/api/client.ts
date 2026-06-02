import axios from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

import { ParsedCard, Pipeline, PushResult, ScannedContact } from '../types';

/**
 * Thin client for the Switchboard backend proxy. The app never holds OCR,
 * Anthropic, or GHL keys. Every call goes through the proxy, which injects
 * server-side secrets and routes to the agent's GHL location.
 */

const baseURL =
  (Constants.expoConfig?.extra?.apiBaseUrl as string | undefined) ??
  'https://api.switchboard.example/v1';

const SESSION_TOKEN_KEY = 'switchboard.sessionToken';

const http = axios.create({ baseURL, timeout: 30000 });

http.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync(SESSION_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function setSessionToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(SESSION_TOKEN_KEY, token);
}

export async function clearSessionToken(): Promise<void> {
  await SecureStore.deleteItemAsync(SESSION_TOKEN_KEY);
}

/** POST /scan — OCR + Claude parse. Returns structured draft fields. */
export async function scanCard(imageBase64: string): Promise<ParsedCard> {
  const { data } = await http.post<ParsedCard>('/scan', { imageBase64 });
  return data;
}

/** GET /pipelines — live GHL pipelines + stages for the Review picker. */
export async function fetchPipelines(): Promise<Pipeline[]> {
  const { data } = await http.get<{ pipelines: Pipeline[] }>('/pipelines');
  return data.pipelines;
}

/** POST /push — upsert contact, add to pipeline, enroll in workflow. */
export async function pushContact(contact: ScannedContact): Promise<PushResult> {
  const { data } = await http.post<PushResult>('/push', { contact });
  return data;
}
