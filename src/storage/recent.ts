import AsyncStorage from '@react-native-async-storage/async-storage';

import { ScannedContact } from '../types';

/** Local persistence for the Recent Scans list. */

const RECENT_KEY = 'switchboard.recentScans';
const MAX_RECENT = 20;

export async function loadRecent(): Promise<ScannedContact[]> {
  try {
    const raw = await AsyncStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ScannedContact[]) : [];
  } catch {
    return [];
  }
}

export async function saveRecent(list: ScannedContact[]): Promise<void> {
  try {
    await AsyncStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, MAX_RECENT)));
  } catch {
    // Non-fatal: history is a convenience, not a source of truth.
  }
}
