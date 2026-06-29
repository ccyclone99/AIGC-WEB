import { useEffect, useRef, type CSSProperties } from 'react'
import { ArrowRight, BadgeCheck, Coins, FileVideo, Filter, ImageUp, Play, Search, ShieldCheck, WandSparkles, X } from 'lucide-react'

import { templateInputLabel } from '../domain'
import { filterGroups, initialTasks } from '../prototypeData'
import type { Template } from '../types'

const quickTemplateFilters = ['商品图成片', '电商短视频', '人像写真', '视频模板']

const isVideoTemplate = (template: Template) => template.category === '视频模板'

const templateOutputLabel = (template: Template) => {
  if (isVideoTemplate(template)) return '视频二创'
  if (template.category === '人像写真') return '写真/变装'
  if (template.scenario.includes('详情')) return '详情页素材'
  if (template.scenario.includes('投放')) return '投放素材'
  return '电商短视频'
}

const templateAvailability = (template: Template) =>
  isVideoTemplate(template)
    ? {
        label: '预览开放',
        tone: 'is-preview-only',
        helper: '视频上传与剪辑台后续开放',
      }
    : {
        label: '可直接制作',
        tone: 'is-ready',
        helper: '一张图片即可进入创作台',
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
  onClearFilters: () => void
  onFilter: () => void
  onOpenTemplate: (templateId: string) => void
  onPreview: () => void
  onSearch: (value: string) => void
  onToggleFilter: (filter: string) => void
}

