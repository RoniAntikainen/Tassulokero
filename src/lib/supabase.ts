import { createClient, SupabaseClient } from "@supabase/supabase-js";

import { getEnv, hasSupabaseEnv } from "./env";
import type { Database } from "./database.types";

let client: SupabaseClient<Database> | null = null;

export function getSupabaseClient() {
  if (!hasSupabaseEnv()) {
    return null;
  }

  if (!client) {
    const env = getEnv();
    client = createClient(env.supabaseUrl, env.supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }

  return client;
}
