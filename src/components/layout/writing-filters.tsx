"use client";

import { useMemo, useState } from "react";
import type { ReactElement } from "react";
import Link from "next/link";
import { formatWritingDate } from "@/lib/dates";
import type { WritingMeta } from "@/lib/writing";

interface WritingFiltersProps {
  posts: WritingMeta[];
}

export function WritingFilters({ posts }: WritingFiltersProps): ReactElement {
  const [activeTag, setActiveTag] = useState<string>("All");

  const tags = useMemo(() => {
    const allTags = posts.flatMap((post) => post.tags);
    return ["All", ...Array.from(new Set(allTags))];
  }, [posts]);

  const visiblePosts = useMemo(() => {
    if (activeTag === "All") {
      return posts;
    }

    return posts.filter((post) => post.tags.includes(activeTag));
  }, [activeTag, posts]);

  return (
    <>
      <div aria-label="Filter writing by tag" className="index-filters" role="toolbar">
        {tags.map((tag) => (
          <button
            aria-pressed={tag === activeTag}
            key={tag}
            onClick={() => setActiveTag(tag)}
            type="button"
          >
            {tag}
          </button>
        ))}
      </div>
      <p aria-live="polite" className="sr-only">
        Showing {visiblePosts.length} {visiblePosts.length === 1 ? "essay" : "essays"}
        {activeTag === "All" ? "" : ` tagged ${activeTag}`}
      </p>
      <ol className="articles">
        {visiblePosts.map((post, index) => (
          <li className="art" key={post.slug}>
            <Link className="art-link" href={`/writing/${post.slug}`}>
              <span aria-hidden="true" className="art-num">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="art-body">
                <h2 className="art-title">{post.title}</h2>
                <p className="art-dek">{post.description}</p>
                <div className="art-meta">
                  <span>{formatWritingDate(post.date, { year: "numeric", month: "short", day: "numeric" })}</span>
                  <span aria-hidden="true">|</span>
                  <span>{post.readingTime}</span>
                  <span aria-hidden="true">|</span>
                  <span>{post.tags.join(" / ")}</span>
                </div>
              </div>
              <span aria-hidden="true" className="art-arrow">
                -&gt;
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </>
  );
}
