import { redirect } from "next/navigation";
import { IconDatabaseImport } from "@tabler/icons-react";

import { PageHeader } from "@/components/shell/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { provisionDemoWorkspaceAction } from "@/lib/wealthflow/actions";
import { getViewerWorkspace } from "@/lib/wealthflow/server";

export default async function SetupPage() {
  const workspace = await getViewerWorkspace();

  if (workspace.membership && workspace.organization) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Workspace setup"
        title="Create your WealthFlow workspace"
        description="Provision the organization, seeded households, portfolios, tasks, meetings, and private document vault needed for the live Supabase-backed demo."
        badge="One-time setup"
      />
      <Card className="max-w-3xl">
        <CardHeader className="border-b border-border/60">
          <CardTitle>Bootstrap demo data</CardTitle>
          <CardDescription>
            This will create your advisor profile, a tenant organization, and the
            WealthFlow demo records inside Supabase under your authenticated user.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 pt-6">
          <div className="grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
              20 households, 20 portfolios, 100 transactions, seeded task and meeting
              cadences.
            </div>
            <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
              Private `client-documents` storage objects with metadata rows ready for
              upload and download checks.
            </div>
          </div>
          <form action={provisionDemoWorkspaceAction}>
            <Button size="lg" type="submit">
              <IconDatabaseImport data-icon="inline-start" />
              Create demo workspace
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
