# AI Provider and Model Strategy

Status: Draft proposal

This document defines how AIGC Web should integrate AI generation providers and models. The goal is to support high-quality ecommerce and portrait/fashion video templates without locking the template system to one provider.

## Strategy Principles

- Do not bind templates directly to a specific provider API.
- Templates should request capabilities, not provider names.
- Provider integrations should live behind normalized adapters.
- Provider API documentation, request schemas, auth methods, callback behavior, status models, and error formats differ significantly. Adapters must isolate those differences from templates, workflows, frontend, and admin UI.
- Provider/model choice should be traceable per generation task.
- Every provider request, response metadata, error, retry, and fallback should be recorded.
- Use multiple providers strategically, but avoid over-integrating too early.
- Keep direct AI generation separate from video composition/rendering.
- Agent should be able to compare provider performance and recommend routing changes.
- API keys and provider secrets must be managed through a secure secret management layer, never in template configs, frontend code, Git history, task records, or logs.

## Capability Categories

The platform should model providers by capabilities:

- Text to video
- Image to video
- Draft/preview video generation
- Video editing
- First/last frame video
- Subject or character reference
- Product reference consistency
- Image generation
- Image editing
- Background removal or replacement
- Upscaling
- Voiceover/text-to-speech
- Music generation or music library selection
- Subtitle/caption generation
- Moderation and safety checks

Templates should declare required capabilities. The provider routing layer chooses the provider/model based on availability, quality, cost, latency, and fallback policy.

## Provider Adapter Interface

Every provider adapter should expose a normalized interface:

```ts
ProviderAdapter = {
  providerId,
  capabilities,
  validateConfig(),
  estimateCost(request),
  buildPayload(normalizedRequest),
  submitJob(payload),
  pollJob(providerJobId),
  downloadOutputs(providerJobId),
  mapStatus(providerStatus),
  mapError(providerError),
  cancelJob(providerJobId),
  collectMetrics()
}
```

Provider adapters should hide provider-specific request formats from templates and the frontend.

Draft/preview support should be exposed as a capability flag, not hard-coded in template or frontend logic. See `docs/draft-preview-hd-strategy.md`.

## Handling Provider API Differences

Each provider can differ in:

- Authentication method.
- Request schema.
- File upload method.
- Async job submission.
- Webhook support.
- Polling model.
- Output download method.
- Rate limits.
- Error code taxonomy.
- Moderation/policy behavior.
- Cost reporting.
- Idempotency support.
- Regional endpoints.
- Model/version naming.

Adapter responsibilities:

- Convert internal normalized requests into provider-specific payloads.
- Convert provider statuses into internal statuses.
- Convert provider errors into internal error categories.
- Normalize provider outputs into platform assets.
- Normalize provider cost/usage metadata where available.
- Hide auth and secret usage from template/workflow code.
- Expose provider-specific capability limits to the routing layer.

Provider integration should include an adapter contract test suite:

- Config validation test.
- Payload build test.
- Mock success response test.
- Mock retryable error test.
- Mock policy block test.
- Mock timeout test.
- Output normalization test.
- Secret redaction/logging test.

## Normalized Request Model

Use a normalized request structure internally:

```ts
GenerationRequest = {
  capability,
  taskId,
  templateId,
  templateVersion,
  inputs,
  assets,
  prompt,
  negativePrompt,
  output,
  constraints,
  safety,
  priority,
  providerHints
}
```

Provider-specific payloads are generated inside adapters and stored in task audit records as safe snapshots or hashes.

## Provider Selection

Routing should consider:

- Required capability
- Template preference
- Output quality
- Subject/product consistency
- Supported aspect ratio
- Supported duration
- Latency
- Current provider health
- Queue/capacity
- Cost
- Commercial usage terms
- Data/privacy policy
- Region availability
- Historical success rate
- Fallback availability

Suggested routing levels:

1. Template explicitly requires a provider/model for a known reason.
2. Capability router chooses from approved providers.
3. Fallback router switches provider on failure if allowed.
4. Agent recommends routing changes based on metrics.

