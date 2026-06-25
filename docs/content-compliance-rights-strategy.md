# Content Compliance and Rights Strategy

Status: Draft proposal

This document defines product and system requirements for content rights, user authorization, moderation, privacy, and commercial-use risk. It is not legal advice. Final policies must be reviewed against the target launch regions and provider terms.

## Why This Matters

AIGC Web will process:

- Product images.
- Portrait/person photos.
- Brand and ecommerce assets.
- User-provided selling points and descriptions.
- AI-generated commercial videos.

This creates risk around copyright, trademark, portrait rights, privacy, biometric/sensitive personal information, advertising claims, platform rules, and AI-generated content disclosure.

## Core Principles

- Users must confirm they have the rights to upload and use submitted materials.
- Portrait/person workflows need stronger consent handling than product-only workflows.
- The platform should avoid knowingly generating infringing, deceptive, harmful, or non-consensual content.
- Generated output should be traceable to inputs, template version, provider, and task logs.
- Commercial-use statements must be cautious and tied to provider terms.
- Content checks should happen before generation where possible.
- Blocked or invalid content should not consume credits.
- The product should support takedown/dispute workflows.

## User Authorization Requirements

Before generation, users should agree that:

- They own or have permission to use uploaded images, text, logos, products, and other materials.
- They have consent from any identifiable person in uploaded portrait/person images.
- They will not upload materials that infringe copyright, trademark, privacy, publicity, or other rights.
- They will not use the service to generate illegal, deceptive, harmful, or non-consensual content.
- They are responsible for reviewing generated outputs before commercial use.

For portrait/fashion transformation templates:

- Add an explicit confirmation checkbox for consent to use the person image.
- Consider stronger friction for celebrity/public-figure-like images, minors, or suspicious face-swap/deepfake use cases.
- Store consent confirmation with the task record.

## Upload and Input Policy

Block or flag:

- Explicit sexual content.
- Non-consensual intimate/deepfake content.
- Child sexual abuse material indicators.
- Hate/harassment/violent extremist content.
- Illegal goods/services.
- Impersonation or identity deception.
- Celebrity/public figure misuse where relevant.
- Trademark/logo misuse where risk is high.
- Low-quality or unreadable assets when template requires quality.

Warn but allow when appropriate:

- Low-resolution product images.
- Busy backgrounds.
- Watermarked images.
- Unclear product boundaries.
- Images likely to produce poor output.

## Generated Output Policy

Generated outputs should be checked or marked for review when:

- Moderation detects policy violations.
- Output includes unexpected faces, logos, text, or sensitive content.
- Provider reports safety/policy flags.
- The template involves portrait transformation or identity-sensitive content.

Output quality dissatisfaction is not automatic technical failure, but policy-violating outputs should be blocked from delivery and credits released/refunded according to task policy.

## Commercial Use Positioning

Product copy should not overpromise that every generated video is automatically safe for commercial use.

Recommended wording direction:

- "Designed for ecommerce marketing workflows."
- "Review generated outputs before publishing."
- "Commercial use may depend on your uploaded materials, selected providers, platform rules, and applicable law."

Avoid:

- Absolute guarantees that outputs are free of third-party rights.
- Guarantees that AI-generated outputs are copyrightable.
- Guarantees that every provider output is approved for all commercial channels.

## AI Disclosure and Advertising Claims

For ecommerce users:

- The system should discourage deceptive product claims.
- Templates should avoid generating unsupported performance, medical, financial, or earnings claims.
- Users should be reminded to verify factual product statements.
- If templates generate influencer-style endorsements, disclosures may be needed depending on the user's campaign context.

## Privacy and Sensitive Data

Portrait/person images can involve sensitive personal data depending on region and processing.

Requirements:

- Collect only what is needed for generation.
- Explain why images are processed.
- Store uploaded and generated assets with retention limits.
- Allow user deletion requests where required.
- Restrict admin access to user assets.
- Avoid using uploaded user assets for model training unless separately and explicitly agreed.
- Keep provider data handling terms visible internally.
- Log access to sensitive assets in admin contexts.

## Regional Compliance Watchlist

### United States

Relevant concerns:

