import { useState } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Download,
  FileVideo,
  Images,
  Play,
  RefreshCcw,
  Sparkles,
} from 'lucide-react'

import { activeStatuses } from '../prototypeData'
import type { Asset, AssetFilter, PreviewMedia, Task, TaskStatus, UploadReceipt, WorksSection } from '../types'
import { filterTasksForWorks, taskStatusCopy, worksTaskCounts, type WorkTaskFilter } from '../viewModels'
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
  const counts = worksTaskCounts(tasks)
  const visibleTasks = filterTasksForWorks(tasks, taskFilter)
  const uploadAssets = assets.filter((asset) => asset.type !== '生成视频')
  const filters: Array<{ id: WorkTaskFilter; label: string; count: number }> = [
    { id: 'recent', label: '近期', count: counts.recent },
    { id: 'active', label: '生成中', count: counts.active },
    { id: 'refunded', label: '需处理', count: counts.refunded },
  ]

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
                      <strong>{task.title}</strong>
                      <small>{task.updated}</small>
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
                    <div className="work-card-actions">
                      {active && (
                        <button type="button" className="work-main-action" onClick={() => onOpenTask(task.id)}>
                          查看进度 <ChevronRight size={15} />
                        </button>
                      )}
                      {success && (
                        <>
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
                    </div>
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
