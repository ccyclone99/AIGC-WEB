import { RefreshCcw, Upload, X } from 'lucide-react'

import type { UploadReceipt, UploadReceiptStatus } from '../types'

type UploadReceiptPanelProps = {
  receipt: UploadReceipt
  onCancel?: () => void
  onRetry?: () => void
}

const uploadReceiptStatusLabel = (status: UploadReceiptStatus) => {
  const statusMap: Record<UploadReceiptStatus, string> = {
    idle: '等待上传',
    validating: '校验中',
    uploading: '入库中',
    saved: '已入库',
    failed: '上传失败',
    cancelled: '已取消',
    rejected: '服务端驳回',
  }

  return statusMap[status]
}

export function UploadReceiptPanel({ receipt, onCancel, onRetry }: UploadReceiptPanelProps) {
  const canCancel = receipt.status === 'validating' || receipt.status === 'uploading'
  const canRetry = receipt.status === 'failed' || receipt.status === 'cancelled' || receipt.status === 'rejected'

  return (
    <section className={`upload-receipt-panel upload-${receipt.status}`}>
      <div>
        <span>
          <Upload size={17} />
          <strong>{uploadReceiptStatusLabel(receipt.status)}</strong>
        </span>
        <em>{receipt.id}</em>
      </div>
      <p>
        {receipt.fileName} · {receipt.source} · {receipt.message}
      </p>
      <span className="upload-receipt-progress" aria-label={`${receipt.progress}%`}>
        <span style={{ width: `${receipt.progress}%` }}></span>
      </span>
      {(canCancel || canRetry) && (
        <div className="upload-receipt-actions">
          {canCancel && (
            <button type="button" className="secondary-action" onClick={onCancel}>
              <X size={15} />
              取消上传
            </button>
          )}
          {canRetry && (
            <button type="button" className="secondary-action" onClick={onRetry}>
              <RefreshCcw size={15} />
              重新选择
            </button>
          )}
        </div>
      )}
    </section>
  )
}
