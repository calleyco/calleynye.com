// Canonical, controlled vocabulary for writing tags.
//
// This is the single source of truth shared by the Keystatic CMS schema
// (keystatic.config.ts) and the content tests. Keystatic enforces it as a
// multiselect option set; a value outside this list is valid MDX but cannot be
// rendered in the CMS editor. Keep this list and any essay frontmatter in sync.
export const writingTags = [
  "Accessibility",
  "AI",
  "Career",
  "Craft",
  "Engineering",
  "Engineering judgment",
  "Images",
  "Performance",
  "Philosophy",
  "Real-time",
] as const;

export type WritingTag = (typeof writingTags)[number];

export function isWritingTag(value: string): value is WritingTag {
  return (writingTags as readonly string[]).includes(value);
}
