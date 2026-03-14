import { redirect } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrandMark } from "@/components/shell/brand-mark";
import { LoginForm } from "@/components/forms/login-form";
import { createClient } from "@/lib/supabase/server";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const supabase = await createClient();
  const next = (await searchParams).next;

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      redirect("/dashboard");
    }
  }

  return (
    <div
      className="grid min-h-screen overflow-hidden bg-background lg:grid-cols-[1.1fr_0.9fr]"
      style={{
        backgroundImage:
          "radial-gradient(circle at top left, color-mix(in oklch, var(--primary) 18%, transparent), transparent 34rem), radial-gradient(circle at bottom right, color-mix(in oklch, var(--chart-2) 14%, transparent), transparent 28rem), linear-gradient(180deg, color-mix(in oklch, var(--background) 82%, transparent), color-mix(in oklch, var(--background) 92%, var(--muted)))",
      }}
    >
      <div className="hidden flex-col justify-between border-r border-border/60 bg-background/45 p-10 backdrop-blur-sm lg:flex">
        <BrandMark />
        <div className="max-w-xl space-y-6 rounded-[2rem] border border-border/60 bg-background/72 p-8 shadow-lg shadow-black/5 backdrop-blur-sm">
          <Badge variant="secondary">Advisor OS</Badge>
          <h1 className="text-5xl font-semibold tracking-tight text-foreground">
            Client relationships, portfolio intelligence, and compliance rhythm
            in one place.
          </h1>
          <p className="max-w-lg text-base leading-7 text-muted-foreground">
            WealthFlow is shaped from the product blueprint for modern advisory
            firms: CRM, AUM visibility, meeting prep, task execution, and
            document governance under one clean SaaS surface.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["₹36.2 Cr", "Tracked AUM"],
            ["20", "Active households"],
            ["98%", "Compliance readiness"],
          ].map(([value, label]) => (
            <div
              key={label}
              className="rounded-3xl border border-border/60 bg-card/78 p-5 shadow-sm shadow-black/5 backdrop-blur-sm"
            >
              <p className="text-2xl font-semibold">{value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center px-4 py-10 sm:px-8">
        <Card className="w-full max-w-lg border border-border/60 bg-card/90 shadow-2xl shadow-black/10 backdrop-blur-xl">
          <CardHeader className="space-y-3 border-b border-border/60">
            <Badge variant="outline" className="w-fit">
              Secure advisor access
            </Badge>
            <CardTitle
              aria-level={1}
              className="text-3xl font-semibold tracking-tight"
              role="heading"
            >
              Log in to WealthFlow
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <LoginForm next={next} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
