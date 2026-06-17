# Live Region Lab — Findings Summary

A short, always-current map of "what we know so far." Distinct from the
chronological notebook: this is the current state, not the history. Update
whenever a finding changes the picture.

---

## Current state — 2026-06-01

**Status:** Instrument scaffolded. No bench sessions yet.

**What we believe (default priors, not findings):**

- The cancel-and-restart pattern produces a current-but-garbled stream.
- The queue-everything pattern produces an intelligible-but-stale stream.
- A useful strategy probably has to chunk on semantic boundaries (sentences,
  clauses, code-block borders) — but this is a hypothesis, not a finding.

**What we have measured so far:** nothing. The bench is open.

**Open questions:**

- What metric or metrics matter? Announce-event count? Time-from-token-to-
  announce? Time-between-announces? Subjective listenability? We don't know
  yet, and the brief explicitly defers automated measurement until after a
  few bench sessions reveal what is worth measuring.
- How hostile is hostile enough for the fixture? The current fixture
  includes prose, em-dash, mid-word splits, markdown list, and a code
  block. If a strategy passes it without obvious flaws, we likely need to
  make the fixture meaner before trusting the result.

**What this lab will not produce:**

- A single "best" strategy with a checkmark next to it. That is not the
  brief; the lab is the microscope, not the finding.

---

## How to use this document

Update this file when a bench session changes the picture. Append the new
state at the top, push the prior state down under a dated header so the
evolution is visible without re-reading the notebook in full.

The notebook is the journey. This is the map. Keep them both.
