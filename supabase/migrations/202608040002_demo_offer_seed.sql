-- Competition-only seed data. It is intentionally fictional and must not be presented as a real partnership.
alter table public.offers
  add column if not exists demo_key text unique check (char_length(demo_key) between 1 and 64);

insert into public.merchants (id, display_name, is_active)
values ('91ce1d59-3a41-4a0e-8e41-78cedee3a204', '春和餅舖（示範）', true)
on conflict (id) do update
set display_name = excluded.display_name, is_active = excluded.is_active;

insert into public.offers (id, merchant_id, demo_key, title, benefit_text, starts_at, ends_at, is_published)
values (
  'f820ca5b-109c-4d35-9c34-62bd1e1c41d1',
  '91ce1d59-3a41-4a0e-8e41-78cedee3a204',
  'spring-gift-demo',
  '參拜後的在地伴手禮',
  '滿 NT$300 折 NT$30',
  '2026-08-04T00:00:00+08:00',
  '2026-10-31T23:59:59+08:00',
  true
)
on conflict (id) do update
set merchant_id = excluded.merchant_id,
    demo_key = excluded.demo_key,
    title = excluded.title,
    benefit_text = excluded.benefit_text,
    starts_at = excluded.starts_at,
    ends_at = excluded.ends_at,
    is_published = excluded.is_published;
