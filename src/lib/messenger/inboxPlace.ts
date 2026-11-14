import { FUNNEL_INTEREST, STEPS, type Step } from "./steps";

/** Chats with no Interesse yet. */
export const NO_INTEREST = "ohne";
/** The Qualifizieren step: no Interesse, and not Schüler or Kein Lead. */
export const QUALIFY = "qualifizieren";

const FUNNEL_STEPS = STEPS.filter((s) => s !== "qualifizieren");

export type InboxPlace = {
  interestKey: string;
  /** "1".."4" inside Sprachkurs, otherwise "unklar". */
  stepKey: string;
  open: boolean;
};

type PlaceLabel = {
  interest?: string | null;
  stage?: string | null;
  outcome?: string | null;
} | null | undefined;

export function interestKey(label: PlaceLabel) {
  const v = label?.interest;
  return v && v !== "unklar" && v !== "keins" ? v : NO_INTEREST;
}

/** The chips on a row: Interesse, Niveau, Ort. Missing and "unklar" stay off the row. */
export function labelChips(label: { interest?: string | null; level?: string | null; place?: string | null } | null | undefined) {
  return [label?.interest, label?.level, label?.place].filter((v): v is string => !!v && v !== "unklar" && v !== "keins");
}

/** False for Schüler and Kein Lead: they have no step. */
export function isOpen(label: PlaceLabel) {
  return label?.outcome !== "kein_lead" && label?.outcome !== "bestandskunde";
}

export function stepKey(label: PlaceLabel) {
  const i = label?.stage ? FUNNEL_STEPS.indexOf(label.stage as Step) : -1;
  return i >= 0 ? String(i + 1) : "unklar";
}

export function inboxPlace(label: PlaceLabel): InboxPlace {
  return { interestKey: interestKey(label), stepKey: stepKey(label), open: isOpen(label) };
}

/**
 * Whether a chat belongs in the list the reader is looking at.
 * `stepFilter` applies only inside Sprachkurs. An empty interest filter is the whole inbox.
 */
export function matchesInboxFilter(place: InboxPlace, interestFilter: string, stepFilter: string) {
  if (interestFilter === QUALIFY) return place.interestKey === NO_INTEREST && place.open;
  if (interestFilter && place.interestKey !== interestFilter) return false;
  if (interestFilter === FUNNEL_INTEREST && stepFilter && place.stepKey !== stepFilter) return false;
  return true;
}
