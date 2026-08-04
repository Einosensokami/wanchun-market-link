import { supabase } from '../../lib/supabase'
import { getVerifiedLineIdToken, LiffConfigurationError } from '../../lib/liff'

export interface PublishedOffer {
  id: string
  benefitText: string
  endsAt: string
  merchantName: string
}

export class AuthenticationRequiredError extends Error {
  constructor() {
    super('請先在 LINE MINI App 完成登入，才能領取優惠券。')
    this.name = 'AuthenticationRequiredError'
  }
}

export class CouponClaimError extends Error {
  constructor(readonly code: string) {
    super(`Coupon claim failed: ${code}`)
    this.name = 'CouponClaimError'
  }
}

interface OfferRow {
  id: string
  benefit_text: string
  ends_at: string
  merchants: { display_name: string } | null
}

export async function getPublishedDemoOffer(): Promise<PublishedOffer | null> {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('offers')
    .select('id, benefit_text, ends_at, merchants!inner(display_name)')
    .eq('demo_key', 'spring-gift-demo')
    .maybeSingle<OfferRow>()

  if (error) throw new Error('暫時無法讀取優惠資訊。')
  if (!data?.merchants) return null

  return {
    id: data.id,
    benefitText: data.benefit_text,
    endsAt: data.ends_at,
    merchantName: data.merchants.display_name,
  }
}

export async function claimOfferCoupon(offerId: string): Promise<string> {
  if (!supabase) throw new Error('目前尚未連線至優惠服務。')

  let idToken: string | null
  try {
    idToken = await getVerifiedLineIdToken()
  } catch (error) {
    if (error instanceof LiffConfigurationError) throw new AuthenticationRequiredError()
    throw error
  }
  if (!idToken) return new Promise(() => undefined)

  const { data, error } = await supabase.functions.invoke('line-claim-coupon', { body: { idToken, offerId } })
  const coupon = data as { couponCode?: string } | null

  if (error) {
    const response = 'context' in error && error.context instanceof Response ? error.context : null
    const body = response ? await response.clone().json().catch(() => null) as { error?: unknown } | null : null
    const code = typeof body?.error === 'string' ? body.error : `request_${response?.status ?? 'failed'}`
    throw new CouponClaimError(code)
  }
  if (!coupon?.couponCode) throw new CouponClaimError('invalid_coupon_response')
  return coupon.couponCode
}
