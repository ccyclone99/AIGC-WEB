# Backend First Replacement Checklist

Status: Draft
Last updated: 2026-06-26

This checklist is the first concrete backend handoff. It defines the smallest backend integration slice that can replace prototype data without changing the accepted frontend interaction model.

## Scope

The first replacement slice is read-heavy plus safe account state. It must not connect real generation, payment settlement, or provider credentials yet.

Included:

- API client shell implementing `AigcApiClient`;
- template list/detail;
- credit summary, packages, and ledger;
- task list/detail;
- asset list and asset categories;
- reward campaigns list;
- session read.

Excluded:

- real file upload;
- generation task creation;
- credit freeze/settlement mutation;
- payment order creation;
- signup or campaign reward claim;
- third-party login callback;
- provider API key usage.

## Frontend Files To Touch

- `src/api/contracts.ts`: source of API method and DTO types.
- `src/api/mappers.ts`: required conversion from API DTO to current UI types.
- `src/api/client.ts`: chooses prototype or HTTP client mode.
- `src/api/config.ts`: reads `VITE_AIGC_API_MODE` and `VITE_AIGC_API_BASE_URL`.
- `src/api/httpClient.ts`: real endpoint implementation.
- `src/api/prototypeClient.ts`: fallback client backed by seed data.
- `src/hooks/usePrototypeStore.ts`: introduce the backend-backed read path behind one config flag.
- `src/prototypeData.ts`: keep as fallback data and backend-absent local mode.
- `src/App.tsx`: should not need API-specific changes.
- `src/components/*`: should not import API contracts or endpoint paths.

## Required Client Shape

Use the existing API client modules that return `AigcApiClient`.

Requirements:

- all responses use `ApiResult<T>`;
- all errors preserve `traceId`;
- endpoints are not called from page components;
- client base URL is configured in one place;
- fallback mode keeps the app usable when backend is unavailable.

Local config:

```env
VITE_AIGC_API_MODE=prototype
VITE_AIGC_API_BASE_URL=/api
```

Set `VITE_AIGC_API_MODE=http` only after the read-only backend endpoints are available.

## Replacement Order

1. `templates.list`

   Replace `templates` reads in template gallery, homepage featured template, and studio template selection.

   Acceptance:

   - template page renders API templates;
   - video templates still expose preview video;
   - unavailable or paused templates can be hidden or marked unavailable consistently.

2. `credits.summary`, `credits.packages`, `credits.ledger`

   Replace credit balance, frozen credits, packages, and ledger rows.

   Acceptance:

   - top bar balance comes from API;
   - credit panel packages and ledger come from API;
   - failed API state keeps fallback copy visible with a traceable error.

3. `generationTasks.list` and `generationTasks.get`

   Replace task list, production-desk queue, and task detail drawer.

   Acceptance:

   - task detail includes template version, pricing version, workflow, input asset, output settings, idempotency key, failure code, and trace ids;
   - task list status copy still maps through `src/viewModels.ts`;
   - empty task list has a visible state.

4. `assets.list` and `assets.listCategories`

   Replace asset library, asset picker, and category filters.

   Acceptance:

   - asset picker prioritizes usable library assets;
   - category manager shows system and user categories;
   - expired or provider-temporary assets show expiry labels;
   - archived assets are filterable.

5. `auth.getSession` and `auth.listRewardCampaigns`

   Replace safe account-read surfaces only.

   Acceptance:

   - authenticated/anonymous session does not break navigation;
   - reward campaign status can render without enabling claim yet;
   - risk-blocked campaign status is represented.

## Required Error States

Every read group must support:

- loading;
- success;
- empty;
- unauthorized;
- validation/config mismatch;
- server error with `traceId`;
- fallback data active.

## Stop Before Mutation APIs If

- DTO mapping requires changing accepted page layout;
- backend cannot provide stable IDs for tasks, assets, ledger rows, and categories;
- backend cannot return trace IDs for errors;
- categories cannot distinguish `system` and `user` scope;
- task detail cannot provide generation snapshot fields.

## Done When

- `src/hooks/usePrototypeStore.ts` can choose API-backed read data or fallback data;
- no component imports endpoint paths;
- browser smoke tests pass for homepage, templates, production desk, tasks, assets, credits, and account read surfaces;
- `npm run lint` and `npm run build` pass.
