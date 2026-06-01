"use client";

import { useState } from "react";
import type { ReactElement } from "react";
import { disabilityModels, type DisabilityModelId } from "@/lib/disability-models";

const PANEL_ID = "model-explorer-panel";

export function ModelExplorer(): ReactElement {
  const [activeId, setActiveId] = useState<DisabilityModelId>("medical");
  const active = disabilityModels.find((model) => model.id === activeId) ?? disabilityModels[0];

  return (
    <div className="model-explorer">
      <div aria-label="Models of disability" className="model-list" role="toolbar">
        {disabilityModels.map((model) => {
          const isActive = model.id === activeId;
          return (
            <button
              aria-controls={PANEL_ID}
              aria-pressed={isActive}
              className="model-tab"
              data-model={model.id}
              key={model.id}
              onClick={() => setActiveId(model.id)}
              type="button"
            >
              <span className="model-tab-era">{model.era}</span>
              <span className="model-tab-name">{model.name}</span>
            </button>
          );
        })}
      </div>

      <div
        aria-live="polite"
        className="model-panel"
        data-model={active.id}
        id={PANEL_ID}
      >
        <h3 className="model-panel-title">{active.name}</h3>
        <p className="model-panel-core">{active.core}</p>

        <div className="model-panel-section">
          <span className="model-panel-tag">Language from this era</span>
          <ul className="model-language">
            {active.language.map((word) => (
              <li className="model-language-chip" key={word}>
                {word}
              </li>
            ))}
          </ul>
        </div>

        {active.inTech ? (
          <div className="model-panel-section model-panel-section--tech">
            <span className="model-panel-tag">What this looks like in AI interfaces</span>
            <p className="model-in-tech">{active.inTech}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
