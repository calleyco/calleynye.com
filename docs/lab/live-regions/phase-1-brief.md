# Phase 1 Brief — Live Region Lab

**Project:** A research laboratory for discovering accessible streaming-announcement strategies.
**Owner:** Calley Nye
**Built by:** Claude Code
**Status:** Phase 1 (the laboratory). Phase 2 (the published narrative) is a separate, later brief — do not build it now.

---

## Read this first

This is **not** a "ship a known solution" project. It is a **build-me-a-laboratory** project.

The deliverable is a *test harness* — an instrument the owner uses to discover the right way to announce streaming LLM output to assistive technology. You are building the microscope, not the finding. **Do not attempt to write "the answer."** Finding the best announcement strategy is the owner's research; your job is to make that research fast, honest, repeatable, and well-documented.

The whole reason this artifact exists is to demonstrate the owner's *problem-solving process* in an unsolved problem space. Optimize the build for that: an instrument that makes experiments easy to run, easy to compare, and easy to record.

---

## The problem the lab investigates

Text streams in token by token. The visual reader handles partial content fine — the eye reads incomplete text without trouble. The **spoken/announced** channel cannot. Speech is linear and takes time; a sentence takes seconds to say. While it's being said, more tokens arrive. So any announcement mechanism constantly faces: *"I'm mid-announcement and new content arrived — what now?"*

There are two naive answers, and they are the two failure modes the lab must make perceptible:

1. **Cancel-and-restart ("the stammer").** Every update interrupts the current announcement and restarts from the newest chunk. Result: current but garbled — you never hear a complete thought. In code, this is calling `speechSynthesis.cancel()` and re-speaking on every update.
2. **Queue-everything ("the lag").** Never interrupt; finish the current chunk, then speak the next queued chunk. Result: intelligible but stale — the voice narrates the past while the visual text finished long ago. In code, this is repeated `speak()` calls with no cancellation; utterances pile up.

These are opposite horns of one dilemma. A good strategy escapes both — typically by only handing speech *complete, worth-saying units* (e.g., full sentences/clauses), announcing less often but always whole and timely. **The lab must demonstrate both failure modes**, not just one, because the "two horns" structure is what proves the owner understands a problem *class*, not a single bug.

---

## Where it lives

- **Route:** Build a parent route `/lab` as a simple **index** that lists explorations, and this exploration at **`/lab/live-regions`**. Treat `/lab` as a parent that will gain sibling explorations later — do **not** hardcode this one as "the lab." The index can be trivial now; the point is the structure.
  - *(Naming note for the owner: `/lab/live-regions` vs. `/lab/streaming-announcements` — pick whichever you prefer; the brief assumes `live-regions`. If you change it, change the docs folder to match — see below.)*
- **Stack:** The existing Next.js + TypeScript + Tailwind portfolio. This route is part of that app, built to the **same standards as the rest of the site: WCAG AA, 95+ Lighthouse.** The lab itself must be accessible — a streaming-accessibility research tool that isn't accessible would be self-refuting.
- **Docs:** A dedicated folder **`docs/live-region-lab/`** containing this brief, the lab notebook, and the findings summary (see "Documentation" below).
  - *(Slight intentional seam: route is `live-regions`, docs folder is `live-region-lab`. Left as-is because the folder name reads better standalone. Unify if it bothers you.)*

---

## What to build

### 1. Token-stream simulator
- Emits a canned response on a timer to imitate token-by-token streaming.
- **Configurable emission rate** (tokens/sec) and **jitter** (variance in inter-token timing), exposed as on-page controls. Real streams arrive in bursts with pauses; a strategy that's fine at 5 tok/s may flood at 40. Rate and jitter are how the owner stress-tests.
- **No real LLM / API call.** Deterministic, reproducible, no keys, no cost, no latency variance. The focus is the *announcement* problem, not the *infrastructure* problem.

### 2. Adversarial fixture
The canned response is **deliberately built to break naive methods.** It must include at minimum:
- multi-sentence prose,
- a fenced code block (how do you announce code streaming in?),
- a markdown list,
- an em-dash,
- at least one mid-word token split.
A bland three-sentence paragraph will not expose differences between strategies. Make the fixture hostile on purpose. Keep it editable in one obvious place so the owner can add cases.

### 3. Pluggable strategy interface — **the load-bearing architecture**
This is the single most important instruction in the brief. An **announcement strategy** is a pluggable unit. It receives the raw token stream and decides **what gets handed to the announcement channel, and when.** The naive villains, the reference strategy, and every future strategy the owner writes are each one implementation of this interface.

Requirements:
- Define a clear, documented strategy interface/type. Adding a new strategy must mean implementing this interface and registering it — nothing else.
- **Strategies are versioned and preserved by name, never edited in place.** WIP attempts must stay replayable so Phase 2 can show "attempt 1 vs. attempt 4." Do not overwrite a strategy when iterating — add a new named one.
- The active strategy is selectable on the page.

### 4. Single source of truth for A and B
The timeline panel (A) and the audio (B) **must consume the exact same output** from the active strategy. Strategy emits announcement events → A renders them → B speaks them. Do **not** build two parallel implementations that could drift; if A and B disagree, the instrument is lying. One event stream, two consumers.

