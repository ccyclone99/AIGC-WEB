import { useCallback, useEffect, useMemo, useState } from 'react'

import { aigcApiClient, aigcApiConfig } from '../api/config'
import { trackProductEvent } from '../analytics'
import {
  mapAssetDto,
  mapGenerationTaskDto,
  mapLedgerRowDto,
  mapTemplateDto,
} from '../api/mappers'
import {
  canUseAssetForGeneration,
  canUseAssetForTemplate,
  generatedOutputName,
  generationIdempotencyKey,
  outputDefaultsForTemplate,
  sameOutputSettings,
  templateInputLabel,
} from '../domain'
import { downloadMedia } from '../download'
import { hashForView, routeIntentFromHash } from '../navigation'
import {
  activeStatuses,
  baseAssetFilters,
  customAssetFilterSeed,
  filterGroups,
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
  AccountSection,
  Asset,
  AssetFilter,
  AssetKind,
  AuthMode,
  CreationStage,
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
  SessionState,
  SignupRewardStatus,
  Task,
  TaskStatus,
  ToastState,
  UploadReceipt,
  ViewId,
  WorksSection,
} from '../types'

const studioDraftKey = 'aigc-studio-draft-v1'

type StoredStudioDraft = {
  templateId?: string
  assetId?: string
  outputSettings?: OutputSettings
}

const readStoredStudioDraft = (): StoredStudioDraft => {
  try {
    return JSON.parse(window.localStorage.getItem(studioDraftKey) ?? '{}') as StoredStudioDraft
  } catch {
    return {}
  }
}

