# CMS + Publish Readiness PR Checklist

Use this checklist for the CMS implementation PR and any follow-up PRs that move
calleynye.com toward public launch. The goal is to prevent draft, placeholder, or
thin content from reaching production while preserving the current accessibility
and performance bar.

## CMS Implementation

- [x] CMS choice is documented, including why it fits this repo's Next.js App
      Router, MDX, TypeScript, and static-generation setup.
- [x] Writing content has structured frontmatter with explicit publication state:
      `draft`, `review`, or `published`.
- [x] Public pages and indexes render only `published` content.
- [x] Draft/review content can be previewed locally without appearing in the
      production build.
- [x] Required fields are enforced for every writing entry:
      `title`, `slug`, `description`, `date`, `tags`, `status`, and body content.
- [x] Reading time is generated from content or validated against body length.
- [x] CMS schema prevents empty or placeholder descriptions.
- [x] CMS schema supports content notes needed for review, but those notes never
      render publicly.
- [x] CMS setup keeps content in Git or otherwise preserves reviewable change
      history.
- [x] CMS implementation does not introduce unnecessary client-side JavaScript on
      public pages.

## Content Publish Gates

- [x] Add a `pnpm content:audit` script, or equivalent, that fails the build when
      public content contains launch-blocking terms such as `stub`, `placeholder`,
      `TODO`, `TBD`, `pending`, `replace`, `will replace`, `synthetic test`, or
      `real-photo numbers`.
- [x] Content audit fails when a `published` essay is below the agreed minimum
      body length.
- [x] Content audit fails when `readingTime` does not match the actual body
      length within an acceptable range.
- [x] Content audit fails when a public essay is missing title, date,
      description, or tags.
- [x] Content audit is included in the pre-publish command path, either through
      `pnpm build`, CI, or a documented release checklist.
- [x] The audit output identifies the exact file and field that needs attention.

## Known Publish Blockers To Resolve

- [x] Remove, finish, or mark as draft:
      `src/content/writing/accessibility-as-the-path-of-least-resistance.mdx`.
- [x] Remove, finish, or mark as draft:
      `src/content/writing/live-regions-are-a-real-time-ui-problem.mdx`.
- [x] Remove, finish, or mark as draft:
      `src/content/writing/the-design-engineer-is-a-translator-not-a-compromise.mdx`.
- [x] Resolve provisional measurement language in
      `src/content/writing/compressive-images-revisited.mdx`. (Verified clean
      after the real-photo work; essay published and locked by tests.)
- [x] Resolve provisional synthetic-image language in
      `src/components/writing/compressive/format-bars-demo.tsx`. (Verified clean;
      live in-browser + offline-reference framing only.)
- [x] Expand Selected Work into real prose case studies, or rename/reframe the
      section so it no longer promises prose case studies. (Section removed for
      launch.)
- [x] Replace the homepage resume summary with an accessible inline HTML resume,
      or rename/reframe the section so it does not claim to be an inline resume.
      (Rebuilt as a fuller inline resume: summary, experience with highlights,
      core skills.)
- [x] Decide whether `/lab` is public at launch. If public, remove WIP/internal
      language and make it feel intentionally published. If not public, remove it
      from primary navigation and public indexes. (Public; internal phase /
      notebook-path language removed.)
- [x] Complete manual VoiceOver and NVDA checks before launch, or update the
      accessibility statement to honestly list incomplete manual testing as a
      known limitation. (Statement updated: AA is a target, manual SR audits
      listed as not-yet-complete. The audits themselves remain open — see the
      two unchecked items under Accessibility.)
- [x] Fix date formatting so frontmatter dates render consistently across
      timezones.
- [x] Review credibility-sensitive claims, especially the Crowdrise 20% business
      impact claim, and add context or soften wording where needed. (The 20%
      claim is removed from all public surfaces; the Crowdrise resume bullet now
      cites a verifiable image-performance rollout instead.)

## Accessibility

- [x] `pnpm lint` passes with JSX accessibility rules enabled.
- [x] `pnpm test:e2e` passes with zero axe violations. (Axe scan extended to the
      new essay, the published compressive essay, and both lab routes.)
- [x] Keyboard navigation works for every interactive element. (Native elements
      throughout; e2e tests cover skip link, the TitleScatter live panel, and the
      model explorer.)
- [x] Skip link is present and works on every page. (In the root layout; e2e
      tested across five routes — first tab stop, visible on focus, targets
      `#main`.)
- [x] Focus-visible styles are visible and meet contrast requirements. (Global
      `:focus-visible` 2px accent outline; presence asserted in e2e.)
- [x] Dynamic or interactive content exposes appropriate screen reader state.
      (`aria-live` panels and `aria-pressed` on the interactive figures; manual
      SR verification still pending — see below.)
- [x] Meaningful images have descriptive alt text; decorative images use empty
      alt text. (Covered by the axe `image-alt` rule across all scanned routes.)
- [ ] Manual VoiceOver check completed for homepage, writing index, essay page,
      lab page if public, and accessibility statement. (Requires the owner on
      real assistive tech; disclosed as a known limitation in the statement.)
- [ ] Manual NVDA check completed for homepage, writing index, essay page, lab
      page if public, and accessibility statement. (Requires the owner on real
      assistive tech; disclosed as a known limitation in the statement.)

## Performance + Build

- [x] `pnpm lint` passes.
- [x] `pnpm test` passes.
- [x] `pnpm test:e2e` passes.
- [x] `pnpm audit` reports no known vulnerabilities.
- [x] `pnpm build` passes.
- [x] Public pages remain statically generated where possible.
- [x] Lighthouse production-build scores meet project targets:
      Performance 95+, Accessibility 100, Best Practices 95+, SEO 95+. (Local
      headless run on the production build: home 98/100/100/100, new essay
      97/100/100/100, accessibility 98/100/100/100. Lighthouse a11y is automated
      only — it does not stand in for the pending manual SR audits.)
- [x] CMS implementation does not add a large public bundle or unnecessary
      `'use client'` boundaries.

## Design, UX, And Taste Review

- [x] Run a design/taste critique before marking the PR ready. (Ran a taste
      critic over the changed public surfaces; quick wins addressed.)
- [x] Public navigation contains only sections that feel launch-ready. (Removed
      the "Work" link with the Selected Work section.)
- [x] Section labels match the depth of content they introduce. ("Case studies
      in prose" section removed; "Inline resume" -> "Resume".)
- [x] The writing index reads like a curated publishing surface, not a list of
      unfinished drafts. (Three published essays; drafts stay unpublished.)
- [x] The homepage clearly supports the central thesis without sounding like a
      marketing page.
- [x] Claims are specific enough to be credible but not overstated. (Unverified
      Crowdrise 20% claim removed.)
- [x] Empty states, WIP labels, internal notebook references, and implementation
      notes are absent from public pages unless intentionally framed for readers.
      (Lab notebook-path reference removed; TODO(owner) comments dropped.)

## Final PR Review

- [x] PR description lists which publish blockers were resolved.
- [x] PR description lists any remaining known limitations.
- [x] Screenshots or local URLs are included for changed public pages.
- [x] Any new CMS/editorial workflow is documented clearly enough for future use.
- [x] No unrelated files were reformatted or refactored.
