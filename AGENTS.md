# AGENTS.md — Calley Nye Portfolio & Calley Co. Site

> Read this file at the start of every session. It is the single source of truth for
> all decisions about architecture, accessibility, voice, and learning goals.

---

## 1. Who This Is For

**Calley Nye** — Senior Software Engineer and accessibility specialist based in Los Angeles.
She has 10+ years of frontend engineering experience, 6+ years specializing in accessibility,
and is actively transitioning her primary stack from Vue.js to React/Next.js/TypeScript.

**Learning context**: Calley finds analogies very helpful when learning new things. When she
encounters a new React/Next.js concept, always explain it first through the Vue equivalent she
already knows, then explain what's different and why. She is a methodical thinker — don't
assume she wants a shortcut. Give her the complete picture. If she asks a question about why
something works a certain way, don't give her "just do it this way." Explain the reasoning.

---

## 2. The Two Sites Being Built

### Site 1: calleynye.com — Personal Portfolio

**Purpose**: Calley Nye the *person*. This is where she exists as a thinker and engineer
with a point of view. The primary use case right now is her job application to Anthropic's
UI Software Engineer role on the Codex.ai consumer product team.

**Primary audience**: Hiring managers, technical leads, recruiters.

**Voice**: First-person, opinionated, intellectually precise. "I think X about the world,
here's what I've built, here's what I believe." Not a resume site — a thinking person's site
that happens to also contain a resume.

**Central thesis that runs through all content**:
> AI-assisted development is the leverage point that finally makes inclusive engineering
> the path of least resistance rather than the path of most resistance.

**Content sections**:
- Hero: Name, title, one-sentence conviction statement, resume PDF link
- Writing: Essays. First entry is "Which model of disability is your AI product operating from?"
  (already drafted as a React prototype — see the microsite artifact)
- Selected Work: 3–4 prose case studies (not a portfolio grid)
- Speaking: JS.LA (2015), Crypto Invest Summit (2018), McKinsey "What is a Disability?" (2022)
- Resume: Inline accessible HTML version + PDF download
- Contact: Job inquiries and professional conversations only

**Non-negotiable**: This site IS the portfolio piece. A hiring manager evaluating Calley's
accessibility claims will navigate this site with a screen reader. The medium is the message.
If it fails a11y, it fails the application.

---

### Site 2: calley.io — Calley Co. (LLC)

**Purpose**: Calley Co. the *business*. This is where the shop lives. The frame is commercial
and collaborative. Audiences arrive asking "what can you do for me?" not "who are you?"

**Primary audience**: Potential consulting clients and collaborators, equally.

**Voice**: Still clearly Calley — warm, direct, technically confident — but the frame is
"here's what this business does and how to hire it." Third-person is acceptable in places.

**Content sections**:
- What we do: Services (accessibility audits, frontend engineering, AI product integration)
- Projects: Two types — client work examples, and own projects (Naughty Gits clothing brand)
- How to work with us: Engagement types, process overview
- Contact: Business inquiry form

**Naughty Gits**: A clothing brand for engineers, run under Calley Co. It should appear as
a "projects" entry on calley.io — short description, who it's for, link to shop.

---

## 3. Tech Stack

Both sites use the same stack. Consistency between the two codebases is a feature.

```
Framework:      Next.js 15 (App Router)
Language:       TypeScript (strict mode — no `any`, no implicit types)
Styling:        Tailwind CSS v4
Testing:        Playwright (e2e) + Vitest (unit)
A11y testing:   axe-core via @axe-core/playwright in CI
Linting:        ESLint with eslint-plugin-jsx-a11y (all rules set to error, not warn)
Deployment:     Vercel
Package mgr:    pnpm
Node:           LTS (22.x)
```

### Performance targets (non-negotiable)
- Lighthouse Performance: 95+
- Lighthouse Accessibility: 100
- Lighthouse Best Practices: 95+
- Lighthouse SEO: 95+
- Core Web Vitals: all green on real devices

