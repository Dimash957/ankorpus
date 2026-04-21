import {
  artists as fallbackArtists,
  songs as fallbackSongs,
  thematicArchives as fallbackThematicArchives,
  type ArchiveType,
  type ArtistArchive,
  type Song,
  type SongSection,
  type ThematicArchive,
  getAllGenres,
  getCharacterStats,
  getGenreDistribution,
  getSongLevelMetrics,
  getSongText,
  getTimelineDistribution,
  getVerseLengthStats,
  getWordFrequency,
  getWordNgramData,
  getYearRange,
} from "@/lib/data";
import { createSupabaseServerClient } from "@/lib/supabase/server";

interface ArtistRow {
  slug: string;
  name: string;
  years_label: string | null;
  period_start: number;
  period_end: number;
  song_count: number | null;
  genres: string[] | null;
  summary: string | null;
}

interface SongRow {
  legacy_id: string;
  title: string;
  artist_slug: string;
  year: number;
  genre: string;
  archive_type: ArchiveType;
  tags: string[] | null;
  charts_rank: number | null;
  sections: unknown;
  lyrics_text: string | null;
}

interface ThematicArchiveRow {
  id: string;
  title: string;
  years: string;
  count_label: string;
  summary: string;
}

export interface SongFilters {
  query?: string;
  artistSlugs?: string[];
  yearMin?: number;
  yearMax?: number;
  genres?: string[];
  archiveType?: ArchiveType | "барлығы";
  limit?: number;
  offset?: number;
}

export interface CreateSongPayload {
  id?: string;
  title: string;
  artistSlug: string;
  year: number;
  genre: string;
  archiveType: ArchiveType;
  tags?: string[];
  chartsRank?: number;
  sections: SongSection[];
}

export interface MutationResult<T> {
  ok: boolean;
  status: number;
  message?: string;
  data?: T;
}

function normalizeSections(value: unknown): SongSection[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const section = item as { type?: unknown; lines?: unknown };
      const type = section.type;
      const lines = section.lines;

      if ((type !== "verse" && type !== "chorus" && type !== "bridge") || !Array.isArray(lines)) {
        return null;
      }

      return {
        type,
        lines: lines.filter((line) => typeof line === "string"),
      } satisfies SongSection;
    })
    .filter((item): item is SongSection => Boolean(item));
}

function songFromRow(row: SongRow): Song {
  return {
    id: row.legacy_id,
    title: row.title,
    artistSlug: row.artist_slug,
    year: row.year,
    genre: row.genre,
    archiveType: row.archive_type,
    tags: row.tags ?? [],
    chartsRank: row.charts_rank ?? 0,
    sections: normalizeSections(row.sections),
    lyricsText: row.lyrics_text ?? undefined,
  };
}

function artistFromRow(row: ArtistRow): ArtistArchive {
  return {
    slug: row.slug,
    name: row.name,
    years: row.years_label ?? `${row.period_start}-${row.period_end}`,
    periodStart: row.period_start,
    periodEnd: row.period_end,
    songCount: row.song_count ?? 0,
    genres: row.genres ?? [],
    summary: row.summary ?? "",
  };
}

function thematicFromRow(row: ThematicArchiveRow): ThematicArchive {
  return {
    id: row.id,
    title: row.title,
    years: row.years,
    countLabel: row.count_label,
    summary: row.summary,
  };
}

function toLower(value: string) {
  return value.toLocaleLowerCase("kk");
}

function filterSongsLocally(sourceSongs: Song[], filters: SongFilters) {
  const query = filters.query?.trim().toLocaleLowerCase("kk") ?? "";

  return sourceSongs.filter((song) => {
    const byArtist =
      !filters.artistSlugs ||
      filters.artistSlugs.length === 0 ||
      filters.artistSlugs.includes(song.artistSlug);

    const byYearMin = typeof filters.yearMin !== "number" || song.year >= filters.yearMin;
    const byYearMax = typeof filters.yearMax !== "number" || song.year <= filters.yearMax;

    const byGenre = !filters.genres || filters.genres.length === 0 || filters.genres.includes(song.genre);

    const byArchive =
      !filters.archiveType || filters.archiveType === "барлығы" || song.archiveType === filters.archiveType;

    const byQuery =
      query.length === 0 ||
      toLower(song.title).includes(query) ||
      toLower(getSongText(song)).includes(query) ||
      song.tags.some((tag) => toLower(tag).includes(query));

    return byArtist && byYearMin && byYearMax && byGenre && byArchive && byQuery;
  });
}

