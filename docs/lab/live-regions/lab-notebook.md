# Live Region Lab — Notebook

Chronological journey. Append a dated entry at the end of every working
session, and whenever a strategy is added, tuned, or abandoned.

**Entry structure (fixed):**

- **Date**
- **What was tried** — which strategy/version, which parameters (rate, jitter, seed)
- **What happened** — Panel A counts/timings, what Panel B sounded like
- **Interpretation** — why it behaved that way
- **Next** — what to try next

Dead ends are mandatory content. The point of the notebook is the journey,
not a highlight reel. Record AI collaboration honestly — including the
suggestions Claude Code made that you rejected, and why.

---

## 2026-06-01 — Lab harness scaffolded

**What was tried:** Initial scaffold of the Live Region Lab harness.
Not yet running any strategy comparisons — this entry records the state of
the instrument being handed over.

**What happened:**

- Built the engine under `src/lib/lab/live-regions/`:
  - `types.ts` — `Strategy`, `StrategyInstance`, `TokenEvent`, `AnnouncementEvent`, `TimestampedEvent`.
  - `fixture.ts` — hand-curated adversarial token list: prose, em-dash, mid-word splits ("Accessi/bil/ity", "phon/etic"), a markdown list, a fenced TS code block streamed symbol-by-symbol.
  - `simulator.ts` — Mulberry32-seeded scheduler with configurable rate (tok/s) and jitter (0..0.9).
  - `run-controller.ts` — owns the simulator, hands tokens to the strategy, stamps `t` on outgoing events, fans events to subscribers. Single source of truth for Panel A + Panel B.
- Shipped three strategies in v1, per the brief:
  - `cancel-and-restart.v1` (villain 1 — emits cancel + announce on every token).
  - `queue-everything.v1` (villain 2 — emits announce per token, never cancels).
  - `naive-debounced.v1` (deliberately-mediocre reference — 400ms fixed-interval buffer flush, no boundary awareness).
- Built the UI under `src/components/lab/live-regions/`:
  - Panel A (`announcement-timeline.tsx`) — two columns, tokens-in vs events-out, with timestamps and aggregate counters. Labeled explicitly as a model of "what the page hands the AT," NOT as a screen-reader transcript.
  - Panel B (`audio-illustration.tsx`) — Web Speech API consumer, opt-in by default. Dumb executor: `announce` → `speak()`, `cancel` → `cancel()`. Labeled as an illustration, not a screen reader.
  - Controls, strategy picker, fixture view, and the orchestrating lab shell.
- Routes: `/lab` (trivial index, will gain siblings) and `/lab/live-regions` (the lab itself).

**Interpretation:** The harness embodies the brief's load-bearing rules:
- The strategy interface is the single plug-in slot.
- Strategies are append-only / versioned by filename — never edit in place.
- Panel A and Panel B consume one event stream; they cannot drift.
- Both panels carry explicit honesty labels distinguishing what they model from what they do not.
- No real LLM, no network — deterministic via the seed.

**Claude Code collaboration notes:** Claude proposed and Calley accepted: (a) lifting `t` out of the strategy's emit signature and stamping it in the controller — done to keep strategies deterministic; (b) audio defaults to off because surprising audio is hostile; (c) per-strategy parameters are baked into the version file rather than exposed as sliders, so changing a strategy's behavior requires authoring a new `vN` file (preserves replayability). Claude noted but did not implement: a "compare two strategies side by side" mode, run export, and a metrics panel — all deferred until a session at the bench reveals what to measure.

**Next:**
- Take a first bench session: run each of the three shipped strategies at default (8 tok/s, jitter 0.3, seed 1), then at 24 tok/s and 3 tok/s. Record what Panel A shows and what Panel B sounds like for each.
- Decide whether the fixture is hostile *enough*. If a strategy passes it too easily, add cases.
- Author the first real candidate strategy (sentence-boundary aware?) as `<id>.v1.ts`. Notebook the decision before writing code.
- Author the substantive sections of the `live-region-accessibility` skill (currently `TODO(owner)`).
