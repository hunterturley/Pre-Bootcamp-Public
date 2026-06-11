# Switchboard Card Scanner — Backend Proxy

A thin serverless proxy so the mobile app never ships secret keys. All OCR,
Anthropic, and GoHighLevel credentials live here.

Deployed as Vercel functions (`backend/api/*.ts`). Cloudflare Workers or AWS
Lambda would work the same way.

## Endpoints

| Method | Path          | Purpose                                              |
| ------ | ------------- | ---------------------------------------------------- |
| POST   | `/scan`       | OCR the card (Google Vision) → parse fields (Claude) |
| POST   | `/push`       | Upsert GHL contact + opportunity + note              |
| GET    | `/pipelines`  | List the agent's GHL pipelines + stages              |

All endpoints require an `Authorization: Bearer <sessionToken>` header. The
token identifies the agent and (for multi-team) maps to their GHL location.

## `/scan` flow

1. `lib/ocr.ts` — Google Cloud Vision `TEXT_DETECTION` returns raw text.
2. `lib/parse.ts` — Claude turns raw text into strict JSON
   (`firstName, lastName, title, company, phone, email, website, confidence`).
   The static system prompt is prompt-cached; only the OCR text varies.
   Responses are parsed defensively (code-fence strip + `JSON.parse` in
   try/catch).

## `/push` flow

1. `upsertContact` — create/dedupe the GHL contact with tags.
2. `createOpportunity` — add to the selected pipeline/stage (if provided).
3. `addNote` — append the agent's note.
4. Workflow enrollment is handled by a **tag-triggered GHL workflow** already
   configured in Switchboard. The `card-scan` / `open-house` tags fire it on
   upsert, so automation logic stays in GHL.

## Per-location routing

`lib/auth.ts` `resolveLocation()` is the single seam for the single-sub-account
vs. per-location decision:

- **v1 (single sub-account):** every request maps to the env-configured
  location (`GHL_LOCATION_ID` / `GHL_LOCATION_API_KEY`).
- **Multi-team:** replace the body with a lookup that maps the bearer token to
  the agent's location + token from the Switchboard identity store.

## Local dev

```bash
cd backend
cp .env.example .env   # fill in keys
npm install
npm run dev            # vercel dev
```

Point the app at the local URL via `expo.extra.apiBaseUrl` in `app.json`.

## Environment variables

See `.env.example`. None of these belong in the mobile bundle.
