// Dependency-free mock of the Switchboard backend proxy.
// Lets the app run the full scan loop on a simulator with no real keys.
//
//   node backend/mock/server.mjs           # listens on :8787
//   PORT=9000 node backend/mock/server.mjs
//
// Point the app at it via app.json -> expo.extra.apiBaseUrl, e.g.
//   iOS simulator:      http://localhost:8787
//   Android emulator:   http://10.0.2.2:8787
//   Physical device:    http://<your-lan-ip>:8787

import { createServer } from 'node:http';

const PORT = Number(process.env.PORT ?? 8787);

// A small rotation of fake cards so repeated scans feel real.
const SAMPLE_CARDS = [
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
let cardIndex = 0;

const PIPELINES = [
  {
    id: 'pl_buyer',
    name: 'Buyer Leads',
    stages: [
      { id: 'st_buyer_new', name: 'New Lead' },
      { id: 'st_buyer_nurture', name: 'Nurturing' },
      { id: 'st_buyer_active', name: 'Actively Looking' },
    ],
  },
  {
    id: 'pl_seller',
    name: 'Seller Leads',
    stages: [
      { id: 'st_seller_new', name: 'New Lead' },
      { id: 'st_seller_listing', name: 'Listing Appt Set' },
    ],
  },
  {
    id: 'pl_referral',
    name: 'Agent Referrals',
    stages: [{ id: 'st_ref_new', name: 'New Referral' }],
  },
  {
    id: 'pl_sphere',
    name: 'Sphere of Influence',
    stages: [{ id: 'st_sphere_new', name: 'Added' }],
  },
];

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

function send(res, status, body) {
  const json = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    // Permissive CORS so Expo web / dev tools can hit it too.
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  });
  res.end(json);
}

function readJson(req) {
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (c) => (raw += c));
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        resolve({});
      }
    });
  });
}

function authed(req) {
  const h = req.headers.authorization;
  return typeof h === 'string' && h.startsWith('Bearer ') && h.length > 'Bearer '.length;
}

const server = createServer(async (req, res) => {
  const { method } = req;
  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`);
  const path = url.pathname.replace(/\/+$/, '') || '/';

  if (method === 'OPTIONS') return send(res, 204, {});

  // POST /auth — issue a mock session token. Any email works.
  if (method === 'POST' && path === '/auth') {
    const body = await readJson(req);
    const email = (body.email ?? '').toString();
    if (!email.includes('@')) return send(res, 400, { error: 'A valid email is required' });
    const token = 'mock.' + Buffer.from(`${email}:${Date.now()}`).toString('base64url');
    return send(res, 200, { token, location: 'mock-location-001' });
  }

  // Everything below requires a bearer token (mirrors the real proxy).
  if (!authed(req)) return send(res, 401, { error: 'Missing session token' });

  // GET /pipelines
  if (method === 'GET' && path === '/pipelines') {
    await delay(150);
    return send(res, 200, { pipelines: PIPELINES });
  }

  // POST /scan — fake OCR + parse, with a delay so the Processing UI animates.
  if (method === 'POST' && path === '/scan') {
    const body = await readJson(req);
    if (!body.imageBase64) return send(res, 400, { error: 'imageBase64 is required' });
    await delay(1400);
    const card = SAMPLE_CARDS[cardIndex % SAMPLE_CARDS.length];
    cardIndex += 1;
    return send(res, 200, card);
  }

  // POST /push — pretend to upsert a contact + opportunity.
  if (method === 'POST' && path === '/push') {
    const body = await readJson(req);
    if (!body.contact) return send(res, 400, { error: 'contact is required' });
    await delay(700);
    return send(res, 200, {
      contactId: 'ct_' + Math.random().toString(36).slice(2, 10),
      opportunityId: body.contact.pipelineId ? 'op_' + Math.random().toString(36).slice(2, 10) : undefined,
      workflowEnrolled: true,
    });
  }

  return send(res, 404, { error: `No mock route for ${method} ${path}` });
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[mock] Switchboard backend listening on http://localhost:${PORT}`);
});
