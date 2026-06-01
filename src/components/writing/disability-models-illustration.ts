import Image from "next/image";
import { createElement } from "react";
import type { ReactElement } from "react";

interface IllustrationPanel {
  alt: string;
  heading: string;
  height: number;
  src: string;
  width: number;
}

const panels: IllustrationPanel[] = [
  {
    heading: "Equality",
    src: "/images/disability-models-equality.jpg",
    width: 1146,
    height: 1772,
    alt: "Three people face a high whiteboard with no assistive devices. Only the tall person can use the board; a shorter person and a wheelchair user cannot reach it.",
  },
  {
    heading: "Accommodation",
    src: "/images/disability-models-accommodation.jpg",
    width: 1146,
    height: 1772,
    alt: "The same high whiteboard remains in place. The shorter person uses a step stool, and the wheelchair user uses an elevated ramp to reach the board.",
  },
  {
    heading: "Inclusivity",
    src: "/images/disability-models-inclusivity.jpg",
    width: 1146,
    height: 1772,
    alt: "Three people use a larger whiteboard that extends lower toward the floor. No one needs a step, platform, or ramp because the board itself is reachable.",
  },
];

export function DisabilityModelsIllustration(): ReactElement {
  return createElement(
    "section",
    {
      "aria-label": "Equality, accommodation, and inclusivity illustration",
      className: "disability-illustration",
    },
    createElement(
      "div",
      { className: "disability-illustration-grid" },
      panels.map((panel) =>
        createElement(
          "article",
          { className: "disability-illustration-panel", key: panel.heading },
          createElement("h3", null, panel.heading),
          createElement(
            "figure",
            null,
            createElement(Image, {
              alt: panel.alt,
              height: panel.height,
              src: panel.src,
              width: panel.width,
            }),
          ),
        ),
      ),
    ),
    createElement(
      "p",
      { className: "disability-illustration-caption" },
      "The goal is not to hand out better boxes forever. The goal is to stop designing environments that require boxes in the first place.",
    ),
  );
}
