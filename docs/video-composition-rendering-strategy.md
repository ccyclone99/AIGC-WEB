# Video Composition and Rendering Strategy

Status: Draft proposal

This document covers templates that require more than a single AI generation API call. Some templates return the provider-generated result directly, while others need stitching, editing, captions, overlays, music, post-processing, or multi-step generation.

## Problem

Not every template is a simple "call AI model, return result" workflow.

Required template workflow types include:

1. Direct generation: call an image/video model and return the output.
2. AI generation plus editing: generate images/video clips, then assemble, cut, caption, overlay, and render.
3. Pure composition: turn user images/text/audio into a rendered video without a generative video model.
4. Multi-step hybrid: generate intermediate assets, build a timeline, render final video, then optionally post-process.

The platform should not make Jianying/CapCut drafts the core internal representation. That would make templates depend too much on one external editing tool and could limit future rendering options.

## Core Recommendation

Create a platform-owned intermediate format:

```ts
VideoCompositionSpec
```

This is the canonical timeline/composition format produced by templates. It describes the final video independent of any specific renderer.

Renderers then act as adapters:

- AI direct output adapter
- Remotion renderer adapter
- FFmpeg renderer adapter
- Cloud video editing API adapter
- Jianying/CapCut adapter, only if official/stable usage is available
- Future custom renderer adapter

## Why Own the Intermediate Spec

Benefits:

- Avoids being locked into Jianying/CapCut or any one provider.
- Lets Agents generate video composition plans safely.
- Makes task records traceable down to scenes, clips, captions, overlays, effects, and render settings.
- Allows different templates to use different renderers.
- Allows fallback rendering strategies.
- Makes future app/mini program clients unaffected by rendering backend changes.

## VideoCompositionSpec Draft

```ts
VideoCompositionSpec = {
  meta,
  canvas,
  timeline,
  assets,
  scenes,
  audio,
  captions,
  effects,
  render,
  audit
}
```

### meta

- specId
- templateId
- templateVersion
- taskId
- createdAt
- generator

### canvas

- width
- height
- aspectRatio
- fps
- duration
- background

### assets

All media used in the final render.

- uploaded images
- generated images
- generated clips
- stock assets
- music
- voiceover
- subtitles
- logos

Each asset should include:

- assetId
- type
- source
- duration if applicable
- ownership/user reference
- inspection metadata

### timeline

Tracks and clips arranged over time.

Track types:

- video
- image
- text
- audio
- subtitle
- overlay
- effect

Clip fields:

- start time
- duration
- asset reference
- transform
- crop
- animation
- transition
- opacity
- z-index

### scenes

Optional higher-level story structure.

Example for ecommerce:

1. Hook scene
2. Product reveal
3. Benefit highlights
4. Usage/lifestyle scene
5. CTA/end card

### captions

- text
- start/end timing
- style
- position
- animation
- language

### audio

- background music
- voiceover
- fade in/out
- ducking
- volume

### effects

- transitions
- filters
- zoom/pan
- motion blur
- stickers
- light effects
- product highlight effects

### render

- renderer preference
- output format
- codec
- bitrate
- resolution
- watermark
- poster generation
- retention policy

### audit

- resolved prompts
- generated intermediate assets
- renderer selection
- renderer payload
- render logs
- fallback attempts
- final output hash

## Renderer Options

### Option 1: Direct AI Output

Use when:

- AI provider returns a complete final video.
- Template does not require extra brand overlays, captions, stitching, or music.

Pros:

- Fastest workflow.
- Less engineering.

Cons:

- Lowest control.
- Harder to create consistent branded ecommerce videos.
- Less reusable for template packaging.

### Option 2: Remotion Renderer

Use when:

- The video is template-heavy.
- We need polished motion graphics, text overlays, product cards, animated layouts, before/after effects, or reusable React components.
- Agents need to modify video templates using code.

Pros:

- Very aligned with Agent-driven development.
- React-based components match the frontend stack.
- Good for reusable parameterized templates.
- Good for ecommerce videos with text, motion, scenes, captions, and layout control.

Cons:

- Rendering can be compute-heavy.
- Needs a render worker environment.
- Some highly complex editor-style effects may require custom implementation.

Recommended role:

