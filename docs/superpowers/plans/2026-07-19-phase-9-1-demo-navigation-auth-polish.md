# Phase 9.1 Demo Navigation and Traveler Auth Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every FriendLocalTrip prototype role discoverable through one accessible public header, a `/demo` review portal, frontend-only Traveler auth forms, and dashboard workspace switching.

**Architecture:** Keep Wouter and all four existing role contexts unchanged. Centralize deterministic navigation data and one-time query helpers in pure tested modules, compose Radix Dropdown Menu/Sheet UI around them, and keep credentials strictly inside local form state until cleared before navigation.

**Tech Stack:** React 19, TypeScript, Wouter 3, Vite 7, existing Radix UI primitives, local React state, Node test runner through `tsx`.

## Global Constraints

- Start from Phase 9 commit `169606b` on `codex/phase-9-1-demo-navigation-auth-polish`.
- No backend, API, real authentication, cookies, tokens, localStorage, sessionStorage, OAuth, persistence, permissions, new state management, dependency, or UI framework.
- Never log or place submitted name, email, password, or confirmation in a URL.
- Preserve Request, matching, profile, availability, booking, payment, history, chat, review, registration, dashboards, fees, commission, and Admin calculations.
- Keep `.claude/launch.json` excluded and uncommitted.
- Do not push, merge, or rebase.

---

### Task 1: Deterministic demo-navigation contracts

**Files:**
- Create: `artifacts/localink/src/components/navigation/prototypeNavigation.ts`
- Create: `artifacts/localink/src/components/navigation/prototypeNavigation.test.ts`
- Modify: `artifacts/localink/src/components/layout/brandPresentation.ts`
- Modify: `artifacts/localink/src/components/layout/brandPresentation.test.ts`
- Modify: `artifacts/localink/src/components/routing/legacyRouteData.ts`
- Modify: `artifacts/localink/src/components/routing/legacyRouteData.test.ts`

**Interfaces:**
- Produces `prototypeNavigationEnabled: boolean`.
- Produces `PUBLIC_NAV_ITEMS`, `EXPLORE_DEMO_ITEMS`, `DEMO_WORKSPACE_CARDS`, `WORKSPACE_SWITCHER_ITEMS`, `DEMO_FOOTER_ITEMS` as readonly navigation records.
- Produces `workspaceForPath(pathname: string): 'traveler' | 'local-guide' | 'partner' | 'admin'`.
- Extends `LEGACY_RECOVERY_OPTIONS.dashboard` with `{ label: 'View All Demo Workspaces', href: '/demo' }`.

- [ ] **Step 1: Write failing navigation-contract tests**

```ts
assert.equal(prototypeNavigationEnabled, true);
assert.deepEqual(PUBLIC_NAV_ITEMS.map(({ href }) => href), ['/guides', '/', '/local-guide']);
assert.deepEqual(EXPLORE_DEMO_ITEMS.map(({ href }) => href), ['/', '/local-guide/dashboard', '/partner/dashboard', '/admin/dashboard']);
assert.equal(EXPLORE_DEMO_ITEMS.find(({ href }) => href === '/partner/dashboard')?.badge, 'Demo');
assert.equal(workspaceForPath('/admin/dashboard'), 'admin');
assert.equal(workspaceForPath('/partner/dashboard'), 'partner');
assert.equal(workspaceForPath('/local-guide/dashboard'), 'local-guide');
assert.equal(workspaceForPath('/bookings'), 'traveler');
assert.equal(LEGACY_RECOVERY_OPTIONS.dashboard.at(-1)?.href, '/demo');
```

- [ ] **Step 2: Run focused tests and verify RED**

Run: `pnpm exec tsx --test src/components/navigation/prototypeNavigation.test.ts src/components/layout/brandPresentation.test.ts src/components/routing/legacyRouteData.test.ts`

Expected: FAIL because `prototypeNavigation.ts` is absent and the dashboard recovery lacks `/demo`.

- [ ] **Step 3: Implement the minimal immutable navigation data**

```ts
export const prototypeNavigationEnabled = true;
export const PUBLIC_NAV_ITEMS = [
  { label: 'Browse Guides', href: '/guides', section: 'guides' },
  { label: 'For Travelers', href: '/', section: 'traveler' },
  { label: 'Local Guide', href: '/local-guide', section: 'local-guide' },
] as const;

export function workspaceForPath(pathname: string) {
  if (pathname.startsWith('/local-guide')) return 'local-guide';
  if (pathname.startsWith('/partner')) return 'partner';
  if (pathname.startsWith('/admin')) return 'admin';
  return 'traveler';
}
```

