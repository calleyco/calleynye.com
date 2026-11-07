import Image from "next/image";
import type { ReactElement } from "react";

const pairSizes = "(max-width: 720px) 100vw, 600px";

// next-mdx-remote blocks JS expressions in MDX by default, so `width={350}`
// never arrives. Dimensions are written as plain strings (`width="350"`) and
// parsed here.
type Dimension = number | string;

function toPixels(value: Dimension, name: string): number {
  const parsed = typeof value === "number" ? value : Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`Case study image is missing a valid ${name}`);
  }
  return parsed;
}

interface ScreenImageProps {
  src: string;
  alt: string;
  width: Dimension;
  height: Dimension;
}

function ScreenImage({
  src,
  alt,
  width,
  height,
  sizes,
}: ScreenImageProps & { sizes: string }): ReactElement {
  return (
    <div className="cs-ba-frame">
      <Image
        alt={alt}
        height={toPixels(height, "height")}
        sizes={sizes}
        src={src}
        width={toPixels(width, "width")}
      />
    </div>
  );
}

interface BeforeAfterProps {
  caption: string;
  beforeSrc: string;
  beforeAlt: string;
  beforeWidth: Dimension;
  beforeHeight: Dimension;
  afterSrc: string;
  afterAlt: string;
  afterWidth: Dimension;
  afterHeight: Dimension;
}

// Two screenshots of the same screen, side by side on wide viewports and
// stacked on narrow ones. A visible text label (not color alone) tells them
// apart; each image's alt text describes what is on screen, and the shared
// caption says why the change matters.
export function BeforeAfter({
  caption,
  beforeSrc,
  beforeAlt,
  beforeWidth,
  beforeHeight,
  afterSrc,
  afterAlt,
  afterWidth,
  afterHeight,
}: BeforeAfterProps): ReactElement {
  return (
    <figure className="cs-ba">
      <div className="cs-ba-grid">
        <div className="cs-ba-panel cs-ba-panel--before">
          <p className="cs-ba-label">Before</p>
          <ScreenImage alt={beforeAlt} height={beforeHeight} sizes={pairSizes} src={beforeSrc} width={beforeWidth} />
        </div>
        <div className="cs-ba-panel cs-ba-panel--after">
          <p className="cs-ba-label">After</p>
          <ScreenImage alt={afterAlt} height={afterHeight} sizes={pairSizes} src={afterSrc} width={afterWidth} />
        </div>
      </div>
      <figcaption className="cs-ba-caption">{caption}</figcaption>
    </figure>
  );
}

interface CaseStudyScreenProps extends ScreenImageProps {
  caption: string;
}

// A single screenshot in the same frame as BeforeAfter, for screens that had
// no designed "before".
export function CaseStudyScreen({ caption, ...image }: CaseStudyScreenProps): ReactElement {
  return (
    <figure className="cs-ba cs-ba--single">
      <ScreenImage {...image} sizes="(max-width: 720px) 100vw, 780px" />
      <figcaption className="cs-ba-caption">{caption}</figcaption>
    </figure>
  );
}
