import { QrCode, Wallet } from 'lucide-react'
import { useState } from 'react'

import type { LedgerRow, LedgerStatus, PaymentOrder, PaymentOrderStatus, RechargePackage, ToastState } from '../types'

type CreditPanelProps = {
  balance: number
  frozenCredits: number
  ledgerRows: LedgerRow[]
  paymentOrder: PaymentOrder
  packages: RechargePackage[]
  onCreatePaymentOrder: (pack: RechargePackage) => void
  onResolvePaymentOrder: (status: Extract<PaymentOrderStatus, 'paid' | 'failed' | 'cancelled' | 'expired'>) => void
  onToast: (toast: ToastState) => void
}

const ledgerStatusLabel = (status: LedgerStatus) => {
  const statusMap: Record<LedgerStatus, string> = {
    frozen: '生成中',
    settled: '已使用',
    released: '已退回',
    credited: '已到账',
    granted: '已赠送',
  }

  return statusMap[status]
}

const paymentOrderStatusLabel = (status: PaymentOrderStatus) => {
  const statusMap: Record<PaymentOrderStatus, string> = {
    idle: '等待创建',
    pending: '待支付',
    paid: '已支付',
    failed: '支付未完成',
    cancelled: '已取消',
    expired: '已过期',
  }

  return statusMap[status]
}

export function CreditPanel({
  balance,
  frozenCredits,
  ledgerRows,
  paymentOrder,
  packages,
  onCreatePaymentOrder,
  onToast,
}: CreditPanelProps) {
  const [selectedPackageName, setSelectedPackageName] = useState(() => packages[1]?.name ?? packages[0]?.name ?? '')
  const selectedPackage = packages.find((pack) => pack.name === selectedPackageName) ?? packages[0]
  const hasPendingOrder = paymentOrder.status === 'pending'
  const orderStatus = paymentOrderStatusLabel(paymentOrder.status)

  return (
    <div className="credit-panel">
      <section className="balance-card">
        <p className="eyebrow">可用积分</p>
        <strong>{balance.toLocaleString()}</strong>
        <span>另有 {frozenCredits} 积分用于正在生成的任务。</span>
      </section>
      <div className="package-grid">
        {packages.map((pack) => (
          <button
            type="button"
            className={selectedPackage?.name === pack.name ? 'package-card is-selected' : 'package-card'}
            key={pack.name}
            onClick={() => {
              setSelectedPackageName(pack.name)
              onToast({ title: '充值包已选择', text: `${pack.name} 可以继续支付。` })
            }}
          >
            <span>{pack.name}</span>
            <strong>{pack.price}</strong>
            <small>{pack.credits.toLocaleString()} 积分 · {pack.bonus}</small>
          </button>
        ))}
      </div>
      <button
        type="button"
        className="primary-action recharge-action"
        disabled={hasPendingOrder || !selectedPackage}
        onClick={() => selectedPackage && onCreatePaymentOrder(selectedPackage)}
      >
        <Wallet size={18} />
        {hasPendingOrder ? '等待支付完成' : '立即充值'}
      </button>
      {paymentOrder.status !== 'idle' && (
        <section className={`payment-order-panel order-${paymentOrder.status}`}>
          <span>
            <QrCode size={18} />
            {orderStatus}
          </span>
          <span>
            <strong>{paymentOrder.packageName} · {paymentOrder.amount}</strong>
            <small>
              {paymentOrder.credits.toLocaleString()} 积分 · {paymentOrder.channel} · {paymentOrder.createdAt} · {paymentOrder.expiresIn}
            </small>
            <em>{paymentOrder.note}</em>
          </span>
        </section>
      )}
      <section className="ledger-list">
        {ledgerRows.map((row) => (
          <div className={`ledger-row ledger-${row.status}`} key={row.id}>
            <span className="ledger-main">
              <strong>{row.title}</strong>
              <small>{row.time}</small>
              <em>{row.note}</em>
            </span>
            <span className="ledger-side">
              <i>{ledgerStatusLabel(row.status)}</i>
              <b>{row.amount}</b>
            </span>
          </div>
        ))}
      </section>
    </div>
  )
}
