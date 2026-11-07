# Design: Size-wizard case study ("An AI recommendation is only as honest as its interface")

**Date:** 2026-11-05
**Branch:** `ui-refinement`
**Status:** Draft — awaiting owner approval (see §8 open questions)

---

## 1. Goal

Ship the second `/work` case study: the trust-focused re-scope and redesign of an
AI size-recommendation product for a pre-launch school uniform brand. It is the proof
behind the new résumé framing (Design Engineer · Trustworthy AI Interfaces) and the
ready-made answer to "walk me through a project you're proud of."

## 2. Audience

Founders and hiring managers for design-engineer roles at AI companies (first:
Skiffra, AI decision-making for mining and physical industries). They read for
judgment: can this person tell when an AI's premise is wrong, and design an
interface that is honest about what the AI knows?

## 3. Thesis

The original product promised more than its data could support. The work was making
the system honest: re-scoping it around real measurements, labeling the less
accurate path as less accurate, and designing every screen so a parent could
verify, question, or override the recommendation.

## 4. Frontmatter (proposed)

| Field | Value |
|---|---|
| title | "An AI recommendation is only as honest as its interface" |
| slug | `ai-sizing-recommender` |
| description | Re-scoping an AI size recommender that promised more than its data could support, and redesigning it so parents could trust, verify, and override it. (≈150 chars) |
| client | "School uniform delivery startup" (anonymized) |
| role | "Founder & Design Engineer, Calley Co" (verbatim from résumé) |
| timeframe | **TBD — §8.1** |
| tags | AI product design, Trust & transparency, Accessibility, Design systems, Consumer product (first two are new tags → add to `case-study-tags.ts`) |
| stats | `9` components shipped · `3` variants per component · `11` recorded design decisions (scope stats, not outcomes — the product launched after the engagement ended, so no outcome metrics are claimed) |

## 5. Structure (≈2,000–2,500 words, first person, matching FFA's length and voice)

1. **The bet.** Local, in-person delivery with no shipping. Every return is a truck
   coming back. The company bet on an AI recommender that would size each child and
   predict growth to drive re-orders.
2. **The premise that didn't hold.** The model sized from age and weight, but there
   was no dataset of children's measurements by age and weight behind it. A precise
   answer to the wrong question.
3. **Re-scoping around what the data could support.** Two paths: measurement-first
   (most accurate) and a quick estimate labeled as less accurate. A branded measuring
   tape in every first delivery. Then the second discovery: "a medium isn't a medium"
   across products, which led to per-product sizing and an AI size-chart manager
   (supplier PDF → AI parse → human review → assign to products), product-managed
   with a partner developer. Stale-measurement states (3–6 months, 6+ months) where
   the system admits the child has probably grown.
4. **The method.** The Claude design workflow: problem statement → before screenshot
   → three variants → automated critique (accessibility, brand voice, edge cases,
   overconfident AI messaging) → refinement → recorded decision → build → after
   screenshot. Analogy: CI for design — variants are branches, critique is the test
   suite, decision records are the commit log.
5. **Five trust decisions** (before/after pairs):
   - Thinking screen: hardcoded 85% progress that told screen readers "85% complete"
     → indeterminate progress plus an honest checklist.
   - "Best fit" badge overpromising from a few measurements → softer, accurate copy.
     *(Exploration round, not shipped — present as in-progress design.)*
   - Recommended vs. selected size pills: the AI's pick stays visible when a parent
     overrides it. *(Same exploration project — not shipped.)*
   - Size guide: keep the child's measurements next to the chart so a parent can
     verify *why*, not just *what*.
   - Validation error: "You entered" in error red read as blame → neutral framing,
     one clear fix action.
6. **Where the system overruled me.** I asked for the wizard emoji; the critique
   flagged it against the brand voice guide; I shipped a ruler icon.
7. **What I'd do next / what I didn't get to see.** Results step and size-pill
   redesign were still in exploration; the product launched after I left, so there
   are no outcome numbers — and the piece says so plainly.

## 6. Visuals

Real screenshots from `Snapfituniforms.com/docs/design-projects/*/screenshots`,
brand removed:

- Crop to the modal / component; remove the site header, logo, and product photos.
- Blur or crop any remaining brand name, school names (e.g. "Holy Spirit School",
  "St. Mary's"), and product titles.
- Child names in screenshots ("Alex", "Karamo") are fixtures — keep.
- Candidate pairs: thinking screen, validation error, path selection, body
  measurements, size-guide modal, product callout.
- Exported as WebP into `public/work/ai-sizing-recommender/`, each with written alt
  text describing the change, not just the screen.

New MDX component: `<BeforeAfter>` — a `<figure>` with two images, visible "Before"
/ "After" labels (not color alone), shared `<figcaption>`, stacks on mobile. Dual
registered in `keystatic.config.ts` and `src/lib/case-studies.ts`, same as
`<CaseStudyVideo>`. Covered by the existing axe e2e scan.

## 7. Anonymization rules

Never in text, alt text, filenames, or image pixels: the client's name, domain,
school names, the previous agency, or the partner developer's name.

## 8. Open questions

1. **Timeframe:** the design records run April–May 2026. What were the engagement's
   start and end months?
2. **Measuring tape:** was it adopted, or proposed? (Changes "I added" vs. "I proposed.")
3. **Growth prediction:** was it cut, or deferred until real measurement data existed?
4. **Partner developer:** credit as "a partner developer" (no name)?

## 9. Out of scope

Home-page work teaser changes beyond what `getAllCaseStudyMeta()` already renders;
any edits to the FFA case study.
