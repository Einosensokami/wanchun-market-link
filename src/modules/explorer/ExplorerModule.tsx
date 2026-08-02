import { useState } from 'react'
import { getRecommendation } from './demoData'
import { CouponCard } from './components/CouponCard'
import { IntentSelector } from './components/IntentSelector'
import { RecommendationCard } from './components/RecommendationCard'
import { SectionHeader } from './components/SectionHeader'
import { VisitPreview } from './components/VisitPreview'
import type { ExplorerStage, VisitorIntent } from './types'
import type { CouponLifecycle } from '../shared/couponLifecycle'

/** A self-contained visitor-facing contest demo. All shop and offer data is explicitly fictional. */
interface ExplorerModuleProps {
  couponStatus: CouponLifecycle
  onClaimCoupon: () => void
}

export function ExplorerModule({ couponStatus, onClaimCoupon }: ExplorerModuleProps) {
  const [stage, setStage] = useState<ExplorerStage>('welcome')
  const [intent, setIntent] = useState<VisitorIntent>('worship')
  const [isFollowingOfficialAccount, setIsFollowingOfficialAccount] = useState(false)
  const recommendation = getRecommendation(intent)

  const chooseIntent = (nextIntent: VisitorIntent) => { setIntent(nextIntent); setStage('recommendation') }
  const restart = () => setStage('intent')

  return <main style={shellStyle}>
    <p style={brandStyle}>萬春・廟口通 <span style={{ color: '#8b7767', fontWeight: 500 }}>DEMO</span></p>
    {stage === 'welcome' && <><SectionHeader eyebrow="歡迎來到萬春宮" title="先用一分鐘，找到今天的廟口路線。">參拜與文化內容為預覽；不需要輸入個人祈願。</SectionHeader><VisitPreview isFollowingOfficialAccount={isFollowingOfficialAccount} onFollowOfficialAccount={() => setIsFollowingOfficialAccount(true)} onContinue={() => setStage('intent')} /></>}
    {stage === 'intent' && <><SectionHeader eyebrow="今天想做什麼？" title="選一個方向，我來幫你安排。">你也可以隨時返回，重新選擇。</SectionHeader><IntentSelector onSelect={chooseIntent} /></>}
    {stage === 'recommendation' && <><SectionHeader eyebrow="AI 情境推薦" title="為你的萬春宮行程，加上一站。">推薦根據你選擇的情境與受控示範資料產生。</SectionHeader><RecommendationCard recommendation={recommendation} onClaim={() => { onClaimCoupon(); setStage('coupon') }} /></>}
    {stage === 'coupon' && <><SectionHeader eyebrow="已加入你的行程" title={couponStatus === 'redeemed' ? '示範優惠券已核銷' : '示範優惠券已領取'}>正式上線後，店家將以一次性券碼即時核銷。</SectionHeader><CouponCard couponStatus={couponStatus} recommendation={recommendation} onRestart={restart} /></>}
    {stage !== 'welcome' && <button type="button" onClick={() => setStage('welcome')} style={backStyle}>← 回到參訪預覽</button>}
  </main>
}

export default ExplorerModule

const shellStyle = { background: '#fffdf9', border: '1px solid #ead9c7', borderRadius: 20, boxShadow: '0 10px 30px rgba(87, 49, 20, .08)', fontFamily: 'system-ui, -apple-system, sans-serif', margin: '0 auto', maxWidth: 460, padding: 24 }
const brandStyle = { color: '#9f3f22', fontSize: 15, fontWeight: 800, letterSpacing: '.04em', margin: '0 0 22px' }
const backStyle = { background: 'none', border: 0, color: '#8a6040', cursor: 'pointer', display: 'block', fontSize: 14, margin: '20px auto 0', padding: 6 }
