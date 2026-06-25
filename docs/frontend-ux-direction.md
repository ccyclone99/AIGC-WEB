# Frontend UX Direction

Status: Draft proposal

The web experience must feel polished, trustworthy, and commercially useful. The product is not a generic prompt tool. It should feel like a high-quality AIGC creation platform built for ecommerce users who want finished marketing videos with minimal effort.

## Core UX Positioning

- Website first, but interaction patterns should not block future mini program, Android, and iOS clients.
- Ecommerce creation is the primary first impression.
- Template-driven creation should be obvious within the first screen.
- Users should understand the result before they understand the technology.
- The UI should hide prompts and model complexity.
- The product should feel premium, efficient, and conversion-oriented.

## Primary User Journey

1. User lands on the website.
2. User sees ecommerce video creation as the main value proposition.
3. User browses or selects a template.
4. User opens a template creation workspace.
5. User uploads/selects the inputs required by the selected template. The first MVP template only requires one image.
6. System validates inputs and shows warnings if needed.
7. User sees estimated credit cost.
8. User submits generation after login.
9. System freezes credits and shows task progress.
10. User receives the completed video and can preview, download, reuse, or create another task.

## Main Pages

### Home

Purpose:

- Establish trust immediately.
- Show what the platform produces.
- Guide users into ecommerce video templates.

Required content:

- Strong first-screen visual showing real output examples.
- Clear entry to product-image ecommerce video generation.
- Secondary entry to portrait/fashion transformation.
- Reserved entries for future content categories.
- Template examples with video previews or animated previews.
- Credit/login entry points.

### Template Gallery

Purpose:

- Let users find a template quickly.

Required capabilities:

- Category filters.
- Scenario filters.
- Aspect ratio/duration tags.
- Credit cost display.
- Popular/new/recommended sorting.
- Template cards with cover, sample output, difficulty simplicity, and expected result.

### Template Detail

Purpose:

- Help users understand what the template does before entering creation.

Required content:

- Sample outputs.
- Required inputs.
- Supported output format.
- Estimated credit cost.
- Suitable platforms.
- Expected generation time.
- Start creation button.

### Creation Workspace

Purpose:

- Make generation feel simple, controlled, and trustworthy.

Recommended layout:

- Left or main area: template-specific input form.
- Right sticky area: preview, credit estimate, validation status, submit button.
- Mobile layout: step-by-step sections with persistent bottom submit/cost bar.

Required capabilities:

- Image upload with clear requirements.
- Template-defined optional text fields only when the selected template requires them.
- Option selectors for style, duration, ratio, platform, and quality.
- Real-time validation messages.
- Cost preview before submission.
- Login prompt when unauthenticated.
- Clear generation button state.

### Task Center

Purpose:

- Let users track and retrieve generated content.

Required capabilities:

- Task list by status.
- Progress display.
- Generated video preview.
- Download action.
- Failure reason.
- Refund/release status.
- Submitted template and parameters summary.

### Credit Center

Purpose:

- Let users understand and manage credits.

Required capabilities:

- Current credit balance.
- Signup bonus display.
- Recharge packages.
- Credit transaction history.
- Frozen credits display.
- Refund/release records.

### Account/Login

Purpose:

- Let users log in before generation and purchases.

Initial requirement:

- Login is required before consuming credits.
- Final login methods remain open.

### Admin/Operator Console

Purpose:

- Support internal operations, not public users.

Required capabilities:

- Template version review and publish.
- Template ordering and visibility.
- Generation task search.
- Error and provider log inspection.
- Credit transaction lookup.
- Manual credit adjustment with audit.

## Visual Design Principles

- Show real-looking outputs, not abstract AI graphics.
- Prioritize ecommerce usefulness over generic creative decoration.
- Use premium but practical UI: clear hierarchy, strong media previews, crisp cards, restrained effects.
- Avoid making the website feel like a plain form system.
- Avoid overwhelming users with technical options.
- Make cost and status transparent.
- Make upload requirements easy to understand visually.
- Use polished empty, loading, error, and success states.
- Use card flip, hover preview, shared layout, and before/after reveal interactions where they help users understand template value.
- Keep animation purposeful: reveal output examples, input requirements, credit cost, or creation entry points.
- Respect reduced-motion preferences and provide mobile tap alternatives for hover interactions.

## Motion Prototype Direction

See `docs/motion-prototype-plan.md`.

Initial prototype options:

- Premium Flip Gallery: 3D cards flip to reveal template details and credit cost.
- Cinematic Hover Preview Cards: hover/tap reveals action layers and plays sample previews.
- Bento Template Board: curated homepage/template board with expanding cards.
- Before/After Reveal Cards: input image transitions to generated result preview.
- Card To Workspace Transition: selected template animates into the creation workspace.

## Key Interaction Requirements

- Users should be able to start a generation flow in very few steps.
- Every generated task should have a visible status.
- Credit cost must be visible before submission.
- Upload validation should happen before credit freeze whenever possible.
- If login is required, do not discard user-filled inputs after login.
- Failed or timed-out tasks should clearly show refund/release status.
- Successful tasks should encourage another generation or template reuse.

## First MVP Frontend Scope

Required:

- Home page focused on ecommerce video creation.
- Template gallery with ecommerce and portrait/fashion categories.
- Creation workspace for ecommerce product short video.
- Creation workspace for portrait/fashion transformation video.
- Login-gated generation entry.
- Credit balance display.
- Task center with status and results.
- Basic credit center.

Reserved but not fully built:

- More content categories.
- Full marketplace-style template discovery.
- Advanced admin visual editor.
- Mobile app-specific navigation.

## Open Design Questions

- Final visual style direction.
- Whether the home page should feel more like a SaaS tool, ecommerce creative marketplace, or consumer creative app.
- Whether first-screen media should be generated examples, customer-style examples, or interactive before/after comparisons.
- Which login methods are required for launch.
- Which ecommerce platforms should be named first.
