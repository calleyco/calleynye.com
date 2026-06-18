// Data for the "Congratulations on your promotion" essay visualizations.
//
// VIZ 1 (TitleScatter): one skillset scattered across incompatible job titles.
// Requirements are drawn from real 2025–2026 listings and role breakdowns
// (Vercel Design Engineer posting; Revelo / dev.to FE developer-vs-engineer
// breakdowns; Telerik "design engineer = full-stack designer/developer"
// critique; Coursera/BLS "front-end engineer ≈ web developer").
//
// VIZ 2 (TwoLadders): the same person climbing two career ladders. Engineering
// rungs phrased in scope/systems language (per published eng ladders); design
// rungs in craft/product language (per Rippling's design ladder). The craft
// state shows what happens to UI craft at each rung.

export type FlavorId = "implementation" | "systems" | "craft";

export interface Flavor {
  id: FlavorId;
  label: string;
}

// Order here drives the legend order in the visualization.
export const flavors: Flavor[] = [
  { id: "implementation", label: "Implementation" },
  { id: "systems", label: "Systems" },
  { id: "craft", label: "Craft" },
];

export interface TitleEntry {
  id: string;
  title: string;
  gloss: string;
  flavor: FlavorId;
  wants: string[];
}

export const titles: TitleEntry[] = [
  {
    id: "fe-dev",
    title: "Frontend Developer",
    gloss: "The catch-all. Means whatever the company needs it to mean that quarter.",
    flavor: "implementation",
    wants: [
      "Translate Figma mockups into responsive pages",
      "HTML, CSS, JavaScript fundamentals",
      "Consume REST APIs built by the backend team",
      "Cross-browser and mobile testing",
      "Basic performance (image optimization)",
    ],
  },
  {
    id: "fe-eng",
    title: "Frontend Engineer",
    gloss: "Same surface, deeper systems. Quietly becoming ‘fullstack.’",
    flavor: "systems",
    wants: [
      "Architect scalable frontend systems",
      "Complex state management (Redux / Zustand)",
      "Code splitting, lazy loading, bundle analysis",
      "Unit, integration, and E2E test strategy",
      "Increasingly: Node, APIs, infra — i.e. fullstack",
    ],
  },
  {
    id: "ui-eng",
    title: "UI Engineer",
    gloss: "The rare one. Bilingual in design and code. Hard to hire for, harder to keep.",
    flavor: "craft",
    wants: [
      "Interaction quality, motion, the feel of the thing",
      "Accessibility: ARIA, focus order, screen-reader output",
      "Own and evolve the component library",
      "Sit in design reviews and argue easing curves",
      "Ship production code that clears the same gates",
    ],
  },
  {
    id: "design-eng",
    title: "Design Engineer",
    gloss:
      "2024’s hot title. Sometimes means UI engineer; often means ‘full-stack designer who also does Blender.’",
    flavor: "craft",
    wants: [
      "Design in Figma AND design in code",
      "Prototype animations & interactions in the real medium",
      "High polish: no dropped frames, no cross-browser drift",
      "Sometimes: GLSL shaders, 3D, video, copywriting",
      "Own results, not a slice of the process",
    ],
  },
  {
    id: "ux-eng",
    title: "UX Engineer",
    gloss: "Used interchangeably with the three above, depending entirely on who wrote the post.",
    flavor: "craft",
    wants: [
      "Bridge UX research and implementation",
      "Build accessible, tested interface components",
      "Prototype for usability testing",
      "Partner with PMs on interaction details",
      "Effectively: UI engineer with a different hat",
    ],
  },
  {
    id: "swe-fe",
    title: "Software Engineer (Frontend)",
    gloss: "Filed fully under engineering. Evaluated on scope and systems, like everyone else on the team.",
    flavor: "systems",
    wants: [
      "General SWE rigor, applied to the client",
      "System design and architecture review",
      "Promotion path: scope, blast radius, tech leadership",
      "Craft is assumed, not measured",
      "Advancement requires going broader / fullstack",
    ],
  },
];

export type CraftStateId = "full" | "fading" | "shed" | "gone";

export interface CraftState {
  id: CraftStateId;
  label: string;
}

// Order here drives the legend order in the visualization.
export const craftStates: CraftState[] = [
  { id: "full", label: "Craft intact" },
  { id: "fading", label: "Craft starts to count against you" },
  { id: "shed", label: "Craft no longer measured" },
  { id: "gone", label: "Specialty abandoned" },
];

export type LadderTrackId = "eng" | "design";

export interface LadderRung {
  level: string;
  rubric: string;
  craft: CraftStateId;
}

export interface LadderTrack {
  id: LadderTrackId;
  heading: string;
  subhead: string;
  terminal: string;
  // Ordered bottom rung first; the component renders them top-down.
  rungs: LadderRung[];
}

export const ladderTracks: LadderTrack[] = [
  {
    id: "eng",
    heading: "On the engineering team",
    subhead: "Rubric: scope, systems, architecture, force-multiplication.",
    terminal: "Summit: CTO — craft shed somewhere around Senior",
    rungs: [
      { level: "Junior Engineer", rubric: "Executes well-defined tasks with guidance", craft: "full" },
      { level: "Engineer", rubric: "Owns features; writes maintainable code in a larger system", craft: "full" },
      { level: "Senior Engineer", rubric: "Owns systems; handles ambiguous problems independently", craft: "fading" },
      { level: "Staff Engineer", rubric: "Sets technical direction; scope is systems & product areas", craft: "shed" },
      { level: "Principal Engineer", rubric: "Architecture across the org; force multiplier for many teams", craft: "gone" },
      { level: "CTO", rubric: "Owns the entire technical organization & strategy", craft: "gone" },
    ],
  },
  {
    id: "design",
    heading: "On the design team",
    subhead: "Rubric: craft, product thinking, quality of execution, customer insight.",
    terminal: "Summit: CCO / CPO — specialty intact the whole way",
    rungs: [
      { level: "Junior Designer", rubric: "Executes defined design work with guidance", craft: "full" },
      { level: "Designer", rubric: "Owns features; quality of execution from copy to pixels", craft: "full" },
      { level: "Senior Designer", rubric: "Product thinking; solves ambiguous problems with craft", craft: "full" },
      { level: "Staff / Lead Designer", rubric: "Sets design direction; raises the bar for the team’s craft", craft: "full" },
      { level: "Design Director", rubric: "Owns design strategy; leads & grows the design org", craft: "full" },
      { level: "CCO / CPO", rubric: "Owns the product & creative vision at the top table", craft: "full" },
    ],
  },
];
