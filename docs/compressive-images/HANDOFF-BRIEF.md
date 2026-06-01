# Handoff Brief — "Compressive Images, Revisited" microsite

**For:** Claude Code, building the production version in Calley's portfolio repo
**Companion file:** `compressive-images-microsite.jsx` (the working prototype — use it as the interaction + content + visual spec, NOT as code to copy)
**Author context:** Calley Nye, senior frontend engineer. Portfolio piece for a UI Software Engineer application (React/Next.js/TypeScript, with accessibility + performance as the headline strengths). The microsite IS the portfolio artifact — its own accessibility and performance are part of what's being judged. Build accordingly.

---

## 1. What this page is

A long-form technical article with four interactive demos, arguing that "compressive images" — encoding an image at 2×/4× display dimensions but at very low quality so artifacts vanish when scaled down — still earns its place in 2026, and demonstrating *when it does and doesn't*. The deeper through-line is engineering judgment: re-testing an inherited best practice against current tooling rather than carrying it forward on faith.

The prototype `.jsx` captures the final content, voice, demo behavior, and visual system. Treat it as the design spec. Do not port its inline styles or single-file structure; rebuild properly.

---

## 2. Stack & design — MATCH THE EXISTING SITE

**The portfolio already exists, is built, and has its own design system and stack.** This page must be built natively into that codebase — same framework, same styling approach, same component patterns, same design tokens. Do NOT introduce a new stack, new fonts, or a new color system.

Before writing any code:
1. **Inspect the repo** to determine the actual stack (framework, TypeScript or not, styling approach — Tailwind / CSS modules / styled-components / etc.), routing conventions, and how content pages are structured.
2. **Find and reuse existing design tokens and components** — the site's color variables, typography scale, spacing, buttons, cards, layout wrappers, code-block styling. The new page should look like it has always lived on the site.
3. **Match existing conventions** for file location, naming, imports, and how other articles/pages on the site are authored (MDX? a content collection? plain components?). Follow whatever pattern the existing writing/projects pages use.

The targets still hold and are presumably already how the site is built: production quality, Lighthouse 95+, WCAG 2.1 AA, deployed on the site's existing host. Confirm the site's current Lighthouse/a11y baseline and don't regress it.

---

## 3. KNOWN BUG TO FIX (do not reproduce)

The prototype's image uploader fails with "couldn't decode that image" on valid JPEGs and PNGs. **Root cause: the prototype loads the uploaded file via `URL.createObjectURL()` and sets it as an `<img>` src; the artifact sandbox's CSP blocks `blob:` URLs, so `img.onerror` fires.**

**Fix for production:** read the file with `FileReader.readAsDataURL()` and use the resulting base64 data URL as the image source (or, in a true browser context outside a restrictive sandbox, `createObjectURL` is fine — but data URL is the robust default). Also:
- Detect **HEIC/HEIF** explicitly (common from Mac/iPhone) — browsers can't decode it in `<img>`. Either integrate a decoder (e.g. `heic2any`) or show a clear "Please use JPG/PNG/WebP" message instead of a generic decode error.
- Surface real, specific error messages; never fail silently.
- Revoke object URLs / release references on replacement to avoid memory leaks (the prototype does this for encoded outputs; keep it).

---

## 4. The four demos (behavior spec — see prototype for exact UX)

All image demos share ONE uploaded source (page-level state), defaulting to a procedurally-drawn photographic test scene when nothing is uploaded. Everything encodes **client-side via `canvas.toBlob()`** and reports **real measured bytes** — this "the numbers are computed live in front of you" property is core to the piece's credibility. Do not replace with asserted/hardcoded numbers.

1. **Live quality slider.** JPEG/WebP toggle + a 5–95% quality slider. Encodes the source at @2x, shows it scaled into a display box, reports compressive vs accepted (@2x @75%) file size and the live % savings. Debounce recompute (~60ms).

2. **"Can you actually tell?"** Accepted @2x (q75) vs compressive @2x (q20), both scaled into the box. A toggle reveals both at full encoded size so the artifacts appear at 1:1 then vanish when scaled. The whole point made visual.

3. **Format + density bars.** @2x/@4x density toggle. Bars for @1x baseline, accepted @2x, (at @4x: full-quality @4x "naive way"), and compressive. **JPEG + WebP computed live; AVIF cannot be canvas-encoded — show AVIF from offline-measured numbers, clearly labeled "measured offline."** Headline finding: compressive cuts the accepted method substantially in every format; @4x is where it's most valuable because full-quality @4x is punishingly large. Honest caveat stays in: vs a plain @1x the win is image-dependent.

