/**
 * Token-stream simulator.
 *
 * Deterministic — given the same seed, the same fixture, the same rate and
 * jitter, the same inter-token timings come out every run. That's how the
 * notebook entry "I tried X at 8 tok/s, jitter 0.3" stays meaningful.
 *
 * No real LLM. No network. No keys. The brief is explicit: the focus is
 * the *announcement* problem, not the infrastructure problem.
 */

import type { FixtureToken } from "./fixture";
import type { TokenEvent } from "./types";

/** Seeded PRNG. Mulberry32 — small, fast, good enough for jittering a timer. */
function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return function next(): number {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type SimulatorOptions = {
  /** Token source. */
  fixture: ReadonlyArray<FixtureToken>;
  /** Average tokens per second. */
  rate: number;
  /** 0..1 — fraction of the base interval to vary. 0 = perfectly even. */
  jitter: number;
  /** PRNG seed. Same seed + same params = same timings. */
  seed: number;
  /** Called once per token, in order. */
  onToken: (event: TokenEvent) => void;
  /** Called once when the fixture is exhausted. */
  onEnd: () => void;
};

export type SimulatorHandle = {
  start(): void;
  stop(): void;
  /** True while the simulator is actively scheduling tokens. */
  isRunning(): boolean;
};

export function createSimulator(opts: SimulatorOptions): SimulatorHandle {
  const baseIntervalMs = 1000 / Math.max(0.1, opts.rate);
  const rand = mulberry32(opts.seed);

  let index = 0;
  let startWall = 0;
  let timerId: ReturnType<typeof setTimeout> | null = null;
  let running = false;

  function scheduleNext(): void {
    if (!running) return;
    if (index >= opts.fixture.length) {
      running = false;
      opts.onEnd();
      return;
    }
    // Symmetric jitter around baseIntervalMs; never below 10% of base.
    const variance = (rand() * 2 - 1) * opts.jitter;
    const delay = Math.max(baseIntervalMs * 0.1, baseIntervalMs * (1 + variance));

    timerId = setTimeout(() => {
      if (!running) return;
      const tok = opts.fixture[index];
      const event: TokenEvent = {
        token: tok.text,
        index,
        t: performance.now() - startWall,
      };
      index += 1;
      opts.onToken(event);
      scheduleNext();
    }, delay);
  }

  return {
    start(): void {
      if (running) return;
      running = true;
      startWall = performance.now();
      scheduleNext();
    },
    stop(): void {
      running = false;
      if (timerId !== null) {
        clearTimeout(timerId);
        timerId = null;
      }
    },
    isRunning(): boolean {
      return running;
    },
  };
}
