import { Building2, ChevronRight, MapPin, ShieldCheck, Store, UsersRound } from 'lucide-react'
import type { ReactNode } from 'react'
import type { AppView } from './types'

interface AppShellProps {
  activeView: AppView
  onViewChange: (view: AppView) => void
  children: ReactNode
}

export default function AppShell({ activeView, onViewChange, children }: AppShellProps) {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true"><MapPin size={20} /></div>
          <div><p className="eyebrow">WAN CHUN · MARKET LINK</p><h1>萬春・廟口通</h1></div>
        </div>
        <nav className="view-switcher" aria-label="切換示範角色">
          <button className={activeView === 'visitor' ? 'active' : ''} onClick={() => onViewChange('visitor')}><UsersRound size={16} /> 信眾／遊客</button>
          <button className={activeView === 'merchant' ? 'active' : ''} onClick={() => onViewChange('merchant')}><Store size={16} /> 合作店家</button>
        </nav>
      </header>

      <div className="demo-notice" role="status"><ShieldCheck size={16} /><span>競賽示範資料：店家與優惠均為虛構情境，非真實合作或可兌換優惠。</span></div>

      <div className="shell-content">{children}</div>

      <footer className="site-footer">
        <div><Building2 size={17} /> 智慧宮廟 × 智慧零售</div>
        <span>從參拜人流，串起文化與商圈日常</span>
        <span>競賽示範版 <ChevronRight size={14} /></span>
      </footer>
    </div>
  )
}
