import { Gift, LogOut, QrCode, RefreshCcw, UserRound } from 'lucide-react'

import type { AuthMode, QrLoginSession, QrLoginStatus, SessionState, SignupRewardStatus, ToastState } from '../types'
import { qrLoginStatusCopy, signupRewardStateCopy } from '../viewModels'

type AuthPanelProps = {
  mode: AuthMode
  isPrototype: boolean
  qrLoginSession: QrLoginSession
  session: SessionState
  signupRewardStatus: SignupRewardStatus
  onGrantSignupCredits: () => void
  onLogout: () => void
  onModeChange: (mode: AuthMode) => void
  onQrRefresh: () => void
  onQrStatusChange: (status: QrLoginStatus) => void
  onToast: (toast: ToastState) => void
}

export function AuthPanel({
  mode,
  isPrototype,
  qrLoginSession,
  session,
  signupRewardStatus,
  onGrantSignupCredits,
  onLogout,
  onModeChange,
  onQrRefresh,
  onQrStatusChange,
  onToast,
}: AuthPanelProps) {
  const rewardState = signupRewardStateCopy(signupRewardStatus)
  const rewardDisabled = signupRewardStatus === 'granted' || signupRewardStatus === 'claimed' || signupRewardStatus === 'risk_blocked'
  const qrState = qrLoginStatusCopy(qrLoginSession.status)

  if (session.authenticated) {
    return (
      <div className="auth-panel">
        <section className="auth-card auth-signed-in-card">
          <div className="qr-box auth-avatar-box">
            <UserRound size={42} />
            <span>已登录</span>
          </div>
          <div>
            <p className="eyebrow">当前账号</p>
            <h2>{session.user?.displayName ?? '已登录用户'}</h2>
            <p>{session.user?.phoneMasked ?? '账号状态已同步，可以继续创作。'}</p>
          </div>
        </section>
        <button type="button" className="secondary-action auth-logout-button" onClick={onLogout}>
          <LogOut size={18} />
          退出登录
        </button>
      </div>
    )
  }

  return (
    <div className="auth-panel">
      <div className="auth-tabs">
        <button
          type="button"
          className={mode === 'login' ? 'is-selected' : ''}
          onClick={() => onModeChange('login')}
        >
          登录
        </button>
        <button
          type="button"
          className={mode === 'register' ? 'is-selected' : ''}
          onClick={() => onModeChange('register')}
        >
          注册
        </button>
      </div>
      <section className="auth-card">
        <div className="qr-box">
          <QrCode size={42} />
          <span>{qrState.label}</span>
        </div>
        <div>
          <p className="eyebrow">{mode === 'register' ? '注册福利' : '登录'}</p>
          <h2>{mode === 'register' ? '注册即送 300 积分' : '登录后继续创作'}</h2>
          <p>
            {mode === 'register'
              ? '每个账号限领一次，活动规则以页面说明为准。'
              : '支持微信扫码或第三方账号登录。'}
          </p>
        </div>
      </section>
      {mode === 'register' && (
        <section className={`reward-state-panel reward-${signupRewardStatus}`}>
          <span>
            <Gift size={18} />
            <strong>{rewardState.title}</strong>
          </span>
          <small>{rewardState.text}</small>
        </section>
      )}
      <div className="auth-action-grid">
        <button
          type="button"
          className="secondary-action"
          onClick={() => onQrStatusChange('scanned')}
        >
          <QrCode size={18} />
          扫码登录
        </button>
        <button
          type="button"
          className="secondary-action"
          onClick={() => {
            if (isPrototype) {
              onQrStatusChange('confirmed')
              return
            }
            onToast({ title: '第三方登录', text: '请选择微信、支付宝、Google 或 Apple 账号继续。' })
          }}
        >
          <UserRound size={18} />
          第三方登录
        </button>
        {['expired', 'rejected'].includes(qrLoginSession.status) && (
          <button type="button" className="secondary-action" onClick={onQrRefresh}>
            <RefreshCcw size={18} />
            刷新二维码
          </button>
        )}
        {mode === 'register' && (
          <button type="button" className="primary-action" disabled={rewardDisabled} onClick={onGrantSignupCredits}>
            <Gift size={18} />
            {rewardDisabled ? rewardState.action : '领取注册积分'}
          </button>
        )}
      </div>
    </div>
  )
}
