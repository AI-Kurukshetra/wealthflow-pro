"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

export type AuthActionState = {
  message?: string;
};

const authSchema = z.object({
  email: z.string().email("Enter a valid work email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  intent: z.enum(["login", "create-demo"]),
  next: z.string().optional(),
});

export async function authenticateAction(
  _previousState: AuthActionState | undefined,
  formData: FormData
) {
  const parsed = authSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    intent: formData.get("intent"),
    next: formData.get("next"),
  });

  if (!parsed.success) {
    return {
      message:
        parsed.error.flatten().fieldErrors.email?.[0] ??
        parsed.error.flatten().fieldErrors.password?.[0] ??
        "Enter a valid email and password.",
    } satisfies AuthActionState;
  }

  const supabase = await createClient();

  if (!supabase) {
    return {
      message:
        "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    } satisfies AuthActionState;
  }

  const { email, password, intent, next } = parsed.data;

  if (intent === "create-demo") {
    const signInResult = await supabase.auth.signInWithPassword({ email, password });

    if (signInResult.error) {
      const shouldCreateAccount = signInResult.error.message
        .toLowerCase()
        .includes("invalid login credentials");

      if (!shouldCreateAccount) {
        return {
          message: signInResult.error.message,
        } satisfies AuthActionState;
      }

      const signUpResult = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: "Vineeth Motati",
          },
        },
      });

      if (signUpResult.error) {
        return {
          message: signUpResult.error.message,
        } satisfies AuthActionState;
      }

      if (!signUpResult.data.session) {
        return {
          message:
            "Account created. Confirm the email in Supabase Auth, then sign in again to finish setup.",
        } satisfies AuthActionState;
      }
    }

    redirect("/setup");
  }

  const loginResult = await supabase.auth.signInWithPassword({ email, password });

  if (loginResult.error) {
    return {
      message: loginResult.error.message,
    } satisfies AuthActionState;
  }

  redirect(getSafeRedirect(next));
}

export async function signOutAction() {
  const supabase = await createClient();

  if (supabase) {
    await supabase.auth.signOut({ scope: "local" });
  }

  redirect("/login");
}

function getSafeRedirect(value?: string) {
  if (!value?.startsWith("/") || value.startsWith("//")) {
    return "/dashboard";
  }

  return value;
}
