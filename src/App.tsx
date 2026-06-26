import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Coins,
  FileVideo,
  Gauge,
  Gift,
  ImagePlus,
  Images,
  LayoutDashboard,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  TimerReset,
  UserRound,
  WandSparkles,
  X,
  Zap,
} from 'lucide-react'
import './App.css'

import { canUseAssetForGeneration, generationIdempotencyKey, outputDefaultsForTemplate, sameOutputSettings, templateInputLabel } from './domain'
import { AssetPicker } from './components/AssetPicker'
import { AuthPanel } from './components/AuthPanel'
import { CreditPanel } from './components/CreditPanel'
import { MeView } from './components/MeView'
import { StudioPage } from './components/StudioPage'
import { TaskDetail } from './components/TaskDetail'
import { TasksView } from './components/TasksView'
import { FilterPanel, TemplateDetail, TemplatesView } from './components/TemplatesView'
import {
  activeStatuses,
  baseAssetFilters,
  customAssetFilterSeed,
  initialAssets,
  initialLedgerRows,
  initialPaymentOrder,
  initialQrLoginSession,
  initialTasks,
  initialUploadReceipt,
  maxUploadSize,
  templates,
} from './prototypeData'
import { qrLoginStatusCopy, taskStatusCopy } from './viewModels'
import type {
  Asset,
  AssetFilter,
  AuthMode,
  LedgerRow,
  OutputSettingKey,
  OutputSettings,
  OverlayType,
  PaymentOrder,
  PaymentOrderStatus,
  PreviewMedia,
  QrLoginSession,
  QrLoginStatus,
  RechargePackage,
  SignupRewardStatus,
  Task,
  TaskStatus,
  ToastState,
  UploadReceipt,
  ViewId,
  WorkbenchMode,
} from './types'

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
  const [customAssetFilters, setCustomAssetFilters] = useState<AssetFilter[]>(customAssetFilterSeed)
  const [paymentOrder, setPaymentOrder] = useState<PaymentOrder>(initialPaymentOrder)
  const [signupRewardStatus, setSignupRewardStatus] = useState<SignupRewardStatus>('eligible')
  const [uploadReceipt, setUploadReceipt] = useState<UploadReceipt>(initialUploadReceipt)
  const [qrLoginSession, setQrLoginSession] = useState<QrLoginSession>(initialQrLoginSession)
  const [toast, setToast] = useState<ToastState>(null)
  const [previewMedia, setPreviewMedia] = useState<PreviewMedia>({
    title: templates[0].title,
    image: templates[0].image,
    kind: 'image',
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
  const assetFilters = useMemo(
    () => [...baseAssetFilters, ...customAssetFilters.filter((filter) => !baseAssetFilters.includes(filter))],
    [customAssetFilters],
  )
  const filteredTemplates = useMemo(() => {
    const trimmedSearch = searchTerm.trim().toLowerCase()

    return templates.filter((template) => {
      const textMatch =
        !trimmedSearch ||
        [template.title, template.category, template.scenario, ...template.tags].join(' ').toLowerCase().includes(trimmedSearch)
      const filterMatch =
        selectedFilters.length === 0 ||
        selectedFilters.some((filter) => {
          if (filter === '100-150') return template.cost >= 100 && template.cost <= 150
          if (filter === '150-200') return template.cost > 150 && template.cost <= 200
          if (filter === '200+') return template.cost > 200
          return (
            template.category === filter ||
            template.ratio === filter ||
            templateInputLabel(template) === filter ||
            template.tags.includes(filter) ||
            template.scenario.includes(filter)
          )
        })

      return textMatch && filterMatch
    })
  }, [searchTerm, selectedFilters])

  useEffect(() => {
    window.scrollTo({ left: 0, top: 0 })
  }, [activeView, workbenchMode])

  const closeOverlay = () => setOverlay(null)
  const addLedgerRow = (row: LedgerRow) => setDemoLedgerRows((current) => [row, ...current].slice(0, 8))

  const goToView = (view: ViewId) => {
    setActiveView(view)
    if (view === 'workbench') setWorkbenchMode('overview')
  }

  const openTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId)
    setOverlay('template')
  }

  const openStudio = (templateId = studioTemplateId) => {
    const nextTemplate = templates.find((template) => template.id === templateId) ?? templates[0]
    setStudioTemplateId(nextTemplate.id)
    setSelectedTemplateId(nextTemplate.id)
    setOutputSettings(outputDefaultsForTemplate(nextTemplate))
    setOverlay(null)
    setActiveView('workbench')
    setWorkbenchMode('create')
  }

  const openTask = (taskId: string) => {
    setSelectedTaskId(taskId)
    setOverlay('task')
  }

  const openPreview = (title: string, image: string, media?: Partial<Pick<PreviewMedia, 'kind' | 'videoSrc'>>) => {
    setPreviewMedia({
      title,
      image,
      kind: media?.kind ?? 'image',
      videoSrc: media?.videoSrc,
    })
    setOverlay('lightbox')
  }

  const updateOutputSetting = (key: OutputSettingKey, value: string) => {
    setOutputSettings((current) => ({ ...current, [key]: value }))
  }

  const addUploadedAsset = (file: File, source: string, useInStudio = false) => {
    const uploadId = `UP-${Date.now()}`

    setUploadReceipt({
      id: uploadId,
      fileName: file.name || '未命名文件',
      status: 'validating',
      progress: 18,
      source,
      message: '正在校验文件格式、大小和资产入库参数。',
    })

    if (!file.type.startsWith('image/')) {
      setUploadReceipt({
        id: uploadId,
        fileName: file.name || '未命名文件',
        status: 'failed',
        progress: 0,
        source,
        message: '文件格式不支持，未创建资产记录。',
      })
      setToast({ title: '文件格式不支持', text: '第一版只支持上传 PNG、JPG、WebP 等图片文件。' })
      return false
    }

    if (file.size > maxUploadSize) {
      setUploadReceipt({
        id: uploadId,
        fileName: file.name || '未命名文件',
        status: 'failed',
        progress: 0,
        source,
        message: '文件超过 8MB，未创建资产记录。',
      })
      setToast({ title: '文件过大', text: '单张图片请控制在 8MB 以内，后续可按套餐放开限制。' })
      return false
    }

    if (/reject|blocked/i.test(file.name)) {
      setUploadReceipt({
        id: uploadId,
        fileName: file.name || '未命名文件',
        status: 'rejected',
        progress: 0,
        source,
        message: '图片未通过安全校验，未写入资产库。',
      })
      setToast({ title: '图片未通过校验', text: '请更换图片后重试。' })
      return false
    }

    const imageUrl = URL.createObjectURL(file)
    const asset: Asset = {
      id: `A-UP-${Date.now()}`,
      name: file.name || 'uploaded-product-image.jpg',
      type: '商品主图',
      kind: 'image',
      image: imageUrl,
      expires: '永久保存',
      status: 'library',
      source,
    }

    setDemoAssets((current) => [asset, ...current])
    setUploadReceipt({
      id: uploadId,
      fileName: asset.name,
      status: 'saved',
      progress: 100,
      source,
      message: '图片已保存为资产，可直接用于生成任务。',
    })
    if (useInStudio) setSelectedStudioAssetId(asset.id)
    setToast({ title: '图片已入库', text: `${asset.name} 可以用于当前模板。` })
    return true
  }

  const cancelUpload = () => {
    setUploadReceipt((current) => ({
      ...current,
      status: 'cancelled',
      progress: 0,
      message: '上传流程已取消，未创建新的资产记录。',
    }))
    setToast({ title: '上传已取消', text: '可以重新选择图片上传。' })
  }

  const retryUpload = () => {
    setUploadReceipt({
      id: `UPLOAD-RETRY-${Date.now()}`,
      fileName: '等待重新选择',
      status: 'idle',
      progress: 0,
      source: uploadReceipt.source,
      message: '请重新选择一张图片继续上传。',
    })
    setToast({ title: '等待重新选择', text: '请从上传入口重新选择图片。' })
  }

  const renameAsset = (assetId: string) => {
    setDemoAssets((current) =>
      current.map((asset) =>
        asset.id === assetId
          ? {
              ...asset,
              name: asset.name.includes('renamed') ? asset.name : asset.name.replace(/(\.[a-z0-9]+)$/i, '-renamed$1'),
            }
          : asset,
      ),
    )
    setToast({ title: '资产已重命名', text: '名称变更会保留在资产追溯记录中。' })
  }

  const archiveAsset = (assetId: string) => {
    setDemoAssets((current) =>
      current.map((asset) => (asset.id === assetId ? { ...asset, status: 'archived' } : asset)),
    )
    if (selectedStudioAssetId === assetId) {
      const nextReusable = demoAssets.find((asset) => asset.id !== assetId && canUseAssetForGeneration(asset))
      setSelectedStudioAssetId(nextReusable?.id ?? '')
    }
    setToast({ title: '资产已归档', text: '归档资产不会出现在默认选择列表中。' })
  }

  const restoreAsset = (assetId: string) => {
    setDemoAssets((current) =>
      current.map((asset) => (asset.id === assetId ? { ...asset, status: 'library' } : asset)),
    )
    setToast({ title: '资产已恢复', text: '该素材重新进入资产库。' })
  }

  const createAssetCategory = (name: string) => {
    const normalizedName = name.trim().slice(0, 18)
    if (!normalizedName) {
      setToast({ title: '分类名为空', text: '请输入一个分类名称。' })
      return false
    }
    if (assetFilters.includes(normalizedName)) {
      setToast({ title: '分类已存在', text: '可以直接选择已有分类。' })
      return false
    }
    setCustomAssetFilters((current) => [...current, normalizedName])
    setToast({ title: '分类已添加', text: `${normalizedName} 可以用于整理资产。` })
    return true
  }

  const deleteAssetCategory = (name: string) => {
    setCustomAssetFilters((current) => current.filter((filter) => filter !== name))
    setDemoAssets((current) => current.map((asset) => (asset.type === name ? { ...asset, type: '商品主图' } : asset)))
    setToast({ title: '分类已删除', text: '该分类下资产已移动到商品主图。' })
  }

  const updateAssetCategory = (assetId: string, category: string) => {
    setDemoAssets((current) =>
      current.map((asset) => (asset.id === assetId ? { ...asset, type: category } : asset)),
    )
    setToast({ title: '分类已更新', text: `资产已移动到 ${category}。` })
  }

  const downloadAsset = (assetId: string) => {
    const asset = demoAssets.find((item) => item.id === assetId)
    if (asset) setToast({ title: '已请求下载链接', text: `${asset.name} 的下载链接会由后端签发。` })
  }

  const reuseAsset = (assetId: string) => {
    const asset = demoAssets.find((item) => item.id === assetId)
    if (!asset || !canUseAssetForGeneration(asset)) {
      setToast({ title: '暂不可复用', text: '当前图片模板只接受图片、人像或 Logo。' })
      return
    }
    setSelectedStudioAssetId(asset.id)
    setActiveView('workbench')
    setWorkbenchMode('create')
    setToast({ title: '已放入制作台', text: `${asset.name} 已作为当前输入素材。` })
  }

  const downloadTaskResult = (taskId: string) => {
    const task = demoTasks.find((item) => item.id === taskId)
    if (task) setToast({ title: '已请求输出下载', text: `${task.title} 的输出下载链接会由后端签发。` })
  }

  const openAssetLibrary = () => {
    setOverlay(null)
    setActiveView('me')
  }

  const openAuth = (mode: AuthMode) => {
    setAuthMode(mode)
    setOverlay('auth')
  }

  const updateQrLoginStatus = (status: QrLoginStatus) => {
    setQrLoginSession((current) => ({ ...current, status }))
    if (status === 'confirmed') {
      setToast({ title: '扫码登录成功', text: '账号状态已确认，可以继续使用工作台。' })
      return
    }
    setToast({ title: qrLoginStatusCopy(status).title, text: qrLoginStatusCopy(status).text })
  }

  const refreshQrLoginSession = () => {
    setQrLoginSession({
      id: `QR-${Date.now()}`,
      provider: '微信扫码',
      status: 'waiting',
      expiresIn: '02:00',
      note: '二维码已刷新，手机端确认后才会登录。',
    })
    setToast({ title: '二维码已刷新', text: '新的二维码会话已创建。' })
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

    const idempotencyKey = generationIdempotencyKey(selectedStudioTemplate, selectedAsset, outputSettings)
    const duplicateTask = demoTasks.find(
      (task) =>
        activeStatuses.includes(task.status) &&
        (task.params?.idempotencyKey === idempotencyKey ||
          (task.params?.templateId === selectedStudioTemplate.id &&
            task.params.templateVersion === selectedStudioTemplate.config.version &&
            task.params.imageId === selectedAsset.id &&
            sameOutputSettings(task.params, outputSettings))),
    )

    if (duplicateTask) {
      setSelectedTaskId(duplicateTask.id)
      setToast({
        title: '当前图片正在生成',
        text: '这组图片和参数已有后台任务，可查看任务，或换图/调整高级设置后再提交。',
      })
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
        templateVersion: selectedStudioTemplate.config.version,
        pricingVersion: selectedStudioTemplate.config.pricingVersion,
        workflowType: selectedStudioTemplate.config.workflowType,
        imageId: selectedAsset.id,
        idempotencyKey,
        ...outputSettings,
      },
    }

    setDemoTasks((current) => [newTask, ...current])
    setSelectedTaskId(newTask.id)
    setCreditBalance((current) => current - totalCost)
    setFrozenCredits((current) => current + totalCost)
    addLedgerRow({
      id: `L-${newTask.id}-FREEZE`,
      title: `${selectedAsset.name} 图片生成冻结`,
      amount: `-${totalCost}`,
      source: selectedStudioTemplate.title,
      kind: 'freeze',
      status: 'frozen',
      refId: newTask.id,
      time: '刚刚',
      note: '生成任务已进入后台，积分处于冻结状态。',
    })
    setToast({
      title: '任务已进入后台',
      text: `创作台保持可用，可继续替换图片生成下一条；已冻结 ${totalCost} 积分。`,
    })
  }

  const completeTask = (task: Task) => {
    setFrozenCredits((current) => Math.max(0, current - task.cost))
    addLedgerRow({
      id: `L-${task.id}-SETTLE`,
      title: `${task.title} 生成成功`,
      amount: '结算',
      source: task.id,
      kind: 'settlement',
      status: 'settled',
      refId: task.id,
      time: '刚刚',
      note: '任务已完成，冻结积分转为实际消耗。',
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

    setDemoTasks((current) =>
      current.map((item) => (item.id === taskId ? { ...item, ...next, failure: next.status === 'success' ? undefined : item.failure } : item)),
    )
    if (next.status === 'success') completeTask({ ...task, ...next })
  }

  const refundTask = (taskId: string) => {
    const task = demoTasks.find((item) => item.id === taskId)
    if (!task || !activeStatuses.includes(task.status)) return

    setDemoTasks((current) =>
      current.map((item) =>
        item.id === taskId
          ? {
              ...item,
              status: 'refunded',
              progress: 100,
              updated: '刚刚',
              failure: {
                reason: 'timeout',
                stage: 'provider',
                code: 'TASK_TIMEOUT_RELEASED',
                retryable: true,
                message: '任务超时，系统释放冻结积分。',
              },
            }
          : item,
      ),
    )
    setFrozenCredits((current) => Math.max(0, current - task.cost))
    setCreditBalance((current) => current + task.cost)
    addLedgerRow({
      id: `L-${task.id}-RELEASE`,
      title: `${task.title} 积分释放`,
      amount: `+${task.cost}`,
      source: task.id,
      kind: 'release',
      status: 'released',
      refId: task.id,
      time: '刚刚',
      note: '任务失败、超时或审核阻断，冻结积分已释放。',
    })
    setToast({ title: '积分已释放', text: `${task.cost} 积分已回到可用余额。` })
  }

  const createPaymentOrder = (pack: RechargePackage) => {
    setPaymentOrder({
      id: `PAY-${Date.now()}`,
      packageName: pack.name,
      amount: pack.price,
      credits: pack.credits,
      status: 'pending',
      channel: '微信/支付宝',
      createdAt: '刚刚',
      expiresIn: '15 分钟',
      note: '订单已创建，支付成功后才写入积分流水。',
    })
    setToast({ title: '支付订单已创建', text: `${pack.name} 等待支付确认。` })
  }

  const resolvePaymentOrder = (status: Extract<PaymentOrderStatus, 'paid' | 'failed' | 'cancelled' | 'expired'>) => {
    setPaymentOrder((current) => ({ ...current, status }))
    if (status === 'paid') {
      setCreditBalance((current) => current + paymentOrder.credits)
      addLedgerRow({
        id: `L-${paymentOrder.id}-RECHARGE`,
        title: `${paymentOrder.packageName} 充值到账`,
        amount: `+${paymentOrder.credits}`,
        source: paymentOrder.id,
        kind: 'recharge',
        status: 'credited',
        refId: paymentOrder.id,
        time: '刚刚',
        note: '支付回调确认后写入积分余额。',
      })
      setToast({ title: '积分已到账', text: `${paymentOrder.credits} 积分已写入账户。` })
      return
    }
    const copy = status === 'cancelled' ? '订单已取消，余额不变。' : status === 'expired' ? '订单已过期，余额不变。' : '支付失败，余额不变。'
    setToast({ title: '支付状态已更新', text: copy })
  }

  const grantSignupCredits = () => {
    if (signupRewardStatus !== 'eligible') return
    setSignupRewardStatus('granted')
    setCreditBalance((current) => current + 300)
    addLedgerRow({
      id: `L-SIGNUP-${Date.now()}`,
      title: '注册活动积分到账',
      amount: '+300',
      source: '注册活动',
      kind: 'reward',
      status: 'granted',
      refId: 'CAMPAIGN-SIGNUP',
      time: '刚刚',
      note: '注册活动赠送积分，受风控和活动规则约束。',
    })
    setToast({ title: '注册积分已到账', text: '300 积分已写入奖励流水。' })
  }

  return (
    <main className="app-shell">
      <TopBar activeView={activeView} creditBalance={creditBalance} onCredits={() => setOverlay('credits')} onNavigate={goToView} />

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
      {activeView === 'workbench' &&
        (workbenchMode === 'create' ? (
          <StudioPage
            assets={demoAssets}
            creditBalance={creditBalance}
            outputSettings={outputSettings}
            selectedAssetId={selectedStudioAssetId}
            tasks={demoTasks}
            template={selectedStudioTemplate}
            onAssetSelect={setSelectedStudioAssetId}
            onOpenAssetPicker={() => setOverlay('assetPicker')}
            onOpenTask={openTask}
            onOutputSettingChange={updateOutputSetting}
            onPreview={openPreview}
            onSubmit={submitBatchGeneration}
          />
        ) : (
          <WorkbenchView
            assets={demoAssets}
            creditBalance={creditBalance}
            frozenCredits={frozenCredits}
            tasks={demoTasks}
            onCredits={() => setOverlay('credits')}
            onNavigate={goToView}
            onOpenTask={openTask}
            onOpenTemplate={openTemplate}
            onPreview={openPreview}
            onStartMaking={openStudio}
          />
        ))}
      {activeView === 'templates' && (
        <TemplatesView
          searchTerm={searchTerm}
          selectedFilters={selectedFilters}
          templates={filteredTemplates}
          onClearFilters={() => setSelectedFilters([])}
          onFilter={() => setOverlay('filters')}
          onOpenTemplate={openTemplate}
          onPreview={() => openPreview(templates[0].title, templates[0].image, { kind: 'image' })}
          onSearch={setSearchTerm}
          onToggleFilter={toggleFilter}
        />
      )}
      {activeView === 'tasks' && <TasksView tasks={demoTasks} onOpenTask={openTask} />}
      {activeView === 'me' && (
        <MeView
          assets={demoAssets}
          assetFilters={assetFilters}
          creditBalance={creditBalance}
          customAssetFilters={customAssetFilters}
          frozenCredits={frozenCredits}
          ledgerRows={demoLedgerRows}
          paymentOrder={paymentOrder}
          qrLoginSession={qrLoginSession}
          signupRewardStatus={signupRewardStatus}
          uploadReceipt={uploadReceipt}
          onArchiveAsset={archiveAsset}
          onCancelUpload={cancelUpload}
          onCreateAssetCategory={createAssetCategory}
          onCreatePaymentOrder={createPaymentOrder}
          onDeleteAssetCategory={deleteAssetCategory}
          onDownloadAsset={downloadAsset}
          onGrantSignupCredits={grantSignupCredits}
          onPreview={openPreview}
          onQrRefresh={refreshQrLoginSession}
          onQrStatusChange={updateQrLoginStatus}
          onRenameAsset={renameAsset}
          onResolvePaymentOrder={resolvePaymentOrder}
          onRestoreAsset={restoreAsset}
          onRetryUpload={retryUpload}
          onReuseAsset={reuseAsset}
          onToast={setToast}
          onUpdateAssetCategory={updateAssetCategory}
          onUploadAsset={(file) => addUploadedAsset(file, '资产库上传', false)}
        />
      )}

      {overlay === 'template' && (
        <Modal title="模板详情" onClose={closeOverlay}>
          <TemplateDetail
            template={selectedTemplate}
            onCreate={() => openStudio(selectedTemplate.id)}
            onPreview={() =>
              openPreview(selectedTemplate.title, selectedTemplate.image, {
                kind: selectedTemplate.videoSrc ? 'video' : 'image',
                videoSrc: selectedTemplate.videoSrc,
              })
            }
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
        <Drawer title="积分中心" onClose={closeOverlay}>
          <CreditPanel
            balance={creditBalance}
            frozenCredits={frozenCredits}
            ledgerRows={demoLedgerRows}
            paymentOrder={paymentOrder}
            onCreatePaymentOrder={createPaymentOrder}
            onResolvePaymentOrder={resolvePaymentOrder}
            onToast={setToast}
          />
        </Drawer>
      )}
      {overlay === 'auth' && (
        <Modal title={authMode === 'register' ? '注册领取积分' : '登录方式'} onClose={closeOverlay} size="small">
          <AuthPanel
            mode={authMode}
            onGrantSignupCredits={grantSignupCredits}
            onModeChange={setAuthMode}
            onQrRefresh={refreshQrLoginSession}
            onQrStatusChange={updateQrLoginStatus}
            onToast={setToast}
            qrLoginSession={qrLoginSession}
            signupRewardStatus={signupRewardStatus}
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
            onClear={() => setSelectedFilters([])}
            onToggle={toggleFilter}
          />
        </Sheet>
      )}
      {overlay === 'assetPicker' && (
        <Modal title="选择商品图" onClose={closeOverlay}>
          <AssetPicker
            assets={demoAssets}
            assetFilters={assetFilters}
            selectedAssetId={selectedStudioAssetId}
            uploadReceipt={uploadReceipt}
            onCancelUpload={cancelUpload}
            onPreview={openPreview}
            onRetryUpload={retryUpload}
            onSelect={(assetId) => {
              setSelectedStudioAssetId(assetId)
              setOverlay(null)
              const asset = demoAssets.find((item) => item.id === assetId)
              if (asset) setToast({ title: '图片已替换', text: `${asset.name} 已作为当前输入素材。` })
            }}
            onUpload={(file) => {
              const uploaded = addUploadedAsset(file, '制作页上传', true)
              if (uploaded) setOverlay(null)
            }}
          />
        </Modal>
      )}
      {overlay === 'lightbox' && (
        <Lightbox
          title={previewMedia.title}
          image={previewMedia.image}
          kind={previewMedia.kind}
          videoSrc={previewMedia.videoSrc}
          onClose={closeOverlay}
        />
      )}
      {toast && <Toast toast={toast} onClose={() => setToast(null)} />}
    </main>
  )
}

function TopBar({
  activeView,
  creditBalance,
  onCredits,
  onNavigate,
}: {
  activeView: ViewId
  creditBalance: number
  onCredits: () => void
  onNavigate: (view: ViewId) => void
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
          <p>模板封装模型、镜头、字幕、比例、积分和失败兜底。第一版先把“一张图生成视频”做到足够简单。</p>
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
              当前账户积分
            </span>
            <span>
              <strong>可追溯</strong>
              参数/积分/任务记录
            </span>
            <span>
              <strong>失败释放</strong>
              超时/阻断自动处理
            </span>
          </div>
        </div>
        <div className="home-result-stage" aria-label="商品图生成视频示例">
          <div className="render-window-bar">
            <span>
              <FileVideo size={15} />
              Template Render
            </span>
            <em>9:16 · 1080p</em>
          </div>
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
            <span>参数锁定</span>
          </div>
          <div className="home-render-queue">
            <span>
              <CheckCircle2 size={15} />
              图片校验通过
            </span>
            <span>
              <TimerReset size={15} />
              预计 8 秒
            </span>
            <span>
              <Coins size={15} />
              冻结 168 积分
            </span>
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
            ['商品图生成电商短视频', '上传主图，生成适合投放和详情页的完整视频。', 'watch'],
            ['人像照片生成写真/变装视频', '上传人像照片，生成写真感短视频。', 'portrait'],
            ['视频素材二创模板', '上传已有视频，做字幕、卡点、包装和投放翻新。', 'video-polish'],
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
  onStartMaking,
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
  onStartMaking: (templateId: string) => void
}) {
  const runningCount = tasks.filter((task) => activeStatuses.includes(task.status)).length
  const successCount = tasks.filter((task) => task.status === 'success').length
  const refundedCount = tasks.filter((task) => task.status === 'refunded').length
  const recentTask = tasks[0] ?? initialTasks[0]
  const activeTasks = tasks.filter((task) => activeStatuses.includes(task.status))
  const visibleTasks = activeTasks.length > 0 ? activeTasks.slice(0, 2) : tasks.slice(0, 2)

  return (
    <div className="page-stack workbench-page">
      <section className="workbench-hero">
        <div className="workbench-hero-copy">
          <p className="eyebrow">WORKBENCH</p>
          <h1>创作工作台</h1>
          <p>工作台只保留开始创作、任务状态、最近资产和积分状态。创作台会在任务提交后保持可用。</p>
          <div className="hero-actions">
            <button type="button" className="primary-action" onClick={() => onStartMaking('watch')}>
              <WandSparkles size={18} />
              开始制作
            </button>
            <button type="button" className="secondary-action" onClick={() => onNavigate('templates')}>
              <Sparkles size={18} />
              浏览模板
            </button>
          </div>
        </div>
        <button type="button" className="workbench-live-card" onClick={() => onOpenTask(recentTask.id)}>
          <span className="live-card-media">
            <img src={recentTask.image} alt={recentTask.title} />
            <em>{taskStatusCopy(recentTask.status).label}</em>
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
              <strong>进行中任务</strong>
            </span>
            <span className="panel-note">{runningCount} 处理中 · {successCount} 完成 · {refundedCount} 已释放</span>
          </div>
          <div className="queue-list">
            {visibleTasks.map((task) => (
              <WorkbenchTask key={task.id} task={task} onOpen={onOpenTask} />
            ))}
          </div>
          <button type="button" className="panel-link-button" onClick={() => onNavigate('tasks')}>
            查看全部任务
            <ArrowUpRight size={16} />
          </button>
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

        <section className="workbench-panel credit-status-panel">
          <div className="panel-heading">
            <span>
              <Coins size={18} />
              <strong>积分状态</strong>
            </span>
            <button type="button" onClick={onCredits}>
              去充值
              <ArrowUpRight size={16} />
            </button>
          </div>
          <div className="risk-metrics">
            <span>
              <strong>{creditBalance.toLocaleString()}</strong>
              可用积分
            </span>
            <span>
              <strong>{frozenCredits}</strong>
              冻结积分
            </span>
          </div>
          <p className="credit-status-note">生成前冻结积分，成功后结算；失败、超时或审核阻断会自动释放。</p>
        </section>
      </section>
    </div>
  )
}

function WorkbenchTask({ task, onOpen }: { task: Task; onOpen: (taskId: string) => void }) {
  const status = taskStatusCopy(task.status)
  const StatusIcon = taskStatusIcon(task.status)

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
  kind,
  videoSrc,
  onClose,
}: {
  title: string
  image: string
  kind: 'image' | 'video'
  videoSrc?: string
  onClose: () => void
}) {
  return (
    <div className="overlay-backdrop" role="presentation">
      <section className="lightbox-panel" role="dialog" aria-modal="true" aria-label={`${title} 预览`}>
        <button type="button" className="close-button lightbox-close" onClick={onClose} aria-label="关闭">
          <X size={19} />
        </button>
        {kind === 'video' && videoSrc ? <video src={videoSrc} poster={image} autoPlay muted loop playsInline controls /> : <img src={image} alt={`${title} 预览`} />}
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

function taskStatusIcon(status: TaskStatus) {
  const iconMap = {
    queued: Clock3,
    running: Zap,
    rendering: FileVideo,
    review: ShieldCheck,
    success: CheckCircle2,
    refunded: AlertTriangle,
  }

  return iconMap[status]
}

export default App
