/**
 * Naive Villain 2 — Queue-everything ("the lag").
 *
 * Behavior: every token becomes its own announcement. Never cancels. The
 * announcement channel becomes a slowly-draining queue that narrates the
 * past while the visual stream finished long ago.
 *
 * This strategy exists to be perceptibly bad. Do not "fix" it.
 */

import type { AnnouncementEvent, Strategy } from "../types";

let nextSeq = 0;
function nextId(): string {
  nextSeq += 1;
  return `qe-${nextSeq}`;
}

export const queueEverythingV1: Strategy = {
  id: "queue-everything",
  version: "v1",
  label: "Naive — queue-everything",
  summary:
    "Villain 2. Queues every token as its own announcement, never interrupts. Intelligible but stale.",
  notes:
    "Models the other common naive implementation: speak() per update with no cancellation. Utterances pile up.",

  create(_config, emit) {
    return {
      onToken(event) {
        const announce: AnnouncementEvent = {
          kind: "announce",
          id: nextId(),
          text: event.token,
          politeness: "polite",
        };
        emit(announce);
      },

      onStreamEnd() {
        emit({ kind: "flush", id: nextId() });
      },

      reset() {
        // No internal state to clear.
      },
    };
  },
};
