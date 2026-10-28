import type { HandbookGroup, PageContent } from "@/lib/types";
import fuerAlleAllgemeineRegeln from "./fuer-alle/allgemeine-regeln";
import fuerAlleGeschichteUndWerte from "./fuer-alle/geschichte-und-werte";
import fuerAlleKurseUndLeistungen from "./fuer-alle/kurse-und-leistungen";
import fuerAllePreiseUndPositionierung from "./fuer-alle/preise-und-positionierung";
import fuerAlleStandorteUndTeam from "./fuer-alle/standorte-und-team";
import fuerAlleTools from "./fuer-alle/tools";
import lehrmaterialienBuchFinden from "./lehrmaterialien/buch-finden";
import lehrmaterialienFaqMaterial from "./lehrmaterialien/faq-material";
import lehrmaterialienLehrbuchUndMethode from "./lehrmaterialien/lehrbuch-und-methode";
import lehrmaterialienMaterialVerschicken from "./lehrmaterialien/material-verschicken";
import lehrmaterialienMaterialienUeberblick from "./lehrmaterialien/materialien-ueberblick";
import lehrmaterialienZugangClassroomUndApp from "./lehrmaterialien/zugang-classroom-und-app";
import salesAktionOktober2026 from "./sales/aktion-oktober-2026";
import salesAufgabenUndKpis from "./sales/aufgaben-und-kpis";
import salesBeratungUndTermine from "./sales/beratung-und-termine";
import salesBestandskundenImMessenger from "./sales/bestandskunden-im-messenger";
import salesErstkontaktMessenger from "./sales/erstkontakt-messenger";
import salesFaqApp from "./sales/faq-app";
import salesFaqAusbildung from "./sales/faq-ausbildung";
import salesFaqProgramme from "./sales/faq-programme";
import salesFaqSprachkurse from "./sales/faq-sprachkurse";
import salesFaqStudium from "./sales/faq-studium";
import salesInterview from "./sales/interview";
import salesInterviewFaelle from "./sales/interview-faelle";
import salesKeineKunden from "./sales/keine-kunden";
import salesKampagneProbestunde from "./sales/kampagne-probestunde";
import salesProbestundeBuchen from "./sales/probestunde-buchen";
import salesVerkaufstrichter from "./sales/verkaufstrichter";
import salesWebsitePostsUndWerbung from "./sales/website-posts-und-werbung";
import studentSupportAnmeldungUndZahlung from "./student-support/anmeldung-und-zahlung";
import studentSupportAufgabenUndRhythmus from "./student-support/aufgaben-und-rhythmus";
import studentSupportKanaele from "./student-support/kanaele";
import studentSupportKursPausieren from "./student-support/kurs-pausieren";
import studentSupportLehrkraefteBegleiten from "./student-support/lehrkraefte-begleiten";
import studentSupportMaterialUndHausaufgaben from "./student-support/material-und-hausaufgaben";
import studentSupportNachDerZahlung from "./student-support/nach-der-zahlung";
import studentSupportNaechsterKursUndTreue from "./student-support/naechster-kurs-und-treue";
import studentSupportOnboardingUndKundenbindung from "./student-support/onboarding-und-kundenbindung";
import studentSupportProbestundenUndRueckerstattung from "./student-support/probestunden-und-rueckerstattung";
import studentSupportPruefungenBegleiten from "./student-support/pruefungen-begleiten";
import studentSupportTechnikHilfe from "./student-support/technik-hilfe";
import visaKundenfragen from "./visa/kundenfragen";
import visaUeberblick from "./visa/ueberblick";
import visaVisumAusbildung from "./visa/visum-ausbildung";
import visaVisumStudium from "./visa/visum-studium";

