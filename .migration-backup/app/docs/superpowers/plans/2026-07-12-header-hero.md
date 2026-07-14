# LocalLink Header and Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver and visually verify a premium editorial header and split hero using reliable local imagery.

**Architecture:** Preserve the existing Next.js component boundaries and routes. Refactor `Navbar.tsx` and `Hero.tsx`, add a local image under `public/images`, and limit global CSS changes to shared first-viewport tokens and accessibility behavior.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Lucide React, Next Image.

## Global Constraints

- No new dependencies, backend work, authentication, payments, or external APIs.
- Use a 52/48 or 55/45 desktop split inside a 1280–1360px container.
- Use local 4:5 imagery with a 20–28px corner radius.
- Verify at 390px, 1440px, 1920px, and 3840px before redesigning lower sections.

---

### Task 1: Reliable hero asset

**Files:**
- Create: `public/images/local-guide-hero.webp`
- Modify: `src/components/home/Hero.tsx`

- [ ] Download a suitable licensed photograph to the local asset directory and validate its dimensions and format.
- [ ] Render it with `next/image`, meaningful alt text, responsive `sizes`, and intentional object positioning.
- [ ] Confirm no network image request is required for the first viewport.

### Task 2: Refined responsive header

**Files:**
- Modify: `src/components/layout/Navbar.tsx`
- Modify: `src/app/globals.css`

- [ ] Implement the 76px/68px sticky header and constrained navigation hierarchy.
- [ ] Preserve routes, language state, scroll state, mobile menu, and close behavior.
- [ ] Verify focus visibility, Escape closing, menu semantics, and 44px controls.

### Task 3: Editorial split hero

**Files:**
- Modify: `src/components/home/Hero.tsx`
- Modify: `src/app/globals.css`

- [ ] Build the exact three-line headline and 55/45 desktop grid.
- [ ] Add concise copy, primary/secondary CTAs, and compact trust signals.
- [ ] Add only match and guide/language/availability overlays, simplifying on mobile.
- [ ] Keep the product idea and CTA visible in the first desktop viewport.

### Task 4: Verification

**Files:**
- Inspect: `src/components/layout/Navbar.tsx`
- Inspect: `src/components/home/Hero.tsx`

- [ ] Run `npm run lint` and expect exit code 0.
- [ ] Run `npm run build` and expect exit code 0.
- [ ] Run the app and inspect 390px, 1440px, 1920px, and 3840px screenshots.
- [ ] Check browser console, image requests, overflow, focus behavior, mobile menu, language selection, and CTA destinations.
- [ ] Fix every issue found and repeat the relevant checks.
