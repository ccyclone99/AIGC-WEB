import { useMemo, useState, type CSSProperties, type ChangeEvent, type ReactNode } from 'react'
import {
  AlertTriangle,
  ArrowUpRight,
  Archive,
  CheckCircle2,
  ChevronRight,
  Clock3,
  ClipboardCheck,
  Coins,
  Download,
  FileVideo,
  Filter,
  Gauge,
  Gift,
  ImagePlus,
  Images,
  LayoutDashboard,
  Library,
  LockKeyhole,
  PackageCheck,
  PencilLine,
  Play,
  QrCode,
  RefreshCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  TimerReset,
  TrendingUp,
  Trash2,
  Upload,
  UserRound,
  Wallet,
  WandSparkles,
  X,
  Zap,
} from 'lucide-react'
import './App.css'

type ViewId = 'home' | 'workbench' | 'templates' | 'tasks' | 'me'
type WorkbenchMode = 'overview' | 'create'
type OverlayType = 'template' | 'task' | 'credits' | 'filters' | 'lightbox' | 'auth' | null
type TaskStatus = 'queued' | 'running' | 'rendering' | 'review' | 'success' | 'refunded'
type AuthMode = 'login' | 'register'
type OutputSettingKey = 'ratio' | 'duration' | 'resolution' | 'quality'
type AssetKind = 'image' | 'video' | 'portrait' | 'poster' | 'logo'
type AssetStatus = 'library' | 'archived'
type AssetFilter = '全部' | '图片' | '视频' | '即将过期' | '已归档'

type OutputSettings = {
  ratio: string
  duration: string
  resolution: string
  quality: string
}

type Template = {
  id: string
  title: string
  category: string
  scenario: string
  image: string
  cost: number
  duration: string
  ratio: string
  accent: string
  tags: string[]
  description: string
}

type Task = {
  id: string
  title: string
  status: TaskStatus
  progress: number
  cost: number
  updated: string
  image: string
  params?: OutputSettings & {
    templateId: string
    imageId: string
  }
}

type Asset = {
  id: string
  name: string
  type: string
  kind: AssetKind
  image: string
  expires: string
  status: AssetStatus
  source: string
}

type LedgerRow = {
  title: string
  amount: string
  source: string
}

type ToastState = {
  title: string
  text: string
} | null

const templates: Template[] = [
  {
    id: 'watch',
    title: '精品表款 8 秒转场',
    category: '商品图成片',
    scenario: '高客单商品',
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
    cost: 168,
    duration: '8s',
    ratio: '9:16',
    accent: '#d54f38',
    tags: ['主图', '质感', '礼赠'],
    description: '适合手表、香氛、礼盒和小家电，强调材质、光影和镜头节奏。',
  },
  {
    id: 'sneaker',
    title: '潮鞋爆款节奏',
    category: '电商短视频',
    scenario: '短视频投放',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    cost: 138,
    duration: '6s',
    ratio: '1:1',
    accent: '#0f9d7a',
    tags: ['抖音', '快节奏', '字幕'],
    description: '用快速切换、字幕节奏和平台比例生成适合投放的商品短视频。',
  },
  {
    id: 'beauty',
    title: '美妆成分展示',
    category: '商品图成片',
    scenario: '小红书种草',
    image:
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
    cost: 198,
    duration: '10s',
    ratio: '4:5',
    accent: '#6f55d9',
    tags: ['小红书', '柔光', '成分'],
    description: '适合护肤、美妆和香氛，将成分、功效、场景感封装进模板。',
  },
  {
    id: 'portrait',
    title: '都市写真换装',
    category: '人像写真',
    scenario: '写真/变装',
    image:
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
    cost: 228,
    duration: '8s',
    ratio: '9:16',
    accent: '#c08a22',
    tags: ['人像', '换装', '授权'],
    description: '上传人像照片，选择服装和风格方向，生成写真感短视频。',
  },
  {
    id: 'bag',
    title: '包袋细节巡游',
    category: '商品图成片',
    scenario: '详情页增强',
    image:
      'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=900&q=80',
    cost: 176,
    duration: '9s',
    ratio: '4:5',
    accent: '#3157a4',
    tags: ['详情页', '局部', '高级'],
    description: '围绕材质、五金、容量和细节生成适合详情页的商品展示视频。',
  },
  {
    id: 'coffee',
    title: '食品饮品氛围片',
    category: '电商短视频',
    scenario: '生活方式',
    image:
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80',
    cost: 156,
    duration: '7s',
    ratio: '9:16',
    accent: '#8b5a2b',
    tags: ['食品', '氛围', '转场'],
    description: '给食品、咖啡、茶饮类商品增加场景氛围和轻量字幕包装。',
  },
  {
    id: 'video-polish',
    title: '已有视频投放翻新',
    category: '视频模板',
    scenario: '素材二创',
    image:
      'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?auto=format&fit=crop&w=900&q=80',
    cost: 188,
    duration: '12s',
    ratio: '9:16',
    accent: '#2f6f73',
    tags: ['视频输入', '投放', '字幕'],
    description: '上传已有商品视频，自动重排节奏、补字幕、加卖点卡点，生成适合投放的新版本。',
  },
  {
    id: 'talking-cut',
    title: '口播视频切片包装',
    category: '视频模板',
    scenario: '达人/直播切片',
    image:
      'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=900&q=80',
    cost: 166,
    duration: '15s',
    ratio: '9:16',
    accent: '#b35b7b',
    tags: ['口播', '字幕', '切片'],
    description: '上传口播或直播片段，自动提炼高光、生成字幕和标题包装，适合达人种草内容。',
  },
  {
    id: 'video-product-card',
    title: '视频素材商品卡包装',
    category: '视频模板',
    scenario: '详情页/投流',
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
    cost: 178,
    duration: '10s',
    ratio: '4:5',
    accent: '#5867a8',
    tags: ['视频输入', '商品卡', '后期'],
    description: '上传一段商品实拍视频，模板自动增加商品信息卡、价格位、字幕和转场包装。',
  },
]

const initialTasks: Task[] = [
  {
    id: 'T-240625-019',
    title: '潮鞋爆款节奏',
    status: 'rendering',
    progress: 72,
    cost: 138,
    updated: '2 分钟前',
    image: templates[1].image,
  },
  {
    id: 'T-240625-018',
    title: '精品表款 8 秒转场',
    status: 'success',
    progress: 100,
    cost: 168,
    updated: '18 分钟前',
    image: templates[0].image,
  },
  {
    id: 'T-240625-017',
    title: '美妆成分展示',
    status: 'refunded',
    progress: 100,
    cost: 198,
    updated: '42 分钟前',
    image: templates[2].image,
  },
]

const initialAssets: Asset[] = [
  {
    id: 'A-WATCH-MAIN',
    name: 'watch-main.jpg',
    type: '商品主图',
    kind: 'image',
    image: templates[0].image,
    expires: '永久保存',
    status: 'library',
    source: '用户上传',
  },
  {
    id: 'A-SNEAKER-OUTPUT',
    name: 'sneaker-output.mp4',
    type: '生成视频',
    kind: 'video',
    image: templates[1].image,
    expires: '29 天后过期',
    status: 'library',
    source: '任务输出',
  },
  {
    id: 'A-PORTRAIT-REF',
    name: 'portrait-ref.jpg',
    type: '人像素材',
    kind: 'portrait',
    image: templates[3].image,
    expires: '需授权复用',
    status: 'library',
    source: '用户上传',
  },
]

const initialLedgerRows: LedgerRow[] = [
  { title: '潮鞋任务冻结', amount: '-138', source: '预扣冻结' },
  { title: '精品表款生成成功', amount: '-168', source: '任务结算' },
  { title: '美妆任务失败释放', amount: '+198', source: '失败退回' },
  { title: '新用户注册赠送', amount: '+300', source: '活动赠送' },
]

const activeStatuses: TaskStatus[] = ['queued', 'running', 'rendering', 'review']

const rechargePackages = [
  { name: '入门包', price: '¥29', credits: 300, bonus: '适合轻量试用' },
  { name: '标准包', price: '¥99', credits: 1200, bonus: '电商日常推荐' },
  { name: '增长包', price: '¥299', credits: 4000, bonus: '含团队试跑额度' },
]

const filterGroups = [
  { title: '内容类型', items: ['商品图成片', '电商短视频', '视频模板', '人像写真'] },
  { title: '输出比例', items: ['9:16', '4:5', '1:1'] },
  { title: '积分区间', items: ['100-150', '150-200', '200+'] },
]

const templateInputLabel = (template: Template) => {
  if (template.category === '人像写真') return '人像照片'
  if (template.category === '视频模板') return '视频素材'
  return '只需图片'
}

