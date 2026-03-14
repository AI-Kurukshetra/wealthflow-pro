"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { buildDemoWorkspaceSeed } from "@/lib/wealthflow/demo-data";
import {
  getSupabaseServerClient,
  getViewerWorkspace,
} from "@/lib/wealthflow/server";

type OrganizationInsertPayload = {
  id: string;
  name: string;
  slug: string;
  timezone: string;
  base_currency: string;
  country_code: string;
  created_by: string;
};

type UpsertTable = {
  upsert: (
    rows: Record<string, unknown>[],
    options: {
      onConflict: string;
      ignoreDuplicates: boolean;
    }
  ) => Promise<{ error: Error | null }>;
};

type InsertTable<T> = {
  insert: (values: T) => Promise<{ error: { code?: string; message: string } | null }>;
};

export async function provisionDemoWorkspaceAction() {
  const workspace = await getViewerWorkspace();
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email || !workspace.user.email) {
    redirect("/login");
  }

  if (workspace.membership && workspace.organization) {
    redirect("/dashboard");
  }

  const seed = buildDemoWorkspaceSeed({
    id: user.id,
    email: user.email,
    fullName: workspace.profile?.full_name ?? "Vineeth Motati",
  });

  await upsertRows(supabase, "profiles", [seed.profile], "id");
  await ensureOrganization(supabase, seed.organization);
  await upsertRows(supabase, "risk_profiles", seed.riskProfiles, "id");
  await upsertRows(supabase, "clients", seed.clients, "id");
  await upsertRows(supabase, "portfolios", seed.portfolios, "id");
  await upsertRows(supabase, "accounts", seed.accounts, "id");
  await upsertRows(supabase, "securities", seed.securities, "id");
  await upsertRows(supabase, "portfolio_snapshots", seed.snapshots, "id");
  await upsertRows(supabase, "transactions", seed.transactions, "id");
  await upsertRows(supabase, "tasks", seed.tasks, "id");
  await upsertRows(supabase, "meetings", seed.meetings, "id");
  await upsertRows(supabase, "goals", seed.goals, "id");
  await upsertRows(supabase, "notifications", seed.notifications, "id");
  await upsertRows(supabase, "client_activities", seed.activities, "id");

  for (const document of seed.documents) {
    const uploadResult = await supabase.storage
      .from(document.bucket_name)
      .upload(document.storage_path, document.file_contents, {
        cacheControl: "3600",
        contentType: document.mime_type,
        upsert: true,
      });

    if (uploadResult.error) {
      throw uploadResult.error;
    }
  }

  await upsertRows(
    supabase,
    "documents",
    seed.documents.map(({ file_contents, ...document }) => ({
      ...document,
      size_bytes: file_contents.length,
    })),
    "id"
  );

  revalidatePath("/dashboard");
  revalidatePath("/clients");
  revalidatePath("/portfolios");
  revalidatePath("/tasks");
  revalidatePath("/documents");
  revalidatePath("/meetings");
  redirect("/dashboard");
}

async function upsertRows(
  supabase: Awaited<ReturnType<typeof getSupabaseServerClient>>,
  table: string,
  rows: Record<string, unknown>[],
  onConflict: string
) {
  if (rows.length === 0) {
    return;
  }

  const tableQuery = supabase.from(table as never) as unknown as UpsertTable;
  const { error } = await tableQuery.upsert(rows, {
    onConflict,
    ignoreDuplicates: false,
  });

  if (error) {
    throw error;
  }
}

async function ensureOrganization(
  supabase: Awaited<ReturnType<typeof getSupabaseServerClient>>,
  organization: OrganizationInsertPayload
) {
  const organizationsTable = supabase
    .from("organizations") as unknown as InsertTable<OrganizationInsertPayload>;
  const { error } = await organizationsTable.insert(organization);

  if (error && error.code !== "23505") {
    throw error;
  }
}
