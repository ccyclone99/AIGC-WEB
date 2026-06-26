import { AlertTriangle, CheckCircle2, ChevronRight, Clock3, FileVideo, ShieldCheck, Zap } from 'lucide-react'

import { activeStatuses } from '../prototypeData'
import type { Task, TaskStatus } from '../types'
import { taskCreditState, taskStatusCopy } from '../viewModels'
import { PageTitle } from './PageTitle'

type TasksViewProps = {
  tasks: Task[]
  onOpenTask: (taskId: string) => void
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

export function TasksView({ tasks, onOpenTask }: TasksViewProps) {
  const activeCount = tasks.filter((task) => activeStatuses.includes(task.status)).length
  const successCount = tasks.filter((task) => task.status === 'success').length
  const refundedCount = tasks.filter((task) => task.status === 'refunded').length

  return (
    <div className="page-stack compact-page tasks-page">
      <PageTitle eyebrow="TASKS" title="任务" text="默认只看状态。追溯、参数和诊断进入详情抽屉。" />
      <section className="task-summary-grid">
        <span>
          <strong>{activeCount}</strong>
          处理中
        </span>
        <span>
          <strong>{successCount}</strong>
          已完成
        </span>
        <span>
          <strong>{refundedCount}</strong>
          已释放
        </span>
      </section>
      <section className="task-lifecycle-strip" aria-label="任务生命周期">
        {['排队', '生成', '后期', '审核', '入库'].map((stage) => (
          <span key={stage}>{stage}</span>
        ))}
      </section>
      <section className="task-list">
        {tasks.map((task) => (
          <TaskRow key={task.id} task={task} onOpen={onOpenTask} />
        ))}
      </section>
    </div>
  )
}

function TaskRow({ task, onOpen }: { task: Task; onOpen: (taskId: string) => void }) {
  const status = taskStatusCopy(task.status)
  const StatusIcon = taskStatusIcon(task.status)
  const creditState = taskCreditState(task)

  return (
    <button type="button" className={`task-row status-${task.status}`} onClick={() => onOpen(task.id)}>
      <img src={task.image} alt={task.title} />
      <span className="task-row-copy">
        <strong>{task.title}</strong>
        <small>{task.id} · {task.updated}</small>
        <span className="task-row-meta">
          <em className={`status-pill status-${task.status}`}>
            <StatusIcon size={15} />
            {status.label}
          </em>
          <i className={`task-credit-chip ${creditState.className}`}>{creditState.label}</i>
        </span>
        <span className="task-row-progress">
          <span style={{ width: `${task.progress}%` }}></span>
        </span>
      </span>
      <span className="task-row-side">
        <strong>{task.progress}%</strong>
        <small>{creditState.text}</small>
      </span>
      <ChevronRight size={18} />
    </button>
  )
}