- Primary self-owned renderer for structured ecommerce templates.

### Option 3: FFmpeg Renderer

Use when:

- Need low-level stitching, transcoding, overlays, captions, audio mixing, cropping, resizing, concatenation, or final packaging.

Pros:

- Mature and powerful.
- Good finalization layer.
- No vendor lock-in.

Cons:

- Complex filtergraphs are hard to maintain manually.
- Not ideal as the only template authoring layer for rich motion design.

Recommended role:

- Core media processing and finalization tool.
- Good companion to Remotion and AI-generated clips.

### Option 4: Cloud Video Editing API

Examples:

- Shotstack
- Creatomate
- Similar JSON-to-video providers

Use when:

- We want faster launch without owning render infrastructure.
- Need scalable API rendering.
- Need JSON timeline rendering with lower custom renderer work.

Pros:

- Faster to integrate for timeline-based rendering.
- Provider handles rendering infrastructure.
- Good fallback option.

Cons:

- Cost and vendor dependency.
- Feature limits depend on provider.
- Sensitive user assets leave our infrastructure.

Recommended role:

- Candidate fallback or acceleration path.
- Evaluate cost, feature coverage, data policy, region, and reliability before making primary.

### Option 5: Jianying/CapCut Adapter

Use only if:

- There is official, stable, legally usable server-side API access for draft generation and rendering, or a business agreement that allows this usage.

Pros:

- Strong editing effects and familiar short-video style.
- Potentially useful for drafts and social-video aesthetics.

Risks:

- Public, stable, official backend rendering API availability is unclear from current public docs.
- Draft-file manipulation can be brittle if formats change.
- Automation through unofficial APIs can create operational and legal risk.
- Vendor lock-in is high if templates are authored directly as Jianying drafts.

Recommended role:

- Do not make it the core platform representation.
- Keep it as an optional renderer/export adapter after official access is confirmed.

## Recommended Architecture

Use a two-layer workflow:

```txt
Template Workflow
  -> Generated Assets
  -> VideoCompositionSpec
  -> Renderer Adapter
  -> Final Video
```

Renderer selection should be per template or per task:

- Direct provider output for simple templates.
- Remotion + FFmpeg for premium structured ecommerce videos.
- Cloud JSON-to-video renderer for fast iteration or overflow.
- Jianying/CapCut only as optional adapter if official access is available.

## Recommended MVP Direction

Use:

- Remotion as the primary programmable composition renderer.
- FFmpeg as the media processing/finalization layer.
- Provider direct output for simple AI-video templates.
- Keep a cloud JSON-to-video adapter interface, but do not depend on it initially unless speed requires it.
- Do not make Jianying/CapCut the primary rendering engine until official stable API/business access is verified.

## Template Type Mapping

### Product Image to Ecommerce Short Video

Recommended:

- Generate or use product image assets.
- Build a five-scene ecommerce storyboard.
- Use Remotion for motion layout, text, product highlights, transitions, CTA, and branded composition.
- Use FFmpeg for final compression/transcoding if needed.

### Portrait Fashion Transformation Video

Recommended:

- Use AI model to generate transformation clip or key frames.
- If model output is complete: return directly with light post-processing.
- If template requires packaging: add opening, style labels, before/after, music, and CTA through Remotion/FFmpeg.

## Agent Role

Agents should be able to:

- Generate VideoCompositionSpec from template requirements.
- Generate Remotion components for template-specific scenes.
- Generate FFmpeg finalization commands from the spec.
- Validate timelines, assets, durations, and captions.
- Preview the composition before publish.
- Explain renderer choice and fallback behavior.

## Open Questions

- What official AI/video providers will be used first?
- Do we have official Jianying/CapCut server-side rendering access or only draft manipulation?
- Do generated videos need platform-specific style packs such as TikTok/Douyin/Xiaohongshu/Amazon?
- Should we self-host rendering from the start, or use cloud rendering while traffic is low?
- What maximum render time is acceptable for users?
- What output quality levels are needed at launch?

## Decision

Adopt `VideoCompositionSpec` as the platform-owned intermediate representation. Use renderer adapters so templates are not locked to one generation model, Jianying/CapCut, Remotion, FFmpeg, or any cloud vendor.
