import { NextResponse } from "next/server";
import { createSongRepository } from "@/lib/db/repository";

export async function POST(request: Request) {
  const payload = await request.json();

  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ message: "Жарамсыз payload" }, { status: 400 });
  }

  const body = payload as Record<string, unknown>;

  if (
    typeof body.title !== "string" ||
    typeof body.artistSlug !== "string" ||
    typeof body.genre !== "string" ||
    typeof body.archiveType !== "string" ||
    typeof body.year !== "number" ||
    !Array.isArray(body.sections)
  ) {
    return NextResponse.json(
      {
        message: "Міндетті өрістер: title, artistSlug, year, genre, archiveType, sections[]",
      },
      { status: 400 },
    );
  }

  const result = await createSongRepository({
    id: typeof body.id === "string" ? body.id : undefined,
    title: body.title,
    artistSlug: body.artistSlug,
    year: body.year,
    genre: body.genre,
    archiveType: body.archiveType as "жеке мұрағат" | "тақырыптық мұрағат" | "аралас қор",
    tags: Array.isArray(body.tags) ? body.tags.filter((tag): tag is string => typeof tag === "string") : [],
    chartsRank: typeof body.chartsRank === "number" ? body.chartsRank : 0,
    sections: body.sections as Array<{ type: "verse" | "chorus" | "bridge"; lines: string[] }>,
  });

  if (!result.ok) {
    return NextResponse.json({ message: result.message }, { status: result.status });
  }

  return NextResponse.json({ item: result.data }, { status: 201 });
}
