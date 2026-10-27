import type { PageContent } from "@/lib/types";
import fuerAlleAllgemeineRegeln from "./fuer-alle/allgemeine-regeln";
import fuerAlleGeschichteUndWerte from "./fuer-alle/geschichte-und-werte";
import fuerAlleKurseUndLeistungen from "./fuer-alle/kurse-und-leistungen";
import fuerAllePreiseUndPositionierung from "./fuer-alle/preise-und-positionierung";
import fuerAlleStandorteUndTeam from "./fuer-alle/standorte-und-team";
import fuerAlleTools from "./fuer-alle/tools";
import salesErstkontaktMessenger from "./sales/erstkontakt-messenger";
import salesInterview from "./sales/interview";
import salesKampagneProbestunde from "./sales/kampagne-probestunde";
import salesKeineRabatte from "./sales/keine-rabatte";
import salesProbestundeBuchen from "./sales/probestunde-buchen";
import salesVerkaufstrichter from "./sales/verkaufstrichter";
import studentSupportOnboardingUndKundenbindung from "./student-support/onboarding-und-kundenbindung";

/** Pages per area slug. To add a page: create a file in the area's folder and list it here. */
export const PAGES_BY_AREA: Record<string, PageContent[]> = {
  "fuer-alle": [fuerAlleAllgemeineRegeln, fuerAlleGeschichteUndWerte, fuerAlleKurseUndLeistungen, fuerAllePreiseUndPositionierung, fuerAlleStandorteUndTeam, fuerAlleTools],
  sales: [salesErstkontaktMessenger, salesInterview, salesKampagneProbestunde, salesKeineRabatte, salesProbestundeBuchen, salesVerkaufstrichter],
  "student-support": [studentSupportOnboardingUndKundenbindung],
};
