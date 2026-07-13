import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Download,
  FileVideo,
  Library,
  Play,
  ShieldCheck,
  Zap,
} from 'lucide-react'

import { activeStatuses } from '../prototypeData'
import { generatedOutputName } from '../domain'
import type { Task, TaskStatus } from '../types'
import { formatWorkDateOnly, formatWorkExactDate, taskStatusCopy } from '../viewModels'

type TaskDetailProps = {
  task: Task
  onDownload: () => void
  onOpenAssets: () => void
  onPreview: () => void
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

  return '生成服务暂时异常，本次积分已经退回。你可以稍后重新生成。'
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
  const isActive = activeStatuses.includes(task.status)
  const settingRows = task.params
    ? [
        { label: '画面比例', value: task.params.ratio },
        { label: '视频长度', value: task.params.duration },
        { label: '输出分辨率', value: task.params.resolution },
        { label: '画质', value: task.params.quality },
      ]
    : [
        { label: '画面比例', value: '-' },
        { label: '视频长度', value: '-' },
        { label: '输出分辨率', value: '-' },
        { label: '画质', value: '-' },
      ]
  const primaryDate = isSuccess
    ? `${formatWorkExactDate(task.completedAt)} 完成`
    : isRefunded
      ? `${formatWorkExactDate(task.failedAt)} 未完成`
      : `${formatWorkExactDate(task.createdAt)} 提交`
  const workInfoRows = [
    { label: '提交时间', value: formatWorkExactDate(task.createdAt) },
    ...(isSuccess ? [{ label: '完成时间', value: formatWorkExactDate(task.completedAt) }] : []),
    { label: '使用模板', value: task.templateTitle },
    { label: '原始素材', value: task.sourceAssetName ?? '素材名称待确认' },
    { label: '作品编号', value: task.id },
    ...(isSuccess
      ? [
          { label: '文件信息', value: `${task.output?.format ?? 'MP4'} · ${task.output?.size ?? '大小待确认'}` },
          {
            label: '保存期限',
            value: task.output?.expiresAt
              ? `${formatWorkDateOnly(task.output.expiresAt)} 到期`
              : task.output?.retentionLabel ?? '永久保存',
          },
        ]
      : []),
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
          <span>{primaryDate}</span>
        </div>
      </section>
      {isActive && (
        <div className="progress-track">
          <span style={{ width: `${task.progress}%` }}></span>
        </div>
      )}
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
            <strong>{generatedOutputName(task)}</strong>
            <div className="task-result-meta">
              <span>{task.params?.duration ?? '时长待确认'}</span>
              <span>{task.params?.ratio ?? '比例待确认'}</span>
              <span>{task.params?.resolution ?? '分辨率待确认'}</span>
            </div>
            <small>已使用 {task.cost} 积分 · {task.output?.retentionLabel ?? '保存期限待确认'}</small>
            <div className="result-action-row">
              <button type="button" className="secondary-action" onClick={onDownload}>
                <Download size={17} />
                下载
              </button>
              <button type="button" className="secondary-action" onClick={onOpenAssets}>
                <Library size={17} />
                查看素材
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
            <strong>{task.cost} 积分已退回</strong>
            <small>你可以更换图片或调整设置后重新生成。</small>
          </span>
        </section>
      )}
      <section className="task-param-panel task-work-info-panel">
        <header>
          <strong>{isSuccess ? '作品信息' : '生成记录'}</strong>
        </header>
        <div className="task-param-grid task-work-info-grid">
          {workInfoRows.map((row) => (
            <span key={row.label}>
              <small>{row.label}</small>
              <strong title={row.value}>{row.value}</strong>
            </span>
          ))}
        </div>
      </section>
      <section className="task-param-panel">
        <header>
          <strong>生成设置</strong>
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
    </div>
  )
}
