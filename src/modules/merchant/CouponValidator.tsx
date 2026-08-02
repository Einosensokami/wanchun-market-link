import { FormEvent, useState } from 'react'
import { CheckCircle2, QrCode, ScanLine, XCircle } from 'lucide-react'
import { DEMO_COUPON } from './merchantData'
import { checkDemoCoupon, type CouponLifecycle } from '../shared/couponLifecycle'
import type { CouponStatus, RedemptionRecord } from './types'

interface CouponValidatorProps {
  couponStatus: CouponLifecycle
  onRedeem: (record: RedemptionRecord) => void
}

const couponPattern = /^[A-Z0-9-]{6,32}$/

export function CouponValidator({ couponStatus, onRedeem }: CouponValidatorProps) {
  const [code, setCode] = useState('')
  const [status, setStatus] = useState<CouponStatus>('idle')
  const [message, setMessage] = useState('')

  function verify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalizedCode = code.trim().toUpperCase()
    if (!couponPattern.test(normalizedCode)) {
      setStatus('rejected')
      setMessage('券碼格式不正確，請重新掃描或輸入。')
      return
    }
    const check = checkDemoCoupon(normalizedCode, couponStatus, DEMO_COUPON)
    if (check !== 'valid') {
      setStatus('rejected')
      setMessage(check === 'unknown' ? '找不到此券碼。此示範只接受畫面提示的測試券。' : check === 'not-claimed' ? '此券尚未由使用者端領取，請先完成訪客端流程。' : '此券已於本次示範中核銷，無法重複使用。')
      return
    }
    setStatus('valid')
    setMessage('驗證成功：全館伴手禮滿 NT$300 折 NT$30。')
  }

  function redeem() {
    const record = {
      code: DEMO_COUPON,
      redeemedAt: new Intl.DateTimeFormat('zh-TW', { hour: '2-digit', minute: '2-digit' }).format(new Date()),
      benefit: '滿 NT$300 折 NT$30',
    }
    setStatus('redeemed')
    setMessage('核銷完成，券碼已標記為不可再次使用。')
    onRedeem(record)
  }

  const statusIcon = status === 'rejected' ? <XCircle aria-hidden="true" /> : <CheckCircle2 aria-hidden="true" />

  return (
    <section className="merchant-panel" aria-labelledby="coupon-title">
      <div className="merchant-panel-heading">
        <div><p className="merchant-eyebrow">即時查驗</p><h3 id="coupon-title">優惠券核銷</h3></div>
        <span className="merchant-demo-badge">Demo</span>
      </div>
      <div className="merchant-scan-placeholder" aria-hidden="true"><ScanLine size={24} /><span>掃描使用者 MINI App 券碼</span></div>
      <form onSubmit={verify} noValidate>
        <label htmlFor="coupon-code">券碼</label>
        <div className="merchant-code-row">
          <input id="coupon-code" value={code} onChange={(event) => { setCode(event.target.value.slice(0, 32)); setStatus('idle'); setMessage('') }} placeholder="輸入或掃描券碼" autoCapitalize="characters" />
          <button type="submit" className="merchant-secondary"><QrCode size={17} aria-hidden="true" />查驗</button>
        </div>
      </form>
      <p className="merchant-test-code">測試券碼：<button type="button" onClick={() => { setCode(DEMO_COUPON); setStatus('idle'); setMessage('') }}>{DEMO_COUPON}</button></p>
      {status !== 'idle' && <div className={`merchant-coupon-result is-${status}`} role="status">{statusIcon}<div><strong>{status === 'valid' ? '可核銷' : status === 'redeemed' ? '已核銷' : '無法核銷'}</strong><span>{message}</span></div></div>}
      {status === 'valid' && <button type="button" className="merchant-primary merchant-redeem" onClick={redeem}>確認核銷此券</button>}
    </section>
  )
}
