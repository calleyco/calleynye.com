import fs from "node:fs/promises";
import path from "node:path";
import { load as loadYaml } from "js-yaml";
import { compileMDX } from "next-mdx-remote/rsc";
import type { ReactElement } from "react";
import { ArticleImage } from "@/components/writing/article-image";
import { DisabilityModelsIllustration } from "@/components/writing/disability-models-illustration";
import { ModelExplorer } from "@/components/writing/model-explorer";
import { ScalingDiagram } from "@/components/writing/scaling-diagram";
import { CanYouTellDemo } from "@/components/writing/compressive/can-you-tell-demo";
import { CompressiveSource } from "@/components/writing/compressive/source-provider";
import { CompressiveUploader } from "@/components/writing/compressive/uploader";
import { DensityShift } from "@/components/writing/compressive/density-shift";
import { FormatBars } from "@/components/writing/compressive/format-bars-demo";
import { NextImagePipelineDemo } from "@/components/writing/compressive/next-image-demo";
import { QualitySliderDemo } from "@/components/writing/compressive/quality-slider-demo";

const mdxComponents = {
  ArticleImage,
  DisabilityModelsIllustration,
  ModelExplorer,
  ScalingDiagram,
  CanYouTellDemo,
  CompressiveSource,
  CompressiveUploader,
  DensityShift,
  FormatBars,
  NextImagePipelineDemo,
  QualitySliderDemo,
};

const writingDirectory = path.join(process.cwd(), "src/content/writing");

export interface WritingFrontmatter {
  title: string;
  slug: string;
  description: string;
  date: string;
  tags: string[];
  readingTime: string;
  status: "draft" | "review" | "published";
}

export interface WritingMeta extends WritingFrontmatter {
  slug: string;
}

export interface WritingPost {
  slug: string;
  frontmatter: WritingFrontmatter;
  content: ReactElement;
}

interface GetWritingBySlugOptions {
  includeUnpublished?: boolean;
}

interface ParsedMdxSource {
  data: Record<string, unknown>;
  content: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseMdxSource(slug: string, source: string): ParsedMdxSource {
  const frontmatterMatch = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(source);

  if (!frontmatterMatch) {
    throw new Error(`Missing frontmatter in ${slug}.mdx`);
  }

  const loaded = loadYaml(frontmatterMatch[1] ?? "");

  if (!isRecord(loaded)) {
    throw new Error(`Invalid frontmatter in ${slug}.mdx`);
  }

  return {
    data: loaded,
    content: source.slice(frontmatterMatch[0].length),
  };
}

function assertFrontmatter(slug: string, data: Record<string, unknown>): WritingFrontmatter {
  const title = data.title;
  const frontmatterSlug = data.slug;
  const description = data.description;
  const date = data.date;
  const tags = data.tags;
  const readingTime = data.readingTime;
  const status = data.status;

  if (
    typeof title !== "string" ||
    typeof frontmatterSlug !== "string" ||
    frontmatterSlug !== slug ||
    typeof description !== "string" ||
    typeof date !== "string" ||
    !Array.isArray(tags) ||
    tags.some((tag) => typeof tag !== "string") ||
    typeof readingTime !== "string" ||
    (status !== "draft" && status !== "review" && status !== "published")
  ) {
    throw new Error(`Invalid frontmatter in ${slug}.mdx`);
  }

  return {
    title,
    slug: frontmatterSlug,
    description,
    date,
    tags,
    readingTime,
    status,
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
      const parsed = parseMdxSource(slug, source);
      const frontmatter = assertFrontmatter(slug, parsed.data);

      return frontmatter;
    }),
  );

  return meta.filter((post) => post.status === "published").sort((left, right) => right.date.localeCompare(left.date));
}

export async function getWritingBySlug(slug: string, options: GetWritingBySlugOptions = {}): Promise<WritingPost | null> {
  const filePath = path.join(writingDirectory, `${slug}.mdx`);

  try {
    const source = await fs.readFile(filePath, "utf8");
    const parsed = parseMdxSource(slug, source);
    const frontmatter = assertFrontmatter(slug, parsed.data);

    if (frontmatter.status !== "published" && options.includeUnpublished !== true) {
      return null;
    }

    const compiled = await compileMDX({
      source: parsed.content,
      components: mdxComponents,
    });

    return {
      slug,
      frontmatter,
      content: compiled.content,
    };
  } catch {
    return null;
  }
}
