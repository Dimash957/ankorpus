import Link from "next/link";
import type { ArtistArchive } from "@/lib/data";

interface ArtistArchiveCardProps {
  artist: ArtistArchive;
}

export function ArtistArchiveCard({ artist }: ArtistArchiveCardProps) {
  return (
    <article className="group glass-card relative overflow-hidden rounded-3xl border border-subtle bg-bg-card/80 p-5 shadow-soft transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-glow">
      <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-accent-primary/25 blur-3xl" />

      <div className="relative z-10">
        <div className="mb-5 flex items-center gap-4">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-primary/80 to-accent-secondary/70 text-xl font-semibold text-white">
            {artist.name.split(" ")[0].slice(0, 1)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">{artist.name}</h3>
            <p className="text-xs text-text-secondary">{artist.summary}</p>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          <span className="rounded-full border border-subtle bg-white/5 px-3 py-1 text-xs text-text-primary">{artist.years}</span>
          <span className="rounded-full border border-subtle bg-accent-secondary/15 px-3 py-1 text-xs text-accent-secondary">
            {artist.songCount.toLocaleString("kk-KZ")} ән
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {artist.genres.slice(0, 3).map((genre) => (
            <span key={genre} className="rounded-full border border-subtle bg-white/5 px-2.5 py-1 text-[11px] text-text-secondary">
              {genre}
            </span>
          ))}
        </div>

        <Link
          href={`/archive/${artist.slug}`}
          className="mt-6 inline-flex items-center rounded-full bg-accent-primary px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-accent-primary/85"
        >
          Ашу →
        </Link>
      </div>
    </article>
  );
}
