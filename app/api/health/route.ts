import { NextResponse } from "next/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "ankorpus-api",
    timestamp: new Date().toISOString(),
    supabaseConfigured: hasSupabaseEnv(),
  });
}
