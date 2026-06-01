import Image from "next/image";
import { createElement } from "react";
import type { ReactElement } from "react";

interface ArticleImageProps {
  alt: string;
  caption: string;
  height: number;
  src: string;
  width: number;
}

export function ArticleImage({
  alt,
  caption,
  height,
  src,
  width,
}: ArticleImageProps): ReactElement {
  return createElement(
    "figure",
    { className: "article-image" },
    createElement(Image, { alt, height, src, width }),
    createElement("figcaption", null, caption),
  );
}
