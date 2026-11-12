-- Softglambysteph — Supabase schema
-- Run in the Supabase SQL editor, then set NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY.

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null check (category in ('lip-gloss','lip-liner','bundle')),
  price integer not null check (price >= 0),          -- Naira
  packaging_line text,
  description text,
  benefits text[],
  details jsonb default '[]'::jsonb,                  -- [{ "label": "Size", "value": "4ml" }]
  gallery text[] default '{}',
  featured boolean default false,
  published boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now()
);

create table if not exists product_shades (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  shade_key text not null,
  name text not null,
  name_confirmed boolean default false,
  hex text not null default '#cccccc',
  image text not null,                                 -- /images/... or a Supabase Storage public URL
  in_stock boolean default true,
  sort_order integer default 0,
  unique (product_id, shade_key)
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  reference text unique not null,
  customer_name text not null,
  phone text not null,
  email text,
  fulfilment text not null,
  address text,
  notes text,
  items jsonb not null,
  total integer not null,
  channel text not null default 'whatsapp',            -- whatsapp | paystack
  payment_status text not null default 'pending',      -- pending | awaiting_payment | paid
  paid_amount integer,
  paid_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  reference text unique not null,
  customer_name text not null,
  phone text not null,
  email text,
  service_id text not null,
  service_name text not null,
  price integer not null,
  preferred_date date not null,
  preferred_time time not null,
  venue text not null,
  address text,
  notes text,
  status text not null default 'requested',            -- requested | confirmed | completed | cancelled
  created_at timestamptz default now()
);

create table if not exists enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null, contact text not null, topic text, message text not null,
  created_at timestamptz default now()
);

create table if not exists newsletter (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz default now()
);

-- Row level security: the public site can read the catalogue and insert submissions, nothing else.
alter table products enable row level security;
alter table product_shades enable row level security;
alter table orders enable row level security;
alter table bookings enable row level security;
alter table enquiries enable row level security;
alter table newsletter enable row level security;

create policy "read published products" on products for select using (published);
create policy "read shades" on product_shades for select using (true);
create policy "insert orders" on orders for insert with check (payment_status in ('pending','awaiting_payment'));
create policy "insert bookings" on bookings for insert with check (status = 'requested');
create policy "insert enquiries" on enquiries for insert with check (true);
create policy "insert newsletter" on newsletter for insert with check (true);
-- Payment status is only ever set to 'paid' by the server (service role) after Paystack verification.

-- Seed: mirrors data/catalog.ts. Shade names are descriptive placeholders until confirmed.
insert into products (slug,name,category,price,packaging_line,featured,sort_order) values
  ('glowbysteph-lip-gloss','GlowbySteph Lip Gloss','lip-gloss',10000,'Soft shine, real glow.',true,1),
  ('glowbysteph-pigmented-lip-liner','GlowbySteph Pigmented Lip Liner','lip-liner',4000,'Pigmented lip liner.',true,2),
  ('glowbysteph-2-set-combo','GlowbySteph 2-Set Combo','bundle',14000,'One gloss, one liner.',true,3),
  ('glowbysteph-combo-bundle','GlowbySteph Combo Bundle','bundle',27000,'Gloss and liner, gift-bagged.',true,4)
on conflict (slug) do nothing;

insert into product_shades (product_id,shade_key,name,hex,image,sort_order)
select p.id, s.key, s.name, s.hex, s.image, s.ord from products p join (values
  ('glowbysteph-lip-gloss','clear','Clear','#efe7e4','/images/products/gloss-clear.webp',1),
  ('glowbysteph-lip-gloss','pink','Pink','#e0336e','/images/products/gloss-pink.webp',2),
  ('glowbysteph-lip-gloss','nude','Nude','#a86249','/images/products/gloss-nude.webp',3),
  ('glowbysteph-lip-gloss','burgundy','Burgundy','#5a1f22','/images/products/gloss-burgundy.webp',4),
  ('glowbysteph-pigmented-lip-liner','black','Black','#1d1a1a','/images/products/liner-pink-barrel.webp',1),
  ('glowbysteph-pigmented-lip-liner','berry','Berry','#7e2f3d','/images/products/liner-black-barrel.webp',2),
  ('glowbysteph-2-set-combo','nude-berry','Nude gloss + Berry liner','#a86249','/images/products/duo-nude-berry.webp',1),
  ('glowbysteph-2-set-combo','pink-berry','Pink gloss + Berry liner','#e0336e','/images/products/duo-pink-berry.webp',2),
  ('glowbysteph-2-set-combo','clear-black','Clear gloss + Black liner','#efe7e4','/images/products/duo-clear-black.webp',3),
  ('glowbysteph-2-set-combo','burgundy-berry','Burgundy gloss + Berry liner','#5a1f22','/images/products/duo-burgundy-berry.webp',4),
  ('glowbysteph-combo-bundle','bundle','Gift-bagged set','#f1c9cc','/images/products/collection-bundle.webp',1)
) as s(slug,key,name,hex,image,ord) on s.slug = p.slug
on conflict do nothing;
