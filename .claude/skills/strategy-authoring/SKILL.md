---
name: strategy-authoring
description: How to add a new announcement strategy to the Live Region Lab. Use when the owner wants to try a new approach to chunking, debouncing, or sequencing streaming token output for an aria-live announcement channel inside /lab/live-regions. Walks through the interface, naming/versioning rule, registration, and notebook protocol.
---

# Strategy authoring — Live Region Lab

This skill is **mechanical**. It tells you exactly how to add a new announcement
strategy to the lab so the owner can compare it against the villains and the
reference. It does not opine on whether the strategy is *good* — that is the
owner's research call to make at the bench.

## The interface a strategy implements

Defined in `src/lib/lab/live-regions/types.ts`:

```ts
export interface Strategy<TConfig = void> {
  readonly id: string;        // stable machine name, e.g. "boundary-aware"
  readonly version: string;   // e.g. "v1"
  readonly label: string;     // shown in the picker
  readonly summary: string;   // one-line description shown under the picker
  readonly notes?: string;    // free-form; credit prior art here

  create(
    config: TConfig,
    emit: (event: AnnouncementEvent) => void,
  ): StrategyInstance;
}

export interface StrategyInstance {
  onToken(event: TokenEvent): void;
  onStreamEnd(): void;
  reset(): void;
}
```

An `AnnouncementEvent` is one of:

- `{ kind: "announce", id, text, politeness, meta? }` — speak/render this text.
- `{ kind: "cancel",   id, reason? }` — interrupt the previous announcement.
- `{ kind: "flush",    id }` — end-of-stream marker.

The strategy NEVER calls `speechSynthesis` directly. The strategy NEVER touches
the DOM. It is a pure decision-maker over the token stream and emits events;
the consumers (Panel A and Panel B) do the actual work.

## The naming and versioning rule (load-bearing)

**Strategies are append-only.** When iterating, never edit an existing strategy
file in place. The lab's "WIP attempts stay replayable" guarantee — and the
Phase 2 ability to show "v1 vs v4 of the same idea" — both depend on this.

To iterate on `boundary-aware.v1.ts`:

1. Copy it to `boundary-aware.v2.ts`.
2. Change the `version` field to `"v2"`.
3. Change the `id` to `"boundary-aware-v2"` (the picker shows version
   alongside, but the id must be globally unique).
4. Make the new behavioral change in v2.
5. Register both v1 and v2 in `strategies/index.ts`.
6. Add a notebook entry explaining the delta and why.

If a strategy is genuinely abandoned, leave it in the registry with a notes
field that says so. Do not delete. Deletion erases the journey.

## The five-step add procedure

1. **Create the file:** `src/lib/lab/live-regions/strategies/<your-id>.v1.ts`.
   Export a single `const` of type `Strategy`. Use the existing strategies as
   templates — `naive-debounced.v1.ts` is the reference example.

2. **Pick a unique id and version.** The id is the stable machine name used
   in notebook entries. The version is the iteration tag. Examples:
   `boundary-aware`/`v1`, `sentence-buffer`/`v1`, `boundary-aware-v2`/`v2`.

3. **Implement the three lifecycle methods:**
   - `onToken(event)` — called per token. Decide what to emit (if anything).
   - `onStreamEnd()` — called once when the simulator finishes. **You MUST
     flush any buffered content here**, or the last sentence of the fixture
     will silently disappear.
   - `reset()` — clear internal buffers, cancel any pending timers. Must be
     idempotent. The instance is reused after reset.

4. **Register it.** In `strategies/index.ts`, import your strategy and add it
   to the `STRATEGIES` array.

5. **Add a notebook entry.** In `docs/lab/live-regions/lab-notebook.md`,
   append a dated entry using the fixed structure (Date / What was tried /
   What happened / Interpretation / Next).

## Things to watch for

- **Don't call `speechSynthesis` from inside a strategy.** Panel B is the
  speech consumer. If you bypass it, you've broken the single-source-of-truth
  rule and Panel A will not match what is heard.

- **Don't read `Date.now()` for sequencing.** Use the `t` field on the
  incoming `TokenEvent` instead. Strategies that consult wall-clock time
  internally are not deterministic across runs.

- **Don't tune a strategy by changing constants in place.** Add `v2`.

- **Credit prior art.** If your strategy implements a published technique
  (anyone's — academic paper, blog post, a11y spec working group), credit
  the source in the `notes` field AND in the notebook entry. The lab's
  credibility depends on honest attribution.

## Worked example

`naive-debounced.v1.ts` is the worked example. It is intentionally not the
answer (it still mangles the code block and lags at low rates) but it
demonstrates every part of the interface: buffering, a timer, flush on
stream end, reset that clears the timer. Read it before authoring your
own.
