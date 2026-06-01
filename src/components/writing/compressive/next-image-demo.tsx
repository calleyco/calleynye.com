"use client";

import { useState } from "react";
import type { ReactElement } from "react";

type PipelineId = "legacy" | "nextimg";

interface Pipeline {
  id: PipelineId;
  label: string;
  examples: string;
  verdict: string;
  tone: "good" | "accent";
  detail: string;
}

const PIPELINES: Pipeline[] = [
  {
    id: "legacy",
    label: "Legacy / constrained",
    examples: "HTML email · a CMS that rewrites markup · a Shopify theme you can't fully control",
    verdict: "Compressive images win",
    tone: "good",
    detail:
      "No reliable srcset, no format negotiation, often a single fixed asset. One oversized low-quality file is the most robust lever you have — it needs no server, no <picture>, no build step.",
  },
  {
    id: "nextimg",
    label: "next/image pipeline",
    examples: "A greenfield Next.js app using <Image> with automatic optimization",
    verdict: "Let the framework lead — mostly",
    tone: "accent",
    detail:
      "next/image already negotiates AVIF/WebP and generates a srcset per device. Hand-feeding it a pre-compressed oversized asset can double-compress or fight its resizer. Feed it a clean high-quality source and turn the quality prop down instead (e.g. quality={45}) — same perceptual logic, applied through the tool rather than around it.",
  },
];

export function NextImagePipelineDemo(): ReactElement {
  const [activeId, setActiveId] = useState<PipelineId>("legacy");
  const active = PIPELINES.find((entry) => entry.id === activeId) ?? PIPELINES[0];

  return (
    <figure className="compressive-card" aria-labelledby="compressive-demo-4-label">
      <figcaption className="compressive-demo-label" id="compressive-demo-4-label">
        Demo 04 — When does it still earn its place?
      </figcaption>

      <div aria-label="Pipeline" className="compressive-pill-row" role="toolbar">
        {PIPELINES.map((pipeline) => (
          <button
            aria-pressed={pipeline.id === activeId}
            className="compressive-pill"
            key={pipeline.id}
            onClick={() => setActiveId(pipeline.id)}
            type="button"
          >
            {pipeline.label}
          </button>
        ))}
      </div>

      <div
        aria-live="polite"
        className="compressive-next-panel"
        data-tone={active.tone}
      >
        <span className="compressive-next-eyebrow">You&rsquo;re working in</span>
        <p className="compressive-next-examples">{active.examples}</p>
        <span className="compressive-next-verdict" data-tone={active.tone}>
          {active.verdict}
        </span>
        <p className="compressive-next-detail">{active.detail}</p>
      </div>
    </figure>
  );
}
