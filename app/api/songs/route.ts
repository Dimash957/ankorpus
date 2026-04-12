import { NextResponse } from "next/server";
import type { ArchiveType } from "@/lib/data";
import { getSongsRepository } from "@/lib/db/repository";

function parseCsv(value: string | null) {
  if (!value) {
    return [] as string[];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") ?? undefined;
  const artistSlugs = parseCsv(url.searchParams.get("artists"));
  const genres = parseCsv(url.searchParams.get("genres"));
  const archiveType = (url.searchParams.get("archiveType") ?? undefined) as ArchiveType | "барлығы" | undefined;

  const yearMinRaw = url.searchParams.get("yearMin");
  const yearMaxRaw = url.searchParams.get("yearMax");
  const limitRaw = url.searchParams.get("limit");
  const offsetRaw = url.searchParams.get("offset");

  const yearMin = yearMinRaw ? Number(yearMinRaw) : undefined;
  const yearMax = yearMaxRaw ? Number(yearMaxRaw) : undefined;
  const limit = limitRaw ? Number(limitRaw) : undefined;
  const offset = offsetRaw ? Number(offsetRaw) : undefined;

  const songs = await getSongsRepository({
    query,
    artistSlugs,
    genres,
    archiveType,
    yearMin: Number.isFinite(yearMin) ? yearMin : undefined,
    yearMax: Number.isFinite(yearMax) ? yearMax : undefined,
    limit: Number.isFinite(limit) ? limit : undefined,
    offset: Number.isFinite(offset) ? offset : undefined,
  });

  return NextResponse.json({ items: songs, total: songs.length });
}
