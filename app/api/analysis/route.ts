import { NextResponse } from "next/server";
import { getAnalysisDatasetRepository } from "@/lib/db/repository";

export async function GET() {
  const data = await getAnalysisDatasetRepository();
  return NextResponse.json(data);
}
