# Playbook: CLI, API, backend tool, or library

The core problem: **these aren't clickable.** A client can't "see" a CLI or an API in a pitch. So
the demo is almost never the tool itself — it's a **hosted web playground** wrapped around the tiny
bit of real logic, so the audience clicks instead of installs.

## Decide the shape

- **The value is the output** (a summarizer, a parser, a generator, an API that returns data) →
  build a one-page web UI: input on the left, live result on the right. This is a
  [web.md](web.md) build with a single API route calling your real function.
- **The value is genuinely the command-line experience** (a dev tool, a shell) → put a fake
  terminal on a web page and run the real (small) logic behind it, OR ship a `npx` one-liner plus a
  recording. Prefer the web terminal — it's shareable as a URL.

## Fastest path: web playground

```bash
npx create-next-app@latest DEMO_NAME --ts --tailwind --app --use-npm --yes
cd DEMO_NAME
```

- Put the **real core logic** (kept tiny) in `lib/core.ts`.
- Call it from a single route `app/api/run/route.ts` (server-side, so any real API key stays off
  the client), or run it directly in the browser if it's pure and dependency-light.
- The page: a textarea/input, a "Run" button, and a result panel. Seed the input with a realistic
  example from [../assets/mockdata.ts](../assets/mockdata.ts) so it looks useful on first load.
- Deploy with `vercel --prod` (see [web.md](web.md)) and hand over the URL.

## If it must stay a terminal

```bash
# make the real tool runnable in one command, no install
npx DEMO_NAME            # or: npm link locally so `demo-name ...` works
```

Record a short asciinema/screen capture of the happy path — that's the shareable artifact when a
URL isn't possible. Seed any data it reads with `mockdata` so the run looks real.

## Fake the hard parts

- **The "system" it integrates with** (a real DB, a cloud service, a payment processor): stub it.
  Return canned-but-realistic responses so the flow completes.
- **Auth / API keys / rate limits / config files:** hardcode sensible defaults; no setup step.
- **Long-running jobs:** fake progress with a timer and show the finished result.

## Traps that waste time (skip them)

- **Packaging/publishing to npm/PyPI, versioning, a real CLI arg parser** with every flag.
- **Error handling for bad input.** Demo the happy path with the seeded example.
- **A real backend/queue/worker.** One synchronous function call is plenty.

## Hand off

Give the user the playground URL (or the `npx` command + recording) and a one-line script:
"paste this example, hit Run, watch it do X."
