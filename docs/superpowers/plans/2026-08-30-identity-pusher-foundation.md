# Identity and Pusher Chat Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a migration-ready identity foundation and durable text-chat backend where PostgreSQL is authoritative and Pusher is a best-effort realtime delivery adapter.

**Architecture:** Prisma 7 owns a deliberately narrow identity/project/chat schema. Auth.js owns Google OAuth and database sessions; credentials registration/login creates the same opaque database-session records through a server-only identity module. The chat module persists idempotent, ordered messages in a transaction before invoking a provider-neutral realtime publisher; Pusher failures never roll back messages and clients can poll by sequence.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5, Prisma 7, Supabase PostgreSQL 17, Auth.js 5, Argon2id, Pusher Channels, Zod 4, Vitest.

**Spec:** `PRD.md`, `docs/BUSINESS_RULES.md`, `docs/DATA_STATE_MODEL.md`, `docs/TECHNICAL_ARCHITECTURE.md`, `docs/TEAM_JOBDESCS.md`

## Global Constraints

- Public registration accepts only `TALENT` and `BUSINESS`; Admin is internally provisioned.
- Google and email/password share Auth.js-compatible opaque database sessions.
- A credentials user may login before email verification, but workspace/chat authorization requires verified email.
- Existing-password accounts are never auto-linked to Google by matching email; linking requires an authenticated account-settings flow.
- PostgreSQL commits messages before Pusher publish; provider failure does not lose or reject a persisted message.
- Pusher private/presence authorization derives user identity and membership server-side.
- Chat tranche one includes TEXT/SYSTEM messages, presence, typing transport, receipts, unread, reconnect sync, and polling fallback.
- Attachments, voice notes, reactions, reports, search, support reopen, treasury, warranty, dispute, and portfolio tables are outside this migration.
- Secrets remain in environment variables and never enter source, logs, fixtures, or browser bundles except public Pusher key/cluster.
- Do not run migrations against Supabase automatically or from Vercel builds; review generated SQL first.

---

### Task 1: Prisma 7 Toolchain and Narrow Schema

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Modify: `prisma.config.ts`
- Replace: `prisma/schema.prisma`
- Create: `prisma/migrations/0001_identity_chat_foundation/migration.sql`
- Create: `prisma/migrations/migration_lock.toml`
- Create: `src/lib/db/prisma.ts`
- Test: `src/lib/db/schema-contract.test.ts`

**Interfaces:**
- Produces `getPrisma(): PrismaClient` and generated client at `src/generated/prisma`.
- Produces identity models (`User`, `Account`, `Session`, `IdentityToken`, `ConsentRecord`, role profiles) and chat models (`Project`, `ProjectApplication`, `ProjectAgreement`, `ProjectConversation`, `ConversationParticipant`, `ChatMessage`, `MessageReceipt`).

- [ ] Write a schema contract test asserting required models, relations, compound uniqueness, indexes, non-cascading conversation history, and absence of treasury/support models.
- [ ] Run `corepack pnpm test src/lib/db/schema-contract.test.ts`; expect RED against Rafi's broad draft.
- [ ] Install exact current Prisma 7, PostgreSQL adapter, Auth.js, Pusher, and Argon2 dependencies with pnpm.
- [ ] Replace the broad draft with the minimum typed schema and valid Prisma 7 config using `DIRECT_URL` for CLI migration operations.
- [ ] Add lazy Prisma Client singleton using `DATABASE_URL` and `@prisma/adapter-pg`.
- [ ] Run `prisma format`, `prisma validate`, and `prisma generate`.
- [ ] Generate migration SQL from empty schema without applying it to Supabase; add required SQL checks/indexes that Prisma cannot express.
- [ ] Run schema contract and TypeScript checks; expect PASS.

### Task 2: Identity Domain and Database Sessions

**Files:**
- Create: `src/modules/identity/types.ts`
- Create: `src/modules/identity/password.ts`
- Create: `src/modules/identity/session.ts`
- Create: `src/modules/identity/service.ts`
- Create: `src/modules/identity/index.ts`
- Test: `src/modules/identity/service.test.ts`
- Create: `src/adapters/identity/prisma-identity-store.ts`

**Interfaces:**
- Produces `registerPublicUser`, `loginWithCredentials`, `createDatabaseSession`, `getSessionUser`, `revokeSession`, and `verifyEmailToken`.
- Consumes a small `IdentityStore` interface so tests use an in-memory adapter and production uses Prisma.

