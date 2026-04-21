"use client";

import { X } from "lucide-react";
import { useMemo, useState } from "react";
import type { ArtistAnalysisProfile, ArtistArchive, Song } from "@/lib/data";
import { annotateLine, buildTeiXml, compareArtistProfiles, getArtistAnalysisProfile } from "@/lib/data";
import { cn } from "@/lib/utils";

type SortKey = "year-desc" | "year-asc" | "title-asc";

interface ArchiveExplorerProps {
  artist: ArtistArchive;
  songs: Song[];
  allArtists: ArtistArchive[];
  allSongs: Song[];
}

interface AnnotationState {
  lemma: boolean;
  pos: boolean;
  namedEntity: boolean;
}

function formatNumber(value: number, digits = 2) {
  if (!Number.isFinite(value)) {
    return "0";
  }

  if (Number.isInteger(value)) {
    return String(value);
  }

  return value.toFixed(digits);
}

function formatPercent(value: number) {
  return `${formatNumber(value, 2)}%`;
}

function AnalysisCards({ profile }: { profile: ArtistAnalysisProfile }) {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <article className="glass-card rounded-3xl border border-subtle bg-bg-card/70 p-5">
        <p className="text-xs uppercase tracking-[0.14em] text-text-secondary">Морфологиялық талдау</p>
        <div className="mt-3 space-y-1 text-sm text-text-primary">
          <p>Токен саны: {formatNumber(profile.morphological.totalTokens)}</p>
          <p>Бірегей lemma: {formatNumber(profile.morphological.uniqueLemmas)}</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {profile.morphological.posDistribution.slice(0, 6).map((item) => (
            <span key={item.label} className="rounded-full border border-subtle bg-white/5 px-2.5 py-1 text-xs text-text-secondary">
              {item.label}: {formatPercent(item.share)}
            </span>
          ))}
        </div>
      </article>

      <article className="glass-card rounded-3xl border border-subtle bg-bg-card/70 p-5">
        <p className="text-xs uppercase tracking-[0.14em] text-text-secondary">Лексикалық талдау</p>
        <div className="mt-3 space-y-1 text-sm text-text-primary">
          <p>Барлық сөз: {formatNumber(profile.lexical.totalWords)}</p>
          <p>Бірегей сөз: {formatNumber(profile.lexical.uniqueWords)}</p>
          <p>TTR: {formatPercent(profile.lexical.typeTokenRatio)}</p>
          <p>Орташа сөз ұзындығы: {formatNumber(profile.lexical.avgWordLength)} таңба</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {profile.lexical.topWords.slice(0, 8).map((item) => (
            <span key={item.word} className="rounded-full border border-subtle bg-white/5 px-2.5 py-1 text-xs text-text-secondary">
              {item.word} ({item.count})
            </span>
          ))}
        </div>
      </article>

      <article className="glass-card rounded-3xl border border-subtle bg-bg-card/70 p-5">
        <p className="text-xs uppercase tracking-[0.14em] text-text-secondary">Синтаксистік талдау</p>
        <div className="mt-3 space-y-1 text-sm text-text-primary">
          <p>Жол саны: {formatNumber(profile.syntactic.totalLines)}</p>
          <p>Орташа сөз/жол: {formatNumber(profile.syntactic.avgWordsPerLine)}</p>
          <p>Күрделі жолдар: {formatPercent(profile.syntactic.complexLineShare)}</p>
          <p>Пунктуация/жол: {formatNumber(profile.syntactic.punctuationPerLine)}</p>
          <p>Байланыстырушы тығыздығы: {formatPercent(profile.syntactic.conjunctionDensity)}</p>
        </div>
      </article>
    </div>
  );
}

