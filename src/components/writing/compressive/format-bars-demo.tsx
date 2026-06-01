"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactElement } from "react";
import {
  buildSourceCanvas,
  encode,
  type CompressiveMime,
  type EncodedImage,
} from "@/lib/compressive-images";
import { useCompressiveSource } from "./source-provider";

const BASE_WIDTH = 400;
const BASE_HEIGHT = 300;

type Density = "2x" | "4x";

interface FormatRow {
  fmt: "JPEG" | "WebP" | "AVIF";
  one: number;
  accepted: number;
  trick: number;
  trick4x: number;
  full4x: number;
  source: "live" | "offline";
}

const FALLBACK_ROWS: FormatRow[] = [
  { fmt: "JPEG", one: 26.3, accepted: 86.6, trick: 34.7, trick4x: 71.9, full4x: 264.0, source: "offline" },
  { fmt: "WebP", one: 21.3, accepted: 60.2, trick: 25.4, trick4x: 67.2, full4x: 157.1, source: "offline" },
];

const AVIF_ROW: FormatRow = {
  fmt: "AVIF",
  one: 23.1,
  accepted: 73.5,
  trick: 20.1,
  trick4x: 51.9,
  full4x: 172.1,
  source: "offline",
};

const QUALITY_TABLE: Record<CompressiveMime, { accepted: number; trick2x: number; trick4x: number }> = {
  "image/jpeg": { accepted: 0.75, trick2x: 0.2, trick4x: 0.1 },
  "image/webp": { accepted: 0.75, trick2x: 0.2, trick4x: 0.18 },
};

function bytesToKilobytes(encoded: EncodedImage | null): number {
  return encoded ? Number((encoded.bytes / 1024).toFixed(1)) : 0;
}

