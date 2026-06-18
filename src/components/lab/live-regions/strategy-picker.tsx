"use client";

/**
 * Strategy picker.
 *
 * Lists every strategy registered in `strategies/index.ts`. Changing the
 * active strategy auto-resets the run (handled in lab-shell).
 */

import type { ChangeEvent, ReactElement } from "react";
import { STRATEGIES } from "@/lib/lab/live-regions/strategies";

type Props = {
  activeId: string;
  onChange: (id: string) => void;
  disabled?: boolean;
};

export function StrategyPicker({ activeId, onChange, disabled }: Props): ReactElement {
  const active = STRATEGIES.find((s) => s.id === activeId);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    onChange(e.target.value);
  };

  return (
    <section aria-labelledby="lab-picker-head" className="lab-panel lab-picker">
      <h2 className="lab-panel-title" id="lab-picker-head">
        Active strategy
      </h2>
      <label className="lab-control-field" htmlFor="lab-strategy">
        <span className="lab-control-label">Strategy</span>
        {/* eslint-disable-next-line jsx-a11y/no-onchange -- React's onChange fires per change; onBlur would defer until tab-away, wrong UX for a picker that resets the run on selection. */}
        <select
          disabled={disabled}
          id="lab-strategy"
          onChange={handleChange}
          value={activeId}
        >
          {STRATEGIES.map((s) => (
            <option key={`${s.id}-${s.version}`} value={s.id}>
              {s.label} ({s.version})
            </option>
          ))}
        </select>
      </label>
      {active && (
        <>
          <p className="lab-picker-summary">{active.summary}</p>
          {active.notes && <p className="lab-picker-notes">{active.notes}</p>}
        </>
      )}
    </section>
  );
}
