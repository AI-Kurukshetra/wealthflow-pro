"use client";

import Link from "next/link";
import { useActionState } from "react";
import { IconLock, IconMail } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authenticateAction, type AuthActionState } from "@/lib/auth/actions";

const initialState: AuthActionState = {};

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(authenticateAction, initialState);

  return (
    <form className="flex flex-col gap-5" action={formAction}>
      <input type="hidden" name="next" value={next ?? "/dashboard"} />
      <div className="grid gap-2">
        <label className="text-sm font-medium" htmlFor="email">
          Email
        </label>
        <div className="relative">
          <IconMail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-10"
            defaultValue="vineeth.motati@wealthflow.in"
            id="email"
            name="email"
            placeholder="advisor@wealthflow.in"
            type="email"
          />
        </div>
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium" htmlFor="password">
          Password
        </label>
        <div className="relative">
          <IconLock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-10"
            defaultValue="WealthFlow123!"
            id="password"
            name="password"
            placeholder="Enter your password"
            type="password"
          />
        </div>
      </div>
      {state?.message ? (
        <p className="rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {state.message}
        </p>
      ) : null}
      <div className="grid gap-3">
        <Button
          className="w-full"
          name="intent"
          size="lg"
          type="submit"
          value="login"
          disabled={pending}
        >
          {pending ? "Opening workspace..." : "Enter WealthFlow"}
        </Button>
        <Button
          className="w-full"
          name="intent"
          size="lg"
          type="submit"
          value="create-demo"
          variant="outline"
          disabled={pending}
        >
          {pending ? "Preparing workspace..." : "Create demo workspace"}
        </Button>
      </div>
      <div className="flex flex-col items-start gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>Use the default advisor credentials or create the workspace on first run.</span>
        <Link className="text-primary hover:underline" href="/settings">
          Demo settings
        </Link>
      </div>
    </form>
  );
}
