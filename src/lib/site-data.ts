export interface CaseStudy {
  title: string;
  summary: string;
  impact: string;
}

export interface SpeakingEvent {
  event: string;
  year: string;
  talk: string;
}

export interface ResumeItem {
  role: string;
  company: string;
  period: string;
  details: string;
}

export const centralThesis =
  "AI-assisted development is the leverage point that finally makes inclusive engineering the path of least resistance rather than the path of most resistance.";

export const caseStudies: CaseStudy[] = [
  {
    title: "McKinsey Recruiting Platform",
    summary:
      "Led frontend architecture for multiplayer recruiting simulations with real-time state synchronization over WebSockets.",
    impact:
      "Built interactions that remained robust under high-latency conditions while improving keyboard and screen-reader paths.",
  },
  {
    title: "Milliman Accessibility Program",
    summary:
      "Owned WCAG 2.1 AA remediation and long-term accessibility enablement across product teams.",
    impact:
      "Shifted accessibility from periodic audits to a repeatable engineering workflow with shared components and checklists.",
  },
  {
    title: "Calley Co. Systems Work",
    summary:
      "Designed and implemented component patterns for client platforms balancing speed, performance, and inclusive UX.",
    impact:
      "Reduced rework by aligning design and implementation constraints early through reusable primitives.",
  },
  {
    title: "Crowdrise Consumer Feature",
    summary:
      "Built and shipped a key user-facing feature spanning UX flows and frontend implementation.",
    impact:
      "Feature contributed approximately 20% of business impact at the time, validating end-to-end product thinking.",
  },
];

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

export const resumeItems: ResumeItem[] = [
  {
    role: "Senior Frontend Engineer",
    company: "Independent / Calley Co.",
    period: "2023 - Present",
    details:
      "Deliver accessibility audits, frontend architecture, and AI product integration work for teams shipping production software.",
  },
  {
    role: "Senior Software Engineer",
    company: "McKinsey",
    period: "2021 - 2023",
    details:
      "Built real-time interfaces and advocated for disability-inclusive product decisions in recruiting technology.",
  },
  {
    role: "Frontend Engineer",
    company: "Shopify ecosystem + agency/client teams",
    period: "2015 - 2021",
    details:
      "Shipped consumer-facing experiences, optimized performance, and scaled reusable UI systems.",
  },
];
