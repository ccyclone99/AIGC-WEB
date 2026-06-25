# Motion Prototype Plan

Status: Draft proposal

This document captures the planned multi-option frontend motion prototypes for template cards, homepage sections, and creation entry interactions.

## Research Notes

- CSS 3D card flip should use `transform-style: preserve-3d` on the card scene and `backface-visibility: hidden` on card faces.
- High-performance web animation should prioritize `transform` and `opacity`; avoid animating layout-heavy properties such as width, height, top, or left.
- View Transitions can create polished transitions between states/pages, especially template card to template detail/workspace.
- Motion for React is a good fit for React-based hover, tap, layout, and shared-element animations.
- GSAP Flip is strong for complex grid/list state transitions, but may be more than MVP needs unless the gallery becomes highly interactive.

## Prototype Principles

- Motion should make the product feel premium and alive, not gimmicky.
- Template cards should reveal useful information: sample output, required inputs, credit cost, supported platforms, and start action.
- Motion must respect reduced-motion preferences.
- Mobile interactions should use tap/expand instead of hover-only behavior.
- Prototypes should be implemented as selectable routes/pages so the team can compare them side by side.

## Prototype A: Premium Flip Gallery

Core idea:

- Template cards flip in 3D on hover or click.
- Front side shows sample video/image, category, title, and credit cost.
- Back side shows required inputs, output ratio/duration, supported platforms, and a start button.

Best for:

- Template gallery.
- Category pages.
- Reserved future content sections.

Pros:

- Directly matches the requested card-flip direction.
- Makes each template feel like a packaged product.
- Useful information can be revealed without navigating away.

Risks:

- Too many flipping cards can feel busy.
- Hover does not translate directly to mobile, so tap-to-flip is required.

Implementation direction:

- CSS 3D transforms for the actual flip.
- React state for click/tap open state.
- Reduced motion fallback: fade/slide details instead of rotate.

## Prototype B: Cinematic Hover Preview Cards

Core idea:

- Cards do not fully flip.
- Hover starts video preview, adds subtle 3D tilt, reveals a bottom action layer, and shows credit cost.

Best for:

- Ecommerce users comparing output examples.
- Home page featured templates.

Pros:

- More practical than full flip for video-heavy templates.
- Keeps the sample output visible.
- Feels premium without hiding the main asset.

Risks:

- Requires good sample videos or animated mock previews.
- Needs careful performance handling for multiple videos.

Implementation direction:

- CSS transform/opacity for tilt and reveal.
- Lazy-load video previews.
- Only play one or a small number of previews at a time.

## Prototype C: Bento Template Board

Core idea:

- A high-end bento grid with different card sizes.
- Hover/tap expands a template card into a larger detail panel using shared layout animation.
- Card-to-detail transition feels continuous rather than like a hard page jump.

Best for:

- Homepage first screen or template discovery landing.

Pros:

- Strong visual impact.
- Good for showing ecommerce, portrait, and reserved categories together.
- Feels modern and curated.

Risks:

- More layout complexity.
- Needs strict responsive QA.

Implementation direction:

- Motion for React layout animations or View Transitions.
- CSS grid with stable dimensions.
- Mobile collapses into stacked cards.

## Prototype D: Before/After Reveal Cards

Core idea:

- Card front shows user input image.
- Card back or reveal layer shows generated video/result preview.
- Interaction can be flip, drag-reveal, or tap-toggle.

Best for:

- Homepage proof section.
- Template detail page.
- Ecommerce conversion examples.

Pros:

- Communicates product value very quickly.
- Shows "upload this, get that" without explaining prompts.

Risks:

- Needs credible input/output examples.
- Full video output may need poster previews for performance.

Implementation direction:

- CSS flip or clip-path reveal with transform fallback.
- Optional short muted preview video.

## Prototype E: Card To Workspace Transition

Core idea:

- Selecting a template animates the card into the creation workspace header.
- The user feels continuity from browsing to creating.

Best for:

- Template gallery to creation workspace transition.

Pros:

- Makes the product feel cohesive.
- Reinforces that the selected template powers the creation page.

Risks:

- Browser support and routing details need verification.

Implementation direction:

- View Transitions API where supported.
- Motion layout animation fallback inside the SPA.
- Standard navigation fallback when motion is disabled or unsupported.

## Recommended Prototype Set

Build four comparison pages first:

1. `Prototype A - Flip Gallery`
2. `Prototype B - Cinematic Hover Cards`
3. `Prototype C - Bento Board`
4. `Prototype D - Before/After Reveal`

Then build one integrated flow:

5. `Prototype E - Card To Workspace Transition`

## Evaluation Criteria

- Visual impact
- Ecommerce trust
- Clarity of template value
- Ease of starting generation
- Mobile usability
- Performance
- Accessibility and reduced-motion support
- Fit with future mini program/app interaction patterns

## References

- MDN: `backface-visibility` for 3D card faces: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backface-visibility
- MDN: `transform-style` for keeping card children in 3D space: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/transform-style
- web.dev: high-performance CSS animations: https://web.dev/articles/animations-guide
- MDN: View Transition API: https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API
- Motion.dev: React layout animations: https://motion.dev/docs/react-layout-animations
- GSAP: Flip plugin for complex layout state transitions: https://gsap.com/docs/v3/Plugins/Flip/
- Awwwards: card flip inspiration: https://www.awwwards.com/inspiration/card-flip-animation-paradigma-retrallspective
