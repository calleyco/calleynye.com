import fs from "node:fs/promises";
import path from "node:path";
import { load as loadYaml } from "js-yaml";

const writingDirectory = path.join(process.cwd(), "src/content/writing");
const caseStudyDirectory = path.join(process.cwd(), "src/content/case-studies");
const allowedStatuses = new Set(["draft", "review", "published"]);
const publicBlocklist = [
  "stub",
  "placeholder",
  "todo",
  "tbd",
  "pending",
  "replace",
  "will replace",
  "synthetic test",
  "real-photo numbers",
];
const minPublishedWords = 900;
const wordsPerMinute = 200;

function parseMdxSource(filename, source) {
  const frontmatterMatch = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(source);

  if (!frontmatterMatch) {
    return {
      errors: [`${filename}: missing frontmatter`],
      frontmatter: null,
      body: source,
    };
  }

  const loaded = loadYaml(frontmatterMatch[1] ?? "");

  if (!loaded || typeof loaded !== "object" || Array.isArray(loaded)) {
    return {
      errors: [`${filename}: invalid frontmatter`],
      frontmatter: null,
      body: source.slice(frontmatterMatch[0].length),
    };
  }

  return {
    errors: [],
    frontmatter: loaded,
    body: source.slice(frontmatterMatch[0].length),
  };
}

