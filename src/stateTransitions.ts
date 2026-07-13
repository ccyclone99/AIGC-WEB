import { generatedOutputName } from './domain'
import type { Asset, LedgerKind, LedgerRow, PaymentOrder, Task } from './types'

const taskResolutionKinds: LedgerKind[] = ['settlement', 'release']

export const claimIdOnce = (registry: Set<string>, id: string) => {
  if (registry.has(id)) return false
  registry.add(id)
  return true
}

export const resolvedTaskIdsFromLedger = (rows: LedgerRow[]) =>
  new Set(rows.filter((row) => taskResolutionKinds.includes(row.kind)).map((row) => row.refId))

export const creditedPaymentIdsFromLedger = (rows: LedgerRow[]) =>
  new Set(rows.filter((row) => row.kind === 'recharge' && row.status === 'credited').map((row) => row.refId))

export const completeTaskState = (task: Task, completedAt: string, fallbackVideoSrc: string): Task => {
  const expiresAt = new Date(new Date(completedAt).getTime() + 30 * 86_400_000).toISOString()

  return {
    ...task,
    status: 'success',
    progress: 100,
    updated: '刚刚',
    completedAt,
    videoSrc: task.videoSrc ?? fallbackVideoSrc,
    output: task.output ?? {
      format: 'MP4',
      size: `${(task.cost / 9).toFixed(1)} MB`,
      expiresAt,
      retentionLabel: '保存 30 天',
    },
  }
}

export const taskSettlementLedgerRow = (task: Task): LedgerRow => ({
  id: `L-${task.id}-SETTLE`,
  title: task.title,
  amount: `-${task.cost}`,
  source: '视频生成',
  kind: 'settlement',
  status: 'settled',
  refId: task.id,
  time: '刚刚',
  note: '视频已生成并保存到素材。',
})

export const generatedAssetForTask = (task: Task, fallbackVideoSrc: string): Asset => ({
  id: `A-OUT-${task.id}`,
  name: generatedOutputName(task),
  type: '生成视频',
  kind: 'video',
  image: task.image,
  videoSrc: task.videoSrc ?? fallbackVideoSrc,
  expires: task.output?.retentionLabel === '保存 30 天' ? '30 天后过期' : task.output?.retentionLabel ?? '长期保存',
  status: 'library',
  source: task.id,
})

export const refundTaskState = (task: Task, failedAt: string): Task => ({
  ...task,
  status: 'refunded',
  progress: 100,
  updated: '刚刚',
  failedAt,
  failure: {
    reason: 'timeout',
    stage: 'provider',
    code: 'TASK_TIMEOUT_RELEASED',
    retryable: true,
    message: '生成超时，积分已经退回。',
  },
})

export const taskReleaseLedgerRow = (task: Task): LedgerRow => ({
  id: `L-${task.id}-RELEASE`,
  title: task.title,
  amount: `+${task.cost}`,
  source: '自动退回',
  kind: 'release',
  status: 'released',
  refId: task.id,
  time: '刚刚',
  note: '本次未生成成功，积分已经退回。',
})

export const paymentRechargeLedgerRow = (order: PaymentOrder): LedgerRow => ({
  id: `L-${order.id}-RECHARGE`,
  title: `${order.packageName} 充值到账`,
  amount: `+${order.credits}`,
  source: order.id,
  kind: 'recharge',
  status: 'credited',
  refId: order.id,
  time: '刚刚',
  note: '充值成功，积分已加入余额。',
})

type WorkMutationResult = {
  tasks: Task[]
  assets: Asset[]
  task?: Task
}

export const renameCompletedTaskState = (
  tasks: Task[],
  assets: Asset[],
  taskId: string,
  nextTitle: string,
): WorkMutationResult => {
  const title = nextTitle.trim()
  const task = tasks.find((item) => item.id === taskId)
  if (!task || task.status !== 'success' || !title) return { tasks, assets }

  const renamedTask = { ...task, title }
  return {
    task: renamedTask,
    tasks: tasks.map((item) => (item.id === taskId ? renamedTask : item)),
    assets: assets.map((asset) =>
      asset.source === taskId ? { ...asset, name: generatedOutputName(renamedTask) } : asset,
    ),
  }
}

export const deleteCompletedTaskState = (
  tasks: Task[],
  assets: Asset[],
  taskId: string,
): WorkMutationResult => {
  const task = tasks.find((item) => item.id === taskId)
  if (!task || task.status !== 'success') return { tasks, assets }

  return {
    task,
    tasks: tasks.filter((item) => item.id !== taskId),
    assets: assets.filter((asset) => asset.source !== taskId),
  }
}
