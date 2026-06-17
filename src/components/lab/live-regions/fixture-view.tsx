"use client";

/**
 * Fixture view — shows the adversarial source the simulator is streaming.
 *
 * The fixture is the experiment's "stimulus." Showing it on-page (and noting
 * the deliberate sub-word splits and code block) keeps the experiment honest.
 */

import { useState } from "react";
import type { ReactElement } from "react";
import { FIXTURE_TEXT, FIXTURE_TOKENS } from "@/lib/lab/live-regions/fixture";

export function FixtureView(): ReactElement {
  const [showTokens, setShowTokens] = useState(false);

  return (
    <section aria-labelledby="lab-fixture-head" className="lab-panel lab-fixture">
      <header className="lab-panel-head">
        <h2 className="lab-panel-title" id="lab-fixture-head">
          Fixture · the canned response
        </h2>
        <p className="lab-panel-honesty">
          Hand-curated to break naive strategies: multi-sentence prose, an
          em-dash, mid-word splits, a markdown list, and a fenced code block
          streamed symbol-by-symbol. Edit{" "}
          <code>src/lib/lab/live-regions/fixture.ts</code> to add cases.
        </p>
      </header>

      <div className="lab-fixture-toggle">
        <button
          aria-pressed={showTokens}
          className="lab-button"
          onClick={() => setShowTokens((v) => !v)}
          type="button"
        >
          {showTokens ? "Show as text" : "Show token boundaries"}
        </button>
      </div>

      {showTokens ? (
        <ol className="lab-fixture-tokens" aria-label="Fixture tokens in order">
          {FIXTURE_TOKENS.map((t, i) => (
            <li
              className={`lab-fixture-token${t.label ? ` lab-fixture-token-${t.label}` : ""}`}
              key={`fx-${i}`}
            >
              <span className="lab-fixture-token-text">
                {t.text
                  .replace(/\n/g, "\u23ce")
                  .replace(/ /g, "\u00b7")}
              </span>
              {t.label && (
                <span className="lab-fixture-token-label">{t.label}</span>
              )}
            </li>
          ))}
        </ol>
      ) : (
        <pre className="lab-fixture-text">{FIXTURE_TEXT}</pre>
      )}
    </section>
  );
}
