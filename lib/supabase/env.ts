const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function hasSupabaseEnv() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

export function hasServiceRoleKey() {
  return Boolean(SUPABASE_SERVICE_ROLE_KEY);
}

export function getSupabaseEnv() {
  if (!hasSupabaseEnv()) {
    throw new Error("Supabase environment is not configured");
  }

  return {
    url: SUPABASE_URL as string,
    anonKey: SUPABASE_ANON_KEY as string,
  };
}

export function getServiceRoleKey() {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing");
  }
  return SUPABASE_SERVICE_ROLE_KEY;
}
