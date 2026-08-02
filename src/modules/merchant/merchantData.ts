import type { MerchantMetric } from './types'

export const DEMO_PIN = '0428'
export const DEMO_COUPON = 'WCH-2026-88'

export const merchantMetrics: MerchantMetric[] = [
  { label: '本月領券', value: '48', detail: '較上月 +12%' },
  { label: '已核銷', value: '16', detail: '核銷率 33%' },
  { label: '參拜後來店', value: '11', detail: '主要情境來源' },
]
