/**
 * simulate.ts — fake the waiting, sell the demo. Zero dependencies.
 *
 * Real products pause: a login spinner, a "processing payment…" beat, an upload bar.
 * Instant fakes feel fake. A short, believable delay reads as "real backend" — that
 * half-second is the cheapest polish in a demo. This file gives you the delay plus the
 * common fake flows already wrapped around it.
 *
 * Copy into a demo project (e.g. `lib/simulate.ts`) and import what you need.
 * Works in Next.js, React Native / Expo, and the plain browser — it's just TypeScript.
 * Not using TypeScript? Rename it to `.js` and delete the type annotations (the `: Type`
 * bits, `interface` blocks, and `<T>` generics) — the logic underneath is plain JS.
 *
 *   import { delay, fakeLogin, fakePayment } from "./simulate";
 *
 *   async function onSubmit() {
 *     setLoading(true);
 *     await fakeLogin(email, password); // resolves after ~1.2s, always succeeds
 *     router.push("/dashboard");
 *   }
 *
 * Everything succeeds by default — the happy path is the demo. Pass `{ failRate }`
 * only if showing an error state is itself part of what you're demoing.
 */

/** Resolve after `ms` milliseconds (default a random, believable 600–1400ms). */
export function delay(ms?: number): Promise<void> {
  const t = ms ?? 600 + Math.floor(Math.random() * 800);
  return new Promise((resolve) => setTimeout(resolve, t));
}

/**
 * Run `fn` but guarantee it takes at least `ms` — so a too-fast fake still shows its
 * spinner long enough to read as real. Wrap a real API call with this to smooth it out.
 *
 *   const data = await withMinDelay(fetchThing(), 800);
 */
export async function withMinDelay<T>(fn: Promise<T> | (() => Promise<T>), ms = 800): Promise<T> {
  const p = typeof fn === "function" ? fn() : fn;
  const [result] = await Promise.all([p, delay(ms)]);
  return result;
}

interface SimOpts {
  /** Milliseconds to wait. Omit for a random believable delay. */
  ms?: number;
  /** 0–1 chance the call rejects, for demoing an error state. Default 0 (never fails). */
  failRate?: number;
  /** Message used when a simulated failure is thrown. */
  errorMessage?: string;
}

async function simulate<T>(result: T, opts: SimOpts = {}): Promise<T> {
  await delay(opts.ms);
  if (opts.failRate && Math.random() < opts.failRate) {
    throw new Error(opts.errorMessage ?? "Something went wrong. Please try again.");
  }
  return result;
}

// ---- ready-made fake flows (all resolve successfully by default) ----

export interface FakeUser {
  id: string;
  email: string;
  name: string;
  token: string;
}

/** Fake sign-in / sign-up. Any input works. Returns a plausible user + token. */
export function fakeLogin(email: string, _password?: string, opts?: SimOpts): Promise<FakeUser> {
  const handle = (email || "demo.user@example.com").split("@")[0];
  const name = handle
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim() || "Demo User";
  return simulate(
    { id: "u_demo", email: email || "demo.user@example.com", name, token: "demo-token" },
    { errorMessage: "Invalid email or password.", ...opts },
  );
}

export interface FakePaymentResult {
  ok: true;
  id: string;
  last4: string;
  amount: string;
}

/** Fake card charge. Returns a receipt-shaped object. `amount` is passed straight through. */
export function fakePayment(amount: string | number, opts?: SimOpts): Promise<FakePaymentResult> {
  const id = "ch_" + Math.random().toString(36).slice(2, 10);
  const last4 = String(1000 + Math.floor(Math.random() * 9000));
  return simulate(
    { ok: true as const, id, last4, amount: String(amount) },
    { ms: 1400, errorMessage: "Your card was declined.", ...opts },
  );
}

/** Fake file/photo upload. Ignores the input, hands back a stable URL you can render. */
export function fakeUpload(_file?: unknown, opts?: SimOpts): Promise<{ url: string }> {
  const seed = Math.random().toString(36).slice(2, 8);
  return simulate(
    { url: `https://picsum.photos/seed/${seed}/800/600` },
    { ms: 1600, errorMessage: "Upload failed.", ...opts },
  );
}

/** Fake "send" for email / message / notification / invite. Resolve, then toast "Sent!". */
export function fakeSend(opts?: SimOpts): Promise<{ ok: true }> {
  return simulate({ ok: true as const }, { ms: 900, errorMessage: "Couldn't send.", ...opts });
}

/**
 * Fake a long job with progress — export, "AI is thinking…", sync, generation.
 * Calls `onProgress(0..1)` a few times, then resolves. Wire it to a progress bar.
 *
 *   await fakeProcessing((p) => setProgress(p));
 */
