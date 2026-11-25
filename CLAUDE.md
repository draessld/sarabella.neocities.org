# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static website for [sarabella.neocities.org](https://sarabella.neocities.org) — a preservation hub for Bella Sara Flash games. The site hosts archived Flash games (via Ruffle), Phaser-based remakes, and community resources.

## Deployment

- The entire `public/` directory is deployed to Neocities on push to `main` via GitHub Actions (`.github/workflows/ci.yml`)
- No build step — everything is vanilla HTML/CSS/JS, served directly as static files
- There is no local dev server configured; open HTML files directly in a browser or use any static file server

## Architecture

### Directory Layout
- `public/` — everything served on the site
- `public/flash/` — archived SWF game directories, each self-contained
- `public/phasergames/` — HTML5 remakes built with Phaser 3
- `public/ruffle/` — Ruffle Flash emulator runtime (JS + WASM)
- `public/localization/` — i18n JSON files (9 languages)

### Shared Components
- **[header.js](public/header.js)** / **[footer.js](public/footer.js)** — injected via `document.write()` on every page
- **[language.js](public/language.js)** — i18n system; reads `data-il8n` attributes and swaps text from locale JSON files; uses `localStorage` for user language override, falls back to `navigator.language`
- **[userManager.js](public/userManager.js)** — localStorage-based user system; stores username, horseshoes (currency), level, and per-user save data; max 2 simultaneous users, delimited with `²`
- **[flags.js](public/flags.js)** — language switcher UI using flag images

### Localization
HTML elements use `data-il8n="key"` attributes. `language.js` queries all such elements at load time and replaces their text from the active locale JSON (`public/localization/neocitiesLoca_<lang>.json`). When adding new translatable strings, add the key to all 9 locale files.

### Flash Games
Each game under `public/flash/` is a standalone directory with its own HTML launcher that embeds a Ruffle player pointing at a `.swf` file. Ruffle is loaded from `public/ruffle/ruffle.js`.

### Phaser Games
Games under `public/phasergames/` use **Phaser 3.80.1** (loaded from CDN) with local scene/asset files. The main recreation is `public/phasergames/stablesrecreation/`. Some games also use the Spine plugin for skeletal animation.

### User Data Model (localStorage)
- `userList` — `²`-delimited list of usernames
- Per-user key `<username>` — JSON with fields: `horseshoes`, `level`, `creations`, etc.
- `activeUser` — currently logged-in username
