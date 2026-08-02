import type { ReactNode } from 'react'

interface SectionHeaderProps {
  eyebrow?: string
  title: string
  children?: ReactNode
}

export function SectionHeader({ eyebrow, title, children }: SectionHeaderProps) {
  return <header>
    {eyebrow && <p style={{ color: '#9f5c2a', fontSize: 14, fontWeight: 700, margin: '0 0 8px' }}>{eyebrow}</p>}
    <h2 style={{ color: '#422716', fontSize: 25, lineHeight: 1.3, margin: 0 }}>{title}</h2>
    {children && <div style={{ color: '#695747', lineHeight: 1.65, marginTop: 10 }}>{children}</div>}
  </header>
}
