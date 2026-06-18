/**
 * Naive Villain 1 — Cancel-and-restart ("the stammer").
 *
 * Behavior: on every token, cancel whatever is in flight and re-announce the
 * entire accumulated buffer from the start. Always current. Never finishes a
 * thought. This is what `speechSynthesis.cancel()` + `speak()` on every update
 * sounds like.
 *
 * This strategy exists to be perceptibly bad. Do not "fix" it.
 */

import type { AnnouncementEvent, Strategy } from "../types";

let nextSeq = 0;
function nextId(): string {
  nextSeq += 1;
  return `car-${nextSeq}`;
}

export const cancelAndRestartV1: Strategy = {
  id: "cancel-and-restart",
  version: "v1",
  label: "Naive — cancel-and-restart",
  summary:
    "Villain 1. Cancels in-flight speech and re-announces the full buffer on every token. Always current, never intelligible.",
  notes:
    "Models the most common naive implementation: speechSynthesis.cancel() followed by a fresh speak() on every stream update.",

  create(_config, emit) {
    const buffer: string[] = [];
    let lastAnnouncementId: string | null = null;

    return {
      onToken(event) {
        buffer.push(event.token);

        if (lastAnnouncementId !== null) {
          const cancel: AnnouncementEvent = {
            kind: "cancel",
            id: lastAnnouncementId,
            reason: "restart-on-token",
          };
          emit(cancel);
        }

        const id = nextId();
        lastAnnouncementId = id;
        const announce: AnnouncementEvent = {
          kind: "announce",
          id,
          text: buffer.join(""),
          politeness: "assertive",
        };
        emit(announce);
      },

      onStreamEnd() {
        emit({ kind: "flush", id: nextId() });
      },

      reset() {
        buffer.length = 0;
        lastAnnouncementId = null;
      },
    };
  },
};
