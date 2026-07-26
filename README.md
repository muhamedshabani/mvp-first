# mvp-first

A Claude Code skill that builds the **fastest possible throwaway demo** of a product idea —
web app, mobile app, desktop app, game, CLI, anything — optimizing for one thing only:
**someone can open it and see it working.**

It deliberately ignores architecture, security, tests, scalability, and code quality, because
none of that shows up in a five-minute client demo. It fakes backends, hardcodes believable
data, polishes only the happy path, and ships to a shareable link.

Perfect for the moment a client says *"can you show me a demo?"* and you need something
impressive **today**.

## What it does

- Runs every decision through one filter: *will the audience notice this in the demo?* If not,
  fake it or skip it.
- Defaults to a web app (Next.js + Tailwind + shadcn/ui) deployed to a live URL, and picks the
  fastest shareable path for other targets (Expo for mobile, WebGL export for games, etc.).
- Fakes auth, payments, email, uploads, and databases so there's no backend to slow you down.
- Ends with a shareable link **and** a short "demo script" of what to click.
- Keeps a small, non-negotiable honesty/safety line: label it a prototype, no real sensitive
  data, no secrets in client bundles.

## How it's structured

`SKILL.md` stays lean — the philosophy, the decision filter, and the workflow. Depth lives in
`references/`, loaded only when it's relevant (the same progressive-disclosure pattern good
skills use), and reusable output lives in `assets/`:

```
mvp-first/
├── SKILL.md              # the router: philosophy + "pick a target, open its playbook"
├── references/
│   ├── web.md            # Next.js + Tailwind + shadcn → Vercel URL (also the fallback for anything)
│   ├── mobile.md         # Expo (iOS + Android) → Expo Go link / web build
│   ├── desktop.md        # web-as-desktop by default; Tauri only if truly native
│   ├── games.md          # web game (Phaser/three.js) or WebGL export → URL
│   └── cli.md            # wrap the tiny real logic in a hosted web playground
└── assets/
    ├── mockdata.ts       # zero-dependency, seeded fake-data generator dropped into the demo
    └── simulate.ts       # zero-dependency fake-delay helpers (fakeLogin/fakePayment/…) for believable waits
```

Each playbook has the exact scaffold commands, the deploy step, and the traps to skip. There are
deliberately **no benchmarks, engines, or build scripts** — this skill ships judgment, not an
algorithm, so bundling code for its own sake would just be ceremony.

## Install

Copy the whole skill folder into your personal Claude Code skills directory:

```bash
mkdir -p ~/.claude/skills/mvp-first
cp -R SKILL.md references assets ~/.claude/skills/mvp-first/
```

## Use

Just describe the demo you need — or invoke it explicitly:

```
/mvp-first build me a demo of a food-delivery dashboard to show a client tomorrow
```

## ⚠️ Not for production

Everything this skill produces is a **throwaway prototype** with faked data and no real
backend. Don't ship it to real users, don't collect real personal or payment data with it, and
don't let the demo's shortcuts quietly graduate into production. Turning a demo into a real
product is a separate job.
