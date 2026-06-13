-- ─────────────────────────────────────────────
--  Sashka's Birthday — Supabase Schema
-- ─────────────────────────────────────────────

-- Gifts
create table if not exists gifts (
  id          uuid        default gen_random_uuid() primary key,
  name        text        not null,
  description text,
  price       numeric(10,2),
  image_url   text,
  store_url   text,
  is_reserved boolean     not null default false,
  reserved_by text,
  sort_order  integer     not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- App config (meme URL, etc.)
create table if not exists app_config (
  key        text        primary key,
  value      text        not null default '',
  updated_at timestamptz not null default now()
);

-- Default config rows
insert into app_config (key, value) values
  ('meme_url', '')
on conflict (key) do nothing;

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger gifts_updated_at
  before update on gifts
  for each row execute function update_updated_at();

create trigger config_updated_at
  before update on app_config
  for each row execute function update_updated_at();

-- ─── Row Level Security ───
alter table gifts      enable row level security;
alter table app_config enable row level security;

-- Public can read gifts (reserved_by stripped in API layer)
create policy "public_read_gifts" on gifts
  for select using (true);

-- Block direct mutations from anon — use API routes with service key
create policy "no_direct_gift_insert" on gifts for insert with check (false);
create policy "no_direct_gift_update" on gifts for update using (false);
create policy "no_direct_gift_delete" on gifts for delete using (false);

-- Public can read config
create policy "public_read_config" on app_config
  for select using (true);

create policy "no_direct_config_insert" on app_config for insert with check (false);
create policy "no_direct_config_update" on app_config for update using (false);

-- ─── Storage bucket ───
-- Run these in the Supabase dashboard → Storage → New bucket:
--   Name: gift-images
--   Public: YES
--
-- Or via SQL (requires pg_storage extension):
-- insert into storage.buckets (id, name, public) values ('gift-images', 'gift-images', true)
-- on conflict do nothing;
--
-- Storage policies (allow public read, service-role write):
-- create policy "Public read images" on storage.objects for select using (bucket_id = 'gift-images');

-- ─── Sample gifts (optional — delete or modify as you like) ───
-- insert into gifts (name, description, price, sort_order) values
--   ('Парфуми Chloe Nomade', 'Ніжний квітковий аромат', 3500, 1),
--   ('Подарункова карта Zara', null, 1000, 2),
--   ('Книга "Атомні звички"', 'Джеймс Клір', 450, 3);