### 5. Panel A — the announcement timeline (the honest model)
- Renders the announcement/DOM-mutation firehose the active strategy produces, **with timestamps.**
- **Honesty constraint (non-negotiable):** This panel is explicitly a *model of what the page hands the assistive technology* — the live-region mutations and announcement events the page actually controls. It is **NOT** "what the screen reader says," and must never be labeled or implied as such. There is no web API that exposes screen reader output; claiming to show it would be false and would betray a lack of domain understanding. Label it as what it is. The refusal to fake the screen reader is part of the credibility.
- Make the contrast legible: the viewer should be able to *see* that the naive approach fires (say) 200 partial mutations where a good strategy hands over a handful of clean semantic chunks.

### 6. Panel B — the audio illustration
- Uses the **Web Speech API** (`window.speechSynthesis`) to produce actual audio from the same announcement events.
- **Honesty constraint:** Label it explicitly as an *illustration, not a screen reader.* `SpeechSynthesis` has its own queueing/interruption quirks that are not identical to NVDA/JAWS/VoiceOver. It's here so a visitor with no SR experience can *hear* the difference in five seconds — not as proof of SR behavior.
- **Interruption behavior is an explicit, visible property of each strategy — not an accident of how `speechSynthesis.cancel()` happens to behave.** Both naive failure modes must be demonstrable: cancel-and-restart (stammer) and queue-everything (lag). Wire them deliberately so a bad method can't accidentally sound fine, nor a good one accidentally sound broken.

### 7. Strategies shipped in v1
Ship exactly these, and no "real answer":
- **Naive — cancel-and-restart** (villain 1).
- **Naive — queue-everything** (villain 2).
- **One deliberately-mediocre reference strategy** (e.g., naive-but-debounced at a fixed interval). Its *only* purpose is to prove the plug-in slot works end-to-end and to serve as a worked example of how to add a strategy. It is intentionally **not** the answer — it should visibly still have problems (e.g., still mangles the code block). If it implements a published technique by anyone, **credit the source** in code comments and in the notebook.

Then stop. The owner adds real strategies at the bench.

---

## Documentation — treat this as a lab notebook, not an afterthought

Write and **maintain** two living documents in `docs/live-region-lab/`. A log that gets forgotten is worse than none — follow the protocol every session.

### `lab-notebook.md` — the chronological journey
- Append a **dated entry** at the end of every working session, and whenever a strategy is **added, tuned, or abandoned.**
- Fixed entry structure each time:
  - **Date**
  - **What was tried** (which strategy/version, what parameters)
  - **What happened** (what Panel A showed — counts, timings; what Panel B sounded like)
  - **Interpretation** (why it behaved that way)
  - **Next** (what to try next)
- **Dead ends are mandatory content**, not embarrassments. "Tried debouncing at 200ms, still stammered on the code block, here's why" is exactly the insight Phase 2 needs.
- **Record the AI collaboration honestly.** When you (Claude Code) suggest an approach and the owner accepts, modifies, or rejects it, log that: "Claude Code proposed X; owner rejected because Y." The owner's thesis is *thoughtful AI-assisted development* — a notebook showing the human directing and overruling the AI is a stronger artifact than one that hides it.

### `findings-summary.md` — the living map
- A short, **always-current** top-level summary of "what we know so far" — distinct from the chronological log. The log is the journey; this is the current map, so the owner doesn't have to re-derive conclusions from a long history.
- Update it whenever a finding changes the picture.

---

## Skills to scaffold

Create these as project skills, but mind the ownership boundary:

1. **Strategy-authoring skill (you own the mechanics).** A concise guide: how to add a new announcement strategy to this harness — the interface to implement, how to register it, the naming/versioning convention, how to get it logged in the notebook. This is mechanical; scaffold it fully.

2. **Accessibility-testing skill (scaffold structure only — flag for owner authorship/review).** Scaffold the *structure* of a skill covering how to reason about live-region behavior, ARIA semantics, the screen-reader announcement model, and what to verify — but **do NOT treat your own accessibility claims as authoritative.** Accessibility is the owner's domain expertise and an area where confident-but-wrong AI output is common. Leave clearly marked `TODO(owner)` placeholders for the substantive accessibility content and explicitly note at the top that this skill requires the owner's authorship/review before it's trusted.

---

## Explicitly OUT of scope for Phase 1

- **No real LLM/API call** — simulated stream only.
- **No guided published narrative** — the problem→failures→fix→why walkthrough is Phase 2, written once findings exist.
- **No evaluator agent / automated measurement** — deferred. The owner doesn't yet know which metrics matter; measurement rigor comes after a few sessions at the bench reveal what's worth measuring.
- **Not "the answer"** — do not converge on or recommend a "best" strategy. Build the instrument; leave the discovery to the owner.

---

## Build posture / aesthetics

This is a research instrument, not a showpiece. Keep it **clean, legible, and intentional** — the *data* (timeline, controls, audio) is the star. Restraint over maximalism. It must still meet the site's design standard and be fully accessible, but do not bury the signal under decoration. Clear typography, obvious controls, honest labels.

When you finish the build, append the first dated entry to `lab-notebook.md` recording what you built and the state you're handing over.
