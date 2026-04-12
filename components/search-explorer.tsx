"use client";

import Link from "next/link";
import Fuse from "fuse.js";
import { Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import type { ArtistArchive, Song, ArchiveType } from "@/lib/data";
import { archiveTypeOptions, getSongText } from "@/lib/data";
import { cn } from "@/lib/utils";

interface SearchExplorerProps {
  songs: Song[];
  artists: ArtistArchive[];
  genres: string[];
  yearRange: { min: number; max: number };
}

type ViewMode = "cards" | "kwic";
type SearchMode = "text" | "collocate";

function toLower(value: string) {
  return value.toLocaleLowerCase("kk");
}

function tokenize(text: string) {
  return (text.match(/[\p{L}\p{N}-]+/gu) ?? []).map((token) => toLower(token));
}

function renderHighlighted(text: string, query: string) {
  if (!query.trim()) {
    return text;
  }

  const needle = query.toLocaleLowerCase("kk");
  const lower = text.toLocaleLowerCase("kk");
  const index = lower.indexOf(needle);

  if (index < 0) {
    return text;
  }

  const before = text.slice(0, index);
  const middle = text.slice(index, index + query.length);
  const after = text.slice(index + query.length);

  return (
    <>
      {before}
      <mark className="rounded bg-accent-primary/30 px-1 py-0.5 text-text-primary">{middle}</mark>
      {after}
    </>
  );
}

function getKwic(text: string, query: string) {
  if (!query.trim()) {
    return text.slice(0, 120);
  }

  const lower = text.toLocaleLowerCase("kk");
  const needle = query.toLocaleLowerCase("kk");
  const index = lower.indexOf(needle);

  if (index < 0) {
    return text.slice(0, 120);
  }

  const start = Math.max(0, index - 32);
  const end = Math.min(text.length, index + query.length + 42);
  const snippet = text.slice(start, end);

  return `${start > 0 ? "..." : ""}${snippet}${end < text.length ? "..." : ""}`;
}

function buildCollocates(songs: Song[], query: string) {
  const needle = query.trim().toLocaleLowerCase("kk");
  if (!needle) {
    return [] as Array<{ word: string; score: number }>;
  }

  const frequency = new Map<string, number>();

  songs.forEach((song) => {
    const words = tokenize(getSongText(song));
    words.forEach((word, idx) => {
      if (word !== needle) {
        return;
      }

      const left = words[idx - 1];
      const right = words[idx + 1];
      if (left && left !== needle) {
        frequency.set(left, (frequency.get(left) ?? 0) + 1);
      }
      if (right && right !== needle) {
        frequency.set(right, (frequency.get(right) ?? 0) + 1);
      }
    });
  });

  return [...frequency.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word, score]) => ({ word, score }));
}

