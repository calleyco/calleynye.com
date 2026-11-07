import type { ReactElement } from "react";

/**
 * Decorative right arrow used after link text ("All work →").
 *
 * Renders a real U+2192 glyph in Geist Sans so it looks the same whether the
 * surrounding text is set in Geist Sans or Geist Mono. Hidden from assistive
 * technology: the link text already says where it goes, and a screen reader
 * would otherwise announce "right arrow" on every link.
 */
export function Arrow(): ReactElement {
  return (
    <span aria-hidden="true" className="arrow-glyph">
      →
    </span>
  );
}
