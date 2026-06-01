# Handoff: Calley Nye — Kinetic Portfolio

## Overview

A personal portfolio site for Calley Nye — a senior software engineer / design technologist with a focus on accessibility, real-time UI, and design systems. The site exists to land a single specific role at Anthropic, so it doubles as a writing platform: an essay-driven home page, a full article index with tag filtering, an article reading template, and a complete component library page.

The visual language ("Kinetic") is high-contrast near-black with a magenta accent, expressive serif display type set against a clean sans, and small motion details (a marquee strip, hover-weight letters) that respect `prefers-reduced-motion` and a user-toggleable Motion control.

## About the Design Files

The files in `source/` are **design references built in static HTML/CSS/JS** — they show intended look, behavior, and accessibility patterns. They are **not** production code to copy into a build pipeline as-is.

Your task is to **recreate these designs in the target codebase's environment** (Next.js / Astro / SvelteKit / etc.) using its established conventions and content pipeline. If no codebase exists yet, the recommended stack is **Next.js (App Router) + MDX for articles + Tailwind or vanilla CSS Modules** — but any modern static-friendly framework works. The HTML is the source of truth for visuals; the framework choice is the implementer's call.

## Fidelity

**High-fidelity.** All colors, type, spacing, radii, motion, focus rings, and interaction states are final. Copy the values literally — do not "improve" them. Variations from the spec should only happen where the target framework forces a different idiom (e.g. Next `<Link>` instead of `<a>`).

## Pages / Views

There are **four** routes:

### 1. `/` — Home (`source/index.html`)

**Purpose.** The headline page. Establishes voice, surfaces 5 most recent essays, ends in a contact CTA.

**Layout.** Single column, max-width ~1180px, centered. Stacked sections with horizontal rules between them. Top-to-bottom:

1. **Topbar** (sticky? no — static at the top of page).
   - Left: brand mark (3 dots) + "CALLEY·NYE" wordmark (Geist Mono, uppercase, letter-spaced).
   - Center/right: nav links — Work / Writing / Components / Index.
   - Far right: a Motion toggle button (`aria-pressed`, persists in `localStorage` under key `kinetic.motion`, also respects `prefers-reduced-motion` initially).
2. **Hero**.
   - Top marquee strip: monospace skill tags scrolling left, separated by `·` accents.
   - Kicker: `01 · Hello` (mono, uppercase, magenta).
   - Display headline (Instrument Serif, ~clamp(44px, 9vw, 140px), line-height 0.95). Italic words ("interfaces", "everyone") are in magenta. Hover any word: letters animate up slightly (effect built by wrapping each char in a `<span class="k">`).
   - Sub-paragraph (Geist, fg-mute, max 58ch).
   - Two CTAs: primary (magenta filled pill "Read the essay →") + secondary (outline pill "Get in touch ↓").
   - Bottom marquee strip (reverse direction): tech stack list.
3. **Manifesto** — `02 · The thesis`. Big serif quote, with two body paragraphs in a 2-column grid (1-col on ≤720px).
4. **Writing** — `03 · Writing`. Numbered list of 5 articles. Each row is a full-width link: number (mono, magenta) → title (serif) + dek (sans, fg-mute) + meta line → arrow on the right. Hover state: row gets a magenta border/underline; arrow translates right.
5. **Contact** — `04 · Contact`. Big italic "Say hello." headline + 3 contact items (Email / LinkedIn / GitHub) as a grid of large card-style links.
6. **Footer** — copyright + a11y statement, mono, fg-dim.

### 2. `/writing` (or `/articles`) — Article index (`source/articles.html`)

**Purpose.** Full archive with tag filtering. Default-sorted newest first.

**Layout.** Same topbar + footer as home. Body:
- Page header: kicker `Index`, h1 "Writing.", lede.
- Tag filter chip row (mono, pill, `aria-pressed`). Clicking re-renders the list (client-side filter).
- Same numbered article-row component as the home Writing section, but showing all articles.

### 3. `/writing/[slug]` — Article reader (`source/article.html`)

**Purpose.** A single essay reading view. The HTML mock uses one essay ("Which model of disability is your AI product operating from?") as the example.

**Layout.**
- Topbar + footer.
- Header block: kicker (date · reading time · tags), h1 (serif, large), dek (lede, fg-mute).
- Single body column, max ~64ch. Body uses `--serif` for headings, `--sans` for paragraphs. Generous line-height (1.7-ish).
- Pull-quotes are styled with a left magenta rule and italic serif.
- Footer signature: "— Calley, December 2025" + a "Back to writing" link.

### 4. `/components` — Style guide (`source/style-guide.html` + `style-guide.css`)

**Purpose.** Live reference of every primitive in the system. Implement this as an internal-only route or as a Storybook/Ladle catalog — your choice.

**Sections** (each has its own `<section id>` so the in-page TOC works): Tokens · Type · Buttons · Links · Forms · Selects · Cards · Badges · Alerts · Tables · Nav & pagination · Focus & a11y. The HTML is fully annotated — read it directly when implementing.

## Design Tokens

Defined as CSS custom properties in `:root` (see `source/style.css` lines 1–16).

### Color

| Token         | Hex       | Use                                       |
| ------------- | --------- | ----------------------------------------- |
| `--bg`        | `#0c0810` | Page background                           |
| `--bg-2`      | `#18101e` | Cards, inputs, alert surfaces             |
| `--rule`      | `#2a1e30` | All hairline borders / dividers           |
| `--fg-dim`    | `#54475a` | Decorative numbers, disabled text         |
| `--fg-mute`   | `#8a7a90` | Secondary copy, meta lines                |
| `--fg`        | `#f4ebf5` | Primary text                              |
| `--accent`    | `#ff3ea5` | The single accent — links, CTAs, focus    |
| `--accent-ink`| `#0c0810` | Text on top of the accent (matches `--bg`) |

