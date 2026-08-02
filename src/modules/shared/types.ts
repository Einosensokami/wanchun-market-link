export type AppView = 'visitor' | 'merchant'

export type Intent = 'worship' | 'culture' | 'food' | 'gift'

export type MerchantCategory = '伴手禮' | '餐飲' | '茶飲' | '文化'

export interface Merchant {
  id: string
  name: string
  category: MerchantCategory
  description: string
  walkMinutes: number
  tags: string[]
  offer: string
  offerEndsAt: string
  accent: string
}

export interface GuideStop {
  id: string
  title: string
  duration: string
  description: string
  icon: 'gate' | 'incense' | 'story'
}

export interface Recommendation {
  merchant: Merchant
  reason: string
  confidence: '最適合' | '也很適合'
}

export interface DemoCoupon {
  id: string
  merchantId: string
  code: string
  title: string
  status: 'available' | 'redeemed' | 'expired'
  expiresAt: string
}

export interface MerchantMetric {
  label: string
  value: string
  change: string
  positive?: boolean
}
