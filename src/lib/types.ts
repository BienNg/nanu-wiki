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

/** Content of a page is a list of blocks, each with German + Vietnamese text.
 *  `id` is optional: give a block one to keep its comments attached when its text is rewritten
 *  (otherwise the comment key is a hash of the block's content, see `blockKey`). */
type FunnelTone = "brand" | "dark" | "light";

export type Block = (
  | { type: "heading"; de: string; vi: string }
  | { type: "paragraph"; de: string; vi: string }
  | { type: "list"; ordered?: boolean; items: { de: string; vi: string }[] }
  | { type: "steps"; items: { de: string; vi: string; body_de?: string; body_vi?: string; template?: { label_de: string; label_vi: string; text: string; translation_de?: string } }[] }
  | { type: "callout"; tone: "info" | "warning" | "tip"; de: string; vi: string }
  | { type: "template"; label_de: string; label_vi: string; text: string; translation_de?: string }
  | { type: "video"; url: string; caption_de?: string; caption_vi?: string }
  | { type: "link"; url: string; de: string; vi: string }
  | { type: "chat"; id: string; customer: string; intro_de?: string; intro_vi?: string; message: ChatMessage }
  | { type: "conversation"; customer: string; label_de?: string; label_vi?: string; note_de?: string; note_vi?: string; messages: ConversationMessage[] }
  | { type: "funnel"; stages: { de: string; vi: string; sub: string; tone: FunnelTone }[]; legend?: { tone: FunnelTone; de: string; vi: string }[] }
  | { type: "channels"; note_de?: string; note_vi?: string; reel: ChannelReel; profile: ChannelProfile }
  | { type: "mcq"; id: string; intro_de?: string; intro_vi?: string; questions: McqQuestion[] }
) & { id?: string };

/** One card of a multiple-choice round on a page. `correct` is stripped before the block reaches the browser. */
export type McqQuestion = { question_de: string; question_vi: string; options: { de: string; vi: string }[]; correct: number };

/** The one message of an imaginary customer in a Messenger simulation (one scenario = one message, one reply).
 *  A blank line inside `text` splits it into several bubbles sent in a row. */
export type ChatMessage = { text: string; translation_de?: string };

/** One bubble of a static Messenger example; "me" is NaNu NaNa.
 *  `stamp_de`/`stamp_vi` show a small centred line above it (time, "next day", where the customer came from). */
export type ConversationMessage = { from: "customer" | "me"; text: string; translation_de?: string; stamp_de?: string; stamp_vi?: string };

/** A Facebook Reel someone is watching, and the TikTok profile they might open. No message yet. */
export type ChannelReel = {
  page: string;
  caption_de: string;
  caption_vi: string;
  audio_de: string;
  audio_vi: string;
  likes: string;
  comments: string;
  shares: string;
};

export type ChannelProfile = {
  name: string;
  handle: string;
  following: string;
  followers: string;
  likes: string;
  bio_de: string;
  bio_vi: string;
  videos: { views: string; label_de: string; label_vi: string; tone: "teal" | "indigo" | "amber" | "rose" | "sky" | "slate" }[];
};

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

/** A labelled group of pages in an area's Handbuch tab, listed in reading order. */
export type HandbookGroup = { de: string; vi: string; pages: PageContent[] };

/** A page plus where it lives. `id` is "<area>/<slug>" and is what the database stores (chat_responses.page_id). */
export type PageWithMeta = PageContent & {
  id: string;
  href: string;
  published: boolean;
  area: Pick<Area, "slug" | "name_de" | "name_vi" | "color" | "icon">;
};

/** Quick tag a commenter can pick instead of (or next to) writing text. */
export type CommentTag = "unklar" | "fehler" | "veraltet" | "idee" | "hilfreich";
export type CommentStatus = "open" | "in_progress" | "resolved" | "declined";

/** Where a comment points. null = the whole page. `field` is the language the text was selected in. */
export type CommentAnchor = {
  block: string;
  field?: "de" | "vi";
  exact?: string;   // the selected words
  prefix?: string;  // up to 32 characters before them …
  suffix?: string;  // … and after them, to find the right spot again
  context?: string; // the block's text when the comment was written (shown in the inbox)
} | null;

/** One row of page_comments. */
export type PageComment = {
  id: string;
  page_id: string;
  area: string;
  author_id: string;
  anchor: CommentAnchor;
  tag: CommentTag | null;
  body: string;
  status: CommentStatus;
  resolution_note: string | null;
  page_version: string | null;
  resolved_by: string | null;
  resolved_at: string | null;
  created_at: string;
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
  | "megaphone"
  | "passport";
