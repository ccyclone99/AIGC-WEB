import { useEffect, useState, type CSSProperties } from 'react'
import {
  CheckCircle2,
  ChevronRight,
  Clock3,
  Coins,
  Eye,
  FileVideo,
  ImagePlus,
  PackageCheck,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Trash2,
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
import { activeStatuses, outputOptionGroups, videoPreviewSrc } from '../prototypeData'
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
  const creationTitle = template.title
  const creationSubtitle = isPortraitTemplate
    ? '左侧查看模板案例，右侧选择已获授权的人像照片。'
    : '左侧查看模板案例，右侧选择本次使用的商品图。'
  const totalCost = template.cost
  const hasSelectedAsset = Boolean(selectedAsset?.image)
  const hasEnoughCredits = creditBalance >= totalCost
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [exampleStage, setExampleStage] = useState<'input' | 'output'>('output')
  const [portraitConsentConfirmed, setPortraitConsentConfirmed] = useState(false)
  const exampleMedia = template.example?.[exampleStage] ?? (exampleStage === 'input'
    ? {
        label: template.config.workflowType === 'video-remix' ? '示例原视频' : '示例上传图片',
        kind: template.config.workflowType === 'video-remix' ? 'video' as const : 'image' as const,
        image: template.image,
        videoSrc: template.config.workflowType === 'video-remix' ? template.videoSrc : undefined,
      }
    : {
        label: '模板完成效果',
        kind: 'video' as const,
        image: template.image,
        videoSrc: videoPreviewSrc,
      })
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
    setExampleStage('output')
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
      <section className="make-simple-card make-console-card studio-editor-card" style={{ '--template-accent': template.accent } as CSSProperties}>
        <header className="make-simple-head make-console-head studio-editor-head">
          <div className="make-console-title">
            <p className="eyebrow">视频制作</p>
            <h1>{creationTitle}</h1>
            <span>{creationSubtitle}</span>
          </div>
          <button type="button" className="make-template-chip" onClick={onChangeTemplate} title="更换模板">
            <PackageCheck size={17} />
            <span>
              <small>当前模板</small>
              <strong>{outputSettings.duration} · {outputSettings.ratio}</strong>
            </span>
            <em>更换模板 <ChevronRight size={14} /></em>
          </button>
        </header>

        <div className="make-simple-grid image-only-grid make-console-layout">
          <section className="make-preview-panel image-only-panel studio-stage-panel">
            <div className="studio-stage-topline">
              <span>
                <Sparkles size={16} />
                模板效果示例
              </span>
              <em>案例展示</em>
            </div>
            <div className="studio-example-switch" role="group" aria-label="切换模板案例画面">
              <button
                type="button"
                className={exampleStage === 'input' ? 'is-active' : ''}
                aria-pressed={exampleStage === 'input'}
                onClick={() => setExampleStage('input')}
              >
                示例素材
              </button>
              <button
                type="button"
                className={exampleStage === 'output' ? 'is-active' : ''}
                aria-pressed={exampleStage === 'output'}
                onClick={() => setExampleStage('output')}
              >
                完成效果
              </button>
            </div>
            <div className="studio-stage-canvas">
              <div className={`image-upload-card studio-stage-card studio-example-media is-ratio-${outputSettings.ratio.replace(':', '-')}`}>
                {exampleMedia.kind === 'video' && exampleMedia.videoSrc ? (
                  <video
                    src={exampleMedia.videoSrc}
                    poster={exampleMedia.image}
                    controls
                    muted
                    loop
                    autoPlay
                    playsInline
                    aria-label={exampleMedia.label}
                  />
                ) : (
                  <img src={exampleMedia.image} alt={exampleMedia.label} />
                )}
                <span className="studio-stage-badge">
                  {exampleMedia.kind === 'video' ? <FileVideo size={15} /> : <ImagePlus size={15} />}
                  {exampleMedia.label}
                </span>
                <span className="studio-stage-ratio">{outputSettings.ratio}</span>
              </div>
            </div>
            <p className="studio-stage-note">
              <span>{exampleMedia.label}</span>
              <em>模板案例，与本次上传素材无关</em>
            </p>
          </section>

          <section className="make-form-panel image-only-copy make-control-panel studio-control-tower">
            <div className="make-control-section make-asset-panel">
              <div className="studio-step-heading">
                <b>1</b>
                <span>
                  <strong>选择{inputNoun}</strong>
                  <small>使用清晰、主体完整的图片效果更好</small>
                </span>
              </div>
              {selectedAsset ? (
                <>
                  <div className="studio-material-card">
                    <img src={selectedAsset.image} alt="" />
                    <span>
                      <small>已选择</small>
                      <strong>{selectedAsset.name}</strong>
                    </span>
                    <button
                      type="button"
                      className="studio-material-replace"
                      onClick={onOpenAssetPicker}
                    >
                      <Upload size={16} />
                      替换
                    </button>
                  </div>
                  <div className="studio-material-tools">
                    <button
                      type="button"
                      onClick={() => onPreview(selectedAsset.name, selectedAsset.image)}
                    >
                      <Eye size={16} />
                      查看大图
                    </button>
                    <button
                      type="button"
                      onClick={() => onAssetSelect('')}
                    >
                      <Trash2 size={16} />
                      移除
                    </button>
                  </div>
                </>
              ) : (
                <button type="button" className="studio-material-empty" onClick={onOpenAssetPicker}>
                  <ImagePlus size={22} />
                  <span>
                    <strong>选择{inputNoun}</strong>
                    <small>支持从素材库选择或上传新图片</small>
                  </span>
                  <ChevronRight size={17} />
                </button>
              )}
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

            <section className="make-submit-panel studio-generate-panel">
              <div className="studio-step-heading">
                <b>2</b>
                <span>
                  <strong>生成视频</strong>
                  <small>确认规格与消耗后提交</small>
                </span>
              </div>
              <div className="studio-output-summary" aria-label={`输出规格：${settingSummary}`}>
                <span>{outputSettings.ratio} 竖屏</span>
                <span>{outputSettings.duration}</span>
                <span>{outputSettings.resolution}</span>
              </div>
              <div className="studio-cost-row">
                <span>
                  <Coins size={16} />
                  预计消耗
                </span>
                <strong>{totalCost} 积分</strong>
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
              <p className="studio-submit-hint">{submitHint}</p>
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
