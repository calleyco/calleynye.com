import { describe, expect, it } from "vitest";
import { formatWritingDate, getAllWritingMeta, getWritingBySlug } from "@/lib/writing";

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
    expect(posts.map((post) => post.slug)).not.toContain("compressive-images-revisited");
  });

  it("does not return draft or review posts by slug", async () => {
    await expect(getWritingBySlug("accessibility-as-the-path-of-least-resistance")).resolves.toBeNull();
    await expect(getWritingBySlug("compressive-images-revisited")).resolves.toBeNull();
  });

  it("formats frontmatter dates without timezone drift", () => {
    expect(formatWritingDate("2026-03-14", { year: "numeric", month: "short", day: "numeric" })).toBe("Mar 14, 2026");
  });
});
