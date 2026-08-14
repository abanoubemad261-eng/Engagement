create extension if not exists pgcrypto;

create table if not exists public.wishes (id uuid primary key default gen_random_uuid(),name text not null,text text not null,created_at timestamptz not null default now());
create table if not exists public.rsvps (id uuid primary key default gen_random_uuid(),name text not null,attendance boolean not null default true,guests integer not null default 1,created_at timestamptz not null default now());
create table if not exists public.story_photos (id uuid primary key default gen_random_uuid(),image_url text not null,storage_path text,sort_order integer not null default 0,created_at timestamptz not null default now());
create table if not exists public.memory_photos (id uuid primary key default gen_random_uuid(),image_url text not null,storage_path text,owner_id uuid references auth.users(id) on delete set null,created_at timestamptz not null default now());
create table if not exists public.site_settings (key text primary key,value text not null,updated_at timestamptz not null default now());

alter table public.wishes enable row level security;
alter table public.rsvps enable row level security;
alter table public.story_photos enable row level security;
alter table public.memory_photos enable row level security;
alter table public.site_settings enable row level security;

-- Everyone can read/add wishes; only non-anonymous authenticated users can delete.
drop policy if exists "public can read wishes" on public.wishes;
drop policy if exists "public can add wishes" on public.wishes;
drop policy if exists "admin can delete wishes" on public.wishes;
create policy "public can read wishes" on public.wishes for select using (true);
create policy "public can add wishes" on public.wishes for insert with check (char_length(name) between 1 and 80 and char_length(text) between 1 and 1000);
create policy "admin can delete wishes" on public.wishes for delete to authenticated using ((select (auth.jwt()->>'is_anonymous')::boolean) is false);

-- Guests can submit RSVP; admin can read/delete RSVP.
drop policy if exists "public can add rsvps" on public.rsvps;
drop policy if exists "authenticated can read rsvps" on public.rsvps;
drop policy if exists "authenticated can delete rsvps" on public.rsvps;
create policy "public can add rsvps" on public.rsvps for insert with check (char_length(name) between 1 and 100 and guests between 1 and 10);
create policy "authenticated can read rsvps" on public.rsvps for select to authenticated using ((select (auth.jwt()->>'is_anonymous')::boolean) is false);
create policy "authenticated can delete rsvps" on public.rsvps for delete to authenticated using ((select (auth.jwt()->>'is_anonymous')::boolean) is false);

-- Story: public read, non-anonymous admin manage.
drop policy if exists "public can read story photos" on public.story_photos;
drop policy if exists "authenticated can manage story photos" on public.story_photos;
create policy "public can read story photos" on public.story_photos for select using (true);
create policy "authenticated can manage story photos" on public.story_photos for all to authenticated using ((select (auth.jwt()->>'is_anonymous')::boolean) is false) with check ((select (auth.jwt()->>'is_anonymous')::boolean) is false);

-- Memory: everyone reads; anonymous/authenticated owner inserts/deletes their own; admin can manage all.
drop policy if exists "public can read memory photos" on public.memory_photos;
drop policy if exists "guest can add own memory photo" on public.memory_photos;
drop policy if exists "owner can delete own memory photo" on public.memory_photos;
drop policy if exists "admin can manage memory photos" on public.memory_photos;
create policy "public can read memory photos" on public.memory_photos for select using (true);
create policy "guest can add own memory photo" on public.memory_photos for insert with check (auth.uid() = owner_id);
create policy "owner can delete own memory photo" on public.memory_photos for delete using (auth.uid() = owner_id);
create policy "admin can manage memory photos" on public.memory_photos for all to authenticated using ((select (auth.jwt()->>'is_anonymous')::boolean) is false) with check ((select (auth.jwt()->>'is_anonymous')::boolean) is false);

-- Site settings: public read; non-anonymous admin manage.
drop policy if exists "public can read settings" on public.site_settings;
drop policy if exists "authenticated can manage settings" on public.site_settings;
create policy "public can read settings" on public.site_settings for select using (true);
create policy "authenticated can manage settings" on public.site_settings for all to authenticated using ((select (auth.jwt()->>'is_anonymous')::boolean) is false) with check ((select (auth.jwt()->>'is_anonymous')::boolean) is false);

insert into storage.buckets (id,name,public) values ('story-photos','story-photos',true) on conflict (id) do update set public=true;
insert into storage.buckets (id,name,public) values ('memory-photos','memory-photos',true) on conflict (id) do update set public=true;
insert into storage.buckets (id,name,public) values ('site-assets','site-assets',true) on conflict (id) do update set public=true;

-- Public read.
drop policy if exists "public read story media" on storage.objects;
drop policy if exists "public read memory media" on storage.objects;
drop policy if exists "public read site assets" on storage.objects;
create policy "public read story media" on storage.objects for select using (bucket_id='story-photos');
create policy "public read memory media" on storage.objects for select using (bucket_id='memory-photos');
create policy "public read site assets" on storage.objects for select using (bucket_id='site-assets');

-- Admin storage operations are restricted to non-anonymous authenticated users.
drop policy if exists "authenticated upload story media" on storage.objects;
drop policy if exists "authenticated delete story media" on storage.objects;
drop policy if exists "authenticated upload site assets" on storage.objects;
drop policy if exists "authenticated delete site assets" on storage.objects;
create policy "authenticated upload story media" on storage.objects for insert to authenticated with check (bucket_id='story-photos' and (select (auth.jwt()->>'is_anonymous')::boolean) is false);
create policy "authenticated delete story media" on storage.objects for delete to authenticated using (bucket_id='story-photos' and (select (auth.jwt()->>'is_anonymous')::boolean) is false);
create policy "authenticated upload site assets" on storage.objects for insert to authenticated with check (bucket_id='site-assets' and (select (auth.jwt()->>'is_anonymous')::boolean) is false);
create policy "authenticated delete site assets" on storage.objects for delete to authenticated using (bucket_id='site-assets' and (select (auth.jwt()->>'is_anonymous')::boolean) is false);

-- Guest camera uploads use a folder named with the anonymous user's UUID.
drop policy if exists "guest upload memory media" on storage.objects;
drop policy if exists "guest delete own memory media" on storage.objects;
drop policy if exists "admin delete memory media" on storage.objects;
create policy "guest upload memory media" on storage.objects for insert with check (bucket_id='memory-photos' and auth.uid()::text=(storage.foldername(name))[1]);
create policy "guest delete own memory media" on storage.objects for delete using (bucket_id='memory-photos' and auth.uid()::text=(storage.foldername(name))[1]);
create policy "admin delete memory media" on storage.objects for delete to authenticated using (bucket_id='memory-photos' and (select (auth.jwt()->>'is_anonymous')::boolean) is false);
