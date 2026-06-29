import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Coins,
  FileVideo,
  Gauge,
  ImagePlus,
  Images,
  ShieldCheck,
  Sparkles,
  WandSparkles,
  Zap,
} from 'lucide-react'
import type { CSSProperties } from 'react'

import { activeStatuses, initialTasks, templates } from '../prototypeData'
import type { Asset, Task, TaskStatus, ViewId } from '../types'
import { taskStatusCopy } from '../viewModels'

type WorkbenchViewProps = {
  assets: Asset[]
  creditBalance: number
  frozenCredits: number
  tasks: Task[]
  onCredits: () => void
  onNavigate: (view: ViewId) => void
  onOpenTask: (taskId: string) => void
  onOpenTemplate: (templateId: string) => void
  onPreview: (title: string, image: string) => void
  onStartMaking: (templateId: string) => void
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

export function WorkbenchView({
  assets,
  creditBalance,
  frozenCredits,
  tasks,
  onCredits,
  onNavigate,
  onOpenTask,
  onOpenTemplate,
  onPreview,
  onStartMaking,
}: WorkbenchViewProps) {
  const runningCount = tasks.filter((task) => activeStatuses.includes(task.status)).length
  const successCount = tasks.filter((task) => task.status === 'success').length
  const refundedCount = tasks.filter((task) => task.status === 'refunded').length
  const recentTask = tasks[0] ?? initialTasks[0]
  const visibleTasks = tasks.filter((task) => activeStatuses.includes(task.status)).slice(0, 3)
  const taskList = visibleTasks.length > 0 ? visibleTasks : tasks.slice(0, 3)
  const reusableAssetCount = assets.filter((asset) => asset.kind !== 'video' && asset.status === 'library').length
  const recentAssets = assets.slice(0, 3)
  const quickTemplates = [templates[1], templates[0], templates[2]]

  return (
    <div className="page-stack workbench-page production-page">
      <section className="production-desk production-command-center">
        <header className="production-desk-head">
          <div>
            <p className="eyebrow">我的生产台</p>
            <h1>生产台</h1>
            <span>开始新视频、查看生成进度、复用最近资产。</span>
          </div>
          <div className="production-head-actions">
            <button type="button" className="primary-action" onClick={() => onStartMaking('sneaker')}>
              <WandSparkles size={18} />
              新建视频
            </button>
            <button type="button" className="secondary-action" onClick={() => onNavigate('templates')}>
              <Sparkles size={18} />
              模板库
            </button>
          </div>
        </header>

        <div className="production-metric-row" aria-label="生产概览">
          <span>
            <strong>{runningCount}</strong>
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
          <span>
            <strong>{reusableAssetCount}</strong>
            可复用素材
          </span>
        </div>
      </section>

      <section className="production-board">
        <section className="production-primary-panel">
          <div className="production-primary-copy">
            <p className="eyebrow">推荐流程</p>
            <h2>商品图生成电商短视频</h2>
            <p>选模板，上传一张图，确认画面参数，系统自动生成视频。</p>
          </div>
          <button type="button" className="production-upload-path" onClick={() => onStartMaking('sneaker')}>
            <span>
              <ImagePlus size={24} />
            </span>
            <strong>上传商品图开始</strong>
            <small>进入创作台后可从资产库选择图片，也可以直接上传。</small>
            <em>
              进入创作台
              <ArrowUpRight size={16} />
            </em>
          </button>

          <div className="production-template-lane" aria-label="常用模板">
            {quickTemplates.map((template) => (
              <button type="button" key={template.id} onClick={() => onOpenTemplate(template.id)} style={{ '--template-accent': template.accent } as CSSProperties}>
                <img src={template.image} alt={template.title} />
                <span>
                  <strong>{template.title}</strong>
                  <small>{template.cost} 积分 · {template.duration} · {template.ratio}</small>
                </span>
                <ChevronRight size={16} />
              </button>
            ))}
          </div>
        </section>

        <aside className="production-side-column">
          <section className="production-queue-panel">
            <header>
              <span>
                <Gauge size={18} />
                <strong>生成中</strong>
              </span>
              <button type="button" onClick={() => onNavigate('tasks')}>
                全部
                <ArrowUpRight size={15} />
              </button>
            </header>
            <button type="button" className="production-current-task" onClick={() => onOpenTask(recentTask.id)}>
              <img src={recentTask.image} alt={recentTask.title} />
              <span>
                <small>当前关注</small>
                <strong>{recentTask.title}</strong>
                <em>{taskStatusCopy(recentTask.status).label} · {recentTask.progress}%</em>
              </span>
              <span className="progress-track">
                <span style={{ width: `${recentTask.progress}%` }}></span>
              </span>
            </button>
            <div className="production-task-stack">
              {taskList.map((task) => (
                <WorkbenchTask key={task.id} task={task} onOpen={onOpenTask} />
              ))}
            </div>
          </section>

          <section className="production-resource-panel">
            <header>
              <span>
                <Images size={18} />
                <strong>资源</strong>
              </span>
              <button type="button" onClick={() => onNavigate('me')}>
                管理
                <ArrowUpRight size={15} />
              </button>
            </header>
            <div className="production-asset-strip">
              {recentAssets.map((asset) => (
                <button type="button" key={asset.id} onClick={() => onPreview(asset.name, asset.image)}>
                  <img src={asset.image} alt={asset.name} />
                  <span>{asset.type}</span>
                </button>
              ))}
            </div>
            <button type="button" className="production-credit-box" onClick={onCredits}>
              <Coins size={18} />
              <span>
                <strong>{creditBalance.toLocaleString()}</strong>
                可用积分
              </span>
              <em>{frozenCredits} 冻结</em>
            </button>
          </section>
        </aside>
      </section>
    </div>
  )
}

function WorkbenchTask({ task, onOpen }: { task: Task; onOpen: (taskId: string) => void }) {
  const status = taskStatusCopy(task.status)
  const StatusIcon = taskStatusIcon(task.status)

  return (
    <button type="button" className="workbench-task" onClick={() => onOpen(task.id)}>
      <img src={task.image} alt={task.title} />
      <span>
        <strong>{task.title}</strong>
        <small>最近更新 · {task.updated}</small>
      </span>
      <em className={`status-pill status-${task.status}`}>
        <StatusIcon size={15} />
        {status.label}
      </em>
      <span className="progress-track">
        <span style={{ width: `${task.progress}%` }}></span>
      </span>
    </button>
  )
}
