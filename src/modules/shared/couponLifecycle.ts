export type CouponLifecycle = 'unclaimed' | 'claimed' | 'redeemed'

export type CouponCheck = 'valid' | 'not-claimed' | 'already-redeemed' | 'unknown'

export function checkDemoCoupon(code: string, lifecycle: CouponLifecycle, expectedCode: string): CouponCheck {
  if (code.trim().toUpperCase() !== expectedCode) return 'unknown'
  if (lifecycle === 'unclaimed') return 'not-claimed'
  if (lifecycle === 'redeemed') return 'already-redeemed'
  return 'valid'
}
