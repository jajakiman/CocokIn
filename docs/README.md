# CocokIn Documentation

This directory separates product intent, business policy, operational flow, runtime architecture, and data-state contracts so each decision has one canonical owner.

## Canonical Documents

| Document | Canonical responsibility |
|---|---|
| [`../PRD.md`](../PRD.md) | Product vision, personas, functional requirements, design direction, and roadmap |
| [`BUSINESS_RULES.md`](BUSINESS_RULES.md) | Commercial policy, protected funding, fees, milestone release, infrastructure ownership, handover, warranty, maintenance, cancellation, and dispute |
| [`BUSINESS_FLOW.md`](BUSINESS_FLOW.md) | Actor sequences, triggers, preconditions, side effects, notifications, and failure paths |
| [`TECHNICAL_ARCHITECTURE.md`](TECHNICAL_ARCHITECTURE.md) | Locked stack, module/runtime boundaries, providers, security, testing, and deployment |
| [`DATA_STATE_MODEL.md`](DATA_STATE_MODEL.md) | Aggregates, entities, independent state transitions, domain events, idempotency, ledger, and invariants |

## Reading Paths

### Developer

1. [`TECHNICAL_ARCHITECTURE.md`](TECHNICAL_ARCHITECTURE.md)
2. [`DATA_STATE_MODEL.md`](DATA_STATE_MODEL.md)
3. [`BUSINESS_FLOW.md`](BUSINESS_FLOW.md)
4. [`BUSINESS_RULES.md`](BUSINESS_RULES.md)
5. [`../PRD.md`](../PRD.md)

### QA

1. [`BUSINESS_FLOW.md`](BUSINESS_FLOW.md)
2. [`BUSINESS_RULES.md`](BUSINESS_RULES.md)
3. [`DATA_STATE_MODEL.md`](DATA_STATE_MODEL.md)
4. [`../PRD.md`](../PRD.md)

### UI/UX

1. [`../PRD.md`](../PRD.md), especially personas and design guidelines
2. [`BUSINESS_FLOW.md`](BUSINESS_FLOW.md)
3. [`BUSINESS_RULES.md`](BUSINESS_RULES.md), especially review, handover, warranty, and fee transparency

### Product or Stakeholder

1. [`../PRD.md`](../PRD.md)
2. [`BUSINESS_FLOW.md`](BUSINESS_FLOW.md)
3. [`BUSINESS_RULES.md`](BUSINESS_RULES.md)

## Change Ownership

| Change type | Update first | Then check |
|---|---|---|
| New or changed feature | `PRD.md` | Flow, state model, architecture |
| Fee, SLA, refund, warranty, or maintenance policy | `BUSINESS_RULES.md` | Flow and state model |
| Actor sequence or exception path | `BUSINESS_FLOW.md` | Rules and state model |
| Provider, framework, runtime, or security boundary | `TECHNICAL_ARCHITECTURE.md` | PRD and deployment notes |
| Entity, invariant, event, or transition | `DATA_STATE_MODEL.md` | Flow and business rules |

## Documentation Rules

- Reference `FR-*` and `BR-*` IDs rather than copying policy text into multiple documents.
- Keep project, milestone, payment, infrastructure, warranty, and maintenance states independent.
- Use **Protected Project Funding** in product documentation until Xendit and legal approval authorize an escrow claim.
- Keep Mermaid diagrams valid GitHub-flavored Markdown.
- Do not include API keys, credentials, personal evidence, or production URLs.
- Record unresolved provider/legal decisions as explicit launch gates, not hidden assumptions.

## Implementation Plans

Agent execution plans live under [`superpowers/plans/`](superpowers/plans/). They are execution aids, not product or policy sources of truth.
