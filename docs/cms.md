# Content Management

This site uses Keystatic as a local, Git-backed CMS for writing content.

## Why Keystatic

Keystatic fits this repo because the site already stores essays as MDX in Git,
uses Next.js App Router, and statically generates public pages. It adds an
editorial UI and schema without moving content into a hosted database or adding
client-side JavaScript to public routes.

The CMS now manages two collections:

- **`writing`** — essays and long-form content; public routes live at `/writing/[slug]`; preview at `/cms-preview/writing/[slug]`.
- **`caseStudies`** — work case studies; public routes live at `/work/[slug]`; preview at `/cms-preview/work/[slug]`.

Both collections read from `src/content/<collection>/*.mdx` and are gated by `status` and `pnpm content:audit`. Neither collection publishes draft or review content to production routes.

The writing schema requires publication metadata, validates description quality,
and includes private `reviewNotes` for editorial context. The public writing
loader ignores `reviewNotes`, so those notes never render on the site.

The `caseStudies` schema follows the same `status` gate. Case study entries are authored and previewed in Keystatic at `/keystatic`, written to `src/content/caseStudies/*.mdx`, and only `published` entries appear at `/work` and `/work/[slug]`.

## Local Editing

Run the dev server:

```bash
pnpm dev
```

Open the Keystatic admin route:

```text
http://localhost:3000/keystatic
```

Edits are written to the MDX files in the respective collection directory
(`src/content/writing/` or `src/content/case-studies/`). Review those file
changes in Git before committing.

## Publication States

Writing entries use three statuses:

- `draft`: not public; early or stubbed material.
- `review`: not public; substantially written but not launch-ready.
- `published`: visible on public writing indexes and article routes.

Only `published` entries render publicly. Draft and review content can be edited
locally in Keystatic without appearing in public writing indexes or production
article routes.

Keystatic preview links point to development-only preview URLs under
`/cms-preview/writing/[slug]`. Those routes return 404 outside local development.

## Publish Gate

Before publishing, run:

```bash
pnpm content:audit
```

`pnpm build` also runs the audit through `prebuild`. The audit checks required
frontmatter, publication status, reading-time drift, short published essays, and
launch-blocking placeholder terms in public content.
