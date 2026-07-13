import { describe, expect, it } from 'vitest'

import { initialTasks } from './prototypeData'
import { filterTasksForWorks, taskStatusCopy, worksTaskCounts } from './viewModels'

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

