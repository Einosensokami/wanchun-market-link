import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

type LineVerification = { iss: string; aud: string; sub: string; exp: number }

const encoder = new TextEncoder()

function response(body: Record<string, string>, status: number, origin: string) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin, Vary: 'Origin' },
  })
}

function requiredEnv(name: string) {
  const value = Deno.env.get(name)
  if (!value) throw new Error(`Missing required server setting: ${name}`)
  return value
}

async function hashLineSubject(subject: string, secret: string) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(subject))
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

async function verifyLineIdToken(idToken: string, channelId: string) {
  const body = new URLSearchParams({ id_token: idToken, client_id: channelId })
  const result = await fetch('https://api.line.me/oauth2/v2.1/verify', {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body,
  })
  if (!result.ok) throw new Error('LINE token verification failed')
  const claims = await result.json() as LineVerification
  if (claims.iss !== 'https://access.line.me' || claims.aud !== channelId || !claims.sub || claims.exp * 1000 <= Date.now()) {
    throw new Error('LINE token claims are invalid')
  }
  return claims
}

Deno.serve(async (request) => {
  const allowedOrigin = requiredEnv('APP_ORIGIN')
  const origin = request.headers.get('Origin') ?? ''
  if (origin !== allowedOrigin) return response({ error: 'origin_not_allowed' }, 403, allowedOrigin)
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': allowedOrigin, 'Access-Control-Allow-Headers': 'authorization, apikey, content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS', Vary: 'Origin' } })
  if (request.method !== 'POST') return response({ error: 'method_not_allowed' }, 405, allowedOrigin)

  try {
    const { idToken, offerId } = await request.json()
    if (typeof idToken !== 'string' || typeof offerId !== 'string') return response({ error: 'invalid_request' }, 400, allowedOrigin)

    const channelId = requiredEnv('LINE_LOGIN_CHANNEL_ID')
    const claims = await verifyLineIdToken(idToken, channelId)
    const subjectHash = await hashLineSubject(claims.sub, requiredEnv('LINE_SUBJECT_HASH_SECRET'))
    const admin = createClient(requiredEnv('SUPABASE_URL'), requiredEnv('SUPABASE_SERVICE_ROLE_KEY'), { auth: { persistSession: false, autoRefreshToken: false } })

    const { data: existingIdentity, error: identityError } = await admin
      .from('line_identities')
      .select('user_id')
      .eq('subject_hash', subjectHash)
      .maybeSingle()
    if (identityError) throw identityError

    let userId = existingIdentity?.user_id as string | undefined
    if (!userId) {
      const { data: createdUser, error: createUserError } = await admin.auth.admin.createUser({
        email: `line-${subjectHash}@identity.invalid`, email_confirm: true,
      })
      if (createUserError || !createdUser.user) throw createUserError ?? new Error('Unable to create identity')
      userId = createdUser.user.id
      const { error: insertIdentityError } = await admin.from('line_identities').insert({ user_id: userId, subject_hash: subjectHash })
      if (insertIdentityError?.code === '23505') {
        const { data: concurrentIdentity, error: concurrentError } = await admin.from('line_identities').select('user_id').eq('subject_hash', subjectHash).single()
        if (concurrentError) throw concurrentError
        userId = concurrentIdentity.user_id
      } else if (insertIdentityError) throw insertIdentityError
    }

    const { data: coupon, error: claimError } = await admin
      .rpc('claim_coupon_for_line_identity', { requested_offer_id: offerId, requested_user_id: userId })
      .single()
    if (claimError || !coupon) throw claimError ?? new Error('Unable to issue coupon')

    return response({ couponCode: coupon.public_code }, 200, allowedOrigin)
  } catch (error) {
    console.error('line-claim-coupon failed', error instanceof Error ? error.message : 'unknown error')
    return response({ error: 'coupon_claim_failed' }, 400, allowedOrigin)
  }
})
