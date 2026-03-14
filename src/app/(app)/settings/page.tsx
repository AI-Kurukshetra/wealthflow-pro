import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingsForm } from "@/components/forms/settings-form";
import { PageHeader } from "@/components/shell/page-header";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Configuration"
        title="Workspace settings"
        description="Firm identity, reporting defaults, and the operational assumptions that power the WealthFlow shell."
      />
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader className="border-b border-border/60">
            <CardTitle>Firm profile</CardTitle>
          </CardHeader>
          <CardContent className="pt-5">
            <SettingsForm />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="border-b border-border/60">
            <CardTitle>Operational defaults</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-5 text-sm text-muted-foreground">
            <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
              Review cadence
              <div className="mt-2">
                <Badge variant="secondary">Quarterly for HNI households</Badge>
              </div>
            </div>
            <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
              Compliance posture
              <div className="mt-2">
                <Badge variant="outline">SEBI readiness template loaded</Badge>
              </div>
            </div>
            <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
              Notifications
              <p className="mt-2">Email summaries at 7:30 AM and same-day task reminders.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
