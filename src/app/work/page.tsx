import type { Metadata } from "next";
import type { ReactElement } from "react";
import { CaseStudyList } from "@/components/work/case-study-list";
import { getAllCaseStudyMeta } from "@/lib/case-studies";
import writingStyles from "../writing/writing.module.scss";
import styles from "./work.module.scss";

export const metadata: Metadata = {
  title: "Selected work | Calley Nye",
  description: "Case studies in prose — real products, real constraints, and what I shipped.",
};

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
      <CaseStudyList headingLevel={2} studies={studies} />
    </main>
  );
}
