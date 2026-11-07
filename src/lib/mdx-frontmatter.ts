// src/lib/mdx-frontmatter.ts
import { load as loadYaml } from "js-yaml";

export interface ParsedMdxSource {
  data: Record<string, unknown>;
  content: string;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseMdxSource(slug: string, source: string): ParsedMdxSource {
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
