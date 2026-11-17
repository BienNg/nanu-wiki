import { FUNNEL_INTEREST, STEPS } from "./steps";

/** Chats with no Interesse yet. */
export const NO_INTEREST = "ohne";
/** The Qualifizieren step: no Interesse, and not Schüler, Zalo, or Kein Lead. */
export const QUALIFY = "qualifizieren";
/**
 * Sprachkurs chats that want a 1-1 class (staff tick it in the label editor). Their Interesse key and filter id:
 * they leave every other list and its counts and show only under this entry. A name search with no filter still finds them.
 */
export const ONE_ON_ONE = "1-1";
/** Chats the Page moved to Zalo. */
export const ZALO = "zalo";

/** The Status menu. Schüler is a funnel step; the others match the stored outcome. */
export const STATUSES = [
  { id: "auto", de: "Automatisch", vi: "Tự động" },
  { id: "kein_lead", de: "Kein Lead", vi: "Không phải khách" },
  { id: "schueler", de: "Schüler", vi: "Học viên" },
  { id: "zalo", de: "Zalo", vi: "Zalo" },
  { id: "verloren", de: "Verloren", vi: "Mất khách" },
] as const;

/** Status filters that are not the Schüler step. */
export const STATUS_FILTERS = ["auto", "kein_lead", "zalo", "verloren"] as const;

const FUNNEL_STEPS = STEPS.filter((s) => s !== "qualifizieren");

export type InboxPlace = {
  interestKey: string;
  /** "1".."5" inside Sprachkurs, otherwise "unklar". */
  stepKey: string;
  open: boolean;
  /** One of STATUSES. */
  status: (typeof STATUSES)[number]["id"];
  /** Something to do now: it shows under "Zu tun". */
  todo: boolean;
};

/** The two lists: what needs doing now (the default), and every chat. URL `?t=alle`. */
export const TABS = ["zu_tun", "alle"] as const;
export type InboxTab = (typeof TABS)[number];
export function tabOf(value: string | null | undefined): InboxTab {
  return value === "alle" ? "alle" : "zu_tun";
}

type PlaceLabel = {
  interest?: string | null;
  stage?: string | null;
  outcome?: string | null;
  one_on_one?: boolean | null;
} | null | undefined;

export function interestKey(label: PlaceLabel) {
  if (label?.one_on_one) return ONE_ON_ONE;
  if (label?.outcome === "bestandskunde") return FUNNEL_INTEREST;
  const v = label?.interest;
  return v && v !== "unklar" && v !== "keins" ? v : NO_INTEREST;
}

/** The chips on a row: Interesse (1-1 in place of Sprachkurs), Niveau, Ort. Missing and "unklar" stay off the row. */
export function labelChips(label: { interest?: string | null; level?: string | null; place?: string | null; one_on_one?: boolean | null } | null | undefined) {
  return [label?.one_on_one ? ONE_ON_ONE : label?.interest, label?.level, label?.place].filter((v): v is string => !!v && v !== "unklar" && v !== "keins");
}

/** False for Schüler, Zalo, and Kein Lead: they have no step. */
export function isOpen(label: PlaceLabel) {
  return label?.outcome !== "kein_lead" && label?.outcome !== "bestandskunde" && label?.outcome !== "weiter_auf_zalo";
}

/** Status Zalo and Verloren are not part of a Sprachkurs step. Zalo continues there; Verloren is closed. */
export function inFunnelStep(status: InboxPlace["status"]) {
  return status !== "zalo" && status !== "verloren";
}

export function statusOf(label: PlaceLabel): InboxPlace["status"] {
  if (label?.outcome === "bestandskunde") return "schueler";
  if (label?.outcome === "weiter_auf_zalo") return "zalo";
  if (label?.outcome === "kein_lead") return "kein_lead";
  if (label?.outcome === "verloren") return "verloren";
  return "auto";
}

export function stepKey(label: PlaceLabel) {
  const stage = label?.outcome === "bestandskunde" ? "schueler" : (label?.stage ?? "");
  const i = (FUNNEL_STEPS as readonly string[]).indexOf(stage);
  return i >= 0 ? String(i + 1) : "unklar";
}

/** `todo` comes from the chat's next action (conversationView): `action.today`. */
export function inboxPlace(label: PlaceLabel, todo: boolean): InboxPlace {
  return { interestKey: interestKey(label), stepKey: stepKey(label), open: isOpen(label), status: statusOf(label), todo };
}

/**
 * Whether a chat belongs in the list the reader is looking at.
 * Under "Zu tun" only chats with something to do now. A status id other than Schüler matches that status. `stepFilter` applies only inside Sprachkurs, and Status Zalo and Verloren are left out of that step. An empty interest filter is the whole inbox.
 * 1-1 chats show only under the 1-1 filter (every one of them, whatever the tab), or in a name search (`searching`) with no filter.
 */
export function matchesInboxFilter(place: InboxPlace, interestFilter: string, stepFilter: string, tab: InboxTab = "alle", searching = false) {
  const oneOnOne = place.interestKey === ONE_ON_ONE;
  if (interestFilter === ONE_ON_ONE) return oneOnOne;
  if (tab === "zu_tun" && !place.todo) return false;
  if (oneOnOne) return !interestFilter && searching;
  if ((STATUS_FILTERS as readonly string[]).includes(interestFilter)) return place.status === interestFilter;
  if (interestFilter === QUALIFY) return place.interestKey === NO_INTEREST && place.open;
  if (interestFilter && place.interestKey !== interestFilter) return false;
  if (interestFilter === FUNNEL_INTEREST && stepFilter && (!inFunnelStep(place.status) || place.stepKey !== stepFilter)) return false;
  return true;
}
