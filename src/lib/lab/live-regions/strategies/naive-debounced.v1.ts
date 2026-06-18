/**
 * Deliberately-mediocre reference — Naive Debounced.
 *
 * Behavior: buffer tokens, emit the accumulated buffer as one announcement
 * every DEBOUNCE_MS. Never cancels. Flushes on stream end.
 *
 * Purpose: prove the plug-in slot works end-to-end and serve as a worked
 * example of how a new strategy is structured. It is INTENTIONALLY not the
 * answer — it still mangles the code block (no semantic awareness), it still
 * lags slightly (timer-driven, not boundary-driven), and at very low rates it
 * announces single tokens. Replace, don't tune.
 *
 * To iterate, create `naive-debounced.v2.ts` with a new id/version — never
 * edit this file in place. The lab's "WIP attempts stay replayable" rule
 * depends on it.
 */

import type { AnnouncementEvent, Strategy } from "../types";

const DEBOUNCE_MS = 400;

let nextSeq = 0;
function nextId(): string {
  nextSeq += 1;
  return `nd-${nextSeq}`;
}

export const naiveDebouncedV1: Strategy = {
  id: "naive-debounced",
  version: "v1",
  label: "Reference — naive-debounced (400ms)",
  summary:
    "Reference. Buffers tokens, emits the buffer every 400ms. Still mangles the code block. Not the answer.",
  notes:
    "Worked example of the strategy interface. Fixed-interval debounce is a deliberately weak technique chosen because it visibly still has problems. Replace by authoring a new versioned strategy file.",

  create(_config, emit) {
    const buffer: string[] = [];
    let timerId: ReturnType<typeof setTimeout> | null = null;

    function flushBuffer(): void {
      if (buffer.length === 0) return;
      const text = buffer.join("");
      buffer.length = 0;
      const announce: AnnouncementEvent = {
        kind: "announce",
        id: nextId(),
        text,
        politeness: "polite",
      };
      emit(announce);
    }

    function schedule(): void {
      if (timerId !== null) return;
      timerId = setTimeout(() => {
        timerId = null;
        flushBuffer();
      }, DEBOUNCE_MS);
    }

    return {
      onToken(event) {
        buffer.push(event.token);
        schedule();
      },

      onStreamEnd() {
        if (timerId !== null) {
          clearTimeout(timerId);
          timerId = null;
        }
        flushBuffer();
        emit({ kind: "flush", id: nextId() });
      },

      reset() {
        if (timerId !== null) {
          clearTimeout(timerId);
          timerId = null;
        }
        buffer.length = 0;
      },
    };
  },
};
