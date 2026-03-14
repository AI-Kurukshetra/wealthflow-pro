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
import { meetings } from "@/lib/mock-data";

export default function MeetingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Calendar"
        title="Upcoming meetings"
        description="Client reviews, planning calls, and follow-up sessions ready for prep, agenda sharing, and note capture."
        badge="10 seeded meetings"
      />
      <Card>
        <CardHeader className="border-b border-border/60">
          <CardTitle>Meeting schedule</CardTitle>
        </CardHeader>
        <CardContent className="pt-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Meeting</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {meetings.map((meeting) => (
                <TableRow key={meeting.id}>
                  <TableCell className="font-medium">{meeting.title}</TableCell>
                  <TableCell>{meeting.clientName}</TableCell>
                  <TableCell>{formatDateTime(meeting.startsAt)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{meeting.channel}</Badge>
                  </TableCell>
                  <TableCell>{meeting.location}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
