import { useState } from 'react'
import { QrCode, ShieldCheck, UserRound } from 'lucide-react'

import type { AuthMode, QrLoginSession, QrLoginStatus, SignupRewardStatus, ToastState } from '../types'
import { AuthPanel } from './AuthPanel'

type AccountPanelProps = {
  labelledBy: string
  panelId: string
  qrLoginSession: QrLoginSession
  signupRewardStatus: SignupRewardStatus
  onGrantSignupCredits: () => void
  onQrRefresh: () => void
  onQrStatusChange: (status: QrLoginStatus) => void
  onToast: (toast: ToastState) => void
}

export function AccountPanel({
  labelledBy,
  panelId,
  qrLoginSession,
  signupRewardStatus,
  onGrantSignupCredits,
  onQrRefresh,
  onQrStatusChange,
  onToast,
}: AccountPanelProps) {
  const [accountAuthMode, setAccountAuthMode] = useState<AuthMode>('login')

  return (
    <section className="me-tab-panel account-tab-panel" id={panelId} role="tabpanel" aria-labelledby={labelledBy}>
      <AuthPanel
        mode={accountAuthMode}
        onGrantSignupCredits={onGrantSignupCredits}
        onModeChange={setAccountAuthMode}
        onQrRefresh={onQrRefresh}
        onQrStatusChange={onQrStatusChange}
        onToast={onToast}
        qrLoginSession={qrLoginSession}
        signupRewardStatus={signupRewardStatus}
      />
      <div className="account-binding-panel">
        <strong>账号安全与绑定</strong>
        <div>
          <span>
            <ShieldCheck size={16} />
            手机号校验
          </span>
          <span>
            <QrCode size={16} />
            微信扫码
          </span>
          <span>
            <UserRound size={16} />
            第三方账号
          </span>
        </div>
        <p>注册赠送积分会叠加设备、IP、手机号、支付行为和活动规则，防止重复领取。</p>
      </div>
    </section>
  )
}
