// Canonical, controlled vocabulary for case-study tags. Single source of truth
// shared by the Keystatic schema (keystatic.config.ts) and content tests.
// Mirrors src/lib/writing-tags.ts. Keep in sync with case-study frontmatter.
export const caseStudyTags = [
  "Responsive architecture",
  "Design systems",
  "Foundation",
  "Legacy PHP",
  "Consumer product",
  "Accessibility",
  "Performance",
  "Real-time",
] as const;

export type CaseStudyTag = (typeof caseStudyTags)[number];

export function isCaseStudyTag(value: string): value is CaseStudyTag {
  return (caseStudyTags as readonly string[]).includes(value);
}
