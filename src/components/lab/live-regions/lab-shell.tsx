"use client";

/**
 * Lab shell — the client orchestrator.
 *
 * Owns: active strategy id, simulator config (rate/jitter/seed), the live
 * RunHandle, and the clear-key counter that resets Panel A when a fresh run
 * starts or the strategy changes.
 *
 * Creates exactly one RunHandle and hands it to Panel A and Panel B. Both
 * panels subscribe to the same event stream — the "single source of truth"
 * rule from the brief is enforced by construction.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactElement } from "react";
import { AnnouncementTimeline } from "@/components/lab/live-regions/announcement-timeline";
import { AudioIllustration } from "@/components/lab/live-regions/audio-illustration";
import { FixtureView } from "@/components/lab/live-regions/fixture-view";
import { SimulatorControls } from "@/components/lab/live-regions/simulator-controls";
import { StrategyPicker } from "@/components/lab/live-regions/strategy-picker";
import { FIXTURE_TOKENS } from "@/lib/lab/live-regions/fixture";
import { createRun, type RunHandle, type RunState } from "@/lib/lab/live-regions/run-controller";
import { DEFAULT_STRATEGY_ID, getStrategy } from "@/lib/lab/live-regions/strategies";

export function LabShell(): ReactElement {
  const [strategyId, setStrategyId] = useState<string>(DEFAULT_STRATEGY_ID);
  const [rate, setRate] = useState<number>(8);
  const [jitter, setJitter] = useState<number>(0.3);
  const [seed, setSeed] = useState<number>(1);
  const [runState, setRunState] = useState<RunState>("idle");
  const [clearKey, setClearKey] = useState<number>(0);

  const runRef = useRef<RunHandle | null>(null);
  const [run, setRun] = useState<RunHandle | null>(null);

  const buildRun = useCallback((): RunHandle | null => {
    const strat = getStrategy(strategyId);
    if (!strat) return null;
    const handle = createRun({
      fixture: FIXTURE_TOKENS,
      strategy: strat,
      rate,
      jitter,
      seed,
    });
    handle.subscribeState(setRunState);
    return handle;
  }, [strategyId, rate, jitter, seed]);

  useEffect(() => {
    runRef.current?.reset();
    const next = buildRun();
    runRef.current = next;
    setRun(next);
    setClearKey((k) => k + 1);
    setRunState("idle");
    return () => {
      next?.reset();
    };
  }, [buildRun]);

  const handleStart = (): void => {
    runRef.current?.start();
  };

  const handleStop = (): void => {
    runRef.current?.stop();
  };

  const handleReset = (): void => {
    runRef.current?.reset();
    setClearKey((k) => k + 1);
    setRunState("idle");
  };

  const handleStrategyChange = (id: string): void => {
    setStrategyId(id);
    setClearKey((k) => k + 1);
  };

  const controlsDisabled = useMemo(() => runState === "running", [runState]);

  return (
    <div className="lab-shell">
      <div className="lab-grid">
        <StrategyPicker
          activeId={strategyId}
          disabled={controlsDisabled}
          onChange={handleStrategyChange}
        />
        <SimulatorControls
          jitter={jitter}
          onJitterChange={setJitter}
          onRateChange={setRate}
          onReset={handleReset}
          onSeedChange={setSeed}
          onStart={handleStart}
          onStop={handleStop}
          rate={rate}
          seed={seed}
          state={runState}
        />
      </div>

      <AnnouncementTimeline clearKey={clearKey} run={run} />
      <AudioIllustration run={run} />
      <FixtureView />
    </div>
  );
}
