/**
 * Which of our messages were follow-ups ("Nachfassen"), and whether the person answered them.
 * Worked out from the message history alone, so it also covers chats from before this existed.
 * Shared by the Statistik page (stats over many chats) and the chat pane (a marker per follow-up).
 * No imports: tests/messenger-followup-replies.test.cjs runs this file on its own.
 *
 * A message of ours starts a follow-up when all of these hold (one rule, no state, so the database
 * function messenger_followup_events can work it out the same way):
 * - the person last wrote at least 24h before it,
 * - we had already written after that message of theirs (a late first answer to someone who is
 *   waiting is a slow reply, not a follow-up),
 * - our previous message was either 24h+ before it, or within the person's first 24h of silence
 *   (so the 1st follow-up is measured from their message, while messages within 24h of a late
 *   reply or of a follow-up belong to that reply or follow-up).
 * The 2nd, 3rd… follow-up is the next one before the person writes again.
 * - Answered: the person writes before our next follow-up, at any time. A message of theirs
 *   starts the count again at 1.
 * - A follow-up in which we mention Zalo is marked `zalo`: the person may answer there, so the
 *   stats leave it out. It still counts as a follow-up, so the next one is the 2nd.
 */

export type FollowupMessage = { from_page: boolean; created_time: string; text: string | null };

export type FollowupEvent = {
  /** Time of the first message of this follow-up (ISO). */
  at: string;
  /** 1 for the first follow-up after the person's last message, 2 for the next… */
  nth: number;
  /** Time of the person's answer, null when none came before our next follow-up or until now. */
  answeredAt: string | null;
  /** Seconds from `at` to the answer. */
  answerSeconds: number | null;
  /** We followed up again before any answer. */
  superseded: boolean;
  /** One of its messages mentions Zalo. */
  zalo: boolean;
};

export const FOLLOWUP_GAP_MS = 24 * 60 * 60 * 1000;

const ZALO = /zalo/i;

/** Messages in any order; a chat's follow-ups, oldest first. */
export function findFollowups(messages: FollowupMessage[]): FollowupEvent[] {
  const sorted = [...messages].sort((a, b) => Date.parse(a.created_time) - Date.parse(b.created_time));
  const events: FollowupEvent[] = [];
  let lastCustomer: number | null = null;
  /** Our previous message after the person's last one; null until we wrote since. */
  let lastPage: number | null = null;
  let open: FollowupEvent | null = null;
  let nth = 0;

  for (const m of sorted) {
    const t = Date.parse(m.created_time);
    if (Number.isNaN(t)) continue;
    if (!m.from_page) {
      if (open && !open.answeredAt) {
        open.answeredAt = m.created_time;
        open.answerSeconds = Math.max(0, Math.round((t - Date.parse(open.at)) / 1000));
      }
      open = null;
      nth = 0;
      lastCustomer = t;
      lastPage = null;
      continue;
    }
    const mentionsZalo = !!m.text && ZALO.test(m.text);
    const startsNew =
      lastCustomer !== null &&
      lastPage !== null &&
      t - lastCustomer >= FOLLOWUP_GAP_MS &&
      (t - lastPage >= FOLLOWUP_GAP_MS || lastPage - lastCustomer < FOLLOWUP_GAP_MS);
    if (startsNew) {
      if (open) open.superseded = true;
      nth += 1;
      open = { at: m.created_time, nth, answeredAt: null, answerSeconds: null, superseded: false, zalo: mentionsZalo };
      events.push(open);
    } else if (open && mentionsZalo) {
      open.zalo = true;
    }
    if (lastCustomer !== null) lastPage = t;
  }
  return events;
}