export function usePrototypeStore() {
  const initialRoute = routeIntentFromHash(window.location.hash)
  const [initialDraft] = useState(readStoredStudioDraft)
  const hasValidInitialRouteTemplate = Boolean(
    initialRoute.templateId && templates.some((template) => template.id === initialRoute.templateId),
  )
  const initialTemplateId = hasValidInitialRouteTemplate && initialRoute.templateId
    ? initialRoute.templateId
    : initialDraft.templateId && templates.some((template) => template.id === initialDraft.templateId)
      ? initialDraft.templateId
      : 'watch'
  const [activeView, setActiveView] = useState<ViewId>(initialRoute.view)
  const [creationStage, setCreationStage] = useState<CreationStage>(hasValidInitialRouteTemplate ? 'edit' : 'choose')
  const [accountSection, setAccountSection] = useState<AccountSection>('profile')
  const [worksSection, setWorksSection] = useState<WorksSection>(initialRoute.worksSection ?? 'generations')
  const [overlay, setOverlay] = useState<OverlayType>(initialRoute.taskId ? 'task' : null)
  const [selectedTemplateId, setSelectedTemplateId] = useState(initialTemplateId)
  const [studioTemplateId, setStudioTemplateId] = useState(initialTemplateId)
  const [availableTemplates, setAvailableTemplates] = useState(templates)
  const [selectedTaskId, setSelectedTaskId] = useState(initialRoute.taskId ?? initialTasks[0].id)
  const [outputSettings, setOutputSettings] = useState<OutputSettings>(() =>
    initialDraft.templateId === initialTemplateId && initialDraft.outputSettings
      ? initialDraft.outputSettings
      : outputDefaultsForTemplate(templates.find((template) => template.id === initialTemplateId) ?? templates[0]),
  )
  const [selectedStudioAssetId, setSelectedStudioAssetId] = useState(initialDraft.assetId ?? '')
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [authMode, setAuthMode] = useState<AuthMode>('login')
  const [creditBalance, setCreditBalance] = useState(1280)
  const [frozenCredits, setFrozenCredits] = useState(138)
  const [demoTasks, setDemoTasks] = useState<Task[]>(initialTasks)
  const [unseenCompletedTaskIds, setUnseenCompletedTaskIds] = useState<string[]>([])
  const [demoAssets, setDemoAssets] = useState<Asset[]>(initialAssets)
  const [demoLedgerRows, setDemoLedgerRows] = useState<LedgerRow[]>(initialLedgerRows)
  const [assetFilterOptions, setAssetFilterOptions] = useState<AssetFilter[]>(baseAssetFilters)
  const [customAssetFilters, setCustomAssetFilters] = useState<AssetFilter[]>(customAssetFilterSeed)
  const [rechargePackageOptions, setRechargePackageOptions] = useState<RechargePackage[]>(rechargePackages)
  const [paymentOrder, setPaymentOrder] = useState<PaymentOrder>(initialPaymentOrder)
  const [signupRewardStatus, setSignupRewardStatus] = useState<SignupRewardStatus>('eligible')
  const [uploadReceipt, setUploadReceipt] = useState<UploadReceipt>(initialUploadReceipt)
  const [qrLoginSession, setQrLoginSession] = useState<QrLoginSession>(initialQrLoginSession)
  const [session, setSession] = useState<SessionState>({ authenticated: false })
  const [toast, setToast] = useState<ToastState>(null)
  const [previewMedia, setPreviewMedia] = useState<PreviewMedia>({
    title: templates[0].title,
    image: templates[0].image,
    kind: 'image',
  })

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 5200)
    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    window.localStorage.setItem(studioDraftKey, JSON.stringify({
      templateId: studioTemplateId,
      assetId: selectedStudioAssetId,
      outputSettings,
    } satisfies StoredStudioDraft))
  }, [outputSettings, selectedStudioAssetId, studioTemplateId])

  useEffect(() => {
    const handleHistoryChange = () => {
      const intent = routeIntentFromHash(window.location.hash)
      setActiveView(intent.view)
      const hasValidTemplate = Boolean(intent.templateId && templates.some((template) => template.id === intent.templateId))
      if (intent.view === 'workbench') setCreationStage(hasValidTemplate ? 'edit' : 'choose')
      if (intent.worksSection) setWorksSection(intent.worksSection)
      setOverlay(intent.taskId ? 'task' : null)
      if (intent.templateId && hasValidTemplate) {
        setSelectedTemplateId(intent.templateId)
        setStudioTemplateId(intent.templateId)
      }
      if (intent.taskId) {
        setSelectedTaskId(intent.taskId)
      }
      const canonicalHash = intent.view === 'workbench' && intent.templateId && !hasValidTemplate
        ? '#/create'
        : intent.canonicalHash
      if (window.location.hash !== canonicalHash) {
        window.history.replaceState({ view: intent.view }, '', canonicalHash)
      }
    }
    handleHistoryChange()
    window.addEventListener('popstate', handleHistoryChange)
    window.addEventListener('hashchange', handleHistoryChange)
    return () => {
      window.removeEventListener('popstate', handleHistoryChange)
      window.removeEventListener('hashchange', handleHistoryChange)
    }
  }, [])

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
  const assetFilters = useMemo(
    () => [...assetFilterOptions, ...customAssetFilters.filter((filter) => !assetFilterOptions.includes(filter))],
    [assetFilterOptions, customAssetFilters],
  )
  const filteredTemplates = useMemo(() => {
    const trimmedSearch = searchTerm.trim().toLowerCase()

    const templateMatchesFilter = (template: (typeof availableTemplates)[number], filter: string) => {
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
    }

    return availableTemplates.filter((template) => {
      const textMatch =
        !trimmedSearch ||
        [template.title, template.category, template.scenario, ...template.tags].join(' ').toLowerCase().includes(trimmedSearch)
      const selectedGroups = filterGroups
        .map((group) => group.items.filter((option) => selectedFilters.includes(option)))
        .filter((options) => options.length > 0)
      const filterMatch = selectedGroups.every((options) => options.some((filter) => templateMatchesFilter(template, filter)))

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
        setSession({ authenticated: sessionResult.data.authenticated, user: sessionResult.data.user })
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
            : '',
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
  const openTemplatePicker = () => {
    setCreationStage('choose')
    setActiveView('workbench')
    setOverlay(null)
    if (window.location.hash !== '#/create') window.history.pushState({ view: 'workbench' }, '', '#/create')
  }
  const openFilters = () => setOverlay('filters')
  const openAssetPicker = () => setOverlay('assetPicker')
  const clearFilters = () => setSelectedFilters([])
  const selectStudioAsset = (assetId: string) => {
    setSelectedStudioAssetId(assetId)
    if (assetId) trackProductEvent('asset_selected', { assetId, source: 'studio' })
  }
  const addLedgerRow = (row: LedgerRow) => setDemoLedgerRows((current) => [row, ...current].slice(0, 8))

  const goToView = (view: ViewId) => {
    if (view === 'templates') trackProductEvent('all_templates_opened', { source: activeView })
    if (view === 'works') {
      setWorksSection('generations')
      setUnseenCompletedTaskIds([])
    }
    if (view === 'workbench') setCreationStage('choose')
    setOverlay(null)
    setActiveView(view)
    const nextHash = hashForView(view)
    if (window.location.hash !== nextHash) window.history.pushState({ view }, '', nextHash)
  }

  const openAccount = (section: AccountSection = 'profile') => {
    setAccountSection(section)
    setOverlay('account')
  }

  const openTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId)
    setOverlay('template')
  }

  const openStudio = (templateId = studioTemplateId) => {
    const nextTemplate = availableTemplates.find((template) => template.id === templateId) ?? availableTemplates[0] ?? templates[0]
    const selectedAsset = demoAssets.find((asset) => asset.id === selectedStudioAssetId)
    setStudioTemplateId(nextTemplate.id)
    setSelectedTemplateId(nextTemplate.id)
    setOutputSettings(outputDefaultsForTemplate(nextTemplate))
    if (selectedAsset && !canUseAssetForTemplate(selectedAsset, nextTemplate)) setSelectedStudioAssetId('')
    setOverlay(null)
    setCreationStage('edit')
    setActiveView('workbench')
    window.history.pushState(
      { view: 'workbench', templateId: nextTemplate.id },
      '',
      `#/create?template=${encodeURIComponent(nextTemplate.id)}`,
    )
  }

  const resumeStudioDraft = () => openStudio(studioTemplateId)

  const selectStudioTemplate = (templateId: string) => {
    const nextTemplate = availableTemplates.find((template) => template.id === templateId)
    if (!nextTemplate || nextTemplate.config.workflowType === 'video-remix') return

    const selectedAsset = demoAssets.find((asset) => asset.id === selectedStudioAssetId)
    const keepsAsset = Boolean(selectedAsset && canUseAssetForTemplate(selectedAsset, nextTemplate))

    setStudioTemplateId(nextTemplate.id)
    setSelectedTemplateId(nextTemplate.id)
    setOutputSettings((current) => ({
      ...current,
      ratio: nextTemplate.ratio,
      duration: nextTemplate.duration,
    }))
    if (selectedAsset && !keepsAsset) setSelectedStudioAssetId('')
    setOverlay(null)
    setCreationStage('edit')
    setActiveView('workbench')
    window.history.pushState(
      { view: 'workbench', templateId: nextTemplate.id },
      '',
      `#/create?template=${encodeURIComponent(nextTemplate.id)}`,
    )
    setToast({
      title: '模板已更换',
      text: keepsAsset ? `已保留当前素材，准备使用“${nextTemplate.title}”。` : `已选择“${nextTemplate.title}”。`,
    })
  }

  const openTask = (taskId: string) => {
    setSelectedTaskId(taskId)
    setUnseenCompletedTaskIds((current) => current.filter((id) => id !== taskId))
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

  const addUploadedAsset = (file: File, source: string, useInStudio = false, kind: AssetKind = 'image') => {
    const uploadId = `UP-${Date.now()}`
    const expectedMediaType = kind === 'video' ? 'video/' : 'image/'
    const inputLabel = kind === 'portrait' ? '人像照片' : kind === 'video' ? '视频素材' : '图片'

    setUploadReceipt({
      id: uploadId,
      fileName: file.name || '未命名文件',
      status: 'validating',
      progress: 18,
      source,
      message: `正在检查${inputLabel}格式和大小。`,
    })

    if (!file.type.startsWith(expectedMediaType)) {
      setUploadReceipt({
        id: uploadId,
        fileName: file.name || '未命名文件',
        status: 'failed',
        progress: 0,
        source,
        message: '暂不支持这种文件格式。',
      })
      setToast({
        title: '文件格式不支持',
        text: kind === 'video' ? '请上传 MP4、MOV 等视频文件。' : '请上传 PNG、JPG、WebP 等图片文件。',
      })
      return false
    }

    if (file.size > maxUploadSize) {
      setUploadReceipt({
        id: uploadId,
        fileName: file.name || '未命名文件',
        status: 'failed',
        progress: 0,
        source,
        message: `${inputLabel}不能超过 8MB。`,
      })
      setToast({ title: '文件过大', text: `${inputLabel}请控制在 8MB 以内。` })
      return false
    }

    if (/reject|blocked/i.test(file.name)) {
      setUploadReceipt({
        id: uploadId,
        fileName: file.name || '未命名文件',
        status: 'rejected',
        progress: 0,
        source,
        message: `这份${inputLabel}暂时无法使用，请更换后重试。`,
      })
      setToast({ title: '素材无法使用', text: `请更换一份${inputLabel}后重试。` })
      return false
    }

    const imageUrl = URL.createObjectURL(file)
    const asset: Asset = {
      id: `A-UP-${Date.now()}`,
      name: file.name || 'uploaded-product-image.jpg',
      type: kind === 'portrait' ? '人像素材' : kind === 'video' ? '视频素材' : kind === 'logo' ? '品牌标识' : '商品主图',
      kind,
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
      message: `${inputLabel}已上传，可以开始创作。`,
    })
    if (useInStudio) setSelectedStudioAssetId(asset.id)
    setToast({ title: '素材已上传', text: `${asset.name} 可以用于当前模板。` })
    return true
  }

  const uploadLibraryAsset = (file: File) => {
    addUploadedAsset(file, '素材上传', false)
  }

  const uploadStudioAsset = (file: File, kind: AssetKind) => {
    const uploaded = addUploadedAsset(file, '制作页上传', true, kind)
    if (uploaded) setOverlay(null)
  }

  const cancelUpload = () => {
    setUploadReceipt((current) => ({
      ...current,
      status: 'cancelled',
      progress: 0,
      message: '上传已取消。',
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
    setToast({ title: '素材已重命名', text: '新名称已保存。' })
  }

  const archiveAsset = (assetId: string) => {
    setDemoAssets((current) =>
      current.map((asset) => (asset.id === assetId ? { ...asset, status: 'archived' } : asset)),
    )
    if (selectedStudioAssetId === assetId) {
      const nextReusable = demoAssets.find((asset) => asset.id !== assetId && canUseAssetForGeneration(asset))
      setSelectedStudioAssetId(nextReusable?.id ?? '')
    }
    setToast({ title: '素材已归档', text: '可以在“已归档”中找回。' })
  }

  const restoreAsset = (assetId: string) => {
    setDemoAssets((current) =>
      current.map((asset) => (asset.id === assetId ? { ...asset, status: 'library' } : asset)),
    )
    setToast({ title: '素材已恢复', text: '可以继续使用这份素材。' })
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
    setToast({ title: '分类已添加', text: `可以把素材整理到“${normalizedName}”。` })
    return true
  }

  const deleteAssetCategory = (name: string) => {
    setCustomAssetFilters((current) => current.filter((filter) => filter !== name))
    setDemoAssets((current) => current.map((asset) => (asset.type === name ? { ...asset, type: '商品主图' } : asset)))
    setToast({ title: '分类已删除', text: '其中的素材已移到“商品主图”。' })
  }

  const updateAssetCategory = (assetId: string, category: string) => {
    setDemoAssets((current) =>
      current.map((asset) => (asset.id === assetId ? { ...asset, type: category } : asset)),
    )
    setToast({ title: '分类已更新', text: `素材已移到“${category}”。` })
  }

  const downloadAsset = async (assetId: string) => {
    const asset = demoAssets.find((item) => item.id === assetId)
    if (!asset) return

    const usedDirectDownload = await downloadMedia(asset.videoSrc ?? asset.image, asset.name)
    setToast({
      title: usedDirectDownload ? '已开始下载' : '已打开文件',
      text: usedDirectDownload ? `${asset.name} 正在下载。` : '浏览器已打开文件，可以从新页面保存。',
    })
  }

  const reuseAsset = (assetId: string) => {
    const asset = demoAssets.find((item) => item.id === assetId)
    if (!asset || !canUseAssetForGeneration(asset)) {
      setToast({ title: '暂不可复用', text: '当前模板只接受图片、人像或品牌标识。' })
      return
    }
    const compatibleTemplate = canUseAssetForTemplate(asset, selectedStudioTemplate)
      ? selectedStudioTemplate
      : availableTemplates.find((template) => canUseAssetForTemplate(asset, template))
    if (!compatibleTemplate) {
      setToast({ title: '没有匹配模板', text: '当前素材类型暂时没有可用模板。' })
      return
    }
    setStudioTemplateId(compatibleTemplate.id)
    setSelectedTemplateId(compatibleTemplate.id)
    setOutputSettings(outputDefaultsForTemplate(compatibleTemplate))
    setSelectedStudioAssetId(asset.id)
    setCreationStage('edit')
    setActiveView('workbench')
    window.history.pushState(
      { view: 'workbench', templateId: compatibleTemplate.id },
      '',
      `#/create?template=${encodeURIComponent(compatibleTemplate.id)}`,
    )
    setToast({ title: '已用于创作', text: `${asset.name} 将使用“${compatibleTemplate.title}”。` })
  }

  const reuseTask = (taskId: string) => {
    const task = demoTasks.find((item) => item.id === taskId)
    if (!task?.params) return

    const taskTemplate = availableTemplates.find((template) => template.id === task.params?.templateId)
    if (!taskTemplate || taskTemplate.config.workflowType === 'video-remix') {
      setToast({ title: '模板暂不可用', text: '这个作品使用的模板当前无法再次制作。' })
      return
    }

    const taskAsset = demoAssets.find(
      (asset) => asset.id === task.params?.imageId && canUseAssetForTemplate(asset, taskTemplate),
    )
    setStudioTemplateId(taskTemplate.id)
    setSelectedTemplateId(taskTemplate.id)
    setOutputSettings({
      ratio: task.params.ratio,
      duration: task.params.duration,
      resolution: task.params.resolution,
      quality: task.params.quality,
    })
    setSelectedStudioAssetId(taskAsset?.id ?? '')
    setOverlay(null)
    setCreationStage('edit')
    setActiveView('workbench')
    window.history.pushState(
      { view: 'workbench', templateId: taskTemplate.id },
      '',
      `#/create?template=${encodeURIComponent(taskTemplate.id)}`,
    )
    setToast({
      title: '已恢复制作设置',
      text: taskAsset ? '模板、素材和参数已带入创作页。' : '模板和参数已恢复，请重新选择素材。',
    })
  }

  const downloadTaskResult = async (taskId: string) => {
    const task = demoTasks.find((item) => item.id === taskId)
    if (!task || task.status !== 'success') return

    const fileName = generatedOutputName(task)
    const usedDirectDownload = await downloadMedia(task.videoSrc ?? task.image, fileName)
    setToast({
      title: usedDirectDownload ? '已开始下载' : '已打开文件',
      text: usedDirectDownload ? `${fileName} 正在下载。` : '浏览器已打开文件，可以从新页面保存。',
    })
  }

  const openAssetLibrary = () => {
    setOverlay(null)
    setWorksSection('assets')
    setActiveView('works')
  }

  const openAuth = (mode: AuthMode) => {
    setAuthMode(mode)
    setOverlay('auth')
  }

  const updateQrLoginStatus = (status: QrLoginStatus) => {
    setQrLoginSession((current) => ({ ...current, status }))
    if (status === 'confirmed') {
      setSession({
        authenticated: true,
        user: { id: 'USER-PROTOTYPE', displayName: '演示用户' },
      })
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

  const logout = () => {
    setSession({ authenticated: false })
    setQrLoginSession((current) => ({ ...current, status: 'waiting' }))
    setToast({ title: '已退出登录', text: '本地创作内容仍保留在当前演示会话中。' })
  }

  const toggleFilter = (filter: string) => {
    setSelectedFilters((current) =>
      current.includes(filter) ? current.filter((item) => item !== filter) : [...current, filter],
    )
  }

  const submitBatchGeneration = (portraitConsentConfirmed = false) => {
    const selectedAsset = selectedStudioAssetId
      ? demoAssets.find(
          (asset) => asset.id === selectedStudioAssetId && canUseAssetForTemplate(asset, selectedStudioTemplate),
        )
      : undefined
    const totalCost = selectedStudioTemplate.cost

    if (!selectedAsset) {
      setToast({ title: '缺少图片', text: '请先上传或选择一张图片后再生成视频。' })
      return
    }
    if (selectedStudioTemplate.config.workflowType === 'portrait-to-video' && !portraitConsentConfirmed) {
      setToast({ title: '请确认肖像授权', text: '确认已获得人物授权后才能提交生成。' })
      return
    }
    if (creditBalance < totalCost) {
      setToast({ title: '积分不足', text: `本次需要 ${totalCost} 积分，可以充值或选择其他模板。` })
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
    trackProductEvent('generation_submitted', { taskId: newTask.id, templateId: selectedStudioTemplate.id, cost: totalCost })
    setSelectedTaskId(newTask.id)
    setCreditBalance((current) => current - totalCost)
    setFrozenCredits((current) => current + totalCost)
    addLedgerRow({
      id: `L-${newTask.id}-FREEZE`,
      title: newTask.title,
      amount: `-${totalCost}`,
      source: selectedStudioTemplate.title,
      kind: 'freeze',
      status: 'frozen',
      refId: newTask.id,
      time: '刚刚',
      note: '生成时暂时预留，未完成会自动退回。',
    })
    setToast({
      title: '已开始生成',
      text: `视频正在后台生成，已预留 ${totalCost} 积分。`,
    })
  }

  const completeTask = useCallback((task: Task) => {
    setUnseenCompletedTaskIds((current) => current.includes(task.id) ? current : [...current, task.id])
    setFrozenCredits((current) => Math.max(0, current - task.cost))
    setDemoLedgerRows((current) => [
      {
        id: `L-${task.id}-SETTLE`,
        title: task.title,
        amount: `-${task.cost}`,
        source: '视频生成',
        kind: 'settlement',
        status: 'settled',
        refId: task.id,
        time: '刚刚',
        note: '视频已生成并保存到素材。',
      },
      ...current.filter((row) => row.refId !== task.id),
    ])
    setDemoAssets((current) => {
      if (current.some((asset) => asset.source === task.id)) return current
      return [
        {
          id: `A-OUT-${task.id}`,
          name: generatedOutputName(task),
          type: '生成视频',
          kind: 'video',
          image: task.image,
          videoSrc: videoPreviewSrc,
          expires: '30 天后过期',
          status: 'library',
          source: task.id,
        },
        ...current,
      ]
    })
    setToast({ title: '视频已完成', text: `${task.title} 已保存到作品库。` })
  }, [])

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
                message: '生成超时，积分已经退回。',
              },
            }
          : item,
      ),
    )
    setFrozenCredits((current) => Math.max(0, current - task.cost))
    setCreditBalance((current) => current + task.cost)
    setDemoLedgerRows((current) => [
      {
        id: `L-${task.id}-RELEASE`,
        title: task.title,
        amount: `+${task.cost}`,
        source: '自动退回',
        kind: 'release',
        status: 'released',
        refId: task.id,
        time: '刚刚',
        note: '本次未生成成功，积分已经退回。',
      },
      ...current.filter((row) => row.refId !== task.id),
    ])
    setToast({ title: '积分已退回', text: `${task.cost} 积分已回到余额。` })
  }

  const createPaymentOrder = (pack: RechargePackage) => {
    setPaymentOrder({
      id: `PAY-${Date.now()}`,
      packageId: pack.id,
      packageName: pack.name,
      amountMinor: pack.amountMinor,
      currency: pack.currency,
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
    setPaymentOrder((current) => ({
      ...current,
      status,
      note: status === 'paid' ? '充值成功，积分已到账。' : current.note,
    }))
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
        note: '充值成功，积分已加入余额。',
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

  useEffect(() => {
    if (aigcApiConfig.mode !== 'prototype') return
    const newestPrototypeTask = demoTasks.find((task) => activeStatuses.includes(task.status))
    if (!newestPrototypeTask) return

    const nextByStatus: Partial<Record<TaskStatus, Pick<Task, 'status' | 'progress' | 'updated'>>> = {
      queued: { status: 'running', progress: 26, updated: '刚刚' },
      running: { status: 'rendering', progress: 64, updated: '刚刚' },
      rendering: { status: 'review', progress: 88, updated: '刚刚' },
      review: { status: 'success', progress: 100, updated: '刚刚' },
    }
    const next = nextByStatus[newestPrototypeTask.status]
    if (!next) return

    const timer = window.setTimeout(() => {
      setDemoTasks((current) =>
        current.map((task) => (task.id === newestPrototypeTask.id ? { ...task, ...next } : task)),
      )

      if (next.status === 'success') completeTask({ ...newestPrototypeTask, ...next })
    }, 1600)
    return () => window.clearTimeout(timer)
  }, [completeTask, demoTasks])

  useEffect(() => {
    if (activeView === 'works') setUnseenCompletedTaskIds([])
  }, [activeView, demoTasks])

  useEffect(() => {
    if (aigcApiConfig.mode !== 'prototype' || paymentOrder.status !== 'pending') return
    const timer = window.setTimeout(() => {
      setPaymentOrder((current) => ({ ...current, status: 'paid', note: '充值成功，积分已到账。' }))
      setCreditBalance((current) => current + paymentOrder.credits)
      setDemoLedgerRows((current) => [
        {
          id: `L-${paymentOrder.id}-RECHARGE`,
          title: `${paymentOrder.packageName} 充值`,
          amount: `+${paymentOrder.credits}`,
          source: '充值',
          kind: 'recharge',
          status: 'credited',
          refId: paymentOrder.id,
          time: '刚刚',
          note: '充值成功，积分已加入余额。',
        },
        ...current.filter((row) => row.id !== `L-${paymentOrder.id}-RECHARGE`),
      ])
      setToast({ title: '积分已到账', text: `${paymentOrder.credits} 积分已加入余额。` })
    }, 1800)
    return () => window.clearTimeout(timer)
  }, [paymentOrder])

  useEffect(() => {
    if (aigcApiConfig.mode !== 'prototype' || qrLoginSession.status !== 'scanned') return
    const timer = window.setTimeout(() => {
      setQrLoginSession((current) => ({ ...current, status: 'confirmed' }))
      setSession({
        authenticated: true,
        user: { id: 'USER-PROTOTYPE', displayName: '演示用户' },
      })
      setToast({ title: '扫码登录成功', text: '登录成功，可以继续创作。' })
    }, 1200)
    return () => window.clearTimeout(timer)
  }, [qrLoginSession])

  const applyTemplateFilters = () => {
    setOverlay(null)
    setToast({ title: '筛选已应用', text: `当前匹配 ${filteredTemplates.length} 个模板。` })
  }

  const selectAssetFromPicker = (assetId: string) => {
    setSelectedStudioAssetId(assetId)
    trackProductEvent('asset_selected', { assetId, source: 'picker' })
    setOverlay(null)
    const asset = demoAssets.find((item) => item.id === assetId)
    if (asset) setToast({ title: '图片已选择', text: `${asset.name} 已用于当前创作。` })
  }

  return {
    accountSection,
    activeView,
    assetFilters,
    authMode,
    availableTemplates,
    creditBalance,
    creationStage,
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
    session,
    selectedFilters,
    selectedStudioAssetId,
    selectedStudioTemplate,
    selectedTask,
    selectedTemplate,
    signupRewardStatus,
    toast,
    uploadReceipt,
    worksSection,
    hasStudioDraft: Boolean(selectedStudioAssetId),
    newWorkCount: unseenCompletedTaskIds.length,
    isPrototype: aigcApiConfig.mode === 'prototype',
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
    openAccount,
    openAuth,
    openCredits,
    openFilters,
    openPreview,
    openStudio,
    openTask,
    openTemplate,
    openTemplatePicker,
    refreshQrLoginSession,
    refundTask,
    renameAsset,
    resumeStudioDraft,
    resolvePaymentOrder,
    restoreAsset,
    retryUpload,
    reuseAsset,
    reuseTask,
    selectAssetFromPicker,
    selectStudioTemplate,
    selectStudioAsset,
    setAuthMode,
    setSearchTerm,
    setToast,
    setWorksSection,
    submitBatchGeneration,
    toggleFilter,
    updateAssetCategory,
    updateOutputSetting,
    updateQrLoginStatus,
    logout,
    uploadLibraryAsset,
    uploadStudioAsset,
  }
}
