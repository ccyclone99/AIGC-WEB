import { Coins, Sparkles, UserRound } from 'lucide-react'

import type { ViewId } from '../types'

type TopBarProps = {
  activeView: ViewId
  creditBalance: number
  onCredits: () => void
  onNavigate: (view: ViewId) => void
}

const navItems: Array<{ id: ViewId; label: string }> = [
  { id: 'home', label: '首页' },
  { id: 'workbench', label: '生产台' },
  { id: 'templates', label: '模板' },
  { id: 'tasks', label: '任务' },
  { id: 'me', label: '我的' },
]

export function TopBar({ activeView, creditBalance, onCredits, onNavigate }: TopBarProps) {
  return (
    <header className="topbar">
      <button type="button" className="brand-lockup" onClick={() => onNavigate('home')}>
        <span className="brand-mark">
          <Sparkles size={19} />
        </span>
        <span>
          <strong>AIGC Studio</strong>
          <small>商品图生成短视频</small>
        </span>
      </button>
      <nav className="top-links" aria-label="主导航">
        {navItems.map((item) => (
          <button
            type="button"
            key={item.id}
            className={activeView === item.id ? 'top-link is-active' : 'top-link'}
            onClick={() => onNavigate(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <div className="account-cluster">
        <button type="button" className="credit-pill" onClick={onCredits}>
          <Coins size={17} />
          <span>{creditBalance.toLocaleString()}</span>
        </button>
        <button type="button" className="avatar-button" onClick={() => onNavigate('me')} aria-label="账户">
          <UserRound size={18} />
        </button>
      </div>
    </header>
  )
}