Add the exact approved descriptions, Demo badges, role-card actions, workspace routes, and footer routes from the design spec. Re-export `PUBLIC_NAV_LINKS` from the shared contract or update existing imports without duplicating values.

- [ ] **Step 4: Run focused tests and verify GREEN**

Expected: all focused tests pass with no skipped tests.

- [ ] **Step 5: Commit**

```text
test: define demo navigation contracts
```

### Task 2: One-time confirmation signals and auth validation

**Files:**
- Create: `artifacts/localink/src/components/auth/travelerAuthPrototype.ts`
- Create: `artifacts/localink/src/components/auth/travelerAuthPrototype.test.ts`
- Modify: `artifacts/localink/src/components/home/requestEntrySignal.ts`
- Modify: `artifacts/localink/src/components/home/requestEntrySignal.test.ts`

**Interfaces:**
- Produces `validateDemoSignIn(draft: DemoSignInDraft): DemoSignInErrors`.
- Produces `validateDemoSignup(draft: DemoSignupDraft): DemoSignupErrors`.
- Produces `SIGN_IN_DESTINATION` and `SIGN_UP_DESTINATION` constants containing no submitted values.
- Produces `consumePrototypeSignals(search: string, keys: readonly PrototypeSignalKey[]): { present: Set<PrototypeSignalKey>; remainingSearch: string }`.
- Keeps `shouldOpenRequestFromSearch(search)` compatible.

- [ ] **Step 1: Write failing validation and signal tests**

```ts
assert.deepEqual(validateDemoSignIn({ email: '', password: '' }), {
  email: 'Enter your email address.', password: 'Enter your password.',
});
assert.equal(validateDemoSignIn({ email: 'wrong', password: 'password' }).email, 'Enter a valid email address.');
assert.equal(validateDemoSignup(validSignup).confirmPassword, undefined);
assert.equal(validateDemoSignup({ ...validSignup, confirmPassword: 'different' }).confirmPassword, 'Passwords must match.');
assert.equal(JSON.stringify(validateDemoSignup(validSignup)).includes(validSignup.password), false);
assert.deepEqual(
  consumePrototypeSignals('?ref=hotel&openRequest=1&demoAccountCreated=1', ['openRequest', 'demoAccountCreated']).remainingSearch,
  '?ref=hotel',
);
```

- [ ] **Step 2: Run focused tests and verify RED**

Expected: FAIL because the auth utility and generalized consumer do not exist.

- [ ] **Step 3: Implement pure validation and query consumption**

```ts
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const SIGN_IN_DESTINATION = '/bookings?demoSignedIn=1';
export const SIGN_UP_DESTINATION = '/?openRequest=1&demoAccountCreated=1';

export function consumePrototypeSignals(search: string, keys: readonly PrototypeSignalKey[]) {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  const present = new Set<PrototypeSignalKey>();
  for (const key of keys) {
    if (params.get(key) === '1') present.add(key);
    if (params.has(key)) params.delete(key);
  }
  const remaining = params.toString();
  return { present, remainingSearch: remaining ? `?${remaining}` : '' };
}
```

Validation functions return error maps only; do not add normalization or persistence functions that return credentials.

- [ ] **Step 4: Run focused tests and verify GREEN**

- [ ] **Step 5: Commit**

```text
test: add traveler auth and signal contracts
```

### Task 3: Unified public header and footer discovery

**Files:**
- Create: `artifacts/localink/src/components/navigation/ExploreDemoMenu.tsx`
- Create: `artifacts/localink/src/components/navigation/MobilePublicMenu.tsx`
- Create: `artifacts/localink/src/components/navigation/public-navigation.css`
- Modify: `artifacts/localink/src/components/layout/Navbar.tsx`
- Modify: `artifacts/localink/src/components/layout/Footer.tsx`
- Modify: `artifacts/localink/src/app/globals.css`

**Interfaces:**
- `Navbar({ variant? })` remains source-compatible but every variant renders one composition.
- `ExploreDemoMenu` consumes `EXPLORE_DEMO_ITEMS` and `prototypeNavigationEnabled`.
- `MobilePublicMenu` consumes public/account/demo arrays and uses Radix Sheet.

