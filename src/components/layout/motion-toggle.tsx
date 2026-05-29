"use client";

import { useEffect, useState } from "react";
import type { ReactElement } from "react";

function readStoredMotionPreference(): boolean | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storage = window.localStorage;

  if (!storage || typeof storage.getItem !== "function") {
    return null;
  }

  try {
    const saved = storage.getItem("calley.motion");
    return saved ? saved === "off" : null;
  } catch {
    return null;
  }
}

function writeStoredMotionPreference(isReduced: boolean): void {
  if (typeof window === "undefined") {
    return;
  }

  const storage = window.localStorage;

  if (!storage || typeof storage.setItem !== "function") {
    return;
  }

  try {
    storage.setItem("calley.motion", isReduced ? "off" : "on");
  } catch {
    // Ignore storage failures so motion preferences never break rendering.
  }
}

export function MotionToggle(): ReactElement {
  const [isReduced, setIsReduced] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const savedPreference = readStoredMotionPreference();
    const shouldReduce = savedPreference ?? prefersReduced;

    root.classList.toggle("rm", shouldReduce);
    setIsReduced(shouldReduce);
  }, []);

  const handleToggle = (): void => {
    const next = !isReduced;
    setIsReduced(next);
    document.documentElement.classList.toggle("rm", next);
    writeStoredMotionPreference(next);
  };

  return (
    <button
      aria-pressed={isReduced}
      className="motion-toggle"
      onClick={handleToggle}
      type="button"
      title="Toggle motion"
    >
      <span aria-hidden="true" className="mt-icon">
        {isReduced ? "off" : "on"}
      </span>
      Motion
    </button>
  );
}
