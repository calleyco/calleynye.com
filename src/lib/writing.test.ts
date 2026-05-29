import { describe, expect, it } from "vitest";
import { getAllWritingMeta } from "@/lib/writing";

describe("writing metadata", () => {
  it("returns posts sorted by date descending", async () => {
    const posts = await getAllWritingMeta();

    expect(posts.length).toBeGreaterThan(0);

    for (let index = 1; index < posts.length; index += 1) {
      expect(posts[index - 1].date >= posts[index].date).toBe(true);
    }
  });
});
