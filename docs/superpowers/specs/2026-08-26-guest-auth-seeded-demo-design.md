# CocokIn Guest, Auth UI Contract, and Seeded Demo Design

**Date:** 2026-08-26
**Owner:** Zaky
**Required integration/review:** Farid for Auth.js, database sessions, authorization, and persistent consent
**Status:** Proposed design awaiting written-spec review

## Objective

Replace the internal role-preview home page with a production-shaped guest journey while keeping authentication security boundaries explicit. The slice delivers a consistent CocokIn frontend for public marketing, login and registration presentation, account/logout presentation contracts, and deterministic synthetic staging data.

This slice does not implement Auth.js sessions, database persistence, RBAC, suspension, or server-side route guards. Those remain FARID-01 and FARID-02 responsibilities.

## Canonical Sources

- `PRD.md` sections 6.2, 6.3, 7, and 8
- `docs/TEAM_JOBDESCS.md` Zaky owned path `app/(marketing)/**`
- `docs/TEAM_JOBDESCS.md` FARID-01 Identity, Consent, and Authorization
- `docs/DATA_STATE_MODEL.md` consent and `SEEDED_DEMO` rules
- `docs/adr/0002-production-shaped-simulated-adapters.md`
- `design-system/cocokin/MASTER.md`
- `design-system/cocokin/pages/marketing.md`
- `design-system/cocokin/pages/onboarding.md`
- Local `ui-ux-pro-max` and `taste-skill` guidance

## Scope

### In Scope

- Guest landing page at `/`
- Public navigation and footer
- Login UI at `/login`
- Role choice at `/register`
- Talent registration UI at `/register/talent`
- UMKM registration UI at `/register/business`
- Forgot-password UI at `/forgot-password`
- Google and email/password auth presentation contracts
- Password-manager, paste, and autofill-friendly form semantics
- Account menu and logout presentation contract for authenticated shells
- Demo-mode entry at `/demo` and persistent demo labeling
- Central deterministic synthetic fixture data marked `SEEDED_DEMO`
- Consistent loading, validation, error, and unavailable-auth states
- Responsive and accessibility tests for public/auth/demo surfaces

### Out of Scope

- Auth.js configuration and providers
- Credential verification
- Password hashing and reset-token generation
- Database sessions and session invalidation
- OAuth secrets and callbacks
- RBAC, suspension, role revocation, and resource authorization
- Prisma schema, migrations, and persistent consent records
- Production seeding
- Real user data

## Product Boundaries

### Public Registration

- Talent and UMKM may choose public registration.
- Admin registration is never exposed publicly.
- Admin accounts are provisioned through Farid's internal identity workflow.

### Auth Methods

- The UI presents Google OAuth and email/password.
- The UI calls an injected auth adapter contract.
- Until Farid provides Auth.js, the default adapter returns an explicit `AUTH_NOT_CONFIGURED` result.
- The frontend must never create a fake authenticated session in `localStorage`, cookies, or React context.

### Redirect Contract

After a successful real session is returned by Farid's adapter:

```text
TALENT   -> /talent
BUSINESS -> /business
ADMIN    -> /admin
```

Unknown, revoked, or suspended roles fail closed and render a permission state.

### Logout Contract

- The dashboard account menu exposes `Keluar` separately from normal navigation.
- The UI invokes the auth adapter's logout operation.
- On successful server-session invalidation, navigation returns to `/`.
- Demo mode uses `Keluar dari demo`, not `Logout`, because demo mode is not authentication.

## Guest Landing Information Architecture

The landing page follows a two-sided marketplace structure and the Marketing override. It uses a spacious rhythm and a controlled Arctic Depths hero treatment without generic purple gradients, glass-heavy cards, fabricated testimonials, or three identical feature-card rows.

### Section Order

1. **Public header**
   - CocokIn brand
   - Cara Kerja
   - Untuk Talent
   - Untuk UMKM
   - Masuk
   - Daftar

2. **Two-sided hero**
   - One shared value proposition
   - Equal CTAs: `Mulai sebagai Talent` and `Mulai sebagai UMKM`
   - Secondary action: `Lihat demo sistem`
   - Clear label that demo data is synthetic

