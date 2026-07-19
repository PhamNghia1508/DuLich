# Phase 9 Final Prototype QA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver one customer-reviewable FriendLocalTrip frontend prototype with current role flows, safe legacy URL compatibility, consistent presentation, full supported tests, improved route chunks, and documented review journeys.

**Architecture:** Keep the existing Wouter route table and four isolated role contexts. Replace legacy compositions with a tested route bridge/recovery surface, normalize shared presentation surgically, and lazy-load heavy pages behind one branded Suspense fallback.

**Tech Stack:** React 19, TypeScript, Wouter 3, Vite 7, Radix UI, local React state, Node test runner through `tsx`.

## Global Constraints

- Frontend-only prototype; no backend, API, authentication, persistence, production integrations, or new business modules.
- Preserve all approved business calculations, validation rules, state shapes, eligibility, and booking IDs.
- Use exactly `FriendLocalTrip` in rendered branding.
- Keep `.claude/launch.json` locally excluded and uncommitted.
- Do not merge, rebase, or push automatically.

---

### Task 1: Legacy route contracts and recovery pages

**Files:**
- Create: `artifacts/localink/src/components/routing/legacyRouteData.ts`
- Create: `artifacts/localink/src/components/routing/legacyRouteData.test.ts`
- Create: `artifacts/localink/src/components/routing/LegacyRouteBridge.tsx`
- Create: `artifacts/localink/src/components/routing/legacy-route.css`
- Modify: `artifacts/localink/src/App.tsx`

**Interfaces:**
- Produces `legacyBookDestination(guideId: string): string`, `LEGACY_RECOVERY_OPTIONS`, `LegacyBookRedirect`, `LegacyMatchRedirect`, `LegacyGuideDashboardRedirect`, and `LegacyRecoveryPage`.
- Consumes only current approved route strings.

- [ ] Write failing tests asserting encoded guide IDs and every approved recovery destination.
- [ ] Run the focused test and confirm failure because `legacyRouteData.ts` is absent.
- [ ] Implement pure route mappings and semantic recovery configuration.
- [ ] Run focused tests and confirm pass.
- [ ] Replace legacy imports/routes in `App.tsx` with redirect/recovery components using `replace`.
- [ ] Verify all six URLs directly at desktop and 320px, including Back behavior and unknown guide handling.
- [ ] Commit: `feat: replace legacy routes with safe recovery flows`.

### Task 2: One-shot legacy Request entry

**Files:**
- Create: `artifacts/localink/src/components/home/requestEntrySignal.ts`
- Create: `artifacts/localink/src/components/home/requestEntrySignal.test.ts`
- Modify: `artifacts/localink/src/app/page.tsx`

**Interfaces:**
- Produces `shouldOpenRequestFromSearch(search: string): boolean`.
- Consumes the existing `RequestGuideDialog` and Home local/context state without changing `RequestGuideDraft`.

- [ ] Write failing tests for `openRequest=1`, unrelated queries, and malformed values.
- [ ] Run focused test and confirm expected missing-module failure.
- [ ] Implement the pure query helper.
- [ ] Run focused tests and confirm pass.
- [ ] On Home mount, open the existing dialog once and replace the URL with `/`.
- [ ] Browser-test `/match`, dialog dismissal, Back, and direct Home access.
- [ ] Commit: `feat: bridge legacy matching into traveler request`.

### Task 3: Brand, Navbar, Footer, metadata, and customer copy

**Files:**
- Modify: `artifacts/localink/index.html`
- Modify: `artifacts/localink/src/components/layout/Navbar.tsx`
- Modify: `artifacts/localink/src/components/layout/Footer.tsx`
- Modify: `artifacts/localink/src/app/guides/page.tsx`
- Modify only rendered occurrences found by audit in `artifacts/localink/src/components/**`.

**Interfaces:**
- Default Navbar/Footer retain their public component signatures.
- All links resolve to registered current routes or deliberate `mailto:` support.

- [ ] Add a static presentation-contract test covering canonical brand and approved shared links.
- [ ] Confirm it fails on current metadata/default shared layout.
- [ ] Replace rendered old brand strings and obsolete auth/matching/guide-dashboard links.
- [ ] Keep Home Navbar behavior unchanged and Local Guide tab at `/local-guide`.
- [ ] Run focused and full tests.
- [ ] Browser-test `/guides`, Not Found, and shared navigation at 320/768/1440.
- [ ] Commit: `fix: unify customer-facing brand and navigation`.

### Task 4: Recovery, feedback, Support Chat, and accessibility fixes

**Files:**
- Modify: `artifacts/localink/src/app/local-guide/application-submitted/page.tsx`
- Modify: `artifacts/localink/src/app/local-guide/dashboard/page.tsx`
- Modify: `artifacts/localink/src/components/admin/AdminDashboardPanels.tsx`
- Modify: `artifacts/localink/src/components/partner/PartnerDashboardPanels.tsx`
- Modify relevant existing route CSS only where a verified collision exists.
- Test: closest existing pure data/presentation test files.

**Interfaces:**
- Submitted page derives a customer-safe presentation state from whether `submittedApplication` exists.
- Existing mutation callbacks and context shapes remain unchanged.

