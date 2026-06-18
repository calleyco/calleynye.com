/**
 * Run controller — the single source of truth.
 *
 * The brief is explicit: Panel A (timeline) and Panel B (audio) must consume
 * the EXACT same output from the active strategy. Two consumers, one event
 * stream — never two parallel implementations that could drift.
 *
 * The controller owns the simulator, hands tokens to the strategy, wraps the
 * strategy's `emit` to stamp wall-clock timestamps, and fans the timestamped
 * stream out to subscribers.
 */

import type { FixtureToken } from "./fixture";
import { createSimulator, type SimulatorHandle } from "./simulator";
import type {
  AnnouncementEvent,
  Strategy,
  StrategyInstance,
  TimestampedEvent,
  TokenEvent,
} from "./types";

export type RunOptions = {
  fixture: ReadonlyArray<FixtureToken>;
  strategy: Strategy;
  rate: number;
  jitter: number;
  seed: number;
};

export type RunHandle = {
  start(): void;
  stop(): void;
  /** Stops, clears state, resets the strategy instance. Reusable afterwards. */
  reset(): void;
  /** Subscribe to timestamped announcement events. Returns an unsubscribe fn. */
  subscribe(listener: (event: TimestampedEvent) => void): () => void;
  /** Subscribe to raw token arrivals (for the "tokens-in" column of Panel A). */
  subscribeTokens(listener: (event: TokenEvent) => void): () => void;
  /** Subscribe to run-state transitions (idle/running/done). */
  subscribeState(listener: (state: RunState) => void): () => void;
  getState(): RunState;
};

export type RunState = "idle" | "running" | "done";

export function createRun(opts: RunOptions): RunHandle {
  const eventListeners = new Set<(e: TimestampedEvent) => void>();
  const tokenListeners = new Set<(e: TokenEvent) => void>();
  const stateListeners = new Set<(s: RunState) => void>();

  let state: RunState = "idle";
  let startWall = 0;
  let simulator: SimulatorHandle | null = null;
  let instance: StrategyInstance | null = null;

  function setState(next: RunState): void {
    if (state === next) return;
    state = next;
    stateListeners.forEach((l) => l(state));
  }

  function emitTimestamped(event: AnnouncementEvent): void {
    const stamped: TimestampedEvent = {
      ...event,
      t: performance.now() - startWall,
    };
    eventListeners.forEach((l) => l(stamped));
  }

  function ensureInstance(): StrategyInstance {
    if (instance === null) {
      instance = opts.strategy.create(undefined as never, emitTimestamped);
    }
    return instance;
  }

  return {
    start(): void {
      if (state === "running") return;
      const strat = ensureInstance();
      startWall = performance.now();

      simulator = createSimulator({
        fixture: opts.fixture,
        rate: opts.rate,
        jitter: opts.jitter,
        seed: opts.seed,
        onToken: (e) => {
          tokenListeners.forEach((l) => l(e));
          strat.onToken(e);
        },
        onEnd: () => {
          strat.onStreamEnd();
          setState("done");
        },
      });

      setState("running");
      simulator.start();
    },

    stop(): void {
      if (simulator) {
        simulator.stop();
        simulator = null;
      }
      if (state === "running") setState("idle");
    },

    reset(): void {
      if (simulator) {
        simulator.stop();
        simulator = null;
      }
      if (instance) {
        instance.reset();
        instance = null;
      }
      startWall = 0;
      setState("idle");
    },

    subscribe(listener): () => void {
      eventListeners.add(listener);
      return () => {
        eventListeners.delete(listener);
      };
    },

    subscribeTokens(listener): () => void {
      tokenListeners.add(listener);
      return () => {
        tokenListeners.delete(listener);
      };
    },

    subscribeState(listener): () => void {
      stateListeners.add(listener);
      return () => {
        stateListeners.delete(listener);
      };
    },

    getState(): RunState {
      return state;
    },
  };
}
