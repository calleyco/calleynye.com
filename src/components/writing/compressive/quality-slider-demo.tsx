"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, ReactElement } from "react";
import {
  buildSourceCanvas,
  encode,
  formatKilobytes,
  revokeIfPresent,
  type CompressiveMime,
  type EncodedImage,
} from "@/lib/compressive-images";
import { useCompressiveSource } from "./source-provider";

const DISPLAY_WIDTH = 360;
const DISPLAY_HEIGHT = 270;
const DEBOUNCE_MS = 60;
const SLIDER_ID = "compressive-quality-slider";

export function QualitySliderDemo(): ReactElement {
  const { image } = useCompressiveSource();
  const [mounted, setMounted] = useState<boolean>(false);
  const [mime, setMime] = useState<CompressiveMime>("image/jpeg");
  const [quality, setQuality] = useState<number>(20);
  const [compressive, setCompressive] = useState<EncodedImage | null>(null);
  const [accepted, setAccepted] = useState<EncodedImage | null>(null);

  const compressiveRef = useRef<EncodedImage | null>(null);
  const acceptedRef = useRef<EncodedImage | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sourceCanvas = useMemo<HTMLCanvasElement | null>(() => {
    if (!mounted) return null;
    return buildSourceCanvas(image, DISPLAY_WIDTH * 2, DISPLAY_HEIGHT * 2);
  }, [mounted, image]);

  const recompute = useCallback(async (): Promise<void> => {
    if (!sourceCanvas) return;
    const [nextCompressive, nextAccepted] = await Promise.all([
      encode(sourceCanvas, DISPLAY_WIDTH * 2, DISPLAY_HEIGHT * 2, mime, quality / 100),
      encode(sourceCanvas, DISPLAY_WIDTH * 2, DISPLAY_HEIGHT * 2, mime, 0.75),
    ]);

    revokeIfPresent(compressiveRef.current);
    revokeIfPresent(acceptedRef.current);
    compressiveRef.current = nextCompressive;
    acceptedRef.current = nextAccepted;
    setCompressive(nextCompressive);
    setAccepted(nextAccepted);
  }, [sourceCanvas, mime, quality]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      void recompute();
    }, DEBOUNCE_MS);
    return () => window.clearTimeout(handle);
  }, [recompute]);

  useEffect(() => {
    return () => {
      revokeIfPresent(compressiveRef.current);
      revokeIfPresent(acceptedRef.current);
    };
  }, []);

  const savings =
    compressive && accepted ? Math.round((1 - compressive.bytes / accepted.bytes) * 100) : 0;
  const ready = compressive !== null && accepted !== null;

  const handleMime = (next: CompressiveMime): void => {
    setMime(next);
  };

  const handleQuality = (event: ChangeEvent<HTMLInputElement>): void => {
    setQuality(Number(event.target.value));
  };

  return (
    <figure className="compressive-card" aria-labelledby="compressive-demo-1-label">
      <figcaption className="compressive-demo-label" id="compressive-demo-1-label">
        Demo 01 — Live encoder: drag the quality down
      </figcaption>

      <div className="compressive-demo-1-grid">
        <div className="compressive-display-column">
          <div
            className="compressive-display-box"
            style={{ width: DISPLAY_WIDTH, height: DISPLAY_HEIGHT }}
          >
            {compressive ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt={`Compressive encoding preview at ${quality} percent quality, scaled into its display box.`}
                height={DISPLAY_HEIGHT}
                src={compressive.url}
                width={DISPLAY_WIDTH}
              />
            ) : (
              <span className="compressive-display-placeholder" aria-hidden="true">
                Encoding…
              </span>
            )}
          </div>
          <p className="compressive-display-caption">
            Shown at {DISPLAY_WIDTH}×{DISPLAY_HEIGHT} — encoded at {DISPLAY_WIDTH * 2}×
            {DISPLAY_HEIGHT * 2}
          </p>
        </div>

        <div className="compressive-controls-column">
          <div aria-label="Image format" className="compressive-pill-row" role="toolbar">
            <button
              aria-pressed={mime === "image/jpeg"}
              className="compressive-pill"
              onClick={() => handleMime("image/jpeg")}
              type="button"
            >
              JPEG
            </button>
            <button
              aria-pressed={mime === "image/webp"}
              className="compressive-pill"
              onClick={() => handleMime("image/webp")}
              type="button"
            >
              WebP
            </button>
          </div>

          <label className="compressive-slider-label" htmlFor={SLIDER_ID}>
            Compression quality:{" "}
            <span className="compressive-slider-value">{quality}%</span>
            <input
              aria-label="Compression quality"
              aria-valuetext={`${quality} percent quality`}
              className="compressive-slider"
              id={SLIDER_ID}
              max={95}
              min={5}
              onChange={handleQuality}
              type="range"
              value={quality}
            />
          </label>

          <div className="compressive-stats">
            <div className="compressive-stat" data-tone="muted">
              <span className="compressive-stat-label">Accepted Retina (@2x @ 75%)</span>
              <span className="compressive-stat-value">
                {accepted ? `${formatKilobytes(accepted.bytes)} KB` : "…"}
              </span>
            </div>
            <div className="compressive-stat" data-tone="accent">
              <span className="compressive-stat-label">
                Compressive (@2x @ {quality}%)
              </span>
              <span className="compressive-stat-value">
                {compressive ? `${formatKilobytes(compressive.bytes)} KB` : "…"}
              </span>
            </div>
            <output
              aria-live="polite"
              className="compressive-readout"
              data-tone={savings > 0 ? "good" : "bad"}
              htmlFor={SLIDER_ID}
            >
              {ready
                ? savings > 0
                  ? `${savings}% smaller than the accepted method`
                  : `${Math.abs(savings)}% larger — quality too high to win`
                : "Encoding…"}
            </output>
          </div>

          <p className="compressive-demo-note">
            Every number is encoded live in your browser with{" "}
            <code>canvas.toBlob()</code> — these are real bytes, not asserted figures. Watch the
            file size collapse while the scaled-down image stays sharp.
          </p>
        </div>
      </div>
    </figure>
  );
}
