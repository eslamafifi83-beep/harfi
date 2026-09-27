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
- **Toota (توتة)**: a little purple berry girl with a leaf crown and a pink bow, warm. Speaker id `b`. She teaches every letter, sound and word, and only ever has a female voice.
- Both are inline SVG in `BUDDY_SVG`. Their animations are CSS classes on `.buddy`: `talking`, `happy`, `sad`, `dance`, `spin`.
- The opening show (`showTime()` in `game.js`, `.show` styles): a stage with curtains, Filfil bursts out of a gift box, Toota drops from the sky, letters rain down, then she can tap them. First visit plays the full show (`save.met < 3`), later visits a short hello. Names are said inside normal sentences at normal speed, never split into slow syllables. Its lines live in `SHOW`.
- All speech goes through `say()`, `sayThen()`, `speak()`, `speakSeq()` and `soundOut()`. Every line has exactly one speaker: phonics defaults to Toota, and chat lines are assigned by `whoFor()` unless a speaker is passed. Toota never falls back to Filfil's clips.

## Voices
- Each friend has two voices: a standard one for letter names, sounds, syllables and words (`voice_ids`), and an Egyptian one designed with ElevenLabs Voice Design ("Harfi Toota Egyptian", "Harfi Filfil Egyptian") for everything they chat (`chat_voice_ids`). `generate.mjs` sorts lines using `app/content.js`: anything that is a letter, sound, syllable or word is phonics, and the rest is chat.
- Clips come from **ElevenLabs' free plan** (no card, about 10k characters a month; credit shown on the splash screen). Azure's Egyptian voices remain an option: set `"provider": "azure"` in `voices/voices.json`. Voice IDs and speeds are in the same file.
- Publishing: the GitHub Actions workflow `.github/workflows/deploy.yml` in the repo `eslamafifi83-beep/harfi` runs `voices/generate.mjs` with the `ELEVENLABS_API_KEY` repo secret, commits new clips to `app/audio` (so they are never paid for twice), runs monthly to finish clips when free credits renew, and deploys `app/` to GitHub Pages. Everything must stay on free tiers.
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
All 28 letters, in 7 units of 4. Content (letters, picture words, words to build, drawings) lives in `app/content.js`, and the engine in `app/game.js` is unit-driven.

| Unit | Letters | Words to build |
| --- | --- | --- |
| 1 | ا ب ت ث | بابا، باب، تاتا |
| 2 | ج ح خ د | دبّ، تاج، حبّ |
| 3 | ذ ر ز س | جرس، رزّ، بحر |
| 4 | ش ص ض ط | ضرس، بطاطس، شاطر |
| 5 | ظ ع غ ف | ظرف، عشب، فرح |
| 6 | ق ك ل م | قلم، كلب، قمر |
| 7 | ن ه و ي | ماما، بيت، نور |

Each unit runs the same six levels: Sounds, Say it with me, Short vowels, First sound, Write (colour in the letter, which works for any glyph), Words. A unit opens when the one before is finished. Rules:
- The ear leads.
- Wrong options come from this unit plus earlier letters, for review.
- Words only use letters already learned.
- Two misses show a glowing hint.
- Stars reward accuracy, and nobody fails.

## Backlog (in order)
1. Check the voices by ear. Fix bad single-sound clips in `voices.json` → `pronounce`.
2. A review level between units, and letter shapes (start, middle, end forms).
3. Record-and-playback in "Say it with me" (microphone; play her voice next to the friend's).
4. A parents' page: progress per letter, time played, and a reset.

## Testing
Run `npm run lines`: it plays every level end to end and fails loudly on script errors. Also check at 1180×820 (tablet) and 400px (phone).
