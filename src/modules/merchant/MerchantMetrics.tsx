import { BarChart3, ReceiptText } from 'lucide-react'
import { merchantMetrics } from './merchantData'
import type { RedemptionRecord } from './types'

interface MerchantMetricsProps { lastRedemption: RedemptionRecord | null }

export function MerchantMetrics({ lastRedemption }: MerchantMetricsProps) {
  return <section className="merchant-panel" aria-labelledby="metrics-title">
    <div className="merchant-panel-heading"><div><p className="merchant-eyebrow">示範資料</p><h3 id="metrics-title">本月成效</h3></div><BarChart3 aria-hidden="true" /></div>
    <div className="merchant-metrics">
      {merchantMetrics.map((metric) => <article key={metric.label}><span>{metric.label}</span><strong>{metric.value}</strong><small>{metric.detail}</small></article>)}
    </div>
    <div className="merchant-last-redemption"><ReceiptText size={18} aria-hidden="true" /><div><strong>最近一筆核銷</strong>{lastRedemption ? <span>{lastRedemption.code}・{lastRedemption.benefit}・{lastRedemption.redeemedAt}</span> : <span>尚無本次操作紀錄</span>}</div></div>
  </section>
}
