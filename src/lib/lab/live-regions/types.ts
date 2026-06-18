/**
 * Live Region Lab — core types.
 *
 * The engine has no React dependency. Strategies, the simulator, and the run
 * controller all speak in plain values so they can be reasoned about, tested,
 * and (eventually) replayed offline.
 */

export type Politeness = "polite" | "assertive";

/** A single token arrival from the simulator. */
export type TokenEvent = {
  /** Raw token text. May be a partial word, punctuation, or whitespace. */
  token: string;
  /** Zero-based token index in the stream. */
  index: number;
  /** Milliseconds since the current run started. Stamped by the simulator. */
  t: number;
};

/**
 * What a strategy emits. Note: no `t` field — the run controller stamps the
 * timestamp on the way out so consumers (timeline, speech) cannot disagree
 * about when an event was observed.
 */
export type AnnouncementEvent =
  | {
      kind: "announce";
      /** Stable id for this announcement (useful for cancel correlation). */
      id: string;
      text: string;
      politeness: Politeness;
      /** Optional structured metadata for the timeline (e.g. chunk-type). */
      meta?: Record<string, unknown>;
    }
  | {
      kind: "cancel";
      /** Id of the announcement being interrupted, or "*" for "all". */
      id: string;
      reason?: string;
    }
  | {
      kind: "flush";
      id: string;
    };

/** What consumers (Panel A, Panel B, notebook export) see. */
export type TimestampedEvent = AnnouncementEvent & { t: number };

/**
 * The pluggable strategy interface.
 *
 * Every announcement strategy — naive villains, reference, and any future
 * one the owner authors — implements this. Strategies are versioned and
 * append-only: when iterating, add a new file (e.g. `naive-debounced.v2.ts`)
 * and register it under a new id; never edit an existing strategy in place.
 */
export interface Strategy<TConfig = void> {
  /** Stable machine name. Used for selection and notebook references. */
  readonly id: string;
  /** Version label. Part of the name so v1 and v2 can both ship. */
  readonly version: string;
  /** Human-readable label for the picker UI. */
  readonly label: string;
  /** One-line description shown next to the picker. */
  readonly summary: string;
  /** Free-form notes (credit prior art here and in the notebook). */
  readonly notes?: string;

  /**
   * Build a fresh runtime instance for one run. The instance closes over the
   * `emit` callback so it can fire announcement events whenever it likes
   * (in response to tokens, debounce timers, etc.).
   */
  create(
    config: TConfig,
    emit: (event: AnnouncementEvent) => void,
  ): StrategyInstance;
}

export interface StrategyInstance {
  /** Called once per token arrival, in stream order. */
  onToken(event: TokenEvent): void;
  /** Called once when the simulator finishes. Strategies MUST flush here. */
  onStreamEnd(): void;
  /**
   * Called when the operator restarts. Strategies MUST clear all internal
   * buffers and pending timers. After reset, the instance is reusable.
   */
  reset(): void;
}

/** Convenience: a strategy with no configuration. */
export type SimpleStrategy = Strategy<void>;