function withPagination<T>(items: T[], filters: SongFilters) {
  const offset = Math.max(0, filters.offset ?? 0);
  const defaultLimit = items.length > 0 ? items.length : 1;
  const limit = Math.max(1, filters.limit ?? defaultLimit);
  return items.slice(offset, offset + limit);
}

function mergeUniqueSongs(primary: Song[], secondary: Song[]) {
  const merged = [...primary];
  const seen = new Set(primary.map((song) => song.id));

  secondary.forEach((song) => {
    if (seen.has(song.id)) {
      return;
    }

    seen.add(song.id);
    merged.push(song);
  });

  return merged;
}

function shouldSupplementFromFallback(filters: SongFilters, remoteSongs: Song[]) {
  const offset = Math.max(0, filters.offset ?? 0);
  if (offset > 0) {
    return false;
  }

  if (remoteSongs.length === 0) {
    return true;
  }

  if (filters.artistSlugs && filters.artistSlugs.length > 0 && remoteSongs.length < 3) {
    return true;
  }

  const noQuery = !filters.query?.trim();
  const noArtists = !filters.artistSlugs || filters.artistSlugs.length === 0;
  const noGenres = !filters.genres || filters.genres.length === 0;
  const noArchiveFilter = !filters.archiveType || filters.archiveType === "барлығы";
  const noYearFilter = typeof filters.yearMin !== "number" && typeof filters.yearMax !== "number";

  if (noQuery && noArtists && noGenres && noArchiveFilter && noYearFilter && remoteSongs.length < fallbackSongs.length) {
    return true;
  }

  return false;
}

export async function getArtistsRepository() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return fallbackArtists;
  }

  const { data, error } = await supabase
    .from("artists")
    .select("slug,name,years_label,period_start,period_end,song_count,genres,summary")
    .order("period_start", { ascending: true });

  if (error || !data) {
    return fallbackArtists;
  }

  return (data as ArtistRow[]).map(artistFromRow);
}

export async function getThematicArchivesRepository() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return fallbackThematicArchives;
  }

  const { data, error } = await supabase
    .from("thematic_archives")
    .select("id,title,years,count_label,summary")
    .order("id", { ascending: true });

  if (error || !data) {
    return fallbackThematicArchives;
  }

  return (data as ThematicArchiveRow[]).map(thematicFromRow);
}

export async function getSongsRepository(filters: SongFilters = {}) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    const local = filterSongsLocally(fallbackSongs, filters);
    return withPagination(local, filters);
  }

  let query = supabase
    .from("songs")
    .select("legacy_id,title,artist_slug,year,genre,archive_type,tags,charts_rank,sections,lyrics_text")
    .order("year", { ascending: false });

  if (filters.artistSlugs && filters.artistSlugs.length > 0) {
    query = query.in("artist_slug", filters.artistSlugs);
  }

  if (typeof filters.yearMin === "number") {
    query = query.gte("year", filters.yearMin);
  }

  if (typeof filters.yearMax === "number") {
    query = query.lte("year", filters.yearMax);
  }

  if (filters.genres && filters.genres.length > 0) {
    query = query.in("genre", filters.genres);
  }

  if (filters.archiveType && filters.archiveType !== "барлығы") {
    query = query.eq("archive_type", filters.archiveType);
  }

  if (filters.query?.trim()) {
    const raw = filters.query.trim().replaceAll("%", "").replaceAll(",", " ");
    query = query.or(`title.ilike.%${raw}%,lyrics_text.ilike.%${raw}%`);
  }

  const offset = Math.max(0, filters.offset ?? 0);
  const limit = Math.max(1, filters.limit ?? 500);
  query = query.range(offset, offset + limit - 1);

  const { data, error } = await query;

  if (error || !data) {
    const local = filterSongsLocally(fallbackSongs, filters);
    return withPagination(local, filters);
  }

  const remoteSongs = (data as SongRow[]).map(songFromRow);

  if (!shouldSupplementFromFallback(filters, remoteSongs)) {
    return remoteSongs;
  }

  const localMatches = filterSongsLocally(fallbackSongs, filters);
  const merged = mergeUniqueSongs(remoteSongs, localMatches);
  const supplementedLimit = Math.max(1, filters.limit ?? merged.length);
  return merged.slice(0, supplementedLimit);
}

