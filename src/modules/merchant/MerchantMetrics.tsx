import { BarChart3, Lightbulb, ReceiptText } from 'lucide-react'
import { aiInsight, districtFunnel, merchantMetrics } from './merchantData'
import type { RedemptionRecord } from './types'
import './merchantMetrics.css'

interface MerchantMetricsProps { lastRedemption: RedemptionRecord | null }

export function MerchantMetrics({ lastRedemption }: MerchantMetricsProps) {
  return <section className="merchant-panel" aria-labelledby="metrics-title">
    <div className="merchant-panel-heading"><div><p className="merchant-eyebrow">示範資料</p><h3 id="metrics-title">本月成效</h3></div><BarChart3 aria-hidden="true" /></div>
    <div className="merchant-metrics">
      {merchantMetrics.map((metric) => <article key={metric.label}><span>{metric.label}</span><strong>{metric.value}</strong><small>{metric.detail}</small></article>)}
    </div>
    <div className="merchant-funnel" aria-label="廟口商圈導流漏斗">
      <div className="merchant-funnel-title"><strong>從廟口入口到店家核銷</strong><span>本月示範漏斗</span></div>
      <ol>
        {districtFunnel.map((stage) => <li key={stage.label}>
          <div><span>{stage.label}</span><strong>{stage.value}</strong><small>{stage.rate}</small></div>
          <i style={{ width: stage.width }} aria-hidden="true" />
        </li>)}
      </ol>
    </div>
    <aside className="merchant-ai-insight"><Lightbulb size={18} aria-hidden="true" /><div><strong>{aiInsight.title}</strong><span>{aiInsight.body}</span><small>{aiInsight.tag}</small></div></aside>
    <div className="merchant-last-redemption"><ReceiptText size={18} aria-hidden="true" /><div><strong>最近一筆核銷</strong>{lastRedemption ? <span>{lastRedemption.code}・{lastRedemption.benefit}・{lastRedemption.redeemedAt}</span> : <span>尚無本次操作紀錄</span>}</div></div>
  </section>
}
