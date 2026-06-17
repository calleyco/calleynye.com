"use client";

/**
 * Simulator controls — rate, jitter, seed, play / stop / reset.
 *
 * Rate and jitter are the brief's primary stress-test knobs: a strategy that
 * is fine at 5 tok/s may flood at 40. The seed lets the operator reproduce a
 * specific stream in the notebook.
 */

import type { ChangeEvent, ReactElement } from "react";
import type { RunState } from "@/lib/lab/live-regions/run-controller";

type Props = {
  rate: number;
  jitter: number;
  seed: number;
  state: RunState;
  onRateChange: (rate: number) => void;
  onJitterChange: (jitter: number) => void;
  onSeedChange: (seed: number) => void;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
};

export function SimulatorControls(props: Props): ReactElement {
  const handleRate = (e: ChangeEvent<HTMLInputElement>): void => {
    props.onRateChange(Number(e.target.value));
  };
  const handleJitter = (e: ChangeEvent<HTMLInputElement>): void => {
    props.onJitterChange(Number(e.target.value));
  };
  const handleSeed = (e: ChangeEvent<HTMLInputElement>): void => {
    const next = Number(e.target.value);
    if (Number.isFinite(next)) props.onSeedChange(next);
  };

  const running = props.state === "running";

  return (
    <section aria-labelledby="lab-controls-head" className="lab-panel lab-controls">
      <h2 className="lab-panel-title" id="lab-controls-head">
        Simulator controls
      </h2>

      <div className="lab-control-grid">
        <label className="lab-control-field" htmlFor="lab-rate">
          <span className="lab-control-label">
            Rate <span className="lab-control-value">{props.rate} tok/s</span>
          </span>
          <input
            aria-label="Token emission rate"
            aria-valuetext={`${props.rate} tokens per second`}
            disabled={running}
            id="lab-rate"
            max={40}
            min={1}
            onChange={handleRate}
            step={1}
            type="range"
            value={props.rate}
          />
        </label>

        <label className="lab-control-field" htmlFor="lab-jitter">
          <span className="lab-control-label">
            Jitter <span className="lab-control-value">{props.jitter.toFixed(2)}</span>
          </span>
          <input
            aria-label="Inter-token jitter"
            aria-valuetext={`Jitter ${props.jitter.toFixed(2)} of base interval`}
            disabled={running}
            id="lab-jitter"
            max={0.9}
            min={0}
            onChange={handleJitter}
            step={0.05}
            type="range"
            value={props.jitter}
          />
        </label>

        <label className="lab-control-field" htmlFor="lab-seed">
          <span className="lab-control-label">Seed</span>
          <input
            aria-label="Pseudo-random seed for reproducible runs"
            disabled={running}
            id="lab-seed"
            inputMode="numeric"
            onChange={handleSeed}
            type="number"
            value={props.seed}
          />
        </label>
      </div>

      <div className="lab-button-row">
        <button
          className="lab-button lab-button-primary"
          disabled={running}
          onClick={props.onStart}
          type="button"
        >
          {props.state === "done" ? "Run again" : "Start run"}
        </button>
        <button
          className="lab-button"
          disabled={!running}
          onClick={props.onStop}
          type="button"
        >
          Stop
        </button>
        <button className="lab-button" onClick={props.onReset} type="button">
          Reset
        </button>
      </div>
    </section>
  );
}