- [ ] Write a failing pure test for missing submitted application and any feedback helper required by audited silent actions.
- [ ] Implement recovery copy/actions without claiming submission.
- [ ] Hide Support Chat on Local Guide Messages and preserve current dialog-open behavior elsewhere.
- [ ] Add targeted visible feedback/live regions only to actions proven silent in browser audit.
- [ ] Fix verified Support Chat/content collisions with route-safe spacing.
- [ ] Run focused tests and keyboard/dialog browser checks.
- [ ] Commit: `fix: strengthen prototype recovery and feedback states`.

### Task 5: Cross-role seeded and financial presentation audit

**Files:**
- Modify only inconsistent seeded adapters among `artifacts/localink/src/components/traveler`, `local-guide`, `partner`, and `admin`.
- Test: existing role data tests.

**Interfaces:**
- Preserve all existing types and formulas.

- [ ] Add failing tests only for contradictions found in the same seeded entity or financial rounding gap.
- [ ] Align presentation adapters/constants without synchronizing contexts.
- [ ] Run all role data and financial tests.
- [ ] Document intentionally separate records in the final review guide.
- [ ] Commit only if code changes are required: `fix: align cross-role prototype presentation`.

### Task 6: Complete test runner

**Files:**
- Modify: `artifacts/localink/package.json`
- Modify: root `pnpm-lock.yaml`

**Interfaces:**
- Produces `pnpm test` executing `tsx --test "src/**/*.test.ts"`.

- [ ] Record the baseline split result: 10 files, 115 executed, 21 TSX-dependent not executed by strip-types.
- [ ] Add the already-installed `tsx@4.23.0` as a direct dev dependency.
- [ ] Add the exact test script.
- [ ] Run `pnpm test` and require 10 files / 136 tests / 136 pass / 0 skipped.
- [ ] Commit: `test: run the complete TypeScript suite with tsx`.

### Task 7: Low-risk route code splitting

**Files:**
- Create: `artifacts/localink/src/components/routing/RouteLoadingState.tsx`
- Modify: `artifacts/localink/src/App.tsx`
- Modify shared CSS only for the loading state.

**Interfaces:**
- Heavy page modules remain default exports and retain their current URLs.
- `Suspense` fallback renders a branded, accessible `aria-busy` state.

- [ ] Capture baseline production bundle: one 623.75 kB JS chunk and 276.50 kB CSS bundle.
- [ ] Convert Rich Guide Profile, Booking Chat, Local Guide Dashboard, Partner Dashboard, and Admin Dashboard to `React.lazy` imports.
- [ ] Build and confirm multiple chunks plus a smaller entry JS chunk.
- [ ] Typecheck and direct-access smoke-test every lazy route with no console warnings.
- [ ] Commit: `perf: split heavy role routes`.

### Task 8: Responsive, navigation, and accessibility matrix fixes

**Files:**
- Modify only CSS/components tied to reproduced defects.

**Interfaces:**
- Internal horizontal rails remain allowed; page-level horizontal overflow is not.

- [ ] Run desktop 1440×900 and 1366×768 route/action matrix.
- [ ] Run tablet 768×1024 route/action matrix.
- [ ] Run mobile 390×844, 375×812, and 320×568 route/action matrix.
- [ ] For every defect, add a failing pure test where logic is involved; for CSS-only defects, save before evidence and verify after at all affected breakpoints.
- [ ] Confirm dialogs, calendar, chat composer, cards/tables, currency, status labels, and workspace navigation remain usable.
- [ ] Commit focused fixes: `fix: polish cross-role responsive and accessibility details`.

### Task 9: Final customer review documentation and screenshots

**Files:**
- Create: `docs/superpowers/final/friendlocaltrip-prototype-review-guide.md`
- Store screenshots outside tracked source unless repository convention requires otherwise.

**Interfaces:**
- Document four role journeys, seeded IDs/values, empty-state scenarios, limitations, device recommendations, and 26-shot checklist.

- [ ] Complete Traveler request→results→profile→availability→booking→payment→success→detail→chat/review journey.
- [ ] Complete Local Guide hub→registration→submitted→dashboard journey.
- [ ] Complete Partner and Admin entry/dashboard/action journeys.
- [ ] Capture the 16 desktop and 10 mobile screenshots from the approved list and record absolute local paths.
- [ ] Write and review the final guide for customer-safe language.
- [ ] Commit: `docs: add final prototype review guide`.

### Task 10: Final verification and Phase 9 commit

**Files:**
- No planned source additions; fix only failures found by verification using the TDD rule.

- [ ] Run `pnpm test`; record discovered/executed/passed/skipped counts.
- [ ] Run `pnpm run typecheck`.
- [ ] Run `pnpm run build`; record every output chunk and gzip size.
- [ ] Run lint only if a lint script exists.
- [ ] Run `pnpm audit` and report exact severity.
- [ ] Run `git diff --check`.
- [ ] Audit console, failed images, local/static network requests, and absence of API/WebSocket/geolocation/upload/payment calls.
- [ ] Review the complete diff for correctness, readability, architecture, security, and performance.
- [ ] Confirm `.claude/launch.json` remains excluded and the working tree contains only Phase 9 changes.
- [ ] Commit the completed Phase 9 work and stop without merge or push.
