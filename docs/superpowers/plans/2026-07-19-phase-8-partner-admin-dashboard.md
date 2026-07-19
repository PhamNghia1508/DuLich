# Phase 8 Partner and Admin Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build isolated, deterministic Partner and Admin prototype workspaces while preserving every Traveler and Local Guide behavior.

**Architecture:** Role-specific data and contexts feed role-specific panels inside one presentation-only dashboard shell. Pure utilities own filters, status updates, commission calculations, reports, matching adapters, financial summaries, and settings reset behavior so local UI state never leaks into existing contexts.

**Tech Stack:** React 19, TypeScript, Wouter, Radix Dialog/AlertDialog, Lucide, CSS, Node test runner.

## Global Constraints

- No backend, API, persistence, authentication, new dependency, real QR tracking, analytics, commissions, payouts, refunds, or notifications.
- Preserve existing Traveler and Local Guide routes and calculations.
- Partner commission is exactly eligible completed booking total × 5%.
- Prototype platform revenue is traveler service fees + guide platform fees − partner commission expense.
- Gross Booking Value is reporting-only and is not included in platform revenue.
- Keep `.claude/launch.json` excluded and uncommitted.

---

### Task 1: Partner data contracts and pure operations

**Files:**
- Create: `artifacts/localink/src/components/partner/partnerPrototypeData.ts`
- Create: `artifacts/localink/src/components/partner/partnerPrototypeData.test.ts`

**Interfaces:**
- Produces seeded partner, campaigns, referred bookings, commission transactions, monthly reports, `filterPartnerBookings`, `calculatePartnerCommission`, `summarizePartnerCommissions`, `deduplicateReferredBookings`, `createPartnerReportSummary`, and `normalizeReferralUrl`.

- [ ] Write tests for deterministic seeds, filters, 5% completed-only commission, cancelled behavior, immutable summaries, deduplication, reports, and URL normalization.
- [ ] Run the focused test and confirm failure because the module does not exist.
- [ ] Implement the minimum deterministic data and pure functions.
- [ ] Run the focused test and confirm all Partner tests pass.
- [ ] Commit Partner data contracts.

### Task 2: Admin data contracts and pure operations

**Files:**
- Create: `artifacts/localink/src/components/admin/adminPrototypeData.ts`
- Create: `artifacts/localink/src/components/admin/adminFinancialData.ts`
- Create: `artifacts/localink/src/components/admin/adminPrototypeData.test.ts`

**Interfaces:**
- Produces deterministic travelers, guide applications, partners, requests, bookings, payments, reports, settings, immutable status/note operations, request/booking filters, safe lookup, settings reset, and `calculateAdminFinancialSummary`.

- [ ] Write tests for deterministic data, immutable guide/partner/report updates, request-change notes, rejected recovery, filters, matching determinism, financial formulas, safe lookup, and settings reset.
- [ ] Run the focused test and confirm failure because the modules do not exist.
- [ ] Implement minimal pure data and operations using read-only adapters where safe.
- [ ] Run the focused test and confirm all Admin tests pass.
- [ ] Commit Admin data contracts.

### Task 3: Isolated role contexts and shared presentation shell

**Files:**
- Create: `artifacts/localink/src/components/partner/PartnerPrototypeContext.tsx`
- Create: `artifacts/localink/src/components/admin/AdminPrototypeContext.tsx`
- Create: `artifacts/localink/src/components/workspace/RoleDashboardShell.tsx`
- Create: `artifacts/localink/src/components/workspace/role-dashboard.css`
- Modify: `artifacts/localink/src/App.tsx`

**Interfaces:**
- Partner context exposes seeded arrays without mutating source constants.
- Admin context exposes immutable status, notes, reports, and settings actions.
- Shell consumes role label, navigation configuration, active section, and content.

- [ ] Wrap the router in the two isolated providers without changing existing provider semantics.
- [ ] Implement presentation-only desktop sidebar and mobile navigation variants.
- [ ] Run typecheck and focused data tests.
- [ ] Commit contexts and shell.

### Task 4: Partner entry and dashboard

**Files:**
- Create: `artifacts/localink/src/app/partner/page.tsx`
- Create: `artifacts/localink/src/app/partner/dashboard/page.tsx`
- Create: `artifacts/localink/src/app/partner/partner.css`
- Modify: `artifacts/localink/src/App.tsx`

**Interfaces:**
- Routes `/partner` and `/partner/dashboard`.
- Panels: Overview, Referral Tools, Bookings, Commissions, Reports, Partner Profile.

- [ ] Implement the concise Partner entry with approved copy and structure.
- [ ] Implement dashboard panels using context and pure utilities.
- [ ] Add clipboard fallback and `aria-live` feedback without persistence.
- [ ] Render the deterministic local QR prototype with explanatory text.
- [ ] Verify Partner filters, commission values, profile edit-local interaction, and responsive layout.
- [ ] Commit Partner UI.

### Task 5: Admin entry and dashboard

**Files:**
- Replace composition: `artifacts/localink/src/app/admin/page.tsx`
- Create: `artifacts/localink/src/app/admin/dashboard/page.tsx`
- Create: `artifacts/localink/src/app/admin/admin.css`
- Modify: `artifacts/localink/src/App.tsx`

**Interfaces:**
- Routes `/admin` and `/admin/dashboard`.
- Panels: Overview, Travelers, Guides, Partners, Requests, Bookings, Payments, Reports, Settings.

- [ ] Replace obsolete `/admin` composition only after `/admin/dashboard` is routable.
- [ ] Implement Admin panels with bounded tables and mobile cards.
- [ ] Use Radix Dialog for notes/details and AlertDialog for guide rejection.
- [ ] Require a note for Request Changes and retain status locally.
- [ ] Call existing `matchGuides()` unchanged for deterministic rematching presentation.
- [ ] Keep Support Chat absent from Admin.
- [ ] Verify actions, settings reset, financial summary, and responsive navigation.
- [ ] Commit Admin UI.

### Task 6: Cross-role regression and completion

**Files:**
- Modify only files required to fix Phase 8 defects found during verification.

- [ ] Discover all test files and record executable/incompatible counts.
- [ ] Run Partner and Admin focused tests.
- [ ] Run all seven Node-compatible existing test files plus new compatible tests.
- [ ] Run typecheck, production build, `git diff --check`, and dependency audit.
- [ ] Verify Partner and Admin at 1440×900, 1366×768, 768px, 390×844, 375px, and 320px.
- [ ] Smoke-test unchanged Traveler Home/request/results and Local Guide Hub/register/dashboard.
- [ ] Confirm no console errors, application API requests, page overflow, Admin Support Chat, or Partner chat overlap.
- [ ] Commit verification fixes and stop after Phase 8.
