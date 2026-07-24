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

## Install

Copy the skill into your personal Claude Code skills directory:

```bash
mkdir -p ~/.claude/skills/mvp-first
cp SKILL.md ~/.claude/skills/mvp-first/SKILL.md
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
