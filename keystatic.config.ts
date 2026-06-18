import { collection, config, fields } from "@keystatic/core";

const tagOptions = [
  { label: "Accessibility", value: "Accessibility" },
  { label: "AI", value: "AI" },
  { label: "Career", value: "Career" },
  { label: "Craft", value: "Craft" },
  { label: "Engineering", value: "Engineering" },
  { label: "Engineering judgment", value: "Engineering judgment" },
  { label: "Images", value: "Images" },
  { label: "Performance", value: "Performance" },
  { label: "Philosophy", value: "Philosophy" },
  { label: "Real-time", value: "Real-time" },
] as const;

export default config({
  storage: {
    kind: "local",
  },
  ui: {
    brand: {
      name: "Calley Nye Content",
    },
    navigation: ["writing"],
  },
  collections: {
    writing: collection({
      label: "Writing",
      path: "src/content/writing/*",
      slugField: "slug",
      format: {
        contentField: "content",
      },
      columns: ["title", "status", "date"],
      previewUrl: "/keystatic/preview/writing/{slug}",
      schema: {
        title: fields.text({
          label: "Title",
          validation: { isRequired: true },
        }),
        slug: fields.slug({
          name: {
            label: "Slug",
            validation: {
              pattern: {
                regex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                message: "Use lowercase letters, numbers, and hyphens.",
              },
            },
          },
        }),
        description: fields.text({
          label: "Description",
          multiline: true,
          validation: {
            isRequired: true,
            length: { min: 80, max: 220 },
            pattern: {
              regex: /^(?!.*\b(?:placeholder|stub|todo|tbd)\b).+$/i,
              message: "Descriptions must be publication-ready, not placeholders.",
            },
          },
        }),
        date: fields.date({
          label: "Publication date",
          validation: { isRequired: true },
        }),
        tags: fields.multiselect({
          label: "Tags",
          options: [...tagOptions],
          defaultValue: [],
        }),
        readingTime: fields.text({
          label: "Reading time",
          description: "Use the format \"7 min\". pnpm content:audit validates this against body length.",
          validation: {
            isRequired: true,
            pattern: {
              regex: /^\d+ min$/,
              message: "Use the format \"7 min\".",
            },
          },
        }),
        status: fields.select({
          label: "Publication status",
          options: [
            { label: "Draft", value: "draft" },
            { label: "Review", value: "review" },
            { label: "Published", value: "published" },
          ],
          defaultValue: "draft",
        }),
        reviewNotes: fields.text({
          label: "Private review notes",
          description: "Editorial notes for drafts and reviews. These are stored in frontmatter but never rendered publicly.",
          multiline: true,
        }),
        content: fields.document({
          label: "Content",
          formatting: true,
          dividers: true,
          links: true,
          tables: true,
        }),
      },
    }),
  },
});
