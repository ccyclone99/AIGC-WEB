import { activeStatuses } from './prototypeData'
import type {
  AssetFilter,
  QrLoginStatus,
  RiskCheckStatus,
  SignupRewardStatus,
  Task,
  TaskFailureReason,
  TaskFailureStage,
  TaskStatus,
} from './types'

export type WorkTaskFilter = 'recent' | 'active' | 'success' | 'refunded'

const validDate = (value?: string) => {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

const padTime = (value: number) => String(value).padStart(2, '0')

const timeLabel = (date: Date) => `${padTime(date.getHours())}:${padTime(date.getMinutes())}`

export const formatWorkCardDate = (value?: string, now = new Date()) => {
  const date = validDate(value)
  if (!date) return '时间待确认'

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const dayDifference = Math.round((today.getTime() - target.getTime()) / 86_400_000)
  const time = timeLabel(date)

  if (dayDifference === 0) return `今天 ${time}`
  if (dayDifference === 1) return `昨天 ${time}`
  if (date.getFullYear() === now.getFullYear()) return `${date.getMonth() + 1}月${date.getDate()}日 ${time}`
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${time}`
}

export const formatWorkExactDate = (value?: string) => {
  const date = validDate(value)
  if (!date) return '时间待确认'
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${timeLabel(date)}`
}

export const formatWorkDateOnly = (value?: string) => {
  const date = validDate(value)
  if (!date) return '日期待确认'
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

export const filterTasksForWorks = (tasks: Task[], filter: WorkTaskFilter) =>
  tasks.filter((task) => {
    if (filter === 'recent') return activeStatuses.includes(task.status) || task.status === 'success'
    if (filter === 'active') return activeStatuses.includes(task.status)
    return task.status === filter
  })

export const worksTaskCounts = (tasks: Task[]) => {
  const active = tasks.filter((task) => activeStatuses.includes(task.status)).length
  const success = tasks.filter((task) => task.status === 'success').length
  const refunded = tasks.filter((task) => task.status === 'refunded').length
  return { active, success, refunded, recent: active + success }
}

export const taskCreditState = (task: Task) => {
  if (activeStatuses.includes(task.status)) {
    return {
      label: '生成中',
      text: `已预留 ${task.cost} 积分，未完成会自动退回`,
      className: 'is-frozen',
    }
  }

  if (task.status === 'success') {
    return {
      label: '已完成',
      text: `已使用 ${task.cost} 积分，作品已保存`,
      className: 'is-settled',
    }
  }

  return {
    label: '已退回',
    text: `${task.cost} 积分已退回`,
    className: 'is-released',
  }
}

export const taskStatusCopy = (status: TaskStatus) => {
  const statusMap: Record<TaskStatus, { label: string; detail: string }> = {
    queued: { label: '等待生成', detail: '视频已进入生成队列，请稍候。' },
    running: { label: '生成中', detail: '生成模型正在处理主视觉和关键帧。' },
    rendering: { label: '处理成片', detail: '正在处理字幕、转场、比例和封面。' },
    review: { label: '保存作品', detail: '视频即将完成，正在保存到作品库。' },
    success: { label: '已完成', detail: '视频已生成，可以预览或下载。' },
    refunded: { label: '需处理', detail: '本次未生成成功，积分已经退回。' },
  }

  return statusMap[status]
}

export const failureStageLabel = (stage: TaskFailureStage) => {
  const stageMap: Record<TaskFailureStage, string> = {
    input: '图片检查',
    provider: '生成服务',
    render: '视频合成',
    moderation: '内容确认',
  }

  return stageMap[stage]
}

export const failureReasonLabel = (reason: TaskFailureReason) => {
  const reasonMap: Record<TaskFailureReason, string> = {
    provider_error: '生成服务异常',
    timeout: '生成超时',
    moderation_block: '内容需确认',
    asset_invalid: '素材无效',
  }

  return reasonMap[reason]
}

export const qrLoginStatusCopy = (status: QrLoginStatus) => {
  const statusMap: Record<QrLoginStatus, { label: string; title: string; text: string }> = {
    waiting: {
      label: '等待扫码',
      title: '等待手机扫码',
      text: '二维码短期有效，手机端确认后才会登录。',
    },
    scanned: {
      label: '已扫码',
      title: '手机已扫码',
      text: '请在手机端完成登录，网页端会继续等待结果。',
    },
    confirmed: {
      label: '已确认',
      title: '扫码登录成功',
      text: '手机端已确认，可以继续使用。',
    },
    expired: {
      label: '已过期',
      title: '二维码已过期',
      text: '二维码已失效，需要刷新后重新扫码。',
    },
    rejected: {
      label: '已取消',
      title: '登录已取消',
      text: '本次扫码登录已取消，账号不会登录。',
    },
  }

  return statusMap[status]
}

export const signupRewardStateCopy = (status: SignupRewardStatus) => {
  const statusMap: Record<SignupRewardStatus, { title: string; text: string; action: string }> = {
    eligible: {
      title: '可领取注册积分',
      text: '完成注册后即可领取活动积分。',
      action: '领取注册积分',
    },
    granted: {
      title: '注册积分已到账',
      text: '奖励流水已生成，同一账号不会重复发放。',
      action: '已领取',
    },
    claimed: {
      title: '注册积分已领取',
      text: '系统识别到该账号已领取过注册奖励。',
      action: '已领取',
    },
    risk_blocked: {
      title: '活动积分未发放',
      text: '该账号暂不符合本次活动领取条件。',
      action: '暂不可领',
    },
  }

  return statusMap[status]
}

export const riskStatusLabel = (status: RiskCheckStatus) => {
  const statusMap: Record<RiskCheckStatus, string> = {
    pass: '通过',
    review: '复核',
    blocked: '阻断',
  }

  return statusMap[status]
}

export const assetFilterEmptyText = (filter: AssetFilter) => {
  const emptyText: Record<string, string> = {
    全部: '还没有可用素材，可以先上传商品图。',
    商品主图: '还没有商品主图，可以上传一张用于生成视频。',
    人像素材: '还没有人像素材，后续写真/变装模板会优先使用这里。',
    生成视频: '还没有生成视频，完成后会自动显示在这里。',
    品牌标识: '还没有品牌标识，后续品牌模板会使用这里。',
    即将过期: '当前没有即将过期的素材。',
    已归档: '还没有归档素材。',
  }

  return emptyText[filter] ?? `「${filter}」分类下还没有素材。`
}
