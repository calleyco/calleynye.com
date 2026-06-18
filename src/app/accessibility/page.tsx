import type { ReactElement } from "react";
import styles from "./accessibility.module.scss";

export default function AccessibilityPage(): ReactElement {
  return (
    <main className={`accessibility-page ${styles.accessibilityScope}`} id="main">
      <h1>Accessibility Statement</h1>
      <p>
        This site targets WCAG 2.1 AA conformance. Accessibility is treated as an architectural requirement, not a
        post-release task.
      </p>

      {/*
        TODO(owner): conformance and screen-reader claims are yours to assert.
        Update the language below once you have completed the manual VoiceOver
        and NVDA passes; until then it is written as a target, not a verified
        claim.
      */}
      <h2>Conformance Status</h2>
      <p>
        Target level: WCAG 2.1 AA. Automated checks currently report no axe-core violations on the routes covered by
        the Playwright suite. A full manual conformance audit is still in progress, so AA is the goal this site is built
        toward, not yet an independently verified claim.
      </p>

      <h2>Testing Methods</h2>
      <p>Completed and ongoing:</p>
      <ul>
        <li>Automated auditing with axe-core in Playwright checks on the primary routes</li>
        <li>Manual keyboard-only navigation checks during component review</li>
      </ul>
      <p>Planned before public launch:</p>
      <ul>
        <li>Manual VoiceOver (macOS / iOS) screen reader audit across the primary routes</li>
        <li>Manual NVDA (Windows) screen reader audit across the primary routes</li>
      </ul>

      <h2>Known Limitations</h2>
      <ul>
        <li>
          Manual screen reader audits with VoiceOver and NVDA are not yet complete. Streaming and interactive
          components have been built to expose state to assistive technology, but that behavior has not yet been
          verified end to end with a screen reader.
        </li>
        <li>Automated coverage is limited to the routes currently included in the Playwright suite.</li>
      </ul>

      <h2>Report an Issue</h2>
      <p>
        If you find an accessibility issue, email <a href="mailto:calley.nye@gmail.com">calley.nye@gmail.com</a> with
        the page URL, assistive technology used, and a short reproduction path.
      </p>

      <h2>Last Audit Date</h2>
      <p>June 18, 2026</p>
    </main>
  );
}
