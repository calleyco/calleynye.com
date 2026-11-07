import Link from "next/link";
import { Arrow } from "@/components/ui/arrow";
import type { ReactElement } from "react";
import styles from "./writing/writing.module.scss";

export default function NotFound(): ReactElement {
  return (
    <main className={`article-page ${styles.writingScope}`} id="main">
      <h1 className="section-head">Page not found</h1>
      <p>The page you requested does not exist.</p>
      <Link className="section-link" href="/" prefetch={false}>
        Return home <Arrow />
      </Link>
    </main>
  );
}
