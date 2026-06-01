"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactElement } from "react";

interface DensitySegment {
  label: string;
  pct: number;
  tone: "faint" | "accent";
}

interface DensityEra {
  year: string;
  caption: string;
  segments: DensitySegment[];
}

const ERAS: DensityEra[] = [
  {
    year: "~2015",
    caption: "High-density was a premium exception",
    segments: [
      { label: "Standard (1×)", pct: 70, tone: "faint" },
      { label: "High-density (2×+)", pct: 30, tone: "accent" },
    ],
  },
  {
    year: "2026",
    caption: "High-density is the baseline for most traffic",
    segments: [
      { label: "Standard (1×)", pct: 25, tone: "faint" },
      { label: "High-density (2×+)", pct: 75, tone: "accent" },
    ],
  },
];

export function DensityShift(): ReactElement {
  const [visible, setVisible] = useState<boolean>(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <figure
      aria-labelledby="compressive-density-label"
      className="compressive-card"
      ref={ref}
    >
      <figcaption className="compressive-demo-label" id="compressive-density-label">
        The landscape moved — display density, 2015 → 2026
      </figcaption>

      <div className="compressive-density-grid">
        {ERAS.map((era, eraIndex) => (
          <div className="compressive-density-era" key={era.year}>
            <div className="compressive-density-era-head">
              <span className="compressive-density-year">{era.year}</span>
              <span className="compressive-density-caption">{era.caption}</span>
            </div>
            <p className="sr-only">
              {`${era.year}: ${era.segments
                .map((segment) => `${segment.pct} percent ${segment.label}`)
                .join(", ")}.`}
            </p>
            <div aria-hidden="true" className="compressive-density-bar">
              {era.segments.map((segment, segmentIndex) => (
                <span
                  className="compressive-density-segment"
                  data-tone={segment.tone}
                  key={segment.label}
                  style={{
                    width: visible ? `${segment.pct}%` : "0%",
                    transitionDelay: `${eraIndex * 0.1 + segmentIndex * 0.12}s`,
                  }}
                >
                  {segment.pct >= 20 ? `${segment.pct}%` : ""}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="compressive-legend">
        <span className="compressive-legend-item">
          <span aria-hidden="true" className="compressive-legend-swatch" data-tone="faint" />
          Standard-density (1×) displays
        </span>
        <span className="compressive-legend-item">
          <span aria-hidden="true" className="compressive-legend-swatch" data-tone="accent" />
          High-density (2×, 3×, 4×) displays
        </span>
      </div>

      <p className="compressive-demo-note">
        Illustrative, not a single sourced dataset — density splits vary by region, device class,
        and how you count desktop OS scaling. The direction is the point: in 2015 high-density
        screens were mostly premium iPhones and a few laptops; today nearly every smartphone
        reports a device pixel ratio of 2× or more, and mobile is the majority of web traffic. The
        spare pixels this technique relies on used to be rare. Now they&rsquo;re everywhere.
      </p>
    </figure>
  );
}
