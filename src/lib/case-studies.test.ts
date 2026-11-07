import { describe, expect, it } from "vitest";
import { compareCaseStudies, getAllCaseStudyMeta, getCaseStudyBySlug } from "@/lib/case-studies";
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

  it("lists studies in their display order, sizing recommender first", async () => {
    const studies = await getAllCaseStudyMeta();
    expect(studies.map((s) => s.slug).slice(0, 2)).toEqual(["ai-sizing-recommender", "fundraise-for-anything"]);
  });

  it("sorts numbered studies first, then unnumbered ones by slug", () => {
    const base = {
      title: "t",
      description: "d",
      client: "c",
      role: "r",
      timeframe: "y",
      tags: [],
      stats: [],
      status: "published" as const,
    };
    const studies = [
      { ...base, slug: "zeta", order: null },
      { ...base, slug: "beta", order: 2 },
      { ...base, slug: "alpha", order: null },
      { ...base, slug: "gamma", order: 1 },
    ];
    expect([...studies].sort(compareCaseStudies).map((s) => s.slug)).toEqual(["gamma", "beta", "alpha", "zeta"]);
  });

  it("returns null for an unknown slug", async () => {
    await expect(getCaseStudyBySlug("does-not-exist")).resolves.toBeNull();
  });
});
