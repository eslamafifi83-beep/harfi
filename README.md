# Harfi · حرفي

Arabic letters and sounds with Filfil and Basbousa.

## How the voices are made
The voices come from ElevenLabs' free plan, with no card needed. GitHub makes them automatically every time the project changes, using the key stored in the project's GitHub secrets (`ELEVENLABS_API_KEY`).

To change how Filfil or Basbousa sounds, pick different voices at elevenlabs.io, paste their IDs into `voices/voices.json`, and save the file on GitHub. The clips are remade automatically.

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
