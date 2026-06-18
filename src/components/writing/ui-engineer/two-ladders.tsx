import type { ReactElement } from "react";
import { craftStates, ladderTracks, type CraftStateId } from "@/lib/ui-engineer";

const craftLabel: Record<CraftStateId, string> = {
  full: "Craft intact",
  fading: "Craft starts to count against you",
  shed: "Craft no longer measured",
  gone: "Specialty abandoned",
};

export function TwoLadders(): ReactElement {
  return (
    <figure aria-labelledby="two-ladders-caption" className="two-ladders">
      <span className="compressive-demo-label">The same person. Two ladders.</span>

      <p className="two-ladders-intro">
        A UI engineer climbs each track. Watch what happens to the specialty &mdash; interface
        craft, accessibility, the feel of the thing &mdash; on the way up. Read each column
        top-down: the summit is the first row.
      </p>

      <div className="two-ladders-grid">
        {ladderTracks.map((track) => (
          <div className="ladder-column" data-track={track.id} key={track.id}>
            <div className="ladder-column-head">
              <h3 className="ladder-column-heading">{track.heading}</h3>
              <p className="ladder-column-subhead">{track.subhead}</p>
            </div>

            <ol className="ladder-rungs">
              {[...track.rungs].reverse().map((rung, index) => {
                const isTop = index === 0;
                return (
                  <li
                    className="ladder-rung"
                    data-craft={rung.craft}
                    data-top={isTop ? "true" : undefined}
                    key={rung.level}
                  >
                    <div className="ladder-rung-head">
                      <span className="ladder-rung-level">{rung.level}</span>
                      <span aria-hidden="true" className="ladder-rung-dot" />
                    </div>
                    <p className="ladder-rung-rubric">{rung.rubric}</p>
                    <p className="ladder-rung-state">{craftLabel[rung.craft]}</p>
                  </li>
                );
              })}
            </ol>

            <p className="ladder-column-terminal">{track.terminal}</p>
          </div>
        ))}
      </div>

      <div className="two-ladders-legend">
        {craftStates.map((state) => (
          <span className="two-ladders-legend-item" data-craft={state.id} key={state.id}>
            <span aria-hidden="true" className="two-ladders-legend-dot" />
            {state.label}
          </span>
        ))}
      </div>

      <figcaption className="two-ladders-caption" id="two-ladders-caption">
        Engineering-ladder language is taken from published career frameworks (scope, systems,
        &ldquo;sets technical direction,&rdquo; force multiplier); design-ladder language from
        published design ladders (craft, product thinking, quality of execution). Same talent, two
        ceilings. On one track, getting better at the surface of the product is the promotion. On
        the other, it&rsquo;s the thing you have to outgrow.
      </figcaption>
    </figure>
  );
}
