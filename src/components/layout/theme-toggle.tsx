"use client";

import { useEffect, useState, type ReactElement } from "react";
import {
  THEME_PREFERENCES,
  THEME_STORAGE_KEY,
  isThemePreference,
  resolveTheme,
  type ThemePreference,
} from "@/lib/theme";

const LABELS: Record<ThemePreference, string> = {
  dark: "Dark",
  light: "Light",
  system: "System",
};

function readStoredPreference(): ThemePreference {
  if (typeof window === "undefined") {
    return "system";
  }
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isThemePreference(saved) ? saved : "system";
  } catch {
    return "system";
  }
}

function applyPreference(pref: ThemePreference): void {
  const systemPrefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  const effective = resolveTheme(pref, systemPrefersLight);
  const root = document.documentElement;
  root.classList.toggle("light", effective === "light");
  root.style.colorScheme = effective;
}

export function ThemeToggle(): ReactElement {
  // Initialize to "system" so server and first client render agree (no hydration
  // mismatch). The real theme was already applied pre-paint by the layout script;
  // this effect only syncs the control's checked state to the stored preference.
  const [preference, setPreference] = useState<ThemePreference>("system");

  useEffect(() => {
    setPreference(readStoredPreference());
  }, []);

  useEffect(() => {
    if (preference !== "system") {
      return;
    }
    const query = window.matchMedia("(prefers-color-scheme: light)");
    const handleChange = (): void => applyPreference("system");
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, [preference]);

  const handleSelect = (next: ThemePreference): void => {
    setPreference(next);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Ignore storage failures; the theme still applies for this session.
    }
    applyPreference(next);
  };

  return (
    <fieldset className="theme-toggle">
      <legend className="sr-only">Theme</legend>
      {THEME_PREFERENCES.map((option) => (
        <label className="tt-option" htmlFor={`theme-${option}`} key={option}>
          {/* Radio is labeled by its wrapping <label> (htmlFor + id association);
              jsx-a11y/control-has-associated-label does not recognise the wrapping
              pattern for radios hidden via sr-only, but the association is valid. */}
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <input
            checked={preference === option}
            className="sr-only"
            id={`theme-${option}`}
            name="theme"
            onChange={() => handleSelect(option)}
            type="radio"
            value={option}
          />
          {LABELS[option]}
        </label>
      ))}
    </fieldset>
  );
}
