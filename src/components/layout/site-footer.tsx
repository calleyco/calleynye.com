import type { ReactElement } from "react";

export function SiteFooter(): ReactElement {
  return (
    <footer className="footer">
      <div className="footer-row">
        <span>Copyright 2026 Calley Nye. Built in Los Angeles.</span>
        <span>Keyboard-first, screen-reader tested, motion-aware.</span>
      </div>
    </footer>
  );
}
