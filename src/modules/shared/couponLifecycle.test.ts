import { describe, expect, it } from 'vitest'
import { checkDemoCoupon } from './couponLifecycle'

describe('coupon lifecycle', () => {
  const code = 'WCH-2026-88'

  it('only validates a claimed coupon', () => {
    expect(checkDemoCoupon(code, 'unclaimed', code)).toBe('not-claimed')
    expect(checkDemoCoupon(code, 'claimed', code)).toBe('valid')
    expect(checkDemoCoupon(code, 'redeemed', code)).toBe('already-redeemed')
  })

  it('does not accept a different coupon', () => {
    expect(checkDemoCoupon('WCH-OTHER', 'claimed', code)).toBe('unknown')
  })
})
