import { supabase } from '../../lib/supabase'

type RedemptionAction = 'verify' | 'redeem'

interface RedemptionResponse {
  status?: 'valid' | 'redeemed'
  benefitText?: string
  error?: string
}

export class MerchantRedemptionError extends Error {
  constructor(readonly code: string) {
    super(`Merchant redemption failed: ${code}`)
    this.name = 'MerchantRedemptionError'
  }
}

export async function redeemMerchantCoupon(action: RedemptionAction, couponCode: string, pin: string) {
  if (!supabase) throw new MerchantRedemptionError('service_not_configured')
  const { data, error } = await supabase.functions.invoke('merchant-redeem-coupon', { body: { action, couponCode, pin } })
  const response = data as RedemptionResponse | null

  if (error) {
    const httpResponse = 'context' in error && error.context instanceof Response ? error.context : null
    const body = httpResponse ? await httpResponse.clone().json().catch(() => null) as RedemptionResponse | null : null
    throw new MerchantRedemptionError(body?.error ?? `request_${httpResponse?.status ?? 'failed'}`)
  }
  if (!response?.status) throw new MerchantRedemptionError(response?.error ?? 'invalid_response')
  return response
}
