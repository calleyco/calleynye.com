import type { ReactElement } from "react";

export default function AccessibilityPage(): ReactElement {
  return (
    <main className="accessibility-page" id="main">
      <h1>Accessibility Statement</h1>
      <p>
        This site targets WCAG 2.1 AA conformance. Accessibility is treated as an architectural requirement, not a
        post-release task.
      </p>

      <h2>Conformance Status</h2>
      <p>Target level: WCAG 2.1 AA. Current baseline is evaluated continuously during development.</p>

      <h2>Testing Methods</h2>
      <ul>
        <li>Automated auditing with axe-core in Playwright checks</li>
        <li>Manual keyboard-only navigation verification</li>
        <li>Manual screen reader checks using VoiceOver and NVDA</li>
      </ul>

      <h2>Known Limitations</h2>
      <ul>
        <li>No known critical blockers at this time</li>
        <li>Additional cross-device screen reader audits are ongoing while content expands</li>
      </ul>

      <h2>Report an Issue</h2>
      <p>
        If you find an accessibility issue, email <a href="mailto:calley.nye@gmail.com">calley.nye@gmail.com</a> with
        the page URL, assistive technology used, and a short reproduction path.
      </p>

      <h2>Last Audit Date</h2>
      <p>May 7, 2026</p>
    </main>
  );
}
