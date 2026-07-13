import { describe, expect, it } from 'vitest'

import { initialLedgerRows, initialPaymentOrder, initialTasks, videoPreviewSrc } from './prototypeData'
import {
  claimIdOnce,
  completeTaskState,
  creditedPaymentIdsFromLedger,
  deleteCompletedTaskState,
  generatedAssetForTask,
  paymentRechargeLedgerRow,
  refundTaskState,
  renameCompletedTaskState,
  resolvedTaskIdsFromLedger,
  taskReleaseLedgerRow,
  taskSettlementLedgerRow,
} from './stateTransitions'

describe('task transitions', () => {
  it('creates a completed task, settlement and generated asset from one source task', () => {
    const completedAt = '2026-07-13T20:30:00+08:00'
    const completed = completeTaskState(initialTasks[0], completedAt, videoPreviewSrc)
    const settlement = taskSettlementLedgerRow(completed)
    const asset = generatedAssetForTask(completed, videoPreviewSrc)

    expect(completed).toMatchObject({ status: 'success', progress: 100, completedAt })
    expect(completed.output).toMatchObject({ format: 'MP4', retentionLabel: '保存 30 天' })
    expect(settlement).toMatchObject({ kind: 'settlement', status: 'settled', refId: completed.id })
    expect(asset).toMatchObject({ kind: 'video', source: completed.id, status: 'library' })
  })

  it('creates a refunded task and matching release ledger row', () => {
    const refunded = refundTaskState(initialTasks[0], '2026-07-13T20:31:00+08:00')
    const release = taskReleaseLedgerRow(refunded)

    expect(refunded).toMatchObject({ status: 'refunded', progress: 100 })
    expect(refunded.failure).toMatchObject({ reason: 'timeout', retryable: true })
    expect(release).toMatchObject({ kind: 'release', status: 'released', refId: refunded.id })
  })

  it('recognizes resolved tasks and only claims an id once', () => {
    const resolved = resolvedTaskIdsFromLedger(initialLedgerRows)
    expect(resolved.has(initialTasks[1].id)).toBe(true)
    expect(resolved.has(initialTasks[0].id)).toBe(false)
    expect(claimIdOnce(resolved, initialTasks[0].id)).toBe(true)
    expect(claimIdOnce(resolved, initialTasks[0].id)).toBe(false)
  })

  it('renames and deletes completed works without changing ledger data', () => {
    const completed = initialTasks[1]
    const completedAsset = generatedAssetForTask(completed, videoPreviewSrc)
    const renamed = renameCompletedTaskState(initialTasks, [completedAsset], completed.id, '  夏季腕表主片  ')

    expect(renamed.task?.title).toBe('夏季腕表主片')
    expect(renamed.assets[0].name).toBe('夏季腕表主片-成片.mp4')

    const deleted = deleteCompletedTaskState(renamed.tasks, renamed.assets, completed.id)
    expect(deleted.tasks.some((task) => task.id === completed.id)).toBe(false)
    expect(deleted.assets.some((asset) => asset.source === completed.id)).toBe(false)
    expect(initialLedgerRows.some((row) => row.refId === completed.id)).toBe(true)
  })

  it('does not rename or delete active tasks', () => {
    const activeTask = initialTasks[0]
    expect(renameCompletedTaskState(initialTasks, [], activeTask.id, '新名称').task).toBeUndefined()
    expect(deleteCompletedTaskState(initialTasks, [], activeTask.id).task).toBeUndefined()
  })
})

describe('payment transitions', () => {
  it('creates one identifiable recharge ledger entry', () => {
    const order = { ...initialPaymentOrder, id: 'PAY-TEST', status: 'paid' as const }
    const row = paymentRechargeLedgerRow(order)
    const credited = creditedPaymentIdsFromLedger([row])

    expect(row).toMatchObject({ id: 'L-PAY-TEST-RECHARGE', kind: 'recharge', refId: 'PAY-TEST' })
    expect(credited.has(order.id)).toBe(true)
  })
})
