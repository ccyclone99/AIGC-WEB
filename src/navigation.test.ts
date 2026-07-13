import { describe, expect, it } from 'vitest'

import { hashForView, routeIntentFromHash, viewFromHash } from './navigation'

describe('hash navigation', () => {
  it('creates stable routes for primary views', () => {
    expect(hashForView('workbench')).toBe('#/create')
    expect(hashForView('templates')).toBe('#/templates')
    expect(hashForView('works')).toBe('#/works')
  })

  it('restores current views and falls back to home', () => {
    expect(viewFromHash('#/works')).toBe('works')
    expect(viewFromHash('#/create?template=watch')).toBe('workbench')
    expect(viewFromHash('#/unknown')).toBe('home')
  })

  it('keeps the all-templates page and maps legacy task routes', () => {
    expect(routeIntentFromHash('#/templates/')).toMatchObject({
      view: 'templates',
      canonicalHash: '#/templates',
    })
    expect(routeIntentFromHash('#/templates/watch')).toMatchObject({
      view: 'workbench',
      canonicalHash: '#/create?template=watch',
      templateId: 'watch',
    })
    expect(routeIntentFromHash('#/tasks')).toMatchObject({
      view: 'works',
      canonicalHash: '#/works?status=active',
      worksSection: 'generations',
    })
    expect(routeIntentFromHash('#/me')).toMatchObject({
      view: 'works',
      canonicalHash: '#/works?tab=assets',
      worksSection: 'assets',
    })
  })
})
