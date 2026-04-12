import { NextResponse } from "next/server";
import { getArtistsRepository } from "@/lib/db/repository";

export async function GET() {
  const artists = await getArtistsRepository();
  return NextResponse.json({ items: artists, total: artists.length });
}
