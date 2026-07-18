# FriendLocalTrip Phase 2 Request Guide Dialog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a short Traveler Home prototype whose single CTA opens a validated Request Guide dialog and stores the submitted draft only in Home React state.

**Architecture:** Keep the current Vite, React, Wouter, Radix, and global-CSS architecture. Add one focused dialog component plus pure validation helpers, use explicit Home variants for shared Navbar/Footer so other routes retain their current behavior, and reduce only the Home composition.

**Tech Stack:** React 19, TypeScript, Wouter, Radix Dialog, Tailwind CSS 4, existing global CSS, Node 22 built-in test runner.

## Global Constraints

- Frontend-only prototype; no backend, database, API, authentication, matching engine, results, booking, or payment work.
- Use only local React state and mock options; install no dependency or state-management library.
- Do not navigate to `/match` after opening or submitting the dialog.
- Do not change any route outside Home.
- Preserve the existing default Navbar and Footer presentation outside Home.
- Link the Home **Local Guide** tab to the existing `/guide-dashboard` route.
- Stop after Phase 2.

---

### Task 1: Request draft contract and validation

**Files:**
- Create: `artifacts/localink/src/components/home/requestGuideValidation.ts`
- Create: `artifacts/localink/src/components/home/requestGuideValidation.test.ts`

**Interfaces:**
- Produces: `RequestGuideDraft`, `RequestGuideErrors`, `EMPTY_REQUEST_GUIDE_DRAFT`, and `validateRequestGuideDraft(draft)`.
- Consumed by: `RequestGuideDialog.tsx` and Home's Phase 3 handoff state.

- [ ] **Step 1: Write failing validation tests**

Cover an empty draft, zero group size, reversed dates, and a valid draft. The valid case must return an empty error object; invalid cases must identify only relevant field keys.

- [ ] **Step 2: Run tests and verify RED**

Run:

```powershell
node --experimental-strip-types --test artifacts/localink/src/components/home/requestGuideValidation.test.ts
```

Expected: FAIL because `requestGuideValidation.ts` does not exist yet.

- [ ] **Step 3: Implement the pure contract and validator**

Use this public shape:

```ts
export interface RequestGuideDraft {
  destination: string;
  languages: string[];
  groupSize: number;
  startDate: string;
  endDate: string;
  experiencePreferences: string[];
  additionalInformation: string;
}

export type RequestGuideErrors = Partial<Record<
  'destination' | 'languages' | 'groupSize' | 'startDate' | 'endDate',
  string
>>;

export function validateRequestGuideDraft(
  draft: RequestGuideDraft,
): RequestGuideErrors;
```

Validation messages must be short, field-specific, and must compare ISO date strings only after both dates are present.

- [ ] **Step 4: Run tests and verify GREEN**

Run the Node command from Step 2. Expected: all validation tests pass.

### Task 2: RequestGuideDialog component

**Files:**
- Create: `artifacts/localink/src/components/home/RequestGuideDialog.tsx`
- Consume: `artifacts/localink/src/components/ui/dialog.tsx`
- Consume: `artifacts/localink/src/components/ui/input.tsx`
- Consume: `artifacts/localink/src/components/ui/textarea.tsx`

**Interfaces:**
- Consumes: `RequestGuideDraft`, `EMPTY_REQUEST_GUIDE_DRAFT`, and `validateRequestGuideDraft` from Task 1.
- Produces:

```ts
interface RequestGuideDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (draft: RequestGuideDraft) => void;
}
```

- [ ] **Step 1: Build controlled Radix dialog shell**

