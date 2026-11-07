"use client";

import { useEffect, useRef, useState, type ReactElement } from "react";

interface CaseStudyVideoProps {
  id: string;
  title: string;
  caption: string;
  place: string;
}

// Lazy, click-to-play YouTube embed. No iframe (and no YouTube tracking) loads
// until the user opts in — keeps Lighthouse high and respects privacy by
// default. On activation, focus moves into the player so keyboard users are not
// dropped back at the top of the page.
export function CaseStudyVideo({ id, title, caption, place }: CaseStudyVideoProps): ReactElement {
  const [active, setActive] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (active && frameRef.current) {
      frameRef.current.focus();
    }
  }, [active]);

  const poster = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

  return (
    <figure className="cs-video">
      <div className="cs-video-frame">
        {active ? (
          <iframe
            ref={frameRef}
            className="cs-video-iframe"
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={`${title} — Crowdrise 24-Hour Impact Project`}
            allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            className="cs-video-play"
            onClick={() => setActive(true)}
            aria-label={`Play video: ${title}`}
            style={{ backgroundImage: `url(${poster})` }}
          >
            <span aria-hidden="true" className="cs-video-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <span aria-hidden="true" className="cs-video-place">
              {place} · 24-Hour Impact Project
            </span>
          </button>
        )}
      </div>
      <figcaption className="cs-video-caption">
        <strong>{title}.</strong> {caption}
      </figcaption>
    </figure>
  );
}
