import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { ArrowLeft, ArrowRight, Clock3, Coins, Grid3X3, Play, RotateCcw, Sparkles } from 'lucide-react'

import { trackProductEvent } from '../analytics'
import type { Template } from '../types'

type TemplateDiscoveryProps = {
  draftTemplate?: Template
  hasDraft: boolean
  templates: Template[]
  onOpenAllTemplates: () => void
  onResumeDraft: () => void
  onSelectTemplate: (templateId: string) => void
}

function TemplateMedia({ active, template }: { active: boolean; template: Template }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (active) {
      video.muted = true
      void video.play().catch(() => undefined)
      return
    }
    video.pause()
  }, [active])

  if (template.videoSrc) {
    return (
      <video
        ref={videoRef}
        src={template.videoSrc}
        poster={template.image}
        muted
        loop
        playsInline
        preload={active ? 'metadata' : 'none'}
        aria-label={`${template.title} 效果预览`}
      />
    )
  }

  return <img src={template.image} alt={`${template.title} 效果预览`} />
}

export function TemplateDiscovery({
  draftTemplate,
  hasDraft,
  templates,
  onOpenAllTemplates,
  onResumeDraft,
  onSelectTemplate,
}: TemplateDiscoveryProps) {
  const availableTemplates = useMemo(
    () => templates.filter((template) => template.config.workflowType !== 'video-remix').slice(0, 6),
    [templates],
  )
  const [activeIndex, setActiveIndex] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (activeIndex >= availableTemplates.length) setActiveIndex(0)
  }, [activeIndex, availableTemplates.length])

  useEffect(() => trackProductEvent('create_template_feed_opened'), [])

  useEffect(() => {
    const template = availableTemplates[activeIndex]
    if (template) trackProductEvent('template_carousel_changed', { templateId: template.id, index: activeIndex })
  }, [activeIndex, availableTemplates])

  const moveTo = (nextIndex: number) => {
    if (availableTemplates.length === 0) return
    const normalized = Math.max(0, Math.min(nextIndex, availableTemplates.length - 1))
    const track = trackRef.current
    const card = track?.querySelector<HTMLElement>(`[data-template-index="${normalized}"]`)
    if (track && card) {
      const left = card.offsetLeft - (track.clientWidth - card.clientWidth) / 2
      track.scrollTo({ left, behavior: 'smooth' })
    }
    setActiveIndex(normalized)
  }

  const handleScroll = () => {
    const track = trackRef.current
    if (!track) return
    const center = track.scrollLeft + track.clientWidth / 2
    const cards = Array.from(track.querySelectorAll<HTMLElement>('[data-template-index]'))
    const nearest = cards.reduce(
      (best, card, index) => {
        const distance = Math.abs(card.offsetLeft + card.clientWidth / 2 - center)
        return distance < best.distance ? { distance, index } : best
      },
      { distance: Number.POSITIVE_INFINITY, index: 0 },
    )
    setActiveIndex(nearest.index)
  }

  if (availableTemplates.length === 0) {
    return (
      <section className="template-discovery-empty">
        <Sparkles size={24} />
        <strong>暂时没有可用模板</strong>
        <button type="button" className="secondary-action" onClick={onOpenAllTemplates}>查看模板库</button>
      </section>
    )
  }

  return (
    <div className="template-discovery-page">
      <header className="template-discovery-head">
        <div>
          <p className="eyebrow">开始创作</p>
          <h1>先选择一个视频效果</h1>
          <p>左右切换预览，选中喜欢的模板后再上传素材。</p>
        </div>
        <button type="button" className="secondary-action template-all-button" onClick={() => { trackProductEvent('all_templates_opened', { source: 'reel-desktop' }); onOpenAllTemplates() }}>
          <Grid3X3 size={17} />
          全部模板
        </button>
      </header>

      {hasDraft && draftTemplate && (
        <button type="button" className="creation-draft-banner" onClick={() => { trackProductEvent('draft_resumed'); onResumeDraft() }}>
          <RotateCcw size={18} />
          <span>
            <small>上次创作</small>
            <strong>继续使用“{draftTemplate.title}”</strong>
          </span>
          <em>继续</em>
        </button>
      )}

      <section className="template-reel-shell" aria-label="推荐模板">
        <button
          type="button"
          className="template-reel-arrow is-left"
          onClick={() => moveTo(activeIndex - 1)}
          disabled={activeIndex === 0}
          aria-label="上一个模板"
        >
          <ArrowLeft size={20} />
        </button>

        <div
          ref={trackRef}
          className="template-reel-track"
          tabIndex={0}
          onScroll={handleScroll}
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft') moveTo(activeIndex - 1)
            if (event.key === 'ArrowRight') moveTo(activeIndex + 1)
          }}
        >
          {availableTemplates.map((template, index) => (
            <article
              key={template.id}
              data-template-index={index}
              className={index === activeIndex ? 'template-reel-card is-active' : 'template-reel-card'}
              style={{ '--template-accent': template.accent } as CSSProperties}
              aria-current={index === activeIndex ? 'true' : undefined}
            >
              <div className="template-reel-media">
                <TemplateMedia active={index === activeIndex} template={template} />
                <span className="template-reel-shade" />
                <span className="template-reel-play"><Play size={17} fill="currentColor" /> 效果预览</span>
                <div className="template-reel-copy">
                  <small>{template.scenario}</small>
                  <h2>{template.title}</h2>
                  <p>{template.description}</p>
                  <span className="template-reel-meta">
                    <em><Clock3 size={14} /> {template.duration}</em>
                    <em>{template.ratio}</em>
                    <em><Coins size={14} /> {template.cost}</em>
                  </span>
                  <button type="button" onClick={() => { trackProductEvent('template_selected', { templateId: template.id, source: 'reel' }); onSelectTemplate(template.id) }}>
                    使用此模板
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <button
          type="button"
          className="template-reel-arrow is-right"
          onClick={() => moveTo(activeIndex + 1)}
          disabled={activeIndex === availableTemplates.length - 1}
          aria-label="下一个模板"
        >
          <ArrowRight size={20} />
        </button>
      </section>

      <div className="template-reel-pagination" aria-label={`第 ${activeIndex + 1} 个，共 ${availableTemplates.length} 个模板`}>
        {availableTemplates.map((template, index) => (
          <button
            type="button"
            key={template.id}
            className={index === activeIndex ? 'is-active' : ''}
            onClick={() => moveTo(index)}
            aria-label={`查看${template.title}`}
          />
        ))}
      </div>

      <button type="button" className="template-mobile-all" onClick={() => { trackProductEvent('all_templates_opened', { source: 'reel-mobile' }); onOpenAllTemplates() }}>
        <Grid3X3 size={18} />
        浏览全部模板
      </button>
    </div>
  )
}
