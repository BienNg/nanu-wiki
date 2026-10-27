export type AppRole = "pending" | "candidate" | "staff" | "editor" | "admin";
export type KnowledgeKind = "reference" | "process" | "decision" | "living";
export type PageSection = "general" | "interview" | "onboarding" | "handbook";
export type Lang = "both" | "de" | "vi";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: AppRole;
  location: "hcm" | "hanoi" | "stuttgart" | "online" | null;
  candidate_area: string | null; // area slug – candidates: the one role they applied for
  primary_area: string | null;   // area slug – staff: their own role (for "Mein Onboarding")
  buddy_id: string | null;
  created_at: string;
};

/** Areas, pages, onboarding and quizzes are hard-coded in `src/content`; the database only stores progress. */
export type Area = {
  slug: string;
  name_de: string;
  name_vi: string;
  description_de: string | null;
  description_vi: string | null;
  icon: IconName;
  color: string;
  is_shared: boolean;
};

/** Content of a page is a list of blocks, each with German + Vietnamese text. */
export type Block =
  | { type: "heading"; de: string; vi: string }
  | { type: "paragraph"; de: string; vi: string }
  | { type: "list"; ordered?: boolean; items: { de: string; vi: string }[] }
  | { type: "steps"; items: { de: string; vi: string; body_de?: string; body_vi?: string }[] }
  | { type: "callout"; tone: "info" | "warning" | "tip"; de: string; vi: string }
  | { type: "template"; label_de: string; label_vi: string; text: string; translation_de?: string }
  | { type: "video"; url: string; caption_de?: string; caption_vi?: string }
  | { type: "chat"; id: string; customer: string; intro_de?: string; intro_vi?: string; messages: ChatMessage[] }
  | { type: "conversation"; customer: string; label_de?: string; label_vi?: string; note_de?: string; note_vi?: string; messages: ConversationMessage[] };

/** One message of an imaginary customer in a Messenger simulation.
 *  A blank line inside `text` splits it into several bubbles sent in a row. */
export type ChatMessage = { text: string; translation_de?: string };

/** One bubble of a static Messenger example; "me" is NaNu NaNa.
 *  `stamp_de`/`stamp_vi` show a small centred line above it (time, "next day", where the customer came from). */
export type ConversationMessage = { from: "customer" | "me"; text: string; translation_de?: string; stamp_de?: string; stamp_vi?: string };

/** What gets saved per reply: the customer message, the answer and how long it took. */
export type ChatTurn = { customer: string; reply: string; seconds: number };

/** One page as written in `src/content/pages/<area>/<slug>.ts`. */
export type PageContent = {
  slug: string;
  title_de: string;
  title_vi: string;
  kind: KnowledgeKind;
  section: PageSection;
  body: Block[];
  verified_until: string | null;
  updated_at: string; // YYYY-MM-DD – bump when the content changes (sorts "Neuigkeiten")
  published?: boolean; // false = draft, only editors of the area and admins see it
};

/** A page plus where it lives. `id` is "<area>/<slug>" and is what the database stores (chat_responses.page_id). */
export type PageWithMeta = PageContent & {
  id: string;
  href: string;
  published: boolean;
  area: Pick<Area, "slug" | "name_de" | "name_vi" | "color" | "icon">;
};

/** A weekly quiz. `correct` never leaves the server: content modules are server-only. */
export type QuizContent = {
  id: string;
  pass_percent: number;
  questions: {
    question_de: string;
    question_vi: string;
    options: { de: string; vi: string }[];
    correct: number;
    explanation_de: string | null;
    explanation_vi: string | null;
  }[];
};

/** One week of a role's learning path. Item ids are stored in checklist_progress, so keep them stable. */
export type OnboardingWeek = {
  week: number;
  title_de: string;
  title_vi: string;
  items: { id: string; label_de: string; label_vi: string; page?: string }[]; // page = "<area>/<slug>"
  quiz?: QuizContent;
};

export type IconName =
  | "users"
  | "chat"
  | "heart"
  | "cap"
  | "book"
  | "pen"
  | "building"
  | "compass"
  | "megaphone";
