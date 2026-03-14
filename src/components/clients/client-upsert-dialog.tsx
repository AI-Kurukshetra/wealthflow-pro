"use client";

import type { ReactNode } from "react";
import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";

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
import { createClient } from "@/lib/supabase/browser";

type ClientRecord = {
  id: string;
  household_name: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  client_status: string;
  risk_profile: string | null;
};

type ClientUpsertDialogProps = {
  organizationId: string;
  viewerId: string;
  client?: ClientRecord;
  trigger: ReactNode;
};

type FormValues = {
  householdName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  status: string;
  riskProfile: string;
};

type MutationError = {
  message: string;
};

type ClientMutationPayload = {
  organization_id: string;
  primary_advisor_id: string;
  household_name: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  client_status: string;
  risk_profile: string | null;
  created_by: string;
};

type ClientMutationTable = {
  update: (
    values: ClientMutationPayload
  ) => {
    eq: (column: string, value: string) => Promise<{ error: MutationError | null }>;
  };
  insert: (values: ClientMutationPayload) => Promise<{ error: MutationError | null }>;
};

const defaultValues: FormValues = {
  householdName: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  city: "",
  status: "active",
  riskProfile: "Balanced",
};

export function ClientUpsertDialog({
  organizationId,
  viewerId,
  client,
  trigger,
}: ClientUpsertDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [values, setValues] = useState<FormValues>(defaultValues);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (!nextOpen) {
      return;
    }

    setError(null);
    setValues(
      client
        ? {
            householdName: client.household_name,
            firstName: client.first_name ?? "",
            lastName: client.last_name ?? "",
            email: client.email ?? "",
            phone: client.phone ?? "",
            city: client.city ?? "",
            status: client.client_status,
            riskProfile: client.risk_profile ?? "Balanced",
          }
        : defaultValues
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const supabase = createClient();
    const payload: ClientMutationPayload = {
      organization_id: organizationId,
      primary_advisor_id: viewerId,
      household_name: values.householdName,
      first_name: values.firstName || null,
      last_name: values.lastName || null,
      email: values.email || null,
      phone: values.phone || null,
      city: values.city || null,
      client_status: values.status,
      risk_profile: values.riskProfile || null,
      created_by: viewerId,
    };
    const clientsTable = supabase.from("clients") as unknown as ClientMutationTable;

    const query = client
      ? clientsTable.update(payload).eq("id", client.id)
      : clientsTable.insert(payload);

    const { error: mutationError } = await query;

    if (mutationError) {
      setError(mutationError.message);
      setIsSubmitting(false);
      return;
    }

    setOpen(false);
    setIsSubmitting(false);
    startTransition(() => router.refresh());
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{client ? "Edit client" : "New client intake"}</DialogTitle>
          <DialogDescription>
            Persist the client record to Supabase so the CRM, portfolios, tasks, and
            meetings stay attached to the same household.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="householdName">Household name</Label>
            <Input
              id="householdName"
              required
              value={values.householdName}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  householdName: event.target.value,
                }))
              }
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                value={values.firstName}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    firstName: event.target.value,
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                value={values.lastName}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    lastName: event.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={values.email}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={values.phone}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    phone: event.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={values.city}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    city: event.target.value,
                  }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select
                value={values.status}
                onValueChange={(value) =>
                  setValues((current) => ({
                    ...current,
                    status: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="onboarding">Onboarding</SelectItem>
                  <SelectItem value="prospect">Prospect</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Risk profile</Label>
              <Select
                value={values.riskProfile}
                onValueChange={(value) =>
                  setValues((current) => ({
                    ...current,
                    riskProfile: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Conservative">Conservative</SelectItem>
                  <SelectItem value="Balanced">Balanced</SelectItem>
                  <SelectItem value="Growth">Growth</SelectItem>
                  <SelectItem value="Aggressive">Aggressive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {error ? (
            <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? client
                ? "Saving client..."
                : "Creating client..."
              : client
                ? "Save changes"
                : "Create client"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
