import { type CSSProperties } from 'react'
import { FileVideo, Filter, Play, Search, WandSparkles, X } from 'lucide-react'

import { templateInputLabel } from '../domain'
import { filterGroups, initialTasks } from '../prototypeData'
import type { Template } from '../types'

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
  return (
    <div className="page-stack template-page">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">TEMPLATE FIRST</p>
          <h1>商品图生成电商短视频</h1>
          <p>选模板、上传图片即可开始，其他交给模板工作流。</p>
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
        <button type="button" className="hero-preview" onClick={() => onOpenTemplate('watch')}>
          <img src={templates[0]?.image ?? initialTasks[1].image} alt="精品表款模板预览" />
          <span>只需图片 · 168 积分 · 8s · 9:16</span>
        </button>
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
  const isVideoTemplate = template.category === '视频模板'

  return (
    <div className="template-detail" style={{ '--template-accent': template.accent } as CSSProperties}>
      <button type="button" className={isVideoTemplate ? 'detail-media is-video-autoplay' : 'detail-media'} onClick={onPreview}>
        {isVideoTemplate && template.videoSrc ? (
          <video src={template.videoSrc} poster={template.image} autoPlay muted loop playsInline />
        ) : (
          <img src={template.image} alt={template.title} />
        )}
        {isVideoTemplate && (
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
          {isVideoTemplate ? '打开播放预览' : '预览'}
        </span>
      </button>
      <div className="detail-copy">
        <p className="eyebrow">{template.category}</p>
        <h2>{template.title}</h2>
        <p>{template.description}</p>
        <div className="tag-row">
          {template.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <div className="spec-grid">
          <span>
            <strong>{templateInputLabel(template)}</strong>
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
        {isVideoTemplate && (
          <div className="detail-support-note">
            <FileVideo size={17} />
            <span>
              <strong>视频制作台建设中</strong>
              当前可查看模板预览；视频上传、字幕包装和剪辑参数会进入独立制作台。
            </span>
          </div>
        )}
        <button type="button" className="primary-action" disabled={isVideoTemplate} onClick={onCreate}>
          <WandSparkles size={18} />
          {isVideoTemplate ? '视频制作暂未开放' : '使用模板'}
        </button>
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
    template.category === '视频模板'
      ? 'is-video-template'
      : template.category === '人像写真'
        ? 'is-portrait-template'
        : 'is-image-template'

  return (
    <button
      type="button"
      className={`template-card ${typeClass}`}
      style={{ '--template-accent': template.accent, '--card-index': index } as CSSProperties}
      onClick={() => onOpen(template.id)}
    >
      <span className="template-media">
        <img src={template.image} alt={template.title} />
        <span>{template.category}</span>
        <em>{templateInputLabel(template)}</em>
        <i className="template-preview-layer">
          <Play size={17} />
          预览模板
        </i>
      </span>
      <span className="template-body">
        <small>{template.scenario}</small>
        <strong>{template.title}</strong>
        <b>{template.description}</b>
        <span className="template-meta">
          <em>{template.duration}</em>
          <em>{template.ratio}</em>
          <em>{template.cost} 积分</em>
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
