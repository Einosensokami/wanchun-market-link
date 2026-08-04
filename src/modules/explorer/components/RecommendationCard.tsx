import type { DemoRecommendation } from '../types'

interface RecommendationCardProps {
  recommendation: DemoRecommendation
  onClaim: () => void
  claimError?: string
  isClaiming?: boolean
  usesCloudOffer?: boolean
  canClaim?: boolean
}

export function RecommendationCard({ recommendation, onClaim, claimError, isClaiming = false, usesCloudOffer = false, canClaim = true }: RecommendationCardProps) {
  return <section aria-label="AI 示範推薦" style={{ marginTop: 20 }}>
    <div style={{ background: '#fff3df', border: '1px solid #eac99d', borderRadius: 12, color: '#77522d', fontSize: 13, padding: '9px 12px' }}>AI 依已驗證的示範資料產生推薦；店家與優惠均非真實合作資訊。</div>
    <article style={{ background: '#fffaf3', border: '1px solid #ead9c7', borderRadius: 16, marginTop: 12, padding: 18 }}>
      <p style={{ color: '#9f5c2a', fontSize: 13, fontWeight: 700, margin: 0 }}>{recommendation.category}</p>
      <h3 style={{ color: '#422716', fontSize: 22, margin: '7px 0' }}>{recommendation.name}</h3>
      <p style={copyStyle}>{recommendation.description}</p>
      <div style={{ background: '#f4e4d1', borderRadius: 10, color: '#59331c', fontSize: 14, lineHeight: 1.55, marginTop: 14, padding: 12 }}><strong>為什麼推薦？</strong><br />{recommendation.reason}</div>
      <p style={{ color: '#9f3f22', fontWeight: 700, margin: '16px 0 3px' }}>{recommendation.offer}</p>
      <p style={{ color: '#766557', fontSize: 13, margin: 0 }}>示範優惠期限：{recommendation.validUntil}</p>
      {claimError && <p role="alert" style={{ color: '#a4261d', fontSize: 14, lineHeight: 1.5, margin: '14px 0 0' }}>{claimError}</p>}
      {canClaim ? <button type="button" onClick={onClaim} disabled={isClaiming} style={{ ...buttonStyle, cursor: isClaiming ? 'wait' : 'pointer', opacity: isClaiming ? .7 : 1 }}>{isClaiming ? '領取中…' : usesCloudOffer ? '登入後領取優惠券' : '領取示範優惠券'}</button> : <p style={{ color: '#6e6156', fontSize: 13, lineHeight: 1.5, margin: '16px 0 0' }}>此情境先提供導覽與店家資訊；伴手禮情境可實際測試雲端領券。</p>}
    </article>
  </section>
}

const copyStyle = { color: '#695747', lineHeight: 1.6, margin: 0 }
const buttonStyle = { background: '#9f3f22', border: 0, borderRadius: 12, color: '#fff', cursor: 'pointer', fontSize: 16, fontWeight: 700, marginTop: 16, padding: '13px 16px', width: '100%' }