4. **next/image tension explainer.** Toggle between "legacy/constrained" pipeline (compressive wins — email, CMS, locked-down themes) and "next/image pipeline" (let the framework lead; express the *insight* by turning the `quality` prop down rather than hand-baking a compressive asset, which would double-compress and fight the resizer).

---

## 5. Performance & architecture notes

- Heavy canvas work must not block first paint or tank the Performance score. Lazy-mount demos (IntersectionObserver, and the site's own code-splitting / dynamic-import mechanism) so encoding only runs when a demo scrolls into view (prototype already gates bar animations this way).
- Canvas encoding is client-only — guard against SSR if the site server-renders (`typeof window`, effects/mount-only execution).
- Keep the shared-source-image architecture from the prototype (one upload → all demos recompute). It's clean and it's the right model.
- Real images for the article's stated benchmark numbers: Calley will run `compressive_benchmark.py` (separate file) on real photographs and provide field-grade figures. Until then, prose percentages and the AVIF row are from a SYNTHETIC test image and must be labeled/updated. **Do not present synthetic numbers as field data.**

---

## 6. Accessibility requirements (must-haves, from the prototype — preserve all)

- Skip-to-content link; visible focus rings on every interactive control.
- Reading-progress bar as a real `role="progressbar"` with aria values.
- Every toggle/button has `aria-pressed`; the slider has a label + `aria-valuetext`.
- Live byte-count results in `aria-live="polite"` regions so screen-reader users hear the numbers change.
- Charts/diagrams carry text alternatives (`role="img"` + descriptive `aria-label`, or visually-hidden descriptions).
- File input is properly labeled and keyboard-operable; error messages use `role="alert"`.
- Respect `prefers-reduced-motion` (disable the bar/scale animations).
- Color is never the sole signal; check contrast against the palette below at AA.

---

## 7. Visual system — DEFER TO THE EXISTING SITE

**The portfolio's own design system is the source of truth.** Use the prototype only as a reference for *layout and component structure* (editorial single-column prose, demo cards, numbered section markers, sticky header, reading-progress bar) — NOT for colors, fonts, or specific token values.

- **Colors/typography/spacing:** use the site's existing tokens. Ignore the prototype's amber/slate palette and Source Serif/Sans/JetBrains font choices unless they happen to match the site already.
- The prototype's demos use semantic colors for good/bad/accent states (savings green, "larger" red, an accent for the compressive bars). Map these onto the site's equivalent semantic or accent colors rather than introducing new hexes.
- **Notation convention (keep regardless of design):** `@1x`/`@2x`/`@4x` for image FILES/sources; `1×`/`2×`/`3×`/`4×` for device pixel ratios. This is technical correctness, not styling — preserve it.
- If the site has an established pattern for interactive/demo embeds within articles, follow it.

---

## 8. Content / claims integrity (don't let these slip in the rebuild)

- **Credit the prior art plainly:** compressive images = Daan Jobsis ("Retina Revolution") + Filament Group (~2012). Calley is an early adopter, not the inventor — the contribution is the 2026 re-validation. Never imply invention.
- Keep the honest limits: image-dependent results, the documented 2013 counter-findings, when NOT to use it.
- Keep the Crowdrise origin (settled an argument with the team; shipped it sitewide) accurate.
- The "screen density 2015 → 2026" chart percentages are ILLUSTRATIVE/directional, labeled as such — they're not a single sourced dataset. Either keep that framing or replace with specific cited figures.

---

## 9. Suggested build order

1. **Inspect the existing repo** — confirm stack, styling approach, design tokens, content-authoring pattern, and how existing article/project pages are structured. Report findings before building.
2. Create the page using the site's existing content/page pattern and design tokens; build the static article shell (prose, sections, header/footer/progress if the site doesn't already provide them). Verify it matches the site visually and doesn't regress the site's Lighthouse/a11y baseline.
3. Shared image-source state + uploader **with the FileReader fix and HEIC handling**.
4. Demos 1–4 as lazy-mounted client components, using the site's component primitives where they exist.
5. Accessibility pass — full SR walkthrough; add/extend an accessibility statement only if the site doesn't already have one.
6. Swap in real-photo benchmark numbers once provided; relabel/clear synthetic figures.
7. Deploy via the site's existing pipeline; final Lighthouse + axe + manual a11y check.
