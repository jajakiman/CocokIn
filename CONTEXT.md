# CocokIn Domain Context

## Core Terms

- **Talent:** A young professional who applies skills to an UMKM micro-project and earns verified evidence.
- **UMKM:** The business actor that publishes, funds, reviews, and owns the result of a project.
- **Project:** The agreement boundary connecting one UMKM with one selected Talent and one to four milestones.
- **Milestone:** A payable delivery unit with measurable acceptance criteria and a percentage weight.
- **Submission:** An immutable version of a milestone result, centered on an HTTPS staging URL and review evidence.
- **Review:** The UMKM decision that approves existing scope, requests revision, requests changed scope, or opens a dispute.
- **Cocok Score:** A deterministic 0-100 match score; AI may explain it but cannot determine it.
- **Project Conversation:** Private project-scoped communication opened after Talent selection. Chat cannot amend an agreement or move money.
- **Funding Receipt:** Full project Service Value plus platform fee received into CocokIn's legal-entity account and reconciled to one Project.
- **Liability Reserve:** Cash that must remain untouched to cover outstanding Talent payable, UMKM refundable, and pending platform fee. Required coverage is 100%.
- **Activation Fee:** Five percent of Service Value earned by CocokIn when agreement, funding, workspace, and project activation complete.
- **Success Fee:** Five percent of Service Value earned by CocokIn when handover succeeds without an active handover dispute.
- **Milestone Payout:** Ninety percent of an approved milestone paid to Talent; ten percent remains Talent warranty retention.
- **Warranty Retention:** The accumulated ten percent of Service Value payable to Talent after the 30-day warranty and dispute guards pass.
- **Platform Reference:** A unique CocokIn code attached to every funding, payout, refund, and fee movement.
- **External Reference:** The immutable reference returned by the bank or QRIS acquirer for the same movement.
- **Verified Portfolio:** A project-derived portfolio entry published only after completion and explicit Talent publication consent.

## Invariants

- Project, milestone, payment, infrastructure, warranty, maintenance, conversation, and dispute states are independent.
- CocokIn is not described as licensed escrow without legal authorization.
- Real-money funding remains disabled until legal, bank/acquirer, accounting, AML/KYC, reconciliation, and treasury gates pass.
- Chat messages are durable in PostgreSQL before Pusher events are broadcast.
- Seed identities and consent are synthetic and never imply consent from a real person.
