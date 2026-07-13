export type ProductEventName =
  | 'home_opened'
  | 'primary_nav_clicked'
  | 'create_template_feed_opened'
  | 'template_carousel_changed'
  | 'all_templates_opened'
  | 'template_filter_changed'
  | 'template_selected'
  | 'draft_resumed'
  | 'asset_selected'
  | 'generation_submitted'
  | 'avatar_menu_opened'
  | 'account_menu_item_clicked'

export const trackProductEvent = (event: ProductEventName, properties: Record<string, unknown> = {}) => {
  window.dispatchEvent(new CustomEvent('aigc:product-event', {
    detail: { event, properties, timestamp: new Date().toISOString() },
  }))
}
