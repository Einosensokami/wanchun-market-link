import { useState } from 'react'
import ExplorerModule from './modules/explorer'
import MerchantModule from './modules/merchant'
import AppShell from './modules/shared/Shell'
import type { CouponLifecycle } from './modules/shared/couponLifecycle'
import type { AppView } from './modules/shared/types'

export default function App() {
  const [activeView, setActiveView] = useState<AppView>('visitor')
  const [couponStatus, setCouponStatus] = useState<CouponLifecycle>('unclaimed')
  return <AppShell activeView={activeView} onViewChange={setActiveView}>
    {activeView === 'visitor'
      ? <ExplorerModule couponStatus={couponStatus} onClaimCoupon={() => setCouponStatus('claimed')} />
      : <MerchantModule couponStatus={couponStatus} onRedeemCoupon={() => setCouponStatus('redeemed')} />}
  </AppShell>
}