- [ ] Write failing tests for normalized duplicate email, Admin rejection, Argon2id verification, required consent events, opaque session creation, suspension/version revocation, verification token expiry/consumption, and unverified-chat guard.
- [ ] Implement domain types and Argon2id helper.
- [ ] Implement identity module with transactional store methods hidden behind `IdentityStore`.
- [ ] Implement Prisma adapter transactions for User + profile + ConsentRecords + token + Session.
- [ ] Run identity tests and typecheck; expect PASS.

### Task 3: Auth.js and Auth Routes

**Files:**
- Create: `src/auth.ts`
- Create: `app/api/auth/[...nextauth]/route.ts`
- Create: `app/api/auth/register/route.ts`
- Create: `app/api/auth/credentials/route.ts`
- Create: `app/api/auth/logout/route.ts`
- Create: `app/api/auth/verify-email/route.ts`
- Create: `src/auth-ui/configured-adapter.ts`
- Modify: auth page form wiring as required
- Test: `src/auth-ui/configured-adapter.test.ts`

**Interfaces:**
- Produces `auth()` for server authorization and Auth.js route handlers.
- Uses one explicit `authjs.session-token` cookie for Google and credentials sessions.

- [ ] Write failing tests proving UI adapter sends exact payloads and maps server results without claiming success on errors.
- [ ] Configure Google provider, Prisma Adapter, database sessions, explicit cookie, role/status session projection, and safe account-link conflict behavior.
- [ ] Implement registration/credentials/logout/verification routes using identity module; never accept public Admin input.
- [ ] Replace unavailable UI adapter with configured adapter while preserving loading/error/focus behavior.
- [ ] Run auth tests and typecheck; expect PASS.

### Task 4: Durable Chat Domain

**Files:**
- Create: `src/modules/chat/types.ts`
- Create: `src/modules/chat/service.ts`
- Create: `src/modules/chat/index.ts`
- Create: `src/modules/chat/in-memory-store.ts`
- Test: `src/modules/chat/service.test.ts`
- Create: `src/adapters/chat/prisma-chat-store.ts`

**Interfaces:**
- Produces `authorizeConversationAccess`, `createMessage`, `listMessagesAfter`, and `markConversationRead`.
- Consumes `ChatStore` and `RealtimePublisher` interfaces.

- [ ] Write failing tests for participant authorization, unverified/suspended rejection, writable state, idempotent `clientMessageId`, monotonic sequence, Pusher failure after persistence, polling after sequence, and unread updates.
- [ ] Implement chat domain with TEXT/SYSTEM validation and provider-independent events.
- [ ] Implement Prisma store with interactive transaction for sequence allocation and message insert.
- [ ] Run chat tests and typecheck; expect PASS.

### Task 5: Pusher Adapter and Chat Routes

**Files:**
- Create: `src/adapters/realtime/pusher-server.ts`
- Create: `src/adapters/realtime/pusher-client.ts`
- Create: `src/adapters/realtime/types.ts`
- Create: `app/api/realtime/auth/route.ts`
- Create: `app/api/chat/[conversationId]/messages/route.ts`
- Create: `app/api/chat/[conversationId]/read/route.ts`
- Test: `src/adapters/realtime/pusher-server.test.ts`
- Test: route handler tests

**Interfaces:**
- Presence channel name is `presence-project-{projectId}`.
- Pusher payload uses persisted `messageId` and `sequenceNumber`; user identity comes from `auth()` and database membership.

- [ ] Write failing tests for channel-name parsing, spoofed identity rejection, outsider 403, unverified 403, server-derived presence data, provider failure tolerance, and polling response ordering.
- [ ] Implement server Pusher adapter behind `RealtimePublisher`.
- [ ] Implement authorization and message/read route handlers with Zod trust-boundary parsing.
- [ ] Add client Pusher factory using only `NEXT_PUBLIC_PUSHER_KEY` and `NEXT_PUBLIC_PUSHER_CLUSTER`.
- [ ] Run integration tests and typecheck; expect PASS.

### Task 6: Environment Contract and Verification

**Files:**
- Create: `.env.example`
- Modify: `README.md`
- Modify: `docs/TECHNICAL_ARCHITECTURE.md` only if implementation-specific facts differ
- Test: environment/schema contract tests

**Interfaces:**
- Documents `DATABASE_URL`, `DIRECT_URL`, Auth.js, Google, Pusher server, and Pusher public variables without values.

- [ ] Add placeholder-only `.env.example` and staging setup instructions.
- [ ] Verify no secret-like values exist in tracked files.
- [ ] Run `prisma validate`, `prisma generate`, focused tests, `pnpm verify`, and relevant E2E.
- [ ] Inspect generated migration SQL and record that it has not been applied to Supabase.
