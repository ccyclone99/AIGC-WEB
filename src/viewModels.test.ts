import { describe, expect, it } from 'vitest'

import { initialTasks } from './prototypeData'
import {
  filterTasksForWorks,
  formatWorkCardDate,
  formatWorkDateOnly,
  formatWorkExactDate,
  taskStatusCopy,
  worksTaskCounts,
} from './viewModels'

describe('customer-facing task status', () => {
  it('uses clear action-oriented labels', () => {
    expect(taskStatusCopy('queued').label).toBe('等待生成')
    expect(taskStatusCopy('rendering').label).toBe('处理成片')
    expect(taskStatusCopy('review').label).toBe('保存作品')
    expect(taskStatusCopy('refunded').label).toBe('需处理')
  })
})

describe('works library defaults', () => {
  it('keeps failed tasks out of the default recent view', () => {
    const visible = filterTasksForWorks(initialTasks, 'recent')

    expect(visible.every((task) => task.status !== 'refunded')).toBe(true)
    expect(visible.map((task) => task.status)).toEqual(['rendering', 'success'])
  })

  it('reports counts for each visible work state', () => {
    expect(worksTaskCounts(initialTasks)).toEqual({ active: 1, success: 1, refunded: 3, recent: 2 })
  })
})

describe('work date copy', () => {
  const now = new Date('2026-07-13T19:00:00+08:00')

  it('uses concise dates on cards', () => {
    expect(formatWorkCardDate('2026-07-13T18:20:00+08:00', now)).toBe('今天 18:20')
    expect(formatWorkCardDate('2026-07-12T09:05:00+08:00', now)).toBe('昨天 09:05')
    expect(formatWorkCardDate('2026-06-25T16:42:00+08:00', now)).toBe('6月25日 16:42')
  })

  it('uses complete dates in details', () => {
    expect(formatWorkExactDate('2026-07-13T18:20:00+08:00')).toBe('2026年7月13日 18:20')
    expect(formatWorkDateOnly('2026-08-12T18:20:00+08:00')).toBe('2026年8月12日')
  })
})
