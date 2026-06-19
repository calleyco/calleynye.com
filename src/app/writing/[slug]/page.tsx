import Link from "next/link";
import type { ReactElement } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { formatWritingDate } from "@/lib/dates";
import { getAllWritingMeta, getWritingBySlug } from "@/lib/writing";
import styles from "../writing.module.scss";

interface WritingPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const posts = await getAllWritingMeta();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: WritingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getWritingBySlug(slug);

  if (!post) {
    return {
      title: "Essay not found",
    };
  }

  return {
    title: `${post.frontmatter.title} | Calley Nye`,
    description: post.frontmatter.description,
  };
}

export default async function WritingPostPage({ params }: WritingPageProps): Promise<ReactElement> {
  const { slug } = await params;
  const post = await getWritingBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className={`article-page ${styles.writingScope}`} id="main">
      <Link className="article-back" href="/writing" prefetch={false}>
        &lt;- Back to index
      </Link>

      <header className="article-header">
        <div className="article-kicker">
          Essay | {formatWritingDate(post.frontmatter.date, { year: "numeric", month: "long", day: "numeric" })}
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
