import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import { getAllCaseStudyMeta, getCaseStudyBySlug } from "@/lib/case-studies";
// writingScope is a styleless scope marker; carrying it lets the shared
// .article-* chrome (defined under .writingScope) apply to the work pages too.
import writingStyles from "../../writing/writing.module.scss";
import styles from "../work.module.scss";

interface WorkPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const studies = await getAllCaseStudyMeta();
  return studies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: WorkPageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = await getCaseStudyBySlug(slug);
  if (!study) {
    return { title: "Case study not found" };
  }
  return { title: `${study.frontmatter.title} | Calley Nye`, description: study.frontmatter.description };
}

export default async function WorkDetailPage({ params }: WorkPageProps): Promise<ReactElement> {
  const { slug } = await params;
  const study = await getCaseStudyBySlug(slug);
  if (!study) {
    notFound();
  }
  const { frontmatter } = study;

  return (
    <main className={`article-page ${writingStyles.writingScope} ${styles.workScope}`} id="main">
      <Link className="article-back" href="/work" prefetch={false}>
        &lt;- All work
      </Link>

      <header className="article-header">
        <div className="article-kicker">
          Case study | {frontmatter.client} | {frontmatter.timeframe}
        </div>
        <h1 className="article-title">{frontmatter.title}</h1>
        <p className="article-dek">{frontmatter.description}</p>
        <div className="article-meta">
          <span>{frontmatter.role}</span>
          <span aria-hidden="true">|</span>
          <span>{frontmatter.tags.join(" / ")}</span>
        </div>
        <dl className="stat-row">
          {frontmatter.stats.map((stat) => (
            <div className="stat" key={stat.label}>
              <dt className="stat-value">{stat.value}</dt>
              <dd className="stat-label">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </header>

      <article className="article-body">{study.content}</article>
    </main>
  );
}
