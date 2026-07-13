import {
  Bell,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock3,
  Coins,
  LockKeyhole,
  LogOut,
  ReceiptText,
  Sparkles,
  UserRound,
} from 'lucide-react'
import { useEffect, useRef } from 'react'

import { trackProductEvent } from '../analytics'
import { activeStatuses } from '../prototypeData'
import type { AccountSection, SessionState, Task, ViewId } from '../types'

type TopBarProps = {
  activeView: ViewId
  creditBalance: number
  newWorkCount: number
  session: SessionState
  tasks: Task[]
  onAccount: (section: AccountSection) => void
  onCredits: () => void
  onLogin: () => void
  onLogout: () => void
  onNavigate: (view: ViewId) => void
  onOpenTask: (taskId: string) => void
}

const navItems: Array<{ id: ViewId; label: string }> = [
  { id: 'home', label: '首页' },
  { id: 'workbench', label: '创作' },
  { id: 'works', label: '作品' },
]

export function TopBar({
  activeView,
  creditBalance,
  newWorkCount,
  session,
  tasks,
  onAccount,
  onCredits,
  onLogin,
  onLogout,
  onNavigate,
  onOpenTask,
}: TopBarProps) {
  const activeTasks = tasks.filter((task) => activeStatuses.includes(task.status))
  const latestTask = activeTasks[0]
  const accountMenuRef = useRef<HTMLDetailsElement>(null)
  const isNavActive = (view: ViewId) => activeView === view || (view === 'workbench' && activeView === 'templates')

  useEffect(() => {
    const closeOnOutside = (event: PointerEvent) => {
      const menu = accountMenuRef.current
      if (menu?.open && !menu.contains(event.target as Node)) menu.removeAttribute('open')
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') accountMenuRef.current?.removeAttribute('open')
    }
    document.addEventListener('pointerdown', closeOnOutside)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutside)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [])

  const handleAccountAction = (section: AccountSection, target: HTMLElement) => {
    target.closest('details')?.removeAttribute('open')
    trackProductEvent('account_menu_item_clicked', { section })
    onAccount(section)
  }

  const handleOpenTask = (taskId: string, target: HTMLElement) => {
    target.closest('details')?.removeAttribute('open')
    onOpenTask(taskId)
  }

  return (
    <>
      <header className="topbar">
        <button type="button" className="brand-lockup" onClick={() => onNavigate('home')} aria-label="返回首页">
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
              className={isNavActive(item.id) ? 'top-link is-active' : 'top-link'}
              aria-current={isNavActive(item.id) ? 'page' : undefined}
              onClick={() => { trackProductEvent('primary_nav_clicked', { view: item.id }); onNavigate(item.id) }}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="account-cluster">
          {(latestTask || newWorkCount > 0) && (
            <details className={latestTask ? 'global-task-menu' : 'global-task-menu has-new-work'}>
              <summary>
                {latestTask ? <Clock3 size={16} /> : <CheckCircle2 size={16} />}
                <span>
                  {latestTask
                    ? activeTasks.length === 1
                      ? `生成中 ${latestTask.progress}%`
                      : `${activeTasks.length} 个生成中`
                    : `${newWorkCount} 个新作品`}
                </span>
              </summary>
              <div className="global-task-popover">
                <header>
                  <strong>{latestTask ? '正在生成' : '作品已完成'}</strong>
                  <span>
                    {latestTask ? `${activeTasks.length} 个任务` : `${newWorkCount} 个新作品`}
                  </span>
                </header>
                {activeTasks.slice(0, 3).map((task) => (
                  <button
                    type="button"
                    key={task.id}
                    onClick={(event) => handleOpenTask(task.id, event.currentTarget)}
                  >
                    <img src={task.image} alt="" />
                    <span>
                      <strong>{task.title}</strong>
                      <small>{task.progress}%</small>
                      <i><b style={{ width: `${task.progress}%` }} /></i>
                    </span>
                    <ChevronRight size={15} />
                  </button>
                ))}
                {!latestTask && (
                  <p className="global-new-work-message">作品已经生成并保存，可以预览或下载。</p>
                )}
                <button
                  type="button"
                  className="global-task-all"
                  onClick={(event) => {
                    event.currentTarget.closest('details')?.removeAttribute('open')
                    onNavigate('works')
                  }}
                >
                  {newWorkCount > 0 ? '查看新作品' : '查看全部作品'}
                </button>
              </div>
            </details>
          )}
          <button type="button" className="credit-pill" onClick={onCredits} aria-label={`${creditBalance.toLocaleString()} 积分`}>
            <Coins size={17} />
            <span>{creditBalance.toLocaleString()}</span>
          </button>
          {session.authenticated ? (
            <details className="account-menu" ref={accountMenuRef} onToggle={(event) => {
              if (event.currentTarget.open) trackProductEvent('avatar_menu_opened')
            }}>
              <summary className="avatar-button" aria-label="打开账号菜单">
                {session.user?.avatarUrl ? <img src={session.user.avatarUrl} alt="" /> : <UserRound size={18} />}
              </summary>
              <div className="account-menu-popover">
                <header>
                  <span className="account-menu-avatar"><UserRound size={19} /></span>
                  <span>
                    <strong>{session.user?.displayName ?? '用户'}</strong>
                    <small>{session.user?.phoneMasked ?? session.user?.id}</small>
                  </span>
                </header>
                <button type="button" onClick={(event) => handleAccountAction('profile', event.currentTarget)}>
                  <UserRound size={17} /> 个人资料
                </button>
                <button type="button" onClick={(event) => { event.currentTarget.closest('details')?.removeAttribute('open'); onCredits() }}>
                  <ReceiptText size={17} /> 积分与账单
                </button>
                <button type="button" onClick={(event) => handleAccountAction('security', event.currentTarget)}>
                  <LockKeyhole size={17} /> 账号与安全
                </button>
                <button type="button" onClick={(event) => handleAccountAction('notifications', event.currentTarget)}>
                  <Bell size={17} /> 通知设置
                </button>
                <button type="button" onClick={(event) => handleAccountAction('help', event.currentTarget)}>
                  <CircleHelp size={17} /> 帮助与反馈
                </button>
                <button type="button" className="account-menu-logout" onClick={(event) => { event.currentTarget.closest('details')?.removeAttribute('open'); onLogout() }}>
                  <LogOut size={17} /> 退出登录
                </button>
              </div>
            </details>
          ) : (
            <button type="button" className="avatar-button" onClick={onLogin} aria-label="登录">
              <UserRound size={18} />
            </button>
          )}
        </div>
      </header>
      <nav className="mobile-bottom-nav" aria-label="移动端主导航">
        {navItems.map((item) => (
          <button
            type="button"
            key={item.id}
            className={isNavActive(item.id) ? 'top-link is-active' : 'top-link'}
            aria-current={isNavActive(item.id) ? 'page' : undefined}
            onClick={() => { trackProductEvent('primary_nav_clicked', { view: item.id, surface: 'mobile' }); onNavigate(item.id) }}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </>
  )
}
