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

**Know when to stop.** A shipped demo of the one flow beats a half-built demo of three. If you're
roughly 45 minutes in and there's still no openable link, you're over-building — cut scope to the
single money-shot screen, fake whatever's blocking it, and ship *that*. Time spent polishing past
"the audience says wow" is time the audience never sees. Ship, then improve only if time is left.

## Before any code: get the brief

A demo lands because the client recognises **their** product on the screen. So the demo always
follows the **client's main business logic** — the screens, the objects, the vocabulary and the
steps come from how their business actually works, never from a generic dashboard template with
the nouns swapped out. If you don't know their core flow, you can't fake it convincingly.

Three things you cannot guess and must ask for **before writing a line of code**:

- **Color palette** — offer the six below as checkbox options, always with an "other" free-text
  escape for the client's own hex codes. If they have brand colors, those win over any preset.
- **Company name / brand** — the wordmark that goes top-left on every screen, plus one line on
  what the business actually does. That line is what drives the business logic above.
- **Display language** — the language every label, button and mock data row is written in. Ask
  early because retrofitting copy across finished screens is pure waste, and because RTL
  languages (Arabic, Hebrew) change the layout, not just the strings.

Ask all of them in **one** `AskUserQuestion` round, before scaffolding. Add at most one or two
more questions to that same round when the answer genuinely changes what you build — the single
flow the audience must see, the device it'll be shown on, breadth vs. depth. Anything you could
reasonably decide yourself, decide yourself.

Then stop asking and build. This is still single-prompt demo development: one round of
questions, then a finished demo — not a requirements interview. If the user skips or dismisses
the questions, pick sensible defaults, say what you picked, and keep going.

### The six palettes

Every row is a complete, contrast-checked set. All six are ready to paste at
[assets/theme.css](assets/theme.css) — copy that file in, set `<html data-theme="emerald">` to
the palette they chose, and you're themed. It carries four more tokens derived from each row —
`--primary-hover`, `--soft`, `--on-soft`, and `--link` — plus the Tailwind and shadcn mappings.
Use those twelve tokens and nothing outside them.

| Palette | `--primary` | `--on-primary` | `--bg` | `--surface` | `--text` | `--muted` | `--border` | `--accent` |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Deep blue + slate** | `#1D4ED8` | `#FFFFFF` | `#F8FAFC` | `#FFFFFF` | `#0F172A` | `#64748B` | `#E2E8F0` | `#0284C7` |
| **Emerald + warm neutral** | `#047857` | `#FFFFFF` | `#FAF9F6` | `#FFFFFF` | `#1C1917` | `#78716C` | `#E7E5E4` | `#B45309` |
| **Amber + charcoal** | `#D97706` | `#1C1917` | `#FAFAF9` | `#FFFFFF` | `#1C1917` | `#78716C` | `#E7E5E4` | `#0F766E` |
| **Violet + near-black** (dark) | `#7C3AED` | `#FFFFFF` | `#0B0B0F` | `#16161D` | `#F4F4F5` | `#A1A1AA` | `#27272A` | `#22D3EE` |
| **Teal + slate** | `#0F766E` | `#FFFFFF` | `#F7FAFA` | `#FFFFFF` | `#0F172A` | `#64748B` | `#E2E8F0` | `#B45309` |
| **Monochrome + one accent** | `#111111` | `#FFFFFF` | `#FFFFFF` | `#FAFAFA` | `#111111` | `#6B7280` | `#E5E5E5` | `#E11D48` |

Which to suggest when you know the industry: **deep blue** for fintech, B2B, enterprise SaaS,
insurance · **emerald** for finance, sustainability, wellness, agriculture · **amber** for food,
retail, logistics, hospitality, marketplaces · **violet (dark)** for AI products, developer
tools, creative platforms · **teal** for health, medical, education, public sector ·
**monochrome** for agencies, editorial, luxury, portfolios.

Rules for using them: `--on-primary` is the only text color allowed on a primary-colored button
— note the amber row needs dark text, not white. `--accent` is for charts, badges and highlight
states, never for primary buttons. Link and nav text takes `--link`, not `--primary` — in the
amber and violet rows the primary is fine as a button fill but too low-contrast as text, which is
exactly the mistake this token exists to prevent. Hover states are already in `theme.css` as
`--primary-hover`; don't invent extra colors beyond the tokens there. Only the violet row is a
dark UI — don't build the others dark-mode too.

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
| AI / LLM feature ("it uses AI to do X"), chatbot, copilot | [references/ai.md](references/ai.md) | Web build; canned + streamed by default, real API only if AI is the point |
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
result. **AI** — if AI is incidental, fake a canned response and stream it in with `fakeStream` so it
reads as live; if the demo IS the AI, call the real API (key server-side) but keep it to one
call. See [references/ai.md](references/ai.md). **Multiplayer/real-time** — script the "other
user" with a timer, don't build networking.

