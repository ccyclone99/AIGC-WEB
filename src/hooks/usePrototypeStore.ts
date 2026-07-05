import { useEffect, useMemo, useState } from 'react'

import { aigcApiClient } from '../api/config'
import {
  mapAssetDto,
  mapGenerationTaskDto,
  mapLedgerRowDto,
  mapTemplateDto,
} from '../api/mappers'
import { canUseAssetForGeneration, generationIdempotencyKey, outputDefaultsForTemplate, sameOutputSettings, templateInputLabel } from '../domain'
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
  rechargePackages,
  templates,
  videoPreviewSrc,
} from '../prototypeData'
import { qrLoginStatusCopy } from '../viewModels'
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
} from '../types'

export function usePrototypeStore() {
  const [activeView, setActiveView] = useState<ViewId>('home')
  const [workbenchMode, setWorkbenchMode] = useState<WorkbenchMode>('overview')
  const [overlay, setOverlay] = useState<OverlayType>(null)
  const [selectedTemplateId, setSelectedTemplateId] = useState('watch')
  const [studioTemplateId, setStudioTemplateId] = useState('watch')
  const [availableTemplates, setAvailableTemplates] = useState(templates)
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
  const [assetFilterOptions, setAssetFilterOptions] = useState<AssetFilter[]>(baseAssetFilters)
  const [customAssetFilters, setCustomAssetFilters] = useState<AssetFilter[]>(customAssetFilterSeed)
  const [rechargePackageOptions, setRechargePackageOptions] = useState<RechargePackage[]>(rechargePackages)
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
    () => availableTemplates.find((template) => template.id === selectedTemplateId) ?? availableTemplates[0] ?? templates[0],
    [availableTemplates, selectedTemplateId],
  )
  const selectedStudioTemplate = useMemo(
    () => availableTemplates.find((template) => template.id === studioTemplateId) ?? availableTemplates[0] ?? templates[0],
    [availableTemplates, studioTemplateId],
  )
  const selectedTask = useMemo(
    () => demoTasks.find((task) => task.id === selectedTaskId) ?? demoTasks[0],
    [demoTasks, selectedTaskId],
  )
  const reusableAssets = useMemo(() => demoAssets.filter(canUseAssetForGeneration), [demoAssets])
  const assetFilters = useMemo(
    () => [...assetFilterOptions, ...customAssetFilters.filter((filter) => !assetFilterOptions.includes(filter))],
    [assetFilterOptions, customAssetFilters],
  )
  const filteredTemplates = useMemo(() => {
    const trimmedSearch = searchTerm.trim().toLowerCase()

    return availableTemplates.filter((template) => {
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
  }, [availableTemplates, searchTerm, selectedFilters])

  useEffect(() => {
    let shouldApply = true

    const loadReadData = async () => {
      const [
        sessionResult,
        templateResult,
        assetResult,
        categoryResult,
        taskResult,
        ledgerResult,
        packageResult,
      ] = await Promise.all([
        aigcApiClient.auth.getSession(),
        aigcApiClient.templates.list(),
        aigcApiClient.assets.list(),
        aigcApiClient.assets.listCategories(),
        aigcApiClient.generationTasks.list(),
        aigcApiClient.credits.ledger(),
        aigcApiClient.credits.packages(),
      ])

      if (!shouldApply) return

      if (sessionResult.ok) {
        setCreditBalance(sessionResult.data.creditBalance)
        setFrozenCredits(sessionResult.data.frozenCredits)
      }
      if (templateResult.ok && templateResult.data.length > 0) {
        const nextTemplates = templateResult.data.map(mapTemplateDto)
        setAvailableTemplates(nextTemplates)
        setSelectedTemplateId((current) => (nextTemplates.some((template) => template.id === current) ? current : nextTemplates[0].id))
        setStudioTemplateId((current) => (nextTemplates.some((template) => template.id === current) ? current : nextTemplates[0].id))
      }
      if (assetResult.ok && assetResult.data.length > 0) {
        const nextAssets = assetResult.data.map(mapAssetDto)
        setDemoAssets(nextAssets)
        setSelectedStudioAssetId((current) =>
          current && nextAssets.some((asset) => asset.id === current)
            ? current
            : nextAssets.find(canUseAssetForGeneration)?.id ?? '',
        )
      }
      if (categoryResult.ok) {
        const categoryNames = categoryResult.data.map((category) => category.name)
        setAssetFilterOptions(['全部', ...categoryNames, '即将过期', '已归档'])
        setCustomAssetFilters(categoryResult.data.filter((category) => category.scope === 'user').map((category) => category.name))
      }
      if (taskResult.ok) {
        const nextTasks = taskResult.data.map(mapGenerationTaskDto)
        setDemoTasks(nextTasks)
        if (nextTasks.length > 0) {
          setSelectedTaskId((current) => (nextTasks.some((task) => task.id === current) ? current : nextTasks[0].id))
        }
      }
      if (ledgerResult.ok) setDemoLedgerRows(ledgerResult.data.map(mapLedgerRowDto))
      if (packageResult.ok && packageResult.data.length > 0) setRechargePackageOptions(packageResult.data)
    }

    void loadReadData()

    return () => {
      shouldApply = false
    }
  }, [])

  const closeOverlay = () => setOverlay(null)
  const closeToast = () => setToast(null)
  const openCredits = () => setOverlay('credits')
  const openFilters = () => setOverlay('filters')
  const openAssetPicker = () => setOverlay('assetPicker')
  const clearFilters = () => setSelectedFilters([])
  const selectStudioAsset = (assetId: string) => setSelectedStudioAssetId(assetId)
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
    const nextTemplate = availableTemplates.find((template) => template.id === templateId) ?? availableTemplates[0] ?? templates[0]
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

  const previewFeaturedTemplate = () => {
    const featuredTemplate = availableTemplates[0] ?? templates[0]
    openPreview(featuredTemplate.title, featuredTemplate.image, {
      kind: featuredTemplate.videoSrc ? 'video' : 'image',
      videoSrc: featuredTemplate.videoSrc,
    })
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

  const uploadLibraryAsset = (file: File) => {
    addUploadedAsset(file, '资产库上传', false)
  }

  const uploadStudioAsset = (file: File) => {
    const uploaded = addUploadedAsset(file, '制作页上传', true)
    if (uploaded) setOverlay(null)
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
    setToast({ title: '资产已重命名', text: '名称变更已保存。' })
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
    if (asset) setToast({ title: '下载已准备', text: `${asset.name} 可以下载。` })
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
    if (task) setToast({ title: '下载已准备', text: `${task.title} 可以下载。` })
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
        text: '这组图片和设置已有生成记录。可查看进度，或换图/调整设置后再提交。',
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
      note: '视频生成中，积分处于冻结状态。',
    })
    setToast({
      title: '已开始生成',
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
        videoSrc: videoPreviewSrc,
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
      note: '订单已创建，支付完成后积分到账。',
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
    const copy = status === 'cancelled' ? '订单已取消，余额不变。' : status === 'expired' ? '订单已过期，余额不变。' : '支付未完成，余额不变。'
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
      note: '注册活动赠送积分，每个账号限领一次。',
    })
    setToast({ title: '注册积分已到账', text: '300 积分已写入账户。' })
  }

  const applyTemplateFilters = () => {
    setOverlay(null)
    setToast({ title: '筛选已应用', text: `当前匹配 ${filteredTemplates.length} 个模板。` })
  }

  const selectAssetFromPicker = (assetId: string) => {
    setSelectedStudioAssetId(assetId)
    setOverlay(null)
    const asset = demoAssets.find((item) => item.id === assetId)
    if (asset) setToast({ title: '图片已替换', text: `${asset.name} 已作为当前输入素材。` })
  }

  return {
    activeView,
    assetFilters,
    authMode,
    creditBalance,
    customAssetFilters,
    demoAssets,
    demoLedgerRows,
    demoTasks,
    filteredTemplates,
    frozenCredits,
    outputSettings,
    overlay,
    paymentOrder,
    previewMedia,
    qrLoginSession,
    rechargePackages: rechargePackageOptions,
    searchTerm,
    selectedFilters,
    selectedStudioAssetId,
    selectedStudioTemplate,
    selectedTask,
    selectedTemplate,
    signupRewardStatus,
    toast,
    uploadReceipt,
    workbenchMode,
    advanceTask,
    applyTemplateFilters,
    archiveAsset,
    cancelUpload,
    clearFilters,
    closeOverlay,
    closeToast,
    createAssetCategory,
    createPaymentOrder,
    deleteAssetCategory,
    downloadAsset,
    downloadTaskResult,
    goToView,
    grantSignupCredits,
    openAssetLibrary,
    openAssetPicker,
    openAuth,
    openCredits,
    openFilters,
    openPreview,
    openStudio,
    openTask,
    openTemplate,
    previewFeaturedTemplate,
    refreshQrLoginSession,
    refundTask,
    renameAsset,
    resolvePaymentOrder,
    restoreAsset,
    retryUpload,
    reuseAsset,
    selectAssetFromPicker,
    selectStudioAsset,
    setAuthMode,
    setSearchTerm,
    setToast,
    submitBatchGeneration,
    toggleFilter,
    updateAssetCategory,
    updateOutputSetting,
    updateQrLoginStatus,
    uploadLibraryAsset,
    uploadStudioAsset,
  }
}
