# CMS + Publish Readiness PR Checklist

Use this checklist for the CMS implementation PR and any follow-up PRs that move
calleynye.com toward public launch. The goal is to prevent draft, placeholder, or
thin content from reaching production while preserving the current accessibility
and performance bar.

## CMS Implementation

- [ ] CMS choice is documented, including why it fits this repo's Next.js App
      Router, MDX, TypeScript, and static-generation setup.
- [ ] Writing content has structured frontmatter with explicit publication state:
      `draft`, `review`, or `published`.
- [ ] Public pages and indexes render only `published` content.
- [ ] Draft/review content can be previewed locally without appearing in the
      production build.
- [ ] Required fields are enforced for every writing entry:
      `title`, `description`, `date`, `tags`, `status`, and body content.
- [ ] Reading time is generated from content or validated against body length.
- [ ] CMS schema prevents empty or placeholder descriptions.
- [ ] CMS schema supports content notes needed for review, but those notes never
      render publicly.
- [ ] CMS setup keeps content in Git or otherwise preserves reviewable change
      history.
- [ ] CMS implementation does not introduce unnecessary client-side JavaScript on
      public pages.

## Content Publish Gates

- [ ] Add a `pnpm content:audit` script, or equivalent, that fails the build when
      public content contains launch-blocking terms such as `stub`, `placeholder`,
      `TODO`, `TBD`, `pending`, `replace`, `will replace`, `synthetic test`, or
      `real-photo numbers`.
- [ ] Content audit fails when a `published` essay is below the agreed minimum
      body length.
- [ ] Content audit fails when `readingTime` does not match the actual body
      length within an acceptable range.
- [ ] Content audit fails when a public essay is missing title, date,
      description, or tags.
- [ ] Content audit is included in the pre-publish command path, either through
      `pnpm build`, CI, or a documented release checklist.
- [ ] The audit output identifies the exact file and field that needs attention.

## Known Publish Blockers To Resolve

- [ ] Remove, finish, or mark as draft:
      `src/content/writing/accessibility-as-the-path-of-least-resistance.mdx`.
- [ ] Remove, finish, or mark as draft:
      `src/content/writing/live-regions-are-a-real-time-ui-problem.mdx`.
- [ ] Remove, finish, or mark as draft:
      `src/content/writing/the-design-engineer-is-a-translator-not-a-compromise.mdx`.
- [ ] Resolve provisional measurement language in
      `src/content/writing/compressive-images-revisited.mdx`.
- [ ] Resolve provisional synthetic-image language in
      `src/components/writing/compressive/format-bars-demo.tsx`.
- [ ] Expand Selected Work into real prose case studies, or rename/reframe the
      section so it no longer promises prose case studies.
- [ ] Replace the homepage resume summary with an accessible inline HTML resume,
      or rename/reframe the section so it does not claim to be an inline resume.
- [ ] Decide whether `/lab` is public at launch. If public, remove WIP/internal
      language and make it feel intentionally published. If not public, remove it
      from primary navigation and public indexes.
- [ ] Complete manual VoiceOver and NVDA checks before launch, or update the
      accessibility statement to honestly list incomplete manual testing as a
      known limitation.
- [ ] Fix date formatting so frontmatter dates render consistently across
      timezones.
- [ ] Review credibility-sensitive claims, especially the Crowdrise 20% business
      impact claim, and add context or soften wording where needed.

## Accessibility

- [ ] `pnpm lint` passes with JSX accessibility rules enabled.
- [ ] `pnpm test:e2e` passes with zero axe violations.
- [ ] Keyboard navigation works for every interactive element.
- [ ] Skip link is present and works on every page.
- [ ] Focus-visible styles are visible and meet contrast requirements.
- [ ] Dynamic or interactive content exposes appropriate screen reader state.
- [ ] Meaningful images have descriptive alt text; decorative images use empty
      alt text.
- [ ] Manual VoiceOver check completed for homepage, writing index, essay page,
      lab page if public, and accessibility statement.
- [ ] Manual NVDA check completed for homepage, writing index, essay page, lab
      page if public, and accessibility statement.

## Performance + Build

- [ ] `pnpm lint` passes.
- [ ] `pnpm test` passes.
- [ ] `pnpm test:e2e` passes.
- [ ] `pnpm audit` reports no known vulnerabilities.
- [ ] `pnpm build` passes.
- [ ] Public pages remain statically generated where possible.
- [ ] Lighthouse production-build scores meet project targets:
      Performance 95+, Accessibility 100, Best Practices 95+, SEO 95+.
- [ ] CMS implementation does not add a large public bundle or unnecessary
      `'use client'` boundaries.

## Design, UX, And Taste Review

- [ ] Run a design/taste critique before marking the PR ready.
- [ ] Public navigation contains only sections that feel launch-ready.
- [ ] Section labels match the depth of content they introduce.
- [ ] The writing index reads like a curated publishing surface, not a list of
      unfinished drafts.
- [ ] The homepage clearly supports the central thesis without sounding like a
      marketing page.
- [ ] Claims are specific enough to be credible but not overstated.
- [ ] Empty states, WIP labels, internal notebook references, and implementation
      notes are absent from public pages unless intentionally framed for readers.

## Final PR Review

- [ ] PR description lists which publish blockers were resolved.
- [ ] PR description lists any remaining known limitations.
- [ ] Screenshots or local URLs are included for changed public pages.
- [ ] Any new CMS/editorial workflow is documented clearly enough for future use.
- [ ] No unrelated files were reformatted or refactored.
