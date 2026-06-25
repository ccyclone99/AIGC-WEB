# Template Config Design

Status: Draft decision

This document defines the first version of the generic template structure. The goal is to make templates powerful enough for highly customized AIGC video creation while keeping template authoring Agent-driven instead of manually configured by humans.

## Design Principles

- Template is the core product asset.
- Templates are authored as versioned configuration/code by Agents.
- Humans provide product intent, review previews, approve pricing, and publish.
- Users never see prompts or model orchestration.
- Every published template version is immutable for audit purposes.
- Every generation task stores the exact template version, submitted parameters, pricing result, provider metadata, and errors.
- The same structure should support web first and future mini program, Android, and iOS clients.

## Top-Level Structure

```ts
TemplateConfig = {
  meta,
  publication,
  inputs,
  layout,
  validation,
  pricing,
  workflow,
  prompts,
  output,
  fallback,
  moderation,
  audit,
  testFixtures
}
```

## 1. meta

Product identity and discovery metadata.

```ts
meta = {
  templateId: string,
  version: string,
  name: string,
  category: "ecommerce" | "portrait" | "reserved" | string,
  scenario: string,
  description: string,
  tags: string[],
  coverAsset: string,
  sampleOutputs: string[],
  targetUsers: string[],
  supportedLocales: string[],
  owner: string
}
```

Examples:

- Ecommerce product short video
- Portrait fashion transformation video
- Future reserved categories such as real estate, restaurant, local services, education, or social posts

## 2. publication

Controls whether and where a template appears.

```ts
publication = {
  status: "draft" | "reviewing" | "published" | "paused" | "archived",
  visibility: "public" | "private" | "internal_test",
  sortWeight: number,
  featured: boolean,
  availableFrom?: string,
  availableUntil?: string,
  allowedUserSegments?: string[]
}
```

## 3. inputs

Defines what users provide. The frontend form is generated from this structure.

Supported input types:

- `image`: one image upload
- `image_list`: multiple image uploads
- `text`: short or long text
- `select`: single choice
- `multi_select`: multiple choices
- `number`: numeric input
- `switch`: boolean option
- `hidden`: internal value not shown to the user

```ts
inputs = [
  {
    key: "product_main_image",
    type: "image",
    label: "Product main image",
    required: true,
    userHint: "Upload a clear product image.",
    examples: [],
    constraints: {
      minWidth: 768,
      minHeight: 768,
      maxFileSizeMB: 20,
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
      aspectRatios: ["1:1", "3:4", "4:5"]
    }
  }
]
```

Input design rules:

- Keep user-facing fields simple.
- Avoid exposing prompts, model names, provider details, or complex technical parameters.
- Store all submitted values exactly as submitted.
- Store uploaded asset references and asset inspection results.

## 4. layout

Defines how the creation page should be rendered. This is not a full website builder; it is a structured guide for a polished, template-specific form.

```ts
layout = {
  pageStyle: "premium_tool" | "creator_studio" | "marketplace" | string,
  sections: [
    {
      title: "Upload product assets",
      description: "Use clear product images for better results.",
      fields: ["product_main_image", "product_detail_images"]
    },
    {
      title: "Video settings",
      fields: ["aspect_ratio", "duration", "style"]
    }
  ],
  preview: {
    enabled: true,
    type: "template_sample" | "input_summary" | "storyboard"
  },
  costPreview: {
    enabled: true,
    position: "sticky_sidebar"
  }
}
```

Layout rules:

- The user should immediately understand what to upload and what they will get.
- Cost estimate must be visible before submission.
- Error states must be specific and actionable.
- The UI should feel polished enough for ecommerce users to trust the output.

## 5. validation

Validation happens before credits are frozen when possible. Invalid or blocked submissions should not consume credits.

```ts
validation = {
  inputChecks: [
    {
      field: "product_main_image",
      checks: ["required", "image_readable", "min_resolution"]
    }
  ],
  assetInspection: {
    detectProduct: true,
    detectFace: false,
    detectNSFW: true,
    detectWatermark: "warn"
  },
  blockingRules: [
    "policy_violation",
    "unreadable_image",
    "missing_required_input"
  ],
  warningRules: [
    "low_resolution",
    "busy_background"
  ]
}
```

Validation result categories:

- `pass`: can submit
- `warn`: can submit but should show user warning
- `block`: cannot submit and should not freeze credits

## 6. pricing

Defines fixed and dynamic credit calculation.

```ts
pricing = {
  pricingId: string,
  currency: "credits",
  freezeMode: "pre_authorize",
  baseCredits: 20,
  modifiers: [
    {
      key: "duration_15s",
      when: { field: "duration", equals: "15s" },
      credits: 8
    },
    {
      key: "hd_output",
      when: { field: "quality", equals: "hd" },
      credits: 5
    }
  ],
  minCredits: 1,
  refundPolicy: {
    refundOnFailed: true,
    refundOnTimeout: true,
    refundOnBlockedBeforeGeneration: true,
    refundOnQualityComplaint: false
  }
}
```

Credit settlement rules:

- Calculate required credits before submission.
- Freeze credits when task is accepted.
- Confirm deduction when task succeeds.
- Release frozen credits when task fails, times out, or is blocked before generation.
- AI output quality variation is not a technical failure by default.

## 7. workflow

Defines the generation pipeline. The first implementation can execute known step types rather than arbitrary code.

