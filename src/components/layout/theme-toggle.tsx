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

// Decorative (aria-hidden) icons; the accessible name comes from the .sr-only
// label text below. currentColor lets each icon pick up the segment's color
// (accent/muted/fg) and theme automatically.
const ICONS: Record<ThemePreference, ReactElement> = {
  dark: (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="17"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="17"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  light: (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="17"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="17"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  ),
  system: (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="17"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="17"
    >
      <rect height="14" rx="2" width="20" x="2" y="3" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  ),
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
          {ICONS[option]}
          <span className="sr-only">{LABELS[option]}</span>
        </label>
      ))}
    </fieldset>
  );
}
