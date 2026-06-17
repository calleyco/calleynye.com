import Link from "next/link";
import type { ReactElement } from "react";
import { MotionToggle } from "@/components/layout/motion-toggle";

export function SiteHeader(): ReactElement {
  return (
    <header className="topbar" role="banner">
      <Link aria-label="Calley Nye home" className="brand" href="/">
        <span aria-hidden="true" className="brand-mark">
          <span className="bm-dot" />
          <span className="bm-dot" />
          <span className="bm-dot" />
        </span>
        <span className="brand-name">CALLEY.NYE</span>
      </Link>
      <nav aria-label="Primary" className="topnav">
        <Link href="/#work">Work</Link>
        <Link href="/writing">Writing</Link>
        <Link href="/lab">Lab</Link>
        <Link href="/#speaking">Speaking</Link>
        <Link href="/accessibility">Accessibility</Link>
        <a href="/resume.pdf">Resume PDF</a>
      </nav>
      <MotionToggle />
    </header>
  );
}
