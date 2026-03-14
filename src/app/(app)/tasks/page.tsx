import { PageHeader } from "@/components/shell/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime } from "@/lib/format";
import { tasks } from "@/lib/mock-data";

export default function TasksPage() {
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>{task.clientName}</TableCell>
                  <TableCell>
                    <Badge variant={task.priority === "High" ? "default" : "outline"}>
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{task.status}</TableCell>
                  <TableCell>{formatDateTime(task.dueAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
