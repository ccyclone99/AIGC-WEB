import { useMemo, useState } from 'react'
import { Check, Coins, TriangleAlert } from 'lucide-react'

import { canUseAssetForTemplate } from '../domain'
import type { Asset, Template } from '../types'

type TemplatePickerProps = {
  templates: Template[]
  selectedAsset?: Asset
  selectedTemplateId: string
  onSelect: (templateId: string) => void
}

export function TemplatePicker({ templates, selectedAsset, selectedTemplateId, onSelect }: TemplatePickerProps) {
  const availableTemplates = useMemo(
    () => templates.filter((template) => template.config.workflowType !== 'video-remix'),
    [templates],
  )
  const categories = useMemo(
    () => ['全部', ...Array.from(new Set(availableTemplates.map((template) => template.category)))],
    [availableTemplates],
  )
  const [category, setCategory] = useState('全部')
  const [pendingTemplate, setPendingTemplate] = useState<Template | null>(null)
  const visibleTemplates = category === '全部'
    ? availableTemplates
    : availableTemplates.filter((template) => template.category === category)

  const chooseTemplate = (template: Template) => {
    if (selectedAsset && !canUseAssetForTemplate(selectedAsset, template)) {
      setPendingTemplate(template)
      return
    }
    onSelect(template.id)
  }

  return (
    <div className="template-picker">
      <p className="template-picker-intro">选择成片风格，素材和参数会尽量保留。</p>

      {pendingTemplate && (
        <section className="template-switch-warning" role="alert">
          <TriangleAlert size={19} />
          <span>
            <strong>需要重新选择素材</strong>
            <small>“{pendingTemplate.title}”使用的素材类型不同，切换后会移除当前素材。</small>
          </span>
          <div>
            <button type="button" className="secondary-action" onClick={() => setPendingTemplate(null)}>
              取消
            </button>
            <button type="button" className="primary-action" onClick={() => onSelect(pendingTemplate.id)}>
              继续切换
            </button>
          </div>
        </section>
      )}

      <div className="template-picker-categories" aria-label="模板分类">
        {categories.map((item) => (
          <button
            type="button"
            key={item}
            className={category === item ? 'is-selected' : ''}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="template-picker-grid">
        {visibleTemplates.map((template) => {
          const selected = template.id === selectedTemplateId
          return (
            <button
              type="button"
              key={template.id}
              className={selected ? 'template-picker-card is-selected' : 'template-picker-card'}
              onClick={() => chooseTemplate(template)}
              aria-pressed={selected}
            >
              <span className="template-picker-media">
                <img src={template.image} alt="" />
                {selected && <i><Check size={15} /> 当前模板</i>}
              </span>
              <span className="template-picker-copy">
                <strong>{template.title}</strong>
                <small>{template.scenario}</small>
                <em>
                  {template.duration} · {template.ratio}
                  <b><Coins size={13} /> {template.cost}</b>
                </em>
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

