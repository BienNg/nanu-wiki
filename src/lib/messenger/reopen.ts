import type { MessengerFact, StoredLabel } from "./types";

const STATUS_PINS = new Set(["outcome", "loss_reason", "resume_on"]);

/**
 * A lost person who writes again is a lead again. When their message is newer than the last label,
 * the hand-set Status Verloren (and its Grund) is dropped, so the labeler saves the chat as
 * Automatisch and it stays open until a person decides again. Other statuses and pins stay.
 */
export function reopenLost<T extends Pick<StoredLabel, "outcome" | "loss_reason" | "pinned" | "labeled_through" | "resume_on">>(
  previous: T | undefined,
  fact: Pick<MessengerFact, "last_customer_at">,
): T | undefined {
  if (!previous || previous.outcome !== "verloren" || !fact.last_customer_at) return previous;
  if (new Date(fact.last_customer_at).getTime() <= new Date(previous.labeled_through).getTime()) return previous;
  return {
    ...previous,
    outcome: "offen",
    loss_reason: null,
    resume_on: null,
    pinned: (previous.pinned ?? []).filter((field) => !STATUS_PINS.has(field)),
  };
}