export function TemplatesView({
  searchTerm,
  selectedFilters,
  templates,
  onClearFilters,
  onFilter,
  onOpenTemplate,
  onPreview,
  onSearch,
  onToggleFilter,
}: TemplatesViewProps) {
  const usableCount = templates.filter((template) => !isVideoTemplate(template)).length
  const videoPreviewCount = templates.length - usableCount

  return (
    <div className="page-stack template-page">
      <section className="hero-panel template-hero-premium template-shelf-head">
        <div>
          <p className="eyebrow">TEMPLATE SHELF</p>
          <h1>模板库</h1>
          <p>按输入素材、输出场景和积分成本选择视频方案。</p>
          <div className="template-hero-metrics" aria-label="模板库概览">
            <span>
              <strong>{usableCount}</strong>
              <small>可直接制作</small>
            </span>
            <span>
              <strong>{videoPreviewCount}</strong>
              <small>视频预览</small>
            </span>
            <span>
              <strong>1 图</strong>
              <small>主流程输入</small>
            </span>
          </div>
          <div className="hero-actions">
            <button type="button" className="primary-action" onClick={() => onOpenTemplate('watch')}>
              <WandSparkles size={18} />
              选择推荐模板
            </button>
            <button type="button" className="secondary-action" onClick={onPreview}>
              <Play size={18} />
              查看预览
            </button>
          </div>
        </div>
        <div className="template-hero-preview-stack">
          <button type="button" className="hero-preview template-hero-main-preview" onClick={() => onOpenTemplate('watch')}>
            <img src={templates[0]?.image ?? initialTasks[1].image} alt="精品表款模板预览" />
            <span>商品图输入</span>
            <em>8 秒质感转场 · 168 积分</em>
          </button>
          <button type="button" className="template-hero-side-preview" onClick={onPreview}>
            <Play size={18} fill="currentColor" />
            <span>
              <strong>预览输出节奏</strong>
              <small>先看样片，再进入创作台。</small>
            </span>
          </button>
        </div>
      </section>

      <section className="toolbar-row">
        <label className="search-box">
          <Search size={18} />
          <input
            placeholder="搜索 商品图、人像、抖音、小红书"
            value={searchTerm}
            onChange={(event) => onSearch(event.currentTarget.value)}
          />
        </label>
        <button type="button" className="secondary-action filter-action" onClick={onFilter}>
          <Filter size={18} />
          {selectedFilters.length > 0 ? `筛选 ${selectedFilters.length}` : '筛选'}
        </button>
        <span className="template-count-chip">{templates.length} 个模板</span>
      </section>

      <section className="template-mode-strip" aria-label="模板类型">
        <button type="button" className={selectedFilters.length === 0 ? 'is-selected' : ''} onClick={onClearFilters}>
          推荐
        </button>
        {quickTemplateFilters.map((filter) => (
          <button
            type="button"
            key={filter}
            className={selectedFilters.includes(filter) ? 'is-selected' : ''}
            onClick={() => onToggleFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </section>

      <section className="template-insight-strip" aria-label="模板选择提示">
        <span>
          <ImageUp size={16} />
          <strong>先确认输入</strong>
          <small>第一版主跑商品图生成视频</small>
        </span>
        <span>
          <Coins size={16} />
          <strong>再看冻结积分</strong>
          <small>失败或超时会释放冻结</small>
        </span>
        <span>
          <ShieldCheck size={16} />
          <strong>最后进创作台</strong>
          <small>参数和资产写入任务记录</small>
        </span>
      </section>

      {selectedFilters.length > 0 && (
        <div className="active-filter-row">
          {selectedFilters.map((filter) => (
            <button type="button" key={filter} onClick={() => onToggleFilter(filter)}>
              {filter}
              <X size={13} />
            </button>
          ))}
          <button type="button" className="clear-filter-button" onClick={onClearFilters}>
            清空
          </button>
        </div>
      )}

      <section className="template-grid">
        {templates.map((template, index) => (
          <TemplateCard key={template.id} index={index} template={template} onOpen={onOpenTemplate} />
        ))}
      </section>
      {templates.length === 0 && (
        <section className="empty-state">
          <Search size={22} />
          <strong>没有匹配模板</strong>
          <span>换一个关键词，或清空筛选条件。</span>
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
  const inputLabel = templateInputLabel(template)
  const outputLabel = templateOutputLabel(template)

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
          <span className={`template-status-pill ${availability.tone}`}>
            <BadgeCheck size={14} />
            {availability.label}
          </span>
        </div>
        <h2>{template.title}</h2>
        <p>{template.description}</p>
        <section className="template-decision-panel" aria-label="模板选择信息">
          <span>
            <small>适用场景</small>
            <strong>{template.scenario}</strong>
          </span>
          <span>
            <small>输入素材</small>
            <strong>{inputLabel}</strong>
          </span>
          <span>
            <small>交付结果</small>
            <strong>{outputLabel}</strong>
          </span>
          <span>
            <small>当前状态</small>
            <strong>{availability.helper}</strong>
          </span>
        </section>
        <div className="tag-row">
          {template.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <div className="spec-grid">
          <span>
            <strong>{inputLabel}</strong>
            所需输入
          </span>
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
        <section className="template-flow-strip" aria-label="模板产出流程">
          <span>
            <small>输入</small>
            <strong>{inputLabel}</strong>
          </span>
          <span>
            <small>模板</small>
            <strong>{template.config.workflowLabel}</strong>
          </span>
          <span>
            <small>输出</small>
            <strong>{outputLabel}</strong>
          </span>
        </section>
        <section className="template-contract-panel">
          <header>
            <strong>模板协议</strong>
            <small>{template.config.version} · {template.config.pricingVersion}</small>
          </header>
          <div>
            <span>
              <small>输入项</small>
              <strong>{template.config.inputFields.map((field) => field.label).join(' / ')}</strong>
            </span>
            <span>
              <small>工作流</small>
              <strong>{template.config.workflowLabel}</strong>
            </span>
            <span>
              <small>结算</small>
              <strong>{template.config.settlement === 'freeze_then_settle' ? '预冻结后结算' : template.config.settlement}</strong>
            </span>
            <span>
              <small>能力</small>
              <strong>{template.config.capabilities.length} 项</strong>
            </span>
          </div>
        </section>
        {isVideo && (
          <div className="detail-support-note">
            <FileVideo size={17} />
            <span>
              <strong>视频制作台建设中</strong>
              当前可查看模板预览；视频上传、字幕包装和剪辑参数会进入独立制作台。
            </span>
          </div>
        )}
        <div className="template-detail-action">
          <p>{isVideo ? '当前先用于预览和方案确认。' : '进入创作台后只需要选择图片，默认参数可直接提交。'}</p>
          <button type="button" className="primary-action" disabled={isVideo} onClick={onCreate}>
            <WandSparkles size={18} />
            {isVideo ? '视频制作暂未开放' : '进入创作台'}
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
      {filterGroups.map((group) => (
        <FilterGroup key={group.title} items={group.items} selectedFilters={selectedFilters} title={group.title} onToggle={onToggle} />
      ))}
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
  const inputLabel = templateInputLabel(template)
  const outputLabel = templateOutputLabel(template)

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
        <em>{inputLabel}</em>
        <i className={`template-media-state ${availability.tone}`}>{availability.label}</i>
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
        <span className="template-card-kicker">
          <small>{template.scenario}</small>
          <em className={availability.tone}>{availability.label}</em>
        </span>
        <strong>{template.title}</strong>
        <b>{template.description}</b>
        <span className="template-card-decisions">
          <span>
            <small>输入</small>
            <strong>{inputLabel}</strong>
          </span>
          <span>
            <small>输出</small>
            <strong>{outputLabel}</strong>
          </span>
          <span>
            <small>冻结</small>
            <strong>{template.cost} 积分</strong>
          </span>
        </span>
        <span className="template-meta">
          <em>{template.duration}</em>
          <em>{template.ratio}</em>
          <em>{template.config.workflowLabel}</em>
        </span>
        <span className="template-card-cta">
          <em>{isVideo ? '播放预览' : '查看并制作'}</em>
          <ArrowRight size={15} />
        </span>
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
