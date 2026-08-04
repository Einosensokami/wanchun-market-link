-- LINE identities are server-managed. The browser never receives or stores a raw LINE user ID.
create table public.line_identities (
  user_id uuid primary key references auth.users(id) on delete cascade,
  subject_hash text not null unique check (subject_hash ~ '^[a-f0-9]{64}$'),
  created_at timestamptz not null default now()
);

alter table public.line_identities enable row level security;
revoke all on public.line_identities from anon, authenticated;

create or replace function public.claim_coupon_for_line_identity(
  requested_offer_id uuid,
  requested_user_id uuid
)
returns public.coupons
language plpgsql
security definer
set search_path = pg_catalog, pg_temp
as $$
declare
  created_coupon public.coupons;
begin
  if auth.role() <> 'service_role' then
    raise exception 'server authorization required' using errcode = '42501';
  end if;
  if not exists (select 1 from public.line_identities where user_id = requested_user_id) then
    raise exception 'unknown LINE identity' using errcode = '42501';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(requested_offer_id::text || requested_user_id::text, 0));

  select * into created_coupon
  from public.coupons
  where offer_id = requested_offer_id and claimed_by = requested_user_id and state = 'claimed';
  if found then
    return created_coupon;
  end if;

  insert into public.coupons (offer_id, claimed_by, expires_at)
  select id, requested_user_id, ends_at
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

revoke all on function public.claim_coupon_for_line_identity(uuid, uuid) from public, anon, authenticated;
grant execute on function public.claim_coupon_for_line_identity(uuid, uuid) to service_role;
