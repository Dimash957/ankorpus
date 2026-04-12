import type { Metadata } from "next";
import { SearchExplorer } from "@/components/search-explorer";
import { getSearchDatasetRepository } from "@/lib/db/repository";

export const metadata: Metadata = {
  title: "Іздеу",
  description: "Ән мәтіндерін кеңейтілген фильтрлер арқылы іздеу және concordance талдау.",
};

export default async function SearchPage() {
  const { songs, artists, genres, yearRange } = await getSearchDatasetRepository();

  return (
    <div className="section-shell py-10 sm:py-14">
      <header className="mb-8">
        <p className="section-kicker">Corpus Explorer</p>
        <h1 className="max-w-3xl text-4xl font-semibold sm:text-5xl">Іздеу және concordance модулі</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-text-secondary">
          Толықмәтіндік іздеу, KWIC көрінісі және коллокация режимі арқылы корпус ішіндегі тілдік
          үлгілерді бір интерфейсте салыстырыңыз.
        </p>
      </header>

      <SearchExplorer songs={songs} artists={artists} genres={genres} yearRange={yearRange} />
    </div>
  );
}
