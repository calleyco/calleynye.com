"use client";

/**
 * Panel B — the audio illustration.
 *
 * HONESTY CONSTRAINT (non-negotiable, from the brief):
 * This panel uses the browser's `window.speechSynthesis` to produce audio so
 * a visitor with no screen-reader experience can hear the difference between
 * strategies in five seconds. It is NOT a screen reader, and is NOT proof of
 * NVDA / JAWS / VoiceOver behavior. SpeechSynthesis has its own queueing and
 * interruption quirks that are not identical to assistive-technology engines.
 *
 * This consumer is intentionally dumb: it executes whatever the strategy
 * emits. `announce` → `speak()`. `cancel` → `cancel()`. No buffering, no
 * smoothing, no "be helpful." All sequencing decisions live in the strategy
 * (where they are inspectable in Panel A).
 *
 * Audio is opt-in. Default off, because surprising audio is hostile.
 */

import { useEffect, useRef, useState } from "react";
import type { ReactElement } from "react";
import type { RunHandle } from "@/lib/lab/live-regions/run-controller";
import type { TimestampedEvent } from "@/lib/lab/live-regions/types";

type Props = {
  run: RunHandle | null;
};

type AudioSupport = "unknown" | "supported" | "missing";

export function AudioIllustration({ run }: Props): ReactElement {
  const [enabled, setEnabled] = useState(false);
  const [support, setSupport] = useState<AudioSupport>("unknown");
  const [statusMessage, setStatusMessage] = useState<string>("Audio illustration is off.");
  const enabledRef = useRef(false);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ok = typeof window.speechSynthesis !== "undefined";
    setSupport(ok ? "supported" : "missing");
    return () => {
      if (ok) window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (!run) return;
    const off = run.subscribe((event: TimestampedEvent) => {
      if (!enabledRef.current) return;
      if (typeof window === "undefined") return;
      if (typeof window.speechSynthesis === "undefined") return;

      if (event.kind === "cancel") {
        window.speechSynthesis.cancel();
        return;
      }
      if (event.kind === "announce") {
        const utter = new SpeechSynthesisUtterance(event.text);
        utter.rate = 1.0;
        window.speechSynthesis.speak(utter);
        return;
      }
      // flush: do nothing — let the queue drain naturally.
    });
    return () => {
      off();
    };
  }, [run]);

  const handleToggle = (): void => {
    if (support !== "supported") return;
    const next = !enabled;
    setEnabled(next);
    if (!next && typeof window !== "undefined") {
      window.speechSynthesis.cancel();
    }
    setStatusMessage(
      next
        ? "Audio illustration enabled. The browser will speak strategy events."
        : "Audio illustration disabled.",
    );
  };

  return (
    <section aria-labelledby="lab-audio-head" className="lab-panel lab-audio">
      <header className="lab-panel-head">
        <h2 className="lab-panel-title" id="lab-audio-head">
          Panel B · Audio illustration
        </h2>
        <p className="lab-panel-honesty">
          <strong>What this is:</strong> the browser&rsquo;s{" "}
          <code>window.speechSynthesis</code> reading the same event stream
          Panel A shows, so you can hear the contrast.{" "}
          <strong>What this is not:</strong> a screen reader. NVDA, JAWS, and
          VoiceOver each have their own queueing and interruption behavior;
          this is an illustration, not proof.
        </p>
      </header>

      <div className="lab-audio-controls">
        <button
          aria-pressed={enabled}
          className="lab-button"
          disabled={support !== "supported"}
          onClick={handleToggle}
          type="button"
        >
          {enabled ? "Disable audio illustration" : "Enable audio illustration"}
        </button>
        {support === "missing" && (
          <p className="lab-note">
            This browser does not expose <code>window.speechSynthesis</code>.
            Audio illustration is unavailable; Panel A still works.
          </p>
        )}
      </div>

      <output aria-live="polite" className="sr-only">
        {statusMessage}
      </output>
    </section>
  );
}
