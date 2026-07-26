# Playbook: AI / LLM feature ("our product uses AI to do X")

Most demos today hinge on one AI moment — a chat reply, a generated summary, a draft, an
answer. The whole demo lives or dies on that moment *looking* smart and *feeling* live. Almost
everything else on this page is about making that one moment land, and faking the rest.

This is a [web.md](web.md) build at heart (Next.js + Tailwind + shadcn → a URL). Read that for the
stack and deploy; this page is only the AI-specific decisions.

## The one decision: real API or canned?

> **Is the AI output the thing being judged, or just set dressing?**

- **Set dressing / incidental** (a "✨ Summarize" button on a dashboard, a fake assistant in the
  corner) → **fake it.** Hardcode a great-looking response and stream it in. Zero cost, zero
  latency risk, zero API key, and it can't embarrass you on stage. This is the default.
- **The AI *is* the demo** (the pitch is the model's quality, or the audience will type their own
  input) → **call the real API**, but keep it to one server-side route and one model call.

When unsure, fake it. A scripted answer that always looks brilliant beats a live one that might
ramble, stall, or refuse mid-pitch.

## Fake path (default) — canned + streamed

The trick that makes a hardcoded answer read as a live model: **stream it in token by token.**
Instant text looks canned; a typing effect looks like it's thinking.

```ts
import { fakeStream } from "@/lib/simulate"; // copy ../assets/simulate.ts into lib/

const CANNED = `Based on the Q3 numbers, three things stand out. Revenue grew 24% …`;
await fakeStream(CANNED, (chunk) => setText((t) => t + chunk)); // ~word-by-word, with a think pause
```

- Write **2–4 canned answers** that look genuinely sharp for the exact prompts you'll type on
  stage. Quality of the copy > everything. This is where your time goes.
- Show a "thinking…" indicator for the first ~500ms (`fakeStream` pauses first), then stream.
- If the audience picks from suggested prompts (buttons), you fully control the input → map each
  suggested prompt to its canned answer. Prefer this over a free-text box you can't predict.

## Real path — one server route, key stays server-side

Only when the model's live quality is the point. Keep the key out of the browser bundle.

```ts
// app/api/ai/route.ts  — server-only; reads process.env, never ships to the client
import Anthropic from "@anthropic-ai/sdk";
const client = new Anthropic(); // reads ANTHROPIC_API_KEY from the server env

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const msg = await client.messages.create({
    model: "claude-sonnet-5",           // latest, capable, fast enough for a live demo
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });
  return Response.json({ text: msg.content[0].type === "text" ? msg.content[0].text : "" });
}
```

- Put the key in `.env.local` (`ANTHROPIC_API_KEY=...`) and in the Vercel project's env vars.
  **Never** in a `NEXT_PUBLIC_` var or client component — that ships it to every viewer.
- One model call. Skip tools, RAG, embeddings, agents, and eval harnesses unless *that* is
  literally the demo. For most "AI feature" pitches, a single well-prompted call is plenty.
- Streaming the real API is nice-to-have; a 1–3s wait with a spinner is fine for one call. Only
  wire real streaming if the response is long enough that watching it appear matters.
- **Have a canned fallback ready.** Venue Wi-Fi dies, rate limits hit, models refuse. Keep the
  `fakeStream` version one flag away so a flaky network never kills the pitch.

## Fake the hard parts

- **RAG / "it knows our docs":** hardcode the 2–3 "retrieved" snippets it cites. No vector DB.
- **Agents / tool use / multi-step:** script the steps with `fakeProcessing` (a visible "Searching
  → Reading → Writing" sequence) and reveal a canned result. Don't build an agent loop.
- **Image/audio/video generation:** show a hardcoded, great-looking result after a `fakeProcessing`
  delay. Generating live is slow and unpredictable on stage.
- **Chat history / accounts:** in-memory state. It resets on refresh; nobody refreshes mid-demo.

## Traps that waste time (skip them)

- **Model comparisons, temperature tuning, prompt A/B harnesses.** Pick one model, one prompt.
- **Token streaming plumbing for the real API** when a spinner + one call reads just as well.
- **Guardrails/eval/observability.** Not visible in a five-minute demo.
- **Fine-tuning or your own model.** Never, for a demo. Prompt a hosted frontier model.
- **Free-text input you can't predict** when suggested-prompt buttons would keep you on script.

## Stay honest

If any answer shown is scripted rather than model-generated, keep the user aware of it — a canned
reply streamed to *look* live is fine for pacing, but don't let the audience be told it's the
model's real output when it isn't. (See SKILL.md → "Don't dress the fakes up as real.")

## Hand off

Give the user the URL, the exact prompts to type (or buttons to click) that trigger the good
answers, and a one-line note on whether it's live or canned so they're never caught off guard.
