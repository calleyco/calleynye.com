---
name: site-copy-editor
description: Review and edit Calley Nye portfolio or Calley Co. site copy for technical correctness, technical clarity, accessibility language, and Calley's voice. Use for MDX essays, page copy, resume/work/speaking sections, metadata, labels, CTAs, alt text, and accessibility statements.
---

# Site Copy Editor

Use this skill when asked to review, rewrite, tighten, or edit copy on
calleynye.com or calley.io.

## First pass

1. Identify the content surface: essay, page section, resume entry, case study,
   metadata, label, CTA, alt text, or accessibility statement.
2. Read nearby content before editing so sentence rhythm, technical context, and
   page purpose stay consistent.
3. If the copy is on calleynye.com, preserve a personal, first-person,
   point-of-view frame. If it is on calley.io, preserve a commercial,
   service-oriented frame.
4. If the text touches brand thesis or positioning, also consult the project
   `content-voice` agent.

## Technical clarity checklist

- Is every technical claim accurate, bounded, and specific?
- Would a senior engineer know what system, constraint, or mechanism is being
  described?
- Are framework claims about React, Next.js, TypeScript, accessibility APIs, AI
  products, or performance stated with enough precision?
- Are metrics, dates, outcomes, and role claims supported by nearby source
  context?
- Does the copy avoid turning possibilities into guarantees?
- Does it distinguish implementation facts from beliefs, opinions, and strategy?

If a claim cannot be verified from repo context or user-provided context, flag it
instead of quietly strengthening it. Suggest a safer wording.

## Language checklist

- Keep Calley's voice: direct, precise, opinionated without being combative.
- Prefer concrete verbs and nouns over abstractions.
- Cut hype, filler, throat-clearing, and generic marketing language.
- Keep strong claims when they are supported; make the proof easier to see.
- Preserve useful specificity: names, systems, constraints, standards, outcomes.
- Avoid phrases like "passionate about", "leveraging", "empowering", "seamless
  experiences", "robust solutions", and "driving innovation".

## Accessibility language checklist

- Use "disabled people" or a specific access need when relevant.
- Avoid euphemisms such as "differently abled" and "special needs".
- Do not frame accessibility as charity, polish, or a compliance afterthought.
- Do not imply disabled users are edge cases.
- In accessibility statements, separate tested facts from commitments and known
  limitations.
- In alt text, describe the meaningful content or function. Do not write "image
  of" unless the medium itself matters.

## Editing workflow

For a review-only request:

- Lead with technical risks and unclear claims.
- Provide replacement wording only where it materially improves the copy.
- Mark anything that needs Calley's confirmation.

For an edit request:

- Patch the smallest useful region.
- Preserve MDX/frontmatter syntax and JSX structure.
- Do not rewrite unrelated copy.
- After editing, summarize what ambiguity, risk, or voice issue changed.

## Review output labels

- `FAIL:` incorrect, unsupported, inaccessible, or materially misleading copy.
- `WARN:` unclear, overbroad, weak, or inconsistent with voice.
- `SUGGEST:` replacement wording.
- `PASS:` strong copy worth preserving.
