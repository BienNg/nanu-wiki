import type { ConversationView } from "./nextAction";
import type { InboxPlace } from "./inboxPlace";
import type { Step } from "./steps";
import type { InboxLabel } from "./thread";

/** What one saved label changes. The list applies this and does not reload. */
export type SavedLabel = {
  conversationId: string;
  /** Chips on the row: Interesse, Niveau, Ort. */
  chips: string[];
  view: ConversationView;
  step: Step | null;
  /** The stored label, so the open chat shows what was saved, including a step worked out from the fields. */
  label: InboxLabel;
  /** Where the chat sat in the inbox before this save (the first save keeps this). */
  prev: InboxPlace;
  next: InboxPlace;
  /** Inbox version after the write, so the next check does not reload the list. */
  inbox: string;
  /** This chat's version after the write. */
  thread: string | null;
};

export type LabelSaveResult = { error?: string; saved?: SavedLabel };
