import { intentOptions } from '../demoData'
import type { VisitorIntent } from '../types'

interface IntentSelectorProps { onSelect: (intent: VisitorIntent) => void }

export function IntentSelector({ onSelect }: IntentSelectorProps) {
  return <div role="group" aria-label="選擇今日目的" style={{ display: 'grid', gap: 10, marginTop: 20 }}>
    {intentOptions.map((intent) => <button key={intent.id} type="button" onClick={() => onSelect(intent.id)} style={buttonStyle}>
      <span aria-hidden="true" style={{ fontSize: 25 }}>{intent.emoji}</span>
      <span style={{ textAlign: 'left' }}><strong>{intent.title}</strong><small style={{ color: '#695747', display: 'block', fontSize: 13, fontWeight: 400, marginTop: 3 }}>{intent.description}</small></span>
      <span aria-hidden="true" style={{ marginLeft: 'auto' }}>›</span>
    </button>)}
  </div>
}

const buttonStyle = { alignItems: 'center', background: '#fffaf3', border: '1px solid #ead9c7', borderRadius: 14, color: '#422716', cursor: 'pointer', display: 'flex', fontSize: 16, gap: 12, padding: '14px 16px', width: '100%' }
