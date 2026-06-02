import { Pipeline } from './types';

/** Tag pills shown on the Review screen. `open-house` and `card-scan` default on. */
export const DEFAULT_TAGS = ['open-house', 'card-scan'];

export const AVAILABLE_TAGS = [
  'open-house',
  'card-scan',
  'referral',
  'buyer',
  'seller',
  'agent',
  'lender',
  'inspector',
];

/**
 * Fallback pipelines for the Review picker before `/pipelines` returns live
 * data from the agent's GHL sub-account. Stage ids are placeholders.
 */
export const FALLBACK_PIPELINES: Pipeline[] = [
  { id: 'buyer-leads', name: 'Buyer Leads', stages: [{ id: 'new', name: 'New Lead' }] },
  { id: 'seller-leads', name: 'Seller Leads', stages: [{ id: 'new', name: 'New Lead' }] },
  { id: 'agent-referrals', name: 'Agent Referrals', stages: [{ id: 'new', name: 'New Lead' }] },
  { id: 'sphere', name: 'Sphere of Influence', stages: [{ id: 'new', name: 'New Lead' }] },
];

/** Heading cycle for the Processing screen. */
export const PROCESSING_HEADINGS = [
  'Reading card.',
  'Structuring fields.',
  'Enriching record.',
  'Almost there.',
];

/** Four-step checklist on the Processing screen. */
export const PROCESSING_STEPS = [
  'Extracting text',
  'Structuring contact fields',
  'Matching & enriching record',
  'Preparing CRM entry',
];
