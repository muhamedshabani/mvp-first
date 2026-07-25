# Playbook: game

The goal is a **playable slice** behind a link — one mechanic, one level, that feels alive. Not a
game. Pick by what the user already has:

- **Starting from scratch → build a web game.** It deploys to a URL and needs no engine install.
  - 2D (platformer, puzzle, top-down, arcade): **Phaser**.
  - 3D: **three.js**.
  - Something tiny/custom: plain `<canvas>` + `requestAnimationFrame`.
- **They already have a Unity / Godot / Unreal project → export to WebGL/HTML5.** Don't rebuild it;
  export the existing thing to a web build and deploy that folder.

## Scaffold a web game (Phaser example)

```bash
npm create vite@latest DEMO_NAME -- --template vanilla-ts
cd DEMO_NAME && npm install phaser
npm run dev
```

Put the whole game in `src/main.ts`: one `Scene` with `preload`/`create`/`update`. Keep it in one
file — this is throwaway. For three.js, swap `npm install three` and a single scene + animation loop.

## Export an existing engine project

- **Unity:** File → Build Settings → **WebGL** → Build. Deploy the output folder.
- **Godot:** Project → Export → **Web (HTML5)**. Deploy the exported folder.
- Then treat the build folder as a static site (deploy step below). Don't touch the game logic.

## Make it feel alive (this is the whole demo)

- Ship **one** mechanic that works and feels responsive. Depth is faked: hardcode the levels,
  enemies, and score. A believable HUD (score, lives, a timer) reads as "real game".
- **Script the opponent/AI** with timers and fixed patterns — never build real game AI or netcode.
- Use free placeholder art (simple shapes, a free sprite pack) rather than making assets.

## Deploy → shareable URL (required)

```bash
npm run build
npx netlify deploy --prod --dir dist   # or `vercel`, or Cloudflare Pages — any static host
```

For engine WebGL exports, point the deploy at the export folder instead of `dist`.

## Traps that waste time (skip them)

- **More than one level/mechanic.** The client needs to *feel* it, not finish it.
- **Save systems, menus, settings, audio polish, mobile touch controls.** Keyboard/mouse on a
  laptop is enough.
- **Asset optimization / huge WebGL build tuning.** If it loads in a few seconds, ship it.
- **Real multiplayer.** Fake the second player with scripted behavior.

## Hand off

Paste the URL plus "click here, use arrow keys/WASD, here's the one thing to try." A short screen
recording is a nice backup if the venue's Wi-Fi is unreliable.
