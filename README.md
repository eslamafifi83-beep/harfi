# Harfi · حرفي

All 28 Arabic letters and their sounds, with Filfil and Toota.

## How the voices are made
The voices come from ElevenLabs' free plan, with no card needed. GitHub makes any missing clips automatically every time the project changes and once a month, using the key stored in the project's GitHub secrets (`ELEVENLABS_API_KEY`). If a month's free credits run out, the rest are made the next month; until then those lines use the tablet's voice.

Filfil and Toota chat in Egyptian voices made with ElevenLabs Voice Design, and read letters and words in standard Arabic voices, so ج stays "j" and ق stays "q".

To change how Filfil or Toota sounds, pick different voices at elevenlabs.io, paste their IDs into `voices/voices.json`, and save the file on GitHub. The clips are remade automatically.

## Play on this computer
```
npm start
```
Open the address it prints. A tablet on the same Wi-Fi can use the second address.

## On her tablet
The app is published free on GitHub Pages. Open its address on the tablet:
- **iPad:** open it in Safari, tap Share, then Add to Home Screen.
- **Android:** open it in Chrome, open the menu, then Install app.

After that it works offline.

## Changing the game
Open this folder in Claude Code. `CLAUDE.md` tells it how everything fits together. After changing anything the friends say, run:
```
npm run lines
npm run voices
```
