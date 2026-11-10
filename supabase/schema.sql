-- TIENDITA DIGITAL / OCARINA DIGITAL
-- Ejecutar una sola vez en Supabase > SQL Editor.
-- La web puede leer solo productos y anuncios publicados.
-- La administración inicial se realiza desde el panel de Supabase.

create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null default 'PRODUCTO DIGITAL',
  description text not null default '',
  price numeric(12,2),
  price_label text not null default 'Consultar',
  image_url text,
  purchase_url text,
  detail_message text,
  is_published boolean not null default false,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ads (
  id uuid primary key default gen_random_uuid(),
  slot text not null check (slot in ('principal','secundario')),
  business_name text not null default '',
  headline text not null,
  description text not null default '',
  label text not null default 'PUBLICIDAD',
  image_url text,
  link_url text,
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean not null default false,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_public_order_idx
  on public.products (is_published, sort_order);
create index if not exists ads_active_slot_order_idx
  on public.ads (is_active, slot, sort_order);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists ads_set_updated_at on public.ads;
create trigger ads_set_updated_at before update on public.ads
for each row execute function public.set_updated_at();

alter table public.products enable row level security;
alter table public.ads enable row level security;

drop policy if exists "Public can read published products" on public.products;
create policy "Public can read published products"
on public.products for select to anon, authenticated
using (is_published = true);

drop policy if exists "Public can read active ads" on public.ads;
create policy "Public can read active ads"
on public.ads for select to anon, authenticated
using (
  is_active = true
  and (starts_at is null or starts_at <= now())
  and (ends_at is null or ends_at >= now())
);

-- Bucket público SOLO para imágenes de catálogo/anuncios.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 5242880,
  array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

drop policy if exists "Public can view product images" on storage.objects;
create policy "Public can view product images"
on storage.objects for select to anon, authenticated
using (bucket_id = 'product-images');

-- Las cargas y modificaciones de imágenes quedan restringidas a usuarios autenticados.
-- No habilitar registro público de usuarios. Crear la cuenta administradora manualmente.
drop policy if exists "Authenticated can upload product images" on storage.objects;
create policy "Authenticated can upload product images"
on storage.objects for insert to authenticated
with check (bucket_id = 'product-images');

drop policy if exists "Authenticated can update product images" on storage.objects;
create policy "Authenticated can update product images"
on storage.objects for update to authenticated
using (bucket_id = 'product-images')
with check (bucket_id = 'product-images');

drop policy if exists "Authenticated can delete product images" on storage.objects;
create policy "Authenticated can delete product images"
on storage.objects for delete to authenticated
using (bucket_id = 'product-images');

-- No se habilitan INSERT/UPDATE/DELETE públicos en products ni ads.
-- Administrar esos registros desde Supabase Studio (rol de servicio interno).