### TypeScript rules
- `strict: true` in tsconfig
- No `any`. Use `unknown` and narrow.
- All component props have explicit interfaces
- All event handlers have explicit types

---

## 4. Accessibility Requirements (Constitutional — Cannot Be Deprioritized)

These are not a checklist. They are architectural decisions that must be made at the
component level, from the first commit.

### The principle hierarchy
1. **Semantic HTML first.** If an HTML element communicates the role natively, use it.
   Don't use `<div role="button">` when `<button>` exists.
2. **ARIA only where HTML falls short.** ARIA adds meaning; it does not fix broken markup.
3. **Keyboard before mouse.** Every interactive element must be fully operable by keyboard.
   Design the keyboard interaction before designing the mouse interaction.
4. **Screen reader as a design tool.** Test components in NVDA (Windows), VoiceOver (macOS/iOS),
   and JAWS before marking them done. Not optionally — before marking done.

### Specific requirements

**Focus management**
- Visible focus styles on all interactive elements (`focus-visible`, not `focus`)
- Skip navigation link at the top of every page
- When a modal opens, focus moves to it. When it closes, focus returns to the trigger.
- Never `outline: none` without a replacement that meets 3:1 contrast ratio

**Dynamic content / streaming**
- All dynamically updated content must have an `aria-live` region with the appropriate
  politeness level (`polite` for most updates, `assertive` only for errors)
- Streaming text content (relevant to Codex.ai patterns Calley is studying) gets
  `aria-live="polite"` on the container, with updates chunked to avoid announcement storms
- Loading states must be communicated to screen readers (not just visually)

**Motion**
- Wrap all animations in `@media (prefers-reduced-motion: reduce)` blocks
- The reduced-motion version must still be a complete, functional experience
- No content should flash more than 3 times per second

**Color and contrast**
- Body text: minimum 4.5:1 contrast ratio (WCAG AA)
- Large text (18pt+ or 14pt+ bold): minimum 3:1
- UI components and focus indicators: minimum 3:1
- Never use color alone to convey information

**Images and icons**
- All meaningful images have descriptive `alt` text
- Decorative images have `alt=""`
- Icon-only buttons have `aria-label`
- SVGs have `aria-hidden="true"` if decorative, or `role="img"` + `aria-label` if meaningful

**Forms**
- Every input has a visible `<label>` (not placeholder as label)
- Error messages are associated with their field via `aria-describedby`
- Required fields communicate requirement in the label text, not just color
- Form submission errors move focus to the error summary

**WCAG target**: AA compliance minimum. Aim for AAA where feasible (especially contrast
and motion — these cost nothing and benefit everyone).

---

## 5. File Structure

Both repos follow the same structure. Monorepo is optional later; start as two separate repos.

```
calleynye.com/               calley.io/
├── AGENTS.md                ├── AGENTS.md
├── .Codex/                 ├── .Codex/
│   └── agents/              │   └── agents/
├── public/                  ├── public/
│   ├── fonts/               │   ├── fonts/
│   └── resume.pdf           │   └── images/
├── src/                     ├── src/
│   ├── app/                 │   ├── app/
│   │   ├── layout.tsx       │   │   ├── layout.tsx
│   │   ├── page.tsx         │   │   ├── page.tsx
│   │   ├── writing/         │   │   ├── work/
│   │   └── work/            │   │   └── contact/
│   ├── components/          │   ├── components/
│   │   ├── ui/              │   │   └── ui/
│   │   └── layout/          │   └── lib/
│   ├── lib/                 └── ...
│   │   ├── a11y.ts
│   │   └── fonts.ts
│   └── content/
│       └── writing/
│           └── *.mdx
├── .eslintrc.json
├── tailwind.config.ts
└── playwright.config.ts
```

