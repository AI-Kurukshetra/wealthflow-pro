"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { IconPlus } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime } from "@/lib/format";
import { createClient } from "@/lib/supabase/browser";

type TaskWorkspaceProps = {
  organizationId: string;
  viewerId: string;
  tasks: Array<{
    id: string;
    title: string;
    description: string | null;
    task_type: string;
    priority: string;
    status: string;
    due_at: string | null;
    client_id: string | null;
    portfolio_id: string | null;
    clientName: string;
    portfolioName: string | null;
  }>;
  clients: Array<{ id: string; household_name: string }>;
  portfolios: Array<{ id: string; name: string }>;
};

type MutationError = {
  message: string;
};

type TaskInsertPayload = {
  organization_id: string;
  client_id: string | null;
  portfolio_id: string | null;
  title: string;
  description: string | null;
  task_type: string;
  priority: string;
  status: string;
  assigned_to: string;
  created_by: string;
  due_at: string | null;
};

type TaskUpdatePayload = {
  status: string;
  completed_at: string;
};

type TaskMutationTable = {
  insert: (values: TaskInsertPayload) => Promise<{ error: MutationError | null }>;
  update: (
    values: TaskUpdatePayload
  ) => {
    eq: (column: string, value: string) => Promise<{ error: MutationError | null }>;
  };
};

export function TaskWorkspace({
  organizationId,
  viewerId,
  tasks,
  clients,
  portfolios,
}: TaskWorkspaceProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    taskType: "review",
    priority: "medium",
    clientId: clients[0]?.id ?? "",
    portfolioId: portfolios[0]?.id ?? "",
    dueAt: "",
  });

  async function createTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const supabase = createClient();
    const tasksTable = supabase.from("tasks") as unknown as TaskMutationTable;
    const { error: mutationError } = await tasksTable.insert({
      organization_id: organizationId,
      client_id: formValues.clientId || null,
      portfolio_id: formValues.portfolioId || null,
      title: formValues.title,
      description: formValues.description || null,
      task_type: formValues.taskType,
      priority: formValues.priority,
      status: "open",
      assigned_to: viewerId,
      created_by: viewerId,
      due_at: formValues.dueAt ? new Date(formValues.dueAt).toISOString() : null,
    });

    if (mutationError) {
      setError(mutationError.message);
      setIsSubmitting(false);
      return;
    }

    setFormValues({
      title: "",
      description: "",
      taskType: "review",
      priority: "medium",
      clientId: clients[0]?.id ?? "",
      portfolioId: portfolios[0]?.id ?? "",
      dueAt: "",
    });
    setOpen(false);
    setIsSubmitting(false);
    startTransition(() => router.refresh());
  }

  async function markComplete(taskId: string) {
    const supabase = createClient();
    const tasksTable = supabase.from("tasks") as unknown as TaskMutationTable;
    const { error: mutationError } = await tasksTable
      .update({
        status: "done",
        completed_at: new Date().toISOString(),
      })
      .eq("id", taskId);

    if (mutationError) {
      setError(mutationError.message);
      return;
    }

    startTransition(() => router.refresh());
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <IconPlus data-icon="inline-start" />
              New task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create task</DialogTitle>
              <DialogDescription>
                Save a new operational task directly into the live workspace.
              </DialogDescription>
            </DialogHeader>
            <form className="grid gap-4" onSubmit={createTask}>
              <div className="grid gap-2">
                <Label htmlFor="taskTitle">Task</Label>
                <Input
                  id="taskTitle"
                  required
                  value={formValues.title}
                  onChange={(event) =>
                    setFormValues((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="taskDescription">Description</Label>
                <textarea
                  id="taskDescription"
                  className="min-h-24 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none"
                  value={formValues.description}
                  onChange={(event) =>
                    setFormValues((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Client</Label>
                  <Select
                    value={formValues.clientId}
                    onValueChange={(value) =>
                      setFormValues((current) => ({
                        ...current,
                        clientId: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.household_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Portfolio</Label>
                  <Select
                    value={formValues.portfolioId}
                    onValueChange={(value) =>
                      setFormValues((current) => ({
                        ...current,
                        portfolioId: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a portfolio" />
                    </SelectTrigger>
                    <SelectContent>
                      {portfolios.map((portfolio) => (
                        <SelectItem key={portfolio.id} value={portfolio.id}>
                          {portfolio.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="grid gap-2">
                  <Label>Task type</Label>
                  <Select
                    value={formValues.taskType}
                    onValueChange={(value) =>
                      setFormValues((current) => ({
                        ...current,
                        taskType: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="review">Review</SelectItem>
                      <SelectItem value="compliance">Compliance</SelectItem>
                      <SelectItem value="portfolio">Portfolio</SelectItem>
                      <SelectItem value="tax">Tax</SelectItem>
                      <SelectItem value="service">Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Priority</Label>
                  <Select
                    value={formValues.priority}
                    onValueChange={(value) =>
                      setFormValues((current) => ({
                        ...current,
                        priority: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dueAt">Due at</Label>
                  <Input
                    id="dueAt"
                    type="datetime-local"
                    value={formValues.dueAt}
                    onChange={(event) =>
                      setFormValues((current) => ({
                        ...current,
                        dueAt: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              {error ? (
                <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              ) : null}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating task..." : "Create task"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {error ? (
        <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Portfolio</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Due</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-xs text-muted-foreground">{task.task_type}</p>
                </div>
              </TableCell>
              <TableCell>{task.clientName}</TableCell>
              <TableCell>{task.portfolioName ?? "Unlinked"}</TableCell>
              <TableCell>
                <Badge variant={task.priority === "high" ? "default" : "outline"}>
                  {task.priority}
                </Badge>
              </TableCell>
              <TableCell>{task.status}</TableCell>
              <TableCell>
                {task.due_at ? formatDateTime(task.due_at) : "No due date"}
              </TableCell>
              <TableCell className="text-right">
                {task.status === "done" ? (
                  <Badge variant="secondary">Completed</Badge>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => void markComplete(task.id)}
                  >
                    Mark complete
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
