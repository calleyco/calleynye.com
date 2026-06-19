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

export interface ResumeEducation {
  school: string;
  program: string;
  period: string;
}

export const centralThesis =
  "AI-assisted development is the leverage point that finally makes inclusive engineering the path of least resistance rather than the path of most resistance.";

export const speakingEvents: SpeakingEvent[] = [
  {
    event: "JS.LA",
    year: "2015",
    talk: "Conference talk on JavaScript and frontend practice",
  },
  {
    event: "DeveloperWeek",
    year: "2015",
    talk: "Conference speaker",
  },
  {
    event: "Crypto Invest Summit",
    year: "2018",
    talk: "Women of Crypto Track — Marketing Workshop panelist",
  },
  {
    event: "McKinsey — What is a Disability?",
    year: "2022",
    talk: "The five models of disability and their implications for how we build recruiting products",
  },
];

export const resumeSummary =
  "Senior frontend engineer in Los Angeles with 10+ years building consumer products, with a focus on accessibility and UX. I treat accessibility as an architectural decision rather than an end-of-sprint feature, and I bring deep experience in real-time UIs, performance, and design systems. I work primarily in Vue today and am actively shipping React, Next.js, and TypeScript in current client engagements.";

export const resumeItems: ResumeItem[] = [
  {
    role: "Senior Frontend Engineer",
    company: "Calley Co (independent)",
    period: "Mar 2023 - Present",
    summary: "AI-focused product engineering and accessibility engagements for startups, agencies, and e-commerce brands.",
    highlights: [
      "Product designer and lead frontend engineer on a React + Shopify storefront with an AI-powered sizing recommendation system for a national school-uniform supplier.",
      "Led a WCAG 2.1 audit and remediation of a 200+ page agency site — ARIA, semantic HTML, contrast, keyboard navigation — without sacrificing SEO or design.",
    ],
  },
  {
    role: "Senior Software Engineer",
    company: "McKinsey & Company",
    period: "Jun 2021 - Jul 2023",
    summary: "Game-Based Innovations Lab — globally used game-based assessments and leadership training.",
    highlights: [
      "Built a distributed real-time multiplayer experience over WebSockets — globally synchronized shared state, turn-based control, and live drag-and-drop rendered on every player's screen.",
      "Architected the team's Vue 3 + TypeScript component library and design system, with accessibility, performance, and reusability as core requirements.",
    ],
  },
  {
    role: "Expert Frontend Developer (Contract)",
    company: "Milliman",
    period: "Dec 2020 - May 2021",
    summary: "WCAG 2.0 conversion of data-heavy SaaS interfaces from ASP.NET Webforms to MVC.",
    highlights: [
      "Delivered a responsive, WCAG 2.0-compliant overhaul across four codebases and unified them under a new global navigation experience.",
    ],
  },
  {
    role: "Founder & Principal Engineer",
    company: "Syren.io",
    period: "Nov 2011 - Nov 2021",
    summary: "Design, development, and product-strategy consultancy applying lean, empathy-driven design to complex technical problems.",
    highlights: [
      "Delivered frontend and full-stack work across 40+ client engagements, often refactoring large legacy codebases for measurable improvement.",
    ],
  },
  {
    role: "UI Engineer & Co-Founder",
    company: "Popularium (acquired)",
    period: "Feb 2016 - Dec 2018",
    summary: "Storytelling-driven product recommendation platform.",
    highlights: [
      "Built the initial platform end-to-end in Django and established a custom testing and analytics framework that informed product decisions.",
    ],
  },
  {
    role: "UX Developer",
    company: "Crowdrise (acquired by GoFundMe)",
    period: "Sep 2013 - Feb 2016",
    summary: "Charity crowdfunding platform used by many of the world's largest nonprofits.",
    highlights: [
      "Shipped a higher-converting responsive signup flow and established frontend standards in SASS and JavaScript.",
    ],
  },
];

export const resumeEducation: ResumeEducation = {
  school: "Full Sail University",
  program: "Web Design & Development",
  period: "2010 - 2011",
};

export const resumeSkills: SkillGroup[] = [
  {
    group: "Currently shipping",
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "Vue 3 (Composition API)",
      "Shopify (Liquid + Hydrogen)",
      "Tailwind CSS",
      "AI-assisted development workflows",
    ],
  },
  {
    group: "Accessibility",
    items: [
      "WCAG 2.0–2.2 AA remediation",
      "WAI-ARIA patterns",
      "Semantic HTML",
      "Focus & keyboard architecture",
      "Screen reader testing (NVDA, VoiceOver, JAWS)",
      "Accessible live-region patterns",
    ],
  },
  {
    group: "Real-time & streaming UIs",
    items: ["WebSockets", "Shared-state synchronization", "Event-driven architecture", "Multiplayer interactions", "Optimistic UI updates"],
  },
  {
    group: "Performance & design systems",
    items: [
      "Core Web Vitals",
      "Lighthouse auditing",
      "Bundle analysis",
      "Component library architecture",
      "Storybook",
      "Design tokens",
      "Cross-codebase design system unification",
    ],
  },
];