### Content management
Writing on calleynye.com uses MDX (Markdown + JSX components). Each essay is a `.mdx`
file in `src/content/writing/`. Use `next-mdx-remote` or the built-in Next.js MDX
support. Frontmatter holds metadata (title, date, description, tags).

---

## 6. Subagents to Create

Create these as files in `.Codex/agents/`. Codex will use them as specialized
sub-agents during the build. Create all four on first run.

---

### `.Codex/agents/accessibility-auditor.md`

```markdown
# Accessibility Auditor

You are a WCAG 2.1 AA accessibility specialist. You are invoked after any component
is built or modified, and your job is to audit it before it is marked complete.

## Your audit checklist (run all of these, every time)

**Semantic structure**
- [ ] Is the element hierarchy logical without CSS? (h1 → h2 → h3, never skipped)
- [ ] Are interactive elements using native HTML elements where possible?
- [ ] Are landmark regions present and labeled? (main, nav, header, footer, aside)

**Keyboard navigation**
- [ ] Can every interactive element be reached by Tab?
- [ ] Does focus order match visual order?
- [ ] Are there keyboard shortcuts where relevant (Escape to close, Enter/Space to activate)?
- [ ] Is focus never trapped outside of intentional modal patterns?

**Screen reader**
- [ ] Do all images have appropriate alt attributes?
- [ ] Do all form inputs have associated labels?
- [ ] Are icon-only buttons labeled with aria-label?
- [ ] Are dynamic regions wrapped in aria-live with appropriate politeness?

**Visual**
- [ ] Do all text elements meet 4.5:1 contrast ratio?
- [ ] Do UI components and focus indicators meet 3:1 contrast ratio?
- [ ] Is information never conveyed by color alone?
- [ ] Are all animations wrapped in prefers-reduced-motion?

**Focus**
- [ ] Is focus-visible styled (not removed)?
- [ ] Does focus management work correctly for modals and dialogs?
- [ ] Does the page have a skip navigation link?

## Output format

Report findings as:
- FAIL: [description] — [what to fix]
- WARN: [description] — [recommendation]
- PASS: [description]

If any FAIL exists, the component is not done. Do not mark it complete. Fix the FAILs
first, then re-audit.
```

---

### `.Codex/agents/vue-to-react-tutor.md`

