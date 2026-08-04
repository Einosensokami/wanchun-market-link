import type { DemoRecommendation } from '../types'
import type { ClaimedCoupon } from '../types'
import type { CouponLifecycle } from '../../shared/couponLifecycle'

interface CouponCardProps {
  recommendation: DemoRecommendation
  couponStatus: CouponLifecycle
  claimedCoupon?: ClaimedCoupon
  onRestart: () => void
}

export function CouponCard({ recommendation, couponStatus, claimedCoupon, onRestart }: CouponCardProps) {
  return <section aria-label="已領取示範優惠券" style={{ marginTop: 20 }}>
    <div role="status" style={{ background: couponStatus === 'redeemed' ? '#eef0ed' : '#e8f4eb', border: '1px solid #b8d9bf', borderRadius: 12, color: '#255e38', padding: 12 }}>{couponStatus === 'redeemed' ? '此示範券已由店家端核銷，不能再次使用。' : '示範優惠券已加入。正式上線時，將產生一次性券碼供店家掃碼核銷。'}</div>
    <article style={{ background: '#fffaf3', border: '2px dashed #b77d44', borderRadius: 16, marginTop: 14, padding: 20, textAlign: 'center' }}>
      <p style={{ color: '#9f5c2a', fontSize: 13, fontWeight: 700, margin: 0 }}>萬春・廟口通｜示範優惠券</p>
      <h3 style={{ color: '#422716', margin: '10px 0 6px' }}>{recommendation.name}</h3>
      <p style={{ color: '#9f3f22', fontSize: 20, fontWeight: 700, margin: '0 0 14px' }}>{recommendation.offer}</p>
      <div aria-label="示範券碼" style={{ background: '#422716', borderRadius: 8, color: '#fff', fontFamily: 'monospace', letterSpacing: 2, overflowWrap: 'anywhere', padding: 13 }}>{couponStatus === 'redeemed' ? '已核銷' : claimedCoupon?.code ?? 'WCH-2026-88'}</div>
      <p style={{ color: '#695747', fontSize: 13, lineHeight: 1.5 }}>{claimedCoupon?.isCloudIssued ? '此券已由雲端服務簽發；店家端須以已授權帳號執行核銷。' : '此券為競賽展示資料，不可兌換、不可折現；可於店家端用同券碼展示一次性核銷。'}</p>
    </article>
    <button type="button" onClick={onRestart} style={secondaryButton}>重新體驗行程推薦</button>
  </section>
}

const secondaryButton = { background: 'transparent', border: '1px solid #9f3f22', borderRadius: 12, color: '#9f3f22', cursor: 'pointer', fontSize: 15, fontWeight: 700, marginTop: 16, padding: '12px 16px', width: '100%' }
