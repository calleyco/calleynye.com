import Link from "next/link";
import type { ReactElement } from "react";
import { MotionToggle } from "@/components/layout/motion-toggle";

export function SiteHeader(): ReactElement {
  return (
    <header className="topbar" role="banner">
      <Link aria-label="Calley Nye home" className="brand" href="/" prefetch={false}>
        <span aria-hidden="true" className="brand-mark">
          <span className="bm-dot" />
          <span className="bm-dot" />
          <span className="bm-dot" />
        </span>
        <span className="brand-name">CALLEY NYE</span>
      </Link>
      <nav aria-label="Primary" className="topnav">
        <Link href="/#work" prefetch={false}>
          Work
        </Link>
        <Link href="/#writing" prefetch={false}>
          Writing
        </Link>
        <Link href="/#lab" prefetch={false}>
          Lab
        </Link>
        <Link href="/#speaking" prefetch={false}>
          Speaking
        </Link>
        <Link href="/#resume" prefetch={false}>
          Resume
        </Link>
        <Link href="/#contact" prefetch={false}>
          Contact
        </Link>
      </nav>
      <MotionToggle />
    </header>
  );
}
