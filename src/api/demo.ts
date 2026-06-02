import { ParsedCard, Pipeline } from '../types';

/**
 * Offline demo data. When the configured API base URL is a placeholder (no
 * real backend), the client serves these instead of making network calls, so
 * the full scan loop is clickable in a web build or in Expo Go with no backend.
 */

export function isDemo(baseUrl: string): boolean {
  return baseUrl.includes('example') || baseUrl.includes('demo');
}

export const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export const DEMO_CARDS: ParsedCard[] = [
  {
    firstName: 'Jordan',
    lastName: 'Avery',
    title: 'Listing Agent',
    company: 'Cedar & Oak Realty',
    phone: '+15125550148',
    email: 'jordan@cedaroak.com',
    website: 'cedaroak.com',
    confidence: 0.97,
  },
  {
    firstName: 'Mara',
    lastName: 'Quinn',
    title: 'Senior Loan Officer',
    company: 'Brightpath Lending',
    phone: '+14155550172',
    email: 'mara.quinn@brightpath.com',
    website: 'brightpath.com',
    confidence: 0.93,
  },
  {
    firstName: 'Devin',
    lastName: 'Park',
    title: 'Home Inspector',
    company: 'Keystone Inspections',
    phone: '+12065550199',
    email: 'devin@keystoneinspect.com',
    website: 'keystoneinspect.com',
    confidence: 0.89,
  },
];

export const DEMO_PIPELINES: Pipeline[] = [
  {
    id: 'pl_buyer',
    name: 'Buyer Leads',
    stages: [
      { id: 'st_buyer_new', name: 'New Lead' },
      { id: 'st_buyer_nurture', name: 'Nurturing' },
      { id: 'st_buyer_active', name: 'Actively Looking' },
    ],
  },
  { id: 'pl_seller', name: 'Seller Leads', stages: [
      { id: 'st_seller_new', name: 'New Lead' },
      { id: 'st_seller_listing', name: 'Listing Appt Set' },
    ] },
  { id: 'pl_referral', name: 'Agent Referrals', stages: [{ id: 'st_ref_new', name: 'New Referral' }] },
  { id: 'pl_sphere', name: 'Sphere of Influence', stages: [{ id: 'st_sphere_new', name: 'Added' }] },
];

let cardIndex = 0;
export function nextDemoCard(): ParsedCard {
  const card = DEMO_CARDS[cardIndex % DEMO_CARDS.length];
  cardIndex += 1;
  return card;
}
