import {
  FileVideo,
  ImagePlus,
  Library,
  WandSparkles,
} from 'lucide-react'
import { useEffect } from 'react'

import { trackProductEvent } from '../analytics'
import { templates } from '../prototypeData'

type HomeViewProps = {
  onBrowseTemplates: () => void
  onPreview: (title: string, image: string) => void
  onStartCreating: () => void
  onUseTemplate: (templateId: string) => void
}

export function HomeView({
  onBrowseTemplates,
  onPreview,
  onStartCreating,
  onUseTemplate,
}: HomeViewProps) {
  useEffect(() => trackProductEvent('home_opened'), [])
  const primaryTemplate = templates[1]
  const featuredTemplates = [templates[1], templates[0], templates[2], templates[4]]

  return (
    <div className="page-stack home-page">
      <section className="home-entry-panel">
        <div className="home-entry-copy">
          <p className="eyebrow">AI 商品视频</p>
          <h1>一张商品图，生成可投放短视频</h1>
          <p>选择喜欢的风格，上传一张商品图，自动完成镜头、转场和字幕包装。</p>
          <div className="home-entry-actions">
            <button type="button" className="primary-action" onClick={onStartCreating}>
              <ImagePlus size={18} />
              开始创作
            </button>
            <button type="button" className="secondary-action" onClick={onBrowseTemplates}>
              <Library size={18} />
              查看全部模板
            </button>
          </div>
        </div>

        <div className="home-composer-demo" aria-label="商品图生成视频演示">
          <div className="home-demo-bar">
            <span>
              <FileVideo size={15} />
              {primaryTemplate.duration} 商品视频
            </span>
            <em>{primaryTemplate.ratio} · 1080p · {primaryTemplate.duration}</em>
          </div>
          <button type="button" className="home-demo-input" onClick={() => onPreview('输入商品图', primaryTemplate.image)}>
            <img src={primaryTemplate.image} alt="输入商品图" />
            <span>
              <small>第一步</small>
              <strong>上传商品图</strong>
              <em>支持 JPG、PNG</em>
            </span>
          </button>
          <span className="home-demo-flow">
            <WandSparkles size={18} />
            选择风格，一键生成
          </span>
          <button type="button" className="home-demo-output" onClick={() => onUseTemplate(primaryTemplate.id)}>
            <img src={primaryTemplate.image} alt="生成后的电商短视频预览" />
            <span>
              <small>生成效果</small>
              <strong>{primaryTemplate.title}</strong>
              <em>{primaryTemplate.cost} 积分 · 自动保存</em>
            </span>
          </button>
        </div>
      </section>

      <section className="home-template-rack">
        <div className="section-heading">
          <p className="eyebrow">热门模板</p>
          <h2>选择一个成片风格</h2>
          <span>上传商品图即可开始，默认参数已经配好。</span>
        </div>
        <div className="home-template-grid">
          {featuredTemplates.map((template) => (
            <button type="button" key={template.id} className="home-template-card" onClick={() => onUseTemplate(template.id)}>
              <img src={template.image} alt={template.title} />
              <span>
                <small>{template.category}</small>
                <strong>{template.title}</strong>
                <em>{template.cost} 积分 · {template.duration} · {template.ratio}</em>
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
