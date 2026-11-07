import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import { getCaseStudyBySlug } from "@/lib/case-studies";
import writingStyles from "../../../writing/writing.module.scss";
import styles from "../../../work/work.module.scss";

interface WorkPreviewPageProps {
  params: Promise<{ slug: string }>;
}

export const metadata: Metadata = {
  title: "Case study preview | Calley Nye",
  robots: { index: false, follow: false },
};

export default async function WorkPreviewPage({ params }: WorkPreviewPageProps): Promise<ReactElement> {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  const { slug } = await params;
  const study = await getCaseStudyBySlug(slug, { includeUnpublished: true });
  if (!study) {
    notFound();
  }
  const { frontmatter } = study;

  return (
    <main className={`article-page ${writingStyles.writingScope} ${styles.workScope}`} id="main">
      <Link className="article-back" href="/keystatic">
        &lt;- Back to CMS
      </Link>
      <header className="article-header">
        <div className="article-kicker">
          Preview | {frontmatter.status} | {frontmatter.client} | {frontmatter.timeframe}
        </div>
        <h1 className="article-title">{frontmatter.title}</h1>
        <p className="article-dek">{frontmatter.description}</p>
      </header>
      <article className="article-body">{study.content}</article>
    </main>
  );
}
