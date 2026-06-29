import { AlertTriangle, CheckCircle2, ChevronRight, Clock3, FileVideo, ShieldCheck, Zap } from 'lucide-react'

import { activeStatuses } from '../prototypeData'
import type { Task, TaskStatus } from '../types'
import { taskCreditState, taskStatusCopy } from '../viewModels'

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
  const focusedTask = tasks.find((task) => activeStatuses.includes(task.status)) ?? tasks[0]
  const focusedStatus = taskStatusCopy(focusedTask.status)
  const FocusedStatusIcon = taskStatusIcon(focusedTask.status)
  const focusedCreditState = taskCreditState(focusedTask)

  return (
    <div className="page-stack task-console-page">
      <section className="task-console-head">
        <div>
          <p className="eyebrow">TASK MONITOR</p>
          <h1>任务追踪</h1>
          <p>生成任务会在后台运行。这里查看进度、积分状态、失败释放和参数追溯。</p>
        </div>
        <div className="task-console-stats" aria-label="任务概览">
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
        </div>
      </section>

      <section className="task-monitor-grid">
        <button type="button" className={`task-focus-panel status-${focusedTask.status}`} onClick={() => onOpenTask(focusedTask.id)}>
          <img src={focusedTask.image} alt={focusedTask.title} />
          <span>
            <small>当前关注</small>
            <strong>{focusedTask.title}</strong>
            <em className={`status-pill status-${focusedTask.status}`}>
              <FocusedStatusIcon size={15} />
              {focusedStatus.label}
            </em>
          </span>
          <span>
            <strong>{focusedTask.progress}%</strong>
            <small>{focusedCreditState.text}</small>
          </span>
          <ChevronRight size={18} />
        </button>

        <section className="task-stage-panel" aria-label="任务生命周期">
          <span>排队</span>
          <span>生成</span>
          <span>后期</span>
          <span>审核</span>
          <span>入库</span>
        </section>
      </section>

      <section className="task-list-shell">
        <header>
          <span>
            <strong>全部记录</strong>
            <small>每条记录可打开详情查看提交参数、供应商尝试和积分流水。</small>
          </span>
        </header>
        <section className="task-list">
          {tasks.map((task) => (
            <TaskRow key={task.id} task={task} onOpen={onOpenTask} />
          ))}
        </section>
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
