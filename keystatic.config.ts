import { collection, config, fields } from "@keystatic/core";
import { block, wrapper } from "@keystatic/core/content-components";
import { writingTags } from "./src/lib/writing-tags";
import { caseStudyTags } from "./src/lib/case-study-tags";

const tagOptions = writingTags.map((tag) => ({ label: tag, value: tag }));
const caseStudyTagOptions = caseStudyTags.map((tag) => ({ label: tag, value: tag }));

const mdxComponents = {
  div: wrapper({
    label: "Callout",
    schema: {
      className: fields.text({ label: "Class name" }),
      role: fields.text({ label: "ARIA role" }),
    },
    ContentView: ({ children }) => children,
  }),
  CanYouTellDemo: block({
    label: "Can You Tell Demo",
    schema: {},
    ContentView: () => "Can You Tell Demo",
  }),
  CompressiveSource: wrapper({
    label: "Compressive Source",
    schema: {},
    ContentView: ({ children }) => children,
  }),
  CompressiveUploader: block({
    label: "Compressive Uploader",
    schema: {},
    ContentView: () => "Compressive Uploader",
  }),
  DensityShift: block({
    label: "Density Shift Demo",
    schema: {},
    ContentView: () => "Density Shift Demo",
  }),
  DisabilityModelsIllustration: block({
    label: "Disability Models Illustration",
    schema: {},
    ContentView: () => "Disability Models Illustration",
  }),
  FormatBars: block({
    label: "Format Bars Demo",
    schema: {},
    ContentView: () => "Format Bars Demo",
  }),
  ModelExplorer: block({
    label: "Model Explorer",
    schema: {},
    ContentView: () => "Model Explorer",
  }),
  NextImagePipelineDemo: block({
    label: "Next Image Pipeline Demo",
    schema: {},
    ContentView: () => "Next Image Pipeline Demo",
  }),
  QualitySliderDemo: block({
    label: "Quality Slider Demo",
    schema: {},
    ContentView: () => "Quality Slider Demo",
  }),
  ScalingDiagram: block({
    label: "Scaling Diagram",
    schema: {},
    ContentView: () => "Scaling Diagram",
  }),
  TitleScatter: block({
    label: "Title Scatter",
    schema: {},
    ContentView: () => "Title Scatter",
  }),
  TwoLadders: block({
    label: "Two Ladders",
    schema: {},
    ContentView: () => "Two Ladders",
  }),
  CaseStudyVideo: block({
    label: "Case Study Video",
    schema: {
      id: fields.text({ label: "YouTube ID" }),
      title: fields.text({ label: "Title" }),
      caption: fields.text({ label: "Caption", multiline: true }),
      place: fields.text({ label: "Place" }),
    },
    ContentView: () => "Case Study Video",
  }),
};

export default config({
  storage: {
    kind: "local",
  },
  ui: {
    brand: {
      name: "Calley Nye Content",
    },
    navigation: ["writing", "caseStudies"],
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
      previewUrl: "/cms-preview/writing/{slug}",
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
        content: fields.mdx({
          label: "Content",
          components: mdxComponents,
        }),
      },
    }),
    caseStudies: collection({
      label: "Case Studies",
      path: "src/content/case-studies/*",
      slugField: "slug",
      format: { contentField: "content" },
      columns: ["title", "client", "status"],
      previewUrl: "/cms-preview/work/{slug}",
      schema: {
        title: fields.text({ label: "Title", validation: { isRequired: true } }),
        slug: fields.slug({
          name: {
            label: "Slug",
            validation: {
              pattern: { regex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/, message: "Use lowercase letters, numbers, and hyphens." },
            },
          },
        }),
        description: fields.text({
          label: "Description",
          multiline: true,
          validation: {
            isRequired: true,
            length: { min: 80, max: 280 },
            pattern: {
              regex: /^(?!.*\b(?:placeholder|stub|todo|tbd)\b).+$/i,
              message: "Descriptions must be publication-ready, not placeholders.",
            },
          },
        }),
        client: fields.text({ label: "Client", validation: { isRequired: true } }),
        role: fields.text({ label: "Role", validation: { isRequired: true } }),
        timeframe: fields.text({ label: "Timeframe", description: 'e.g. "2013–2016"', validation: { isRequired: true } }),
        tags: fields.multiselect({ label: "Tags", options: [...caseStudyTagOptions], defaultValue: [] }),
        stats: fields.array(
          fields.object({
            value: fields.text({ label: "Value", validation: { isRequired: true } }),
            label: fields.text({ label: "Label", validation: { isRequired: true } }),
          }),
          { label: "Stats", itemLabel: (props) => `${props.fields.value.value} — ${props.fields.label.value}` },
        ),
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
          description: "Editorial notes for drafts and reviews. Stored in frontmatter but never rendered publicly.",
          multiline: true,
        }),
        content: fields.mdx({ label: "Content", components: mdxComponents }),
      },
    }),
  },
});
