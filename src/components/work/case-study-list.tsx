import Link from "next/link";
import type { ReactElement } from "react";
import type { CaseStudyMeta } from "@/lib/case-studies";
import styles from "./case-study-list.module.scss";

interface CaseStudyListProps {
  studies: CaseStudyMeta[];
  // The home page lists studies under an h2 section heading, so titles are h3;
  // the /work index has its own h1, so titles are h2. Keeps the outline unbroken.
  headingLevel: 2 | 3;
}

// Only the title is the link, so its accessible name is just the title — not
// client, role, years, title and summary run together. The link's ::after is
// stretched over the whole row, so the full row stays clickable.
export function CaseStudyList({ studies, headingLevel }: CaseStudyListProps): ReactElement {
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <ol className={styles.list}>
      {studies.map((study) => (
        <li className={styles.item} key={study.slug}>
          {/* Separator dots are drawn in CSS after each part, so when the line
              wraps a dot ends a line instead of starting one. The {" "} spaces
              keep the text readable for screen readers and copy-paste. */}
          <p className={styles.eyebrow}>
            <span className={styles.part}>{study.client}</span>{" "}
            <span className={styles.part}>{study.role}</span>{" "}
            <span className={`${styles.part} ${styles.years}`}>{study.timeframe}</span>
          </p>
          <Heading className={styles.title}>
            <Link className={styles.link} href={`/work/${study.slug}`} prefetch={false}>
              {study.title}
            </Link>
          </Heading>
          <p className={styles.dek}>{study.description}</p>
          <span aria-hidden="true" className={styles.arrow}>
            -&gt;
          </span>
        </li>
      ))}
    </ol>
  );
}
