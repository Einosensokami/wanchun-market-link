export type CouponStatus = 'idle' | 'valid' | 'redeemed' | 'rejected'

export interface MerchantMetric {
  label: string
  value: string
  detail: string
}

export interface RedemptionRecord {
  code: string
  redeemedAt: string
  benefit: string
}
