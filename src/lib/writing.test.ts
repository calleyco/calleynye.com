import { describe, expect, it } from "vitest";
import { formatWritingDate } from "@/lib/dates";
import { getAllWritingMeta, getWritingBySlug } from "@/lib/writing";
import { isWritingTag, writingTags } from "@/lib/writing-tags";

describe("writing metadata", () => {
  it("returns posts sorted by date descending", async () => {
    const posts = await getAllWritingMeta();

    expect(posts.length).toBeGreaterThan(0);

    for (let index = 1; index < posts.length; index += 1) {
      expect(posts[index - 1].date >= posts[index].date).toBe(true);
    }
  });

  it("returns only published posts for public indexes", async () => {
    const posts = await getAllWritingMeta();

    expect(posts.every((post) => post.status === "published")).toBe(true);
    expect(posts.map((post) => post.slug)).not.toContain("accessibility-as-the-path-of-least-resistance");
    expect(posts.map((post) => post.slug)).not.toContain("live-regions-are-a-real-time-ui-problem");
  });

  it("includes the published compressive essay in public indexes", async () => {
    const posts = await getAllWritingMeta();

    expect(posts.map((post) => post.slug)).toContain("compressive-images-revisited");
  });

  it("does not return draft or review posts by slug", async () => {
    await expect(getWritingBySlug("accessibility-as-the-path-of-least-resistance")).resolves.toBeNull();
    await expect(getWritingBySlug("live-regions-are-a-real-time-ui-problem")).resolves.toBeNull();
  });

  it("returns the published compressive essay by slug without the preview flag", async () => {
    const post = await getWritingBySlug("compressive-images-revisited");

    expect(post?.frontmatter.status).toBe("published");
  });

  it("can load draft posts for local preview", async () => {
    const post = await getWritingBySlug("accessibility-as-the-path-of-least-resistance", { includeUnpublished: true });

    expect(post?.frontmatter.status).toBe("draft");
  });

  it("parses Keystatic-formatted quoted-string frontmatter without timezone drift", async () => {
    const post = await getWritingBySlug("compressive-images-revisited", { includeUnpublished: true });

    expect(post?.frontmatter.date).toBe("2026-05-30");
    expect(post?.frontmatter.status).toBe("published");
  });

  it("publishes the UI-engineer ladder essay", async () => {
    const post = await getWritingBySlug("congratulations-on-your-promotion");

    expect(post?.frontmatter.status).toBe("published");
    expect(post?.frontmatter.title).toMatch(/not a UI engineer anymore/i);
  });

  it("only uses tags from the Keystatic controlled vocabulary", async () => {
    // Regression guard: a tag outside the vocabulary is valid MDX but cannot be
    // rendered in the Keystatic multiselect editor (it throws on open).
    const posts = await getAllWritingMeta();

    for (const post of posts) {
      for (const tag of post.tags) {
        expect(isWritingTag(tag), `"${tag}" in ${post.slug} is not a known tag (${writingTags.join(", ")})`).toBe(
          true,
        );
      }
    }
  });

  it("formats frontmatter dates without timezone drift", () => {
    expect(formatWritingDate("2026-03-14", { year: "numeric", month: "short", day: "numeric" })).toBe("Mar 14, 2026");
  });
});
