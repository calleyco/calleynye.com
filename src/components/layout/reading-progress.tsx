"use client";

import { useEffect, useState } from "react";
import type { ReactElement } from "react";

export function ReadingProgress(): ReactElement {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = (): void => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (scrollHeight <= 0) {
        setProgress(0);
        return;
      }

      const nextProgress = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
      setProgress(nextProgress);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return (
    <div aria-hidden="true" className="reading-progress-wrapper">
      <div className="reading-progress-bar" style={{ width: `${progress}%` }} />
    </div>
  );
}
