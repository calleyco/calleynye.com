import { describe, expect, it } from "vitest";
import { getAllCaseStudyMeta, getCaseStudyBySlug } from "@/lib/case-studies";
import { isCaseStudyTag } from "@/lib/case-study-tags";

describe("case study reader", () => {
  it("returns the published FFA study in public meta", async () => {
    const studies = await getAllCaseStudyMeta();
    expect(studies.map((s) => s.slug)).toContain("fundraise-for-anything");
    expect(studies.every((s) => s.status === "published")).toBe(true);
  });

  it("exposes structured stats and frontmatter on the FFA study", async () => {
    const study = await getCaseStudyBySlug("fundraise-for-anything");
    expect(study?.frontmatter.client).toBe("Crowdrise");
    expect(study?.frontmatter.role).toBe("UX Developer");
    expect(study?.frontmatter.timeframe).toBe("2013–2016");
    expect(study?.frontmatter.stats.length).toBeGreaterThan(0);
    expect(study?.frontmatter.stats[0]).toHaveProperty("value");
    expect(study?.frontmatter.stats[0]).toHaveProperty("label");
  });

  it("only uses tags from the controlled vocabulary", async () => {
    const studies = await getAllCaseStudyMeta();
    for (const study of studies) {
      for (const tag of study.tags) {
        expect(isCaseStudyTag(tag), `"${tag}" in ${study.slug} is not a known tag`).toBe(true);
      }
    }
  });

  it("returns null for an unknown slug", async () => {
    await expect(getCaseStudyBySlug("does-not-exist")).resolves.toBeNull();
  });
});
