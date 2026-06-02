import { create } from 'zustand';

import { scanCard, pushContact } from '../api/client';
import { DEFAULT_TAGS, FALLBACK_PIPELINES } from '../constants';
import { ParsedCard, Pipeline, ScannedContact } from '../types';
import { localId } from '../utils/id';
import { normalizePhone } from '../utils/phone';

/** The four primary states inside the Scan tab. */
export type ScanStage = 'idle' | 'processing' | 'review' | 'success';

type ProcessingStepState = 'pending' | 'active' | 'done';

type ScanState = {
  stage: ScanStage;
  cardImageUri: string | null;
  draft: ScannedContact | null;
  pipelines: Pipeline[];
  /** 0..3, lights up the Processing checklist off real async progress. */
  stepStates: ProcessingStepState[];
  error: string | null;
  recent: ScannedContact[];

  // actions
  startProcessing: (imageUri: string, imageBase64: string) => Promise<void>;
  updateDraft: (patch: Partial<ScannedContact>) => void;
  toggleTag: (tag: string) => void;
  push: () => Promise<void>;
  reset: () => void;
};

const initialSteps: ProcessingStepState[] = ['pending', 'pending', 'pending', 'pending'];

function setStep(steps: ProcessingStepState[], index: number, value: ProcessingStepState) {
  const next = [...steps];
  next[index] = value;
  return next;
}

function draftFromParse(parsed: ParsedCard, imageUri: string): ScannedContact {
  return {
    id: localId(),
    firstName: parsed.firstName ?? '',
    lastName: parsed.lastName ?? '',
    title: parsed.title || undefined,
    company: parsed.company || undefined,
    phone: normalizePhone(parsed.phone),
    email: parsed.email || undefined,
    website: parsed.website || undefined,
    tags: [...DEFAULT_TAGS],
    pipelineId: FALLBACK_PIPELINES[0].id,
    pipelineStageId: FALLBACK_PIPELINES[0].stages[0].id,
    note: undefined,
    confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.9,
    cardImageUri: imageUri,
    status: 'draft',
    createdAt: new Date().toISOString(),
  };
}

export const useScanStore = create<ScanState>((set, get) => ({
  stage: 'idle',
  cardImageUri: null,
  draft: null,
  pipelines: FALLBACK_PIPELINES,
  stepStates: initialSteps,
  error: null,
  recent: [],

  startProcessing: async (imageUri, imageBase64) => {
    set({
      stage: 'processing',
      cardImageUri: imageUri,
      error: null,
      stepStates: setStep(initialSteps, 0, 'active'),
    });

    try {
      // Step 1 + 2: OCR + Claude parse happen server-side in one /scan call.
      const parsed = await scanCard(imageBase64);
      set((s) => ({ stepStates: setStep(setStep(s.stepStates, 0, 'done'), 1, 'active') }));

      const draft = draftFromParse(parsed, imageUri);
      set((s) => ({ stepStates: setStep(setStep(s.stepStates, 1, 'done'), 2, 'active') }));

      // Step 3: enrichment hook (currently a pass-through on the draft).
      set((s) => ({ stepStates: setStep(setStep(s.stepStates, 2, 'done'), 3, 'active') }));

      // Step 4: payload ready.
      set((s) => ({ stepStates: setStep(s.stepStates, 3, 'done'), draft, stage: 'review' }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Could not read that card. Try again.',
        stage: 'idle',
        stepStates: initialSteps,
      });
    }
  },

  updateDraft: (patch) => {
    const draft = get().draft;
    if (!draft) return;
    set({ draft: { ...draft, ...patch } });
  },

  toggleTag: (tag) => {
    const draft = get().draft;
    if (!draft) return;
    const has = draft.tags.includes(tag);
    const tags = has ? draft.tags.filter((t) => t !== tag) : [...draft.tags, tag];
    set({ draft: { ...draft, tags } });
  },

  push: async () => {
    const draft = get().draft;
    if (!draft) return;
    const normalized: ScannedContact = {
      ...draft,
      phone: normalizePhone(draft.phone),
      status: 'syncing',
    };
    set({ draft: normalized, error: null });

    try {
      await pushContact(normalized);
      const synced: ScannedContact = { ...normalized, status: 'synced' };
      set((s) => ({
        draft: synced,
        stage: 'success',
        recent: [synced, ...s.recent].slice(0, 8),
      }));
    } catch (err) {
      set({
        draft: { ...normalized, status: 'error' },
        error: err instanceof Error ? err.message : 'Push failed. Your edits are kept. Try again.',
      });
    }
  },

  reset: () =>
    set({
      stage: 'idle',
      cardImageUri: null,
      draft: null,
      stepStates: initialSteps,
      error: null,
    }),
}));
