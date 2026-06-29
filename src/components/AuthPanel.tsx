import { Gift, QrCode, UserRound } from 'lucide-react'

import type { AuthMode, QrLoginSession, QrLoginStatus, SignupRewardStatus, ToastState } from '../types'
import { qrLoginStatusCopy, signupRewardStateCopy } from '../viewModels'

type AuthPanelProps = {
  mode: AuthMode
  qrLoginSession: QrLoginSession
  signupRewardStatus: SignupRewardStatus
  onGrantSignupCredits: () => void
  onModeChange: (mode: AuthMode) => void
  onQrRefresh: () => void
  onQrStatusChange: (status: QrLoginStatus) => void
  onToast: (toast: ToastState) => void
}

export function AuthPanel({
  mode,
  qrLoginSession,
  signupRewardStatus,
  onGrantSignupCredits,
  onModeChange,
  onToast,
}: AuthPanelProps) {
  const rewardState = signupRewardStateCopy(signupRewardStatus)
  const rewardDisabled = signupRewardStatus === 'granted' || signupRewardStatus === 'claimed' || signupRewardStatus === 'risk_blocked'
  const qrState = qrLoginStatusCopy(qrLoginSession.status)

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
          <h2>{mode === 'register' ? '注册即送 300 积分' : '选择一种方式进入工作台'}</h2>
          <p>
            {mode === 'register'
              ? '每个账号限领一次，活动规则以页面说明为准。'
              : '支持扫码、手机号和第三方账号登录。'}
          </p>
        </div>
      </section>
      <section className={`qr-state-panel qr-${qrLoginSession.status}`}>
        <header>
          <span>
            <QrCode size={17} />
            <strong>{qrState.title}</strong>
          </span>
          <em>{qrLoginSession.expiresIn}</em>
        </header>
        <p>{qrLoginSession.provider} · {qrLoginSession.note}</p>
      </section>
      <section className={`reward-state-panel reward-${signupRewardStatus}`}>
        <span>
          <Gift size={18} />
          <strong>{rewardState.title}</strong>
        </span>
        <small>{rewardState.text}</small>
      </section>
      <div className="auth-action-grid">
        <button
          type="button"
          className="secondary-action"
          onClick={() => onToast({ title: '扫码登录', text: '请使用手机扫码完成登录。' })}
        >
          <QrCode size={18} />
          扫码登录
        </button>
        <button
          type="button"
          className="secondary-action"
          onClick={() => onToast({ title: '第三方登录', text: '请选择微信、支付宝、Google 或 Apple 账号继续。' })}
        >
          <UserRound size={18} />
          第三方登录
        </button>
        <button type="button" className="primary-action" disabled={rewardDisabled} onClick={onGrantSignupCredits}>
          <Gift size={18} />
          {rewardDisabled ? rewardState.action : '领取注册积分'}
        </button>
      </div>
    </div>
  )
}
