-- 萬春・廟口通：最小試營運資料模型
-- 請在新的 Supabase 專案中執行。此 migration 不包含任何示範店家或真實個資。
-- 使用者需先以 LINE Login 取得驗證後的 Supabase session；不可把 service_role key 放入 MINI App。

create extension if not exists pgcrypto;

create type public.coupon_state as enum ('claimed', 'redeemed', 'expired', 'void');
create type public.merchant_role as enum ('owner', 'staff');

create table public.merchants (
  id uuid primary key default gen_random_uuid(),
  display_name text not null check (char_length(display_name) between 1 and 80),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.offers (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid not null references public.merchants(id) on delete restrict,
  title text not null check (char_length(title) between 1 and 120),
  benefit_text text not null check (char_length(benefit_text) between 1 and 160),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create table public.merchant_memberships (
  merchant_id uuid not null references public.merchants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.merchant_role not null default 'staff',
  created_at timestamptz not null default now(),
  primary key (merchant_id, user_id)
);

create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  -- UUID avoids guessable sequential coupon codes. The UI may render a short derived code or QR payload.
  public_code uuid not null unique default gen_random_uuid(),
  offer_id uuid not null references public.offers(id) on delete restrict,
  claimed_by uuid not null references auth.users(id) on delete restrict,
  state public.coupon_state not null default 'claimed',
  claimed_at timestamptz not null default now(),
  redeemed_at timestamptz,
  redeemed_by uuid references auth.users(id) on delete restrict,
  expires_at timestamptz not null,
  check ((state = 'redeemed') = (redeemed_at is not null)),
  check ((state = 'redeemed') = (redeemed_by is not null))
);

create unique index coupons_one_active_offer_per_user
  on public.coupons (offer_id, claimed_by)
  where state = 'claimed';
create index coupons_redemption_lookup on public.coupons (public_code);
create index coupons_merchant_reporting on public.coupons (offer_id, state, redeemed_at);

alter table public.merchants enable row level security;
alter table public.offers enable row level security;
alter table public.merchant_memberships enable row level security;
alter table public.coupons enable row level security;

-- Do not depend on platform-default grants: clients can read only the data covered below.
revoke all on public.merchants, public.offers, public.merchant_memberships, public.coupons from anon, authenticated;
grant select on public.merchants, public.offers to anon, authenticated;
grant select on public.merchant_memberships, public.coupons to authenticated;

-- Public users may only discover active, published offers. No anonymous writes are permitted.
create policy "active merchants are readable" on public.merchants
  for select using (is_active);
create policy "published current offers are readable" on public.offers
  for select using (is_published and starts_at <= now() and ends_at > now());

-- A visitor can see only their own coupon. Merchant membership is visible only to the signed-in member.
create policy "visitor reads own coupons" on public.coupons
  for select to authenticated using (claimed_by = auth.uid());
create policy "member reads own membership" on public.merchant_memberships
  for select to authenticated using (user_id = auth.uid());

-- Both issuance and redemption run through narrowly scoped functions. No client INSERT, UPDATE or DELETE policies exist.
create or replace function public.claim_offer_coupon(requested_offer_id uuid)
returns public.coupons
language plpgsql
security definer
set search_path = pg_catalog, pg_temp
as $$
declare
  created_coupon public.coupons;
begin
  if auth.uid() is null then
    raise exception 'authentication required' using errcode = '28000';
  end if;

  -- Serialise duplicate taps from the same account for the same offer.
  perform pg_advisory_xact_lock(hashtextextended(requested_offer_id::text || auth.uid()::text, 0));

  select * into created_coupon
  from public.coupons
  where offer_id = requested_offer_id and claimed_by = auth.uid() and state = 'claimed';
  if found then
    return created_coupon;
  end if;

  insert into public.coupons (offer_id, claimed_by, expires_at)
  select id, auth.uid(), ends_at
  from public.offers
  where id = requested_offer_id
    and is_published
    and starts_at <= now()
    and ends_at > now()
  returning * into created_coupon;

  if not found then
    raise exception 'offer is unavailable' using errcode = '22023';
  end if;
  return created_coupon;
end;
$$;

create or replace function public.redeem_coupon(requested_code uuid)
returns public.coupons
language plpgsql
security definer
set search_path = pg_catalog, pg_temp
as $$
declare
  locked_coupon public.coupons;
begin
  if auth.uid() is null then
    raise exception 'authentication required' using errcode = '28000';
  end if;

  -- Row lock makes concurrent redemption attempts deterministic: only one can win.
  select c.* into locked_coupon
  from public.coupons c
  join public.offers o on o.id = c.offer_id
  join public.merchant_memberships mm on mm.merchant_id = o.merchant_id
  where c.public_code = requested_code and mm.user_id = auth.uid()
  for update of c;

  if not found then
    raise exception 'coupon not found or merchant not authorized' using errcode = '42501';
  end if;
  if locked_coupon.state <> 'claimed' then
    raise exception 'coupon is not redeemable' using errcode = '22023';
  end if;
  if locked_coupon.expires_at <= now() then
    update public.coupons set state = 'expired' where id = locked_coupon.id;
    raise exception 'coupon expired' using errcode = '22023';
  end if;

  update public.coupons
  set state = 'redeemed', redeemed_at = now(), redeemed_by = auth.uid()
  where id = locked_coupon.id
  returning * into locked_coupon;
  return locked_coupon;
end;
$$;

revoke all on function public.claim_offer_coupon(uuid) from public;
revoke all on function public.redeem_coupon(uuid) from public;
grant execute on function public.claim_offer_coupon(uuid) to authenticated;
grant execute on function public.redeem_coupon(uuid) to authenticated;
