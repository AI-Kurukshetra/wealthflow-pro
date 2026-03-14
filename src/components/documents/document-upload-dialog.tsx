"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { IconUpload } from "@tabler/icons-react";

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

type DocumentUploadDialogProps = {
  organizationId: string;
  viewerId: string;
  clients: Array<{ id: string; household_name: string }>;
};

type MutationError = {
  message: string;
};

type DocumentInsertPayload = {
  organization_id: string;
  client_id: string;
  uploaded_by: string;
  name: string;
  bucket_name: string;
  storage_path: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  document_category: string;
  is_private: boolean;
};

type DocumentMutationTable = {
  insert: (values: DocumentInsertPayload) => Promise<{ error: MutationError | null }>;
};

export function DocumentUploadDialog({
  organizationId,
  viewerId,
  clients,
}: DocumentUploadDialogProps) {
  const router = useRouter();
  const defaultClientId = clients[0]?.id ?? "";
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documentName, setDocumentName] = useState("");
  const [clientId, setClientId] = useState(defaultClientId);
  const [category, setCategory] = useState("compliance");
  const [file, setFile] = useState<File | null>(null);
  const selectedClient = clients.find((client) => client.id === clientId);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file || !selectedClient) {
      setError("Choose a client and file before uploading.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const supabase = createClient();
    const documentsTable = supabase
      .from("documents") as unknown as DocumentMutationTable;
    const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const storagePath = `${organizationId}/${selectedClient.id}/${crypto.randomUUID()}-${safeFileName}`;

    const uploadResult = await supabase.storage
      .from("client-documents")
      .upload(storagePath, file, {
        cacheControl: "3600",
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (uploadResult.error) {
      setError(uploadResult.error.message);
      setIsSubmitting(false);
      return;
    }

    const insertResult = await documentsTable.insert({
      organization_id: organizationId,
      client_id: selectedClient.id,
      uploaded_by: viewerId,
      name: documentName || file.name,
      bucket_name: "client-documents",
      storage_path: storagePath,
      file_name: file.name,
      mime_type: file.type || "application/octet-stream",
      size_bytes: file.size,
      document_category: category,
      is_private: true,
    });

    if (insertResult.error) {
      setError(insertResult.error.message);
      setIsSubmitting(false);
      return;
    }

    setDocumentName("");
    setClientId(defaultClientId);
    setCategory("compliance");
    setFile(null);
    setOpen(false);
    setIsSubmitting(false);
    startTransition(() => router.refresh());
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <IconUpload data-icon="inline-start" />
          Upload document
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload workflow</DialogTitle>
          <DialogDescription>
            Upload the file into the private Supabase bucket and persist its document
            metadata row in the CRM workspace.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="documentName">Document name</Label>
            <Input
              id="documentName"
              value={documentName}
              onChange={(event) => setDocumentName(event.target.value)}
              placeholder="KYC Pack"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label>Client household</Label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger>
                  <SelectValue />
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
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="advisory">Advisory</SelectItem>
                  <SelectItem value="onboarding">Onboarding</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="file">File</Label>
            <Input
              id="file"
              type="file"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
          </div>
          {error ? (
            <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Uploading..." : "Upload document"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
