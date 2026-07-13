import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { BadgeCheck, FileVideo, Filter, Play, Search, X } from 'lucide-react'

import { trackProductEvent } from '../analytics'
import { filterGroups } from '../prototypeData'
import type { Template } from '../types'

const quickTemplateFilters = ['全部', '商品展示', '投放短视频', '人像写真', '视频二创']

type TemplateShelfMode = 'ready' | 'preview'

const isVideoTemplate = (template: Template) => template.config.workflowType === 'video-remix'

const templateAvailability = (template: Template) =>
  isVideoTemplate(template)
    ? {
        label: '即将上线',
        tone: 'is-preview-only',
      }
    : {
        label: '可使用',
        tone: 'is-ready',
      }

function AutoPlayVideo({ poster, src, title }: { poster: string; src: string; title: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const play = () => {
      video.muted = true
      void video.play().catch(() => undefined)
    }

    play()
    video.addEventListener('canplay', play)

    return () => video.removeEventListener('canplay', play)
  }, [src])

  return <video ref={videoRef} src={src} poster={poster} autoPlay muted loop playsInline preload="metadata" aria-label={title} />
}

type TemplatesViewProps = {
  searchTerm: string
  selectedFilters: string[]
  templates: Template[]
  totalTemplateCount: number
  onClearFilters: () => void
  onFilter: () => void
  onOpenTemplate: (templateId: string) => void
  onSearch: (value: string) => void
  onToggleFilter: (filter: string) => void
}

