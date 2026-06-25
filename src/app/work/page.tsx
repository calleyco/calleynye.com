import Link from "next/link";
import type { ReactElement } from "react";
import { getAllCaseStudyMeta } from "@/lib/case-studies";
import writingStyles from "../writing/writing.module.scss";
import styles from "./work.module.scss";

export default async function WorkIndexPage(): Promise<ReactElement> {
  const studies = await getAllCaseStudyMeta();

  return (
    <main className={`index-page ${writingStyles.writingScope} ${styles.workScope}`} id="main">
      <section className="index-hero">
        <h1>
          Selected <em>work</em>.
        </h1>
        <p>Case studies in prose. Each one is a real product, a real constraint, and what I shipped.</p>
      </section>
      <ol className="work-list">
        {studies.map((study) => (
          <li className="work-item" key={study.slug}>
            <Link className="work-link" href={`/work/${study.slug}`} prefetch={false}>
              <span className="work-client">
                {study.client} · {study.timeframe}
              </span>
              <h2 className="work-title">{study.title}</h2>
              <p className="work-dek">{study.description}</p>
            </Link>
          </li>
        ))}
      </ol>
    </main>
  );
}
