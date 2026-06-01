"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactElement } from "react";
import {
  buildSourceCanvas,
  encode,
  formatKilobytes,
  revokeIfPresent,
  type EncodedImage,
} from "@/lib/compressive-images";
import { useCompressiveSource } from "./source-provider";

const DISPLAY_WIDTH = 300;
const DISPLAY_HEIGHT = 225;

interface Panel {
  data: EncodedImage | null;
  title: string;
  sub: string;
  tone: "neutral" | "accent";
}

export function CanYouTellDemo(): ReactElement {
  const { image } = useCompressiveSource();
  const [mounted, setMounted] = useState<boolean>(false);
  const [accepted, setAccepted] = useState<EncodedImage | null>(null);
  const [compressive, setCompressive] = useState<EncodedImage | null>(null);
  const [revealed, setRevealed] = useState<boolean>(false);

  const acceptedRef = useRef<EncodedImage | null>(null);
  const compressiveRef = useRef<EncodedImage | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sourceCanvas = useMemo<HTMLCanvasElement | null>(() => {
    if (!mounted) return null;
    return buildSourceCanvas(image, DISPLAY_WIDTH * 2, DISPLAY_HEIGHT * 2);
  }, [mounted, image]);

  useEffect(() => {
    if (!sourceCanvas) return;
    let alive = true;

    void (async () => {
      const [nextAccepted, nextCompressive] = await Promise.all([
        encode(sourceCanvas, DISPLAY_WIDTH * 2, DISPLAY_HEIGHT * 2, "image/jpeg", 0.75),
        encode(sourceCanvas, DISPLAY_WIDTH * 2, DISPLAY_HEIGHT * 2, "image/jpeg", 0.2),
      ]);
      if (!alive) {
        revokeIfPresent(nextAccepted);
        revokeIfPresent(nextCompressive);
        return;
      }
      revokeIfPresent(acceptedRef.current);
      revokeIfPresent(compressiveRef.current);
      acceptedRef.current = nextAccepted;
      compressiveRef.current = nextCompressive;
      setAccepted(nextAccepted);
      setCompressive(nextCompressive);
    })();

    return () => {
      alive = false;
    };
  }, [sourceCanvas]);

  useEffect(() => {
    return () => {
      revokeIfPresent(acceptedRef.current);
      revokeIfPresent(compressiveRef.current);
    };
  }, []);

  const panels: Panel[] = [
    { data: accepted, title: "Accepted Retina", sub: "@2x at 75% quality", tone: "neutral" },
    { data: compressive, title: "Compressive", sub: "@2x at 20% quality", tone: "accent" },
  ];

  return (
    <figure className="compressive-card" aria-labelledby="compressive-demo-2-label">
      <figcaption className="compressive-demo-label" id="compressive-demo-2-label">
        Demo 02 — Can you actually tell?
      </figcaption>

      <div className="compressive-can-you-tell-grid">
        {panels.map((panel) => (
          <div className="compressive-can-you-tell-panel" key={panel.title}>
            <div
              className="compressive-display-box"
              data-revealed={revealed}
              style={{
                width: revealed ? DISPLAY_WIDTH * 2 : DISPLAY_WIDTH,
                height: revealed ? "auto" : DISPLAY_HEIGHT,
              }}
            >
              {panel.data ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt={`${panel.title}, ${
                    revealed ? "shown at full encoded size" : "scaled into display box"
                  }`}
                  src={panel.data.url}
                />
              ) : (
                <span className="compressive-display-placeholder" aria-hidden="true">
                  Encoding…
                </span>
              )}
            </div>
            <div className="compressive-can-you-tell-meta">
              <span className="compressive-can-you-tell-title">{panel.title}</span>
              <span className="compressive-can-you-tell-sub">{panel.sub}</span>
              <span
                className="compressive-can-you-tell-size"
                data-tone={panel.tone}
              >
                {panel.data ? `${formatKilobytes(panel.data.bytes)} KB` : "…"}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="compressive-can-you-tell-actions">
        <button
          aria-pressed={revealed}
          className="compressive-pill"
          onClick={() => setRevealed((value) => !value)}
          type="button"
        >
          {revealed ? "Scale back into the box" : "Reveal at full encoded size"}
        </button>
        <p className="compressive-demo-note">
          At display size they&rsquo;re hard to separate. Hit reveal: the compressive
          version&rsquo;s artifacts appear at 1:1 — then vanish the moment the browser scales it
          back down. That gap is the whole technique.
        </p>
      </div>
    </figure>
  );
}
