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

## Pick the target, then open its playbook

There's one rule that cuts across every platform:

> **If the product's whole point isn't the native platform, build it as a web experience.**
> A link you can text to anyone beats a build someone has to install. Only go native when
> "it's a real iOS/desktop/console app" is itself the thing being demoed.

Match the request to a target and read that **one** playbook before building — each has the
exact scaffold commands, the deploy step, and the traps that waste time:

| The request is a… | Read | Default fast path |
| --- | --- | --- |
| Web app, SaaS, dashboard, landing, tool-with-a-UI | [references/web.md](references/web.md) | Next.js + Tailwind + shadcn → Vercel URL |
| iOS / Android / cross-platform mobile app | [references/mobile.md](references/mobile.md) | Expo → Expo Go link + QR, or web build URL |
| Desktop app | [references/desktop.md](references/desktop.md) | Web styled as desktop; Tauri only if truly native |
| Game | [references/games.md](references/games.md) | Web game (Phaser/three.js) or WebGL export → URL |
| CLI, API, backend tool, library | [references/cli.md](references/cli.md) | Wrap the tiny real logic in a hosted web playground |
| Browser extension, kiosk, TV, watch, exotic | [references/web.md](references/web.md) | Simulate the interface as a web page → URL |

Don't read all of them. Pick the target from the user's request (ask only if genuinely
ambiguous), open that file, and go.

## Fake everything you can

The fastest backend is no backend. In priority order:

1. **Hardcoded mock data** in a `data.ts` file — arrays of realistic objects. Default choice.
2. **In-memory / component state** — mutations work during the session, reset on refresh.
   Fine for a demo; nobody refreshes mid-pitch.
3. **Device/browser local storage** — only if data must survive a refresh.
4. **A real database** — only when persistence across *different users/devices* is the
   actual point of the demo. Use the lightest hosted option, seed it with mock data. Last resort.

Specific fakes, on every platform: **auth** — any input succeeds, route straight in, never
build real auth. **Payments** — a button → success screen. **Email/notifications/push** — a
toast that says "Sent!". **Uploads/camera/sensors** — accept the input, show a hardcoded
result. **AI** — if the demo IS the AI, call the real API (key server-side) but keep it
minimal; if AI is incidental, fake a canned response. **Multiplayer/real-time** — script the
"other user" with a timer, don't build networking.

## Make it look real (this is where your time goes)

A demo lives or dies on looking believable, so invest here:

- **Realistic data, not `foo`/`bar`.** A mock-data generator is bundled at
  [assets/mockdata.ts](assets/mockdata.ts) — copy it into the project and import it for
  believable names, avatars, companies, prices, dates, and paragraphs. It's zero-dependency
  and **seeded**, so the same data shows every reload (stable screenshots, no flicker). Use it
  instead of hand-typing fake rows or installing faker.
- **Polish the happy path only.** The exact click-path you'll demo should feel smooth.
  Anything off that path can dead-end or do nothing — don't spend a second on it.
- **Decent spacing, a title, a logo/wordmark, a coherent color.** Component libraries get you
  most of the way. Loading spinners and a little animation read as "real product".
- **Target one screen.** Make it look right at the size and orientation it'll be presented on.
  Skip other viewports, dark-mode parity, and print.

## Don't do (unless the user explicitly asks)

Tests · error handling beyond "don't crash on the happy path" · form validation · accessibility
passes · loading/empty/error states for flows you won't demo · database migrations · CI ·
Docker · env-var ceremony · refactoring · app-store submission · code signing · comments
explaining architecture · "just in case" features. Each one is time the audience never sees.

## The workflow

1. **Nail the one flow (≤2 questions, then go).** Ask only what changes what you build:
   *What's the single flow the audience must see working? On what device will you show it?*
   You need just enough to fake convincingly, not a requirements doc.
2. **Open the playbook** for the target (table above) and scaffold as it says.
3. **Build the happy path** top to bottom, wired to mock data. One flow, working, end to end.
4. **Seed believable data** with `assets/mockdata.ts` so every screen looks populated and alive.
5. **Ship it to where the audience can open it** — follow the playbook's deploy step. "Runs on
   my machine" is not a demo anyone else can experience.
6. **Hand off**: give the user the link/build plus a 3–5 line "demo script" of exactly what to
   click and what to say, so the pitch runs itself.

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
