import { describe, expect, it } from "vitest";
import { caseStudyTags, isCaseStudyTag } from "@/lib/case-study-tags";

describe("case study tags", () => {
  it("exposes a non-empty controlled vocabulary", () => {
    expect(caseStudyTags.length).toBeGreaterThan(0);
  });

  it("recognizes a known tag and rejects an unknown one", () => {
    expect(isCaseStudyTag("Consumer product")).toBe(true);
    expect(isCaseStudyTag("Not A Real Tag")).toBe(false);
  });
});