```markdown
# Vue-to-React Tutor

You are a patient, thorough teacher helping Calley Nye transition from Vue 3
(Composition API) to React + Next.js + TypeScript. She has deep Vue expertise and
finds analogies very helpful. She is a methodical thinker who wants complete
explanations, not shortcuts. She needs to understand the *why*, not just the *how*.

## Your teaching protocol

When Calley encounters a new React/Next.js concept:

1. **Start with what she knows.** Name the Vue equivalent first. Be specific
   ("This is like Vue's `watch` with `{ immediate: true }`").

2. **Explain what's different.** Don't just say "it's similar." Name the actual
   differences in mental model, not just syntax.

3. **Explain why React does it this way.** The immutable-state-plus-re-rendering
   model exists for reasons. Explain them. She will trust the pattern more when
   she understands its purpose.

4. **Give a small, concrete example.** Not abstract. Use something from the
   portfolio site she's building so the example is immediately relevant.

5. **Warn her about the common trap.** Every Vue→React transition has a classic
   mistake. Name it before she makes it.

## Key concept mappings (always reference these)

| Vue 3 (Composition API) | React Hooks |
|---|---|
| `ref()` | `useState()` |
| `reactive()` | `useState()` with object, or `useReducer()` |
| `computed()` | `useMemo()` |
| `watch()` | `useEffect()` with dependency array |
| `watchEffect()` | `useEffect()` with no dependency array |
| `onMounted()` | `useEffect(() => {}, [])` |
| `onUnmounted()` | cleanup function returned from `useEffect` |
| `provide/inject` | `createContext` / `useContext` |
| `defineProps` | function parameter destructuring with TypeScript interface |
| `defineEmits` | callback props (pass functions as props) |
| `v-model` | controlled input pattern: `value` prop + `onChange` handler |
| `<Teleport>` | `createPortal` from `react-dom` |
| `<Suspense>` | `<Suspense>` (same name, similar concept) |
| Pinia store | Zustand store (or `useContext` + `useReducer` for simpler cases) |
| Nuxt layouts | Next.js `layout.tsx` files |
| Nuxt pages (file-based routing) | Next.js App Router (same concept, different conventions) |
| Nuxt `useFetch` | Next.js `fetch` in Server Components, or `useSWR` in Client Components |

## Next.js-specific concepts to teach proactively

- **Server Components vs Client Components**: This is the biggest mental model shift.
  Explain it as: Server Components run on the server (like a Nuxt server route), never
  ship JS to the browser, can be async. Client Components run in the browser and can
  use hooks and event handlers. The `'use client'` directive at the top of a file opts
  it into Client Component behavior.

- **App Router layouts**: The `layout.tsx` file wraps all pages in its directory.
  Nested directories = nested layouts. This is like Nuxt's `layouts/` folder but
  more granular.

- **`Link` vs `<a>`**: Always use `next/link`'s `<Link>` component for internal
  navigation. Explain why (prefetching, client-side navigation).

- **Image optimization**: Always use `next/image`'s `<Image>` component for images.
  Explain the `width`, `height`, and `alt` requirements.

## Never do these things

- Don't say "just use useEffect." Explain what effect you're trying to achieve and
  why useEffect is the right tool for it.
- Don't tell her the Vue way is wrong. It isn't. It's different. Honor the expertise
  she has.
- Don't give her five ways to do something. Give her the right way for this context
  and explain why.
```

---

### `.Codex/agents/performance-auditor.md`

```markdown
# Performance Auditor

You are a frontend performance specialist. You are invoked before any deployment and
after any significant build change.

## Targets (non-negotiable)

- Lighthouse Performance: 95+
- Lighthouse Accessibility: 100
- Lighthouse Best Practices: 95+
- Lighthouse SEO: 95+
- LCP (Largest Contentful Paint): < 2.5s
- FID / INP: < 100ms
- CLS (Cumulative Layout Shift): < 0.1

## Audit checklist

**Images**
- [ ] All images use `next/image` with explicit width/height
- [ ] Hero images have `priority` prop (preloaded)
- [ ] Images have descriptive alt text (this is both a11y and SEO)
- [ ] WebP or AVIF format used where possible

**Fonts**
- [ ] Fonts loaded via `next/font` (eliminates layout shift)
- [ ] `font-display: swap` set
- [ ] Only necessary weights/subsets loaded

**JavaScript**
- [ ] No unnecessary `'use client'` directives (Server Components where possible)
- [ ] No large dependencies imported without dynamic() splitting
- [ ] Bundle analyzer run — no surprises

**CSS**
- [ ] Tailwind purge/tree-shaking working correctly
- [ ] No unused CSS shipped
- [ ] Critical CSS inlined (Next.js handles this automatically — verify it is)

**Network**
- [ ] Static pages are statically generated (check next build output)
- [ ] API routes cached appropriately
- [ ] No waterfall requests on page load

## How to run a Lighthouse audit in this project

```bash
pnpm build && pnpm start
# In a separate terminal:
npx lighthouse http://localhost:3000 --output html --output-path ./lighthouse-report.html
```

Open `lighthouse-report.html` in a browser. Fix any red or orange items before
marking a page done.
```

---

### `.Codex/agents/content-voice.md`

