-- Competition-demo redemption path. The browser cannot call this function:
-- only an Edge Function using a server-only secret API key may invoke it.
-- Production staff continue to use redeem_coupon() through merchant_memberships.
create or replace function public.redeem_demo_coupon(
  requested_code uuid,
  requested_merchant_id uuid,
  redeemed_operator_id uuid
)
returns public.coupons
language plpgsql
security definer
set search_path = pg_catalog, pg_temp
as $$
declare
  locked_coupon public.coupons;
begin
  if auth.role() <> 'service_role' then
    raise exception 'service role required' using errcode = '42501';
  end if;

  -- Locking the row makes simultaneous confirmation attempts single-use.
  select c.* into locked_coupon
  from public.coupons c
  join public.offers o on o.id = c.offer_id
  where c.public_code = requested_code
    and o.merchant_id = requested_merchant_id
  for update of c;

  if not found then
    raise exception 'coupon not found for merchant' using errcode = '42501';
  end if;
  if locked_coupon.state <> 'claimed' then
    raise exception 'coupon is not redeemable' using errcode = '22023';
  end if;
  if locked_coupon.expires_at <= now() then
    update public.coupons set state = 'expired' where id = locked_coupon.id;
    raise exception 'coupon expired' using errcode = '22023';
  end if;

  update public.coupons
  set state = 'redeemed', redeemed_at = now(), redeemed_by = redeemed_operator_id
  where id = locked_coupon.id
  returning * into locked_coupon;

  return locked_coupon;
end;
$$;

revoke all on function public.redeem_demo_coupon(uuid, uuid, uuid) from public;
grant execute on function public.redeem_demo_coupon(uuid, uuid, uuid) to service_role;
