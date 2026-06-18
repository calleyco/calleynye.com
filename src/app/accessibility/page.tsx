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

      <h2>Conformance Status</h2>
      <p>
        Target level: WCAG 2.1 AA. Automated checks currently report no axe-core violations on the primary launch
        routes covered by Playwright.
      </p>

      <h2>Testing Methods</h2>
      <ul>
        <li>Automated auditing with axe-core in Playwright checks</li>
        <li>Manual keyboard-only navigation checks during component review</li>
        <li>Manual VoiceOver and NVDA checks before final public launch</li>
      </ul>

      <h2>Known Limitations</h2>
      <ul>
        <li>No known automated axe-core violations on the primary launch routes</li>
        <li>Cross-device screen reader audits are still part of the final launch checklist</li>
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
