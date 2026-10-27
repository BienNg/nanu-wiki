import type { HandbookGroup, PageContent } from "@/lib/types";
import fuerAlleAllgemeineRegeln from "./fuer-alle/allgemeine-regeln";
import fuerAlleGeschichteUndWerte from "./fuer-alle/geschichte-und-werte";
import fuerAlleKurseUndLeistungen from "./fuer-alle/kurse-und-leistungen";
import fuerAllePreiseUndPositionierung from "./fuer-alle/preise-und-positionierung";
import fuerAlleStandorteUndTeam from "./fuer-alle/standorte-und-team";
import fuerAlleTools from "./fuer-alle/tools";
import salesBestandskundenImMessenger from "./sales/bestandskunden-im-messenger";
import salesErstkontaktMessenger from "./sales/erstkontakt-messenger";
import salesFaqApp from "./sales/faq-app";
import salesFaqAusbildung from "./sales/faq-ausbildung";
import salesFaqSprachkurse from "./sales/faq-sprachkurse";
import salesFaqStudium from "./sales/faq-studium";
import salesInterview from "./sales/interview";
import salesInterviewFaelle from "./sales/interview-faelle";
import salesKeineKunden from "./sales/keine-kunden";
import salesKampagneProbestunde from "./sales/kampagne-probestunde";
import salesKeineRabatte from "./sales/keine-rabatte";
import salesProbestundeBuchen from "./sales/probestunde-buchen";
import salesVerkaufstrichter from "./sales/verkaufstrichter";
import studentSupportOnboardingUndKundenbindung from "./student-support/onboarding-und-kundenbindung";
import visaKundenfragen from "./visa/kundenfragen";
import visaUeberblick from "./visa/ueberblick";
import visaVisumAusbildung from "./visa/visum-ausbildung";
import visaVisumStudium from "./visa/visum-studium";

/** Pages per area slug. To add a page: create a file in the area's folder and list it here. */
export const PAGES_BY_AREA: Record<string, PageContent[]> = {
  "fuer-alle": [fuerAlleAllgemeineRegeln, fuerAlleGeschichteUndWerte, fuerAlleKurseUndLeistungen, fuerAllePreiseUndPositionierung, fuerAlleStandorteUndTeam, fuerAlleTools],
  sales: [salesBestandskundenImMessenger, salesErstkontaktMessenger, salesFaqApp, salesFaqAusbildung, salesFaqSprachkurse, salesFaqStudium, salesInterview, salesInterviewFaelle, salesKampagneProbestunde, salesKeineKunden, salesKeineRabatte, salesProbestundeBuchen, salesVerkaufstrichter],
  "student-support": [studentSupportOnboardingUndKundenbindung],
  visa: [visaKundenfragen, visaUeberblick, visaVisumAusbildung, visaVisumStudium],
};

/** Handbuch categories per area, in reading order. Pages left out land in "Weitere", newest first. */
export const HANDBOOK_GROUPS_BY_AREA: Record<string, HandbookGroup[]> = {
  sales: [
    { de: "Grundlagen", vi: "Nền tảng", pages: [salesVerkaufstrichter, salesKeineRabatte] },
    {
      de: "Messenger-Gespräche",
      vi: "Trò chuyện qua Messenger",
      pages: [salesErstkontaktMessenger, salesProbestundeBuchen, salesBestandskundenImMessenger, salesKeineKunden],
    },
    { de: "FAQs", vi: "Câu hỏi thường gặp", pages: [salesFaqSprachkurse, salesFaqApp, salesFaqAusbildung, salesFaqStudium] },
    { de: "Kampagnen", vi: "Chiến dịch", pages: [salesKampagneProbestunde] },
  ],
  visa: [
    { de: "Grundlagen", vi: "Nền tảng", pages: [visaUeberblick] },
    { de: "Visumarten", vi: "Các loại visa", pages: [visaVisumAusbildung, visaVisumStudium] },
    { de: "Kundenfragen", vi: "Câu hỏi của khách", pages: [visaKundenfragen] },
  ],
};
