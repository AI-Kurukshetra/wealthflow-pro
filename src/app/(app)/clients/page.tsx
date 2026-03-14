import Link from "next/link";
import { IconPencil, IconPlus, IconSearch } from "@tabler/icons-react";

import { ClientUpsertDialog } from "@/components/clients/client-upsert-dialog";
import { PageHeader } from "@/components/shell/page-header";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
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
import { formatCurrency, formatDateTime } from "@/lib/format";
import { getClientsPageData } from "@/lib/wealthflow/server";

function getStatusVariant(status: string) {
  if (status === "active") {
    return "secondary";
  }

  if (status === "onboarding") {
    return "outline";
  }

  return "default";
}

export default async function ClientsPage() {
  const { clients, workspace } = await getClientsPageData();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="CRM"
        title="Client relationships"
        description="Every household, review date, risk profile, and service note aligned to the same advisor workflow."
        badge={`${clients.length} live clients`}
        actions={
          <ClientUpsertDialog
            organizationId={workspace.organization!.id}
            viewerId={workspace.user.id}
            trigger={
              <Button>
                <IconPlus data-icon="inline-start" />
                New client
              </Button>
            }
          />
        }
      />
      <Card>
        <CardHeader className="border-b border-border/60">
          <CardTitle className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <span>Household roster</span>
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative">
                <IconSearch className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="w-full min-w-64 pl-10"
                  placeholder="Search is available in the workspace header"
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All clients</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="onboarding">Onboarding</SelectItem>
                    <SelectItem value="prospect">Prospects</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>AUM</TableHead>
                <TableHead>Next meeting</TableHead>
                <TableHead className="text-right">Edit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <Link
                      className="flex items-center gap-3"
                      href={`/clients/${client.id}`}
                    >
                      <Avatar className="size-10">
                        <AvatarFallback>
                          {client.household_name
                            .split(" ")
                            .slice(0, 2)
                            .map((part) => part[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{client.household_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {client.city ?? "City unavailable"}
                        </p>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p>{client.email ?? "No email"}</p>
                      <p className="text-xs text-muted-foreground">
                        {client.phone ?? "No phone"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{client.risk_profile ?? "Unassigned"}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(client.client_status)}>
                      {client.client_status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(client.totalAum)}</TableCell>
                  <TableCell>
                    {client.nextMeetingAt
                      ? formatDateTime(client.nextMeetingAt)
                      : "No meeting scheduled"}
                  </TableCell>
                  <TableCell className="text-right">
                    <ClientUpsertDialog
                      organizationId={workspace.organization!.id}
                      viewerId={workspace.user.id}
                      client={client}
                      trigger={
                        <Button size="icon-sm" variant="outline">
                          <IconPencil />
                        </Button>
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
