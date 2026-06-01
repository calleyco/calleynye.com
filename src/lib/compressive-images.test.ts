import { describe, expect, it } from "vitest";
import { formatKilobytes, isHeicFile } from "@/lib/compressive-images";

describe("formatKilobytes", () => {
  it("rounds to one decimal place", () => {
    expect(formatKilobytes(1024)).toBe("1.0");
    expect(formatKilobytes(1536)).toBe("1.5");
    expect(formatKilobytes(0)).toBe("0.0");
  });

  it("handles sub-kilobyte byte counts", () => {
    expect(formatKilobytes(512)).toBe("0.5");
  });
});

describe("isHeicFile", () => {
  it("detects HEIC by MIME type", () => {
    const file = new File([new Uint8Array(0)], "photo.bin", { type: "image/heic" });
    expect(isHeicFile(file)).toBe(true);
  });

  it("detects HEIF by MIME type", () => {
    const file = new File([new Uint8Array(0)], "photo.bin", { type: "image/heif" });
    expect(isHeicFile(file)).toBe(true);
  });

  it("detects HEIC by extension when MIME is generic", () => {
    const file = new File([new Uint8Array(0)], "photo.heic", { type: "" });
    expect(isHeicFile(file)).toBe(true);
  });

  it("detects HEIF by extension", () => {
    const file = new File([new Uint8Array(0)], "photo.heif", { type: "" });
    expect(isHeicFile(file)).toBe(true);
  });

  it("does not flag JPEG, PNG, or WebP", () => {
    expect(isHeicFile(new File([new Uint8Array(0)], "a.jpg", { type: "image/jpeg" }))).toBe(false);
    expect(isHeicFile(new File([new Uint8Array(0)], "a.png", { type: "image/png" }))).toBe(false);
    expect(isHeicFile(new File([new Uint8Array(0)], "a.webp", { type: "image/webp" }))).toBe(false);
  });
});