export function ArchiveExplorer({ artist, songs, allArtists, allSongs }: ArchiveExplorerProps) {
  const [sortKey, setSortKey] = useState<SortKey>("year-desc");
  const [query, setQuery] = useState("");
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [teiView, setTeiView] = useState(false);
  const [annotations, setAnnotations] = useState<AnnotationState>({
    lemma: true,
    pos: true,
    namedEntity: false,
  });

  const genres = useMemo(() => Array.from(new Set(songs.map((song) => song.genre))), [songs]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const comparisonArtists = useMemo(
    () => allArtists.filter((item) => item.slug !== artist.slug),
    [allArtists, artist.slug],
  );
  const [compareArtistSlug, setCompareArtistSlug] = useState<string>(comparisonArtists[0]?.slug ?? "");

  const activeCompareArtistSlug = comparisonArtists.some((item) => item.slug === compareArtistSlug)
    ? compareArtistSlug
    : (comparisonArtists[0]?.slug ?? "");

  const currentAnalysis = useMemo(() => getArtistAnalysisProfile(songs), [songs]);

  const compareArtist = useMemo(
    () => comparisonArtists.find((item) => item.slug === activeCompareArtistSlug) ?? null,
    [activeCompareArtistSlug, comparisonArtists],
  );

  const compareSongs = useMemo(
    () => allSongs.filter((song) => song.artistSlug === activeCompareArtistSlug),
    [activeCompareArtistSlug, allSongs],
  );

  const comparison = useMemo(() => compareArtistProfiles(songs, compareSongs), [songs, compareSongs]);

  const selectedSongAnalysis = useMemo(
    () => (selectedSong ? getArtistAnalysisProfile([selectedSong]) : null),
    [selectedSong],
  );

  const filtered = useMemo(() => {
    const base = songs.filter((song) => {
      const byQuery =
        query.trim().length === 0 ||
        song.title.toLocaleLowerCase("kk").includes(query.toLocaleLowerCase("kk")) ||
        song.tags.some((tag) => tag.toLocaleLowerCase("kk").includes(query.toLocaleLowerCase("kk")));
      const byGenre = selectedGenres.length === 0 || selectedGenres.includes(song.genre);
      return byQuery && byGenre;
    });

    return base.sort((a, b) => {
      if (sortKey === "year-asc") return a.year - b.year;
      if (sortKey === "title-asc") return a.title.localeCompare(b.title, "kk");
      return b.year - a.year;
    });
  }, [query, selectedGenres, songs, sortKey]);

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) => (prev.includes(genre) ? prev.filter((item) => item !== genre) : [...prev, genre]));
  };

  return (
    <div className="space-y-6">
      <section className="glass-card rounded-3xl border border-subtle bg-bg-card/70 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-text-primary">{artist.name}</h2>
            <p className="mt-1 text-sm text-text-secondary">
              {artist.years} · {songs.length} үлгілік ән · {artist.genres.join(", ")}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {artist.genres.map((genre) => (
              <span key={genre} className="rounded-full border border-subtle bg-white/5 px-3 py-1 text-xs text-text-secondary">
                {genre}
              </span>
            ))}
          </div>
        </div>
      </section>

      <AnalysisCards profile={currentAnalysis} />

      <section className="glass-card rounded-3xl border border-subtle bg-bg-card/70 p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Әртіс/топтар арасындағы толық салыстыру</h3>
            <p className="mt-1 text-sm text-text-secondary">
              Морфологиялық, лексикалық және синтаксистік көрсеткіштерді басқа орындаушымен салыстырыңыз.
            </p>
          </div>
          <select
            value={activeCompareArtistSlug}
            onChange={(event) => setCompareArtistSlug(event.target.value)}
            className="h-11 rounded-2xl border border-subtle bg-bg-secondary/80 px-4 text-sm text-text-primary outline-none"
            disabled={comparisonArtists.length === 0}
          >
            {comparisonArtists.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {compareArtist ? (
          <>
            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              <div className="rounded-2xl border border-subtle bg-bg-secondary/50 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-text-secondary">Ұқсастық индексі</p>
                <p className="mt-2 text-2xl font-semibold text-text-primary">{formatPercent(comparison.similarityScore)}</p>
                <p className="mt-1 text-xs text-text-secondary">{artist.name} ↔ {compareArtist.name}</p>
              </div>
              <div className="rounded-2xl border border-subtle bg-bg-secondary/50 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-text-secondary">Ортақ лексема</p>
                <p className="mt-2 text-2xl font-semibold text-text-primary">{comparison.sharedTopWords.length}</p>
                <p className="mt-1 text-xs text-text-secondary">Top сөздік қиылысуы</p>
              </div>
              <div className="rounded-2xl border border-subtle bg-bg-secondary/50 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-text-secondary">Ортақ сөздер</p>
                <p className="mt-2 text-sm leading-6 text-text-primary">
                  {comparison.sharedTopWords.length > 0 ? comparison.sharedTopWords.join(", ") : "Ортақ top сөз табылмады"}
                </p>
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border border-subtle">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-white/5 text-text-secondary">
                  <tr>
                    <th className="px-4 py-3 font-medium">Көрсеткіш</th>
                    <th className="px-4 py-3 font-medium">{artist.name}</th>
                    <th className="px-4 py-3 font-medium">{compareArtist.name}</th>
                    <th className="px-4 py-3 font-medium">Айырма</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.metrics.map((metric) => (
                    <tr key={metric.label} className="border-t border-subtle/70 text-text-primary">
                      <td className="px-4 py-3">{metric.label}</td>
                      <td className="px-4 py-3 text-text-secondary">
                        {formatNumber(metric.current)} {metric.unit}
                      </td>
                      <td className="px-4 py-3 text-text-secondary">
                        {formatNumber(metric.compared)} {metric.unit}
                      </td>
                      <td
                        className={cn(
                          "px-4 py-3 font-medium",
                          metric.delta > 0
                            ? "text-accent-secondary"
                            : metric.delta < 0
                              ? "text-accent-warm"
                              : "text-text-secondary",
                        )}
                      >
                        {metric.delta > 0 ? "+" : ""}
                        {formatNumber(metric.delta)} {metric.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="mt-4 text-sm text-text-secondary">Салыстыру үшін басқа орындаушы/топ табылмады.</p>
        )}
      </section>

      <section className="glass-card rounded-3xl border border-subtle bg-bg-card/70 p-5">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ән атауы немесе тег..."
            className="h-11 rounded-2xl border border-subtle bg-bg-secondary/80 px-4 text-sm text-text-primary outline-none placeholder:text-text-secondary focus:border-accent-primary"
          />
          <select
            value={sortKey}
            onChange={(event) => setSortKey(event.target.value as SortKey)}
            className="h-11 rounded-2xl border border-subtle bg-bg-secondary/80 px-4 text-sm text-text-primary outline-none"
          >
            <option value="year-desc">Жылы: жаңа → ескі</option>
            <option value="year-asc">Жылы: ескі → жаңа</option>
            <option value="title-asc">Атауы: А-Я</option>
          </select>
          <button
            type="button"
            onClick={() => setTeiView((prev) => !prev)}
            className={cn(
              "h-11 rounded-2xl px-4 text-sm font-medium",
              teiView ? "bg-accent-secondary text-bg-primary" : "bg-white/5 text-text-secondary",
            )}
          >
            {teiView ? "XML/TEI көрінісі" : "Мәтін көрінісі"}
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {genres.map((genre) => (
            <button
              key={genre}
              type="button"
              onClick={() => toggleGenre(genre)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs",
                selectedGenres.includes(genre)
                  ? "border-accent-primary/50 bg-accent-primary/20 text-accent-primary"
                  : "border-subtle bg-white/5 text-text-secondary",
              )}
            >
              {genre}
            </button>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-subtle bg-bg-card/60">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-white/5 text-text-secondary">
            <tr>
              <th className="px-4 py-3 font-medium">Ән атауы</th>
              <th className="px-4 py-3 font-medium">Жыл</th>
              <th className="px-4 py-3 font-medium">Жанр</th>
              <th className="px-4 py-3 font-medium">Тегтер</th>
              <th className="px-4 py-3 font-medium">Әрекет</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((song) => (
              <tr key={song.id} className="border-t border-subtle/70 text-text-primary">
                <td className="px-4 py-3">{song.title}</td>
                <td className="px-4 py-3 text-text-secondary">{song.year}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full border border-subtle bg-white/5 px-2.5 py-1 text-xs text-text-secondary">
                    {song.genre}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-text-secondary">{song.tags.join(" · ")}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => setSelectedSong(song)}
                    className="rounded-full bg-accent-primary px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-accent-primary/85"
                  >
                    Ашу
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {selectedSong ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/80 p-4 backdrop-blur-md">
          <div className="max-h-[88vh] w-full max-w-4xl overflow-auto rounded-3xl border border-subtle bg-bg-card p-6 shadow-soft">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="text-xs text-text-secondary">{selectedSong.year} · {selectedSong.genre}</p>
                <h3 className="mt-1 text-2xl font-semibold text-text-primary">{selectedSong.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSong(null)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-subtle bg-white/5 text-text-secondary"
                aria-label="Модалды жабу"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-subtle bg-bg-secondary/60 p-3">
              <p className="text-xs uppercase tracking-[0.12em] text-text-secondary">Аннотация қабаттары</p>
              <label className="flex items-center gap-2 text-xs text-text-secondary">
                <input
                  type="checkbox"
                  checked={annotations.lemma}
                  onChange={(event) => setAnnotations((prev) => ({ ...prev, lemma: event.target.checked }))}
                  className="accent-accent-primary"
                />
                Lemma
              </label>
              <label className="flex items-center gap-2 text-xs text-text-secondary">
                <input
                  type="checkbox"
                  checked={annotations.pos}
                  onChange={(event) => setAnnotations((prev) => ({ ...prev, pos: event.target.checked }))}
                  className="accent-accent-primary"
                />
                POS
              </label>
              <label className="flex items-center gap-2 text-xs text-text-secondary">
                <input
                  type="checkbox"
                  checked={annotations.namedEntity}
                  onChange={(event) => setAnnotations((prev) => ({ ...prev, namedEntity: event.target.checked }))}
                  className="accent-accent-primary"
                />
                Named entity
              </label>
              <button
                type="button"
                onClick={() => setTeiView((prev) => !prev)}
                className="ml-auto rounded-full border border-subtle bg-white/5 px-3 py-1 text-xs text-text-primary"
              >
                {teiView ? "XML/TEI өшіру" : "XML/TEI қосу"}
              </button>
            </div>

            {selectedSongAnalysis ? (
              <div className="mb-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-subtle bg-bg-secondary/50 p-3">
                  <p className="text-xs uppercase tracking-[0.12em] text-text-secondary">Морфология</p>
                  <p className="mt-1 text-sm text-text-primary">
                    {selectedSongAnalysis.morphological.totalTokens} токен · {selectedSongAnalysis.morphological.uniqueLemmas} lemma
                  </p>
                </div>
                <div className="rounded-2xl border border-subtle bg-bg-secondary/50 p-3">
                  <p className="text-xs uppercase tracking-[0.12em] text-text-secondary">Лексика</p>
                  <p className="mt-1 text-sm text-text-primary">
                    TTR {formatPercent(selectedSongAnalysis.lexical.typeTokenRatio)} · Орташа ұзындық {formatNumber(selectedSongAnalysis.lexical.avgWordLength)}
                  </p>
                </div>
                <div className="rounded-2xl border border-subtle bg-bg-secondary/50 p-3">
                  <p className="text-xs uppercase tracking-[0.12em] text-text-secondary">Синтаксис</p>
                  <p className="mt-1 text-sm text-text-primary">
                    {formatNumber(selectedSongAnalysis.syntactic.avgWordsPerLine)} сөз/жол · Күрделі жол {formatPercent(selectedSongAnalysis.syntactic.complexLineShare)}
                  </p>
                </div>
              </div>
            ) : null}

            {!teiView ? (
              <div className="space-y-5">
                {selectedSong.sections.map((section, sectionIndex) => (
                  <section key={`${section.type}-${sectionIndex + 1}`}>
                    <p className="mb-2 text-xs uppercase tracking-[0.16em] text-text-secondary">{section.type}</p>
                    <div className="space-y-3">
                      {section.lines.map((line, lineIndex) => (
                        <div key={`${line}-${lineIndex + 1}`} className="rounded-2xl border border-subtle bg-bg-secondary/45 p-3">
                          <p className="leading-7 text-text-primary">{line}</p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {annotateLine(line).map((token) => (
                              <span
                                key={`${line}-${token.token}-${token.lemma}`}
                                className="rounded-full border border-subtle bg-white/5 px-2 py-1 text-[11px] text-text-secondary"
                              >
                                {token.token}
                                {annotations.lemma ? ` · ${token.lemma}` : ""}
                                {annotations.pos ? ` · ${token.pos}` : ""}
                                {annotations.namedEntity ? ` · ${token.namedEntity}` : ""}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              <pre className="overflow-x-auto rounded-2xl border border-subtle bg-bg-secondary/80 p-4 font-mono text-xs leading-6 text-text-primary">
                {buildTeiXml(selectedSong, artist.name)}
              </pre>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
