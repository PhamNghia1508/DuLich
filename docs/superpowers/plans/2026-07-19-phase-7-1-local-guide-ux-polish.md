# Phase 7.1 Local Guide UX/UI Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a polished, responsive Local Guide registration and dashboard workspace while preserving all Phase 7 behavior.

**Architecture:** Existing Local Guide state and business utilities remain authoritative. New pure presentation utilities organize labels and summaries, while the four existing route components receive targeted semantic markup and one route-scoped CSS system.

**Tech Stack:** React, TypeScript, Wouter, CSS, Node test runner, Vite.

## Global Constraints

- Start from `bfb9c24` on `codex/phase-7-1-local-guide-ux-polish`.
- Do not change registration requirements, completeness logic, booking mutations, earnings calculations, the 10% platform fee, chat state semantics, Traveler routes, or deterministic data.
- Do not add dependencies, APIs, persistence, authentication, real uploads, payouts, notifications, routes, or Phase 8 UI.

---

### Task 1: Pure presentation contracts

**Files:**
- Create: `artifacts/localink/src/components/local-guide/localGuidePresentation.ts`
- Modify: `artifacts/localink/src/components/local-guide/localGuideData.test.ts`

- [ ] Add failing tests for seven ordered navigation items, four priority metrics, grouped registration review content, status presentation, and transaction-card normalization.
- [ ] Run the focused Local Guide test and confirm the new imports/assertions fail.
- [ ] Implement immutable deterministic presentation helpers without modifying source data.
- [ ] Run the focused test and confirm it passes.

### Task 2: Concise Hub and conclusive Submitted state

**Files:**
- Modify: `artifacts/localink/src/app/local-guide/page.tsx`
- Modify: `artifacts/localink/src/app/local-guide/application-submitted/page.tsx`

- [ ] Build the compact approved Hub hero, benefits, steps, footer, and safe Support Chat composition.
- [ ] Build the demo-safe submitted hierarchy with status, optional application reference, compact summary/checklist, and differentiated actions.
- [ ] Verify both routes directly with and without submitted context.

### Task 3: Registration information architecture

**Files:**
- Modify: `artifacts/localink/src/app/local-guide/register/page.tsx`

- [ ] Add page heading plus desktop and mobile progress presentations with accessible current-step state.
- [ ] Group existing inputs into focused section cards without changing update or validation functions.
- [ ] Render compact weekly availability rows/cards and existing booking-preference fields.
- [ ] Add synchronized desktop preview and mobile disclosure using the existing draft/completeness calculation.
- [ ] Keep exactly one action area and the approved final action label.

### Task 4: Dashboard workspace hierarchy

**Files:**
- Modify: `artifacts/localink/src/app/local-guide/dashboard/page.tsx`

- [ ] Build the desktop sidebar and mobile navigation rail from presentation metadata.
- [ ] Add consistent panel headers and four priority Overview metrics plus attention/upcoming/messages/profile blocks.
- [ ] Preserve booking filters and immutable Accept/Decline while improving responsive scanning and secondary actions.
- [ ] Preserve weekly availability state/reset and add local-only save presentation.
- [ ] Render desktop transaction table and mobile transaction cards from the same seeded calculations.
- [ ] Connect the existing guide message state to a responsive master-detail UI and hide global Support Chat on Messages.
- [ ] Structure Reviews and Profile panels with approved actions and Traveler-profile preview link.

### Task 5: Route-scoped responsive styling

**Files:**
- Modify: `artifacts/localink/src/app/local-guide/local-guide.css`

- [ ] Normalize Local Guide tokens, container widths, headings, cards, buttons, inputs, badges, and focus states.
- [ ] Keep registration side panel below Navbar and disable sticky behavior on tablet/mobile.
- [ ] Contain dashboard and filter rails without page-level overflow.
- [ ] Convert weekly schedules, bookings, earnings transactions, and messages to mobile-safe layouts at 768, 390, 375, and 320px.
- [ ] Add safe-area spacing and reduced-motion treatment.

### Task 6: Verification and commits

**Files:**
- Test: all `artifacts/localink/src/**/*.test.ts`

- [ ] Verify Hub, all four registration steps, Submitted, and all seven dashboard panels at 1440x900, 1366x768, 768px, 390x844, 375px, and 320px.
- [ ] Verify booking Accept/Decline, availability update/reset, message open/send, and profile preview link.
- [ ] Confirm no horizontal overflow, Support Chat collision, console error/warning, or API request.
- [ ] Run all unit tests, typecheck, production build, `git diff --check`, conditional lint, and `pnpm audit` for reporting.
- [ ] Commit each verified logical slice without staging or committing `.claude/launch.json` or `.git/info/exclude`.
