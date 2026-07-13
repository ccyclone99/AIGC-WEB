import { useState } from 'react'
import { Bell, CheckCircle2, HelpCircle, LockKeyhole, MessageSquareText, ShieldCheck, UserRound } from 'lucide-react'

import type { AccountSection, SessionState, ToastState } from '../types'

type AccountSettingsPanelProps = {
  section: AccountSection
  session: SessionState
  onToast: (toast: ToastState) => void
}

const sectionTitle: Record<AccountSection, string> = {
  profile: '个人资料',
  security: '账号与安全',
  notifications: '通知设置',
  help: '帮助与反馈',
}

export function AccountSettingsPanel({ section, session, onToast }: AccountSettingsPanelProps) {
  const [taskNotifications, setTaskNotifications] = useState(true)
  const [billingNotifications, setBillingNotifications] = useState(true)
  const user = session.user

  return (
    <div className="account-settings-panel">
      <header>
        <span className="account-settings-icon">
          {section === 'profile' && <UserRound size={20} />}
          {section === 'security' && <LockKeyhole size={20} />}
          {section === 'notifications' && <Bell size={20} />}
          {section === 'help' && <HelpCircle size={20} />}
        </span>
        <div>
          <strong>{sectionTitle[section]}</strong>
          <small>{user?.displayName ?? '当前账号'}</small>
        </div>
      </header>

      {section === 'profile' && (
        <div className="account-settings-list">
          <span><small>昵称</small><strong>{user?.displayName ?? '用户'}</strong></span>
          <span><small>账号 ID</small><strong>{user?.id ?? '—'}</strong></span>
          <span><small>手机号</small><strong>{user?.phoneMasked ?? '暂未绑定'}</strong></span>
          <button type="button" className="secondary-action" onClick={() => onToast({ title: '资料已保存', text: '当前资料没有需要更新的内容。' })}>
            保存资料
          </button>
        </div>
      )}

      {section === 'security' && (
        <div className="account-settings-list">
          <span><ShieldCheck size={18} /><div><strong>登录保护</strong><small>新设备登录时需要再次确认。</small></div><em>已开启</em></span>
          <span><CheckCircle2 size={18} /><div><strong>当前设备</strong><small>香港 · 当前浏览器</small></div><em>使用中</em></span>
          <button type="button" className="secondary-action" onClick={() => onToast({ title: '其他设备已退出', text: '当前设备仍保持登录。' })}>
            退出其他设备
          </button>
        </div>
      )}

      {section === 'notifications' && (
        <div className="account-toggle-list">
          <label>
            <span><strong>生成结果</strong><small>视频完成或需要处理时通知我。</small></span>
            <input type="checkbox" checked={taskNotifications} onChange={(event) => setTaskNotifications(event.currentTarget.checked)} />
          </label>
          <label>
            <span><strong>积分与账单</strong><small>充值到账和积分退回时通知我。</small></span>
            <input type="checkbox" checked={billingNotifications} onChange={(event) => setBillingNotifications(event.currentTarget.checked)} />
          </label>
        </div>
      )}

      {section === 'help' && (
        <div className="account-help-list">
          <button type="button" onClick={() => onToast({ title: '帮助中心', text: '帮助内容将在正式服务接入后开放。' })}>
            <HelpCircle size={18} /><span><strong>使用帮助</strong><small>查看模板、生成和下载说明。</small></span>
          </button>
          <button type="button" onClick={() => onToast({ title: '反馈已记录', text: '感谢反馈，我们会继续优化使用体验。' })}>
            <MessageSquareText size={18} /><span><strong>意见反馈</strong><small>告诉我们哪里不好用。</small></span>
          </button>
        </div>
      )}
    </div>
  )
}
