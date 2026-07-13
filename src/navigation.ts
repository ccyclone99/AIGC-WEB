import type { ViewId, WorksSection } from './types'

const routeByView: Record<ViewId, string> = {
  home: '/',
  workbench: '/create',
  templates: '/templates',
  works: '/works',
}

export const hashForView = (view: ViewId) => `#${routeByView[view]}`

export type RouteIntent = {
  view: ViewId
  canonicalHash: string
  openTemplatePicker?: boolean
  templateId?: string
  taskId?: string
  worksSection?: WorksSection
}

const parseHash = (hash: string) => {
  const raw = hash.replace(/^#/, '') || '/'
  const [rawPath, rawQuery = ''] = raw.split('?')
  const path = rawPath.replace(/\/+$/, '') || '/'
  return { path, params: new URLSearchParams(rawQuery) }
}

export const routeIntentFromHash = (hash: string): RouteIntent => {
  const { path, params } = parseHash(hash)

  if (path === '/templates') {
    return { view: 'templates', canonicalHash: '#/templates' }
  }
  if (path.startsWith('/templates/')) {
    const templateId = decodeURIComponent(path.slice('/templates/'.length))
    return { view: 'workbench', canonicalHash: `#/create?template=${encodeURIComponent(templateId)}`, templateId }
  }
  if (path === '/tasks') {
    return { view: 'works', canonicalHash: '#/works?status=active', worksSection: 'generations' }
  }
  if (path.startsWith('/tasks/')) {
    const taskId = decodeURIComponent(path.slice('/tasks/'.length))
    return {
      view: 'works',
      canonicalHash: `#/works?task=${encodeURIComponent(taskId)}`,
      taskId,
      worksSection: 'generations',
    }
  }
  if (path === '/me') {
    return { view: 'works', canonicalHash: '#/works?tab=assets', worksSection: 'assets' }
  }
  if (path === '/create') {
    const templateId = params.get('template') ?? undefined
    const query = templateId ? `?template=${encodeURIComponent(templateId)}` : ''
    return { view: 'workbench', canonicalHash: `#/create${query}`, templateId }
  }
  if (path === '/works') {
    const taskId = params.get('task') ?? undefined
    const worksSection: WorksSection = params.get('tab') === 'assets' ? 'assets' : 'generations'
    const query = taskId
      ? `?task=${encodeURIComponent(taskId)}`
      : params.get('status') === 'active'
        ? '?status=active'
        : worksSection === 'assets'
          ? '?tab=assets'
          : ''
    return { view: 'works', canonicalHash: `#/works${query}`, taskId, worksSection }
  }
  if (path === '/') return { view: 'home', canonicalHash: '#/' }

  return { view: 'home', canonicalHash: '#/' }
}

export const viewFromHash = (hash: string): ViewId => routeIntentFromHash(hash).view
