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
  candidate_area_id: string | null;
  primary_area_id: string | null;
  buddy_id: string | null;
  created_at: string;
};

export type Area = {
  id: string;
  slug: string;
  name_de: string;
  name_vi: string;
  description_de: string | null;
  description_vi: string | null;
  icon: IconName;
  color: string;
  is_shared: boolean;
  sort: number;
};

/** Content of a page is a list of blocks, each with German + Vietnamese text. */
export type Block =
  | { type: "heading"; de: string; vi: string }
  | { type: "paragraph"; de: string; vi: string }
  | { type: "list"; ordered?: boolean; items: { de: string; vi: string }[] }
  | { type: "steps"; items: { de: string; vi: string; body_de?: string; body_vi?: string }[] }
  | { type: "callout"; tone: "info" | "warning" | "tip"; de: string; vi: string }
  | { type: "template"; label_de: string; label_vi: string; text: string; translation_de?: string }
  | { type: "video"; url: string; caption_de?: string; caption_vi?: string };

export type Page = {
  id: string;
  area_id: string;
  slug: string;
  title_de: string;
  title_vi: string;
  kind: KnowledgeKind;
  section: PageSection;
  body: Block[];
  owner_id: string | null;
  verified_until: string | null;
  published: boolean;
  updated_at: string;
};

export type PageWithMeta = Page & {
  area: Pick<Area, "slug" | "name_de" | "name_vi" | "color" | "icon"> | null;
  owner: Pick<Profile, "full_name" | "email"> | null;
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
