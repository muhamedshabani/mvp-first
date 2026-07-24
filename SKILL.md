---
name: mvp-first
description: >-
  Ship a working, shareable demo of ANY product idea in the least time possible —
  web app, mobile app (iOS/Android), desktop app, game, CLI, browser extension,
  hardware mock, anything — optimizing purely for "someone can open it and see it
  working", not for code quality, architecture, security, scalability, or
  maintainability. Use this whenever the user wants to move FAST and the output is
  throwaway: they mention a "demo", "MVP", "prototype", "proof of concept", "POC",
  "mockup that actually works", "something to show a client/investor/stakeholder",
  "quick and dirty", "just make it work", "throwaway", "don't overthink it", "we
  have a meeting tomorrow", or otherwise signal speed-to-demo over doing it
  "properly". Trigger even when they don't say "MVP" but the intent is clearly a
  fast, disposable, impressive-looking demo — for any platform, not just web. Do
  NOT use this for production code, anything that stores real user data, or
  anything meant to live past the demo.
---

# mvp-first — ship a demo, not a product

Your one and only job: get a **demo the user can open and show off** into their hands as
fast as physically possible, whatever the target platform. A client opens it, sees the
product working, says "wow". That's success. Nothing else counts.

Everything you normally worry about as a good engineer — architecture, security, tests,
error handling, accessibility, scalability, clean abstractions, real databases, auth —
is **off** by default. Not "do it lightly." Off. Every one of those things is time spent
not-shipping, and the audience will never see it in a five-minute demo. Spend that time on
what they *do* see: the happy path, believable data, and something they can actually open.

## The core question for every decision

> **Will the audience notice this in the demo?**

- **No** → fake it, hardcode it, or skip it. Immediately. Don't deliberate.
- **Yes** → do the minimum that makes it look real, then move on.

That's the whole philosophy. When in doubt, fake it and move on.

## Pick the fastest path to a shareable demo — by target

A demo is only useful if the audience can experience it. The most shareable thing in the
world is a **URL**, so there's a golden rule that cuts across every platform:

> **If the product's whole point isn't the native platform, build it as a web experience.**
> A link you can text to anyone beats a build they have to install every time. Only go
> native when "it's a real iOS/desktop/console app" is itself the thing being demoed.

Default paths (use these without deliberating; escalate off them only when the demo truly
requires it):

| Target | Fastest demo path | How it's shared |
| --- | --- | --- |
| **Web app** (default when unspecified) | Next.js + TS + Tailwind + shadcn/ui | Deploy to Vercel → live URL |
| **Mobile — iOS/Android** | Expo (React Native), one codebase for both | Expo → published link + QR openable in Expo Go; or `expo export -p web` for a plain URL |
| **Desktop app** | A web app styled like a desktop UI; only reach for Tauri/Electron if native windows/menus/OS APIs are the point | Web URL; or a packaged build + a short screen recording |
| **Game** | Web game — Phaser / three.js / plain canvas. For Unity/Godot, export to **WebGL** | Deploy the build to a URL |
| **CLI / API / backend tool** | Keep the real logic tiny; wrap it in a one-page hosted web playground so the audience can *click*, not install | Deploy the playground → URL |
| **Browser extension** | A normal web page that mimics the extension's panel/popup | Web URL (skip the store) |
| **Something exotic** (hardware, kiosk, TV, watch) | Simulate the interface as a web page sized to the device | Web URL |

Notice the pattern: **web is the escape hatch for almost everything**, because it's the
one artifact anyone can open with zero setup. Reach for a native toolchain only when the
nativeness is the demo.

### Scaffolding, by path

```bash
# Web (default)
npx create-next-app@latest DEMO_NAME --ts --tailwind --app --eslint --use-npm --yes

# Mobile (iOS + Android from one codebase)
npx create-expo-app@latest DEMO_NAME

# Desktop, only if truly native — otherwise use the web path above
npm create tauri-app@latest    # lighter than Electron; still consider faking it as web first
```

Use defaults. Don't customize the tooling, the linter, or the build config — none of it
shows up in the demo.

## Fake everything you can

The fastest backend is no backend. In priority order:

1. **Hardcoded mock data** in a `data.ts` file — arrays of realistic objects. Default choice.
2. **In-memory / component state** — mutations work during the session, reset on refresh.
   Fine for a demo; nobody refreshes mid-pitch.
