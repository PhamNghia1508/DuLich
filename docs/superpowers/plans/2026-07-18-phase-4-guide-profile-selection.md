# Phase 4 Guide Profile and Selection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the traveler prototype from guide results through a polished guide profile and deterministic guide-selection handoff, stopping before booking.

**Architecture:** Keep `/guides/:id`, normalize all Phase 3 mock guides into reusable profile data, and lift the submitted request into a provider above Wouter routes. Results set recommendation context before navigation; profile selection stores a guide id and navigates to an isolated `/booking-handoff/:guideId` placeholder.

**Tech Stack:** React, TypeScript, Wouter, existing CSS/design tokens, Node test runner, deterministic local mock data.

## Global Constraints

- Frontend-only local state and deterministic mock data.
- No backend, database, API, authentication, persistence, payment, production booking, or new dependencies.
- Preserve Phase 2 through Phase 3.1 request, matching, edit, resubmit, Start Over, and empty-state behavior.
- Do not change Phase 3 matching eligibility or scoring.
- Do not modify unrelated routes or shared Navbar behavior.
- Stop at the booking handoff placeholder.

---

### Task 1: Normalize reusable profile and handoff data

**Files:**
- Create: `artifacts/localink/src/components/traveler/guideProfileData.test.ts`
- Create: `artifacts/localink/src/components/traveler/guideProfileData.ts`
- Modify: `artifacts/localink/src/components/home/mockGuideData.ts`

**Interfaces:**
- Produces: `PrototypeGuideProfile`, `getPrototypeGuideProfile(id)`, `getPrototypeGuideReviews(id)`, `getGuideRecommendation(recommendation, id)`, and `createBookingHandoffData(guideId, request)`.
- Consumes: existing `MOCK_GUIDES`, `GUIDES`, `REVIEWS`, and `RequestGuideDraft`.

- [ ] **Step 1: Write failing lookup and normalization tests**

Cover a known guide, a prototype-only guide, an unknown id, local gallery fallback, supported experiences, deterministic availability, recommendation filtering, and handoff data.

- [ ] **Step 2: Run the focused test and confirm RED**

Run: `node --experimental-strip-types --test src/components/traveler/guideProfileData.test.ts`

Expected: failure because `guideProfileData.ts` does not exist.

- [ ] **Step 3: Implement the pure normalizer and lookup helpers**

Create immutable profile objects from shared mock sources. Filter external gallery URLs and use deterministic local fallback media and reviews. Assign prototype-only guide ids as valid profile ids without changing matching rules.

- [ ] **Step 4: Run the focused test and confirm GREEN**

Run the same Node test command and expect all profile-data tests to pass.

### Task 2: Preserve traveler request and recommendation context across routes

**Files:**
- Create: `artifacts/localink/src/components/traveler/TravelerPrototypeContext.tsx`
- Modify: `artifacts/localink/src/App.tsx`
- Modify: `artifacts/localink/src/app/page.tsx`
- Modify: `artifacts/localink/src/components/home/GuideResults.tsx`

**Interfaces:**
- Produces: `useTravelerPrototype()` with request draft, recommendation, selected guide id, setters, and reset behavior.
- Consumes: `RequestGuideDraft` and visible match reasons already selected for presentation.

- [ ] **Step 1: Add the provider above the Wouter route switch**

Keep all values in React state only. Do not use storage or a global-state dependency.

- [ ] **Step 2: Migrate Home submitted-request ownership to the provider**

Keep dialog-open state local. Start Over must clear request, recommendation, and selected guide while retaining the existing discovery-state behavior.

- [ ] **Step 3: Record recommendation context from each View Profile action**

Pass the guide id and the exact two displayed reason strings before navigating to `/guides/:id`.

- [ ] **Step 4: Run request, matching, and reason-presentation tests**

Run: `node --experimental-strip-types --test src/components/home/*.test.ts src/components/traveler/*.test.ts`

Expected: all tests pass.

### Task 3: Build the focused guide profile route

**Files:**
- Replace composition: `artifacts/localink/src/app/guides/[id]/page.tsx`
- Replace scoped styles: `artifacts/localink/src/app/guides/[id]/profile.css`
- Create: `artifacts/localink/src/components/traveler/PrototypeGuideProfile.tsx`

**Interfaces:**
- Consumes: `getPrototypeGuideProfile`, `getGuideRecommendation`, and `useTravelerPrototype`.
- Produces: direct-safe profile rendering and Choose/Back actions.

- [ ] **Step 1: Render friendly missing-guide state**

Unknown ids show non-technical copy and a keyboard-accessible button to Home.

- [ ] **Step 2: Render profile hero and recommendation banner**

Show local image, identity, city, languages, rating, response time, rate, concise intro, and up to two existing reasons only when the context guide id matches.

- [ ] **Step 3: Render profile content sections from normalized data**

Add About, supported experiences, local media, deterministic availability, 2–4 reusable reviews, and compact trust details with logical headings and useful alt text.

- [ ] **Step 4: Implement profile actions**

Back to Results navigates to `/` without clearing provider state. Choose This Guide stores the guide id and navigates to `/booking-handoff/:guideId`.

- [ ] **Step 5: Implement responsive scoped CSS**

Desktop uses a main/summary layout. At 320/375/390px the profile is one column, chips and media stay within the viewport, actions remain at least 44px high, and Support Chat has safe spacing.

### Task 4: Add the booking handoff placeholder

**Files:**
- Create: `artifacts/localink/src/app/booking-handoff/[guideId]/page.tsx`
- Modify: `artifacts/localink/src/App.tsx`
- Modify: `artifacts/localink/src/app/globals.css`

**Interfaces:**
- Consumes: route guide id, normalized profile lookup, provider request draft, and selected guide id.
- Produces: `/booking-handoff/:guideId` placeholder only.

- [ ] **Step 1: Register the isolated route before the generic not-found route**

Do not change `/book/:guideId`.

- [ ] **Step 2: Render selected guide and request summary**

Use normalized data and omit the request summary safely on direct access without context.

- [ ] **Step 3: Render the Phase 5 boundary**

Show “Booking details will be completed in the next step.” with Back to Guide and Back to Results actions. Do not add confirmation, payment, form fields, or API behavior.

### Task 5: Verify and commit Phase 4

**Files:**
- Review all Phase 4 files and ensure no unrelated route diffs.

- [ ] **Step 1: Run all unit tests**

Run: `node --experimental-strip-types --test src/components/home/*.test.ts src/components/traveler/*.test.ts`

- [ ] **Step 2: Run typecheck and production build**

Run: `pnpm run typecheck && pnpm run build`

- [ ] **Step 3: Run lint only if a lint script exists**

Inspect `package.json`; skip with an explicit report when absent.

- [ ] **Step 4: Run browser verification**

Verify the request/results/profile/back/choose/handoff flow, direct profile, missing guide, empty results, 1440×900, 320px, 375px, 390×844, no horizontal overflow, Support Chat spacing, and no console warnings/errors.

- [ ] **Step 5: Run diff hygiene and commit**

Run: `git diff --check`, inspect every changed file, then commit Phase 4 without pushing or merging.
