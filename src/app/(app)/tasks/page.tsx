import { TaskWorkspace } from "@/components/tasks/task-workspace";
import { PageHeader } from "@/components/shell/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTasksPageData } from "@/lib/wealthflow/server";

export default async function TasksPage() {
  const { clients, portfolios, tasks, workspace } = await getTasksPageData();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Task management"
        title="Advisor workload"
        description="Deadlines, preparation tasks, and client commitments sequenced for a high-confidence advisory week."
      />
      <Card>
        <CardHeader className="border-b border-border/60">
          <CardTitle>Open work</CardTitle>
        </CardHeader>
        <CardContent className="pt-5">
          <TaskWorkspace
            clients={clients}
            organizationId={workspace.organization!.id}
            portfolios={portfolios}
            tasks={tasks}
            viewerId={workspace.user.id}
          />
        </CardContent>
      </Card>
    </div>
  );
}
