import type { MerchantMetric } from './types'

export const DEMO_PIN = '0428'
export const DEMO_COUPON = 'WCH-2026-88'

export const merchantMetrics: MerchantMetric[] = [
  { label: '商圈導流', value: '96', detail: '完成導覽後查看店家' },
  { label: '領券轉換', value: '48', detail: '導流訪客的 50%' },
  { label: '到店核銷', value: '16', detail: '領券後核銷率 33%' },
]

export const districtFunnel = [
  { label: '掃描廟口 QR', value: 326, rate: '100%', width: '100%' },
  { label: '完成情境對話', value: 214, rate: '66%', width: '66%' },
  { label: '查看文化／店家路線', value: 96, rate: '29%', width: '45%' },
  { label: '領取商圈優惠', value: 48, rate: '15%', width: '31%' },
  { label: '合作店家核銷', value: 16, rate: '5%', width: '20%' },
] as const

export const aiInsight = {
  title: 'AI 情境洞察',
  body: '「參拜後想帶伴手禮」是本月最高轉換情境；建議在週末午後推送文化導覽＋伴手禮組合券。',
  tag: '可執行的商圈活動建議',
}
