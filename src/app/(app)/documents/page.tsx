import { IconUpload } from "@tabler/icons-react";

import { PageHeader } from "@/components/shell/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/format";
import { documents } from "@/lib/mock-data";

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Document storage"
        title="Client document vault"
        description="Storage metadata, category governance, and upload pathways aligned with private advisory workflows."
        actions={
          <Dialog>
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
                  The scaffold reserves this dialog for signed uploads and private
                  bucket handling.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-3">
                <Input placeholder="Document name" />
                <Input placeholder="Client household" />
                <Input type="file" />
              </div>
            </DialogContent>
          </Dialog>
        }
      />
      <Card>
        <CardHeader className="border-b border-border/60">
          <CardTitle>Stored files</CardTitle>
        </CardHeader>
        <CardContent className="pt-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Uploaded</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((document) => (
                <TableRow key={document.id}>
                  <TableCell className="font-medium">{document.name}</TableCell>
                  <TableCell>{document.clientName}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{document.category}</Badge>
                  </TableCell>
                  <TableCell>{formatDate(document.uploadedAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