export function TemplatesView({
  searchTerm,
  selectedFilters,
  templates,
  totalTemplateCount,
  onClearFilters,
  onFilter,
  onOpenTemplate,
  onSearch,
  onToggleFilter,
}: TemplatesViewProps) {
  const usableTemplates = templates.filter((template) => !isVideoTemplate(template))
  const previewTemplates = templates.filter(isVideoTemplate)
  const usableCount = usableTemplates.length
  const previewOnlyCount = previewTemplates.length
  const [shelfMode, setShelfMode] = useState<TemplateShelfMode>('ready')
  const displayedTemplates = shelfMode === 'preview' ? previewTemplates : usableTemplates
  const secondaryFilters = selectedFilters.filter((filter) => !quickTemplateFilters.includes(filter))
  const emptyModeCopy =
    shelfMode === 'preview'
      ? '当前筛选下没有视频预览模板。换一个关键词，或清空筛选条件。'
      : '当前筛选下没有匹配的模板。换一个关键词，或清空筛选条件。'

  useEffect(() => {
    if (shelfMode === 'ready' && usableTemplates.length === 0 && previewTemplates.length > 0) {
      setShelfMode('preview')
    }
    if (shelfMode === 'preview' && previewTemplates.length === 0 && usableTemplates.length > 0) {
      setShelfMode('ready')
    }
  }, [previewTemplates.length, shelfMode, usableTemplates.length])

  const handleClearFilters = () => {
    setShelfMode('ready')
    onClearFilters()
  }

  const handleQuickFilter = (filter: string) => {
    trackProductEvent('template_filter_changed', { filter })
    if (filter === '全部') {
      handleClearFilters()
      return
    }

    setShelfMode(filter === '视频二创' ? 'preview' : 'ready')
    onClearFilters()
    onToggleFilter(filter)
  }

  return (
    <div className="page-stack template-page">
      <section className="template-library-head">
        <div>
          <p className="eyebrow">模板库</p>
          <h1>全部模板</h1>
          <p>点击模板可预览效果，确认后再上传素材。</p>
        </div>
      </section>

      <section className="toolbar-row">
        {(totalTemplateCount > 12 || searchTerm) && (
          <label className="search-box">
            <Search size={18} />
            <input
              placeholder="搜索模板名称或使用场景"
              value={searchTerm}
              onChange={(event) => onSearch(event.currentTarget.value)}
            />
          </label>
        )}
        <button type="button" className="secondary-action filter-action" onClick={onFilter}>
          <Filter size={18} />
          {secondaryFilters.length > 0 ? `更多筛选 ${secondaryFilters.length}` : '更多筛选'}
        </button>
        <span className="template-count-chip">{shelfMode === 'preview' ? previewOnlyCount : usableCount} 个模板</span>
      </section>

      <section className="template-mode-strip" aria-label="模板类型">
        {quickTemplateFilters.map((filter) => (
          <button
            type="button"
            key={filter}
            className={
              filter === '全部'
                ? selectedFilters.length === 0 && shelfMode === 'ready'
                  ? 'is-selected'
                  : ''
                : selectedFilters.includes(filter)
                  ? 'is-selected'
                  : ''
            }
            onClick={() => handleQuickFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </section>

      {secondaryFilters.length > 0 && (
        <div className="active-filter-row">
          {secondaryFilters.map((filter) => (
            <button type="button" key={filter} onClick={() => onToggleFilter(filter)}>
              {filter}
              <X size={13} />
            </button>
          ))}
          <button type="button" className="clear-filter-button" onClick={handleClearFilters}>
            清空
          </button>
        </div>
      )}

      <section className="template-grid">
        {displayedTemplates.map((template, index) => (
          <TemplateCard key={template.id} index={index} template={template} onOpen={onOpenTemplate} />
        ))}
      </section>
      {displayedTemplates.length === 0 && (
        <section className="empty-state">
          <Search size={22} />
          <strong>没有匹配模板</strong>
          <span>{emptyModeCopy}</span>
        </section>
      )}
    </div>
  )
}

export function TemplateDetail({
  template,
  onCreate,
  onPreview,
}: {
  template: Template
  onCreate: () => void
  onPreview: () => void
}) {
  const isVideo = isVideoTemplate(template)
  const availability = templateAvailability(template)

  return (
    <div className="template-detail" style={{ '--template-accent': template.accent } as CSSProperties}>
      <button type="button" className={isVideo ? 'detail-media is-video-autoplay' : 'detail-media'} onClick={onPreview}>
        {isVideo && template.videoSrc ? (
          <AutoPlayVideo src={template.videoSrc} poster={template.image} title={`${template.title} 视频预览`} />
        ) : (
          <img src={template.image} alt={template.title} />
        )}
        {isVideo && (
          <>
            <i className="video-auto-label">
              <FileVideo size={14} />
              自动播放中
            </i>
            <i className="video-preview-timeline" aria-hidden="true">
              <b />
            </i>
          </>
        )}
        <span>
          <Play size={18} fill="currentColor" />
          {isVideo ? '打开播放预览' : '预览'}
        </span>
      </button>
      <div className="detail-copy">
        <div className="detail-title-bar">
          <p className="eyebrow">{template.category}</p>
          {isVideo && (
            <span className={`template-status-pill ${availability.tone}`}>
              <BadgeCheck size={14} />
              {availability.label}
            </span>
          )}
        </div>
        <h2>{template.title}</h2>
        <p>{template.description}</p>
        <strong className="template-detail-scenario">适合：{template.scenario}</strong>
        <div className="spec-grid">
          <span>
            <strong>{template.cost}</strong>
            积分
          </span>
          <span>
            <strong>{template.duration}</strong>
            时长
          </span>
          <span>
            <strong>{template.ratio}</strong>
            比例
          </span>
        </div>
        {isVideo && (
          <div className="detail-support-note">
            <FileVideo size={17} />
            <span>
              <strong>即将上线</strong>
              该模板正在排期中，当前可先查看样片。
            </span>
          </div>
        )}
        <div className="template-detail-action">
          <p>{isVideo ? '当前开放样片预览。' : '选择图片后即可生成，默认参数无需调整。'}</p>
          <button type="button" className="primary-action" disabled={isVideo} onClick={onCreate}>
            {isVideo ? '即将上线' : '使用模板'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function FilterPanel({
  selectedFilters,
  onApply,
  onClear,
  onToggle,
}: {
  selectedFilters: string[]
  onApply: () => void
  onClear: () => void
  onToggle: (filter: string) => void
}) {
  return (
    <div className="sheet-grid">
      <section className="filter-panel-head">
        <span>
          <strong>{selectedFilters.length}</strong>
          已选筛选
        </span>
        <button type="button" className="secondary-action" onClick={onClear} disabled={selectedFilters.length === 0}>
          清空筛选
        </button>
      </section>
      {filterGroups.map((group) => {
        return <FilterGroup key={group.title} items={group.items} selectedFilters={selectedFilters} title={group.title} onToggle={onToggle} />
      })}
      <button type="button" className="primary-action" onClick={onApply}>
        应用筛选
      </button>
    </div>
  )
}

function TemplateCard({
  index,
  template,
  onOpen,
}: {
  index: number
  template: Template
  onOpen: (templateId: string) => void
}) {
  const typeClass =
    isVideoTemplate(template)
      ? 'is-video-template'
      : template.category === '人像写真'
        ? 'is-portrait-template'
        : 'is-image-template'
  const isVideo = isVideoTemplate(template)
  const availability = templateAvailability(template)

  return (
    <button
      type="button"
      className={`template-card template-card-premium ${typeClass} ${index < 2 ? 'is-featured' : ''}`}
      style={{ '--template-accent': template.accent, '--card-index': index } as CSSProperties}
      onClick={() => onOpen(template.id)}
    >
      <span className="template-media">
        {isVideo && template.videoSrc ? (
          <AutoPlayVideo src={template.videoSrc} poster={template.image} title={`${template.title} 视频预览`} />
        ) : (
          <img src={template.image} alt={template.title} />
        )}
        <span>{template.category}</span>
        {isVideo && <i className={`template-media-state ${availability.tone}`}>{availability.label}</i>}
        {isVideo && (
          <i className="template-play-badge">
            <Play size={14} fill="currentColor" />
          </i>
        )}
        <i className="template-preview-layer">
          <Play size={17} />
          预览模板
        </i>
      </span>
      <span className="template-body">
        <small className="template-card-scenario">适合：{template.scenario}</small>
        <strong>{template.title}</strong>
        <span className="template-meta">
          <em>{template.duration}</em>
          <em>{template.ratio}</em>
          <strong>{template.cost} 积分</strong>
        </span>
        <span className="template-card-cta">{isVideo ? '查看预览' : '使用模板'}</span>
      </span>
    </button>
  )
}

function FilterGroup({
  title,
  items,
  selectedFilters,
  onToggle,
}: {
  title: string
  items: string[]
  selectedFilters: string[]
  onToggle: (filter: string) => void
}) {
  return (
    <section className="filter-group">
      <strong>{title}</strong>
      <div>
        {items.map((item) => (
          <button type="button" className={selectedFilters.includes(item) ? 'is-selected' : ''} key={item} onClick={() => onToggle(item)}>
            {item}
          </button>
        ))}
      </div>
    </section>
  )
}
