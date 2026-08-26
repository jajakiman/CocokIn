# Guest, Auth UI, and Seeded Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the internal role picker with a consistent guest landing, accessible auth presentation contract, visibly synthetic demo flow, and centralized deterministic seed data.

**Architecture:** Frontend forms consume a provider-neutral `AuthUiAdapter`; the built-in adapter fails honestly with `AUTH_NOT_CONFIGURED` and never creates a session. All preview surfaces consume `SEEDED_DEMO` fixtures from one source. Auth.js, PostgreSQL sessions, RBAC, and server guards remain Farid-owned integrations.

**Tech Stack:** Next.js 16, React 19, TypeScript 5, Zod 4, Tailwind CSS 4/native CSS, Phosphor Icons, Vitest, Testing Library, Playwright.

**Spec:** `docs/superpowers/specs/2026-08-26-guest-auth-seeded-demo-design.md`

## Global Constraints

- Work directly on `dev`; do not create feature branches or task PRs.
- Do not push, publish, or configure secrets without explicit user approval.
- Public registration supports only `TALENT` and `BUSINESS`; Admin is internal-only.
- Do not create fake auth sessions in localStorage, cookies, or React context.
- Demo mode uses `Keluar dari demo`, never `Logout`.
- Every top-level demo record has `source: "SEEDED_DEMO"` and `synthetic: true`.
- Use Plus Jakarta Sans, Arctic Depths semantic tokens, and Phosphor Icons only.
- Controls use 8px radius, cards 12px, dialogs/sheets 16px; pills are reserved for tags/status.
- Borders and whitespace precede shadows; marketing pages are lower-density than dashboards.
- Touch targets are at least 44x44px; paste, autofill, and password managers remain enabled.
- Verify at 320x568, 375x812, 768x1024, 1024x768, and 1440x900.

---

### Task 1: Centralized Seeded Demo Data

**Files:**
- Create: `src/fixtures/seeded-demo/types.ts`
- Create: `src/fixtures/seeded-demo/identity.ts`
- Create: `src/fixtures/seeded-demo/talent.ts`
- Create: `src/fixtures/seeded-demo/business.ts`
- Create: `src/fixtures/seeded-demo/projects.ts`
- Create: `src/fixtures/seeded-demo/portfolio.ts`
- Create: `src/fixtures/seeded-demo/workspace.ts`
- Create: `src/fixtures/seeded-demo/index.ts`
- Test: `src/fixtures/seeded-demo/seeded-demo.test.ts`

**Interfaces:**
- Produces `SeedMetadata`, `SeededRecord<T>`, deterministic records, and fresh-copy factories consumed by dashboard/demo tasks.

- [ ] Write failing tests asserting all top-level records are synthetic, IDs are deterministic, and mutable factories return distinct copies.
- [ ] Run `corepack pnpm test src/fixtures/seeded-demo/seeded-demo.test.ts`; expect missing-module failure.
- [ ] Implement the minimum typed fixtures and factories.
- [ ] Re-run the targeted test; expect PASS.
- [ ] Run `corepack pnpm typecheck`; expect PASS.

### Task 2: Auth Presentation Contract and Validation

**Files:**
- Create: `src/auth-ui/types.ts`
- Create: `src/auth-ui/adapter.ts`
- Create: `src/auth-ui/schemas.ts`
- Test: `src/auth-ui/auth-ui.test.ts`

**Interfaces:**
- Produces `AuthRole`, `AuthUser`, `AuthResult`, `PublicRegistrationRole`, `AuthUiAdapter`, `unavailableAuthAdapter`, `loginSchema`, `registrationSchema`, and `forgotPasswordSchema`.

- [ ] Write failing tests for Admin registration rejection, required consent, password mismatch, valid input, and honest unavailable adapter results.
- [ ] Run `corepack pnpm test src/auth-ui/auth-ui.test.ts`; expect missing-module failure.
- [ ] Implement exact contracts from the spec using Zod at trust boundaries.
- [ ] Re-run targeted tests; expect PASS.
- [ ] Run `corepack pnpm typecheck`; expect PASS.

### Task 3: Public Shell and Design-System Styles

**Files:**
- Create: `src/components/public/public-header.tsx`
- Create: `src/components/public/public-footer.tsx`
- Create: `src/design-system/styles/public.css`
- Modify: `app/globals.css`
- Test: `src/components/public/public-shell.test.tsx`

**Interfaces:**
- Produces `PublicHeader` and `PublicFooter` for landing/auth/demo routes.

- [ ] Write failing tests for navigation landmarks, accessible mobile menu state, Talent/UMKM links, no Admin registration, and synthetic-demo footer labeling.
- [ ] Run the targeted test; expect failure.
- [ ] Implement keyboard-operable public navigation and footer with no dead legal links.
- [ ] Import `public.css` from `globals.css` without duplicating foundation tokens.
- [ ] Re-run tests and typecheck; expect PASS.

### Task 4: Guest Landing

**Files:**
- Create: `src/components/marketing/role-path.tsx`
- Create: `src/components/marketing/product-proof.tsx`
- Create: `src/components/marketing/guest-landing.tsx`
- Modify: `app/page.tsx`
- Modify: `app/layout.tsx`
- Test: `src/components/marketing/guest-landing.test.tsx`

**Interfaces:**
- Consumes centralized seed data and public shell.
- Produces the public product entry at `/`.

