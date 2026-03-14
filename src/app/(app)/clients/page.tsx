import Link from "next/link";
import { IconPlus, IconSearch } from "@tabler/icons-react";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { clients } from "@/lib/mock-data";

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="CRM"
        title="Client relationships"
        description="Every household, review date, risk profile, and service note aligned to the same advisor workflow."
        badge="20 seeded clients"
        actions={
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <IconPlus data-icon="inline-start" />
                New client
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New client intake</DialogTitle>
                <DialogDescription>
                  This scaffold reserves the intake surface for onboarding, KYC,
                  and risk discovery.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-3">
                <Input placeholder="Household or client name" />
                <Input placeholder="Primary email" />
                <Select defaultValue="balanced">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Risk profile" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="conservative">Conservative</SelectItem>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="growth">Growth</SelectItem>
                      <SelectItem value="aggressive">Aggressive</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </DialogContent>
          </Dialog>
        }
      />
      <Card>
        <CardHeader className="border-b border-border/60">
          <CardTitle className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <span>Household roster</span>
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="relative">
                <IconSearch className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input className="w-full min-w-64 pl-10" placeholder="Search client" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All segments</SelectItem>
                    <SelectItem value="ultra-hni">Ultra HNI</SelectItem>
                    <SelectItem value="hni">HNI</SelectItem>
                    <SelectItem value="affluent">Affluent</SelectItem>
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
                <TableHead>Segment</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>AUM</TableHead>
                <TableHead>Next review</TableHead>
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
                          {client.name
                            .split(" ")
                            .slice(0, 2)
                            .map((part) => part[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{client.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {client.city} • {client.email}
                        </p>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>{client.segment}</TableCell>
                  <TableCell>{client.riskProfile}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        client.status === "Active"
                          ? "secondary"
                          : client.status === "Onboarding"
                            ? "outline"
                            : "default"
                      }
                    >
                      {client.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(client.aum)}</TableCell>
                  <TableCell>{formatDateTime(client.nextReviewAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
