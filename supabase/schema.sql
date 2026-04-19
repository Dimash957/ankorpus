-- Ән мәтіндерінің корпусы: Supabase schema
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text unique,
  full_name text,
  role text not null default 'researcher',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.artists (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  years_label text not null,
  period_start int not null,
  period_end int not null,
  song_count int not null default 0,
  genres text[] not null default '{}',
  summary text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.thematic_archives (
  id text primary key,
  title text not null,
  years text not null,
  count_label text not null,
  summary text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.songs (
  id uuid primary key default gen_random_uuid(),
  legacy_id text not null unique,
  title text not null,
  artist_id uuid not null references public.artists (id) on delete cascade,
  artist_slug text not null,
  year int not null check (year between 1900 and 2100),
  genre text not null,
  archive_type text not null check (archive_type in ('жеке мұрағат', 'тақырыптық мұрағат', 'аралас қор')),
  tags text[] not null default '{}',
  charts_rank int not null default 0,
  sections jsonb not null default '[]'::jsonb,
  lyrics_text text not null default '',
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_songs_artist_slug on public.songs (artist_slug);
create index if not exists idx_songs_year on public.songs (year);
create index if not exists idx_songs_genre on public.songs (genre);
create index if not exists idx_songs_archive_type on public.songs (archive_type);
create index if not exists idx_songs_tags_gin on public.songs using gin (tags);
create index if not exists idx_songs_fts on public.songs using gin (to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(lyrics_text, '')));

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_artists_updated_at on public.artists;
create trigger trg_artists_updated_at
before update on public.artists
for each row execute function public.set_updated_at();

drop trigger if exists trg_songs_updated_at on public.songs;
create trigger trg_songs_updated_at
before update on public.songs
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.artists enable row level security;
alter table public.thematic_archives enable row level security;
alter table public.songs enable row level security;

-- profiles: әр қолданушы тек өз профилін көреді/жаңартады
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- reference tables: ашық оқу
drop policy if exists "artists_select_all" on public.artists;
create policy "artists_select_all"
on public.artists
for select
to anon, authenticated
using (true);

drop policy if exists "thematic_select_all" on public.thematic_archives;
create policy "thematic_select_all"
on public.thematic_archives
for select
to anon, authenticated
using (true);

drop policy if exists "songs_select_all" on public.songs;
create policy "songs_select_all"
on public.songs
for select
to anon, authenticated
using (true);

-- write operations: тек authenticated
drop policy if exists "songs_insert_authenticated" on public.songs;
create policy "songs_insert_authenticated"
on public.songs
for insert
to authenticated
with check (created_by = auth.uid());

drop policy if exists "songs_update_authenticated" on public.songs;
create policy "songs_update_authenticated"
on public.songs
for update
to authenticated
using (created_by = auth.uid())
with check (created_by = auth.uid());

drop policy if exists "songs_delete_authenticated" on public.songs;
create policy "songs_delete_authenticated"
on public.songs
for delete
to authenticated
using (created_by = auth.uid());