export async function fakeProcessing(
  onProgress?: (fraction: number) => void,
  opts: { steps?: number; ms?: number } = {},
): Promise<void> {
  const steps = opts.steps ?? 5;
  const total = opts.ms ?? 2400;
  for (let i = 1; i <= steps; i++) {
    await delay(total / steps);
    onProgress?.(i / steps);
  }
}

/**
 * Fake an LLM streaming a canned answer word-by-word — the typing effect that sells
 * an AI demo. Calls `onToken` with each successive chunk (accumulate or append it),
 * then resolves with the full text. Add a leading pause with `firstTokenMs` to mimic
 * the model "thinking" before it starts.
 *
 *   const answer = await fakeStream(CANNED_REPLY, (chunk) => setText((t) => t + chunk));
 *
 * By default it streams whole words (with spaces). Pass `mode: "char"` for a slower
 * character-by-character typewriter feel.
 */
export async function fakeStream(
  text: string,
  onToken: (chunk: string) => void,
  opts: { perTokenMs?: number; firstTokenMs?: number; mode?: "word" | "char" } = {},
): Promise<string> {
  const mode = opts.mode ?? "word";
  const perToken = opts.perTokenMs ?? (mode === "char" ? 18 : 45);
  const tokens =
    mode === "char" ? Array.from(text) : text.match(/\s*\S+/g) ?? [];
  await delay(opts.firstTokenMs ?? 500);
  for (const tok of tokens) {
    onToken(tok);
    await delay(perToken);
  }
  return text;
}

// ---- fake failures (only for when showing an error state IS the demo) ----
// The happy path never needs these. Reach for them to demo a specific banner /
// offline screen / retry flow. Each waits a beat, then rejects with a typed
// `SimError` your catch block can branch on (`err.code`, `err.status`).

export type SimErrorCode =
  | "network" | "timeout" | "rate_limit" | "server" | "unauthorized" | "not_found";

export class SimError extends Error {
  code: SimErrorCode;
  /** HTTP-ish status, for demos that display a code. */
  status: number;
  /** Present on rate-limit errors: seconds until the caller may retry. */
  retryAfter?: number;
  constructor(code: SimErrorCode, status: number, message: string, retryAfter?: number) {
    super(message);
    this.name = "SimError";
    this.code = code;
    this.status = status;
    if (retryAfter !== undefined) this.retryAfter = retryAfter;
  }
}

async function fail(err: SimError, ms?: number): Promise<never> {
  await delay(ms);
  throw err;
}

/** Rejects as if the request never reached the server (offline / dropped connection). */
export function fakeNetworkError(ms = 1200): Promise<never> {
  return fail(new SimError("network", 0, "Network request failed. Check your connection."), ms);
}

/** Hangs for a long beat, then rejects as a timeout. `ms` is how long it waits first. */
export function fakeTimeout(ms = 8000): Promise<never> {
  return fail(new SimError("timeout", 408, "The request timed out."), ms);
}

/** 429 — rejects with a `retryAfter` (seconds) for a "slow down" / rate-limit banner. */
export function fakeRateLimit(retryAfter = 30, ms = 600): Promise<never> {
  return fail(
    new SimError("rate_limit", 429, "Too many requests. Please try again shortly.", retryAfter),
    ms,
  );
}

/** 500 — generic server blowup, for a "something broke on our end" state. */
export function fakeServerError(ms = 1000): Promise<never> {
  return fail(new SimError("server", 500, "Server error. Our team has been notified."), ms);
}

/** 401 — for demoing a "session expired, please sign in again" redirect. */
export function fakeUnauthorized(ms = 600): Promise<never> {
  return fail(new SimError("unauthorized", 401, "Your session has expired. Please sign in again."), ms);
}

/** 404 — for an empty / "we couldn't find that" state. */
export function fakeNotFound(ms = 600): Promise<never> {
  return fail(new SimError("not_found", 404, "We couldn't find what you were looking for."), ms);
}

/**
 * Fail the first `times` calls, then succeed — for demoing a Retry button that
 * eventually works. Returns a function; call it once per attempt.
 *
 *   const attempt = flakyUntil(2, () => fetchThing());
 *   await attempt(); // rejects
 *   await attempt(); // rejects
 *   await attempt(); // resolves
 */
export function flakyUntil<T>(times: number, onSuccess: () => Promise<T> | T): () => Promise<T> {
  let calls = 0;
  return async () => {
    calls++;
    if (calls <= times) return fakeNetworkError();
    return onSuccess();
  };
}
