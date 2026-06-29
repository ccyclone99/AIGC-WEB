import {
  ArrowRight,
  CheckCircle2,
  Coins,
  FileVideo,
  Gift,
  ImagePlus,
  Library,
  ShieldCheck,
  Sparkles,
  TimerReset,
  WandSparkles,
} from 'lucide-react'

import { templates } from '../prototypeData'
import type { AuthMode, ViewId } from '../types'

type HomeViewProps = {
  creditBalance: number
  onAuth: (mode: AuthMode) => void
  onNavigate: (view: ViewId) => void
  onOpenTemplate: (templateId: string) => void
  onPreview: (title: string, image: string) => void
  onStartMaking: (templateId: string) => void
}

export function HomeView({
  creditBalance,
  onAuth,
  onNavigate,
  onOpenTemplate,
  onPreview,
  onStartMaking,
}: HomeViewProps) {
  const primaryTemplate = templates[1]
  const featuredTemplates = [templates[1], templates[0], templates[2], templates[4]]
  const routeItems: Array<{ title: string; text: string; Icon: typeof Sparkles; view: ViewId }> = [
    { title: '模板生成', text: '选择模板，上传图片后生成视频。', Icon: Sparkles, view: 'templates' },
    { title: '生产台', text: '继续制作并查看生成进度。', Icon: FileVideo, view: 'workbench' },
    { title: '资产库', text: '管理商品图、输出视频和分类。', Icon: ShieldCheck, view: 'me' },
  ]

  return (
    <div className="page-stack home-page">
      <section className="home-entry-panel">
        <div className="home-entry-copy">
          <p className="eyebrow">电商视频生成平台</p>
          <h1>电商视频，从一张商品图开始</h1>
          <p>选择适合商品的模板，上传一张主图，即可生成适合投放、详情页和内容种草的短视频。</p>
          <div className="home-entry-actions">
            <button type="button" className="primary-action" onClick={() => onStartMaking(primaryTemplate.id)}>
              <ImagePlus size={18} />
              上传商品图
            </button>
            <button type="button" className="secondary-action" onClick={() => onNavigate('templates')}>
              <Library size={18} />
              浏览模板
            </button>
            <button type="button" className="secondary-action" onClick={() => onAuth('register')}>
              <Gift size={18} />
              领积分
            </button>
          </div>
          <div className="home-kpi-row" aria-label="平台能力">
            <span>
              <strong>1 张图</strong>
              首版核心输入
            </span>
            <span>
              <strong>{creditBalance.toLocaleString()}</strong>
              当前可用积分
            </span>
            <span>
              <strong>继续制作</strong>
              生成中可继续操作
            </span>
          </div>
        </div>

        <div className="home-composer-demo" aria-label="商品图生成视频演示">
          <div className="home-demo-bar">
            <span>
              <FileVideo size={15} />
              生成示例
            </span>
            <em>{primaryTemplate.ratio} · 1080p · {primaryTemplate.duration}</em>
          </div>
          <button type="button" className="home-demo-input" onClick={() => onPreview('输入商品图', primaryTemplate.image)}>
            <img src={primaryTemplate.image} alt="输入商品图" />
            <span>
              <small>输入素材</small>
              <strong>商品主图</strong>
              <em>来自资产库或本地上传</em>
            </span>
          </button>
          <span className="home-demo-flow">
            <WandSparkles size={18} />
            自动生成视频
          </span>
          <button type="button" className="home-demo-output" onClick={() => onOpenTemplate(primaryTemplate.id)}>
            <img src={primaryTemplate.image} alt="生成后的电商短视频预览" />
            <span>
              <small>输出结果</small>
              <strong>{primaryTemplate.title}</strong>
              <em>{primaryTemplate.cost} 积分 · 生成后入库</em>
            </span>
          </button>
          <div className="home-demo-status">
            <span>
              <CheckCircle2 size={15} />
              校验通过
            </span>
            <span>
              <TimerReset size={15} />
              进入队列
            </span>
            <span>
              <Coins size={15} />
              预扣冻结
            </span>
          </div>
        </div>
      </section>

      <section className="home-route-strip" aria-label="主要流程">
        {routeItems.map(({ title, text, Icon, view }) => (
          <button type="button" key={title} onClick={() => onNavigate(view)}>
            <Icon size={19} />
            <span>
              <strong>{title}</strong>
              <small>{text}</small>
            </span>
            <ArrowRight size={17} />
          </button>
        ))}
      </section>

      <section className="home-template-rack">
        <div className="section-heading">
          <p className="eyebrow">热门模板</p>
          <h2>优先开放的模板场景</h2>
          <span>选择常用场景，上传商品图即可开始。</span>
        </div>
        <div className="home-template-grid">
          {featuredTemplates.map((template) => (
            <button type="button" key={template.id} className="home-template-card" onClick={() => onOpenTemplate(template.id)}>
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