- AI marketing claims and deceptive advertising.
- Influencer/endorsement disclosure for generated ads.
- Copyrightability and human authorship questions for AI-generated works.
- State privacy laws and biometric/sensitive personal information depending on implementation.

### Mainland China

Relevant concerns:

- Generative AI service requirements if offering services to the public in China.
- Deep synthesis rules for AI-generated or manipulated media.
- Personal information and sensitive personal information rules, especially biometric/person images.
- Potential filing/registration/display requirements depending on service nature and model usage.

### European Union / UK

Relevant concerns:

- GDPR lawful basis and data subject rights.
- AI Act obligations depending on feature classification.
- Biometric and deepfake disclosure requirements depending on use.
- Consumer protection and advertising claims.

Final target regions must be selected before legal policy is finalized.

## Product Requirements

### Terms and Consent

Required:

- Terms of service.
- Privacy policy.
- Upload rights confirmation.
- Portrait/person image consent confirmation.
- Commercial-use disclaimer.
- Prohibited content policy.
- Takedown/contact process.

### Moderation

Required:

- Pre-generation text/image moderation.
- Post-generation output moderation for high-risk templates.
- Template-level moderation configuration.
- Moderation records linked to task and asset.
- Blocked tasks should not consume credits or should release frozen credits.

### Rights and Takedown

Required:

- Users can report generated content.
- Rights holders can request takedown.
- Admin/Agent can trace the task, user, inputs, template, provider, and output.
- Takedown action is audited.
- Removed outputs should be unavailable through public/shared links.

### Data Retention

Required:

- Define retention for uploaded assets.
- Define retention for generated outputs.
- Define retention for logs and audit records.
- Allow shorter retention for sensitive/person images if needed.

### Provider Terms Tracking

Required:

- Track provider terms that affect commercial use, training, retention, and output ownership.
- Store provider/model used per task.
- If provider terms change, Agent should flag affected templates.

## Agent Role

Agents should:

- Add policy checks to templates.
- Generate user-facing consent copy drafts.
- Check whether templates contain risky claims.
- Summarize moderation and provider policy conflicts.
- Prepare takedown investigation summaries.
- Flag templates that use provider capabilities with restrictive terms.

Agents should not:

- Make final legal determinations.
- Approve high-risk content disputes without human/legal review.
- Expose sensitive user assets unnecessarily.

## MVP Requirements

Required for MVP:

- Upload rights confirmation.
- Portrait consent checkbox for person-image templates.
- Pre-generation moderation placeholder or integration.
- Block/release-credit behavior for invalid or blocked content.
- Task-linked consent and moderation records.
- Basic prohibited content policy.
- Basic takedown/report contact path.
- No user asset training without explicit separate consent.

Can be delayed:

- Full legal workflow automation.
- Advanced rights-holder portal.
- Per-region policy engine.
- Automated trademark/logo dispute handling.

## Open Questions

- Target launch regions.
- Whether users can publicly share generated videos through platform links.
- Whether the platform will offer "commercial-use included" plans.
- Whether generated outputs include watermark by default.
- Asset retention duration.
- Whether user uploads can ever be used for internal quality evaluation or model improvement.
- Whether minors are allowed to use portrait templates.

## References

- FTC artificial intelligence guidance hub: https://www.ftc.gov/industry/technology/artificial-intelligence
- FTC endorsement/influencer guidance: https://www.ftc.gov/business-guidance/advertising-marketing/endorsements-influencers-reviews
- U.S. Copyright Office AI materials: https://www.copyright.gov/ai/
- California CCPA/CPRA privacy rights overview: https://oag.ca.gov/privacy/ccpa
- China CAC Generative AI Interim Measures: https://www.cac.gov.cn/2023-07/13/c_1690898327029107.htm
- China CAC Deep Synthesis Provisions: https://www.cac.gov.cn/2022-12/11/c_1672221949354811.htm
- China CAC PIPL sensitive personal information discussion: https://www.cac.gov.cn/2021-09/08/c_1632692967456129.htm

## Decision

Treat compliance, rights, consent, moderation, and takedown as first-class product capabilities. Do not treat them as legal text added after launch.
