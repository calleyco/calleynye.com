import { describe, expect, it } from "vitest";
import { isThemePreference, resolveTheme } from "@/lib/theme";

describe("resolveTheme", () => {
  it("honors explicit light/dark regardless of system preference", () => {
    expect(resolveTheme("light", false)).toBe("light");
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", true)).toBe("dark");
    expect(resolveTheme("dark", false)).toBe("dark");
  });

  it("follows the system preference when set to system or absent", () => {
    expect(resolveTheme("system", true)).toBe("light");
    expect(resolveTheme("system", false)).toBe("dark");
    expect(resolveTheme(null, true)).toBe("light");
    expect(resolveTheme(null, false)).toBe("dark");
  });
});

describe("isThemePreference", () => {
  it("accepts the three valid values and rejects anything else", () => {
    expect(isThemePreference("dark")).toBe(true);
    expect(isThemePreference("light")).toBe(true);
    expect(isThemePreference("system")).toBe(true);
    expect(isThemePreference("blue")).toBe(false);
    expect(isThemePreference(null)).toBe(false);
  });
});
