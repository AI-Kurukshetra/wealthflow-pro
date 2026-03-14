import { DocumentUploadDialog } from "@/components/documents/document-upload-dialog";
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
import { formatDate, formatFileSize } from "@/lib/format";
import { getDocumentsPageData } from "@/lib/wealthflow/server";

export default async function DocumentsPage() {
  const { clients, documents, organizationId, workspace } = await getDocumentsPageData();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Document storage"
        title="Client document vault"
        description="Storage metadata, category governance, and upload pathways aligned with private advisory workflows."
        actions={
          <DocumentUploadDialog
            clients={clients}
            organizationId={organizationId}
            viewerId={workspace.user.id}
          />
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
                <TableHead>Size</TableHead>
                <TableHead className="text-right">Download</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((document) => (
                <TableRow key={document.id}>
                  <TableCell className="font-medium">{document.name}</TableCell>
                  <TableCell>{document.clientName}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{document.document_category}</Badge>
                  </TableCell>
                  <TableCell>{formatDate(document.uploaded_at)}</TableCell>
                  <TableCell>{formatFileSize(document.size_bytes)}</TableCell>
                  <TableCell className="text-right">
                    <a
                      className="text-sm font-medium text-primary hover:underline"
                      href={`/api/documents/${document.id}/download`}
                    >
                      Download
                    </a>
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
