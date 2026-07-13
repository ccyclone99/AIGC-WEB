import { useState, type FormEvent } from 'react'
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Download,
  FileVideo,
  Images,
  MoreHorizontal,
  Pencil,
  Play,
  RefreshCcw,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react'

import { activeStatuses } from '../prototypeData'
import type { Asset, AssetFilter, PreviewMedia, Task, TaskStatus, UploadReceipt, WorksSection } from '../types'
import {
  filterTasksForWorks,
  formatWorkCardDate,
  taskStatusCopy,
  worksTaskCounts,
  type WorkTaskFilter,
} from '../viewModels'
import { AssetManager } from './AssetManager'

type WorksViewProps = {
  section: WorksSection
  tasks: Task[]
  assets: Asset[]
  assetFilters: AssetFilter[]
  customAssetFilters: AssetFilter[]
  uploadReceipt: UploadReceipt
  onSectionChange: (section: WorksSection) => void
  onOpenTask: (taskId: string) => void
  onDownloadTask: (taskId: string) => void
  onDeleteTask: (taskId: string) => void
  onRenameTask: (taskId: string, title: string) => void
  onReuseTask: (taskId: string) => void
  onArchiveAsset: (assetId: string) => void
  onCancelUpload: () => void
  onCreateAssetCategory: (name: string) => boolean
  onDeleteAssetCategory: (name: string) => void
  onDownloadAsset: (assetId: string) => void
  onPreview: (title: string, image: string, media?: Partial<Pick<PreviewMedia, 'kind' | 'videoSrc'>>) => void
  onRenameAsset: (assetId: string) => void
  onRestoreAsset: (assetId: string) => void
  onRetryUpload: () => void
  onReuseAsset: (assetId: string) => void
  onUpdateAssetCategory: (assetId: string, category: string) => void
  onUploadAsset: (file: File) => void
}

const statusIcon: Record<TaskStatus, typeof Clock3> = {
  queued: Clock3,
  running: Sparkles,
  rendering: FileVideo,
  review: Clock3,
  success: CheckCircle2,
  refunded: AlertTriangle,
}