3. **Device/browser local storage** — only if data must survive a refresh.
4. **A real database** — only when persistence across *different users/devices* is the
   actual point of the demo. Use the lightest hosted option and seed it with mock data. Last resort.

Specific fakes (apply on every platform):

- **Auth**: skip it. If a login screen sells the demo, make *any* input succeed and route
  straight in. Never build real auth.
- **Payments**: a button that shows a success screen. Never integrate a real processor.
- **Emails / notifications / push**: a toast that says "Sent!". Nothing actually sends.
- **Uploads / camera / sensors**: accept the input, show a hardcoded result.
- **AI features**: if the demo IS the AI, call the real API (key stays server-side) but keep
  the integration minimal. If AI is incidental, fake a canned response.
- **Multiplayer / real-time**: script the "other player"/"other user" with a timer, don't
  build networking.

## Make it look real (this is where your time goes)

A demo lives or dies on looking believable, so invest here:

- **Realistic data, not `foo`/`bar`.** Real-sounding names, companies, dates, prices, avatars
  (e.g. `https://i.pravatar.cc/100?img=N`), and enough rows that the screen looks alive.
- **Polish the happy path only.** The exact click-path you'll demo should feel smooth. Anything
  off that path can dead-end or do nothing — don't spend a second on it.
- **Decent spacing, a title, a logo/wordmark, a coherent color.** Component libraries get you
  most of the way. Loading spinners and a little animation read as "real product".
- **Target one screen.** Make it look right at the size and orientation it'll be presented on
  (laptop for web, a phone frame for mobile). Skip other viewports, dark-mode parity, and print.

## Don't do (unless the user explicitly asks)

Tests · error handling beyond "don't crash on the happy path" · form validation · accessibility
passes · loading/empty/error states for flows you won't demo · database migrations · CI ·
Docker · env-var ceremony · refactoring · app-store submission · code signing · comments
explaining architecture · "just in case" features. Each one is time the audience never sees.

## The workflow

1. **Nail the one flow (≤2 questions, then go).** Ask only what changes what you build:
   *What's the single flow the audience must see working? On what device will you show it?*
   Don't gather requirements like it's a real project — you need just enough to fake convincingly.
2. **Choose the path** from the table above and scaffold it.
3. **Build the happy path**, top to bottom, wired to mock data. One flow, working, end to end.
4. **Seed believable data** so every screen looks populated and alive.
5. **Ship it to where the audience can open it** (see below). "Runs on my machine" is not a demo
   anyone else can experience.
6. **Hand off**: give the user the link/build plus a 3–5 line "demo script" of exactly what to
   click and what to say, so the pitch runs itself.

## Ship it so the audience can open it

The demo isn't done until the user has something to *hand over*:

```bash
# Web (default): live URL
npm i -g vercel && vercel --yes   # then `vercel --prod` for the shareable link

# Mobile: a link/QR openable in Expo Go, or a web build with a plain URL
npx expo export -p web            # → deploy the web build like any static site
# (or) npx eas update             # publishes an over-the-air link for Expo Go

# Static builds / games (WebGL export, plain HTML): any static host
npx netlify deploy                # or Cloudflare Pages, or `vercel`
```

If the user isn't logged into the deploy tool, tell them the one manual step (e.g. `vercel
login`) rather than stalling. For a genuinely native desktop/mobile build that can't be a URL,
produce the installable artifact **and** a short screen recording, so there's always something
shareable. Always end by handing back the link (or the build path) explicitly.

## Stay honest and safe (the one place you don't cut corners)

Speed is the goal, but a few things are never worth faking away — they protect the user and
the people who'll see the demo:

- **Say it's a prototype.** Remind the user (and suggest they tell their audience) that this is a
  throwaway demo with faked data and no real backend — so nobody mistakes it for something
  that's secure, private, or ready for real users.
- **No real sensitive data.** Seed with obviously fake data. Never wire the demo to collect
  real passwords, payment details, or personal information from whoever's clicking around.
- **No secrets in client code.** If you must call a real API, keep the key server-side, never
  in the shipped bundle — a leaked key is a real cost even for a throwaway.
- **Don't dress the fakes up as real.** A "Payment successful" screen is fine for a demo; a
  fabricated result presented to the audience as genuine is not. Keep the user in the loop
  about what's simulated.

If the user asks to turn the demo into something real later, that's a different job — say so,
and don't let demo shortcuts silently graduate into production.
