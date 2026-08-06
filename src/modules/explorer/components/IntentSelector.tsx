import { useState, type FormEvent } from 'react'
import { intentOptions } from '../demoData'
import type { VisitorIntent } from '../types'

interface IntentSelectorProps {
  onSelect: (intent: VisitorIntent) => void
  onPlan: (message: string) => void
}

export function IntentSelector({ onSelect, onPlan }: IntentSelectorProps) {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  function submitPlan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedMessage = message.trim()
    if (!trimmedMessage) {
      setError('請先用一句話說說今天想怎麼安排。')
      return
    }
    onPlan(trimmedMessage)
  }

  return <div role="group" aria-label="選擇今日目的" style={{ display: 'grid', gap: 10, marginTop: 20 }}>
    <form onSubmit={submitPlan} style={{ background: '#fff3df', border: '1px solid #eac99d', borderRadius: 14, display: 'grid', gap: 9, padding: 14 }}>
      <label htmlFor="journey-message" style={{ color: '#59331c', fontSize: 14, fontWeight: 700 }}>用一句話，讓 AI 幫你規劃</label>
      <textarea id="journey-message" value={message} onChange={(event) => { setMessage(event.target.value); setError('') }} placeholder="例如：陪長輩參拜，想吃午餐，也想帶伴手禮。" rows={3} style={textareaStyle} />
      {error && <p role="alert" style={{ color: '#a4261d', fontSize: 13, margin: 0 }}>{error}</p>}
      <button type="submit" style={planButtonStyle}>開始規劃行程</button>
      <small style={{ color: '#77522d', lineHeight: 1.45 }}>只解析行程需求，不輸入祈願、聯絡方式或其他個人資料。</small>
    </form>
    <p style={{ color: '#806b5a', fontSize: 13, margin: '8px 0 0', textAlign: 'center' }}>或直接選擇一個方向</p>
    {intentOptions.map((intent) => <button key={intent.id} type="button" onClick={() => onSelect(intent.id)} style={buttonStyle}>
      <span aria-hidden="true" style={{ fontSize: 25 }}>{intent.emoji}</span>
      <span style={{ textAlign: 'left' }}><strong>{intent.title}</strong><small style={{ color: '#695747', display: 'block', fontSize: 13, fontWeight: 400, marginTop: 3 }}>{intent.description}</small></span>
      <span aria-hidden="true" style={{ marginLeft: 'auto' }}>›</span>
    </button>)}
  </div>
}

const buttonStyle = { alignItems: 'center', background: '#fffaf3', border: '1px solid #ead9c7', borderRadius: 14, color: '#422716', cursor: 'pointer', display: 'flex', fontSize: 16, gap: 12, padding: '14px 16px', width: '100%' }
const textareaStyle = { border: '1px solid #d9b888', borderRadius: 10, color: '#422716', font: 'inherit', lineHeight: 1.45, padding: 10, resize: 'vertical' as const, width: '100%' }
const planButtonStyle = { background: '#9f3f22', border: 0, borderRadius: 10, color: '#fff', cursor: 'pointer', font: 'inherit', fontWeight: 700, minHeight: 42, padding: '9px 12px' }
