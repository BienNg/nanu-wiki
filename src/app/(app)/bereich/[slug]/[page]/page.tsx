import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getEditorAreas, getSession, requireRole } from "@/lib/auth";
import { canReadPage, getPage } from "@/content";
import { DocView } from "@/components/DocView";

type Params = Promise<{ slug: string; page: string }>;

/** The page, or undefined when it doesn't exist or this user may not read it. */
async function load(params: Params) {
  const { slug, page: pageSlug } = await params;
  const session = await getSession();
  const page = getPage(slug, pageSlug);
  if (!page || !session || !canReadPage(session.profile, await getEditorAreas(), page)) return undefined;
  return page;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const page = await load(params);
  return { title: page?.title_de ?? "Seite" };
}

export default async function DocPage({ params, searchParams }: { params: Params; searchParams: Promise<{ c?: string }> }) {
  const { profile } = await requireRole("candidate");
  const page = await load(params);
  if (!page) notFound();
  const { c } = await searchParams;
  return <DocView page={page} profile={profile} c={c} />;
}
