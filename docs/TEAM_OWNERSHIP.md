# CocokIn Team Ownership

This file is the ownership index. Detailed responsibilities, deliverables, dependencies, and completion criteria live in [`TEAM_JOBDESCS.md`](TEAM_JOBDESCS.md).

| Owner | Vertical responsibility | Primary paths |
|---|---|---|
| Zaky | Talent, matching, design system, responsive UI, accessibility | `src/modules/talent`, `src/modules/matching`, `src/design-system`, Talent/public routes |
| Rafi | UMKM, marketplace, delivery, Pusher chat, handover | `src/modules/business`, `src/modules/marketplace`, `src/modules/delivery`, `src/modules/chat`, Business/project routes |
| Farid | Identity, database, treasury, payout/refund, support, Admin, deployment | `src/modules/identity`, `src/modules/payments`, `src/modules/support`, `src/modules/disputes`, `prisma`, Admin/API routes |

## Review Gates

- Design-system changes require Zaky and one component consumer.
- Marketplace, delivery, and chat changes require Rafi.
- Schema, authorization, consent, and financial changes require Farid plus one peer.
- Shared interfaces require review from every downstream owner.
- Financial, authorization, consent, destructive migration, and suspension changes cannot be self-merged.

## Cross-Owner Contracts

- Zaky publishes `CocokScoreResult`; Rafi consumes it and does not recalculate matching.
- Rafi publishes `ApprovedMilestoneRelease`; Farid validates it and creates payout instructions but cannot approve milestones.
- Farid publishes funding/settlement states; Rafi consumes them but cannot mutate financial state directly.
- Zaky publishes role-neutral design-system interfaces; Rafi and Farid configure them without forking role themes.
