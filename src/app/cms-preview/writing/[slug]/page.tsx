import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import { formatWritingDate } from "@/lib/dates";
import { getWritingBySlug } from "@/lib/writing";
import styles from "../../../writing/writing.module.scss";

interface WritingPreviewPageProps {
  params: Promise<{ slug: string }>;
}

export const metadata: Metadata = {
  title: "Writing preview | Calley Nye",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function WritingPreviewPage({ params }: WritingPreviewPageProps): Promise<ReactElement> {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  const { slug } = await params;
  const post = await getWritingBySlug(slug, { includeUnpublished: true });

  if (!post) {
    notFound();
  }

  return (
    <main className={`article-page ${styles.writingScope}`} id="main">
      <Link className="article-back" href="/keystatic">
        &lt;- Back to CMS
      </Link>

      <header className="article-header">
        <div className="article-kicker">
          Preview | {post.frontmatter.status} |{" "}
          {formatWritingDate(post.frontmatter.date, { year: "numeric", month: "long", day: "numeric" })}
        </div>
        <h1 className="article-title">{post.frontmatter.title}</h1>
        <p className="article-dek">{post.frontmatter.description}</p>
        <div className="article-meta">
          <span>{post.frontmatter.readingTime} read</span>
          <span aria-hidden="true">|</span>
          <span>{post.frontmatter.tags.join(" / ")}</span>
        </div>
      </header>

      <article className="article-body">{post.content}</article>
    </main>
  );
}
