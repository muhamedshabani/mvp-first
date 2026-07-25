/**
 * mockdata.ts — believable fake data for demos. Zero dependencies.
 *
 * Copy this file into a demo project (e.g. `lib/mockdata.ts`) and import what you need.
 * Works in Next.js, React Native / Expo, and the plain browser — it's just TypeScript.
 *
 * It's SEEDED: the same values come back every run, so screenshots are stable and the
 * data doesn't flicker between reloads. Call `reseed(n)` if you want a different set.
 *
 *   import { people, products, transactions, messages, avatar, price } from "./mockdata";
 *   const users = people(12);
 *   const catalog = products(8);
 */

// ---- deterministic PRNG (mulberry32) so output is stable across reloads ----
let _state = 1337 >>> 0;
export function reseed(seed: number) {
  _state = seed >>> 0;
}
function rnd(): number {
  _state |= 0;
  _state = (_state + 0x6d2b79f5) | 0;
  let t = Math.imul(_state ^ (_state >>> 15), 1 | _state);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
function int(min: number, max: number): number {
  return Math.floor(rnd() * (max - min + 1)) + min;
}
export function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(rnd() * arr.length)];
}
export function chance(p: number): boolean {
  return rnd() < p;
}

// ---- word banks (kept short on purpose; enough to look real) ----
const FIRST = [
  "Ava", "Liam", "Noah", "Emma", "Olivia", "Ethan", "Mia", "Lucas", "Sofia", "Aiden",
  "Isabella", "Mateo", "Amara", "Yuki", "Omar", "Priya", "Hana", "Diego", "Zoe", "Kai",
] as const;
const LAST = [
  "Carter", "Nguyen", "Patel", "Kim", "Silva", "Rossi", "Haddad", "Okafor", "Novak", "Reyes",
  "Andersen", "Costa", "Ito", "Bauer", "Flores", "Walsh", "Mbeki", "Tan", "Petrov", "Diaz",
] as const;
const COMPANY_A = ["North", "Blue", "Bright", "Iron", "Ever", "Nova", "Quant", "Hyper", "Loop", "Lumen"] as const;
const COMPANY_B = ["Works", "Labs", "Systems", "Hub", "Base", "Flow", "Grid", "Stack", "Forge", "Sphere"] as const;
const PRODUCTS = [
  "Wireless Earbuds", "Standing Desk", "Cold Brew Kit", "Trail Backpack", "Smart Bulb",
  "Ceramic Mug", "Linen Shirt", "Desk Lamp", "Yoga Mat", "Bluetooth Speaker",
  "Notebook Set", "Running Shoes", "Water Bottle", "Mechanical Keyboard", "Weighted Blanket",
] as const;
const WORDS = [
  "flow", "spark", "atlas", "north", "signal", "orbit", "canvas", "pulse", "harbor", "ember",
  "cedar", "delta", "vertex", "meadow", "cobalt", "summit", "lyric", "prism", "ridge", "quartz",
] as const;
const STATUSES = ["Active", "Pending", "Completed", "Cancelled", "Draft"] as const;

// ---- primitives ----
export function fullName(): string {
  return `${pick(FIRST)} ${pick(LAST)}`;
}
export function email(name?: string): string {
  const n = (name ?? fullName()).toLowerCase().replace(/[^a-z]+/g, ".");
  return `${n}@${pick(COMPANY_A).toLowerCase()}${pick(COMPANY_B).toLowerCase()}.com`;
}
export function company(): string {
  return `${pick(COMPANY_A)}${pick(COMPANY_B)}`;
}
/** Deterministic avatar URL. Pass an index so each row gets a distinct face. */
export function avatar(i: number): string {
  return `https://i.pravatar.cc/128?img=${(i % 70) + 1}`;
}
export function price(min = 5, max = 250): string {
  return (int(min * 100, max * 100) / 100).toFixed(2);
}
/** ISO date within the last `days` days. */
export function pastDate(days = 90): string {
  const ms = Date.parse("2025-01-01T00:00:00Z") + int(0, days) * 86400000;
  return new Date(ms).toISOString().slice(0, 10);
}
export function paragraph(sentences = 3): string {
  const out: string[] = [];
  for (let s = 0; s < sentences; s++) {
    const len = int(6, 12);
    const w: string[] = Array.from({ length: len }, () => pick(WORDS));
    w[0] = w[0][0].toUpperCase() + w[0].slice(1);
    out.push(w.join(" ") + ".");
  }
  return out.join(" ");
}
export function status(): string {
  return pick(STATUSES);
}

// ---- generic list helper ----
export function list<T>(n: number, factory: (i: number) => T): T[] {
  return Array.from({ length: n }, (_, i) => factory(i));
}

// ---- domain objects (the common demo shapes) ----
export interface Person {
  id: string; name: string; email: string; avatar: string; company: string; role: string;
}
export function person(i = 0): Person {
  const name = fullName();
  return {
    id: `u_${1000 + i}`,
    name,
    email: email(name),
    avatar: avatar(i),
    company: company(),
    role: pick(["Founder", "Designer", "Engineer", "PM", "Sales", "Support", "Analyst"]),
  };
}
export const people = (n: number): Person[] => list(n, person);

export interface Product {
  id: string; name: string; price: string; rating: number; inStock: boolean; image: string;
}
export function product(i = 0): Product {
  return {
    id: `p_${2000 + i}`,
    name: pick(PRODUCTS),
    price: price(9, 199),
    rating: int(30, 50) / 10,
    inStock: chance(0.8),
    image: `https://picsum.photos/seed/${pick(WORDS)}${i}/400/300`,
  };
}
export const products = (n: number): Product[] => list(n, product);

export interface Transaction {
  id: string; date: string; customer: string; amount: string; status: string;
}
export function transaction(i = 0): Transaction {
  return {
    id: `t_${3000 + i}`,
    date: pastDate(),
    customer: fullName(),
    amount: price(12, 900),
    status: status(),
  };
}
export const transactions = (n: number): Transaction[] => list(n, transaction);

export interface Message {
  id: string; from: string; avatar: string; text: string; time: string; unread: boolean;
}
export function message(i = 0): Message {
  return {
    id: `m_${4000 + i}`,
    from: fullName(),
    avatar: avatar(i),
    text: paragraph(1),
    time: `${int(1, 12)}:${String(int(0, 59)).padStart(2, "0")} ${chance(0.5) ? "AM" : "PM"}`,
    unread: chance(0.3),
  };
}
export const messages = (n: number): Message[] => list(n, message);

/** Small labeled metrics for dashboard stat cards. */
export function stats(): { label: string; value: string; delta: string }[] {
  const mk = (label: string, unit: string) => ({
    label,
    value: unit === "$" ? `$${int(8, 92)}.${int(0, 9)}k` : `${int(120, 9800)}`,
    delta: `${chance(0.7) ? "+" : "−"}${int(1, 24)}%`,
  });
  return [mk("Revenue", "$"), mk("Users", "#"), mk("Orders", "#"), mk("Sessions", "#")];
}
