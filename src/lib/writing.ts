import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import type { ReactElement } from "react";

const writingDirectory = path.join(process.cwd(), "src/content/writing");

export interface WritingFrontmatter {
  title: string;
  description: string;
  date: string;
  tags: string[];
  readingTime: string;
}

export interface WritingMeta extends WritingFrontmatter {
  slug: string;
}

export interface WritingPost {
  slug: string;
  frontmatter: WritingFrontmatter;
  content: ReactElement;
}

function assertFrontmatter(slug: string, data: Record<string, unknown>): WritingFrontmatter {
  const title = data.title;
  const description = data.description;
  const date = data.date;
  const tags = data.tags;
  const readingTime = data.readingTime;

  if (
    typeof title !== "string" ||
    typeof description !== "string" ||
    typeof date !== "string" ||
    !Array.isArray(tags) ||
    tags.some((tag) => typeof tag !== "string") ||
    typeof readingTime !== "string"
  ) {
    throw new Error(`Invalid frontmatter in ${slug}.mdx`);
  }

  return {
    title,
    description,
    date,
    tags,
    readingTime,
  };
}

export async function getAllWritingMeta(): Promise<WritingMeta[]> {
  const entries = await fs.readdir(writingDirectory, { withFileTypes: true });
  const files = entries.filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"));

  const meta = await Promise.all(
    files.map(async (file) => {
      const slug = file.name.replace(/\.mdx$/, "");
      const fullPath = path.join(writingDirectory, file.name);
      const source = await fs.readFile(fullPath, "utf8");
      const parsed = matter(source);
      const frontmatter = assertFrontmatter(slug, parsed.data);

      return {
        slug,
        ...frontmatter,
      };
    }),
  );

  return meta.sort((left, right) => right.date.localeCompare(left.date));
}

export async function getWritingBySlug(slug: string): Promise<WritingPost | null> {
  const filePath = path.join(writingDirectory, `${slug}.mdx`);

  try {
    const source = await fs.readFile(filePath, "utf8");
    const parsed = matter(source);
    const frontmatter = assertFrontmatter(slug, parsed.data);
    const compiled = await compileMDX({ source: parsed.content });

    return {
      slug,
      frontmatter,
      content: compiled.content,
    };
  } catch {
    return null;
  }
}