There are **no other colors** except a few semantic alert hues (success green `#a8d6b0` on `#0d1812`; warn `#e6c576` on `#1a1410`; error `#f59ab4` on `#1a0d12`). Do not invent new ones.

### Type

| Role     | Family                | Source                |
| -------- | --------------------- | --------------------- |
| Display  | **Instrument Serif**  | Google Fonts          |
| Body     | **Geist**             | Google Fonts          |
| Mono     | **Geist Mono**        | Google Fonts          |

Self-host these in production via `next/font` or equivalent. Do not depend on the Google Fonts CDN at runtime.

Scale (px values resolve via `clamp()` in CSS — preserve the clamps):
- Display: `clamp(48px, 8vw, 110px)` — Instrument Serif, line-height 0.95, letter-spacing -0.02em
- H1 (article): `clamp(32px, 4vw, 48px)`
- H2: `clamp(26px, 3vw, 36px)`
- H3: `clamp(20px, 2vw, 24px)` italic
- Lede: `clamp(17px, 1.4vw, 21px)`, color `--fg-mute`
- Body: 16–17px / 1.55–1.65, max 64ch
- Small: 13px / 1.5, `--fg-mute`
- Mono utility (kickers, meta, labels): 11–12px, letter-spacing 0.10–0.16em, uppercase, often `--accent`

### Spacing

Linear-ish: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96. Page-level vertical rhythm uses `clamp(60px, 8vw, 120px)`.

### Radius

`4` (badges), `8` (inputs, alerts), `10–12` (cards), `999px` (buttons, chips, tags).

### Focus

A single global focus style: `outline: 2px solid var(--accent); outline-offset: 4px;`. Applied to every focusable element via `:focus-visible`.

### Motion

- Marquee scroll: 40s linear infinite (reverse on the second strip).
- All hover transitions: 150–200ms ease.
- Status dot pulse: 2.4s ease-in-out infinite.
- Spinner: 0.7s linear infinite.
- **Hard rule:** under `prefers-reduced-motion: reduce` OR when the user clicks the Motion toggle (`html.rm`), all animations and transitions collapse to ~0ms. The site must remain fully usable.

## Interactions & Behavior

- **Motion toggle.** Topbar button. `aria-pressed`. Adds/removes `.rm` on `<html>`. Persists choice in `localStorage` (`kinetic.motion` = `'on' | 'off'`). On first load, defaults to `'off'` if `prefers-reduced-motion: reduce`, else `'on'`.
- **Tag filter (writing index).** Chip group with `aria-pressed`. Single-select. Re-renders the list client-side. URL should reflect the active filter (`?tag=accessibility`) so it's shareable.
- **Hover-weight letters (hero & manifesto).** Words are split into per-character `<span>`s. CSS scales/translates a hovered `.k` slightly. Disable under `.rm`.
- **Article rows.** Whole row is clickable. Hover: row gains a magenta hairline + arrow translates 4px right.
- **Focus order.** Skip link → topbar nav → motion toggle → main content. The skip link must be the first focusable element on every page.

## Content / Data

`source/shared/data.js` is the single content source for the prototype. In production, articles should live as MDX files (one per essay) and the index/home pages should read frontmatter (title, dek, date, readingTime, tags, slug). The 5-most-recent slice on the home page should be derived at build time.

## Accessibility

Non-negotiable. Bullet list of what the implementation must preserve from the mocks:

- WCAG 2.2 AA contrast on every surface (already satisfied by the palette above).
- Skip link, landmark roles (`banner`, `main`, `contentinfo`), `aria-label`/`aria-labelledby` on every section.
- Every toggle/chip is a real `<button>` with `aria-pressed`.
- Forms: every input has a `<label>`. Errors use `aria-invalid` + `aria-describedby` pointing at the error message.
- `prefers-reduced-motion` honored, plus the user-facing Motion toggle.
- Focus is always visible (the global outline rule above — do not remove it).
- Screen-reader-only text uses a `.sr-only` utility (clip + 1px). Several places rely on it; keep them.

## Assets

- Calley's résumé PDF lives at `source/shared/Calley_Nye_Resume.pdf` and should be downloadable from the contact section in production.
- No raster imagery in the current design. If you add photography later, the layout assumes images are 16:9 with a 12px radius and a 1px `--rule` border.

## Files in this bundle

```
source/
  index.html              — home page mock
  articles.html           — writing index mock
  article.html            — single article reader mock
  style-guide.html        — component library mock
  style.css               — all site tokens + page styles
  style-guide.css         — primitives only (buttons, forms, cards, etc.)
  shared/
    data.js               — articles array + bio data
    Calley_Nye_Resume.pdf — résumé download asset
```

Open `source/index.html` in any modern browser to interact with the prototype directly.

## Open questions for the implementer

- **Framework choice.** Next.js is recommended but not required.
- **CMS / writing flow.** MDX-on-disk is recommended; if you'd rather use a hosted CMS (Sanity, Contentful), the data shape in `data.js` shows the minimum required fields.
- **Analytics.** None in the mock. Add Plausible or similar if desired.
- **Hosting.** Static export → Vercel / Netlify / Cloudflare Pages all work.
