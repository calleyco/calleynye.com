"use client";

import { useState } from "react";
import type { ReactElement } from "react";
import { flavors, titles, type FlavorId } from "@/lib/ui-engineer";

const PANEL_ID = "title-scatter-panel";

const flavorLabel: Record<FlavorId, string> = {
  implementation: "Implementation",
  systems: "Systems",
  craft: "Craft",
};

export function TitleScatter(): ReactElement {
  const [activeId, setActiveId] = useState<string>("ui-eng");
  const active = titles.find((title) => title.id === activeId) ?? titles[0];

  return (
    <figure aria-labelledby="title-scatter-caption" className="title-scatter">
      <span className="compressive-demo-label">One skillset. Six job titles.</span>

      <p className="title-scatter-intro">
        Select a title to see what it actually asks for. These are the real, mutually incompatible
        jobs that all share the word &ldquo;frontend&rdquo; &mdash; or claim to be its successor.
      </p>

      <div
        aria-label="Job titles — select one to see what it asks for"
        className="title-scatter-tabs"
        role="toolbar"
      >
        {titles.map((title) => {
          const isActive = title.id === activeId;
          return (
            <button
              aria-controls={PANEL_ID}
              aria-pressed={isActive}
              className="title-scatter-tab"
              data-flavor={title.flavor}
              key={title.id}
              onClick={() => setActiveId(title.id)}
              type="button"
            >
              {title.title}
            </button>
          );
        })}
      </div>

      <div aria-live="polite" className="title-scatter-panel" data-flavor={active.flavor} id={PANEL_ID}>
        <div className="title-scatter-panel-head">
          <h3 className="title-scatter-panel-title">{active.title}</h3>
          <span className="title-scatter-badge">Mostly {flavorLabel[active.flavor]}</span>
        </div>

        <p className="title-scatter-gloss">{active.gloss}</p>

        <ul className="title-scatter-wants">
          {active.wants.map((want) => (
            <li className="title-scatter-want" key={want}>
              <span aria-hidden="true" className="title-scatter-bullet" />
              {want}
            </li>
          ))}
        </ul>
      </div>

      <div className="title-scatter-legend">
        {flavors.map((flavor) => (
          <span className="title-scatter-legend-item" data-flavor={flavor.id} key={flavor.id}>
            <span aria-hidden="true" className="title-scatter-legend-dot" />
            {flavor.label}
          </span>
        ))}
      </div>

      <figcaption className="title-scatter-caption" id="title-scatter-caption">
        The same person could be hired under any of these titles &mdash; or rejected under all of
        them. Three of the six pull toward craft, two toward systems, one toward pure
        implementation. The label is not describing the work.
      </figcaption>
    </figure>
  );
}
