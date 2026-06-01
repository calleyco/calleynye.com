import type { ReactElement } from "react";
import { scalingTiers } from "@/lib/disability-models";

const DIAGRAM_DESCRIPTION =
  "Three tiers of one-handed use in the US: about twenty-five thousand people permanently, two million with a temporary injury at any given time, and seven to ten million who are situationally one-handed at any moment.";

export function ScalingDiagram(): ReactElement {
  return (
    <figure className="scaling-diagram">
      <figcaption className="sr-only">{DIAGRAM_DESCRIPTION}</figcaption>

      <ol className="scaling-tier-list">
        {scalingTiers.map((tier) => (
          <li className="scaling-tier" data-tier={tier.id} key={tier.id}>
            <span
              aria-hidden="true"
              className="scaling-tier-marker"
              style={{ width: `${tier.diameterPx}px`, height: `${tier.diameterPx}px` }}
            />
            <div className="scaling-tier-text">
              <span className="scaling-tier-label">{tier.label}</span>
              <span className="scaling-tier-example">{tier.example}</span>
            </div>
            <span className="scaling-tier-count">{tier.count}</span>
          </li>
        ))}
      </ol>
    </figure>
  );
}
