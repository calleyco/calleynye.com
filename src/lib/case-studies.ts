// src/lib/case-studies.ts
import fs from "node:fs/promises";
import path from "node:path";
import { compileMDX } from "next-mdx-remote/rsc";
import type { ReactElement } from "react";
import { CaseStudyVideo } from "@/components/work/case-study-video";
import { isRecord, parseMdxSource } from "@/lib/mdx-frontmatter";

const mdxComponents = {
  CaseStudyVideo,
};

const caseStudyDirectory = path.join(process.cwd(), "src/content/case-studies");

export interface CaseStudyStat {
  value: string;
  label: string;
}

export interface CaseStudyFrontmatter {
  title: string;
  slug: string;
  description: string;
  client: string;
  role: string;
  timeframe: string;
  tags: string[];
  stats: CaseStudyStat[];
  status: "draft" | "review" | "published";
}

export type CaseStudyMeta = CaseStudyFrontmatter;

export interface CaseStudy {
  slug: string;
  frontmatter: CaseStudyFrontmatter;
  content: ReactElement;
}

interface GetCaseStudyBySlugOptions {
  includeUnpublished?: boolean;
}

function parseStats(value: unknown): CaseStudyStat[] | null {
  if (!Array.isArray(value) || value.length === 0) {
    return null;
  }

  const stats: CaseStudyStat[] = [];
  for (const entry of value) {
    if (!isRecord(entry) || typeof entry.value !== "string" || typeof entry.label !== "string") {
      return null;
    }
    stats.push({ value: entry.value, label: entry.label });
  }
  return stats;
}

function assertFrontmatter(slug: string, data: Record<string, unknown>): CaseStudyFrontmatter {
  const { title, slug: frontmatterSlug, description, client, role, timeframe, tags, status } = data;
  const stats = parseStats(data.stats);

  if (
    typeof title !== "string" ||
    typeof frontmatterSlug !== "string" ||
    frontmatterSlug !== slug ||
    typeof description !== "string" ||
    typeof client !== "string" ||
    typeof role !== "string" ||
    typeof timeframe !== "string" ||
    !Array.isArray(tags) ||
    tags.some((tag) => typeof tag !== "string") ||
    stats === null ||
    (status !== "draft" && status !== "review" && status !== "published")
  ) {
    throw new Error(`Invalid frontmatter in ${slug}.mdx`);
  }

  return { title, slug: frontmatterSlug, description, client, role, timeframe, tags, stats, status };
}

export async function getAllCaseStudyMeta(): Promise<CaseStudyMeta[]> {
  const entries = await fs.readdir(caseStudyDirectory, { withFileTypes: true });
  const files = entries.filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"));

  const meta = await Promise.all(
    files.map(async (file) => {
      const slug = file.name.replace(/\.mdx$/, "");
      const source = await fs.readFile(path.join(caseStudyDirectory, file.name), "utf8");
      const parsed = parseMdxSource(slug, source);
      return assertFrontmatter(slug, parsed.data);
    }),
  );

  return meta.filter((study) => study.status === "published").sort((left, right) => left.slug.localeCompare(right.slug));
}

export async function getCaseStudyBySlug(
  slug: string,
  options: GetCaseStudyBySlugOptions = {},
): Promise<CaseStudy | null> {
  const filePath = path.join(caseStudyDirectory, `${slug}.mdx`);

  try {
    const source = await fs.readFile(filePath, "utf8");
    const parsed = parseMdxSource(slug, source);
    const frontmatter = assertFrontmatter(slug, parsed.data);

    if (frontmatter.status !== "published" && options.includeUnpublished !== true) {
      return null;
    }

    const compiled = await compileMDX({ source: parsed.content, components: mdxComponents });

    return { slug, frontmatter, content: compiled.content };
  } catch {
    return null;
  }
}