export function WorksView({
  section,
  tasks,
  assets,
  assetFilters,
  customAssetFilters,
  uploadReceipt,
  onSectionChange,
  onOpenTask,
  onDownloadTask,
  onDeleteTask,
  onRenameTask,
  onReuseTask,
  onArchiveAsset,
  onCancelUpload,
  onCreateAssetCategory,
  onDeleteAssetCategory,
  onDownloadAsset,
  onPreview,
  onRenameAsset,
  onRestoreAsset,
  onRetryUpload,
  onReuseAsset,
  onUpdateAssetCategory,
  onUploadAsset,
}: WorksViewProps) {
  const [taskFilter, setTaskFilter] = useState<WorkTaskFilter>(() =>
    window.location.hash.includes('status=active') ? 'active' : 'recent',
  )
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [renameDraft, setRenameDraft] = useState('')
  const [deleteConfirmTaskId, setDeleteConfirmTaskId] = useState<string | null>(null)
  const counts = worksTaskCounts(tasks)
  const visibleTasks = filterTasksForWorks(tasks, taskFilter)
  const uploadAssets = assets.filter((asset) => asset.type !== '生成视频')
  const filters: Array<{ id: WorkTaskFilter; label: string; count: number }> = [
    { id: 'recent', label: '近期', count: counts.recent },
    { id: 'success', label: '已完成', count: counts.success },
    { id: 'active', label: '生成中', count: counts.active },
    { id: 'refunded', label: '需处理', count: counts.refunded },
  ]

  const startRenaming = (task: Task) => {
    setEditingTaskId(task.id)
    setRenameDraft(task.title)
    setDeleteConfirmTaskId(null)
  }

  const submitRename = (event: FormEvent, taskId: string) => {
    event.preventDefault()
    if (!renameDraft.trim()) return
    onRenameTask(taskId, renameDraft)
    setEditingTaskId(null)
  }

  return (
    <div className="works-page">
      <header className="works-head">
        <div>
          <h1>作品库</h1>
          <p>查看生成结果，或复用已经上传的素材。</p>
        </div>
        <div className="works-sections" role="tablist" aria-label="作品库分类">
          <button
            type="button"
            id="works-generations-tab"
            role="tab"
            aria-selected={section === 'generations'}
            className={section === 'generations' ? 'is-selected' : ''}
            onClick={() => onSectionChange('generations')}
          >
            <FileVideo size={17} />
            生成作品
          </button>
          <button
            type="button"
            id="works-assets-tab"
            role="tab"
            aria-selected={section === 'assets'}
            className={section === 'assets' ? 'is-selected' : ''}
            onClick={() => onSectionChange('assets')}
          >
            <Images size={17} />
            上传素材
          </button>
        </div>
      </header>

      {section === 'generations' ? (
        <section className="works-panel" role="tabpanel" aria-labelledby="works-generations-tab">
          <div className="works-filter-row" aria-label="作品状态">
            {filters.map((filter) => (
              <button
                type="button"
                key={filter.id}
                className={taskFilter === filter.id ? 'is-selected' : ''}
                onClick={() => setTaskFilter(filter.id)}
              >
                {filter.label}
                <span>{filter.count}</span>
              </button>
            ))}
          </div>

          {visibleTasks.length > 0 ? (
            <div className="works-grid">
              {visibleTasks.map((task) => {
                const active = activeStatuses.includes(task.status)
                const success = task.status === 'success'
                const StatusIcon = statusIcon[task.status]
                const status = taskStatusCopy(task.status)

                return (
                  <article className={`work-card work-status-${task.status}`} key={task.id}>
                    {success && (
                      <details className="work-card-menu">
                        <summary aria-label={`管理作品：${task.title}`}>
                          <MoreHorizontal size={17} />
                        </summary>
                        <div>
                          <button
                            type="button"
                            onClick={(event) => {
                              startRenaming(task)
                              event.currentTarget.closest('details')?.removeAttribute('open')
                            }}
                          >
                            <Pencil size={15} /> 重命名
                          </button>
                          <button
                            type="button"
                            className="is-danger"
                            onClick={(event) => {
                              setDeleteConfirmTaskId(task.id)
                              setEditingTaskId(null)
                              event.currentTarget.closest('details')?.removeAttribute('open')
                            }}
                          >
                            <Trash2 size={15} /> 删除作品
                          </button>
                        </div>
                      </details>
                    )}
                    <button
                      type="button"
                      className="work-card-media"
                      onClick={() => success
                        ? onPreview(task.title, task.image, { kind: 'video', videoSrc: task.videoSrc })
                        : onOpenTask(task.id)}
                    >
                      <img src={task.image} alt="" />
                      {success && <span><Play size={15} fill="currentColor" /> 预览</span>}
                    </button>
                    <div className="work-card-copy">
                      <span className={`work-status-pill is-${task.status}`}>
                        <StatusIcon size={14} />
                        {status.label}
                      </span>
                      {editingTaskId === task.id ? (
                        <form className="work-title-editor" onSubmit={(event) => submitRename(event, task.id)}>
                          <input
                            type="text"
                            value={renameDraft}
                            maxLength={40}
                            aria-label="作品名称"
                            onChange={(event) => setRenameDraft(event.currentTarget.value)}
                            autoFocus
                          />
                          <button type="submit" aria-label="保存作品名称" disabled={!renameDraft.trim()}>
                            <Check size={15} />
                          </button>
                          <button type="button" aria-label="取消重命名" onClick={() => setEditingTaskId(null)}>
                            <X size={15} />
                          </button>
                        </form>
                      ) : (
                        <strong>{task.title}</strong>
                      )}
                      {success ? (
                        <>
                          <small className="work-completed-date">{formatWorkCardDate(task.completedAt)} 完成</small>
                          <span className="work-output-spec">
                            <em>{task.params?.duration ?? '时长待确认'}</em>
                            <em>{task.params?.ratio ?? '比例待确认'}</em>
                            <em>{task.params?.resolution ?? '分辨率待确认'}</em>
                          </span>
                        </>
                      ) : (
                        <small>{task.updated}</small>
                      )}
                      {active && (
                        <div className="work-progress" aria-label={`${task.progress}%`}>
                          <span style={{ width: `${task.progress}%` }} />
                          <em>{task.progress}%</em>
                        </div>
                      )}
                      {task.status === 'refunded' && (
                        <p>{task.failure?.message ?? '本次没有生成成功，积分已退回。'}</p>
                      )}
                    </div>
                    {deleteConfirmTaskId === task.id ? (
                      <div className="work-delete-confirm">
                        <span>
                          <strong>确定删除这件作品？</strong>
                          <small>删除后无法恢复，积分记录仍会保留。</small>
                        </span>
                        <div>
                          <button type="button" onClick={() => setDeleteConfirmTaskId(null)}>取消</button>
                          <button
                            type="button"
                            className="is-danger"
                            onClick={() => {
                              onDeleteTask(task.id)
                              setDeleteConfirmTaskId(null)
                            }}
                          >
                            删除
                          </button>
                        </div>
                      </div>
                    ) : <div className="work-card-actions">
                      {active && (
                        <button type="button" className="work-main-action" onClick={() => onOpenTask(task.id)}>
                          查看进度 <ChevronRight size={15} />
                        </button>
                      )}
                      {success && (
                        <>
                          <button type="button" onClick={() => onOpenTask(task.id)}>
                            详情
                          </button>
                          <button type="button" onClick={() => onDownloadTask(task.id)}>
                            <Download size={15} /> 下载
                          </button>
                          <button type="button" className="work-main-action" onClick={() => onReuseTask(task.id)}>
                            <RefreshCcw size={15} /> 再次制作
                          </button>
                        </>
                      )}
                      {task.status === 'refunded' && (
                        <>
                          <button type="button" onClick={() => onOpenTask(task.id)}>查看原因</button>
                          {task.failure?.retryable && (
                            <button type="button" className="work-main-action" onClick={() => onReuseTask(task.id)}>
                              <RefreshCcw size={15} /> 再次制作
                            </button>
                          )}
                        </>
                      )}
                    </div>}
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="works-empty">
              <FileVideo size={24} />
              <strong>这里还没有内容</strong>
              <span>换一个状态筛选看看。</span>
            </div>
          )}
        </section>
      ) : (
        <div className="works-panel works-assets-panel">
          <AssetManager
            assets={uploadAssets}
            assetFilters={assetFilters}
            customAssetFilters={customAssetFilters}
            labelledBy="works-assets-tab"
            panelId="works-assets-panel"
            uploadReceipt={uploadReceipt}
            onArchiveAsset={onArchiveAsset}
            onCancelUpload={onCancelUpload}
            onCreateAssetCategory={onCreateAssetCategory}
            onDeleteAssetCategory={onDeleteAssetCategory}
            onDownloadAsset={onDownloadAsset}
            onPreview={onPreview}
            onRenameAsset={onRenameAsset}
            onRestoreAsset={onRestoreAsset}
            onRetryUpload={onRetryUpload}
            onReuseAsset={onReuseAsset}
            onUpdateAssetCategory={onUpdateAssetCategory}
            onUploadAsset={onUploadAsset}
          />
        </div>
      )}
    </div>
  )
}