- [ ] **Step 1: Implement header using the already-tested data contracts**

Use Radix `DropdownMenu` with `DropdownMenuTrigger asChild`, semantic `Link` children inside `DropdownMenuItem asChild`, a labelled menu, concise descriptions, Demo badges, and `/demo` footer action. Use `aria-current="page"` via a pure section matcher.

- [ ] **Step 2: Implement the Radix mobile Sheet**

Render Explore, Account, and Demo Workspaces headings; provide 44px minimum targets and a full-width `/?openRequest=1` CTA. Keep the sheet width at `min(92vw, 360px)` and its body internally scrollable.

- [ ] **Step 3: Consolidate Navbar call sites without changing page content**

Keep the optional `variant` prop as a no-op compatibility surface during Phase 9.1. Remove the bespoke Home segmented-control composition and the manual body-scroll/menu event logic replaced by Radix.

- [ ] **Step 4: Add secondary footer discovery**

Render `Explore Demo Workspaces` links only when `prototypeNavigationEnabled`; keep dashboard shells unchanged because they do not render Footer.

- [ ] **Step 5: Run full tests, typecheck, and browser smoke `/`, `/guides`, `/guides/guide-001`, `/local-guide`, `/partner` at 1440 and 320**

Expected: one consistent header, current section exposed, dropdown/drawer keyboard-safe, no overflow, existing Request dialog opens.

- [ ] **Step 6: Commit**

```text
feat: unify public prototype navigation
```

### Task 4: Customer-facing Demo Workspaces route

**Files:**
- Create: `artifacts/localink/src/app/demo/page.tsx`
- Create: `artifacts/localink/src/app/demo/demo.css`
- Modify: `artifacts/localink/src/App.tsx`
- Modify: `artifacts/localink/src/components/routing/LegacyRouteBridge.tsx`

**Interfaces:**
- `/demo` consumes `DEMO_WORKSPACE_CARDS` and renders no role/business state.
- `/dashboard` includes a prominent link to `/demo` while retaining its approved role choices.

- [ ] **Step 1: Add `/demo` to the Wouter route table**

Import the small page eagerly and register exactly `<Route path="/demo" component={DemoWorkspacesPage} />` before the catch-all.

- [ ] **Step 2: Build the concise responsive role portal**

Use one `main`, one `h1`, four semantic `article` cards, exact approved copy/actions, and one frontend-only disclaimer. Use one column at 320px, two columns from tablet, and a balanced desktop grid.

- [ ] **Step 3: Align `/dashboard` recovery**

Use the new tested `/demo` recovery option and visually distinguish it as the portal action without removing the four role destinations.

- [ ] **Step 4: Run tests, typecheck, and browser checks at 1440, 768, 390, 375, and 320**

- [ ] **Step 5: Commit**

```text
feat: add demo workspace review portal
```

### Task 5: Traveler Sign In and Create Account prototypes

**Files:**
- Create: `artifacts/localink/src/components/auth/TravelerAuthShell.tsx`
- Create: `artifacts/localink/src/components/auth/traveler-auth.css`
- Replace: `artifacts/localink/src/app/signin/page.tsx`
- Replace: `artifacts/localink/src/app/signup/page.tsx`
- Modify: `artifacts/localink/src/App.tsx`
- Modify: `artifacts/localink/src/app/page.tsx`
- Modify: `artifacts/localink/src/app/bookings/page.tsx`

**Interfaces:**
- Sign-in and sign-up pages consume only local state, tested validators, and fixed destination constants.
- Home consumes `openRequest` plus `demoAccountCreated` and removes both in one replacement.
- Bookings consumes `demoSignedIn` and removes it with replacement.

- [ ] **Step 1: Route `/signin` and `/signup` to the real page modules**

Remove `LegacySigninRecovery` and `LegacySignupRecovery` imports/composition from `App.tsx`; do not delete unrelated legacy source blindly.

- [ ] **Step 2: Implement semantic local-state forms**

Use controlled fields, field-specific IDs, `aria-invalid`, `aria-describedby`, `role="alert"`, correct autocomplete values, and `ref.focus()` for the first invalid field. Never call `console.*`, storage APIs, Context setters, or request APIs.

- [ ] **Step 3: Clear sensitive state before fixed navigation**

