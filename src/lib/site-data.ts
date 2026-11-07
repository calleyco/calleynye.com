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

// Hero availability pill. Wording is a placeholder pending Calley's pick.
export const availabilityStatus = "Available — for the right role";

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
  "Design engineer with 10+ years building consumer products, specializing in accessibility since my first engineering role in 2013. I own work from problem diagnosis through shipped interface: finding where a product's premise breaks, designing what people need in order to trust it, and building it in production code. Most recently, I re-scoped an AI recommendation product around what its data could honestly support, and built a Claude-driven design workflow that critiques every component for accessibility and overconfident AI messaging before it ships. Interfaces designed for the hardest conditions end up better for everyone, and AI-assisted development finally makes that the path of least resistance. I ship in React, Next.js, and TypeScript, with deep production experience in Vue 3, real-time UIs, and design systems.";

export const resumeItems: ResumeItem[] = [
  {
    role: "Founder & Design Engineer",
    company: "Calley Co",
    period: "Mar 2023 - Present",
    summary:
      "Independent design and engineering studio building AI-powered products, automation, and accessible interfaces for startups, agencies, and e-commerce brands.",
    highlights: [
      "Re-scoped an AI size-recommendation product for a pre-launch school uniform brand whose local, in-person delivery made every return a costly pickup. Found the existing age-and-weight model had no measurement data behind it, and redesigned around what the data could honestly support: a measurement-first path, a faster estimate path labeled as less accurate, per-product size charts, and a branded measuring tape in every first delivery.",
      "Built and directed a Claude design workflow (three variants per component, automated critique for accessibility, brand voice, and overconfident AI messaging, then refinement) that shipped 9 recommender components. Product-managed an AI size-chart manager that parses supplier PDFs for human review, and specced the returns, exchange, and trade-in flows across customer, driver, and warehouse.",
      "Moving a marketing agency's senior living client sites off site-builder WordPress and an accessibility overlay plugin, onto accessible-by-default static sites built with Claude, versioned in GitHub, and deployed on Cloudflare, reducing clients' ADA lawsuit risk with projected savings of $2,500+/month in hosting and software.",
      "Build Claude-driven automation workflows for agencies and e-commerce brands across product development, merchandising, and content operations.",
      "Accessibility and performance audits and remediation for web products: WCAG 2.1/2.2 AA conformance, Core Web Vitals, and prioritized fixes teams can ship.",
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
      "Tailwind CSS",
      "Cloudflare",
      "Claude Code and AI-assisted design and development workflows",
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
