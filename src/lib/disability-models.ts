export type DisabilityModelId = "eugenics" | "medical" | "charity" | "social" | "justice";

export interface DisabilityModel {
  id: DisabilityModelId;
  name: string;
  era: string;
  core: string;
  language: string[];
  inTech: string | null;
}

export const disabilityModels: DisabilityModel[] = [
  {
    id: "eugenics",
    name: "The eugenics model",
    era: "1880s–1940s",
    core: "People with disabilities are defective and should be eliminated from the population.",
    language: ["unfit", "defective", "inferior", "abnormal"],
    inTech: null,
  },
  {
    id: "medical",
    name: "The medical model",
    era: "1940s–present",
    core: "Disability is a problem in the person's body that needs to be fixed or managed by medicine.",
    language: ["handicapped", "suffering from", "special needs", "wheelchair-bound"],
    inTech:
      "The interface is designed for ‘normal’ users. Accessibility is a retrofit — a compliance checkbox, not a design principle. Screen readers encounter unlabeled buttons. Streaming text has no live regions. The product works, just not for everyone.",
  },
  {
    id: "charity",
    name: "The charity model",
    era: "1950s–present",
    core: "Disabled people deserve our pity and inspiration. Their achievements are remarkable despite their tragic circumstances.",
    language: ["handicapable", "differently abled", "inspiration porn"],
    inTech:
      "Accessibility is treated as a noble cause rather than a design requirement. Companies highlight their accessibility efforts in press releases while their products remain unusable. The ‘accessibility overlay’ industry lives here — a widget badge that says ‘we care’ while the underlying code doesn’t change.",
  },
  {
    id: "social",
    name: "The social model",
    era: "1970s–present",
    core: "People are disabled by barriers in society — attitudes, environments, and institutions — not by their bodies. Remove the barriers, remove the disability.",
    language: ["disabled person", "access requirements", "inclusion", "enabled"],
    inTech:
      "Accessibility is a design constraint from the start. Components are built with keyboard navigation, semantic HTML, and ARIA attributes as architectural decisions, not afterthoughts. But it is still framed as ‘for disabled users’ — a separate concern from the ‘real’ product work.",
  },
  {
    id: "justice",
    name: "The justice model",
    era: "2000s–present",
    core: "Disability is a natural and necessary part of human diversity. We do not need to be cured. We need respect, equality, and access.",
    language: ["intersectionality", "nothing about us without us", "universal design"],
    inTech:
      "There is no separate ‘accessible version.’ The product is designed from the ground up assuming human diversity as the default. A streaming chat interface that works with a screen reader also works better for someone on a slow connection, someone with a migraine, someone holding a baby. Good architecture is inclusive architecture.",
  },
];

export type ScalingTierId = "permanent" | "temporary" | "situational";

export interface ScalingTier {
  id: ScalingTierId;
  label: string;
  example: string;
  count: string;
  diameterPx: number;
}

export const scalingTiers: ScalingTier[] = [
  { id: "permanent", label: "Permanent", example: "Loss of an arm", count: "~25K", diameterPx: 18 },
  { id: "temporary", label: "Temporary", example: "Broken arm", count: "~2M", diameterPx: 38 },
  { id: "situational", label: "Situational", example: "Holding a baby", count: "~7–10M", diameterPx: 64 },
];
