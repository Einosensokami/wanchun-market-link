import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

type RedemptionAction = 'verify' | 'redeem'

const encoder = new TextEncoder()
const couponCodePattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function requiredEnv(name: string) {
  const value = Deno.env.get(name)
  if (!value) throw new Error(`Missing required server setting: ${name}`)
  return value
}

function functionAdminKey() {
  const keys = JSON.parse(requiredEnv('SUPABASE_SECRET_KEYS')) as Record<string, unknown>
  const key = keys.function_admin
  if (typeof key !== 'string' || !key.startsWith('sb_secret_')) throw new Error('Missing required secret API key: function_admin')
  return key
}

function response(body: Record<string, string>, status: number, origin: string) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin, Vary: 'Origin' },
  })
}

async function pinMatches(received: string, expected: string) {
  const [receivedHash, expectedHash] = await Promise.all(
    [received, expected].map(async (pin) => new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(pin)))),
  )
  let difference = 0
  for (let index = 0; index < receivedHash.length; index += 1) difference |= receivedHash[index] ^ expectedHash[index]
  return difference === 0
}

async function demoOperatorId(admin: ReturnType<typeof createClient>) {
  const demoEmail = 'demo-merchant@identity.invalid'
  const { data: listed, error: listError } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 })
  if (listError) throw listError
  const existing = listed.users.find((user) => user.email === demoEmail)
  if (existing) return existing.id

  const { data: created, error: createError } = await admin.auth.admin.createUser({ email: demoEmail, email_confirm: true })
  if (createError || !created.user) throw createError ?? new Error('Unable to create demo merchant operator')
  return created.user.id
}

Deno.serve(async (request) => {
  const allowedOrigin = requiredEnv('APP_ORIGIN')
  const origin = request.headers.get('Origin') ?? ''
  if (origin !== allowedOrigin) return response({ error: 'origin_not_allowed' }, 403, allowedOrigin)
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': allowedOrigin, 'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info', 'Access-Control-Allow-Methods': 'POST, OPTIONS', Vary: 'Origin' } })
  }
  if (request.method !== 'POST') return response({ error: 'method_not_allowed' }, 405, allowedOrigin)

  try {
    const { action, couponCode, pin } = await request.json() as { action?: RedemptionAction; couponCode?: string; pin?: string }
    if ((action !== 'verify' && action !== 'redeem') || typeof couponCode !== 'string' || !couponCodePattern.test(couponCode) || typeof pin !== 'string') {
      return response({ error: 'invalid_request' }, 400, allowedOrigin)
    }
    if (!await pinMatches(pin, requiredEnv('DEMO_MERCHANT_PIN'))) return response({ error: 'merchant_not_authorized' }, 403, allowedOrigin)

    const merchantId = requiredEnv('DEMO_MERCHANT_ID')
    const admin = createClient(requiredEnv('SUPABASE_URL'), functionAdminKey(), { auth: { persistSession: false, autoRefreshToken: false } })
    const { data: coupon, error: couponError } = await admin
      .from('coupons')
      .select('state, expires_at, offers!inner(merchant_id, benefit_text)')
      .eq('public_code', couponCode)
      .eq('offers.merchant_id', merchantId)
      .maybeSingle()
    if (couponError) throw couponError
    if (!coupon) return response({ error: 'coupon_not_found' }, 404, allowedOrigin)
    if (coupon.state !== 'claimed') return response({ error: 'coupon_not_redeemable' }, 409, allowedOrigin)
    if (new Date(coupon.expires_at).getTime() <= Date.now()) return response({ error: 'coupon_expired' }, 409, allowedOrigin)

    const offer = coupon.offers as { benefit_text: string } | null
    if (action === 'verify') return response({ status: 'valid', benefitText: offer?.benefit_text ?? '' }, 200, allowedOrigin)

    const operatorId = await demoOperatorId(admin)
    const { error: redeemError } = await admin.rpc('redeem_demo_coupon', {
      requested_code: couponCode,
      requested_merchant_id: merchantId,
      redeemed_operator_id: operatorId,
    })
    if (redeemError) {
      if (redeemError.code === '22023') return response({ error: 'coupon_not_redeemable' }, 409, allowedOrigin)
      throw redeemError
    }
    return response({ status: 'redeemed', benefitText: offer?.benefit_text ?? '' }, 200, allowedOrigin)
  } catch (error) {
    console.error('merchant-redeem-coupon failed', error instanceof Error ? error.message : 'unknown error')
    return response({ error: 'redemption_unavailable' }, 500, allowedOrigin)
  }
})
