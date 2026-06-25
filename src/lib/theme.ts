export type ThemePreference = "light" | "dark" | "system";
export type EffectiveTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "calley.theme";
export const THEME_PREFERENCES: readonly ThemePreference[] = ["dark", "light", "system"];

export function resolveTheme(pref: ThemePreference | null, systemPrefersLight: boolean): EffectiveTheme {
  if (pref === "light") {
    return "light";
  }
  if (pref === "dark") {
    return "dark";
  }
  return systemPrefersLight ? "light" : "dark";
}

export function isThemePreference(value: unknown): value is ThemePreference {
  return value === "light" || value === "dark" || value === "system";
}
