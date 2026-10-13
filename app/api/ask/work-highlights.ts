// Public-safe summary of Brian's work at Epic, adapted from a longer internal handoff.
// Everything here can be recited verbatim by the chatbot, so keep it free of
// customer names, unreleased work, and security specifics. Brian has cleared the metrics for public use.
export const workHighlights = `
Work Highlights at Epic (Lumens endoscopy application)

Role:
Full-stack software engineer on Lumens, Epic's clinical application for endoscopy (GI procedure documentation, image capture, reporting, and billing) used by large US health systems. Intern in summer 2022, full-time since August 2023. Brian is the lead developer on the product's generative AI features and owns several core subsystems.

Stack at work:
- Server: Epic's M (MUMPS) database and application layer for business logic, batch jobs, data migrations, and APIs.
- Web client: C#, TypeScript, and React.
- Integration: C# web services.
- AI: Python for LLM model code and data pipelines, plus cloud-hosted LLM agent workflows.
- Graphics: SVG anatomical diagram authoring.

Scale of work:
About 313 code changes (roughly half are backports of fixes to older supported releases), 185 bugs fixed, and about 82 design documents written or co-written. Project owner or lead developer on about 10 projects, including every generative AI project on the product. Mentored a 2026 intern and was one of two engineers assigned to a product-wide security review. Represented Lumens at Digestive Disease Week (DDW), the world's largest gastrointestinal health conference, and at ASGE's Global GI AI Summit.

Career arc:
- 2022 (intern): Designed and built an in-app contextual help system with tips triggered by user behavior. Wrote six approved design docs in about 10 weeks.
- 2023-2024: Shipped the help system to general release. Led drag-and-drop tagging of procedure images onto an interactive anatomical diagram. Did most of the full-stack work on diagrams for surgically altered anatomy. Built a new diagnoses section in the reporting UI. Took ownership of the billing-rule configuration tool.
- 2025: Designed and built the product's first LLM feature end to end, from initial design through pilot to on-by-default for all customers. Built the product's first agentic AI feature. Shipped a cross-product consent-content import pipeline. Built content-distribution tooling.
- 2026: Turned the separate AI features into a shared platform (metrics framework, feature gating, usage dashboard, default-on rollout). Did security remediation for his own product and on loan to another team. Shipped template sharing with user groups and image reordering. Mentored an intern and took over a stalled flagship UI project.

Top projects:
1. Agentic LLM feature that suggests ICD-10 diagnosis codes from procedure reports. Brian built the whole stack: web UI, server logic and storage, and the cloud-hosted LLM agent. When accuracy wasn't good enough, he redesigned the agent as a three-stage pipeline: generate candidate diagnoses, resolve them against each customer's own diagnosis catalog using tool calls mid-workflow, then verify the results. It ran about 138,000 production extractions in its first two months, clinicians accept 93.4% of its suggestions, and it has been approved to become on by default.
2. The product's first LLM feature, which Brian developed from start to finish: extracting the adenoma detection rate (ADR), a regulated colonoscopy quality metric, from pathology reports. He owned it from the initial design through the pilot and the rollout to on-by-default, and built a validation harness that runs against real data and a cost-capped backfill. It was 100% accurate on more than 3,000 orders at the pilot customer and is now on for all customers. At UGM 2026, AdventHealth called it "probably the most impactful feature."
3. An AI platform instead of one-off features. He generalized the extraction work into a multi-metric framework and added a second clinical metric, added an auto-file option that skips manual review when confidence allows, built an AI usage and feedback dashboard, and wrote a central module for rolling features out by default. Adding the next AI feature or metric is now mostly configuration.
4. New diagnoses section in the report editor. Replaced a component another team owned with a React and server module his team owns. It stores indications and post-procedure diagnoses, feeds billing, and became the data foundation for the AI diagnosis feature and a new outbound integration API.
5. Security remediation. Triaged and fixed over two dozen high-importance security findings, many surfaced by LLM-based scanning tools, including backports across multiple supported releases and a loan to another team to fix findings in an unfamiliar C# codebase. After each fix he sweeps for the same pattern elsewhere and files follow-ups.
6. Critical cross-product regression fix. A change by another team to a shared letter-editor component broke a workflow in a third product that reuses it, affecting about 120 customer sites. His fix accepted either product's permission and showed a read-only preview instead of an error, backported to three releases.
7. Drag-and-drop images onto an anatomical diagram. Owned it from design to release, including changes to shared canvas and diagram controls used by two other products, with sign-off from both teams. It was called out in release notes.
8. Diagrams of surgically altered anatomy (for example, after a Whipple procedure): SVG authoring, form logic, server libraries, and usage tracking. He fixed layout with CSS rather than reshaping released SVGs, because existing patient records store coordinates against them.
9. Cross-product content import pipeline that brings vendor consent-form content (risks, benefits, complications) from XML into the product's template store. Built as a C# web service, TypeScript-to-server bridge code, and an admin UI.
10. Billing-rule configuration tool. Refactored a large rule builder into a table-driven design so adding a billing code became a one-line change, then extended it across more than 10 procedure types and billing modifiers.

How Brian works:
- AI rollout discipline: every AI project goes through LLM design review, token and cost budget approval, a regulatory (medical-device) determination, early adoption with validation on real data, usage telemetry and a dashboard, transparency documentation, and on-by-default only once acceptance metrics support it.
- Test planning: writes test plans with explicit decision tables and requirement-coverage tables.
- Backports: routinely ships fixes to 2-4 older supported releases.
- Fixes the class, not the instance: after a fix, sweeps for the same pattern elsewhere.
- Backward compatibility first: prefers additive changes over reshaping released data, for example reading a new field with a fallback to the old one.

Lessons Brian likes to share:
- Put an explicit output contract on every LLM call and validate it strictly in code. Non-binary answers to yes/no prompts once caused a spike in failures.
- Ground generation in customer-specific reference data through tool calls instead of trusting free text.
- Keep patient data out of logs, prompts, and evaluation datasets.
- Agent code and server code ship on different schedules, so keep both sides backward compatible.
- Backfills over historical data cost real money, so cap them.
- When moving a value to a new field, list every reader and writer; readers should prefer the new field and fall back to the old one.
- Never let a data write depend on a UI view being rendered.
- Components shared across products need regression tests with each product's users and configuration.
- Treat every input path as possibly reaching more than one sink, and never return raw exception text across a trust boundary.
`;
