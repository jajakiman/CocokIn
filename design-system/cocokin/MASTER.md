# CocokIn Product Experience Guide

> **Direction:** Official CocokIn identity, trustworthy + energetic
> **Theme:** Light-first
> **Applies to:** Talent, UMKM, Admin, and public pages

## Consistency Contract

- All roles use the same typography, semantic colors, spacing, radius, elevation, motion, icon family, shell, and shared components.
- Roles differ only in navigation content, information priority, wording, and density.
- No role-specific primary color or component fork.
- Route components use semantic tokens, never raw hex values.
- Page overrides may change composition and density but cannot redefine foundation tokens.

## Color Palette

### Official CocokIn Brand

| Token | Value | Use | Safe foreground |
|---|---:|---|---:|
| `brand-navy` | `#001040` | Primary actions, headings, structural dark surfaces | `#FFFFFF` |
| `brand-blue` | `#0080FF` | Logo gradient source and decorative blue | `#001040` |
| `interactive` | `#006FE6` | Links, focus, active controls, charts | `#FFFFFF` for large/bold text only |
| `brand-orange` | `#FF8010` | Opportunity, UMKM accent, selected brand detail | `#001040` |
| `brand-gold` | `#FFA020` | Hover/highlight accent | `#001040` |

Contrast decisions:

- Navy/white is about 18.29:1 and is the primary CTA pair.
- Logo blue/white is about 3.80:1 and is not used for normal white text.
- Orange/white is about 2.52:1 and is forbidden for white button text.
- Navy/logo blue is about 4.82:1.
- Navy/orange is about 7.27:1 and is the approved orange text pairing.

### Surface and Text

```text
background          #F7F9FC
surface             #FFFFFF
surface-subtle      #F1F5FB
surface-selected    #EAF3FF
border              #D8E1EE
border-strong       #9AABC2
foreground          #001040
muted-foreground    #53647A
```

### Semantic Status

| Meaning | Strong | Subtle | Foreground on subtle |
|---|---:|---:|---:|
| Success / verified | `#047857` | `#ECFDF5` | `#047857` |
| Warning / revision | `#B45309` | `#FFFBEB` | `#92400E` |
| Destructive / error | `#BE123C` | `#FFF1F2` | `#9F1239` |
| Information | `#006FE6` | `#EAF3FF` | `#005DCC` |
| Neutral | `#64748B` | `#F1F5F9` | `#475569` |

Every status includes text plus an icon/shape. Color is never the only carrier.

## Typography

- Family: Plus Jakarta Sans through `next/font`.
- Display: 48/52, 700.
- Page title: 32/40, 700.
- Section title: 24/32, 700.
- Component title: 18/26, 600.
- Body: 16/24, 400.
- Small: 14/20, 400.
- Label: 14/20, 600.
- Caption: 12/16, 500, nonessential metadata only.
- Currency, scores, timers, and tabular data use tabular figures.
- Prose measure is 35-60 characters on mobile and 60-75 on desktop.

## Spacing, Shape, Elevation

```text
spacing: 4, 8, 12, 16, 24, 32, 48, 64
control radius: 8px
card radius: 12px
dialog/sheet radius: 16px
pill: tags and statuses only
```

UI is flat by default. Use borders and whitespace before shadows. One subtle card shadow and one dialog shadow are allowed.

## Motion

```text
fast       120ms
standard   180ms
emphasis   240ms
```

- Animate transform/opacity only.
- Motion communicates feedback and continuity, never decoration on payment, review, dispute, or error flows.
- `prefers-reduced-motion` renders final state immediately.

## Iconography

Phosphor Icons is the only structural icon family. Use 16px inline, 20px controls, and 24px navigation. Decorative icons beside visible labels use `aria-hidden`.

## Official Logo Assets

```text
public/brand/cocokin/logo-mark.webp
public/brand/cocokin/logo-wordmark.webp
public/brand/cocokin/logo-full.webp
public/brand/cocokin/logo-tagline.webp
```

