# Phase 5.2 Availability Calendar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore a synchronized, deterministic seven-day Guide Profile availability calendar.

**Architecture:** A pure schedule model supplies seven days and selection helpers. One profile-local state owner feeds both calendar and sidebar, while the route maps the selection into the existing booking draft before the existing navigation.

**Tech Stack:** React, TypeScript, Wouter, CSS, Node test runner, Vite.

## Global Constraints

- No dependencies, APIs, persistence, backend logic, new routes, or new booking system.
- Booking Details, Payment, Success, matching, and pricing behavior remain unchanged.
- All 11 guides receive deterministic, immutable mock schedules.

---

### Task 1: Schedule model and selection rules

**Files:**
- Modify: `artifacts/localink/src/components/traveler/richGuideProfileData.ts`
- Test: `artifacts/localink/src/components/traveler/richGuideProfileData.test.ts`

- [ ] Add failing tests for seven deterministic days, selectable available/hold slots, disabled booked slots, invalid-time clearing, draft mapping, immutability, and unknown guides.
- [ ] Run the focused test and confirm the new assertions fail.
- [ ] Implement the minimal schedule and selection helpers.
- [ ] Run the focused test and confirm it passes.

### Task 2: Shared profile selection and calendar UI

**Files:**
- Create: `artifacts/localink/src/components/traveler/rich-profile/RichGuideAvailability.tsx`
- Modify: `artifacts/localink/src/components/traveler/PrototypeGuideProfile.tsx`
- Modify: `artifacts/localink/src/components/traveler/rich-profile/RichGuideTrust.tsx`
- Modify: `artifacts/localink/src/components/traveler/rich-profile/RichGuideBookingCard.tsx`

- [ ] Lift profile selection state into `PrototypeGuideProfile`.
- [ ] Render the accessible seven-day rail, legend, and slot matrix.
- [ ] Remove the disconnected sidebar date/time selects and render a shared summary.
- [ ] Keep duration, group size, pricing, and non-blocking Continue behavior.

### Task 3: Existing booking handoff defaults

**Files:**
- Modify: `artifacts/localink/src/app/guides/[id]/page.tsx`

- [ ] Save the mapped existing booking draft after guide selection.
- [ ] Navigate to `/booking-handoff/:guideId` without changing Booking Details.

### Task 4: Responsive presentation and verification

**Files:**
- Modify: `artifacts/localink/src/app/guides/[id]/profile.css`

- [ ] Style desktop seven-date row, three-column slot grid, state legend, and synchronized sidebar.
- [ ] Add contained mobile date scrolling, responsive slot columns, focus states, and safe spacing.
- [ ] Run all unit tests, typecheck, build, and `git diff --check`.
- [ ] Verify desktop 1440x900 and mobile 320, 375, and 390x844 with no overflow or console issues.
