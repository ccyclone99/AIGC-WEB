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

export const taskCreditState = (task: Task) => {
  if (activeStatuses.includes(task.status)) {
    return {
      label: '冻结中',
      text: `${task.cost} 积分冻结，失败/超时自动释放`,
      className: 'is-frozen',
    }
  }

  if (task.status === 'success') {
    return {
      label: '已结算',
      text: `${task.cost} 积分已结算，结果已入库`,
      className: 'is-settled',
    }
  }

  return {
    label: '积分释放',
    text: `${task.cost} 积分已释放，可重新提交`,
    className: 'is-released',
  }
}

export const taskStatusCopy = (status: TaskStatus) => {
  const statusMap: Record<TaskStatus, { label: string; detail: string }> = {
    queued: { label: '排队中', detail: '任务已进入队列，等待供应商和渲染资源。' },
    running: { label: '生成中', detail: '生成模型正在处理主视觉和关键帧。' },
    rendering: { label: '后期渲染', detail: '正在合成字幕、转场、比例和封面。' },
    review: { label: '审核中', detail: '正在执行内容审核和输出资产入库前检查。' },
    success: { label: '已完成', detail: '输出已生成，资产可预览、下载或复用。' },
    refunded: { label: '失败已释放', detail: '任务失败或被阻断，冻结积分已释放。' },
  }

  return statusMap[status]
}

export const failureStageLabel = (stage: TaskFailureStage) => {
  const stageMap: Record<TaskFailureStage, string> = {
    input: '输入校验',
    provider: '供应商',
    render: '后期渲染',
    moderation: '内容审核',
  }

  return stageMap[stage]
}

export const failureReasonLabel = (reason: TaskFailureReason) => {
  const reasonMap: Record<TaskFailureReason, string> = {
    provider_error: '供应商异常',
    timeout: '任务超时',
    moderation_block: '审核阻断',
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
      text: '请在手机端确认登录，网页端继续等待确认结果。',
    },
    confirmed: {
      label: '已确认',
      title: '扫码登录成功',
      text: '手机端已确认，本次 QR 会话已完成。',
    },
    expired: {
      label: '已过期',
      title: '二维码已过期',
      text: '二维码已失效，需要刷新后重新扫码。',
    },
    rejected: {
      label: '已拒绝',
      title: '手机端拒绝登录',
      text: '本次扫码登录被拒绝，账号不会登录。',
    },
  }

  return statusMap[status]
}

export const signupRewardStateCopy = (status: SignupRewardStatus) => {
  const statusMap: Record<SignupRewardStatus, { title: string; text: string; action: string }> = {
    eligible: {
      title: '可领取注册积分',
      text: '通过基础检查后，注册活动积分会写入奖励流水。',
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
      text: '账号触发活动风控，可以登录，但不能领取注册奖励。',
      action: '已阻断',
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
    全部: '资产库还没有可用素材，可以先上传商品图。',
    商品主图: '还没有商品主图，可以上传一张用于生成视频。',
    人像素材: '还没有人像素材，后续写真/变装模板会优先使用这里。',
    生成视频: '还没有生成视频，完成任务后会自动进入这里。',
    Logo: '还没有 Logo 素材，后续品牌模板会使用这里。',
    即将过期: '当前没有即将过期的资产。',
    已归档: '还没有归档资产。',
  }

  return emptyText[filter] ?? `「${filter}」分类下还没有素材，可以上传或把已有资产移入该分类。`
}