export function SearchExplorer({ songs, artists, genres, yearRange }: SearchExplorerProps) {
  const [query, setQuery] = useState("");
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [archiveType, setArchiveType] = useState<ArchiveType | "барлығы">("барлығы");
  const [yearMin, setYearMin] = useState(yearRange.min);
  const [yearMax, setYearMax] = useState(yearRange.max);
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [searchMode, setSearchMode] = useState<SearchMode>("text");

  const fuse = useMemo(
    () =>
      new Fuse(
        songs.map((song) => ({
          ...song,
          text: getSongText(song),
          artistName: artists.find((artist) => artist.slug === song.artistSlug)?.name ?? song.artistSlug,
        })),
        {
          includeScore: true,
          threshold: 0.34,
          keys: ["title", "text", "artistName", "genre", "tags"],
        },
      ),
    [artists, songs],
  );

  const textResults = useMemo(() => {
    const base = query.trim() ? fuse.search(query).map((item) => item.item as Song & { text: string; artistName: string }) : songs.map((song) => ({ ...song, text: getSongText(song), artistName: artists.find((artist) => artist.slug === song.artistSlug)?.name ?? song.artistSlug }));

    return base.filter((song) => {
      const byArtist = selectedArtists.length === 0 || selectedArtists.includes(song.artistSlug);
      const byYear = song.year >= yearMin && song.year <= yearMax;
      const byGenre = selectedGenres.length === 0 || selectedGenres.includes(song.genre);
      const byArchive = archiveType === "барлығы" || song.archiveType === archiveType;
      return byArtist && byYear && byGenre && byArchive;
    });
  }, [archiveType, artists, fuse, query, selectedArtists, selectedGenres, songs, yearMax, yearMin]);

  const collocates = useMemo(() => buildCollocates(textResults, query), [query, textResults]);

  const toggleArtist = (slug: string) => {
    setSelectedArtists((prev) => (prev.includes(slug) ? prev.filter((item) => item !== slug) : [...prev, slug]));
  };

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) => (prev.includes(genre) ? prev.filter((item) => item !== genre) : [...prev, genre]));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="glass-card sticky top-24 h-fit rounded-3xl border border-subtle bg-bg-card/70 p-5">
        <div className="mb-4 flex items-center gap-2 text-sm text-text-primary">
          <SlidersHorizontal size={16} />
          <span>Кеңейтілген фильтрлер</span>
        </div>

        <section className="space-y-3 border-b border-subtle pb-5">
          <h2 className="text-xs uppercase tracking-[0.14em] text-text-secondary">Орындаушы</h2>
          <div className="max-h-44 space-y-2 overflow-auto pr-2">
            {artists.map((artist) => (
              <label key={artist.slug} className="flex cursor-pointer items-center gap-2 text-sm text-text-secondary">
                <input
                  type="checkbox"
                  checked={selectedArtists.includes(artist.slug)}
                  onChange={() => toggleArtist(artist.slug)}
                  className="h-4 w-4 rounded border-subtle bg-bg-secondary accent-accent-primary"
                />
                <span>{artist.name}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="space-y-4 border-b border-subtle py-5">
          <h2 className="text-xs uppercase tracking-[0.14em] text-text-secondary">Жыл аралығы</h2>
          <div>
            <label htmlFor="year-min" className="mb-1 block text-xs text-text-secondary">
              Мин: {yearMin}
            </label>
            <input
              id="year-min"
              type="range"
              min={yearRange.min}
              max={yearRange.max}
              value={yearMin}
              onChange={(event) => setYearMin(Math.min(Number(event.target.value), yearMax))}
              className="w-full accent-accent-primary"
            />
          </div>
          <div>
            <label htmlFor="year-max" className="mb-1 block text-xs text-text-secondary">
              Макс: {yearMax}
            </label>
            <input
              id="year-max"
              type="range"
              min={yearRange.min}
              max={yearRange.max}
              value={yearMax}
              onChange={(event) => setYearMax(Math.max(Number(event.target.value), yearMin))}
              className="w-full accent-accent-secondary"
            />
          </div>
        </section>

        <section className="space-y-3 border-b border-subtle py-5">
          <h2 className="text-xs uppercase tracking-[0.14em] text-text-secondary">Жанр</h2>
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <button
                key={genre}
                type="button"
                onClick={() => toggleGenre(genre)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition-colors",
                  selectedGenres.includes(genre)
                    ? "border-accent-secondary/50 bg-accent-secondary/20 text-accent-secondary"
                    : "border-subtle bg-white/5 text-text-secondary hover:text-text-primary",
                )}
              >
                {genre}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-3 pt-5">
          <h2 className="text-xs uppercase tracking-[0.14em] text-text-secondary">Мұрағат түрі</h2>
          <label className="flex items-center gap-2 text-sm text-text-secondary">
            <input
              type="radio"
              checked={archiveType === "барлығы"}
              onChange={() => setArchiveType("барлығы")}
              className="accent-accent-primary"
            />
            Барлығы
          </label>
          {archiveTypeOptions.map((item) => (
            <label key={item} className="flex items-center gap-2 text-sm text-text-secondary">
              <input
                type="radio"
                checked={archiveType === item}
                onChange={() => setArchiveType(item)}
                className="accent-accent-primary"
              />
              {item}
            </label>
          ))}
        </section>
      </aside>

      <section className="space-y-5">
        <div className="glass-card rounded-3xl border border-subtle bg-bg-card/70 p-4 sm:p-5">
          <label htmlFor="query" className="mb-2 block text-sm text-text-secondary">
            Толықмәтіндік іздеу
          </label>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
              <input
                id="query"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Сөз, тіркес немесе орындаушыны теріңіз..."
                className="h-12 w-full rounded-2xl border border-subtle bg-bg-secondary/80 pl-12 pr-4 text-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary focus:border-accent-primary"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSearchMode("text")}
                className={cn(
                  "rounded-full px-4 py-2 text-xs font-medium",
                  searchMode === "text" ? "bg-accent-primary text-white" : "bg-white/5 text-text-secondary",
                )}
              >
                Мәтін
              </button>
              <button
                type="button"
                onClick={() => setSearchMode("collocate")}
                className={cn(
                  "rounded-full px-4 py-2 text-xs font-medium",
                  searchMode === "collocate" ? "bg-accent-secondary text-bg-primary" : "bg-white/5 text-text-secondary",
                )}
              >
                Коллокация
              </button>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs",
                viewMode === "cards" ? "bg-white/10 text-text-primary" : "text-text-secondary",
              )}
            >
              Карточкалар
            </button>
            <button
              type="button"
              onClick={() => setViewMode("kwic")}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs",
                viewMode === "kwic" ? "bg-white/10 text-text-primary" : "text-text-secondary",
              )}
            >
              Concordance / KWIC
            </button>
          </div>
        </div>

        {searchMode === "collocate" ? (
          <article className="glass-card rounded-3xl border border-subtle bg-bg-card/70 p-5">
            <h3 className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-text-primary">
              <Sparkles size={16} className="text-accent-secondary" />
              Коллокаттар тізімі
            </h3>
            {query.trim().length < 2 ? (
              <p className="text-sm text-text-secondary">Коллокация режимі үшін кемінде 2 таңба енгізіңіз.</p>
            ) : collocates.length === 0 ? (
              <p className="text-sm text-text-secondary">Бұл сұрау бойынша көрші сөздер табылмады.</p>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {collocates.map((item) => (
                  <div key={item.word} className="rounded-2xl border border-subtle bg-white/5 px-3 py-2 text-sm text-text-primary">
                    <span>{item.word}</span>
                    <span className="ml-2 text-xs text-text-secondary">{item.score}</span>
                  </div>
                ))}
              </div>
            )}
          </article>
        ) : null}

        {searchMode === "text" ? (
          <>
            <div className="text-sm text-text-secondary">
              Нәтиже: <span className="font-medium text-text-primary">{textResults.length}</span>
            </div>

            {viewMode === "cards" ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {textResults.map((song) => (
                  <article key={song.id} className="glass-card rounded-3xl border border-subtle bg-bg-card/70 p-4">
                    <p className="text-xs text-text-secondary">{song.year}</p>
                    <h3 className="mt-1 text-base font-semibold text-text-primary">{song.title}</h3>
                    <p className="mt-1 text-sm text-text-secondary">{song.artistName}</p>
                    <p className="mt-3 text-sm leading-6 text-text-primary">{renderHighlighted(getKwic(song.text, query), query)}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full border border-subtle bg-white/5 px-2.5 py-1 text-[11px] text-text-secondary">
                        {song.genre}
                      </span>
                      <span className="rounded-full border border-subtle bg-white/5 px-2.5 py-1 text-[11px] text-text-secondary">
                        {song.archiveType}
                      </span>
                    </div>
                    <Link
                      href={`/archive/${song.artistSlug}`}
                      className="mt-4 inline-flex rounded-full bg-accent-primary px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-accent-primary/85"
                    >
                      Ашу
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {textResults.map((song) => (
                  <article key={song.id} className="glass-card rounded-2xl border border-subtle bg-bg-card/70 px-4 py-3">
                    <p className="text-xs text-text-secondary">
                      {song.artistName} · {song.year} · {song.genre}
                    </p>
                    <h3 className="mt-1 text-sm font-medium text-text-primary">{song.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-text-primary">{renderHighlighted(getKwic(song.text, query), query)}</p>
                  </article>
                ))}
              </div>
            )}

            {textResults.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-subtle bg-bg-card/50 p-10 text-center text-sm text-text-secondary">
                Сұрауға сәйкес нәтиже табылмады. Фильтрлерді кеңейтіп немесе басқа кілтсөз қолданып көріңіз.
              </div>
            ) : null}
          </>
        ) : null}
      </section>
    </div>
  );
}