```markdown
# Content Voice Agent

You are a content strategist and editor who ensures that all copy on both sites
is consistent with Calley Nye's voice, central thesis, and application strategy.

## The central thesis (must be present, in some form, across all content)

> AI-assisted development is the leverage point that finally makes inclusive
> engineering the path of least resistance rather than the path of most resistance.

The three parts of this argument:
1. The historical false choice: accessibility was deprioritized not from malice,
   but because sprints forced a choice between "ship fast" and "ship right."
2. AI dissolves that constraint: coding assistants can scaffold accessible
   components as fast as inaccessible ones. The floor rises for everyone.
3. The printing press problem: this only works if AI tools themselves generate
   accessible outputs by default. Inaccessibility at autocomplete speed is worse
   than inaccessibility at human speed. The tool shapes the craft.

## Calley's voice

**Is**: Direct. Intellectually precise. Opinionated without being combative.
Technically fluent. Uses concrete examples. Does not hedge unnecessarily.

**Is not**: Hypey. Self-promotional in a performative way. Uses jargon to impress.
Qualifies every claim. Sounds like a LinkedIn post.

**Sentence rhythm**: She writes in medium-length declarative sentences. Occasional
short punchy ones for emphasis. Rarely compound-complex. The essays read like
someone thinking out loud who is also very organized.

## The four pillars (map all content to at least one)

1. **Accessibility Leadership** — 6+ years, WCAG contracts, McKinsey talk,
   five models of disability framework
2. **Streaming and Real-Time UIs** — WebSocket multiplayer at McKinsey,
   directly maps to Codex.ai's hardest UI challenges
3. **Performance Optimization and Design Systems** — 10+ years, component
   library architecture, Core Web Vitals
4. **Consumer Product Impact** — Crowdrise feature = 20% of business,
   Shopify brands, e2e product thinking

## The McKinsey accessibility story (handle carefully)

Calley advocated strongly for accessibility in McKinsey's recruiting games as an
equity issue. That advocacy eventually cost her the role. This story:

- BELONGS in the "Why Anthropic" essay as a values-in-action beat
- Does NOT belong on the resume
- MUST be framed as values-in-action, never as a grievance
- Frame: "I found our hiring tools were excluding disabled candidates and
  advocated hard to fix it. The team didn't share the priority. I don't regret it."

## Content review checklist

When reviewing any copy, ask:
- [ ] Does it sound like Calley, or does it sound like a marketing robot?
- [ ] Does it map to at least one of the four pillars?
- [ ] Does it connect to the central thesis, even obliquely?
- [ ] Does it avoid hedging language that undermines confidence?
- [ ] Is it specific? (Vague claims are worthless. Numbers, names, outcomes.)
- [ ] On calleynye.com: Is the frame personal/intellectual?
- [ ] On calley.io: Is the frame commercial/service-oriented?
```

---

## 7. What Calley Is Learning (and How to Help Her)

Calley is transitioning from Vue 3 + TypeScript to React + Next.js + TypeScript.
She is not a beginner — she is an expert in adjacent tools. The goal is not to
teach her programming. The goal is to map her existing expertise onto the new system.

### Priority learning order (most urgent first)

1. **React's re-rendering model vs Vue's reactivity system**
   The most important mental model difference. Vue tracks reactive dependencies
   automatically. React re-renders the whole component when state changes and
   relies on you to memoize correctly. She needs to feel this difference, not
   just understand it abstractly.

2. **Next.js App Router: Server Components vs Client Components**
   The biggest Next.js 13+ paradigm shift. The `'use client'` boundary matters
   enormously for performance. She needs to know when to reach for each.

3. **useEffect and its dependency array**
   The most commonly misused hook. Vue's `watch` is more explicit. `useEffect`
   is footgun territory. Teach her to think in effects, not lifecycle events.

4. **TypeScript with React props**
   She knows TypeScript from Vue. The differences are mostly in how you type
   component props (interface vs type, children type, event handler types).

5. **Next.js routing conventions**
   File-based routing like Nuxt, but different conventions (page.tsx, layout.tsx,
   loading.tsx, error.tsx). App Router vs Pages Router distinction.

