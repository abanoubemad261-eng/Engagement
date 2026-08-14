create extension if not exists pgcrypto;

create table if not exists public.wishes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  text text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  attendance boolean not null,
  guests integer not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists public.story_photos (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.memory_photos (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

alter table public.wishes enable row level security;
alter table public.rsvps enable row level security;
alter table public.story_photos enable row level security;
alter table public.memory_photos enable row level security;
alter table public.site_settings enable row level security;

create policy "public can read wishes" on public.wishes for select using (true);
create policy "public can add wishes" on public.wishes for insert with check (char_length(name) between 1 and 80 and char_length(text) between 1 and 1000);

create policy "public can add rsvps" on public.rsvps for insert with check (char_length(name) between 1 and 100 and guests between 1 and 10);

create policy "public can read story photos" on public.story_photos for select using (true);
create policy "authenticated can manage story photos" on public.story_photos for all to authenticated using (true) with check (true);

create policy "public can read memory photos" on public.memory_photos for select using (true);
create policy "public can add memory photos" on public.memory_photos for insert with check (true);
create policy "authenticated can manage memory photos" on public.memory_photos for delete to authenticated using (true);

create policy "public can read settings" on public.site_settings for select using (true);
create policy "authenticated can manage settings" on public.site_settings for all to authenticated using (true) with check (true);

insert into storage.buckets (id, name, public) values ('story-photos','story-photos',true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('memory-photos','memory-photos',true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('site-assets','site-assets',true) on conflict (id) do nothing;

create policy "public read story media" on storage.objects for select using (bucket_id = 'story-photos');
create policy "authenticated upload story media" on storage.objects for insert to authenticated with check (bucket_id = 'story-photos');
create policy "authenticated delete story media" on storage.objects for delete to authenticated using (bucket_id = 'story-photos');

create policy "public read memory media" on storage.objects for select using (bucket_id = 'memory-photos');
create policy "public upload memory media" on storage.objects for insert with check (bucket_id = 'memory-photos');

create policy "public read site assets" on storage.objects for select using (bucket_id = 'site-assets');
create policy "authenticated upload site assets" on storage.objects for insert to authenticated with check (bucket_id = 'site-assets');
create policy "authenticated delete site assets" on storage.objects for delete to authenticated using (bucket_id = 'site-assets');
