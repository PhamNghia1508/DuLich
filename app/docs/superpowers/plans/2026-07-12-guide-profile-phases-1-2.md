# Guide Profile Phases 1–2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make guide-profile media failure-safe and constrain desktop booking stickiness to a dedicated commerce region without changing booking logic.

**Architecture:** Add one reusable media component that owns loading and failure presentation. Restructure the profile page so hero-through-credentials and the booking sidebar share a bounded grid, while similar guides, final CTA, and footer render afterward.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS, existing LocalLink CSS tokens.

## Global Constraints

- Do not change pricing, fee calculations, booking routes, or backend behavior.
- Do not commit or push.
- Preserve LocalLink branding and existing mock-data architecture.
- Verify each phase in the browser before proceeding.

### Task 1: Shared SafeImage

**Files:**
- Create: `src/components/ui/SafeImage.tsx`
- Modify: `src/components/guides/profile/GuideExperienceCard.tsx`
- Modify: `src/components/guides/profile/GuideGallery.tsx`
- Modify: `src/components/guides/profile/GuideVideoIntro.tsx`
- Modify: `src/components/guides/profile/GuideHero.tsx`

**Produces:** `SafeImage` with fixed container sizing, loading treatment, local fallback, and an `onLoadError` callback for gallery state.

- [ ] Implement `SafeImage` with `src`, `fallbackSrc`, `alt`, `className`, `imageClassName`, `loading`, and `onLoadError` props.
- [ ] Replace raw profile media images while preserving current alt semantics and aspect-ratio containers.
- [ ] Make gallery navigation operate on display-safe items and cap the grid at five items.
- [ ] Verify valid and intentionally broken URLs without exposed alt text, empty gray media, or layout shift.

### Task 2: Commerce Boundary

**Files:**
- Modify: `src/app/guides/[id]/page.tsx`
- Modify: `src/app/globals.css`

**Produces:** `.profile-commerce-region`, `.profile-main-column`, and `.profile-booking-sidebar` layout rules.

- [ ] Move Similar Guides and Final CTA outside the region containing the sticky sidebar.
- [ ] Use a 1240px container, 810px/minmax main column, 372px sidebar, and 48px desktop gap.
- [ ] Set sidebar sticky offset from the shared header-height token and keep it bounded by the region.
- [ ] Preserve the current booking component props and duration state.
- [ ] Verify top-to-footer scrolling and required desktop/tablet/mobile widths.

### Task 3: Phase Checkpoint

- [ ] Run scoped lint and TypeScript.
- [ ] Run the production build.
- [ ] Inspect console, failed requests, overflow, image fallback, sticky start/end, and screenshots.
- [ ] Report Phase 1–2 results before continuing to Phase 3.
