import { FormEvent, useState } from 'react'
import { LockKeyhole, ShieldCheck } from 'lucide-react'
import { DEMO_PIN } from './merchantData'

interface MerchantPinGateProps {
  onUnlock: () => void
}

export function MerchantPinGate({ onUnlock }: MerchantPinGateProps) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!/^\d{4}$/.test(pin)) {
      setError('請輸入四位數 PIN。')
      return
    }
    if (pin !== DEMO_PIN) {
      setError('PIN 不正確，請向平台管理員確認。')
      setPin('')
      return
    }
    setError('')
    onUnlock()
  }

  return (
    <section className="merchant-gate" aria-labelledby="merchant-gate-title">
      <div className="merchant-icon-wrap"><LockKeyhole size={25} aria-hidden="true" /></div>
      <p className="merchant-eyebrow">示範店家後台</p>
      <h2 id="merchant-gate-title">春和餅舖・核銷工作台</h2>
      <p>請由店家人員登入；本頁僅能核銷春和餅舖的示範優惠券。</p>
      <form onSubmit={submit} noValidate>
        <label htmlFor="merchant-pin">四位數 PIN</label>
        <input
          id="merchant-pin"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={4}
          pattern="[0-9]{4}"
          placeholder="輸入 PIN"
          value={pin}
          onChange={(event) => {
            setPin(event.target.value.replace(/\D/g, '').slice(0, 4))
            setError('')
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'merchant-pin-error' : undefined}
        />
        {error && <p className="merchant-error" id="merchant-pin-error" role="alert">{error}</p>}
        <button type="submit" className="merchant-primary">進入核銷後台</button>
      </form>
      <p className="merchant-demo-note"><ShieldCheck size={15} aria-hidden="true" /> Demo PIN：0428（正式版將改為店家帳號驗證）</p>
    </section>
  )
}
