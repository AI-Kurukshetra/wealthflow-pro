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
import { getMeetingsPageData } from "@/lib/wealthflow/server";

export default async function MeetingsPage() {
  const { meetings } = await getMeetingsPageData();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Calendar"
        title="Upcoming meetings"
        description="Client reviews, planning calls, and follow-up sessions ready for prep, agenda sharing, and note capture."
        badge={`${meetings.length} live meetings`}
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
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {meetings.map((meeting) => (
                <TableRow key={meeting.id}>
                  <TableCell className="font-medium">{meeting.title}</TableCell>
                  <TableCell>{meeting.clientName}</TableCell>
                  <TableCell>{formatDateTime(meeting.starts_at)}</TableCell>
                  <TableCell>{meeting.channel}</TableCell>
                  <TableCell>{meeting.location}</TableCell>
                  <TableCell>
                    <Badge variant={meeting.status === "scheduled" ? "secondary" : "outline"}>
                      {meeting.status}
                    </Badge>
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