- Use the wordmark in public navigation, authentication, footer, and any wide brand slot.
- Use the mark in tablet rails, mobile app shells, passport badges, favicons, and compact metadata.
- Use the full lockup only for large social/presentation surfaces.
- Render taglines as HTML text in product UI; keep `logo-tagline.webp` as a source brand asset.
- Preserve intrinsic aspect ratio. Never stretch, crop, recolor, add a glow, or place the wordmark directly on navy without a light backing.
- Target rendered heights: wordmark 24-32px; mark 30-40px. The detailed mark is not approved below 30px.

## Shared Responsive Shell

| Viewport | Navigation | Content |
|---|---|---|
| `<768px` | Compact top bar + labeled bottom navigation, max five | Single column, 16px gutter |
| `768-1023px` | Navigation rail or temporary sidebar | One/two columns, 24px gutter |
| `>=1024px` | Persistent collapsible sidebar, 240-264px | Multi-column, 32px gutter |
| `>=1440px` | Same shell | Centered max 1280px content |

Rules:

- Skip-to-main appears first on keyboard focus.
- Core navigation placement stays consistent.
- Deep pages provide predictable Back.
- Sticky action bars reserve content space and cannot obscure focus.
- No horizontal page scrolling.
- Touch targets are at least 44x44 CSS px with 8px separation.
- Forms remain one column unless short fields are logically paired.
- Tables become labeled record cards/lists on mobile.
- Charts simplify on small screens and always provide text/table alternatives.

## Role Configuration

| Role | Density | Primary priority |
|---|---|---|
| Talent | Comfortable | Growth, matches, active work, verified evidence |
| UMKM | Standard | Business outcome, applicants, review, cost |
| Admin | Dense | Queue, risk, audit, reconciliation |

Dense mode never reduces body text below 14px, controls below 44px, or required action separation.

## Shared Components

Navigation: `AppShell`, `RoleNavigation`, `TopBar`, `Breadcrumbs`, `PageHeader`, `NotificationCenter`, `AccountMenu`.

Feedback: buttons, alerts, banners, toast for transient confirmation, confirmation dialog, skeleton, loading, empty, error, offline, and permission-denied states.

Forms: visible labels, helper text, inline error, focusable linked `ErrorSummary`, autosave indicator, unsaved-change confirmation, step progress, file/evidence upload.

Data: `StatusBadge`, `MetricTile`, `ResponsiveDataView`, sortable table, timeline, currency breakdown, score display, chart summary/table fallback, pagination.

Domain patterns: `CocokScoreCard`, `ProjectCard`, `ProjectAgreementSummary`, `MilestoneTimeline`, `SubmissionPanel`, `ReviewDecisionPanel`, `FundingBreakdown`, `TreasuryCoverage`, `HandoverChecklist`, `WarrantyPanel`, `DisputeEvidence`, `AuditTimeline`, and chat patterns.

## Chat Palette

```text
own message background       #DBEEFE
own message foreground       #001040
other message background     #FFFFFF
other message foreground     #001040
system message background    #EAF5F8
unread divider               #006FE6 on #EAF3FF
reconnecting                 warning tokens
failed message               destructive tokens
```

Own-message styling follows the signed-in user, not role color. Presence always has text/accessibility labeling.

## Accessibility Contract

Target WCAG 2.2 AA.

- Normal text contrast >=4.5:1; meaningful non-text boundaries >=3:1.
- Keyboard order follows visual order; dialogs trap and restore focus.
- Route changes focus the main heading/content region.
- Authentication supports password managers, paste, and autofill.
- Multi-error forms focus a linked error summary and retain inline errors.
- All functionality works without hover, drag, or swipe-only interaction.
- Browser zoom remains enabled and 200% zoom preserves operation.
- Financial and deadline truth remains persistent, not toast-only.
- Amounts and state are explicit text, never chart-only.
- Financial/destructive actions state consequences and require confirmation.

## Required Test Viewports

```text
320x568
375x812
768x1024
1024x768
1440x900
```

Also test mobile/tablet landscape, keyboard-only, reduced motion, 200% zoom, long Indonesian names/titles, large currency values, empty/loading/error/offline/permission states.
