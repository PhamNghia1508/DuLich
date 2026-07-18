# FriendLocalTrip Phase 2.1 UI Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Compact the approved Home and keep the Request Guide dialog header and submit action visible while only its form body scrolls.

**Architecture:** Preserve the existing Home state and Radix Dialog control contract. Apply one focused markup change to `RequestGuideDialog`, one Home render condition for Support Chat, one copy-removal change in Featured Guides, and scoped CSS updates.

**Tech Stack:** React, TypeScript, Radix Dialog, existing CSS, Vite, Node test runner.

## Global Constraints

- No Phase 3 UI, API, navigation, persistence, new fields, routes, sections, dependencies, or unrelated refactoring.
- Do not change `RequestGuideDraft`, validation rules, submission callbacks, or non-Home routes.
- Keep unused marketing component source files.

---

### Task 1: Compact Home and prevent chat overlap

**Files:**
- Modify: `artifacts/localink/src/app/page.tsx`
- Modify: `artifacts/localink/src/components/home/FeaturedGuides.tsx`
- Modify: `artifacts/localink/src/app/globals.css`

**Interfaces:**
- Consumes: existing `requestDialogOpen` state.
- Produces: unchanged Home interactions with chat omitted only while the dialog is open.

- [ ] Conditionally render `SupportChat` only when `requestDialogOpen` is false.
- [ ] Remove only the Featured Guides marketplace eyebrow.
- [ ] Tighten scoped Home Hero, Featured Guides, mobile Navbar, and mobile chat spacing.
- [ ] Run the validation test and typecheck as the slice checkpoint.
- [ ] Commit the Home polish slice.

### Task 2: Create the three-part dialog layout

**Files:**
- Modify: `artifacts/localink/src/components/home/RequestGuideDialog.tsx`
- Modify: `artifacts/localink/src/app/globals.css`

**Interfaces:**
- Consumes: unchanged `open`, `onOpenChange`, and `onSubmit` props.
- Produces: unchanged request data and validation behavior with a fixed header/footer and scrollable `.request-form-body`.

- [ ] Wrap the existing field grid in `.request-form-body` without changing fields or handlers.
- [ ] Keep `.request-form-footer` inside the form but outside the scrolling body.
- [ ] Make the dialog/form flex columns with the body as the only overflow container.
- [ ] Add desktop 88–90vh bounds and mobile `100dvh` plus safe-area spacing.
- [ ] Run validation tests, typecheck, and build as the slice checkpoint.
- [ ] Commit the dialog usability slice.

### Task 3: Browser and repository verification

**Files:**
- No production file changes expected.

**Interfaces:**
- Consumes: completed Phase 2.1 UI.
- Produces: verification evidence only.

- [ ] Check Home and dialog at desktop viewport.
- [ ] Check Home and dialog at 390×844, including body scroll to the textarea.
- [ ] Confirm header/footer visibility, hidden chat while open, and no horizontal overflow.
- [ ] Run validation tests, typecheck, production build, and `git diff --check` fresh.
- [ ] Confirm no route, dependency, validation, request shape, or excluded marketing source changes.
