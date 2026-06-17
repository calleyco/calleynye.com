/**
 * Strategy registry.
 *
 * Adding a new strategy is two lines:
 *   1. import it here
 *   2. add it to STRATEGIES
 *
 * Versioning rule (load-bearing): never edit a registered strategy in place.
 * Iterate by authoring `<name>.v2.ts` with a new id (e.g. "naive-debounced-v2")
 * and registering it alongside the existing one. WIP attempts must stay
 * replayable so Phase 2 can show "v1 vs v4."
 */

import type { Strategy } from "../types";
import { cancelAndRestartV1 } from "./cancel-and-restart.v1";
import { naiveDebouncedV1 } from "./naive-debounced.v1";
import { queueEverythingV1 } from "./queue-everything.v1";

export const STRATEGIES: ReadonlyArray<Strategy> = [
  cancelAndRestartV1,
  queueEverythingV1,
  naiveDebouncedV1,
];

export function getStrategy(id: string): Strategy | undefined {
  return STRATEGIES.find((s) => s.id === id);
}

export const DEFAULT_STRATEGY_ID: string = cancelAndRestartV1.id;
