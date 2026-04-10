# AGENTS.md

## Cursor Cloud specific instructions

This is a Vue 3 + Vite mobile game ("Silly Phone Battle") — a split-screen two-player party game.

### Development

```bash
npm install
npm run dev      # starts at http://localhost:5173/silly-phone-game/
npm run build    # production build to dist/
npm run preview  # preview production build
```

### Architecture

- **Framework:** Vue 3 (Composition API, `<script setup>`)
- **Build:** Vite 8, deployed to GitHub Pages via GitHub Actions
- **Structure:**
  - `src/App.vue` — root with screen routing (home → game → scoreboard)
  - `src/components/GameManager.vue` — round lifecycle, mini-game selection
  - `src/components/games/` — individual mini-games (TapRace, QuickDraw, ColorMatch, HoldSteady, ShakeOff)
  - `src/composables/` — shared utilities (useVibrate, useSound)

### Notes

- The `base` in `vite.config.js` is set to `/silly-phone-game/` for GitHub Pages. If deploying elsewhere, adjust accordingly.
- No linter or test framework is configured yet. Add ESLint + Vitest if needed.
- The dev server binds to `0.0.0.0` so it's accessible from the network.
