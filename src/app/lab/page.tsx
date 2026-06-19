import Link from "next/link";
import type { Metadata } from "next";
import type { ReactElement } from "react";
import styles from "./lab.module.scss";

export const metadata: Metadata = {
  title: "Lab | Calley Nye",
  description:
    "A collection of research explorations. Each lab is an instrument, not a conclusion.",
};

export default function LabIndexPage(): ReactElement {
  return (
    <main className={`lab-index-page ${styles.labScope}`} id="main">
      <section className="lab-index-hero">
        <h1>
          The <em>lab</em>.
        </h1>
        <p>
          Research explorations. Each lab is an instrument, not a conclusion.
          More will live here over time.
        </p>
      </section>

      <ul className="lab-index-list">
        <li>
          <Link className="lab-index-link" href="/lab/live-regions" prefetch={false}>
            <span className="lab-index-link-title">Live Region Lab</span>
            <span className="lab-index-link-dek">
              A test harness for streaming-announcement strategies.
            </span>
          </Link>
        </li>
      </ul>
    </main>
  );
}