```ts
setDraft(EMPTY_SIGN_IN_DRAFT); // password cleared before navigation
navigate(SIGN_IN_DESTINATION, { replace: true });
```

For sign-up clear all fields, especially both passwords, before `navigate(SIGN_UP_DESTINATION, { replace: true })`.

- [ ] **Step 4: Consume and remove one-time signals**

Home displays `Demo account created. Tell us about your trip to find a Local Guide.` and opens the existing dialog. Bookings displays `Demo sign-in complete. Here are your bookings.`. Both use a polite live region and replacement URL preserving unrelated parameters.

- [ ] **Step 5: Browser-test blank/invalid/valid forms, query cleanup, refresh, and Back**

Confirm no credentials appear in URL, logs, Context, local/session storage, or cookies; confirm Request and Bookings flows remain unchanged.

- [ ] **Step 6: Run full tests and typecheck**

- [ ] **Step 7: Commit**

```text
feat: add frontend-only traveler auth journeys
```

### Task 6: Dashboard workspace switcher

**Files:**
- Create: `artifacts/localink/src/components/workspace/WorkspaceSwitcher.tsx`
- Modify: `artifacts/localink/src/components/workspace/RoleDashboardShell.tsx`
- Modify: `artifacts/localink/src/components/workspace/role-dashboard.css`
- Modify: `artifacts/localink/src/app/local-guide/dashboard/page.tsx`
- Modify: `artifacts/localink/src/app/local-guide/local-guide.css`

**Interfaces:**
- `WorkspaceSwitcher({ currentWorkspace })` consumes tested `WORKSPACE_SWITCHER_ITEMS` and `prototypeNavigationEnabled`.
- `RoleDashboardShell` derives current workspace from its existing `role` prop.
- Guide Dashboard passes `currentWorkspace="local-guide"` without modifying guide panels or context.

- [ ] **Step 1: Build the Radix dropdown switcher**

Use an accessible trigger named `Switch Demo Workspace`. Each item is a semantic Wouter Link; the current workspace displays a Check icon plus `Current` text and `aria-current="page"`.

- [ ] **Step 2: Add it to Partner/Admin shared top bar**

Place it beside Exit workspace with subdued styling. Do not modify section navigation, workspace state, or panels.

- [ ] **Step 3: Add the same component to Local Guide Dashboard header**

Compose a small dashboard-only top bar above the existing layout and keep the existing Traveler-site return link. Do not place the switcher in Messages or other panels.

- [ ] **Step 4: Browser-test all five switcher destinations at desktop and 320px**

Expected: current workspace is visibly/textually marked, menu fits viewport, no dead link, role dashboards preserve state behavior within the current session.

- [ ] **Step 5: Run full tests and typecheck**

- [ ] **Step 6: Commit**

```text
feat: add demo workspace switcher
```

### Task 7: Full responsive, accessibility, security, and release verification

**Files:**
- Modify only files tied to a reproduced defect.

- [ ] **Step 1: Run the approved route matrix**

Desktop 1440×900 and 1366×768; tablet 768×1024; mobile 390×844, 375×812, 320×568 for `/`, `/guides`, `/guides/guide-001`, `/local-guide`, `/partner`, `/demo`, `/signin`, `/signup`, and all three dashboard routes.

- [ ] **Step 2: Verify keyboard and focus behavior**

Tab through desktop header, open/close Explore Demo with keyboard/Escape, open/close mobile Sheet, verify focus restoration, validate both forms, and inspect current-page/current-workspace exposure.

- [ ] **Step 3: Verify no data/network leakage**

Search source for storage/cookie/auth request additions and inspect browser console/network. Confirm query strings contain only fixed boolean demo signals and those signals are removed after consumption.

- [ ] **Step 4: Run supported verification**

```text
pnpm test
pnpm typecheck
pnpm build
pnpm audit
git diff --check
```

Run lint only if a lint script exists. Record exact files/tests/pass/skip counts, chunks, audit severity, and absence of console warnings.

- [ ] **Step 5: Review the full diff across correctness, readability, architecture, security, and performance**

Require no critical or important finding before commit. Confirm `.claude/launch.json` remains excluded and working tree contains only Phase 9.1 work.

- [ ] **Step 6: Commit any final focused correction and stop without push or merge**

```text
fix: polish demo navigation accessibility
```