**Make the fakes wait.** An instant fake feels fake; a real product pauses to log you in or
charge a card. A ready-made helper is bundled at [assets/simulate.ts](assets/simulate.ts) —
copy it in and wrap the fake in a short spinner: `await fakeLogin(...)`, `await fakePayment(...)`,
`await fakeUpload(...)`, `await fakeSend()`, `fakeProcessing(onProgress)` for a progress bar, or
`fakeStream(text, onToken)` to type out a canned answer like a live LLM.
It's zero-dependency and everything succeeds by default. That half-second of loading is the
cheapest polish you can add. If an error state is *itself* what you're demoing (a rate-limit
banner, an offline screen, a retry-that-works), the same file has typed failure throwers —
`fakeNetworkError`, `fakeRateLimit`, `fakeServerError`, `flakyUntil(n, …)`, and friends — but
skip them for the happy path.

## Make it look real (this is where your time goes)

A demo lives or dies on looking believable, so invest here:

- **Realistic data, not `foo`/`bar`.** A mock-data generator is bundled at
  [assets/mockdata.ts](assets/mockdata.ts) — copy it into the project and import it for
  believable names, avatars, companies, prices, dates, paragraphs, and chart/trend data
  (`timeSeries`, `categories`). It's zero-dependency and **seeded**, so the same data shows every
  reload (stable screenshots, no flicker). Use it instead of hand-typing fake rows or installing
  faker. Its word banks (`FIRST`, `LAST`,
  `COMPANY_*`, `PRODUCTS`, `STATUSES`, `WORDS`) are plain arrays at the top of the file — when the
  demo isn't in English, or the client's domain isn't consumer retail, swap those arrays for
  names, companies and product terms from their language and industry. English rows under a
  German UI is the fastest way to make a demo look like a template.
- **Polish the happy path only.** The exact click-path you'll demo should feel smooth.
  Anything off that path can dead-end or do nothing — don't spend a second on it.
- **Use the brief.** Wire the answered palette in as theme tokens/CSS variables on day one rather
  than sprinkling hex codes, set the brand wordmark top-left on every screen, and write every
  label *and* every mock row in the chosen display language. Component libraries get you most of
  the way on spacing; loading spinners and a little animation read as "real product".
- **Target one screen.** Make it look right at the size and orientation it'll be presented on.
  Skip other viewports, dark-mode parity, and print.

## Don't do (unless the user explicitly asks)

Tests · error handling beyond "don't crash on the happy path" · form validation · accessibility
passes · loading/empty/error states for flows you won't demo · database migrations · CI ·
Docker · env-var ceremony · refactoring · app-store submission · code signing · comments
explaining architecture · "just in case" features. Each one is time the audience never sees.

## The workflow

1. **Get the brief in one round of questions, then go.** Palette, brand, and display language are
   mandatory; add the one flow the audience must see and the device it's shown on if unclear. See
   [Before any code: get the brief](#before-any-code-get-the-brief). Just enough to fake
   convincingly, not a requirements doc.
2. **Open the playbook** for the target (table above) and scaffold as it says.
3. **Build the happy path** top to bottom, wired to mock data. One flow, working, end to end.
4. **Seed believable data** with `assets/mockdata.ts` so every screen looks populated and alive.
5. **Ship it to where the audience can open it** — follow the playbook's deploy step. "Runs on
   my machine" is not a demo anyone else can experience.
6. **Verify the one flow actually works — on the shipped URL, not just locally.** This is the
   difference between a demo that lands and one that dies in front of the client. Open the
   deployed link yourself and click the exact happy path end to end. Use the browser tools to do
   it: `mcp__Claude_Browser__navigate` to the URL, then `read_page` / `computer` to click through
   the flow, and `read_console_messages` to catch a blank screen or a runtime error the deploy
   step won't surface. Grab a screenshot of the working money-shot screen — it doubles as proof
   and as a fallback image for the handoff if the venue's Wi-Fi dies. If anything on the path is
   broken, fix it now; a link you never opened is not a demo you can trust.
7. **Hand off**: give the user the link/build plus a 3–5 line "demo script" of exactly what to
   click and what to say, so the pitch runs itself. Include the screenshot from step 6 as a
   backup.

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
