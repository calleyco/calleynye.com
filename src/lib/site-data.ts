export interface SpeakingEvent {
  event: string;
  year: string;
  talk: string;
}

export interface ResumeItem {
  role: string;
  company: string;
  period: string;
  summary: string;
  highlights: string[];
}

export interface SkillGroup {
  group: string;
  items: string[];
}

export const centralThesis =
  "AI-assisted development is the leverage point that finally makes inclusive engineering the path of least resistance rather than the path of most resistance.";

export const speakingEvents: SpeakingEvent[] = [
  {
    event: "JS.LA",
    year: "2015",
    talk: "Frontend architecture and design-engineering collaboration",
  },
  {
    event: "Crypto Invest Summit",
    year: "2018",
    talk: "Design systems under rapid product iteration",
  },
  {
    event: "McKinsey - What is a Disability?",
    year: "2022",
    talk: "Five models of disability and their consequences for product teams",
  },
];

export const resumeSummary =
  "Senior frontend engineer in Los Angeles with 10+ years building user interfaces and 6+ years specializing in accessibility. I work at the seam between design and engineering — interaction quality, design systems, and WCAG-compliant components — and I am extending my primary stack from Vue to React, Next.js, and TypeScript.";

export const resumeItems: ResumeItem[] = [
  {
    role: "Senior Frontend Engineer",
    company: "Independent / Calley Co.",
    period: "2023 - Present",
    summary: "Accessibility audits, frontend architecture, and AI-product integration for teams shipping production software.",
    highlights: [
      "Deliver WCAG 2.1 AA audits and remediation plans, then implement the fixes as reusable, tested components.",
      "Advise teams on making the accessible implementation the lowest-friction one, including AI-assisted workflows.",
    ],
  },
  {
    role: "Senior Software Engineer",
    company: "McKinsey",
    period: "2021 - 2023",
    summary: "Real-time, multiplayer interfaces for recruiting technology, built with inclusive interaction paths.",
    highlights: [
      "Architected multiplayer recruiting simulations with real-time state synchronization over WebSockets, kept robust under high-latency conditions.",
      "Strengthened keyboard and screen-reader paths across the product surface.",
    ],
  },
  {
    role: "Frontend Engineer",
    company: "Shopify ecosystem + agency / client teams",
    period: "2015 - 2021",
    summary: "Consumer-facing experiences, Core Web Vitals work, and reusable UI systems across multiple brands.",
    highlights: [
      "Rolled out a site-wide image-performance technique (compressive images) across Crowdrise, cutting Retina payloads without maintaining a doubled asset pipeline.",
      "Maintained and extended component libraries across multiple Shopify brands.",
    ],
  },
];

export const resumeSkills: SkillGroup[] = [
  { group: "Languages & frameworks", items: ["TypeScript", "JavaScript", "Vue 3", "React", "Next.js"] },
  {
    group: "Craft",
    items: ["Accessibility (WCAG 2.1 AA)", "Design systems", "Interaction & motion", "Real-time / streaming UI"],
  },
  { group: "Performance", items: ["Core Web Vitals", "Bundle analysis", "Image optimization"] },
];