- [ ] Write failing tests for one H1, equal Talent/UMKM CTAs, demo CTA, semantic landmarks, synthetic labels, and absent Admin registration.
- [ ] Run targeted test; expect failure.
- [ ] Implement the approved eight-section information architecture without fabricated proof.
- [ ] Update metadata to `CocokIn | Talent Bertumbuh, UMKM Naik Kelas` with accurate description/OpenGraph copy.
- [ ] Re-run tests and typecheck; expect PASS.

### Task 5: Accessible Auth Components and Routes

**Files:**
- Create: `src/components/auth/auth-shell.tsx`
- Create: `src/components/auth/password-field.tsx`
- Create: `src/components/auth/login-form.tsx`
- Create: `src/components/auth/role-choice.tsx`
- Create: `src/components/auth/registration-form.tsx`
- Create: `src/components/auth/forgot-password-form.tsx`
- Create: `src/design-system/styles/auth.css`
- Create: `app/login/page.tsx`
- Create: `app/register/page.tsx`
- Create: `app/register/talent/page.tsx`
- Create: `app/register/business/page.tsx`
- Create: `app/forgot-password/page.tsx`
- Modify: `app/globals.css`
- Test: `src/components/auth/auth-components.test.tsx`

**Interfaces:**
- Consumes `AuthUiAdapter` and Zod schemas.
- Produces accessible login, role choice, registration, and password reset presentation.

- [ ] Write failing tests for autocomplete, paste support, password visibility, linked errors, focusable summary, Google label, unavailable state, and no Admin role.
- [ ] Run targeted tests; expect failure.
- [ ] Implement form components with visible labels, loading/disabled states, and persistent adapter errors.
- [ ] Implement routes using `unavailableAuthAdapter`; do not redirect on failure.
- [ ] Re-run tests and typecheck; expect PASS.

### Task 6: Demo Banner, Account Menu Contract, and Demo Route

**Files:**
- Create: `src/design-system/demo-banner.tsx`
- Create: `src/design-system/permission-state.tsx`
- Create: `src/components/auth/account-menu.tsx`
- Create: `app/demo/page.tsx`
- Modify: `src/design-system/app-shell.tsx`
- Test: `src/design-system/demo-banner.test.tsx`
- Test: `src/components/auth/account-menu.test.tsx`

**Interfaces:**
- Consumes `AuthUser` and `AuthUiAdapter.logout` contract.
- Produces visible demo labeling, query-preserving demo navigation, demo exit, permission state, and future session account presentation.

- [ ] Write failing tests for permanent demo label, `Keluar dari demo`, query preservation, separated logout action, focus restoration, and persistent logout failure.
- [ ] Run targeted tests; expect failure.
- [ ] Implement `/demo` with Talent and UMKM only.
- [ ] Modify AppShell to preserve `?demo=` on internal links and render `DemoBanner` only in demo mode.
- [ ] Re-run tests and typecheck; expect PASS.

### Task 7: Migrate Existing Fixtures to Seed Source

**Files:**
- Modify: `src/context/talent-context.tsx`
- Modify: `src/components/talent/project-catalog.tsx`
- Modify: `src/components/talent/workspace-view.tsx`
- Modify: `app/talent/skill-gap/page.tsx`
- Modify: `app/talent/portfolio/page.tsx`
- Modify: `app/p/[id]/page.tsx`
- Modify: `src/design-system/dashboard-preview.tsx`
- Modify: `app/dev/design-system/page.tsx`

**Interfaces:**
- Consumes Task 1 factories; preserves all existing domain calculations and component contracts.

- [ ] Add/adjust tests proving current deterministic scores, passport evidence, workspace cloning, and public-data sanitization remain intact.
- [ ] Run affected tests; establish expected RED where fixture imports are not wired.
- [ ] Replace ad-hoc production fixture literals with centralized imports/factories.
- [ ] Rename browser draft key to `cocokin_seeded_demo_talent_draft`; never store auth or claim real consent.
- [ ] Search production TS/TSX for remaining `MOCK_`, `mockPortfolios`, `mockScores`, and duplicated seed identities.
- [ ] Re-run affected tests and typecheck; expect PASS.

### Task 8: Design-System Catalog and Full E2E

**Files:**
- Modify: `app/dev/design-system/page.tsx`
- Create: `tests/e2e/guest-auth.spec.ts`
- Modify: `tests/e2e/responsive.spec.ts`
- Modify: `tests/e2e/smoke.spec.ts`

**Interfaces:**
- Documents public/auth/demo states and verifies the integrated user journey.

- [ ] Add catalog examples for public header, auth shell, password field, demo banner, account menu, permission state, loading, and persistent errors.
- [ ] Write E2E tests for guest CTAs, Talent/UMKM registration, auth unavailable, forgot-password unavailable, demo enter/navigation/exit, keyboard operation, 200% zoom, reduced motion, and no horizontal overflow.
- [ ] Correct viewport height to 375x812.
- [ ] Run `corepack pnpm test:e2e`; expect PASS.
- [ ] Run `corepack pnpm verify`; expect lint/typecheck/unit/build PASS.

### Task 9: Cross-Owner Review Documentation

**Files:**
- Modify: `docs/superpowers/specs/2026-08-26-guest-auth-seeded-demo-design.md`

**Interfaces:**
- Produces an explicit integration checklist for FARID-01 without claiming authentication complete.

- [ ] Record implemented frontend adapter signatures and routes.
- [ ] Record deferred Auth.js/session/RBAC/consent integration tests.
- [ ] Record local verification evidence.
- [ ] Run `git diff --check`; expect no whitespace errors.
- [ ] Inspect `git status` and ensure only intended files changed.
