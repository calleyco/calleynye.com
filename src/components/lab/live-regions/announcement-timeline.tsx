"use client";

/**
 * Panel A — the announcement timeline.
 *
 * HONESTY CONSTRAINT (non-negotiable, from the brief):
 * This panel models what THE PAGE HANDS the assistive technology — the live-
 * region mutations and announcement events the page actually controls. It is
 * NOT "what the screen reader says." No web API exposes screen reader output;
 * claiming to show it would be false. Labels here reflect that.
 *
 * Two columns share the same X-axis time:
 *   - Tokens in  (the raw simulator stream)
 *   - Events out (what the active strategy decides to emit)
 *
 * The contrast in row counts between columns IS the lab's central observation
 * for any given strategy.
 */

import { useEffect, useRef, useState } from "react";
import type { ReactElement } from "react";
import type { RunHandle } from "@/lib/lab/live-regions/run-controller";
import type { TimestampedEvent, TokenEvent } from "@/lib/lab/live-regions/types";

type Props = {
  run: RunHandle | null;
  /** Bump this number to clear the timeline (e.g. on reset / strategy change). */
  clearKey: number;
};

function formatTime(ms: number): string {
  return `${(ms / 1000).toFixed(2)}s`;
}

function formatToken(text: string): string {
  return text
    .replace(/\n/g, "\u23ce")
    .replace(/ /g, "\u00b7");
}

export function AnnouncementTimeline({ run, clearKey }: Props): ReactElement {
  const [tokens, setTokens] = useState<TokenEvent[]>([]);
  const [events, setEvents] = useState<TimestampedEvent[]>([]);
  const tokensScrollRef = useRef<HTMLOListElement | null>(null);
  const eventsScrollRef = useRef<HTMLOListElement | null>(null);

  useEffect(() => {
    setTokens([]);
    setEvents([]);
  }, [clearKey]);

  useEffect(() => {
    if (!run) return;
    const offTokens = run.subscribeTokens((t) => {
      setTokens((prev) => [...prev, t]);
    });
    const offEvents = run.subscribe((e) => {
      setEvents((prev) => [...prev, e]);
    });
    return () => {
      offTokens();
      offEvents();
    };
  }, [run]);

  useEffect(() => {
    const el = tokensScrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [tokens.length]);

  useEffect(() => {
    const el = eventsScrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [events.length]);

  const announceCount = events.filter((e) => e.kind === "announce").length;
  const cancelCount = events.filter((e) => e.kind === "cancel").length;
  const flushCount = events.filter((e) => e.kind === "flush").length;

  return (
    <section aria-labelledby="lab-timeline-head" className="lab-panel lab-timeline">
      <header className="lab-panel-head">
        <h2 className="lab-panel-title" id="lab-timeline-head">
          Panel A · Announcement timeline
        </h2>
        <p className="lab-panel-honesty">
          <strong>What this is:</strong> a model of what the page hands the
          assistive technology — the announcement events and live-region
          mutations this page controls.{" "}
          <strong>What this is not:</strong> a record of what a screen reader
          actually says. No browser API exposes that.
        </p>
      </header>

      <dl className="lab-counters" aria-label="Run counters">
        <div>
          <dt>Tokens in</dt>
          <dd>{tokens.length}</dd>
        </div>
        <div>
          <dt>Announce</dt>
          <dd>{announceCount}</dd>
        </div>
        <div>
          <dt>Cancel</dt>
          <dd>{cancelCount}</dd>
        </div>
        <div>
          <dt>Flush</dt>
          <dd>{flushCount}</dd>
        </div>
      </dl>

      <div className="lab-timeline-grid">
        <div className="lab-timeline-column">
          <h3 className="lab-timeline-col-title">Tokens in (simulator)</h3>
          <ol
            aria-label="Tokens emitted by the simulator, oldest first"
            className="lab-timeline-list"
            ref={tokensScrollRef}
          >
            {tokens.map((t) => (
              <li className="lab-timeline-row lab-row-token" key={`tok-${t.index}`}>
                <span className="lab-row-time">{formatTime(t.t)}</span>
                <span className="lab-row-index">#{t.index}</span>
                <span className="lab-row-text">{formatToken(t.token)}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="lab-timeline-column">
          <h3 className="lab-timeline-col-title">Events out (strategy)</h3>
          <ol
            aria-label="Announcement events emitted by the active strategy, oldest first"
            className="lab-timeline-list"
            ref={eventsScrollRef}
          >
            {events.map((e, i) => (
              <li
                className={`lab-timeline-row lab-row-${e.kind}`}
                key={`evt-${i}-${e.id}`}
              >
                <span className="lab-row-time">{formatTime(e.t)}</span>
                <span className="lab-row-kind">{e.kind}</span>
                <span className="lab-row-text">
                  {e.kind === "announce" && formatToken(e.text)}
                  {e.kind === "cancel" && (e.reason ?? "(no reason)")}
                  {e.kind === "flush" && "(end of stream)"}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