3. **Problem to outcome**
   - Talent: measurable readiness, real project evidence, verified portfolio
   - UMKM: bounded digital problem, suitable talent, reviewable outcome

4. **How CocokIn works**
   - Skill
   - Assessment
   - Cocok Score
   - Micro-project
   - Verification

5. **Product proof**
   - Career Readiness
   - Explainable Cocok Score
   - Milestone review workspace
   - Verified Passport and Portfolio
   - Every visual is labeled as a synthetic product demonstration

6. **Trust and safety**
   - Cocok Score is deterministic
   - Portfolio publication requires Talent consent and UMKM attribution approval
   - Demo data is synthetic
   - Real-money operation remains gated

7. **Final two-path CTA**

8. **Public footer**
   - Product navigation
   - Privacy and terms links appear only after real legal routes exist; no dead or placeholder links
   - Demo and design-system access only when appropriate for staging/development

## Authentication UX

### Auth Shell

Auth pages use a focused layout without dashboard navigation. Desktop uses a split composition with concise product context; mobile shows the form first. The form column remains readable and never exceeds 480 px.

### Login Form

Fields and semantics:

```text
email    type=email    autocomplete=email
password type=password autocomplete=current-password
```

Requirements:

- Visible labels
- Password visibility toggle with accessible name
- Paste is allowed
- Password managers are supported
- Google auth button has a text label
- Submit has loading and disabled states
- Inline field errors and focusable `ErrorSummary`
- Forgot-password link
- Register link
- No CAPTCHA-only or cognitive-only authentication requirement

### Registration Role Choice

`/register` presents two distinct choices:

- Talent: career readiness, projects, verified evidence
- UMKM: digital diagnosis, project creation, review and outcome

No Admin option appears.

### Registration Forms

Common fields:

- Full name
- Email
- Password
- Confirm password
- Required Terms acceptance
- Required Privacy processing consent

Role-specific onboarding details remain in their existing onboarding flows. Optional marketing and portfolio consent remain purpose-separated and are not bundled into account creation.

### Forgot Password

The UI accepts an email address and calls the adapter contract. Before the email provider is configured, it returns an honest unavailable state. The frontend does not claim an email was sent when no provider exists.

## Auth Presentation Contract

The frontend exposes a provider-neutral interface for Farid:

```typescript
type AuthRole = "TALENT" | "BUSINESS" | "ADMIN";

type AuthUser = {
  id: string;
  displayName: string;
  email: string;
  role: AuthRole;
};

type AuthResult =
  | { ok: true; user: AuthUser }
  | {
      ok: false;
      code:
        | "INVALID_CREDENTIALS"
        | "ACCOUNT_SUSPENDED"
        | "ROLE_REVOKED"
        | "AUTH_NOT_CONFIGURED"
        | "PROVIDER_UNAVAILABLE";
      message: string;
    };

type AuthUiAdapter = {
  loginWithCredentials(input: { email: string; password: string }): Promise<AuthResult>;
  loginWithGoogle(): Promise<AuthResult>;
  register(input: {
    role: "TALENT" | "BUSINESS";
    fullName: string;
    email: string;
    password: string;
    termsAccepted: boolean;
    privacyAccepted: boolean;
  }): Promise<AuthResult>;
  requestPasswordReset(email: string): Promise<{ ok: boolean; message: string }>;
  logout(): Promise<{ ok: boolean; message?: string }>;
};
```

The adapter interface is a frontend integration seam, not an authorization boundary. Farid's server-side implementation must validate and authorize every mutation.

## Demo Mode

### Entry

`/demo` offers Talent and UMKM product previews. Admin demo is not promoted publicly.

### Behavior

- A persistent `Mode Demo - Data sintetis` banner appears on every demo dashboard route.
- Demo navigation may use a query or route namespace chosen in the implementation plan, but it must not masquerade as a session.
- Demo controls only mutate in-memory or non-sensitive browser draft state.
- Financial, consent, publication, and authorization-sensitive actions are disabled or visibly simulated.
- Exit uses `Keluar dari demo` and returns to `/`.

