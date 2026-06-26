import { CheckCircle2, Gift, QrCode, TimerReset, UserRound, X } from 'lucide-react'

import { signupRiskChecks } from '../prototypeData'
import type { AuthMode, QrLoginSession, QrLoginStatus, SignupRewardStatus, ToastState } from '../types'
import { qrLoginStatusCopy, riskStatusLabel, signupRewardStateCopy } from '../viewModels'

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
  onQrRefresh,
  onQrStatusChange,
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
          <p className="eyebrow">{mode === 'register' ? 'SIGNUP BONUS' : 'LOGIN'}</p>
          <h2>{mode === 'register' ? '注册即送 300 积分' : '选择一种方式进入工作台'}</h2>
          <p>
            {mode === 'register'
              ? '注册赠送会叠加设备、IP、手机号、支付行为和活动规则，防止重复注册薅羊毛。'
              : '后续可接入微信扫码、手机号验证码、企业微信和第三方账号登录。'}
          </p>
        </div>
      </section>
      <section className={`qr-state-panel qr-${qrLoginSession.status}`}>
        <header>
          <span>
            <QrCode size={17} />
            <strong>{qrState.title}</strong>
          </span>
          <em>{qrLoginSession.id} · {qrLoginSession.expiresIn}</em>
        </header>
        <p>{qrLoginSession.provider} · {qrLoginSession.note}</p>
        <div className="qr-state-actions">
          <button type="button" className="secondary-action" onClick={() => onQrStatusChange('scanned')}>
            <QrCode size={16} />
            已扫码
          </button>
          <button type="button" className="secondary-action" onClick={() => onQrStatusChange('confirmed')}>
            <CheckCircle2 size={16} />
            确认登录
          </button>
          <button type="button" className="secondary-action" onClick={() => onQrStatusChange('rejected')}>
            <X size={16} />
            拒绝登录
          </button>
          <button type="button" className="secondary-action" onClick={qrLoginSession.status === 'expired' ? onQrRefresh : () => onQrStatusChange('expired')}>
            <TimerReset size={16} />
            {qrLoginSession.status === 'expired' ? '刷新二维码' : '设为过期'}
          </button>
        </div>
      </section>
      <section className={`reward-state-panel reward-${signupRewardStatus}`}>
        <span>
          <Gift size={18} />
          <strong>{rewardState.title}</strong>
        </span>
        <small>{rewardState.text}</small>
      </section>
      <section className="risk-check-grid">
        {signupRiskChecks.map((check) => (
          <article className={`risk-check-card risk-${check.status}`} key={check.id}>
            <span>
              <small>{check.label}</small>
              <strong>{check.value}</strong>
            </span>
            <em>{riskStatusLabel(check.status)}</em>
            <p>{check.note}</p>
          </article>
        ))}
      </section>
      <div className="auth-action-grid">
        <button
          type="button"
          className="secondary-action"
          onClick={() => onQrStatusChange(qrLoginSession.status === 'scanned' ? 'confirmed' : 'scanned')}
        >
          <QrCode size={18} />
          扫码登录
        </button>
        <button
          type="button"
          className="secondary-action"
          onClick={() => onToast({ title: '第三方登录', text: '可接入微信、支付宝、Google 或 Apple 账号。' })}
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
