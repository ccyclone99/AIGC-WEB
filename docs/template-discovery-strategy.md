# Template Discovery, Search, and Recommendation Strategy

Status: Draft proposal

This document defines how users discover templates and how the platform manages template categories, search, ranking, and recommendations.

## Goals

- Help ecommerce users quickly find the right template.
- Make ecommerce product-video templates the first-phase focus.
- Reserve room for portrait/fashion and future content sections.
- Support campaigns and featured templates.
- Use analytics to improve ranking and recommendations.
- Keep discovery simple enough for MVP.

## Discovery Principles

- Templates are productized creation workflows, not raw model prompts.
- Template cards should show expected output clearly.
- Credit cost and required inputs should be visible early.
- Users should be able to start creation quickly.
- Search/filter should not overwhelm first-time users.
- Ranking should combine editorial control and performance data.

## Primary Categories

MVP categories:

- Ecommerce video.
- Portrait/fashion transformation.

Reserved future categories:

- Real estate.
- Restaurant/local business.
- Education/course.
- Social media posts.
- Brand ads.
- Product photo enhancement.
- Live commerce assets.
- Festival/seasonal campaigns.

## Ecommerce Template Taxonomy

Suggested ecommerce scenarios:

- Product showcase.
- New product launch.
- Sale/promotion.
- Before/after comparison.
- Feature highlight.
- Lifestyle usage.
- Problem/solution ad.
- Testimonial style.
- Unboxing style.
- Platform-specific short video.

Filters:

- Platform: TikTok/Douyin, Xiaohongshu, Taobao/Tmall, Amazon, Shopify, Instagram.
- Aspect ratio: 9:16, 1:1, 16:9.
- Duration: 6s, 10s, 15s.
- Style: premium, energetic, minimalist, trendy, luxury, clean.
- Input type: product image only, product + text, product + model/person.
- Credit cost.
- Preview support.

## Template Card Requirements

Each card should show:

- Template cover/sample preview.
- Template name.
- Category/scenario.
- Credit cost or starting credit cost.
- Output ratio/duration tags.
- Required input summary.
- Watermark/free eligibility if relevant.
- New/hot/recommended/campaign badges.

Interactions:

- Hover/tap preview.
- Flip/reveal details in prototype variants.
- Quick start button.
- Save/favorite later if useful.

## Template Detail Requirements

Detail page should show:

- Sample outputs.
- What user needs to upload/provide.
- What output they get.
- Estimated generation time.
- Credit cost and dynamic cost options.
- Supported platforms/ratios.
- Preview/draft support if available.
- Start creation.

## Search and Filters

MVP:

- Category tabs.
- Scenario filters.
- Platform filter.
- Ratio/duration tags.
- Sort by recommended/new/popular.

Can be delayed:

- Full-text search.
- Semantic search.
- Personalized recommendation.
- Saved/favorite templates.

## Ranking Strategy

Ranking inputs:

- Manual/editorial priority.
- Featured flag.
- Campaign promotion.
- Template freshness.
- Creation-start rate.
- Generation-submit rate.
- Success rate.
- Download/save rate.
- Recharge influence.
- Complaint/failure rate.
- Provider cost/margin.

MVP:

- Manual sort weight + featured + status.

Later:

- Blend manual ranking with analytics-driven score.

## Recommendation Strategy

Simple recommendation sources:

- Similar templates by category/scenario.
- Templates matching saved product/brand context.
- Templates popular among ecommerce users.
- Templates with high conversion/success.
- Campaign-promoted templates.

Agent can:

- Recommend homepage placements.
- Detect templates with low conversion.
- Suggest new template categories from search/no-result behavior.
- Suggest retiring or pausing poor-performing templates.

## Campaign and Seasonal Sections

Support:

- Featured section.
- New templates.
- Hot ecommerce templates.
- Campaign collection.
- Limited-time credit reward templates.
- Seasonal/holiday sections.

Campaign sections should link to:

- Credit campaign rules.
- Template list.
- Eligibility.
- Time window.

## Reserved Future Sections

Navigation can reserve:

- Ecommerce.
- Portrait/Fashion.
- More templates.
- My assets.
- Tasks.
- Credits.

Avoid showing too many empty categories in MVP. Reserved categories can appear as "coming soon" only when useful for positioning.

## Admin/Agent Operations

Admin/Agent can manage:

- Category.
- Scenario.
- Tags.
- Sort weight.
- Featured flag.
- Campaign association.
- Visibility.
- Template card copy.
- Preview media.

Agent can propose:

- Better card copy.
- Better tags.
- Category changes.
- Ranking changes.
- Campaign collections.

High-risk or homepage-visible changes should require review.

## MVP Requirements

Required:

- Template category model.
- Template gallery.
- Ecommerce and portrait/fashion categories.
- Template cards with preview, cost, tags, and quick start.
- Manual sort/featured controls.
- Basic filters.
- Template detail or equivalent pre-creation overview.

Can be delayed:

- Semantic search.
- Personalized recommendation.
- Favorite templates.
- Advanced ranking algorithm.
- Full marketplace-style discovery.

## Open Questions

- Exact first homepage categories.
- Whether template detail page is separate or integrated into creation workspace.
- Which card motion prototype is selected.
- Whether search is needed in MVP or category/filter is enough.
- Whether "coming soon" sections should be visible.

## Decision

Build simple but polished template discovery first: ecommerce-forward gallery, strong sample previews, clear credit cost, basic filters, manual featured/sort controls, and reserved future categories without overloading MVP.