export async function getArtistBySlugRepository(slug: string) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return fallbackArtists.find((artist) => artist.slug === slug) ?? null;
  }

  const { data, error } = await supabase
    .from("artists")
    .select("slug,name,years_label,period_start,period_end,song_count,genres,summary")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    return fallbackArtists.find((artist) => artist.slug === slug) ?? null;
  }

  return artistFromRow(data as ArtistRow);
}

export async function getSongsByArtistRepository(slug: string) {
  return getSongsRepository({ artistSlugs: [slug], limit: 1000 });
}

export async function getSearchDatasetRepository() {
  const [artists, songs] = await Promise.all([getArtistsRepository(), getSongsRepository({ limit: 1000 })]);

  return {
    artists,
    songs,
    genres: getAllGenres(songs),
    yearRange: getYearRange(songs),
  };
}

export async function getLandingDatasetRepository() {
  const [artists, thematicArchives, songs] = await Promise.all([
    getArtistsRepository(),
    getThematicArchivesRepository(),
    getSongsRepository({ limit: 1000 }),
  ]);

  return {
    artists,
    thematicArchives,
    wordFrequency: getWordFrequency(8, songs),
    genreDistribution: getGenreDistribution(songs),
    timeline: getTimelineDistribution(songs),
  };
}

export async function getAnalysisDatasetRepository() {
  const songs = await getSongsRepository({ limit: 1000 });

  return {
    wordFrequency: getWordFrequency(14, songs),
    genreDistribution: getGenreDistribution(songs),
    timeline: getTimelineDistribution(songs),
    chars: getCharacterStats(songs),
    ngrams: getWordNgramData(songs),
    verseLengths: getVerseLengthStats(songs),
    songMetrics: getSongLevelMetrics(songs),
  };
}

export async function createSongRepository(payload: CreateSongPayload): Promise<MutationResult<Song>> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return {
      ok: false,
      status: 503,
      message: "Supabase бапталмаған. .env ішінде NEXT_PUBLIC_SUPABASE_URL және NEXT_PUBLIC_SUPABASE_ANON_KEY қажет.",
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      status: 401,
      message: "Әрекетті орындау үшін жүйеге кіру керек.",
    };
  }

  const { data: artistData, error: artistError } = await supabase
    .from("artists")
    .select("id,slug")
    .eq("slug", payload.artistSlug)
    .maybeSingle();

  if (artistError || !artistData) {
    return {
      ok: false,
      status: 400,
      message: "Орындаушы табылмады. artistSlug мәнін тексеріңіз.",
    };
  }

  const legacyId = payload.id ?? `${payload.artistSlug}-${Date.now()}`;
  const lyricsText = payload.sections.flatMap((section) => section.lines).join(" ");

  const { data, error } = await supabase
    .from("songs")
    .insert({
      legacy_id: legacyId,
      title: payload.title,
      artist_id: artistData.id,
      artist_slug: payload.artistSlug,
      year: payload.year,
      genre: payload.genre,
      archive_type: payload.archiveType,
      tags: payload.tags ?? [],
      charts_rank: payload.chartsRank ?? 0,
      sections: payload.sections,
      lyrics_text: lyricsText,
      created_by: user.id,
    })
    .select("legacy_id,title,artist_slug,year,genre,archive_type,tags,charts_rank,sections,lyrics_text")
    .single();

  if (error || !data) {
    return {
      ok: false,
      status: 400,
      message: error?.message ?? "Әнді сақтау кезінде қате пайда болды.",
    };
  }

  return {
    ok: true,
    status: 201,
    data: songFromRow(data as SongRow),
  };
}
