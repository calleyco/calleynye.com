import Link from "next/link";
import type { ReactElement } from "react";

export function SiteFooter(): ReactElement {
  return (
    <footer className="footer">
      <nav aria-label="Site utilities" className="footer-links">
        <Link href="/accessibility" prefetch={false}>
          Accessibility
        </Link>
        <a href="/resume.pdf">Resume PDF</a>
      </nav>
      <div className="footer-row">
        <span>Copyright 2026 Calley Nye. Built in Los Angeles.</span>
        <span>Keyboard-first, screen-reader tested, motion-aware.</span>
      </div>
    </footer>
  );
}
