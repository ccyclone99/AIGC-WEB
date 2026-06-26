# Template Config Contract

This document defines the frontend-approved MVP template contract before backend work starts.

## Purpose

Templates are productized workflows, not plain prompts. A template must describe:

- what inputs the user must provide;
- what output settings are available;
- how credits are estimated, frozen, settled, or released;
- which backend capabilities are required;
- which fields must be copied into every generation task for traceability.

## MVP Template Shape

```ts
type TemplateConfig = {
  version: string
  workflowType: 'image-to-video' | 'portrait-to-video' | 'video-remix'
  workflowLabel: string
  pricingVersion: string
  pricingMode: 'fixed' | 'dynamic'
  settlement: 'freeze_then_settle'
  inputFields: TemplateInputField[]
  outputFields: Array<'ratio' | 'duration' | 'resolution' | 'quality'>
  capabilities: TemplateCapability[]
  traceFields: string[]
}
```

## Input Field Shape

```ts
type TemplateInputField = {
  id: string
  label: string
  required: boolean
  acceptedKinds: Array<'image' | 'video' | 'portrait' | 'poster' | 'logo'>
  maxCount: number
  binding: 'imageId' | 'videoId' | 'portraitId'
  help: string
}
```

## MVP Workflows

- `image-to-video`: one product image becomes a short ecommerce video.
- `portrait-to-video`: one portrait/reference image becomes a portrait/fashion video and requires consent records.
- `video-remix`: one source video is repackaged or edited; visible in prototype but creation is not open in MVP first pass.

## Required Trace Fields

Every accepted task must snapshot:

- `taskId`
- `templateId`
- `templateVersion`
- `pricingVersion`
- `workflowType`
- `inputAssetIds`
- `outputSettings`
- `creditLedgerIds`
- `providerAttemptIds`
- `renderAttemptIds`
- `moderationRecordIds`

## Backend Implications

- Template records need versioning and publish status.
- Task creation must copy template version, pricing version, workflow type, input asset ids, and output settings.
- Provider routing reads capabilities from the template, not frontend-specific fields.
- Credit freeze uses the selected template price and pricing version.
- Task details and admin diagnosis must join task, credit ledger, provider attempts, render attempts, moderation records, and output assets.

## Current Prototype Coverage

The frontend prototype now carries `Template.config` for each template and writes template version, pricing version, workflow type, input asset id, and output settings into task parameters.
