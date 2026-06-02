# Switchboard Card Scanner

Scan a business card, parse it into clean contact fields, confirm, and push the
contact into GoHighLevel (GHL) where Switchboard's intake workflows take over.

A premium add-on to Switchboard. Native iOS + Android from one Expo / React
Native codebase. Design reference: `switchboard-scanner-app.html`.

> Core promise: scan a card at an open house and the new contact is in the
> follow-up sequence before you leave the driveway.

## What's in this repo (Phase 1 MVP)

```
.
├── App.tsx                 # Root: font loading, navigation, tabs
├── app.json                # Expo config, permission strings, bundle ids
├── eas.json                # EAS Build / Submit profiles
├── src/
│   ├── theme.ts            # Brand design tokens (colors, fonts, type scale)
│   ├── types.ts            # ScannedContact, ParsedCard, Pipeline, ...
│   ├── constants.ts        # Tags, fallback pipelines, processing copy
│   ├── api/client.ts       # Talks to the backend proxy (no secret keys)
│   ├── capture.ts          # expo-image-picker (choose from photos)
│   ├── store/scanStore.ts  # Zustand: the 4-state scan flow machine
│   ├── components/         # BrandMark, Viewfinder, CameraModal, Pill, ...
│   ├── navigation/         # Bottom tabs (Scan / Contacts / Pipeline / Settings)
│   └── screens/scan/       # Idle → Processing → Review → Success
└── backend/                # Serverless proxy: /scan, /push, /pipelines
```

The Scan tab is a four-state machine driven by `scanStore`, not by navigation
routes — matching the prototype's single-screen flow:

`idle` → `processing` → `review` → `success`

The Processing checklist (`Extracting text → Structuring fields → Matching &
enriching → Preparing CRM entry`) lights up off **real async progress** from the
`/scan` call, not a fixed timer.

Contacts, Pipeline, and Settings tabs are intentional v1 stubs.

## Setup

```bash
npm install
npm start            # then press i (iOS) or a (Android)
```

Fonts (`Plus Jakarta Sans`, `DM Mono`) load via `@expo-google-fonts`. The app
shows a spinner until they're ready.

### Point the app at a backend

Set `expo.extra.apiBaseUrl` in `app.json` to your deployed proxy (see
`backend/README.md`). The app reads it through `expo-constants`. **No OCR,
Anthropic, or GHL keys ever live in the mobile bundle** — every call goes
through the proxy, which injects them server-side and routes to the agent's GHL
location.

## Brand design tokens

Defined once in `src/theme.ts` and used everywhere:

- Accent forest green `#2D6A4F`, warm parchment background `#F6F5F2`.
- Plus Jakarta Sans for headings/body/buttons, DM Mono for labels/wordmark/tags.
- Primary button: accent fill, white text, `0 6px 18px rgba(45,106,79,0.28)`
  shadow, scales to 0.98 on press.
- No em dashes in UI copy (brand rule).

## Permissions

Declared in `app.json`:

- iOS: `NSCameraUsageDescription`, `NSPhotoLibraryUsageDescription`.
- Android: `CAMERA`, `READ_MEDIA_IMAGES`.

## Build phases

- **Phase 1 — Core scan loop (this MVP):** scaffold, theme, fonts, tabs, camera
  + photo picker, `/scan` (OCR + Claude parse), Processing/Review wired to real
  parse output, `/push` to create the GHL contact with tags, Success screen.
- **Phase 2 — Pipeline + polish:** live `/pipelines` picker, opportunity
  creation, card image + note sync, local Recent Scans history, Reanimated
  transitions.
- **Phase 3 — Productize:** auth tied to Switchboard accounts, push
  notifications, offline queue, finalized per-location routing, Settings screen.
- **Phase 4 — Store launch:** icon + splash, App Store + Google Play listings,
  `eas build` / `eas submit`, privacy policy.

## Phase 1 status against acceptance criteria

| # | Criterion                                              | Status                                              |
| - | ------------------------------------------------------ | --------------------------------------------------- |
| 1 | Launches iOS + Android with brand theme + fonts        | Done (scaffold + theme + Google Fonts)              |
| 2 | "Scan Card" opens camera; "choose from photos" library | Done (`CameraModal`, `pickFromLibrary`)             |
| 3 | Captured card → parsed fields on Review in seconds     | Wired to `/scan`; needs the deployed backend + keys |
| 4 | Editing a field updates the payload                    | Done (`updateDraft` in the store)                   |
| 5 | "Push to CRM" creates the contact in the right location| Wired to `/push`; needs GHL credentials             |
| 6 | Success screen reflects the actual contact created     | Done                                                |
| 7 | No API keys anywhere in the mobile bundle              | Done (all keys live in `backend/`)                  |

Criteria 3 and 5 are code-complete on the client; they go fully green once the
backend in `backend/` is deployed with real OCR / Anthropic / GHL keys.

## Notes

- Typecheck: `npm run typecheck` (app) and `cd backend && npm run typecheck`.
- App icon / splash assets are documented in `assets/README.md`.
