import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getSupabaseBrowserEnv } from "@/lib/supabase/config";
import type { Database } from "@/types/database";

export async function createClient() {
  const { url, key, isConfigured } = getSupabaseBrowserEnv();

  if (!isConfigured) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(url!, key!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot write cookies during render.
        }
      },
    },
  });
}
