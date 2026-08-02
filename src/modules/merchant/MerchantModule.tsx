import { useState } from 'react'
import { LogOut, Store } from 'lucide-react'
import { CouponValidator } from './CouponValidator'
import { MerchantMetrics } from './MerchantMetrics'
import { MerchantPinGate } from './MerchantPinGate'
import type { RedemptionRecord } from './types'
import type { CouponLifecycle } from '../shared/couponLifecycle'
import './merchant.css'

interface MerchantModuleProps {
  couponStatus: CouponLifecycle
  onRedeemCoupon: () => void
}

export function MerchantModule({ couponStatus, onRedeemCoupon }: MerchantModuleProps) {
  const [unlocked, setUnlocked] = useState(false)
  const [lastRedemption, setLastRedemption] = useState<RedemptionRecord | null>(null)

  if (!unlocked) return <MerchantPinGate onUnlock={() => setUnlocked(true)} />

  return <main className="merchant-module" aria-label="春和餅舖店家後台">
    <header className="merchant-header"><div><p className="merchant-eyebrow"><Store size={14} aria-hidden="true" /> 示範店家後台</p><h2>春和餅舖</h2><span>萬春・廟口通合作店家</span></div><button type="button" className="merchant-logout" onClick={() => setUnlocked(false)}><LogOut size={16} aria-hidden="true" />登出</button></header>
    <div className="merchant-layout"><CouponValidator couponStatus={couponStatus} onRedeem={(record) => { setLastRedemption(record); onRedeemCoupon() }} /><MerchantMetrics lastRedemption={lastRedemption} /></div>
  </main>
}

export default MerchantModule