## Seeded Demo Data

### Source of Truth

All current per-component fixtures are migrated into:

```text
src/fixtures/seeded-demo/
  identity.ts
  talent.ts
  business.ts
  projects.ts
  portfolio.ts
  index.ts
```

Every top-level record includes:

```typescript
type SeedMetadata = {
  source: "SEEDED_DEMO";
  synthetic: true;
};
```

### Rules

- Names, institutions, UMKM, projects, references, and URLs are synthetic.
- No real person's data enters seed or staging.
- Seed consent is display-only and never treated as real-person consent.
- Seed credentials are not embedded in frontend code.
- Demo seed and auth session are separate concepts.
- Farid's later Prisma seed must refuse production and preserve deterministic IDs.

## Frontend Consistency

### Foundation

- Plus Jakarta Sans through `next/font`
- Arctic Depths semantic tokens from `MASTER.md`
- Phosphor Icons only
- Control radius 8 px
- Card radius 12 px
- Dialog/sheet radius 16 px
- Pills only for tags and statuses
- Flat-first presentation: borders and whitespace before shadows

### Marketing Density

- Lower density than dashboards
- Controlled hero gradient only
- 48-96 px section spacing depending on viewport
- No decorative motion required for comprehension
- No fabricated user counts, ratings, testimonials, or outcomes

### Responsive Behavior

- Public header collapses to an accessible menu below 768 px.
- Guest/auth routes never use the authenticated bottom navigation.
- Auth form appears before supporting content on mobile.
- No horizontal page scroll.
- Touch targets are at least 44 x 44 px with at least 8 px action separation.
- Long Indonesian names, business names, and validation messages wrap without clipping.

### Account and Logout Presentation

- Account menu includes display name, email, role, account/profile action, and logout.
- Logout is visually separated from routine navigation.
- The account menu restores focus to its trigger when closed.
- Destructive or session-ending actions explain their consequence.

## Error and State Handling

Required states:

- Initial
- Submitting
- Field validation error
- Invalid credentials
- Auth not configured
- Provider unavailable
- Account suspended
- Role revoked
- Password-reset unavailable
- Demo mode
- Permission denied

Transient confirmation may use a status message, but auth failure and permission truth remain persistent until resolved.

## Testing

### Unit and Component Tests

- Landing renders both role CTAs and no public Admin registration
- Login autocomplete attributes and password visibility toggle
- Password paste remains enabled
- Validation errors link to fields and focus the error summary
- Auth adapter unavailable state is honest
- Role selection routes correctly
- Account menu logout presentation is separated
- Demo banner and exit action
- Seed records all carry `SEEDED_DEMO` and `synthetic: true`

### E2E Tests

- Guest landing navigation
- Talent registration UI flow
- UMKM registration UI flow
- Login error and unavailable-auth flow
- Keyboard-only auth operation
- Demo entry and exit
- Public/auth/demo surfaces at 320x568, 375x812, 768x1024, 1024x768, and 1440x900
- Reduced motion and 200% zoom smoke coverage

### Deferred Integration Tests

The following cannot pass until Farid implements FARID-01:

- Real session creation and invalidation
- Cross-role route guards
- Suspended/revoked user denial
- Server-side registration persistence
- Persistent consent history

## Acceptance Criteria

- `/` is a coherent guest landing page, not an internal role picker.
- Talent and UMKM have equal registration paths; Admin does not.
- Login and registration UI follow accessible auth semantics.
- The UI does not create or imply fake authenticated sessions.
- Demo mode is visibly synthetic on every demo surface.
- Fixture data is centralized and marked `SEEDED_DEMO`.
- Existing Talent functionality consumes centralized synthetic fixture data where applicable.
- Public/auth/demo frontend uses the same Arctic Depths tokens and component semantics.
- Relevant unit, Playwright, lint, typecheck, and production build checks pass.
- Documentation explicitly lists FARID-01 dependencies before real auth can be called complete.
