import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Crumb, Topbar } from "@/components/Topbar";
import { Label } from "@/components/Bi";
import { PageEditor } from "@/components/editor/PageEditor";
import type { Page } from "@/lib/types";

export const metadata = { title: "Bearbeiten" };

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole("editor");
  const { id } = await params;
  const supabase = await createClient();

  const { data: page } = await supabase.from("pages").select("*, area:areas(slug, name_de, name_vi)").eq("id", id).maybeSingle();
  if (!page) notFound();
  const { data: canEdit } = await supabase.rpc("can_edit_area", { target: page.area_id });
  if (!canEdit) redirect(`/seite/${id}`);

  const area = page.area as { slug: string; name_de: string; name_vi: string };

  return (
    <>
      <Topbar>
        <Link href={`/bereich/${area.slug}`} className="text-body hover:text-ink">
          <Label de={area.name_de} vi={area.name_vi} />
        </Link>
        <Crumb>
          <Link href={`/seite/${id}`} className="text-body hover:text-ink">
            {page.title_de}
          </Link>
        </Crumb>
        <Crumb>
          <Label de="Bearbeiten" vi="Chỉnh sửa" />
        </Crumb>
      </Topbar>
      <PageEditor page={page as Page} areaSlug={area.slug} />
    </>
  );
}
