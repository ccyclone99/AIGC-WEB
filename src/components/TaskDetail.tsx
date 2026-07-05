import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Coins,
  Download,
  FileVideo,
  Library,
  Play,
  ShieldCheck,
  TimerReset,
  Zap,
} from 'lucide-react'

import type { Task, TaskStatus } from '../types'
import { taskCreditState, taskStatusCopy } from '../viewModels'

type TaskDetailProps = {
  task: Task
  onAdvance: (taskId: string) => void
  onDownload: () => void
  onOpenAssets: () => void
  onPreview: () => void
  onRefund: (taskId: string) => void
}

const taskStatusIcon = (status: TaskStatus) => {
  const iconMap = {
    queued: Clock3,
    running: Zap,
    rendering: FileVideo,
    review: ShieldCheck,
    success: CheckCircle2,
    refunded: AlertTriangle,
  }

  return iconMap[status]
}

const customerFailureMessage = (task: Task) => {
  if (!task.failure) return ''

  if (task.failure.reason === 'asset_invalid') {
    return '图片清晰度或画面质量不足，本次未消耗积分。请更换更清晰的商品图后重新生成。'
  }

  if (task.failure.reason === 'moderation_block') {
    return '素材需要重新确认授权或内容合规，本次积分已退回。请更换素材后再试。'
  }

  if (task.failure.reason === 'timeout') {
    return '生成等待时间过长，系统已自动退回积分。你可以稍后重新提交。'
  }

  return '生成服务暂时异常，系统已退回本次冻结积分。你可以稍后重新生成。'
}

export function TaskDetail({
  task,
  onDownload,
  onOpenAssets,
  onPreview,
}: TaskDetailProps) {
  const status = taskStatusCopy(task.status)
  const StatusIcon = taskStatusIcon(task.status)
  const isSuccess = task.status === 'success'
  const isRefunded = task.status === 'refunded'
  const creditState = taskCreditState(task)
  const settingRows = task.params
    ? [
        { label: '画面比例', value: task.params.ratio },
        { label: '视频长度', value: task.params.duration },
        { label: '清晰度', value: task.params.resolution },
        { label: '画质', value: task.params.quality },
      ]
    : [
        { label: '画面比例', value: '-' },
        { label: '视频长度', value: '-' },
        { label: '清晰度', value: '-' },
        { label: '画质', value: '-' },
      ]

  return (
    <div className="drawer-stack">
      <section className="task-preview">
        <img src={task.image} alt={task.title} />
        <div>
          <em className={`status-pill status-${task.status}`}>
            <StatusIcon size={15} />
            {status.label}
          </em>
          <h2>{task.title}</h2>
          <span>{task.cost} 积分 · {task.updated}</span>
        </div>
      </section>
      <div className="progress-track">
        <span style={{ width: `${task.progress}%` }}></span>
      </div>
      {isSuccess && (
        <section className="task-result-panel">
          <button type="button" className="task-result-media" onClick={onPreview}>
            <img src={task.image} alt={`${task.title} 输出预览`} />
            <span>
              <Play size={16} />
              预览结果
            </span>
          </button>
          <div>
            <p className="eyebrow">作品已生成</p>
            <strong>{task.title}.mp4</strong>
            <small>{task.cost} 积分已结算 · 资产库已保存 · 30 天保留</small>
            <div className="task-result-meta">
              <span>
                <FileVideo size={15} />
                MP4 输出
              </span>
              <span>
                <Library size={15} />
                资产库已保存
              </span>
              <span>
                <TimerReset size={15} />
                30 天保留
              </span>
            </div>
            <div className="result-action-row">
              <button type="button" className="secondary-action" onClick={onDownload}>
                <Download size={17} />
                下载
              </button>
              <button type="button" className="secondary-action" onClick={onOpenAssets}>
                <Library size={17} />
                去资产库
              </button>
            </div>
          </div>
        </section>
      )}
      {task.failure && (
        <section className="task-failure-panel">
          <header>
            <span>
              <AlertTriangle size={17} />
              <strong>生成未完成</strong>
            </span>
          </header>
          <p>{customerFailureMessage(task)}</p>
        </section>
      )}
      {isRefunded && (
        <section className="task-recovery-panel">
          <AlertTriangle size={19} />
          <span>
            <strong>积分已释放</strong>
            <small>本次失败不会消耗积分。你可以更换图片或调整设置后重新生成。</small>
            <div className="task-recovery-steps">
              <em>积分退回</em>
              <em>设置保留</em>
              <em>可重新提交</em>
            </div>
          </span>
        </section>
      )}
      <section className={`task-state-panel ${creditState.className}`}>
        <span>
          <Coins size={17} />
          <strong>{creditState.label}</strong>
          <small>{creditState.text}</small>
        </span>
        <span>
          <StatusIcon size={17} />
          <strong>{status.label}</strong>
          <small>{status.detail}</small>
        </span>
        <span>
          <ShieldCheck size={17} />
          <strong>记录已保存</strong>
          <small>生成设置和积分状态会保留在记录中。</small>
        </span>
      </section>
      <section className="task-param-panel">
        <header>
          <strong>生成设置</strong>
          <small>这些设置会随作品记录保存，方便下次复用。</small>
        </header>
        <div className="task-param-grid">
          {settingRows.map((row) => (
            <span key={row.label}>
              <small>{row.label}</small>
              <strong>{row.value}</strong>
            </span>
          ))}
        </div>
      </section>
      {isSuccess && (
        <div className="drawer-actions">
          <button type="button" className="secondary-action" onClick={onPreview}>
            <Play size={18} />
            预览结果
          </button>
          <button type="button" className="secondary-action" onClick={onDownload}>
            <Download size={18} />
            下载结果
          </button>
        </div>
      )}
    </div>
  )
}
