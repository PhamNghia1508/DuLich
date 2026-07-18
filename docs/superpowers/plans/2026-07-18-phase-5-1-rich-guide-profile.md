# Phase 5.1 Rich Guide Profile Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore a rich, responsive marketplace guide profile for all 11 mock guides without changing the completed booking/payment flow.

**Architecture:** Add a deterministic pure view-model mapper over the current guide sources, render it through focused rich-profile presentation components, and retain the existing route controller and `TravelerPrototypeContext` handoff. Profile controls remain local previews and the only continuation side effect is the existing selected-guide navigation.

**Tech Stack:** React, TypeScript, Wouter, existing Lucide icons, existing CSS and Node test runner.

## Global Constraints

- Do not modify matching eligibility/scoring, booking pricing or validation, payment validation, or deterministic booking ids.
- Do not add dependencies, persistence, backend/API calls, Chat, Booking History, authentication, or new routes.
- Keep FriendLocalTrip branding and current shared Navbar behavior outside the profile route.
- All 11 mock guide ids must render through one deterministic view model without source mutation.

---

### Task 1: Deterministic rich profile view model

**Files:**
- Create: `artifacts/localink/src/components/traveler/richGuideProfileData.ts`
- Create: `artifacts/localink/src/components/traveler/richGuideProfileData.test.ts`

**Interfaces:**
- Consumes: `MOCK_GUIDES`, `PROTOTYPE_GUIDE_PROFILES`, `getGuideRecommendation`.
- Produces: `createRichGuideProfileViewModel(id)`, `createProfileBookingHandoff(id)`, and rich presentation types.

- [ ] Write tests for all 11 ids, unknown id, deterministic output, recommendation mapping, immutability, related-guide exclusion, handoff id, and direct access.
- [ ] Run the focused test and confirm it fails because the mapper does not exist.
- [ ] Implement deterministic fallback copy, images, availability states, experiences, reviews, credentials, and related guide cards.
- [ ] Run focused and existing guide-profile tests.
- [ ] Commit the mapper and tests.

### Task 2: Rich profile presentation components

**Files:**
- Create: `artifacts/localink/src/components/traveler/rich-profile/RichGuideHero.tsx`
- Create: `artifacts/localink/src/components/traveler/rich-profile/RichGuideBookingCard.tsx`
- Create: `artifacts/localink/src/components/traveler/rich-profile/RichGuideStorySections.tsx`
- Create: `artifacts/localink/src/components/traveler/rich-profile/RichGuideTrustSections.tsx`
- Create: `artifacts/localink/src/components/traveler/rich-profile/RichRelatedGuides.tsx`
- Modify: `artifacts/localink/src/components/traveler/PrototypeGuideProfile.tsx`

**Interfaces:**
- Consumes: `RichGuideProfileViewModel`, optional recommendation reasons, and `onChoose()`.
- Produces: accessible rich profile composition with local-only preview controls.

- [ ] Replace the minimal composition with hero, recommendation, at-a-glance, biography, experiences, gallery, video preview, availability, credentials, reviews, related guides, and booking preview.
- [ ] Keep Message Guide disabled and label its post-booking availability.
- [ ] Ensure the booking preview uses the existing price calculator but only navigates through `onChoose()`.
- [ ] Run typecheck and focused tests.
- [ ] Commit the presentation components.

### Task 3: Route integration and responsive styling

**Files:**
- Modify: `artifacts/localink/src/app/guides/[id]/page.tsx`
- Modify: `artifacts/localink/src/app/guides/[id]/profile.css`

**Interfaces:**
- Consumes: `createRichGuideProfileViewModel`, Context recommendation/selectGuide, and existing routes.
- Produces: restored `/guides/:id` experience and safe unknown-guide state.

- [ ] Integrate the rich view model without changing Context or navigation contracts.
- [ ] Restore the desktop wide-content/sticky-sidebar layout and mobile single-column layout.
- [ ] Add safe wrapping, gallery stacking, non-sticky mobile sidebar, and Support Chat spacing.
- [ ] Verify unknown ids and direct access.
- [ ] Run all tests, typecheck, build, and diff check.
- [ ] Commit route and styling changes.

### Task 4: Browser regression verification

**Files:**
- No source changes unless verification reveals a scoped defect.

**Interfaces:**
- Consumes: the completed profile and existing Phase 3–5 flow.
- Produces: evidence for desktop/mobile behavior and flow preservation.

- [ ] Verify Home → Request → Results → Profile → Booking → Payment → Success.
- [ ] Verify all rich sections, recommendation context, back preservation, direct access, and unknown-guide state.
- [ ] Check guide ids, desktop 1440×900, mobile 320/375/390×844, horizontal overflow, Support Chat spacing, and console output.
- [ ] Run all unit tests, typecheck, production build, `git diff --check`, and `pnpm audit` for reporting only.
- [ ] Keep the branch local without push, merge, or rebase.
