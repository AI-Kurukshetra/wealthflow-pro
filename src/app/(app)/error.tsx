"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Workspace load issue</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          WealthFlow hit an unexpected rendering issue. Reset the segment to retry.
        </p>
        <Button onClick={reset}>Retry</Button>
      </CardContent>
    </Card>
  );
}