const outputDefaultsForTemplate = (template: Template): OutputSettings => ({
  ratio: template.ratio,
  duration: template.duration,
  resolution: '1080p',
  quality: '高清',
})

const outputOptionGroups: Array<{
  key: OutputSettingKey
  label: string
  options: string[]
  hint: string
}> = [
  { key: 'ratio', label: '画面比例', options: ['9:16', '4:5', '1:1', '16:9'], hint: '按投放平台选择。' },
  { key: 'duration', label: '视频长度', options: ['6s', '8s', '10s', '12s'], hint: '越长越适合展示细节。' },
  { key: 'resolution', label: '图片分辨率', options: ['720p', '1080p', '2K'], hint: '默认 1080p。' },
  { key: 'quality', label: '清晰度', options: ['标准', '高清', '超清'], hint: '超清优先保证细节。' },
]

const assetFilters: AssetFilter[] = ['全部', '图片', '视频', '即将过期', '已归档']
const maxUploadSize = 8 * 1024 * 1024

const canUseAssetForGeneration = (asset: Asset) =>
  asset.status === 'library' && ['image', 'portrait', 'logo'].includes(asset.kind)

const isExpiringAsset = (asset: Asset) => asset.expires.includes('天后过期') || asset.expires.includes('即将过期')

function App() {
  const [activeView, setActiveView] = useState<ViewId>('home')
  const [workbenchMode, setWorkbenchMode] = useState<WorkbenchMode>('overview')
  const [overlay, setOverlay] = useState<OverlayType>(null)
  const [selectedTemplateId, setSelectedTemplateId] = useState('watch')
  const [studioTemplateId, setStudioTemplateId] = useState('watch')
  const [selectedTaskId, setSelectedTaskId] = useState(initialTasks[0].id)
  const [outputSettings, setOutputSettings] = useState<OutputSettings>(() => outputDefaultsForTemplate(templates[0]))
  const [selectedStudioAssetId, setSelectedStudioAssetId] = useState(initialAssets[0].id)
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [authMode, setAuthMode] = useState<AuthMode>('login')
  const [creditBalance, setCreditBalance] = useState(1280)
  const [frozenCredits, setFrozenCredits] = useState(138)
  const [demoTasks, setDemoTasks] = useState<Task[]>(initialTasks)
  const [demoAssets, setDemoAssets] = useState<Asset[]>(initialAssets)
  const [demoLedgerRows, setDemoLedgerRows] = useState<LedgerRow[]>(initialLedgerRows)
  const [toast, setToast] = useState<ToastState>(null)
  const [previewMedia, setPreviewMedia] = useState({
    title: templates[0].title,
    image: templates[0].image,
  })

  const selectedTemplate = useMemo(
    () => templates.find((template) => template.id === selectedTemplateId) ?? templates[0],
    [selectedTemplateId],
  )

  const selectedStudioTemplate = useMemo(
    () => templates.find((template) => template.id === studioTemplateId) ?? templates[0],
    [studioTemplateId],
  )

  const selectedTask = useMemo(
    () => demoTasks.find((task) => task.id === selectedTaskId) ?? demoTasks[0],
    [demoTasks, selectedTaskId],
  )

  const reusableAssets = useMemo(() => demoAssets.filter(canUseAssetForGeneration), [demoAssets])

  const filteredTemplates = useMemo(() => {
    const trimmedSearch = searchTerm.trim().toLowerCase()

    return templates.filter((template) => {
      const textMatch =
        !trimmedSearch ||
        [template.title, template.category, template.scenario, ...template.tags]
          .join(' ')
          .toLowerCase()
          .includes(trimmedSearch)

      const filterMatch =
        selectedFilters.length === 0 ||
        selectedFilters.some((filter) => {
          if (filter === '100-150') return template.cost >= 100 && template.cost <= 150
          if (filter === '150-200') return template.cost > 150 && template.cost <= 200
          if (filter === '200+') return template.cost > 200
          return (
            template.category === filter ||
            template.ratio === filter ||
            template.tags.includes(filter) ||
            template.scenario.includes(filter)
          )
        })

      return textMatch && filterMatch
    })
  }, [searchTerm, selectedFilters])

  const openTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId)
    setOverlay('template')
  }

  const goToView = (view: ViewId) => {
    setActiveView(view)
    if (view === 'workbench') setWorkbenchMode('overview')
  }

  const openStudio = (templateId = studioTemplateId) => {
    const nextTemplate = templates.find((template) => template.id === templateId) ?? templates[0]
    setStudioTemplateId(templateId)
    setSelectedTemplateId(templateId)
    setOutputSettings(outputDefaultsForTemplate(nextTemplate))
    setOverlay(null)
    setActiveView('workbench')
    setWorkbenchMode('create')
  }

  const openTask = (taskId: string) => {
    setSelectedTaskId(taskId)
    setOverlay('task')
  }

  const openPreview = (title: string, image: string) => {
    setPreviewMedia({ title, image })
    setOverlay('lightbox')
  }

  const closeOverlay = () => setOverlay(null)

  const addLedgerRow = (row: LedgerRow) => {
    setDemoLedgerRows((current) => [row, ...current].slice(0, 6))
  }

  const addUploadedAsset = (file: File, source: string, useInStudio = false) => {
    if (!file.type.startsWith('image/')) {
      setToast({ title: '文件格式不支持', text: '第一版只支持上传 PNG、JPG、WebP 等图片文件。' })
      return
    }

    if (file.size > maxUploadSize) {
      setToast({ title: '文件过大', text: '单张图片请控制在 8MB 以内，后续可按套餐放开限制。' })
      return
    }

    const nextAsset: Asset = {
      id: `A-UP-${Date.now()}`,
      name: file.name || 'uploaded-product-image.jpg',
      type: '商品主图',
      kind: 'image',
      image: URL.createObjectURL(file),
      expires: '永久保存',
      status: 'library',
      source,
    }

    setDemoAssets((current) => [nextAsset, ...current])
    if (useInStudio) setSelectedStudioAssetId(nextAsset.id)
    setToast({ title: '素材已加入资产库', text: `${nextAsset.name} 可直接用于生成视频。` })
  }

  const renameAsset = (assetId: string) => {
    const asset = demoAssets.find((item) => item.id === assetId)
    if (!asset) return

    const nextName = window.prompt('重命名资产', asset.name)?.trim()
    if (!nextName || nextName === asset.name) return

    setDemoAssets((current) => current.map((item) => (item.id === assetId ? { ...item, name: nextName } : item)))
    setToast({ title: '资产已重命名', text: nextName })
  }

  const archiveAsset = (assetId: string) => {
    const asset = demoAssets.find((item) => item.id === assetId)
    if (!asset) return

    setDemoAssets((current) =>
      current.map((item) => (item.id === assetId ? { ...item, status: 'archived' } : item)),
    )

    if (selectedStudioAssetId === assetId) {
      const nextReusable = demoAssets.find((item) => item.id !== assetId && canUseAssetForGeneration(item))
      setSelectedStudioAssetId(nextReusable?.id ?? '')
    }

    setToast({ title: '资产已归档', text: '归档不会破坏历史任务追溯，可在资产库筛选中恢复。' })
  }

  const restoreAsset = (assetId: string) => {
    const asset = demoAssets.find((item) => item.id === assetId)
    if (!asset) return

    setDemoAssets((current) => current.map((item) => (item.id === assetId ? { ...item, status: 'library' } : item)))
    setToast({ title: '资产已恢复', text: `${asset.name} 已回到资产库。` })
  }

  const downloadAsset = (assetId: string) => {
    const asset = demoAssets.find((item) => item.id === assetId)
    if (!asset) return

    const link = document.createElement('a')
    link.href = asset.image
    link.download = asset.name
    link.target = '_blank'
    document.body.append(link)
    link.click()
    link.remove()
    setToast({ title: '下载已触发', text: `${asset.name} 使用当前资源地址下载。` })
  }

  const reuseAsset = (assetId: string) => {
    const asset = demoAssets.find((item) => item.id === assetId)
    if (!asset || !canUseAssetForGeneration(asset)) {
      setToast({ title: '不能复用该资产', text: '当前模板需要图片类素材，生成视频或归档素材不能直接作为输入。' })
      return
    }

    setSelectedStudioAssetId(asset.id)
    setActiveView('workbench')
    setWorkbenchMode('create')
    setOverlay(null)
    setToast({ title: '已带入制作页', text: `${asset.name} 已作为当前商品图。` })
  }

  const downloadTaskResult = (taskId: string) => {
    const task = demoTasks.find((item) => item.id === taskId)
    if (!task || task.status !== 'success') {
      setToast({ title: '暂不可下载', text: '任务完成后才会生成可下载结果。' })
      return
    }

    const outputAsset = demoAssets.find((asset) => asset.id === `A-OUT-${task.id}`)
    const link = document.createElement('a')
    link.href = outputAsset?.image ?? task.image
    link.download = outputAsset?.name ?? `${task.id.toLowerCase()}-output.mp4`
    link.target = '_blank'
    document.body.append(link)
    link.click()
    link.remove()
    setToast({ title: '结果下载已触发', text: outputAsset?.name ?? `${task.id.toLowerCase()}-output.mp4` })
  }

  const openAssetLibrary = () => {
    setOverlay(null)
    setActiveView('me')
    setWorkbenchMode('overview')
  }

  const updateOutputSetting = (key: OutputSettingKey, value: string) => {
    setOutputSettings((current) => ({ ...current, [key]: value }))
  }

  const openAuth = (mode: AuthMode) => {
    setAuthMode(mode)
    setOverlay('auth')
  }

  const toggleFilter = (filter: string) => {
    setSelectedFilters((current) =>
      current.includes(filter) ? current.filter((item) => item !== filter) : [...current, filter],
    )
  }

  const submitBatchGeneration = () => {
    const selectedAsset = selectedStudioAssetId
      ? reusableAssets.find((asset) => asset.id === selectedStudioAssetId)
      : undefined
    const totalCost = selectedStudioTemplate.cost

    if (!selectedAsset) {
      setToast({ title: '缺少图片', text: '请先上传或选择一张图片后再生成视频。' })
      return
    }

    if (creditBalance < totalCost) {
      setToast({ title: '积分不足', text: `本次预计冻结 ${totalCost} 积分，请先充值或选择更低积分模板。` })
      setOverlay('credits')
      return
    }

    const newTask: Task = {
      id: `T-IMAGE-${String(demoTasks.length + 1).padStart(3, '0')}`,
      title: `${selectedStudioTemplate.title} · ${selectedAsset.name}`,
      status: 'queued',
      progress: 8,
      cost: totalCost,
      updated: '刚刚',
      image: selectedAsset.image,
      params: {
        templateId: selectedStudioTemplate.id,
        imageId: selectedAsset.id,
        ...outputSettings,
      },
    }

    setDemoTasks((current) => [newTask, ...current])
    setSelectedTaskId(newTask.id)
    setCreditBalance((current) => current - totalCost)
    setFrozenCredits((current) => current + totalCost)
    addLedgerRow({
      title: `${selectedAsset.name} 图片生成冻结`,
      amount: `-${totalCost}`,
      source: selectedStudioTemplate.title,
    })
    setActiveView('tasks')
    setWorkbenchMode('overview')
    setToast({
      title: '任务已提交',
      text: `已使用 1 张图片创建视频任务，${outputSettings.ratio} · ${outputSettings.duration} · ${outputSettings.resolution}，预计冻结 ${totalCost} 积分。`,
    })
  }

  const completeTask = (task: Task) => {
    setFrozenCredits((current) => Math.max(0, current - task.cost))
    addLedgerRow({
      title: `${task.title} 生成成功`,
      amount: '结算',
      source: task.id,
    })
    setDemoAssets((current) => [
      {
        id: `A-OUT-${task.id}`,
        name: `${task.id.toLowerCase()}-output.mp4`,
        type: '生成视频',
        kind: 'video',
        image: task.image,
        expires: '30 天后过期',
        status: 'library',
        source: task.id,
      },
      ...current,
    ])
    setToast({ title: '任务已完成', text: `${task.title} 已生成，可预览或进入资产库。` })
  }

  const advanceTask = (taskId: string) => {
    const task = demoTasks.find((item) => item.id === taskId)
    if (!task || !activeStatuses.includes(task.status)) return

    const nextByStatus: Record<TaskStatus, Pick<Task, 'status' | 'progress' | 'updated'>> = {
      queued: { status: 'running', progress: 26, updated: '刚刚' },
      running: { status: 'rendering', progress: 64, updated: '刚刚' },
      rendering: { status: 'review', progress: 88, updated: '刚刚' },
      review: { status: 'success', progress: 100, updated: '刚刚' },
      success: { status: 'success', progress: 100, updated: task.updated },
      refunded: { status: 'refunded', progress: 100, updated: task.updated },
    }
    const next = nextByStatus[task.status]

    setDemoTasks((current) => current.map((item) => (item.id === taskId ? { ...item, ...next } : item)))

    if (next.status === 'success') {
      completeTask({ ...task, ...next })
      return
    }

    setToast({
      title: '任务状态已推进',
      text: `${task.title} 已进入「${taskStatus({ ...task, ...next }).label}」。`,
    })
  }

  const refundTask = (taskId: string) => {
    const task = demoTasks.find((item) => item.id === taskId)
    if (!task || !activeStatuses.includes(task.status)) return

    setDemoTasks((current) =>
      current.map((item) =>
        item.id === taskId ? { ...item, status: 'refunded', progress: 100, updated: '刚刚' } : item,
      ),
    )
    setFrozenCredits((current) => Math.max(0, current - task.cost))
    setCreditBalance((current) => current + task.cost)
    addLedgerRow({
      title: `${task.title} 失败释放`,
      amount: `+${task.cost}`,
      source: task.id,
    })
    setToast({ title: '积分已释放', text: `${task.cost} 积分已退回可用余额。` })
  }

  const rechargeCredits = (pack: (typeof rechargePackages)[number]) => {
    setCreditBalance((current) => current + pack.credits)
    addLedgerRow({
      title: `${pack.name} 模拟充值`,
      amount: `+${pack.credits}`,
      source: '充值到账',
    })
    setToast({ title: '充值已模拟到账', text: `${pack.credits} 积分已加入当前余额。` })
  }

  const grantSignupCredits = () => {
    setCreditBalance((current) => current + 300)
    addLedgerRow({ title: '新用户注册赠送', amount: '+300', source: '活动赠送' })
    setOverlay(null)
    setToast({ title: '注册赠送已到账', text: '300 积分已加入当前账户，后续会接入真实风控策略。' })
  }

  return (
    <main className="app-shell">
      <TopBar
        activeView={activeView}
        creditBalance={creditBalance}
        onNavigate={goToView}
        onCredits={() => setOverlay('credits')}
      />
      <section className="view-shell">
        {activeView === 'home' && (
          <HomeView
            creditBalance={creditBalance}
            onAuth={openAuth}
            onNavigate={goToView}
            onOpenTemplate={openTemplate}
            onPreview={openPreview}
            onStartMaking={openStudio}
          />
        )}
        {activeView === 'workbench' && workbenchMode === 'overview' && (
          <WorkbenchView
            assets={demoAssets.filter((asset) => asset.status === 'library')}
            creditBalance={creditBalance}
            frozenCredits={frozenCredits}
            tasks={demoTasks}
            onCredits={() => setOverlay('credits')}
            onNavigate={goToView}
            onOpenTask={openTask}
            onOpenTemplate={openTemplate}
            onPreview={openPreview}
          />
        )}
        {activeView === 'workbench' && workbenchMode === 'create' && (
          <StudioPage
            assets={reusableAssets}
            creditBalance={creditBalance}
            outputSettings={outputSettings}
            selectedAssetId={selectedStudioAssetId}
            template={selectedStudioTemplate}
            templates={templates}
            onAssetSelect={setSelectedStudioAssetId}
            onOutputSettingChange={updateOutputSetting}
            onPreview={openPreview}
            onSubmit={submitBatchGeneration}
            onUpload={(file) => addUploadedAsset(file, '制作页上传', true)}
            onTemplateChange={(templateId) => {
              const nextTemplate = templates.find((template) => template.id === templateId) ?? templates[0]
              setStudioTemplateId(templateId)
              setSelectedTemplateId(templateId)
              setOutputSettings(outputDefaultsForTemplate(nextTemplate))
            }}
          />
        )}
        {activeView === 'templates' && (
          <TemplatesView
            searchTerm={searchTerm}
            selectedFilters={selectedFilters}
            templates={filteredTemplates}
            onFilter={() => setOverlay('filters')}
            onOpenTemplate={openTemplate}
            onPreview={() => openPreview(selectedTemplate.title, selectedTemplate.image)}
            onSearch={setSearchTerm}
          />
        )}
        {activeView === 'tasks' && <TasksView tasks={demoTasks} onOpenTask={openTask} />}
        {activeView === 'me' && (
          <MeView
            assets={demoAssets}
            creditBalance={creditBalance}
            frozenCredits={frozenCredits}
            onArchiveAsset={archiveAsset}
            onAuth={openAuth}
            onCredits={() => setOverlay('credits')}
            onDownloadAsset={downloadAsset}
            onPreview={openPreview}
            onRenameAsset={renameAsset}
            onRestoreAsset={restoreAsset}
            onReuseAsset={reuseAsset}
            onUploadAsset={(file) => addUploadedAsset(file, '资产库上传', false)}
          />
        )}
      </section>

      {overlay === 'template' && (
        <Modal title={selectedTemplate.title} onClose={closeOverlay}>
          <TemplateDetail
            template={selectedTemplate}
            onCreate={() => {
              if (selectedTemplate.category === '视频模板') {
                setToast({
                  title: '视频模板制作页预留',
                  text: '当前原型先展示视频类模板，下一步再补视频上传、字幕包装和剪辑参数。',
                })
                return
              }

              openStudio(selectedTemplate.id)
            }}
            onPreview={() => openPreview(selectedTemplate.title, selectedTemplate.image)}
          />
        </Modal>
      )}

      {overlay === 'task' && (
        <Drawer title="任务详情" onClose={closeOverlay}>
          <TaskDetail
            task={selectedTask}
            onAdvance={advanceTask}
            onDownload={() => downloadTaskResult(selectedTask.id)}
            onOpenAssets={openAssetLibrary}
            onPreview={() => openPreview(selectedTask.title, selectedTask.image)}
            onRefund={refundTask}
          />
        </Drawer>
      )}

      {overlay === 'credits' && (
        <Modal title="积分与充值" onClose={closeOverlay} size="small">
          <CreditPanel
            balance={creditBalance}
            frozenCredits={frozenCredits}
            ledgerRows={demoLedgerRows}
            onRecharge={rechargeCredits}
            onToast={setToast}
          />
        </Modal>
      )}

      {overlay === 'auth' && (
        <Modal title={authMode === 'register' ? '注册领取积分' : '登录方式'} onClose={closeOverlay} size="small">
          <AuthPanel
            mode={authMode}
            onGrantSignupCredits={grantSignupCredits}
            onModeChange={setAuthMode}
            onToast={setToast}
          />
        </Modal>
      )}

      {overlay === 'filters' && (
        <Sheet title="筛选模板" onClose={closeOverlay}>
          <FilterPanel
            selectedFilters={selectedFilters}
            onApply={() => {
              setOverlay(null)
              setToast({ title: '筛选已应用', text: `当前匹配 ${filteredTemplates.length} 个模板。` })
            }}
            onToggle={toggleFilter}
          />
        </Sheet>
      )}

      {overlay === 'lightbox' && (
        <Lightbox title={previewMedia.title} image={previewMedia.image} onClose={closeOverlay} />
      )}

      {toast && <Toast toast={toast} onClose={() => setToast(null)} />}
    </main>
  )
}

