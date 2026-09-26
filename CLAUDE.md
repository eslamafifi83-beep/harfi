# Harfi (حرفي): brief for Claude Code

An Arabic phonics game for one learner: Eslam's 6-year-old daughter, a beginner. The model is the Reading Eggs pattern (lesson map, short games, rewards), with all characters and artwork original. Never recreate existing characters or brands (for example Bougy and Tamtam, Reading Eggs art).

## How it is built
- Plain HTML/CSS/JS with no framework and no build step. `app/` is the whole app, and `npm start` serves it.
- `app/game.js` holds all content and game logic in one IIFE. Content lives near the top: `L` (letters), `W` (words with syllables), `LEVELS`, `PRAISE`, `JOKES`.
- Installable, offline-capable web app: `manifest.webmanifest` and `sw.js`. **Bump `VERSION` in `sw.js` on every change**, or tablets keep the old copy.
- The font (Baloo Bhaijaan 2, OFL) is bundled in `app/fonts/`.
- Progress is stored in `localStorage` under `harfi-v1`.

## Characters
- **Filfil (فلفل)**: a red chili pepper boy, cheeky, with a higher voice. Speaker id `f`.
- **Basbousa (بسبوسة)**: a golden semolina-cake girl with an almond and a pink bow, warm. Speaker id `b`.
- Both are inline SVG in `BUDDY_SVG`. Their animations are CSS classes on `.buddy`: `talking`, `happy`, `sad`, `dance`, `spin`.
- All speech goes through `say()`, `sayThen()`, `speak()`, `speakSeq()` and `soundOut()`. The current speaker is the global `speaker`.

## Voices
- Clips come from **ElevenLabs' free plan** (no card, about 10k characters a month; credit shown on the splash screen). Azure's Egyptian voices remain an option: set `"provider": "azure"` in `voices/voices.json`. Voice IDs and speeds are in the same file.
- Publishing: the GitHub Actions workflow `.github/workflows/deploy.yml` in the repo `eslamafifi83-beep/harfi` runs `voices/generate.mjs` with the `ELEVENLABS_API_KEY` repo secret, caches `app/audio`, and deploys `app/` to GitHub Pages. Everything must stay on free tiers.
- `npm run lines` plays every level headlessly and writes `voices/lines.json`. `npm run voices` makes missing MP3s locally, which needs a `.env`.
- Clip key: `speaker|speed|text`. The speed is `slow` (rate ≤ .62), `calm` (≤ .8) or `normal`. The text has `!؟?…` removed and spaces collapsed.
- A line with no clip falls back to the device voice. In the browser console, `harfiMissing()` lists those lines.
- **Whenever you add or change a spoken line, run `npm run lines` and commit `voices/lines.json`.**
- Keys live only in GitHub secrets or a git-ignored `.env`. Never print them or commit them.

## Language rules
- The friends chat in **Egyptian Arabic** (شاطرة، يلّا، فين، حاولي تاني).
- Letter sounds and written words are **standard Arabic**, with harakat where they help. Teach ث as "th", although Egyptian speech usually turns it into t or s.
- Address the learner in the feminine (اسمعي، دوسي، شاطرة).
- Every screen has three label layers: Arabic, transliteration and English. The EN button hides the last two.

## Curriculum
Letters come in units of 4. Each unit runs six levels in order:
1. Sounds
2. Say it with me (repeat after the friends)
3. Short vowels (fatha, kasra, damma)
4. First sound
5. Write (trace right to left)
6. Words (sound out and build)

Unit 1 is ا ب ت ث and is fully built. Rules:
- The ear leads.
- Wrong options come from letters she has already learned.
- Two misses show a glowing hint.
- Stars reward accuracy, and nobody fails.

## Backlog (in order)
1. Check the voices by ear, and try Arabic voices from the ElevenLabs Voice Library. Fix bad single-sound clips in `voices.json` → `pronounce`.
2. Install on her tablet from the GitHub Pages address.
3. Unit 2 (ج ح خ د) and a review level. Make levels data-driven per unit instead of hard-coded to unit 1.
4. Record-and-playback in "Say it with me" (microphone; play her voice next to the friend's).
5. A parents' page: progress per letter, time played, and a reset.
6. Letter shapes (start, middle, end forms) from unit 3.

## Testing
Run `npm run lines`: it plays every level end to end and fails loudly on script errors. Also check at 1180×820 (tablet) and 400px (phone).