function wordCount(body) {
  return body
    .replace(/<[^>]+>/g, " ")
    .replace(/[{}()[\]`*_#>-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

function normalizeFrontmatterDate(value) {
  if (typeof value === "string") {
    return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null;
  }

  if (value instanceof Date && !Number.isNaN(value.valueOf())) {
    return value.toISOString().slice(0, 10);
  }

  return null;
}

function readingMinutes(readingTime) {
  const match = /^(\d+)\s+min$/.exec(readingTime);
  return match ? Number(match[1]) : null;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function includesBlockedTerm(content, term) {
  const pattern = new RegExp(`(^|[^a-z0-9])${escapeRegExp(term)}($|[^a-z0-9])`, "i");
  return pattern.test(content);
}

function auditFrontmatter(filename, frontmatter) {
  const errors = [];
  const expectedSlug = filename.replace(/\.mdx$/, "");

  if (typeof frontmatter.title !== "string" || frontmatter.title.trim().length === 0) {
    errors.push(`${filename}: title is required`);
  }

  if (typeof frontmatter.slug !== "string" || frontmatter.slug !== expectedSlug) {
    errors.push(`${filename}: slug must match filename \"${expectedSlug}\"`);
  }

  if (typeof frontmatter.description !== "string" || frontmatter.description.trim().length === 0) {
    errors.push(`${filename}: description is required`);
  }

  if (normalizeFrontmatterDate(frontmatter.date) === null) {
    errors.push(`${filename}: date must use YYYY-MM-DD format`);
  }

  if (!Array.isArray(frontmatter.tags) || frontmatter.tags.length === 0 || frontmatter.tags.some((tag) => typeof tag !== "string")) {
    errors.push(`${filename}: tags must be a non-empty string array`);
  }

  if (!allowedStatuses.has(frontmatter.status)) {
    errors.push(`${filename}: status must be draft, review, or published`);
  }

  if (typeof frontmatter.readingTime !== "string" || readingMinutes(frontmatter.readingTime) === null) {
    errors.push(`${filename}: readingTime must use format \"N min\"`);
  }

  return errors;
}

function auditCaseStudyFrontmatter(filename, frontmatter) {
  const errors = [];
  const expectedSlug = filename.replace(/\.mdx$/, "");
  const requiredStrings = ["title", "description", "client", "role", "timeframe"];

  for (const key of requiredStrings) {
    if (typeof frontmatter[key] !== "string" || frontmatter[key].trim().length === 0) {
      errors.push(`${filename}: ${key} is required`);
    }
  }

  if (typeof frontmatter.slug !== "string" || frontmatter.slug !== expectedSlug) {
    errors.push(`${filename}: slug must match filename "${expectedSlug}"`);
  }

  if (!Array.isArray(frontmatter.tags) || frontmatter.tags.length === 0 || frontmatter.tags.some((t) => typeof t !== "string")) {
    errors.push(`${filename}: tags must be a non-empty string array`);
  }

  if (
    !Array.isArray(frontmatter.stats) ||
    frontmatter.stats.length === 0 ||
    frontmatter.stats.some((s) => !s || typeof s.value !== "string" || typeof s.label !== "string")
  ) {
    errors.push(`${filename}: stats must be a non-empty array of { value, label } strings`);
  }

  if (!allowedStatuses.has(frontmatter.status)) {
    errors.push(`${filename}: status must be draft, review, or published`);
  }

  return errors;
}

function auditCaseStudyBody(filename, frontmatter, body) {
  const errors = [];
  if (wordCount(body) === 0) {
    errors.push(`${filename}: body content is required`);
  }
  if (frontmatter.status === "published") {
    const content = `${frontmatter.description}\n${body}`;
    const blockedTerm = publicBlocklist.find((term) => includesBlockedTerm(content, term));
    if (blockedTerm) {
      errors.push(`${filename}: published content contains launch-blocking term "${blockedTerm}"`);
    }
  }
  return errors;
}

function auditBody(filename, frontmatter, body) {
  const errors = [];
  const count = wordCount(body);
  const expectedReadingMinutes = Math.max(1, Math.round(count / wordsPerMinute));
  const actualReadingMinutes = readingMinutes(frontmatter.readingTime);

  if (count === 0) {
    errors.push(`${filename}: body content is required`);
  }

  if (actualReadingMinutes !== null && Math.abs(actualReadingMinutes - expectedReadingMinutes) > 1) {
    errors.push(
      `${filename}: readingTime is ${frontmatter.readingTime}, but ${count} words should be about ${expectedReadingMinutes} min`,
    );
  }

  if (frontmatter.status === "published" && count < minPublishedWords) {
    errors.push(`${filename}: published essays must be at least ${minPublishedWords} words; found ${count}`);
  }

  if (frontmatter.status === "published") {
    const content = `${frontmatter.description}\n${body}`;
    const blockedTerm = publicBlocklist.find((term) => includesBlockedTerm(content, term));

    if (blockedTerm) {
      errors.push(`${filename}: published content contains launch-blocking term \"${blockedTerm}\"`);
    }
  }

  return errors;
}

async function main() {
  const entries = await fs.readdir(writingDirectory, { withFileTypes: true });
  const files = entries.filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"));
  const errors = [];

  for (const file of files) {
    const filePath = path.join(writingDirectory, file.name);
    const source = await fs.readFile(filePath, "utf8");
    const parsed = parseMdxSource(file.name, source);

    errors.push(...parsed.errors);

    if (!parsed.frontmatter) {
      continue;
    }

    errors.push(...auditFrontmatter(file.name, parsed.frontmatter));
    errors.push(...auditBody(file.name, parsed.frontmatter, parsed.body));
  }

  const caseStudyEntries = await fs.readdir(caseStudyDirectory, { withFileTypes: true });
  const caseStudyFiles = caseStudyEntries.filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"));

  for (const file of caseStudyFiles) {
    const source = await fs.readFile(path.join(caseStudyDirectory, file.name), "utf8");
    const parsed = parseMdxSource(file.name, source);
    errors.push(...parsed.errors);
    if (!parsed.frontmatter) {
      continue;
    }
    errors.push(...auditCaseStudyFrontmatter(file.name, parsed.frontmatter));
    errors.push(...auditCaseStudyBody(file.name, parsed.frontmatter, parsed.body));
  }

  if (errors.length > 0) {
    console.error("Content audit failed:");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(`Content audit passed for ${files.length} writing entries and ${caseStudyFiles.length} case studies.`);
}

await main();
