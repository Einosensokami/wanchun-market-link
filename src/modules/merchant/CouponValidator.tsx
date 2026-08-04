import { FormEvent, useState } from 'react'
import { CheckCircle2, QrCode, ScanLine, XCircle } from 'lucide-react'
import { MerchantRedemptionError, redeemMerchantCoupon } from './merchantRedemption'
import type { CouponStatus, RedemptionRecord } from './types'

interface CouponValidatorProps {
  merchantPin: string
  onRedeem: (record: RedemptionRecord) => void
}

const couponPattern = /^[A-F0-9]{8}-[A-F0-9]{4}-[1-5][A-F0-9]{3}-[89AB][A-F0-9]{3}-[A-F0-9]{12}$/

function redemptionMessage(code: string) {
  if (code === 'coupon_not_found') return '找不到此店家可核銷的券碼。'
  if (code === 'coupon_not_redeemable') return '此券已核銷、失效，或無法再次使用。'
  if (code === 'coupon_expired') return '此券已過期。'
  if (code === 'merchant_not_authorized') return '店家登入已失效，請重新登入。'
  return `核銷服務暫時無法使用（${code}）。`
}

export function CouponValidator({ merchantPin, onRedeem }: CouponValidatorProps) {
  const [code, setCode] = useState('')
  const [status, setStatus] = useState<CouponStatus>('idle')
  const [message, setMessage] = useState('')
  const [benefit, setBenefit] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function verify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalizedCode = code.trim().toUpperCase()
    if (!couponPattern.test(normalizedCode)) {
      setStatus('rejected')
      setMessage('券碼格式不正確，請重新掃描或輸入。')
      return
    }
    setIsSubmitting(true)
    try {
      const result = await redeemMerchantCoupon('verify', normalizedCode, merchantPin)
      setBenefit(result.benefitText ?? '')
      setStatus('valid')
      setMessage(`驗證成功：${result.benefitText ?? '此優惠可使用。'}`)
    } catch (error) {
      setStatus('rejected')
      setMessage(error instanceof MerchantRedemptionError ? redemptionMessage(error.code) : '核銷服務暫時無法使用。')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function redeem() {
    const normalizedCode = code.trim().toUpperCase()
    setIsSubmitting(true)
    try {
      const result = await redeemMerchantCoupon('redeem', normalizedCode, merchantPin)
      const record = {
      code: normalizedCode,
      redeemedAt: new Intl.DateTimeFormat('zh-TW', { hour: '2-digit', minute: '2-digit' }).format(new Date()),
      benefit: result.benefitText ?? benefit,
      }
      setStatus('redeemed')
      setMessage('核銷完成，券碼已標記為不可再次使用。')
      onRedeem(record)
    } catch (error) {
      setStatus('rejected')
      setMessage(error instanceof MerchantRedemptionError ? redemptionMessage(error.code) : '核銷服務暫時無法使用。')
    } finally {
      setIsSubmitting(false)
    }
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
          <input id="coupon-code" value={code} onChange={(event) => { setCode(event.target.value.slice(0, 36)); setStatus('idle'); setMessage('') }} placeholder="輸入或掃描券碼" autoCapitalize="characters" />
          <button type="submit" className="merchant-secondary" disabled={isSubmitting}><QrCode size={17} aria-hidden="true" />{isSubmitting ? '查驗中' : '查驗'}</button>
        </div>
      </form>
      <p className="merchant-test-code">請掃描或輸入訪客端顯示的雲端券碼。</p>
      {status !== 'idle' && <div className={`merchant-coupon-result is-${status}`} role="status">{statusIcon}<div><strong>{status === 'valid' ? '可核銷' : status === 'redeemed' ? '已核銷' : '無法核銷'}</strong><span>{message}</span></div></div>}
      {status === 'valid' && <button type="button" className="merchant-primary merchant-redeem" onClick={redeem} disabled={isSubmitting}>確認核銷此券</button>}
    </section>
  )
}
