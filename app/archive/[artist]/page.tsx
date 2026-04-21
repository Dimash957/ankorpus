import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArchiveExplorer } from "@/components/archive-explorer";
import {
  getArtistBySlugRepository,
  getArtistsRepository,
  getSongsRepository,
  getSongsByArtistRepository,
} from "@/lib/db/repository";

interface RouteProps {
  params: Promise<{ artist: string }>;
}

export async function generateStaticParams() {
  const artists = await getArtistsRepository();
  return artists.map((artist) => ({ artist: artist.slug }));
}

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { artist } = await params;
  const record = await getArtistBySlugRepository(artist);

  if (!record) {
    return { title: "Мұрағат табылмады" };
  }

  return {
    title: `${record.name} мұрағаты`,
    description: `${record.name} ән мәтіндерінің аннотацияланған корпусы (${record.years}).`,
  };
}

export default async function ArchiveArtistPage({ params }: RouteProps) {
  const { artist } = await params;
  const record = await getArtistBySlugRepository(artist);

  if (!record) {
    notFound();
  }

  const [artistSongs, allArtists, allSongs] = await Promise.all([
    getSongsByArtistRepository(record.slug),
    getArtistsRepository(),
    getSongsRepository({ limit: 5000 }),
  ]);

  return (
    <div className="section-shell py-10 sm:py-14">
      <header className="mb-8">
        <p className="section-kicker">Artist Archive</p>
        <h1 className="text-4xl font-semibold sm:text-5xl">{record.name} мұрағаты</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-text-secondary">
          Әндер кестесімен жұмыс істеп, толық мәтінді аннотациялар қабатымен ашыңыз. POS, lemma,
          named entity және XML/TEI көріністері осы бетте қолжетімді.
        </p>
      </header>

      <ArchiveExplorer artist={record} songs={artistSongs} allArtists={allArtists} allSongs={allSongs} />
    </div>
  );
}
