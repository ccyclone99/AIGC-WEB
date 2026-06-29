import { useState, type CSSProperties } from 'react'
import {
  ArrowUpRight,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Coins,
  FileVideo,
  ImagePlus,
  Images,
  PackageCheck,
  Play,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Upload,
  Wallet,
  WandSparkles,
  X,
} from 'lucide-react'

import { generationIdempotencyKey, sameOutputSettings, templateInputLabel } from '../domain'
import { activeStatuses, outputOptionGroups } from '../prototypeData'
import type { Asset, OutputSettingKey, OutputSettings, Task, Template } from '../types'

type StudioPageProps = {
  assets: Asset[]
  creditBalance: number
  outputSettings: OutputSettings
  selectedAssetId: string
  tasks: Task[]
  template: Template
  onAssetSelect: (assetId: string) => void
  onOpenAssetPicker: () => void
  onOpenTask: (taskId: string) => void
  onOutputSettingChange: (key: OutputSettingKey, value: string) => void
  onPreview: (title: string, image: string) => void
  onSubmit: () => void
}

export function StudioPage({
  assets,
  creditBalance,
  outputSettings,
  selectedAssetId,
  tasks,
  template,
  onAssetSelect,
  onOpenAssetPicker,
  onOpenTask,
  onOutputSettingChange,
  onPreview,
  onSubmit,
}: StudioPageProps) {
  const selectedAsset = selectedAssetId ? assets.find((asset) => asset.id === selectedAssetId) : undefined
  const totalCost = template.cost
  const hasSelectedAsset = Boolean(selectedAsset?.image)
  const hasEnoughCredits = creditBalance >= totalCost
  const currentIdempotencyKey = selectedAsset ? generationIdempotencyKey(template, selectedAsset, outputSettings) : ''
  const duplicateTask = selectedAsset
    ? tasks.find(
        (task) =>
          activeStatuses.includes(task.status) &&
          (task.params?.idempotencyKey === currentIdempotencyKey ||
            (task.params?.templateId === template.id &&
              task.params.templateVersion === template.config.version &&
              task.params.imageId === selectedAsset.id &&
              sameOutputSettings(task.params, outputSettings))),
      )
    : undefined
  const canGenerate = hasSelectedAsset && !duplicateTask
  const settingSummary = `${outputSettings.ratio} · ${outputSettings.duration} · ${outputSettings.resolution} · ${outputSettings.quality}`
  const [settingsOpen, setSettingsOpen] = useState(false)
  const backgroundTasks = tasks.filter((task) => activeStatuses.includes(task.status)).slice(0, 3)
  const latestBackgroundTask = backgroundTasks[0]
  const submitHint = !hasSelectedAsset
    ? '选择商品图后即可提交生成。'
    : duplicateTask
      ? '当前图片和参数正在后台生成。换图，或调整高级设置生成变体。'
    : hasEnoughCredits
      ? `${settingSummary} · 提交后任务进入后台。`
      : `可用 ${creditBalance} 积分，还差 ${totalCost - creditBalance} 积分。`
  const submitLabel = !hasSelectedAsset
    ? '选择图片后生成'
    : duplicateTask
      ? '后台生成中'
      : hasEnoughCredits
        ? '生成视频'
        : '积分不足，去充值'
  const SubmitIcon = duplicateTask ? Clock3 : hasEnoughCredits ? WandSparkles : Wallet

  return (
    <div className="studio-page-v3 make-simple-page make-console-page">
      <section className="make-simple-card make-console-card" style={{ '--template-accent': template.accent } as CSSProperties}>
        <header className="make-simple-head make-console-head studio-editor-head">
          <div className="make-console-title">
            <p className="eyebrow">CURRENT SESSION</p>
            <h1>商品视频制作</h1>
            <span>任务会进入后台，创作台保持可用。</span>
          </div>
          <div className="make-template-chip">
            <PackageCheck size={17} />
            <span>
              <small>当前模板</small>
              <strong>{template.title}</strong>
            </span>
            <em>{outputSettings.ratio} · {outputSettings.duration}</em>
          </div>
        </header>

        <div className="make-simple-grid image-only-grid make-console-layout">
          <section className="make-preview-panel image-only-panel studio-stage-panel">
            <div className="studio-stage-topline">
              <span>
                <Sparkles size={16} />
                模板影棚
              </span>
              <em>{template.config.workflowLabel}</em>
            </div>
            {selectedAsset ? (
              <button type="button" className="image-upload-card studio-stage-card" onClick={() => onPreview(selectedAsset.name, selectedAsset.image)}>
                <img src={selectedAsset.image} alt={`${selectedAsset.name} 当前商品`} />
                <span className="studio-stage-badge">
                  <FileVideo size={15} />
                  输出 {outputSettings.duration} 视频
                </span>
                <span className="studio-stage-ratio">{outputSettings.ratio}</span>
                <span className="image-upload-status">
                  <CheckCircle2 size={18} />
                  图片已就绪
                </span>
              </button>
            ) : (
              <button type="button" className="image-upload-card image-upload-empty studio-stage-card" onClick={onOpenAssetPicker}>
                <ImagePlus size={34} />
                <strong>选择商品图</strong>
                <span>从资产库选择，或上传新图片</span>
              </button>
            )}
            <div className="studio-stage-footer">
              <span>
                <ClipboardCheck size={15} />
                输入、参数、积分会写入同一任务链路
              </span>
              <em>{hasSelectedAsset ? selectedAsset?.source : '等待素材'}</em>
            </div>
          </section>

          <section className="make-form-panel image-only-copy make-control-panel studio-control-tower">
            <div className="make-control-section make-asset-panel">
              <div className="make-panel-heading">
                <span>
                  <p className="eyebrow">输入素材</p>
                  <h2>{selectedAsset?.name ?? '等待选择商品图'}</h2>
                </span>
                <em className={selectedAsset ? 'is-ready' : 'is-waiting'}>
                  {selectedAsset ? '已就绪' : '未选择'}
                </em>
              </div>
              <p>图片可来自资产库，也可以直接上传；提交后参数会写入任务记录。</p>
              <div className="studio-asset-state make-asset-state">
                <span>
                  <Images size={15} />
                  {selectedAsset ? selectedAsset.type : templateInputLabel(template)}
                </span>
                <span>
                  <ShieldCheck size={15} />
                  {selectedAsset ? selectedAsset.expires : '上传后保存'}
                </span>
                <span>
                  <ClipboardCheck size={15} />
                  参数可追溯
                </span>
              </div>
              <div className="make-upload-actions make-console-actions">
                <button type="button" className="secondary-action upload-inline-button make-replace-action" onClick={onOpenAssetPicker}>
                  <Upload size={18} />
                  {selectedAsset ? '替换图片' : '选择图片'}
                </button>
                {selectedAsset && (
                  <>
                    <button
                      type="button"
                      className="secondary-action make-icon-action"
                      title="预览图片"
                      aria-label="预览图片"
                      onClick={() => onPreview(selectedAsset.name, selectedAsset.image)}
                    >
                      <Play size={18} />
                      预览图片
                    </button>
                    <button
                      type="button"
                      className="secondary-action make-icon-action"
                      title="移除图片"
                      aria-label="移除图片"
                      onClick={() => onAssetSelect('')}
                    >
                      <X size={18} />
                      移除图片
                    </button>
                  </>
                )}
              </div>
            </div>

            <section className="make-settings-shell">
              <button
                type="button"
                className="make-settings-button"
                aria-expanded={settingsOpen}
                onClick={() => setSettingsOpen((current) => !current)}
              >
                <span>
                  <SlidersHorizontal size={17} />
                  高级设置
                </span>
                <em>{settingSummary}</em>
              </button>

              {settingsOpen && (
                <div className="make-settings-popover">
                  <header>
                    <span>
                      <strong>高级设置</strong>
                      <small>默认参数已按模板推荐，可以不改。</small>
                    </span>
                    <button type="button" className="close-button" onClick={() => setSettingsOpen(false)} aria-label="关闭高级设置">
                      <X size={17} />
                    </button>
                  </header>

                  <div className="output-setting-grid">
                    {outputOptionGroups.map((group) => (
                      <section className="output-setting-card" key={group.key}>
                        <div>
                          <strong>{group.label}</strong>
                          <small>{group.hint}</small>
                        </div>
                        <div className="output-setting-options">
                          {group.options.map((option) => (
                            <button
                              type="button"
                              key={option}
                              className={outputSettings[group.key] === option ? 'is-selected' : ''}
                              onClick={() => onOutputSettingChange(group.key, option)}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                  <p className="setting-note">生成时会写入任务追溯记录，方便复用和排查。</p>
                  <div className="make-settings-footer">
                    <button type="button" className="primary-action" onClick={() => setSettingsOpen(false)}>
                      <CheckCircle2 size={17} />
                      完成设置
                    </button>
                  </div>
                </div>
              )}
            </section>

            <section className="make-submit-panel">
              <div>
                <span>
                  <Coins size={17} />
                  预计冻结
                </span>
                <strong>{totalCost} 积分</strong>
              </div>
              <p>{submitHint}</p>
              <button
                type="button"
                className={duplicateTask ? 'primary-action is-processing' : 'primary-action'}
                disabled={!canGenerate}
                onClick={onSubmit}
              >
                <SubmitIcon size={18} />
                {submitLabel}
              </button>
            </section>

            {latestBackgroundTask && (
              <section className="make-background-task">
                <div>
                  <span>
                    <Clock3 size={16} />
                    后台任务
                  </span>
                  <strong>{latestBackgroundTask.title}</strong>
                  <small>{backgroundTasks.length} 个任务处理中，创作台可继续提交。</small>
                </div>
                <button type="button" className="secondary-action" onClick={() => onOpenTask(latestBackgroundTask.id)}>
                  <ArrowUpRight size={16} />
                  查看任务
                </button>
                <span className="task-row-progress" aria-label={`${latestBackgroundTask.progress}%`}>
                  <span style={{ width: `${latestBackgroundTask.progress}%` }}></span>
                </span>
              </section>
            )}
          </section>
        </div>
      </section>
    </div>
  )
}