function TopBar({
  activeView,
  creditBalance,
  onNavigate,
  onCredits,
}: {
  activeView: ViewId
  creditBalance: number
  onNavigate: (view: ViewId) => void
  onCredits: () => void
}) {
  const navItems: Array<{ id: ViewId; label: string }> = [
    { id: 'home', label: '首页' },
    { id: 'workbench', label: '工作台' },
    { id: 'templates', label: '模板' },
    { id: 'tasks', label: '任务' },
    { id: 'me', label: '我的' },
  ]

  return (
    <header className="topbar">
      <button type="button" className="brand-lockup" onClick={() => onNavigate('home')}>
        <span className="brand-mark">
          <Sparkles size={19} />
        </span>
        <span>
          <strong>AIGC Studio</strong>
          <small>商品图生成短视频</small>
        </span>
      </button>
      <nav className="top-links" aria-label="主导航">
        {navItems.map((item) => (
          <button
            type="button"
            key={item.id}
            className={activeView === item.id ? 'top-link is-active' : 'top-link'}
            onClick={() => onNavigate(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <div className="account-cluster">
        <button type="button" className="credit-pill" onClick={onCredits}>
          <Coins size={17} />
          <span>{creditBalance.toLocaleString()}</span>
        </button>
        <button type="button" className="avatar-button" onClick={() => onNavigate('me')} aria-label="账户">
          <UserRound size={18} />
        </button>
      </div>
    </header>
  )
}

function HomeView({
  creditBalance,
  onAuth,
  onNavigate,
  onOpenTemplate,
  onPreview,
  onStartMaking,
}: {
  creditBalance: number
  onAuth: (mode: AuthMode) => void
  onNavigate: (view: ViewId) => void
  onOpenTemplate: (templateId: string) => void
  onPreview: (title: string, image: string) => void
  onStartMaking: (templateId: string) => void
}) {
  return (
    <div className="page-stack home-page">
      <section className="home-hero">
        <div className="home-hero-copy">
          <p className="eyebrow">AIGC TEMPLATE STUDIO</p>
          <h1>上传一张商品图，生成一条电商短视频</h1>
          <p>模板已经封装好模型、镜头、字幕、比例、积分和失败兜底。第一版先把“一张图生成视频”做到足够简单。</p>
          <div className="hero-actions">
            <button type="button" className="primary-action" onClick={() => onStartMaking('watch')}>
              <ImagePlus size={18} />
              开始制作
            </button>
            <button type="button" className="secondary-action" onClick={() => onNavigate('templates')}>
              <Sparkles size={18} />
              浏览模板
            </button>
            <button type="button" className="secondary-action" onClick={() => onAuth('register')}>
              <Gift size={18} />
              领积分
            </button>
          </div>
          <div className="home-proof-row">
            <span>
              <strong>1 张图</strong>
              第一版无需文字
            </span>
            <span>
              <strong>{creditBalance.toLocaleString()}</strong>
              演示账户积分
            </span>
            <span>
              <strong>可追溯</strong>
              参数/积分/任务记录
            </span>
          </div>
        </div>
        <div className="home-result-stage" aria-label="商品图生成视频示例">
          <button type="button" className="result-card result-input" onClick={() => onPreview('输入商品图', templates[0].image)}>
            <img src={templates[0].image} alt="输入商品图" />
            <span>
              <small>输入</small>
              <strong>商品主图</strong>
            </span>
          </button>
          <span className="result-bridge">
            <WandSparkles size={18} />
            模板生成
          </span>
          <button type="button" className="result-card result-output" onClick={() => onOpenTemplate('watch')}>
            <img src={templates[1].image} alt="生成后的电商短视频预览" />
            <span>
              <small>输出</small>
              <strong>8 秒电商视频</strong>
            </span>
          </button>
          <div className="result-stage-strip">
            <span>只需图片</span>
            <span>自动镜头</span>
            <span>失败退积分</span>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="section-heading">
          <p className="eyebrow">PRIMARY USE CASES</p>
          <h2>先服务电商，再扩展更多 AIGC 场景</h2>
        </div>
        <div className="home-usecase-grid">
          {[
            ['商品图生成电商短视频', '上传主图和细节图，生成适合抖音/小红书/详情页的完整视频。', 'watch'],
            ['人像照片生成写真/变装视频', '上传人像照片，选择模板和风格，生成写真感短视频。', 'portrait'],
            ['视频素材二创模板', '上传已有商品视频或口播片段，做字幕、卡点、包装和投放翻新。', 'video-polish'],
            ['自由创作能力预留', '未来提供更开放的模型创作入口，但不干扰模板主流程。', 'beauty'],
          ].map(([title, text, templateId]) => (
            <button type="button" key={title} className="home-usecase-card" onClick={() => onOpenTemplate(templateId)}>
              <span className="brand-mark">
                <WandSparkles size={18} />
              </span>
              <strong>{title}</strong>
              <small>{text}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="home-section home-flow-section">
        <div className="section-heading">
          <p className="eyebrow">HOW IT WORKS</p>
          <h2>用户不用写 Prompt</h2>
        </div>
        <div className="home-flow-grid">
          {[
            ['01', '选择模板', '模板预置输入项、比例、模型工作流、价格和兜底策略。'],
            ['02', '上传图片', '第一版模板只需要一张商品图，后续模板再按需增加文案或品牌素材。'],
            ['03', '冻结积分并生成', '任务进入队列，成功结算，失败/超时/审核阻断释放积分。'],
          ].map(([index, title, text]) => (
            <article key={title}>
              <em>{index}</em>
              <strong>{title}</strong>
              <span>{text}</span>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

function WorkbenchView({
  assets,
  creditBalance,
  frozenCredits,
  tasks,
  onCredits,
  onNavigate,
  onOpenTask,
  onOpenTemplate,
  onPreview,
}: {
  assets: Asset[]
  creditBalance: number
  frozenCredits: number
  tasks: Task[]
  onCredits: () => void
  onNavigate: (view: ViewId) => void
  onOpenTask: (taskId: string) => void
  onOpenTemplate: (templateId: string) => void
  onPreview: (title: string, image: string) => void
}) {
  const runningCount = tasks.filter((task) => activeStatuses.includes(task.status)).length
  const successCount = tasks.filter((task) => task.status === 'success').length
  const refundedCount = tasks.filter((task) => task.status === 'refunded').length
  const recentTask = tasks[0] ?? initialTasks[0]

  return (
    <div className="page-stack workbench-page">
      <section className="workbench-hero">
        <div className="workbench-hero-copy">
          <p className="eyebrow">WORKBENCH</p>
          <h1>今天从这里开始生成</h1>
          <p>工作台负责把模板、任务、积分、资产和异常状态串起来，用户登录后不用先理解系统结构。</p>
          <div className="hero-actions">
            <button type="button" className="primary-action" onClick={() => onOpenTemplate('watch')}>
              <WandSparkles size={18} />
              商品图成片
            </button>
            <button type="button" className="secondary-action" onClick={() => onOpenTemplate('portrait')}>
              <UserRound size={18} />
              人像写真/变装
            </button>
          </div>
        </div>
        <button type="button" className="workbench-live-card" onClick={() => onOpenTask(recentTask.id)}>
          <span className="live-card-media">
            <img src={recentTask.image} alt={recentTask.title} />
            <em>{taskStatus(recentTask).label}</em>
          </span>
          <span className="live-card-copy">
            <small>最近任务</small>
            <strong>{recentTask.title}</strong>
            <span>{recentTask.id} · {recentTask.updated}</span>
          </span>
          <span className="progress-track">
            <span style={{ width: `${recentTask.progress}%` }}></span>
          </span>
        </button>
      </section>

      <section className="workbench-stat-grid" aria-label="工作台状态">
        <WorkbenchStat
          icon={Coins}
          label="可用积分"
          value={creditBalance.toLocaleString()}
          text="点击充值或查看账本"
          onClick={onCredits}
        />
        <WorkbenchStat icon={Clock3} label="冻结积分" value={`${frozenCredits}`} text={`${runningCount} 个任务处理中`} />
        <WorkbenchStat icon={TrendingUp} label="已完成" value={`${successCount}`} text="结果可进资产库" />
        <WorkbenchStat icon={ShieldCheck} label="已释放" value={`${refundedCount}`} text="失败会自动退回" />
      </section>

      <section className="workbench-grid">
        <section className="workbench-panel quick-start-panel">
          <div className="panel-heading">
            <span>
              <LayoutDashboard size={18} />
              <strong>快速开始</strong>
            </span>
            <button type="button" onClick={() => onNavigate('templates')}>
              全部模板
              <ArrowUpRight size={16} />
            </button>
          </div>
          <div className="quick-start-grid">
            <button type="button" onClick={() => onOpenTemplate('sneaker')}>
              <ImagePlus size={21} />
              <span>
                <strong>电商短视频</strong>
                <small>上传主图，生成投放素材</small>
              </span>
              <ChevronRight size={17} />
            </button>
            <button type="button" onClick={() => onOpenTemplate('beauty')}>
              <PackageCheck size={21} />
              <span>
                <strong>小红书种草</strong>
                <small>封装成分展示、字幕和比例</small>
              </span>
              <ChevronRight size={17} />
            </button>
            <button type="button" onClick={() => onOpenTemplate('portrait')}>
              <UserRound size={21} />
              <span>
                <strong>写真/变装视频</strong>
                <small>上传人像，选择风格方向</small>
              </span>
              <ChevronRight size={17} />
            </button>
          </div>
        </section>

        <section className="workbench-panel queue-panel">
          <div className="panel-heading">
            <span>
              <Gauge size={18} />
              <strong>生产队列</strong>
            </span>
            <button type="button" onClick={() => onNavigate('tasks')}>
              任务中心
              <ArrowUpRight size={16} />
            </button>
          </div>
          <div className="queue-list">
            {tasks.slice(0, 3).map((task) => (
              <WorkbenchTask key={task.id} task={task} onOpen={onOpenTask} />
            ))}
          </div>
        </section>

        <section className="workbench-panel template-reco-panel">
          <div className="panel-heading">
            <span>
              <Sparkles size={18} />
              <strong>推荐模板</strong>
            </span>
            <span className="panel-note">按电商优先</span>
          </div>
          <div className="workbench-template-list">
            {[templates[0], templates[1], templates.find((template) => template.id === 'video-polish') ?? templates[2]].map((template) => (
              <button
                type="button"
                className="workbench-template-mini"
                key={template.id}
                style={{ '--template-accent': template.accent } as CSSProperties}
                onClick={() => onOpenTemplate(template.id)}
              >
                <img src={template.image} alt={template.title} />
                <span>
                  <small>{template.category}</small>
                  <strong>{template.title}</strong>
                  <em>{template.cost} 积分</em>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="workbench-panel asset-panel">
          <div className="panel-heading">
            <span>
              <Images size={18} />
              <strong>最近资产</strong>
            </span>
            <button type="button" onClick={() => onNavigate('me')}>
              资产库
              <ArrowUpRight size={16} />
            </button>
          </div>
          <div className="workbench-asset-grid">
            {assets.slice(0, 3).map((asset) => (
              <button type="button" key={asset.id} onClick={() => onPreview(asset.name, asset.image)}>
                <img src={asset.image} alt={asset.name} />
                <span>{asset.type}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="workbench-panel credit-risk-panel">
          <div className="panel-heading">
            <span>
              <ShieldCheck size={18} />
              <strong>积分与风控</strong>
            </span>
            <button type="button" onClick={onCredits}>
              去充值
              <ArrowUpRight size={16} />
            </button>
          </div>
          <div className="risk-metrics">
            <span>
              <strong>{frozenCredits}</strong>
              冻结积分
            </span>
            <span>
              <strong>{assets.length}</strong>
              可用资产
            </span>
          </div>
          <div className="submit-checklist compact-checklist">
            <span>
              <CheckCircle2 size={16} />
              每条任务保留模板版本、参数和供应商返回信息
            </span>
            <span>
              <ShieldCheck size={16} />
              失败、超时、审核阻断按规则自动释放积分
            </span>
            <span>
              <LockKeyhole size={16} />
              注册赠送积分会进入活动与反滥用策略
            </span>
          </div>
        </section>
      </section>
    </div>
  )
}

function WorkbenchStat({
  icon: Icon,
  label,
  value,
  text,
  onClick,
}: {
  icon: typeof CheckCircle2
  label: string
  value: string
  text: string
  onClick?: () => void
}) {
  const content = (
    <>
      <Icon size={19} />
      <span>
        <small>{label}</small>
        <strong>{value}</strong>
        <em>{text}</em>
      </span>
    </>
  )

  if (onClick) {
    return (
      <button type="button" className="workbench-stat" onClick={onClick}>
        {content}
      </button>
    )
  }

  return <article className="workbench-stat">{content}</article>
}

function WorkbenchTask({ task, onOpen }: { task: Task; onOpen: (taskId: string) => void }) {
  const status = taskStatus(task)
  const StatusIcon = status.icon

  return (
    <button type="button" className="workbench-task" onClick={() => onOpen(task.id)}>
      <img src={task.image} alt={task.title} />
      <span>
        <strong>{task.title}</strong>
        <small>{task.id} · {task.updated}</small>
      </span>
      <em className={`status-pill status-${task.status}`}>
        <StatusIcon size={15} />
        {status.label}
      </em>
      <span className="progress-track">
        <span style={{ width: `${task.progress}%` }}></span>
      </span>
    </button>
  )
}

function TemplatesView({
  searchTerm,
  selectedFilters,
  templates,
  onFilter,
  onOpenTemplate,
  onPreview,
  onSearch,
}: {
  searchTerm: string
  selectedFilters: string[]
  templates: Template[]
  onFilter: () => void
  onOpenTemplate: (templateId: string) => void
  onPreview: () => void
  onSearch: (value: string) => void
}) {
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
            onChange={(event) => onSearch(event.target.value)}
          />
        </label>
        <button type="button" className="secondary-action filter-action" onClick={onFilter}>
          <Filter size={18} />
          筛选
        </button>
      </section>

      {selectedFilters.length > 0 && (
        <div className="active-filter-row">
          {selectedFilters.map((filter) => (
            <span key={filter}>{filter}</span>
          ))}
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

function TasksView({ tasks, onOpenTask }: { tasks: Task[]; onOpenTask: (taskId: string) => void }) {
  const activeCount = tasks.filter((task) => activeStatuses.includes(task.status)).length
  const successCount = tasks.filter((task) => task.status === 'success').length
  const refundedCount = tasks.filter((task) => task.status === 'refunded').length

  return (
    <div className="page-stack compact-page tasks-page">
      <PageTitle eyebrow="TASKS" title="任务" text="默认只看状态。追溯、参数和诊断进入详情抽屉。" />
      <section className="task-summary-grid">
        <span>
          <strong>{activeCount}</strong>
          处理中
        </span>
        <span>
          <strong>{successCount}</strong>
          已完成
        </span>
        <span>
          <strong>{refundedCount}</strong>
          已释放
        </span>
      </section>
      <section className="task-lifecycle-strip" aria-label="任务生命周期">
        {['排队', '生成', '后期', '审核', '入库'].map((stage) => (
          <span key={stage}>{stage}</span>
        ))}
      </section>
      <section className="task-list">
        {tasks.map((task) => (
          <TaskRow key={task.id} task={task} onOpen={onOpenTask} />
        ))}
      </section>
    </div>
  )
}

function StudioPage({
  assets,
  creditBalance,
  outputSettings,
  selectedAssetId,
  template,
  templates,
  onAssetSelect,
  onOutputSettingChange,
  onPreview,
  onSubmit,
  onTemplateChange,
  onUpload,
}: {
  assets: Asset[]
  creditBalance: number
  outputSettings: OutputSettings
  selectedAssetId: string
  template: Template
  templates: Template[]
  onAssetSelect: (assetId: string) => void
  onOutputSettingChange: (key: OutputSettingKey, value: string) => void
  onPreview: (title: string, image: string) => void
  onSubmit: () => void
  onTemplateChange: (templateId: string) => void
  onUpload: (file: File) => void
}) {
  const selectedAsset = selectedAssetId ? assets.find((asset) => asset.id === selectedAssetId) : undefined
  const totalCost = template.cost
  const canGenerate = Boolean(selectedAsset?.image) && creditBalance >= totalCost
  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0]
    if (file) onUpload(file)
    event.currentTarget.value = ''
  }

  return (
    <div className="studio-page-v3 make-simple-page">
      <section className="make-simple-card" style={{ '--template-accent': template.accent } as CSSProperties}>
        <header className="make-simple-head">
          <div>
            <p className="eyebrow">MAKE VIDEO</p>
            <h1>制作视频</h1>
          </div>
          <span>{template.title} · {outputSettings.ratio} · {outputSettings.duration} · {template.cost} 积分</span>
        </header>

        <div className="make-simple-grid image-only-grid">
          <section className="make-preview-panel image-only-panel">
            <input className="file-input" id="studio-product-upload" type="file" accept="image/*" onChange={handleUpload} />
            {selectedAsset ? (
              <button type="button" className="image-upload-card" onClick={() => onPreview(selectedAsset.name, selectedAsset.image)}>
                <img src={selectedAsset.image} alt={`${selectedAsset.name} 当前商品`} />
                <span className="image-upload-status">
                  <CheckCircle2 size={18} />
                  图片已就绪
                </span>
              </button>
            ) : (
              <label className="image-upload-card image-upload-empty" htmlFor="studio-product-upload">
                <ImagePlus size={34} />
                <strong>上传商品图</strong>
                <span>PNG / JPG / WebP，8MB 以内</span>
              </label>
            )}
          </section>

          <section className="make-form-panel image-only-copy">
            <p className="eyebrow">当前图片</p>
            <h2>{selectedAsset?.name ?? '等待上传商品图'}</h2>
            <p>这个模板会根据图片自动生成视频节奏、镜头运动和基础字幕。第一版先把“一张图生成视频”跑通。</p>
            <div className="studio-asset-state">
              <span>
                <CheckCircle2 size={15} />
                {selectedAsset ? '资产库素材' : '等待素材'}
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
            <div className="make-upload-actions">
              {selectedAsset && (
                <button type="button" className="secondary-action" onClick={() => onPreview(selectedAsset.name, selectedAsset.image)}>
                  <Play size={18} />
                  查看图片
                </button>
              )}
              <label className="secondary-action upload-inline-button" htmlFor="studio-product-upload">
                <Upload size={18} />
                {selectedAsset ? '替换图片' : '上传图片'}
              </label>
              {selectedAsset && (
                <button type="button" className="secondary-action" onClick={() => onAssetSelect('')}>
                  <X size={18} />
                  移除选择
                </button>
              )}
            </div>

            <details className="make-switcher-panel">
              <summary>
                <Images size={17} />
                更换图片或模板
              </summary>

              <div className="make-option-block">
                <strong>更换模板</strong>
                <div className="template-choice-row">
                  {[...templates.slice(0, 5), templates.find((item) => item.id === 'video-polish') ?? templates[5]].map((item) => (
                    <button
                      type="button"
                      className={item.id === template.id ? 'is-active' : ''}
                      key={item.id}
                      style={{ '--template-accent': item.accent } as CSSProperties}
                      onClick={() => onTemplateChange(item.id)}
                    >
                      <img src={item.image} alt={item.title} />
                      <span>
                        <strong>{item.title}</strong>
                        <small>{item.cost} 积分 · {item.duration}</small>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="make-option-block">
                <strong>从资产库选择</strong>
                <div className="make-product-tabs image-only-picker">
                  {assets.map((asset) => (
                    <button
                      type="button"
                      className={asset.id === selectedAsset?.id ? 'is-active' : ''}
                      key={asset.id}
                      onClick={() => onAssetSelect(asset.id)}
                    >
                      <img src={asset.image} alt={asset.name} />
                      <strong>{asset.name}</strong>
                      <em>{asset.type}</em>
                    </button>
                  ))}
                </div>
                {assets.length === 0 && <p className="setting-note">还没有可用于生成的图片资产，请先上传一张商品图。</p>}
              </div>
            </details>

            <details className="make-more-options output-settings-panel">
              <summary>
                <SlidersHorizontal size={17} />
                高级设置
              </summary>

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
              <p className="setting-note">不展开也能直接生成，默认参数按当前模板推荐值提交。</p>
            </details>
          </section>
        </div>
      </section>

      <section className="studio-command-bar studio-command-bar-v3 make-command-bar">
        <span>
          <strong>{totalCost}</strong>
          预计冻结积分
        </span>
        <span className="command-ready">
          {selectedAsset ? `${outputSettings.resolution} · ${outputSettings.quality} · 图片已就绪` : '等待上传图片'}
        </span>
        <button type="button" className="primary-action" disabled={!canGenerate} onClick={onSubmit}>
          <WandSparkles size={18} />
          生成视频
        </button>
      </section>
    </div>
  )
}

function MeView({
  assets,
  creditBalance,
  frozenCredits,
  onArchiveAsset,
  onAuth,
  onCredits,
  onDownloadAsset,
  onPreview,
  onRenameAsset,
  onRestoreAsset,
  onReuseAsset,
  onUploadAsset,
}: {
  assets: Asset[]
  creditBalance: number
  frozenCredits: number
  onArchiveAsset: (assetId: string) => void
  onAuth: (mode: AuthMode) => void
  onCredits: () => void
  onDownloadAsset: (assetId: string) => void
  onPreview: (title: string, image: string) => void
  onRenameAsset: (assetId: string) => void
  onRestoreAsset: (assetId: string) => void
  onReuseAsset: (assetId: string) => void
  onUploadAsset: (file: File) => void
}) {
  const [assetFilter, setAssetFilter] = useState<AssetFilter>('全部')
  const activeAssets = assets.filter((asset) => asset.status === 'library')
  const archivedAssets = assets.filter((asset) => asset.status === 'archived')
  const imageAssetCount = activeAssets.filter((asset) => ['image', 'portrait', 'logo'].includes(asset.kind)).length
  const videoAssetCount = activeAssets.filter((asset) => asset.kind === 'video').length
  const expiringAssetCount = activeAssets.filter(isExpiringAsset).length
  const visibleAssets = assets.filter((asset) => {
    if (assetFilter === '图片') return asset.status === 'library' && ['image', 'portrait', 'logo'].includes(asset.kind)
    if (assetFilter === '视频') return asset.status === 'library' && asset.kind === 'video'
    if (assetFilter === '即将过期') return asset.status === 'library' && isExpiringAsset(asset)
    if (assetFilter === '已归档') return asset.status === 'archived'
    return asset.status === 'library'
  })
  const handleLibraryUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0]
    if (file) onUploadAsset(file)
    event.currentTarget.value = ''
  }

  return (
    <div className="page-stack account-page">
      <PageTitle eyebrow="MY SPACE" title="我的" text="把资产库和积分中心下沉到个人空间，主流程保持轻。" />
      <section className="me-grid">
        <button type="button" className="me-card" onClick={onCredits}>
          <Coins size={22} />
          <strong>积分余额</strong>
          <span>{creditBalance.toLocaleString()} 可用，{frozenCredits} 冻结，点击查看充值与账本</span>
        </button>
        <article className="me-card">
          <Library size={22} />
          <strong>资产库</strong>
          <span>{activeAssets.length} 个可用，{archivedAssets.length} 个已归档</span>
        </article>
        <button type="button" className="me-card" onClick={() => onAuth('register')}>
          <Gift size={22} />
          <strong>登录/注册模拟</strong>
          <span>支持扫码、第三方登录和注册赠送积分演示</span>
        </button>
        <section className="asset-manager">
          <div className="asset-manager-head">
            <span>
              <strong>资产管理</strong>
              <small>上传、复用、下载、重命名和归档自己的素材。</small>
            </span>
            <input className="file-input" id="asset-library-upload" type="file" accept="image/*" onChange={handleLibraryUpload} />
            <label className="secondary-action upload-inline-button" htmlFor="asset-library-upload">
              <Upload size={17} />
              上传素材
            </label>
          </div>

          <div className="asset-filter-row">
            {assetFilters.map((filter) => (
              <button
                type="button"
                key={filter}
                className={assetFilter === filter ? 'is-selected' : ''}
                onClick={() => setAssetFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="asset-summary-row">
            <span>
              <strong>{imageAssetCount}</strong>
              图片素材
            </span>
            <span>
              <strong>{videoAssetCount}</strong>
              生成视频
            </span>
            <span>
              <strong>{expiringAssetCount}</strong>
              即将过期
            </span>
          </div>

          <div className="asset-management-grid">
            {visibleAssets.map((asset) => (
              <article className={asset.status === 'archived' ? 'asset-manage-card is-archived' : 'asset-manage-card'} key={asset.id}>
                <button type="button" className="asset-manage-media" onClick={() => onPreview(asset.name, asset.image)}>
                  <img src={asset.image} alt={asset.name} />
                  <span>{asset.type}</span>
                </button>
                <div className="asset-manage-copy">
                  <strong>{asset.name}</strong>
                  <small>{asset.source} · {asset.expires}</small>
                  {asset.status === 'archived' && (
                    <em>
                      <Archive size={14} />
                      已归档
                    </em>
                  )}
                </div>
                <div className="asset-action-grid">
                  <button type="button" onClick={() => onDownloadAsset(asset.id)}>
                    <Download size={15} />
                    下载
                  </button>
                  <button type="button" onClick={() => onRenameAsset(asset.id)}>
                    <PencilLine size={15} />
                    重命名
                  </button>
                  <button type="button" disabled={!canUseAssetForGeneration(asset)} onClick={() => onReuseAsset(asset.id)}>
                    <RefreshCcw size={15} />
                    复用
                  </button>
                  {asset.status === 'archived' ? (
                    <button type="button" onClick={() => onRestoreAsset(asset.id)}>
                      <RefreshCcw size={15} />
                      恢复
                    </button>
                  ) : (
                    <button type="button" className="danger-action" onClick={() => onArchiveAsset(asset.id)}>
                      <Trash2 size={15} />
                      归档
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
          {visibleAssets.length === 0 && <p className="empty-inline">当前筛选下没有资产。</p>}
        </section>
      </section>
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
  return (
    <button
      type="button"
      className="template-card"
      style={{ '--template-accent': template.accent, '--card-index': index } as CSSProperties}
      onClick={() => onOpen(template.id)}
    >
      <span className="template-media">
        <img src={template.image} alt={template.title} />
        <span>{template.category}</span>
        <em>{templateInputLabel(template)}</em>
      </span>
      <span className="template-body">
        <small>{template.scenario}</small>
        <strong>{template.title}</strong>
        <span className="template-meta">
          <em>{template.duration}</em>
          <em>{template.ratio}</em>
          <em>{template.cost} 积分</em>
        </span>
      </span>
    </button>
  )
}

function TemplateDetail({
  template,
  onCreate,
  onPreview,
}: {
  template: Template
  onCreate: () => void
  onPreview: () => void
}) {
  return (
    <div className="template-detail" style={{ '--template-accent': template.accent } as CSSProperties}>
      <button type="button" className="detail-media" onClick={onPreview}>
        <img src={template.image} alt={template.title} />
        <span>
          <Play size={18} fill="currentColor" />
          预览
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
        <button type="button" className="primary-action" onClick={onCreate}>
          <WandSparkles size={18} />
          {template.category === '视频模板' ? '制作页预留' : '使用模板'}
        </button>
      </div>
    </div>
  )
}

function TaskRow({ task, onOpen }: { task: Task; onOpen: (taskId: string) => void }) {
  const status = taskStatus(task)
  const StatusIcon = status.icon

  return (
    <button type="button" className={`task-row status-${task.status}`} onClick={() => onOpen(task.id)}>
      <img src={task.image} alt={task.title} />
      <span>
        <strong>{task.title}</strong>
        <small>{task.id} · {task.updated}</small>
      </span>
      <em className={`status-pill status-${task.status}`}>
        <StatusIcon size={15} />
        {status.label}
      </em>
      <ChevronRight size={18} />
    </button>
  )
}

function TaskDetail({
  task,
  onAdvance,
  onDownload,
  onOpenAssets,
  onPreview,
  onRefund,
}: {
  task: Task
  onAdvance: (taskId: string) => void
  onDownload: () => void
  onOpenAssets: () => void
  onPreview: () => void
  onRefund: (taskId: string) => void
}) {
  const status = taskStatus(task)
  const StatusIcon = status.icon
  const canOperate = activeStatuses.includes(task.status)
  const isSuccess = task.status === 'success'
  const isRefunded = task.status === 'refunded'
  const submittedParams = task.params
    ? `templateId=${task.params.templateId}, imageId=${task.params.imageId}, ratio=${task.params.ratio}, duration=${task.params.duration}, resolution=${task.params.resolution}, quality=${task.params.quality}`
    : 'productImage, templateId, ratio, duration, resolution, quality'

  return (
    <div className="drawer-stack">
      <section className="task-preview">
        <img src={task.image} alt={task.title} />
        <div>
          <em className={`status-pill status-${task.status}`}>
            <StatusIcon size={15} />
            {status.label}
          </em>
          <h2>{task.title}</h2>
          <span>{task.id} · {task.cost} 积分</span>
        </div>
      </section>
      <div className="progress-track">
        <span style={{ width: `${task.progress}%` }}></span>
      </div>
      <section className="trace-list">
        <TraceItem icon={CheckCircle2} title="任务已创建" text="模板版本和提交参数已锁定。" />
        <TraceItem
          icon={Coins}
          title="积分状态"
          text={
            task.status === 'refunded'
              ? '失败后已释放冻结积分。'
              : task.status === 'success'
                ? '任务已完成，冻结积分已结算。'
                : '积分处于冻结状态，完成后结算。'
          }
        />
        <TraceItem icon={TimerReset} title="当前阶段" text={status.detail} />
        <TraceItem
          icon={FileVideo}
          title="输出资产"
          text={isSuccess ? '结果已生成并进入资产库，可预览、下载或复用。' : '完成后可下载或保存到资产库。'}
        />
      </section>
      {isSuccess && (
        <section className="task-result-panel">
          <button type="button" className="task-result-media" onClick={onPreview}>
            <img src={task.image} alt={`${task.title} 输出预览`} />
            <span>
              <Play size={16} />
              预览结果
            </span>
          </button>
          <div>
            <p className="eyebrow">OUTPUT READY</p>
            <strong>{task.id.toLowerCase()}-output.mp4</strong>
            <small>{task.cost} 积分已结算 · 资产库已保存 · 30 天保留</small>
            <div className="result-action-row">
              <button type="button" className="secondary-action" onClick={onDownload}>
                <Download size={17} />
                下载
              </button>
              <button type="button" className="secondary-action" onClick={onOpenAssets}>
                <Library size={17} />
                去资产库
              </button>
            </div>
          </div>
        </section>
      )}
      {isRefunded && (
        <section className="task-recovery-panel">
          <AlertTriangle size={19} />
          <span>
            <strong>积分已释放</strong>
            <small>本次失败不会消耗积分。历史输入、模板版本和参数仍保留，后续可以用于客服排查或重新生成。</small>
          </span>
        </section>
      )}
      <details className="advanced-panel">
        <summary>
          <ShieldCheck size={17} />
          追溯信息
        </summary>
        <div className="trace-list compact">
          <TraceItem icon={ClipboardCheck} title="Submitted Params" text={submittedParams} />
          <TraceItem icon={LockKeyhole} title="Template Version" text="template@v3, pricing@P-2026-06" />
        </div>
      </details>
      <div className="drawer-actions">
        {canOperate && (
          <button type="button" className="primary-action" onClick={() => onAdvance(task.id)}>
            <RefreshCcw size={18} />
            模拟推进
          </button>
        )}
        {canOperate && (
          <button type="button" className="secondary-action" onClick={() => onRefund(task.id)}>
            <AlertTriangle size={18} />
            失败释放积分
          </button>
        )}
        <button type="button" className="secondary-action" disabled={task.status !== 'success'} onClick={onPreview}>
          <Play size={18} />
          预览结果
        </button>
        <button type="button" className="secondary-action" disabled={task.status !== 'success'} onClick={onDownload}>
          <Download size={18} />
          下载结果
        </button>
      </div>
    </div>
  )
}

function CreditPanel({
  balance,
  frozenCredits,
  ledgerRows,
  onRecharge,
  onToast,
}: {
  balance: number
  frozenCredits: number
  ledgerRows: LedgerRow[]
  onRecharge: (pack: (typeof rechargePackages)[number]) => void
  onToast: (toast: ToastState) => void
}) {
  const [selectedPackage, setSelectedPackage] = useState(rechargePackages[1])

  return (
    <div className="credit-panel">
      <section className="balance-card">
        <p className="eyebrow">当前余额</p>
        <strong>{balance.toLocaleString()}</strong>
        <span>{frozenCredits} 积分冻结中。活动赠送积分默认输出带水印。</span>
      </section>
      <div className="package-grid">
        {rechargePackages.map((pack) => (
          <button
            type="button"
            className={selectedPackage.name === pack.name ? 'package-card is-selected' : 'package-card'}
            key={pack.name}
            onClick={() => {
              setSelectedPackage(pack)
              onToast({ title: '充值包已选择', text: `${pack.name} 可继续模拟支付到账。` })
            }}
          >
            <span>{pack.name}</span>
            <strong>{pack.price}</strong>
            <small>{pack.credits.toLocaleString()} 积分 · {pack.bonus}</small>
          </button>
        ))}
      </div>
      <button type="button" className="primary-action recharge-action" onClick={() => onRecharge(selectedPackage)}>
        <Wallet size={18} />
        模拟支付并到账
      </button>
      <section className="payment-sim">
        <span>
          <QrCode size={18} />
          微信/支付宝扫码位
        </span>
        <span>真实支付接入前，演示只修改本地积分和账本。</span>
      </section>
      <section className="ledger-list">
        {ledgerRows.map((row) => (
          <div key={`${row.title}-${row.amount}-${row.source}`}>
            <span>
              <strong>{row.title}</strong>
              <small>{row.source}</small>
            </span>
            <b>{row.amount}</b>
          </div>
        ))}
      </section>
    </div>
  )
}

function AuthPanel({
  mode,
  onGrantSignupCredits,
  onModeChange,
  onToast,
}: {
  mode: AuthMode
  onGrantSignupCredits: () => void
  onModeChange: (mode: AuthMode) => void
  onToast: (toast: ToastState) => void
}) {
  return (
    <div className="auth-panel">
      <div className="auth-tabs">
        <button
          type="button"
          className={mode === 'login' ? 'is-selected' : ''}
          onClick={() => onModeChange('login')}
        >
          登录
        </button>
        <button
          type="button"
          className={mode === 'register' ? 'is-selected' : ''}
          onClick={() => onModeChange('register')}
        >
          注册
        </button>
      </div>
      <section className="auth-card">
        <div className="qr-box">
          <QrCode size={42} />
          <span>扫码登录占位</span>
        </div>
        <div>
          <p className="eyebrow">{mode === 'register' ? 'SIGNUP BONUS' : 'LOGIN'}</p>
          <h2>{mode === 'register' ? '注册即送 300 积分' : '选择一种方式进入工作台'}</h2>
          <p>
            {mode === 'register'
              ? '真实环境会叠加设备、IP、手机号、支付行为和活动规则，防止重复注册薅羊毛。'
              : '后续可接入微信扫码、手机号验证码、企业微信和第三方账号登录。'}
          </p>
        </div>
      </section>
      <div className="auth-action-grid">
        <button
          type="button"
          className="secondary-action"
          onClick={() => onToast({ title: '扫码登录已模拟', text: '真实环境会等待二维码确认和账号绑定。' })}
        >
          <QrCode size={18} />
          模拟扫码登录
        </button>
        <button
          type="button"
          className="secondary-action"
          onClick={() => onToast({ title: '第三方登录已模拟', text: '后续可接入微信、支付宝、Google 或 Apple。' })}
        >
          <UserRound size={18} />
          第三方登录
        </button>
        <button type="button" className="primary-action" onClick={onGrantSignupCredits}>
          <Gift size={18} />
          领取注册积分
        </button>
      </div>
    </div>
  )
}

function FilterPanel({
  selectedFilters,
  onApply,
  onToggle,
}: {
  selectedFilters: string[]
  onApply: () => void
  onToggle: (filter: string) => void
}) {
  return (
    <div className="sheet-grid">
      {filterGroups.map((group) => (
        <FilterGroup
          key={group.title}
          items={group.items}
          selectedFilters={selectedFilters}
          title={group.title}
          onToggle={onToggle}
        />
      ))}
      <button type="button" className="primary-action" onClick={onApply}>应用筛选</button>
    </div>
  )
}

function Modal({
  title,
  children,
  onClose,
  size = 'large',
}: {
  title: string
  children: ReactNode
  onClose: () => void
  size?: 'large' | 'small'
}) {
  return (
    <div className="overlay-backdrop" role="presentation">
      <section className={`modal-panel modal-${size}`} role="dialog" aria-modal="true" aria-label={title}>
        <OverlayHeader title={title} onClose={onClose} />
        {children}
      </section>
    </div>
  )
}

function Drawer({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className="overlay-backdrop" role="presentation">
      <section className="drawer-panel" role="dialog" aria-modal="true" aria-label={title}>
        <OverlayHeader title={title} onClose={onClose} />
        {children}
      </section>
    </div>
  )
}

function Sheet({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className="overlay-backdrop" role="presentation">
      <section className="sheet-panel" role="dialog" aria-modal="true" aria-label={title}>
        <OverlayHeader title={title} onClose={onClose} />
        {children}
      </section>
    </div>
  )
}

function Lightbox({
  title,
  image,
  onClose,
}: {
  title: string
  image: string
  onClose: () => void
}) {
  return (
    <div className="overlay-backdrop" role="presentation">
      <section className="lightbox-panel" role="dialog" aria-modal="true" aria-label={`${title} 预览`}>
        <button type="button" className="close-button lightbox-close" onClick={onClose} aria-label="关闭">
          <X size={19} />
        </button>
        <img src={image} alt={`${title} 预览`} />
      </section>
    </div>
  )
}

function OverlayHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <header className="overlay-header">
      <strong>{title}</strong>
      <button type="button" className="close-button" onClick={onClose} aria-label="关闭">
        <X size={19} />
      </button>
    </header>
  )
}

function PageTitle({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <section className="page-title">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{text}</p>
    </section>
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
          <button
            type="button"
            className={selectedFilters.includes(item) ? 'is-selected' : ''}
            key={item}
            onClick={() => onToggle(item)}
          >
            {item}
          </button>
        ))}
      </div>
    </section>
  )
}

function TraceItem({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof CheckCircle2
  title: string
  text: string
}) {
  return (
    <div className="trace-item">
      <Icon size={17} />
      <span>
        <strong>{title}</strong>
        <small>{text}</small>
      </span>
    </div>
  )
}

function Toast({ toast, onClose }: { toast: NonNullable<ToastState>; onClose: () => void }) {
  return (
    <section className="toast" role="status">
      <CheckCircle2 size={18} />
      <span>
        <strong>{toast.title}</strong>
        <small>{toast.text}</small>
      </span>
      <button type="button" onClick={onClose} aria-label="关闭提示">
        <X size={16} />
      </button>
    </section>
  )
}

function taskStatus(task: Task) {
  const statusMap = {
    queued: { label: '排队中', detail: '任务已进入队列，等待供应商和渲染资源。', icon: Clock3 },
    running: { label: '生成中', detail: '生成模型正在处理主视觉和关键帧。', icon: Zap },
    rendering: { label: '后期渲染', detail: '正在合成字幕、转场、比例和封面。', icon: FileVideo },
    review: { label: '审核中', detail: '正在执行内容审核和输出资产入库前检查。', icon: ShieldCheck },
    success: { label: '已完成', detail: '输出已生成，资产可预览、下载或复用。', icon: CheckCircle2 },
    refunded: { label: '失败已释放', detail: '任务失败或被阻断，冻结积分已释放。', icon: AlertTriangle },
  }

  return statusMap[task.status]
}

export default App
