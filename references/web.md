# Playbook: web app (the default)

This is the fastest path to a shareable demo and the fallback for almost everything —
browser extensions, kiosks, TVs, watches, "exotic" interfaces all simulate fine as a web page
sized to the device. If you're unsure which playbook to use, use this one.

## Stack (don't deliberate)

Next.js (App Router) + TypeScript + Tailwind + shadcn/ui. One framework for UI and any light
backend logic, and it deploys to a live URL in one command.

## Scaffold

```bash
npx create-next-app@latest DEMO_NAME --ts --tailwind --app --eslint --use-npm --yes
cd DEMO_NAME
npx shadcn@latest init -d          # -d = accept defaults, no prompts
npx shadcn@latest add button card input avatar badge dialog table   # grab what the flow needs
```

Then drop [../assets/mockdata.ts](../assets/mockdata.ts) into `lib/mockdata.ts` and import it.

## Structure

- `app/page.tsx` — the one screen you'll demo. Keep everything here until it hurts.
- `lib/data.ts` — hardcoded arrays built from `mockdata` (e.g. `export const users = people(12)`).
- Add `'use client'` at the top of any file using `useState`/`onClick` — this is the #1 thing
  that trips up a fast build. Server components can't hold interactivity.

## Make it look real

- Wrap the page in a max-width container with generous padding. shadcn `Card`/`Table` get you a
  "real product" look for free.
- A wordmark in the top-left + one accent color = instant credibility. No logo design needed.
- Populate every list with 8–20 rows from `mockdata` so nothing looks empty.

## Deploy → shareable URL (required)

```bash
npm i -g vercel        # if not installed
vercel --yes           # first deploy; links the project
vercel --prod          # prints the public URL you hand over
```

If the user isn't logged in, tell them to run `vercel login` once — don't stall on it. For a
purely static build (no server logic), `npx netlify deploy --prod` or Cloudflare Pages also work.

## Traps that waste time (skip them)

- **A real database.** Use in-memory state or `mockdata`. Mutations resetting on refresh is fine.
- **Auth.** Any input logs in. A `/login` page that always succeeds sells the demo just as well.
- **API routes** unless the demo needs a server secret (e.g. an LLM key). Even then, one route.
- **Responsive/mobile/dark-mode parity.** Build for the presenter's laptop screen only.
- **`.env` ceremony.** If you must call a real API, put the key in a server-only route and move on.

## Hand off

Paste the `vercel --prod` URL back to the user plus a 3–5 line script: which page to open, what
to click, what to say. The pitch should run itself.