export function FormatBars(): ReactElement {
  const { image } = useCompressiveSource();
  const [mounted, setMounted] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [density, setDensity] = useState<Density>("2x");
  const [liveRows, setLiveRows] = useState<FormatRow[] | null>(null);
  const figureRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const node = figureRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const sourceCanvas = useMemo<HTMLCanvasElement | null>(() => {
    if (!mounted || !visible) return null;
    return buildSourceCanvas(image, BASE_WIDTH * 4, BASE_HEIGHT * 4);
  }, [mounted, visible, image]);

  useEffect(() => {
    if (!sourceCanvas) return;
    let alive = true;
    const produced: EncodedImage[] = [];

    void (async () => {
      const next: FormatRow[] = [];
      for (const [mime, name] of [
        ["image/jpeg", "JPEG"] as const,
        ["image/webp", "WebP"] as const,
      ]) {
        const q = QUALITY_TABLE[mime];
        const enc = async (scale: number, quality: number): Promise<number> => {
          const result = await encode(sourceCanvas, BASE_WIDTH * scale, BASE_HEIGHT * scale, mime, quality);
          if (result) produced.push(result);
          return bytesToKilobytes(result);
        };

        const one = await enc(1, q.accepted);
        const accepted = await enc(2, q.accepted);
        const trick = await enc(2, q.trick2x);
        const trick4x = await enc(4, q.trick4x);
        const full4x = await enc(4, q.accepted);

        next.push({ fmt: name, one, accepted, trick, trick4x, full4x, source: "live" });
      }
      if (alive) {
        setLiveRows(next);
      }
    })();

    return () => {
      alive = false;
      produced.forEach((entry) => URL.revokeObjectURL(entry.url));
    };
  }, [sourceCanvas]);

  const rows = useMemo<FormatRow[]>(() => {
    const base = liveRows ?? FALLBACK_ROWS;
    return [...base, AVIF_ROW];
  }, [liveRows]);

  const is4x = density === "4x";
  const maxValue = Math.max(...rows.map((row) => (is4x ? row.full4x : row.accepted)));

  return (
    <figure
      aria-labelledby="compressive-demo-3-label"
      className="compressive-card compressive-card--wide"
      ref={figureRef}
    >
      <figcaption className="compressive-demo-label" id="compressive-demo-3-label">
        Demo 03 — Does it survive modern formats and densities?
      </figcaption>

      <div aria-label="Display density" className="compressive-pill-row" role="toolbar">
        <button
          aria-pressed={density === "2x"}
          className="compressive-pill"
          onClick={() => setDensity("2x")}
          type="button"
        >
          2× screens
        </button>
        <button
          aria-pressed={density === "4x"}
          className="compressive-pill"
          onClick={() => setDensity("4x")}
          type="button"
        >
          4× screens
        </button>
      </div>

      <div className="compressive-format-rows">
        {rows.map((row) => {
          const trickVal = is4x ? row.trick4x : row.trick;
          const cut = row.accepted > 0 ? Math.round((1 - trickVal / row.accepted) * 100) : 0;
          const vs1x = row.one > 0 ? Math.round((1 - trickVal / row.one) * 100) : 0;
          const labelSuffix =
            row.fmt === "AVIF" ? "measured offline" : liveRows ? "live in your browser" : "from the offline benchmark";
          return (
            <div className="compressive-format-row" key={row.fmt}>
              <div className="compressive-format-row-head">
                <span className="compressive-format-row-name">
                  {row.fmt}
                  <span className="compressive-format-row-source"> — {labelSuffix}</span>
                </span>
                <span
                  className="compressive-format-row-cut"
                  data-tone={cut > 0 ? "good" : "bad"}
                >
                  {cut > 0 ? `−${cut}%` : `+${Math.abs(cut)}%`} vs accepted @2x
                </span>
              </div>
              <div className="compressive-bars">
                <p className="sr-only">
                  {`${row.fmt}: at one x ${row.one} kilobytes, accepted two x ${row.accepted} kilobytes${
                    is4x ? `, naive full quality four x ${row.full4x} kilobytes` : ""
                  }, compressive ${is4x ? "four" : "two"} x ${trickVal} kilobytes.`}
                </p>
                <Bar label="@1x baseline" tone="faint" value={row.one} max={maxValue} visible={visible} />
                <Bar
                  label="Accepted @2x"
                  tone="bad"
                  value={row.accepted}
                  max={maxValue}
                  visible={visible}
                />
                {is4x ? (
                  <Bar
                    label="Full-quality @4x (naive)"
                    tone="bad-soft"
                    value={row.full4x}
                    max={maxValue}
                    visible={visible}
                  />
                ) : null}
                <Bar
                  label={is4x ? "Compressive @4x" : "Compressive @2x"}
                  tone="accent"
                  value={trickVal}
                  max={maxValue}
                  visible={visible}
                />
              </div>
              <p className="compressive-format-row-vs">
                vs the plain @1x baseline:{" "}
                {vs1x > 0 ? (
                  <span data-tone="good">{vs1x}% smaller</span>
                ) : (
                  <span data-tone="bad">{Math.abs(vs1x)}% larger</span>
                )}
              </p>
            </div>
          );
        })}
      </div>

      <div className="compressive-legend">
        <Legend label="@1x baseline (not Retina)" tone="faint" />
        <Legend label="Accepted @2x at full quality" tone="bad" />
        {is4x ? <Legend label="Full-quality @4x (the naive way)" tone="bad-soft" /> : null}
        <Legend
          label={is4x ? "Compressive @4x at low quality" : "Compressive @2x at low quality"}
          tone="accent"
        />
      </div>

      <p className="compressive-demo-note">
        {image
          ? "JPEG and WebP bars are encoded live from your uploaded image; AVIF can't be encoded in-browser, so its row stays at the offline-measured figures. Upload a flatter graphic or a text-heavy image and watch the win shrink — that's the boundary."
          : is4x
            ? "For 4× screens, the naive 'serve a full-quality @4x asset' approach is brutal. A compressive @4x file pushed to lower quality lands competitive with or below the accepted @2x, and AVIF wins outright. The denser the screen, the harder you can compress."
            : "The headline holds in every format: a large cut off the accepted Retina method. The honest part — against a plain @1x image, the win is image-dependent. JPEG and WebP here are computed live; AVIF is offline-measured."}
      </p>
      <p className="compressive-demo-note compressive-demo-note--small">
        Synthetic test image. Real-photo numbers will replace these once measured.
      </p>
    </figure>
  );
}

interface BarProps {
  label: string;
  value: number;
  max: number;
  tone: "faint" | "bad" | "bad-soft" | "accent";
  visible: boolean;
}

function Bar({ label, value, max, tone, visible }: BarProps): ReactElement {
  const widthPercent = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="compressive-bar-row">
      <div className="compressive-bar-track">
        <div
          aria-hidden="true"
          className="compressive-bar-fill"
          data-tone={tone}
          style={{ width: visible ? `${widthPercent}%` : "0%" }}
        />
      </div>
      <span className="compressive-bar-value">{value} KB</span>
      <span className="sr-only">
        {label}: {value} kilobytes
      </span>
    </div>
  );
}

interface LegendProps {
  label: string;
  tone: "faint" | "bad" | "bad-soft" | "accent";
}

function Legend({ label, tone }: LegendProps): ReactElement {
  return (
    <span className="compressive-legend-item">
      <span aria-hidden="true" className="compressive-legend-swatch" data-tone={tone} />
      {label}
    </span>
  );
}