/** Pages per area slug. To add a page: create a file in the area's folder and list it here. */
export const PAGES_BY_AREA: Record<string, PageContent[]> = {
  "fuer-alle": [fuerAlleAllgemeineRegeln, fuerAlleGeschichteUndWerte, fuerAlleKurseUndLeistungen, fuerAllePreiseUndPositionierung, fuerAlleStandorteUndTeam, fuerAlleTools],
  lehrmaterialien: [lehrmaterialienBuchFinden, lehrmaterialienFaqMaterial, lehrmaterialienLehrbuchUndMethode, lehrmaterialienMaterialVerschicken, lehrmaterialienMaterialienUeberblick, lehrmaterialienZugangClassroomUndApp],
  sales: [salesAktionOktober2026, salesAufgabenUndKpis, salesBeratungUndTermine, salesBestandskundenImMessenger, salesErstkontaktMessenger, salesFaqApp, salesFaqAusbildung, salesFaqProgramme, salesFaqSprachkurse, salesFaqStudium, salesInterview, salesInterviewFaelle, salesKampagneProbestunde, salesKeineKunden, salesProbestundeBuchen, salesVerkaufstrichter, salesWebsitePostsUndWerbung],
  "student-support": [studentSupportAnmeldungUndZahlung, studentSupportAufgabenUndRhythmus, studentSupportKanaele, studentSupportKursPausieren, studentSupportLehrkraefteBegleiten, studentSupportMaterialUndHausaufgaben, studentSupportNachDerZahlung, studentSupportNaechsterKursUndTreue, studentSupportOnboardingUndKundenbindung, studentSupportProbestundenUndRueckerstattung, studentSupportPruefungenBegleiten, studentSupportTechnikHilfe],
  visa: [visaKundenfragen, visaUeberblick, visaVisumAusbildung, visaVisumStudium],
};

/** Handbuch categories per area, in reading order. Pages left out land in "Weitere", newest first. */
export const HANDBOOK_GROUPS_BY_AREA: Record<string, HandbookGroup[]> = {
  sales: [
    { de: "Grundlagen", vi: "Nền tảng", pages: [salesVerkaufstrichter, salesAufgabenUndKpis] },
    {
      de: "Messenger-Gespräche",
      vi: "Trò chuyện qua Messenger",
      pages: [salesErstkontaktMessenger, salesBeratungUndTermine, salesProbestundeBuchen, salesBestandskundenImMessenger, salesKeineKunden],
    },
    { de: "FAQs", vi: "Câu hỏi thường gặp", pages: [salesFaqSprachkurse, salesFaqApp, salesFaqAusbildung, salesFaqProgramme, salesFaqStudium] },
    { de: "Kampagnen", vi: "Chiến dịch", pages: [salesAktionOktober2026, salesKampagneProbestunde] },
    { de: "Website & Social Media", vi: "Website & mạng xã hội", pages: [salesWebsitePostsUndWerbung] },
  ],
  lehrmaterialien: [
    { de: "Überblick", vi: "Tổng quan", pages: [lehrmaterialienMaterialienUeberblick, lehrmaterialienLehrbuchUndMethode] },
    { de: "Ausgabe & Zugang", vi: "Gửi tài liệu & truy cập", pages: [lehrmaterialienMaterialVerschicken, lehrmaterialienZugangClassroomUndApp] },
    { de: "Fragen von Studierenden", vi: "Câu hỏi của học viên", pages: [lehrmaterialienBuchFinden, lehrmaterialienFaqMaterial] },
  ],
  "student-support": [
    { de: "Grundlagen", vi: "Nền tảng", pages: [studentSupportOnboardingUndKundenbindung, studentSupportAufgabenUndRhythmus, studentSupportKanaele] },
    {
      de: "Die ersten zwei Wochen",
      vi: "Hai tuần đầu tiên",
      pages: [studentSupportAnmeldungUndZahlung, studentSupportNachDerZahlung, studentSupportTechnikHilfe, studentSupportProbestundenUndRueckerstattung],
    },
    { de: "Während des Kurses", vi: "Trong khoá học", pages: [studentSupportMaterialUndHausaufgaben, studentSupportKursPausieren, studentSupportLehrkraefteBegleiten, studentSupportPruefungenBegleiten] },
    { de: "Kundenbindung", vi: "Giữ chân học viên", pages: [studentSupportNaechsterKursUndTreue] },
  ],
  visa: [
    { de: "Grundlagen", vi: "Nền tảng", pages: [visaUeberblick] },
    { de: "Visumarten", vi: "Các loại visa", pages: [visaVisumAusbildung, visaVisumStudium] },
    { de: "Kundenfragen", vi: "Câu hỏi của khách", pages: [visaKundenfragen] },
  ],
};
