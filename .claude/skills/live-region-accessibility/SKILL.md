---
name: live-region-accessibility
description: Reason about the behavior of aria-live regions, the screen-reader announcement model, and what to verify when evaluating a streaming-announcement strategy in the Live Region Lab. SCAFFOLD ONLY — the substantive accessibility content is marked TODO(owner) and requires the owner's authorship before it can be trusted.
---

# Live region accessibility — reasoning guide

> **READ THIS FIRST.** This skill is **scaffolding**, not authoritative content.
> Accessibility is the owner's domain expertise and an area where confident-but-
> wrong AI output is common. The substantive sections below are deliberately
> empty and marked `TODO(owner)`. Do not paste in plausible-sounding text from
> training data; ask the owner to author each section or cite a specific
> standards document for review.
>
> Until the TODOs are filled in by the owner, treat this skill as a structural
> placeholder. The mechanical parts (where files live, what Panel A shows) are
> safe to rely on; the *accessibility judgments* are not.

## Why this skill exists

The Live Region Lab is a research instrument for streaming-announcement
strategies. Evaluating a strategy requires reasoning about:

- how `aria-live` regions actually behave in real assistive technologies,
- the difference between `polite` and `assertive` and what each implies,
- the screen-reader announcement model (queueing, interruption, idle detection),
- the things Panel A models honestly vs. the things only a real screen-reader
  test can answer.

This file is the structure for that reasoning. The owner fills the substance.

---

## 1. What Panel A actually shows (mechanical — safe)

Panel A is a model of **what the page hands the assistive technology**:
the announcement events the active strategy emits, with timestamps.

It is **not** a transcript of what a screen reader says. No web API exposes
the spoken accessibility-tree output. Any claim in this skill (or anywhere
else in the lab) that frames Panel A as "what NVDA said" is false.

When evaluating a strategy with the lab, the questions Panel A *can* answer:

- How many `announce` events does the strategy emit for a given fixture?
- How many `cancel` events? At what rate?
- What is the inter-event interval distribution?
- Are there any moments where many events fire in a small window?

The questions Panel A *cannot* answer:

- Did the user actually hear the announcement?
- Did NVDA / JAWS / VoiceOver interrupt cleanly?
- Did the announcement collide with another aria-live region on the page?

For those, you need a real screen reader.

---

## 2. ARIA live regions — model

**TODO(owner):** Author this section. It should cover, at minimum:

- The behavioral contract of `aria-live="polite"` vs `aria-live="assertive"`
  in WCAG / ARIA spec terms (not popularization).
- The role of `aria-atomic` and `aria-relevant` for streaming updates.
- Why some implementations swallow rapid-fire updates and others queue them.
- How `aria-busy` interacts with announcement timing.

Do not let Claude fill this in from memory. Cite the ARIA Authoring Practices
Guide or WCAG technique you draw from.

---

## 3. Screen-reader announcement model (per engine)

**TODO(owner):** Author this section, ideally as a small matrix by engine.
At minimum:

- NVDA: queueing behavior, interruption behavior, known live-region quirks.
- JAWS: same.
- VoiceOver (macOS): same.
- VoiceOver (iOS): same — iOS often behaves differently from macOS.

This is exactly the kind of section where AI-generated content tends to be
plausible-sounding and subtly wrong. The owner has shipped against these
engines for years; defer to that.

---

## 4. What to verify when evaluating a strategy in the lab

**Mechanical checklist (safe to use today):**

- [ ] Run the strategy against the fixture at the default rate (8 tok/s, jitter 0.3, seed 1).
- [ ] Note the announce/cancel/flush counts in Panel A.
- [ ] Toggle the audio illustration and listen with the volume up.
- [ ] Re-run at a fast rate (e.g. 24 tok/s) and re-record the counts.
- [ ] Re-run at a slow rate (e.g. 3 tok/s) and re-record.
- [ ] Record the run in `docs/lab/live-regions/lab-notebook.md`.

**Accessibility judgments (TODO(owner)):**

The above gives you instrument readings. Turning instrument readings into a
judgment about whether a strategy is *good for real assistive-technology
users* requires the owner's expertise. Specifically:

- TODO(owner): what announcement cadence is comfortable for a screen-reader user?
- TODO(owner): when is an interruption acceptable, and when is it hostile?
- TODO(owner): how should code blocks be announced (or not) during streaming?
- TODO(owner): what is the right politeness level for streaming LLM output?

These are not questions Claude should answer. Ask.

---

## 5. Out of scope for this skill

- This skill is not a WCAG primer. It assumes the reader already knows WCAG 2.1 AA.
- This skill is not a tutorial for `aria-live`. It assumes familiarity.
- This skill is not a replacement for testing with real users on real
  assistive technology. Even a perfect Panel A trace tells you nothing about
  whether a real user can keep up.
