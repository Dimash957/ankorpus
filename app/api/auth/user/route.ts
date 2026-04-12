import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/supabase/auth";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  return NextResponse.json(
    {
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.created_at,
      },
    },
    { status: 200 },
  );
}