## Provider Evaluation Matrix

Before making a provider primary, evaluate:

- Official API availability
- Async job support
- Webhook or polling support
- Image-to-video support
- Subject/reference support
- Video editing support
- Output duration and resolution
- Watermark policy
- Commercial usage terms
- Content policy and moderation behavior
- Cost and billing predictability
- Rate limits
- Reliability and status visibility
- Data retention and privacy
- Regional/legal fit
- SDK/API documentation quality
- Error code clarity
- Ability to download and persist outputs

## Provider Candidates To Evaluate

### OpenAI Sora

Official docs indicate video generation supports prompts, image references, character assets, video extension, targeted edits, finished-video download, and Batch API usage.

Potential role:

- High-quality direct video generation.
- Image/reference-driven video templates.
- Video editing workflows if API capability and pricing fit.

### Runway

Runway API documentation positions the API for integrating generative models into apps/products. Current docs also reference Aleph 2.0 for editing existing videos with prompts and keyframe images.

Potential role:

- Video generation and editing.
- Strong candidate for creative video workflows.

### Luma Dream Machine / Ray

Official Luma docs describe text-to-video and image-to-video generation, plus image generation and reference-based image workflows.

Potential role:

- Image-to-video generation.
- Cinematic/lifestyle clips for product scenes.

### Kling AI Open Platform

Official Kling Open Platform docs describe video and image generation, with Kling 3.0/Omni references around audio-video generation, storyboarding, and element reference.

Potential role:

- Short-form video generation.
- Possible fit for ecommerce/social-video styles.

### MiniMax Video

Official MiniMax docs describe text-to-video, image-to-video, first-and-last-frame video, and subject-reference video.

Potential role:

- Portrait/fashion transformation workflows.
- Subject consistency workflows.

### fal.ai

Official fal docs describe access to many image, video, audio, and multimodal models through model APIs, with model pages including schemas, pricing, usage tracking, logs, files, and metrics.

Potential role:

- Model aggregator and rapid experimentation layer.
- Useful for comparing multiple video/image models behind one integration.
- Potential fallback path when direct provider integration is not ready.

### Adobe Firefly Services

Official Adobe Firefly API docs cover image generation/editing/upscaling and video-related services. Adobe also documents Audio/Video APIs for automated audio/video content production at scale.

Potential role:

- Commercially oriented image/video services.
- Image editing/upscaling or brand-safe workflows, depending on capability fit.

## MVP Provider Recommendation

Use a staged approach:

### Stage 1: Adapter Layer and Mock Provider

- Build provider adapter interface.
- Build a mock provider for frontend and workflow testing.
- Build task/provider attempt logging.
- Build failure simulation for retry/refund testing.

### Stage 2: One Primary Video Provider Plus One Aggregator/Fallback

- Integrate one direct video provider for production-quality generation.
- Integrate one aggregator or second provider for experimentation/fallback.
- Keep provider choice configurable per template.

### Stage 3: Capability-Based Routing

- Add routing based on capability, cost, reliability, and template needs.
- Allow Agent to recommend routing changes from metrics.

Recommended first evaluation:

- One provider strong in image-to-video/product/lifestyle video.
- One provider strong in subject/portrait consistency.
- One aggregator such as fal.ai for model exploration, if cost and terms fit.
- Keep Remotion/FFmpeg for composition and post-production regardless of provider.

## Fallback Strategy

Fallback should be configured per template and provider capability.

Examples:

- Retry same provider on timeout, 5xx, transient network errors, or rate limits.
- Switch provider when provider is unavailable or failure rate crosses threshold.
- Switch to composition-only output if AI video generation fails and template allows a degraded but useful result.
- Release credits if no acceptable fallback succeeds.

Do not fallback when:

- User input is invalid.
- Moderation blocks content.
- Provider returns a policy violation that should not be bypassed.
- Template requires a unique provider capability and no approved equivalent exists.

## Cost and Credit Mapping

Provider cost should not equal user credit cost directly.