Use the existing `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, and `DialogDescription`. Apply a centered desktop max width and a mobile viewport-sized content area with internal scrolling. Keep Radix overlay dismissal, Escape handling, focus trap, and close control.

- [ ] **Step 2: Add compact responsive form**

Render Destination, Languages, Group Size, Start Date, End Date, Experience Preferences, and Additional Information. Use a one-column base grid and two columns at `md`; make Additional Information and multi-choice groups span both desktop columns.

Use these mock options exactly:

```ts
const EXPERIENCE_OPTIONS = [
  'Food & Culture',
  'Shopping',
  'History',
  'Nature',
  'Nightlife',
  'Local Life',
  'Surprise Me',
];
```

Language choices come from the existing supported-language mock data and are stored as language codes.

- [ ] **Step 3: Connect inline validation and submit**

On submit, call the pure validator. Render errors immediately under their fields with `role="alert"` or `aria-describedby`. On valid input, call `onSubmit({ ...draft, destination: draft.destination.trim(), additionalInformation: draft.additionalInformation.trim() })`, reset local form state, and let Home close the controlled dialog.

- [ ] **Step 4: Confirm close semantics**

When `open` changes from true to false without valid submission, reset draft and validation errors so reopening starts clean. Do not show a success screen or results.

### Task 3: Home-only navigation and footer variants

**Files:**
- Modify: `artifacts/localink/src/components/layout/Navbar.tsx`
- Modify: `artifacts/localink/src/components/layout/Footer.tsx`
- Create: `artifacts/localink/src/components/home/SupportChat.tsx`

**Interfaces:**
- Navbar produces `variant?: 'default' | 'home'`, defaulting to `default`.
- Footer produces `variant?: 'default' | 'home'`, defaulting to `default`.
- Home variants must not execute or alter default markup behavior.

- [ ] **Step 1: Isolate Home Navbar markup**

Keep the existing default Navbar implementation intact. Add a focused Home variant containing the FriendLocalTrip brand plus only:

```ts
[
  { label: 'For Travelers', href: '/' },
  { label: 'Local Guide', href: '/guide-dashboard' },
]
```

Support compact desktop and mobile widths without reusing the existing traditional menu drawer.

- [ ] **Step 2: Add minimal Home Footer**

Keep the existing Footer as the default. The Home variant contains FriendLocalTrip identification, a support contact, and copyright only.

- [ ] **Step 3: Add Support Chat control**

Create an accessible fixed support link labeled **Support Chat** using the existing visual tokens. It may open the prototype support email target and must not introduce chat state, API, or external library behavior.

### Task 4: Short Hero and trust badges

**Files:**
- Modify: `artifacts/localink/src/components/home/Hero.tsx`
- Modify: `artifacts/localink/src/app/globals.css`

**Interfaces:**
- Hero consumes `onRequestGuide: () => void`.
- Hero emits no navigation to `/match` and renders exactly one CTA.

- [ ] **Step 1: Replace Hero actions with the approved CTA**

Keep a concise FriendLocalTrip brand/slogan treatment and the existing visual asset where useful. Remove secondary browsing/action links from Hero. Render one button with text **Request a Local Guide** calling `onRequestGuide`.

- [ ] **Step 2: Render three compact trust badges**

Place **Verified Guides**, **4.9+ Rating**, and **24/7 Support** directly below the CTA. Do not compose the old `TrustMetrics` section.

- [ ] **Step 3: Tighten responsive Hero CSS**

Reduce Hero vertical height so Hero plus Featured Guides fit approximately 1–1.5 desktop viewports. Preserve one-column mobile flow, full-width CTA at narrow widths, and readable badges without complex animations.

### Task 5: Home composition and Phase 3 handoff state

**Files:**
- Modify: `artifacts/localink/src/app/page.tsx`
- Modify: `artifacts/localink/src/components/home/FeaturedGuides.tsx`

**Interfaces:**
- Consumes: `RequestGuideDraft` and `RequestGuideDialog`.
- Stores: `requestDraft: RequestGuideDraft | null` and `requestDialogOpen: boolean` locally in Home.

- [ ] **Step 1: Reduce Home composition**

Compose only Home Navbar, short Hero, Featured Guides, Home Footer, Support Chat, and RequestGuideDialog. Remove imports/rendering for TrustMetrics, HowItWorks, ExperienceCategories, SafetyVerification, Testimonials, FinalCTA, and BecomeGuide, but do not delete their files.

- [ ] **Step 2: Connect dialog open and submission**

The Hero callback sets `requestDialogOpen` to true. Valid dialog submit sets `requestDraft`, closes the dialog, and performs no other visible action. Keep the draft state even though Phase 2 does not render it.

- [ ] **Step 3: Update Featured Guides copy only**

Use the heading **Meet Your Local Friends** and retain the existing mock Guide row/mobile horizontal rail. Do not change guide routes, matching, or card data behavior.

### Task 6: Verification and scope audit

**Files:**
- Inspect all modified/new Phase 2 files.

- [ ] **Step 1: Run validation tests**

```powershell
node --experimental-strip-types --test artifacts/localink/src/components/home/requestGuideValidation.test.ts
```

- [ ] **Step 2: Check available scripts and run required verification**

Run `pnpm run typecheck` and `pnpm run build`. Run lint only if a lint script exists in the root or package manifest.

- [ ] **Step 3: Inspect Git scope**

Run `git diff --check`, `git status --short`, and inspect `git diff`. Confirm no route definition or route outside Home changed, excluded marketing component source files still exist, and no dependency or lockfile changed.

- [ ] **Step 4: Report Phase 2 only**

List modified/new files and describe open, close, validation, and submit behavior. State any browser-verification limitation explicitly and do not begin Phase 3.
