import type { ReactElement } from "react";
import { WritingFilters } from "@/components/layout/writing-filters";
import { getAllWritingMeta } from "@/lib/writing";
import styles from "./writing.module.scss";

export default async function WritingIndexPage(): Promise<ReactElement> {
  const posts = await getAllWritingMeta();

  return (
    <main className={`index-page ${styles.writingScope}`} id="main">
      <section className="index-hero">
        <h1>
          The <em>index</em>.
        </h1>
        <p>Everything I have written, most recent first. Filter by topic.</p>
      </section>
      <WritingFilters posts={posts} />
    </main>
  );
}
