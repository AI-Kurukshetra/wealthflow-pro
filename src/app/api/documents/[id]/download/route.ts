import { NextResponse } from "next/server";

import { getSupabaseServerClient, requireViewerWorkspace } from "@/lib/wealthflow/server";

type DownloadDocumentRow = {
  id: string;
  bucket_name: string;
  storage_path: string;
  file_name: string;
};

export async function GET(
  _request: Request,
  context: RouteContext<"/api/documents/[id]/download">
) {
  const { id } = await context.params;
  const workspace = await requireViewerWorkspace();
  const supabase = await getSupabaseServerClient();

  const { data: documentData } = await supabase
    .from("documents")
    .select("id, bucket_name, storage_path, file_name")
    .eq("organization_id", workspace.membership.organization_id)
    .eq("id", id)
    .maybeSingle();
  const document = (documentData ?? null) as DownloadDocumentRow | null;

  if (!document) {
    return NextResponse.json({ message: "Document not found." }, { status: 404 });
  }

  const signedUrlResult = await supabase.storage
    .from(document.bucket_name)
    .createSignedUrl(document.storage_path, 60, {
      download: document.file_name,
    });

  if (signedUrlResult.error || !signedUrlResult.data.signedUrl) {
    return NextResponse.json(
      { message: "Unable to create a download URL." },
      { status: 500 }
    );
  }

  return NextResponse.redirect(signedUrlResult.data.signedUrl);
}