Track:

- Provider estimated cost.
- Provider actual cost if available.
- Template credit cost.
- Gross margin estimate.
- Retry cost.
- Fallback cost.

Pricing module should store:

- Pricing version.
- Credit calculation.
- Provider/model cost snapshot.
- Final settlement.

## Provider Attempt Logging

Each provider attempt must record:

- Provider
- Model
- Capability
- Request ID
- Task ID
- Workflow step ID
- Attempt number
- Safe payload snapshot or hash
- Prompt snapshot if applicable
- Input asset references
- Response metadata
- Output asset references
- Status
- Error code/message
- Latency
- Cost estimate/actual if available
- Retry/fallback reason

Provider attempt logging must not record raw API keys, auth headers, signed upload URLs, secrets, or unredacted sensitive payload fields.

## API Key and Secret Management

Rules:

- Provider API keys must never be committed to the repository.
- Provider API keys must never be stored in template configs.
- Provider API keys must never be sent to the frontend.
- Provider API keys must never be written into task records, provider payload snapshots, audit logs, or error logs.
- Logs must redact headers, query params, body fields, and error messages that may contain secrets.
- Secrets should be referenced by `secretRef`, not raw value.
- Production secrets should be stored in a secret manager or encrypted environment configuration.
- Development secrets should use local `.env` files excluded by `.gitignore`.
- Each environment should have separate keys: local, staging, production.
- Keys should be scoped by provider and capability where possible.
- Key usage should be monitored by provider, environment, and task.
- Key rotation should be supported without changing template configs.
- Revoked or compromised keys should be disabled centrally.

Suggested secret reference shape:

```ts
ProviderConfig = {
  providerId: "example_video_provider",
  environment: "production",
  secretRef: "providers/example_video_provider/production/api_key",
  endpointRef: "providers/example_video_provider/production/base_url",
  capabilities: ["image_to_video", "video_editing"],
  status: "active"
}
```

Agent safety:

- Agents can inspect provider config metadata and `secretRef` names.
- Agents must not read or print raw API keys unless explicitly authorized for credential setup.
- Agents can generate integration code that uses secret references.
- Agents can run redaction tests to ensure logs do not leak secrets.

## Agent Role

Agents should be able to:

- Compare provider metrics.
- Diagnose provider failures.
- Recommend fallback changes.
- Generate provider adapter tests.
- Update template routing hints.
- Prepare cost reports.
- Propose credit price changes when provider costs change.

High-risk actions require human approval:

- Adding production provider credentials.
- Changing primary provider for published templates.
- Changing credit pricing.
- Bulk switching provider routes.

## Open Questions

- Which providers have acceptable commercial terms for our use case?
- Which provider should be tested first for ecommerce product videos?
- Which provider should be tested first for portrait/fashion transformation?
- Do we need providers available in mainland China, global markets, or both?
- What is the maximum acceptable generation time?
- What target gross margin is required for credit pricing?
- Should user-facing templates disclose provider/model information or keep it internal?

## References

- OpenAI video generation guide: https://developers.openai.com/api/docs/guides/video-generation
- Runway API docs: https://docs.dev.runwayml.com/
- Luma API docs: https://docs.lumalabs.ai/docs/api
- KlingAI Open Platform: https://kling.ai/dev
- KlingAI API docs: https://kling.ai/document-api/quickStart/productIntroduction/overview
- MiniMax video generation docs: https://platform.minimax.io/docs/guides/video-generation
- fal.ai docs: https://fal.ai/docs/documentation
- fal.ai model API reference: https://fal.ai/docs/model-api-reference
- Adobe Firefly API docs: https://developer.adobe.com/firefly-services/docs/firefly-api/
- Adobe Audio/Video APIs: https://developer.adobe.com/audio-video-firefly-services/

## Decision

Adopt a capability-based provider adapter strategy. Do not bind templates or frontend logic directly to provider APIs. Start with adapter infrastructure, a mock provider, then evaluate one or two production video providers plus an experimentation/fallback layer.