```ts
workflow = {
  workflowId: string,
  steps: [
    {
      id: "inspect_assets",
      type: "asset_inspection",
      inputs: ["product_main_image"],
      outputs: ["asset_report"]
    },
    {
      id: "compose_prompt",
      type: "prompt_compose",
      inputs: ["product_main_image", "selling_points", "style"],
      outputs: ["video_prompt"]
    },
    {
      id: "generate_video",
      type: "video_generation",
      provider: "primary_video_provider",
      model: "configured_model",
      inputs: ["product_main_image", "video_prompt"],
      outputs: ["raw_video"]
    },
    {
      id: "store_output",
      type: "persist_output",
      inputs: ["raw_video"],
      outputs: ["final_video_url"]
    }
  ]
}
```

Suggested step types:

- `asset_inspection`
- `image_preprocess`
- `prompt_compose`
- `image_generation`
- `video_generation`
- `audio_generation`
- `subtitle_generation`
- `postprocess_video`
- `persist_output`
- `notify_user`

## 8. prompts

Prompts are hidden from users and generated from template variables.

```ts
prompts = {
  language: "zh-CN",
  systemRules: [],
  promptBlocks: [
    {
      key: "style_direction",
      content: "Create a premium ecommerce short video..."
    },
    {
      key: "product_context",
      fromInputs: ["selling_points", "target_platform"]
    }
  ],
  negativePromptBlocks: [
    "Do not change the product identity.",
    "Do not add unreadable text."
  ],
  variables: [
    "product_main_image",
    "selling_points",
    "style",
    "duration",
    "aspect_ratio"
  ]
}
```

Rules:

- Prompts are versioned with the template.
- Prompt output must be stored in the task audit record.
- User-facing text and internal prompts are separate.

## 9. output

Defines what the user receives.

```ts
output = {
  mediaType: "video",
  aspectRatios: ["9:16", "1:1", "16:9"],
  defaultAspectRatio: "9:16",
  durations: ["6s", "10s", "15s"],
  defaultDuration: "10s",
  formats: ["mp4"],
  poster: {
    generate: true
  },
  watermark: {
    enabledForFreeCredits: true,
    removableWithPaidCredits: true
  },
  retentionDays: 30
}
```

## 10. fallback

Defines how the system reduces visible failures.

```ts
fallback = {
  timeoutSeconds: 600,
  maxAttempts: 3,
  retryPolicy: [
    {
      on: ["provider_timeout", "provider_5xx", "rate_limited"],
      action: "retry_same_provider",
      maxAttempts: 2
    },
    {
      on: ["provider_unavailable"],
      action: "switch_provider",
      provider: "backup_video_provider"
    }
  ],
  finalFailureAction: "release_credits_and_mark_failed"
}
```

Important:

- Technical failure can trigger retry or refund.
- Invalid or blocked input should stop before generation when possible.
- Output quality dissatisfaction is not automatic failure.

## 11. moderation

Defines safety and policy checks.

```ts
moderation = {
  preGeneration: {
    checkText: true,
    checkImages: true,
    blockOnViolation: true
  },
  postGeneration: {
    checkVideo: true,
    blockDeliveryOnViolation: true
  },
  auditLabels: true
}
```

## 12. audit

Defines what must be captured for traceability.

```ts
audit = {
  storeSubmittedInputs: true,
  storeResolvedPrompt: true,
  storePricingBreakdown: true,
  storeTemplateSnapshot: true,
  storeProviderRequests: true,
  storeProviderResponses: true,
  storeRetryHistory: true,
  storeErrorDetails: true,
  logRetentionDays: 365
}
```

Every generation task must be reconstructable from audit records.

## 13. testFixtures

Examples used by Agents and CI to validate templates before publishing.

```ts
testFixtures = [
  {
    name: "basic_product_video",
    inputs: {
      product_main_image: "fixtures/product-watch.png",
      selling_points: "Lightweight, waterproof, suitable for business travel",
      duration: "10s",
      aspect_ratio: "9:16"
    },
    expected: {
      minCredits: 20,
      outputMediaType: "video"
    }
  }
]
```

Validation before publish:

- Schema validation
- Type checking
- Required input check
- Pricing calculation test
- Prompt rendering dry-run
- Provider payload validation
- Frontend form preview
- Fallback policy check
- Audit coverage check

## Recommended Source of Truth

Use a hybrid model:

- Repository files are the source of truth for template definitions.
- Database stores published versions, runtime availability, ordering, metrics, and operational overrides.
- Generation tasks store a snapshot/reference of the exact template version used.

This keeps Agent changes reviewable through Git while still allowing the live system to query templates efficiently.

## Human Workflow

1. Human describes the desired template in natural language.
2. Agent creates or updates the template config.
3. Agent runs validation and generates preview.
4. Human reviews the preview, pricing, and output expectation.
5. Human approves publish.
6. System publishes a new immutable template version.

## First Templates To Build

### Ecommerce Product Short Video

Required initial inputs:

- Product main image
- Optional detail images
- Product selling points
- Target platform, such as TikTok, Douyin, Xiaohongshu, Amazon, Shopify, or Taobao
- Video style
- Aspect ratio
- Duration

### Portrait Fashion Transformation Video

Required initial inputs:

- Portrait image
- Desired style or outfit direction
- Gender/style preference if needed
- Aspect ratio
- Duration

## Decision

Adopt this structure as the initial template configuration direction. Keep it Agent-authored, schema-validated, versioned, previewable, and auditable.
