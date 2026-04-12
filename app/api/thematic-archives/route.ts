import { NextResponse } from "next/server";
import { getThematicArchivesRepository } from "@/lib/db/repository";

export async function GET() {
  const thematicArchives = await getThematicArchivesRepository();
  return NextResponse.json({ items: thematicArchives, total: thematicArchives.length });
}
