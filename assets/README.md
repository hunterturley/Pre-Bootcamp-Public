# App assets

`app.json` references these images. Add them before running `eas build`:

| File                | Size        | Notes                                              |
| ------------------- | ----------- | -------------------------------------------------- |
| `icon.png`          | 1024 x 1024 | App icon. Brand mark (green square) on parchment.  |
| `adaptive-icon.png` | 1024 x 1024 | Android foreground. Brand mark, transparent or bg. |
| `splash.png`        | 1284 x 2778 | Brand mark centered on `#F6F5F2` parchment.        |

Design direction: forest-green (`#2D6A4F`) routing-lines brand mark on warm
parchment (`#F6F5F2`). Match `switchboard-scanner-app.html`.

During development Expo falls back to a default icon/splash if these are
absent, so the app still runs without them.
