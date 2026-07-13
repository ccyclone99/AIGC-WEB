import { useEffect, useState, type CSSProperties } from 'react'
import {
  CheckCircle2,
  ChevronRight,
  Clock3,
  Coins,
  FileVideo,
  ImagePlus,
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

import {
  canUseAssetForTemplate,
  generationIdempotencyKey,
  sameOutputSettings,
  userEditableOutputFieldsForTemplate,
} from '../domain'
import { activeStatuses, outputOptionGroups } from '../prototypeData'
import type { Asset, OutputSettingKey, OutputSettings, PreviewMedia, Task, Template } from '../types'

type StudioPageProps = {
  assets: Asset[]
  creditBalance: number
  outputSettings: OutputSettings
  selectedAssetId: string
  tasks: Task[]
  template: Template
  onAssetSelect: (assetId: string) => void
  onChangeTemplate: () => void
  onCredits: () => void
  onOpenAssetPicker: () => void
  onOpenTask: (taskId: string) => void
  onOutputSettingChange: (key: OutputSettingKey, value: string) => void
  onPreview: (title: string, image: string, media?: Partial<Pick<PreviewMedia, 'kind' | 'videoSrc'>>) => void
  onSubmit: (portraitConsentConfirmed?: boolean) => void
}

export function StudioPage({
  assets,
  creditBalance,
  outputSettings,
  selectedAssetId,
  tasks,
  template,
  onAssetSelect,
  onChangeTemplate,
  onCredits,
  onOpenAssetPicker,
  onOpenTask,
  onOutputSettingChange,
  onPreview,
  onSubmit,
}: StudioPageProps) {
  const selectedAsset = selectedAssetId
    ? assets.find((asset) => asset.id === selectedAssetId && canUseAssetForTemplate(asset, template))
    : undefined
  const isPortraitTemplate = template.config.workflowType === 'portrait-to-video'
  const inputNoun = isPortraitTemplate ? '人像照片' : '商品图'
  const creationTitle = isPortraitTemplate ? '人像写真制作' : '商品视频制作'
  const creationSubtitle = isPortraitTemplate
    ? '选择一张已获授权的人像照片，确认授权后提交生成。'
    : '上传一张商品图，确认后即可提交生成。'
  const totalCost = template.cost
  const hasSelectedAsset = Boolean(selectedAsset?.image)
  const hasEnoughCredits = creditBalance >= totalCost
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [portraitConsentConfirmed, setPortraitConsentConfirmed] = useState(false)
  const requiresPortraitConsent = template.config.workflowType === 'portrait-to-video'
  const hasRequiredConsent = !requiresPortraitConsent || portraitConsentConfirmed
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
  const canUseSubmitAction = hasSelectedAsset && !duplicateTask && (hasRequiredConsent || !hasEnoughCredits)
  const settingSummary = `${outputSettings.ratio} · ${outputSettings.duration} · ${outputSettings.resolution} · ${outputSettings.quality}`
  const editableOutputGroups = outputOptionGroups.filter((group) =>
    userEditableOutputFieldsForTemplate(template).includes(group.key),
  )
  const backgroundTasks = tasks.filter((task) => activeStatuses.includes(task.status)).slice(0, 3)
  const latestBackgroundTask = backgroundTasks[0]
  const submitHint = !hasSelectedAsset
    ? `选择${inputNoun}后即可提交生成。`
    : duplicateTask
      ? '当前素材正在生成中。可以更换素材后再生成新版本。'
      : !hasRequiredConsent
        ? '请先确认已获得人物肖像授权。'
      : hasEnoughCredits
      ? '生成失败会退回积分，完成后自动保存到作品库。'
      : `可用 ${creditBalance} 积分，还差 ${totalCost - creditBalance} 积分。`
  const submitLabel = !hasSelectedAsset
    ? `选择${inputNoun}后生成`
    : duplicateTask
      ? '生成中'
      : !hasRequiredConsent
        ? '确认授权后生成'
      : hasEnoughCredits
        ? '生成视频'
        : '积分不足，去充值'
  const SubmitIcon = duplicateTask ? Clock3 : !hasRequiredConsent ? ShieldCheck : hasEnoughCredits ? WandSparkles : Wallet

  useEffect(() => {
    setPortraitConsentConfirmed(false)
  }, [template.id])

  const handleSubmit = () => {
    if (!hasEnoughCredits) {
      onCredits()
      return
    }
    onSubmit(portraitConsentConfirmed)
  }

  return (
    <div className="studio-page-v3 make-simple-page make-console-page">
      <section className="make-simple-card make-console-card" style={{ '--template-accent': template.accent } as CSSProperties}>
        <header className="make-simple-head make-console-head studio-editor-head">
          <div className="make-console-title">
            <h1>{creationTitle}</h1>
            <span>{creationSubtitle}</span>
          </div>
          <button type="button" className="make-template-chip" onClick={onChangeTemplate} title="更换模板">
            <PackageCheck size={17} />
            <span>
              <small>模板</small>
              <strong>{template.title}</strong>
            </span>
            <em>更换 <ChevronRight size={14} /></em>
          </button>
        </header>

        <div className="make-simple-grid image-only-grid make-console-layout">
          <section className="make-preview-panel image-only-panel studio-stage-panel">
            <div className="studio-stage-topline">
              <span>
                <Sparkles size={16} />
                视频画面预览
              </span>
              <em>{outputSettings.duration} · {outputSettings.ratio}</em>
            </div>
            {selectedAsset ? (
              <button type="button" className="image-upload-card studio-stage-card" onClick={() => onPreview(selectedAsset.name, selectedAsset.image)}>
                <img src={selectedAsset.image} alt={`${selectedAsset.name} 当前${inputNoun}`} />
                <span className="studio-stage-badge">
                  <FileVideo size={15} />
                  输出 {outputSettings.duration} 视频
                </span>
                <span className="studio-stage-ratio">{outputSettings.ratio}</span>
              </button>
            ) : (
              <button type="button" className="image-upload-card image-upload-empty studio-stage-card" onClick={onOpenAssetPicker}>
                <img src={template.image} alt="" />
                <span className="image-upload-empty-content">
                  <ImagePlus size={34} />
                  <strong>选择{inputNoun}</strong>
                  <span>使用“{template.title}”生成视频</span>
                </span>
              </button>
            )}
          </section>

          <section className="make-form-panel image-only-copy make-control-panel studio-control-tower">
            <div className="make-control-section make-asset-panel">
              <div className="make-panel-heading">
                <span>
                  <p className="eyebrow">输入素材</p>
                  <h2>{selectedAsset?.name ?? `等待选择${inputNoun}`}</h2>
                </span>
                {!selectedAsset && <em className="is-waiting">未选择</em>}
              </div>
              <div className="make-upload-actions make-console-actions">
                <button type="button" className="secondary-action upload-inline-button make-replace-action" onClick={onOpenAssetPicker}>
                  <Upload size={18} />
                  {selectedAsset ? `替换${inputNoun}` : `选择${inputNoun}`}
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

            {editableOutputGroups.length > 0 && <section className="make-settings-shell">
              <button
                type="button"
                className="make-settings-button"
                aria-label={`输出设置，${settingSummary}`}
                aria-expanded={settingsOpen}
                onClick={() => setSettingsOpen((current) => !current)}
              >
                <span>
                  <SlidersHorizontal size={17} />
                  输出设置
                </span>
                <em>
                  <span className="setting-summary-full">{settingSummary}</span>
                  <span className="setting-summary-compact">{outputSettings.resolution} · {outputSettings.quality}</span>
                </em>
              </button>

              {settingsOpen && (
                <div className="make-settings-popover">
                  <header>
                    <span>
                      <strong>输出设置</strong>
                      <small>只调整当前模板允许修改的项目。</small>
                    </span>
                    <button type="button" className="close-button" onClick={() => setSettingsOpen(false)} aria-label="关闭输出设置">
                      <X size={17} />
                    </button>
                  </header>

                  <div className="output-setting-grid">
                    {editableOutputGroups.map((group) => (
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
                  <div className="make-settings-footer">
                    <button type="button" className="primary-action" onClick={() => setSettingsOpen(false)}>
                      <CheckCircle2 size={17} />
                      完成设置
                    </button>
                  </div>
                </div>
              )}
            </section>}

            {requiresPortraitConsent && (
              <label className="portrait-consent-row">
                <input
                  type="checkbox"
                  checked={portraitConsentConfirmed}
                  onChange={(event) => setPortraitConsentConfirmed(event.currentTarget.checked)}
                />
                <ShieldCheck size={18} />
                <span>
                  <strong>确认肖像授权</strong>
                  <small>我已获得照片中人物授权，并同意将其用于本次视频生成。</small>
                </span>
              </label>
            )}

            <section className="make-submit-panel">
              <div className="make-submit-copy">
                <span>
                  <Coins size={17} />
                  预计消耗
                </span>
                <strong>{totalCost} 积分</strong>
                <p>{submitHint}</p>
              </div>
              <button
                type="button"
                className={duplicateTask ? 'primary-action is-processing' : 'primary-action'}
                disabled={!canUseSubmitAction}
                onClick={handleSubmit}
              >
                <SubmitIcon size={18} />
                {submitLabel}
              </button>
            </section>

          </section>
        </div>

        {latestBackgroundTask && (
          <section className="studio-current-task" aria-live="polite">
            <span className="studio-activity-media">
              <img src={latestBackgroundTask.image} alt="" />
              <i><Clock3 size={15} /> 生成中</i>
            </span>
            <div className="studio-current-task-copy">
              <small>
                {latestBackgroundTask.progress}%
                {backgroundTasks.length > 1 ? ` · 另有 ${backgroundTasks.length - 1} 个任务` : ''}
              </small>
              <strong>{latestBackgroundTask.title}</strong>
              <span className="studio-activity-progress">
                <i style={{ width: `${latestBackgroundTask.progress}%` }} />
              </span>
            </div>
            <button type="button" onClick={() => onOpenTask(latestBackgroundTask.id)}>
              查看进度 <ChevronRight size={15} />
            </button>
          </section>
        )}
      </section>
      <button
        type="button"
        className={duplicateTask ? 'mobile-studio-submit is-processing' : 'mobile-studio-submit'}
        disabled={!canUseSubmitAction}
        onClick={handleSubmit}
      >
        <SubmitIcon size={19} />
        <span>{submitLabel}</span>
        {!duplicateTask && hasSelectedAsset && <em>{totalCost} 积分</em>}
      </button>
    </div>
  )
}