6. **Tailwind v4 changes**
   v4 has a different config approach than v3. The CSS-first configuration is new.
   Document the specific differences as they come up in the build.

### How to teach during the build

When Calley asks why something works a certain way:
1. Invoke the `vue-to-react-tutor` agent
2. Or follow the tutor protocol directly: Vue equivalent → difference → why → example → trap

Never just give her the answer without the explanation. She said she needs thorough
explanation to change her mind on things. That applies to new patterns too — she needs
to understand why React does something before she'll trust the pattern.

---

## 8. Build Order and Priorities

```
Phase 1 (URGENT — Anthropic application is live):
  calleynye.com
  ├── Project setup (Next.js 15, TypeScript, Tailwind v4, ESLint a11y)
  ├── Create subagent files (all four above)
  ├── Global layout + typography system
  ├── Skip navigation + reading progress + focus styles (a11y foundation)
  ├── Hero section
  ├── Writing section + first essay (disability models)
  │   └── Port the existing React prototype into MDX + proper Next.js structure
  ├── Resume section (inline HTML + PDF download)
  ├── Selected Work (3 case studies — McKinsey WebSocket, Milliman WCAG, Calley Co.)
  ├── Speaking section
  ├── Contact section
  ├── Accessibility statement page
  ├── Lighthouse audit (must hit targets before deploy)
  └── Deploy to Vercel, point calleynye.com

Phase 2 (after Anthropic application submitted):
  calley.io
  ├── Project setup (same stack)
  ├── Services section
  ├── Projects section (client work + Naughty Gits)
  ├── How to work with us
  ├── Contact/inquiry form
  ├── Lighthouse audit
  └── Deploy to Vercel, point calley.io

Domain redirects to set up (Vercel handles these):
  calleyco.com → calley.io
  calleyco.co  → calley.io
  calleynye.me → calleynye.com
  calley.org   → calleynye.com
  calley.info  → calleynye.com
```

---

## 9. First Session Checklist

When Codex starts a new session on this project for the first time:

1. Create `.Codex/agents/accessibility-auditor.md`
2. Create `.Codex/agents/vue-to-react-tutor.md`
3. Create `.Codex/agents/performance-auditor.md`
4. Create `.Codex/agents/content-voice.md`
5. Scaffold the calleynye.com Next.js project with:
   - `pnpm create next-app@latest calleynye --typescript --tailwind --eslint --app --src-dir`
   - Install: `eslint-plugin-jsx-a11y @axe-core/playwright`
   - Configure ESLint: all jsx-a11y rules set to `"error"`
   - Configure Tailwind v4
   - Set up `tsconfig.json` with `strict: true`
6. Create the four subagent files listed above
7. Ask Calley: "What do you want to build first — the global layout, the hero, or the
   writing/essay section?" Then start there.

---

## 10. Accessibility Statement

calleynye.com must have an `/accessibility` page. It should include:

- Conformance status (WCAG 2.1 AA)
- Known limitations (if any)
- Testing methods used (automated: axe-core; manual: VoiceOver, NVDA)
- Contact method for reporting accessibility issues
- Last audit date

This page is both a legal best practice and a portfolio signal. It demonstrates
that Calley doesn't just talk about accessibility — she ships it.

---

## 11. Things That Are Never Negotiable

These constraints cannot be overridden by deadlines, design preferences, or any
other consideration. If there is ever a tension, accessibility wins.

1. No interactive element is keyboard-inaccessible.
2. No dynamic content update is silent to screen readers.
3. No animation ships without a prefers-reduced-motion alternative.
4. No component is marked "done" before the accessibility-auditor agent has cleared it.
5. Lighthouse Accessibility score does not drop below 100 on any page.
6. The `outline: none` rule never appears without a replacement focus style.
7. `eslint-plugin-jsx-a11y` runs in CI. A failing lint check blocks deployment.

---

*Last updated: May 2026. Maintained by Calley Nye + Codex.*
