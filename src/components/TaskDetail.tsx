import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  ClipboardCheck,
  Coins,
  Download,
  FileVideo,
  Library,
  LockKeyhole,
  Play,
  RefreshCcw,
  ShieldCheck,
  TimerReset,
  Zap,
} from 'lucide-react'

import { activeStatuses, showTaskDevControls } from '../prototypeData'
import type { Task, TaskStatus } from '../types'
import { failureReasonLabel, failureStageLabel, taskCreditState, taskStatusCopy } from '../viewModels'

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

export function TaskDetail({
  task,
  onAdvance,
  onDownload,
  onOpenAssets,
  onPreview,
  onRefund,
}: TaskDetailProps) {
  const status = taskStatusCopy(task.status)
  const StatusIcon = taskStatusIcon(task.status)
  const canOperate = activeStatuses.includes(task.status)
  const isSuccess = task.status === 'success'
  const isRefunded = task.status === 'refunded'
  const creditState = taskCreditState(task)
  const paramRows = task.params
    ? [
        { label: '模板 ID', value: task.params.templateId },
        { label: '模板版本', value: task.params.templateVersion },
        { label: '价格版本', value: task.params.pricingVersion },
        { label: '工作流', value: task.params.workflowType },
        { label: '输入资产', value: task.params.imageId },
        { label: '幂等键', value: task.params.idempotencyKey },
        { label: '画面比例', value: task.params.ratio },
        { label: '视频长度', value: task.params.duration },
        { label: '图片分辨率', value: task.params.resolution },
        { label: '清晰度', value: task.params.quality },
      ]
    : [
        { label: '模板 ID', value: 'templateId' },
        { label: '模板版本', value: 'templateVersion' },
        { label: '价格版本', value: 'pricingVersion' },
        { label: '工作流', value: 'workflowType' },
        { label: '输入资产', value: 'productImage' },
        { label: '幂等键', value: 'idempotencyKey' },
        { label: '画面比例', value: 'ratio' },
        { label: '视频长度', value: 'duration' },
        { label: '图片分辨率', value: 'resolution' },
        { label: '清晰度', value: 'quality' },
      ]
  const auditRows = [
    {
      icon: ClipboardCheck,
      label: '提交记录',
      value: `${task.id} · ${task.updated}`,
      detail: '提交参数已锁定，支持客服和运营排查。',
    },
    {
      icon: LockKeyhole,
      label: '模板版本',
      value: task.params ? `${task.params.templateVersion} · ${task.params.pricingVersion}` : 'templateVersion · pricingVersion',
      detail: '模板、价格和输出参数随任务保存。',
    },
    {
      icon: Coins,
      label: '积分流水',
      value: creditState.label,
      detail: creditState.text,
    },
    {
      icon: Zap,
      label: '供应商尝试',
      value: isRefunded ? '失败或阻断' : isSuccess ? '主供应商成功' : '主供应商处理中',
      detail: '请求参数、响应摘要和错误码会进入任务记录。',
    },
    {
      icon: FileVideo,
      label: '渲染记录',
      value: isSuccess ? '输出已生成' : isRefunded ? '无可用输出' : '等待生成完成',
      detail: '后期合成、封面和资源入库形成独立记录。',
    },
    {
      icon: ShieldCheck,
      label: '审核与兜底',
      value: isRefunded ? '已释放积分' : '规则校验通过',
      detail: '失败、超时或审核阻断会自动释放冻结积分。',
    },
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
          <span>{task.id} · {task.cost} 积分</span>
        </div>
      </section>
      <div className="progress-track">
        <span style={{ width: `${task.progress}%` }}></span>
      </div>
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
          <ClipboardCheck size={17} />
          <strong>可追溯</strong>
          <small>提交参数、模板版本和积分流水已锁定。</small>
        </span>
      </section>
      <section className="task-audit-panel">
        <header>
          <span>
            <strong>追溯记录</strong>
            <small>提交、积分、供应商、渲染和审核记录保持同一任务链路。</small>
          </span>
          <em>{task.id}</em>
        </header>
        <div className="task-audit-grid">
          {auditRows.map(({ icon: Icon, label, value, detail }) => (
            <article key={label}>
              <Icon size={17} />
              <span>
                <small>{label}</small>
                <strong>{value}</strong>
                <em>{detail}</em>
              </span>
            </article>
          ))}
        </div>
      </section>
      <section className="task-param-panel">
        <header>
          <strong>提交参数</strong>
          <small>这些字段会作为后端任务参数快照保存。</small>
        </header>
        <div className="task-param-grid">
          {paramRows.map((row) => (
            <span key={row.label}>
              <small>{row.label}</small>
              <strong>{row.value}</strong>
            </span>
          ))}
        </div>
      </section>
      {task.failure && (
        <section className="task-failure-panel">
          <header>
            <span>
              <AlertTriangle size={17} />
              <strong>失败原因</strong>
            </span>
            <em>{task.failure.code}</em>
          </header>
          <div className="task-failure-grid">
            <span>
              <small>阶段</small>
              <strong>{failureStageLabel(task.failure.stage)}</strong>
            </span>
            <span>
              <small>原因</small>
              <strong>{failureReasonLabel(task.failure.reason)}</strong>
            </span>
            <span>
              <small>可重试</small>
              <strong>{task.failure.retryable ? '可以' : '不建议'}</strong>
            </span>
          </div>
          <p>{task.failure.message}</p>
        </section>
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
            <p className="eyebrow">OUTPUT READY</p>
            <strong>{task.id.toLowerCase()}-output.mp4</strong>
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
      {isRefunded && (
        <section className="task-recovery-panel">
          <AlertTriangle size={19} />
          <span>
            <strong>积分已释放</strong>
            <small>本次失败不会消耗积分。历史输入、模板版本和参数仍保留，后续可以用于客服排查或重新生成。</small>
            <div className="task-recovery-steps">
              <em>积分退回</em>
              <em>参数保留</em>
              <em>可重新提交</em>
            </div>
          </span>
        </section>
      )}
      <div className="drawer-actions">
        {showTaskDevControls && canOperate && (
          <button type="button" className="primary-action" onClick={() => onAdvance(task.id)}>
            <RefreshCcw size={18} />
            推进状态
          </button>
        )}
        {showTaskDevControls && canOperate && (
          <button type="button" className="secondary-action" onClick={() => onRefund(task.id)}>
            <AlertTriangle size={18} />
            失败释放积分
          </button>
        )}
        <button type="button" className="secondary-action" disabled={task.status !== 'success'} onClick={onPreview}>
          <Play size={18} />
          预览结果
        </button>
        <button type="button" className="secondary-action" disabled={task.status !== 'success'} onClick={onDownload}>
          <Download size={18} />
          下载结果
        </button>
      </div>
    </div>
  )
}
