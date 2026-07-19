# Phase 9.1 Demo Navigation and Traveler Auth Polish Design

## Purpose

Make every FriendLocalTrip prototype role discoverable without exposing Partner or Admin as primary public navigation. Phase 9.1 consolidates public navigation, adds a customer-facing workspace portal, introduces frontend-only Traveler account screens, and places a compact role switcher in existing dashboards. It does not add authentication or change any approved business flow.

## Design choice

Use shared composition rather than a router-wide shell or page-specific header variants.

- A single public header owns desktop navigation, the Explore Demo dropdown, account entry, Request CTA, and mobile drawer.
- Pure configuration modules own all public, demo, footer, and workspace destinations.
- The existing `RoleDashboardShell` receives a compact workspace switcher; Local Guide Dashboard uses the same switcher component in its existing top bar because it does not use that shell.
- Sign-in and sign-up are focused public pages backed only by component-local state and pure validation functions.
- Home and Bookings consume one-time, non-sensitive URL signals and remove only the consumed parameters with navigation replacement.

This approach preserves all existing contexts and route contracts while avoiding duplicated menu logic. A global router shell was rejected because dashboard and recovery routes already own their layouts. Per-page menu implementations were rejected because they would preserve the inconsistency this phase is intended to remove.

## Prototype configuration and route data

Create one lightweight configuration module with `prototypeNavigationEnabled = true`. This flag controls only:

- Explore Demo dropdown content.
- `/demo` page availability/presentation.
- dashboard workspace switchers.
- demo-specific public footer links.

Core public navigation, Sign in, and the Request CTA remain visible regardless of the flag.

The same module exports deterministic data for:

- public navigation links;
- Explore Demo items and descriptions;
- four `/demo` role cards;
- workspace switcher entries;
- footer demo links;
- route-to-current-workspace detection.

Partner and Admin entries always include a visible `Demo` label where they appear outside their workspaces.

## Unified public header

`Navbar` keeps its existing public component API for compatibility, but `home` and `default` no longer produce different compositions. Every public-facing caller renders one header:

- logo linking to `/`;
- desktop center navigation: Browse Guides, For Travelers, Local Guide;
- desktop actions: Explore Demo, Sign in, Request a Local Guide;
- mobile logo and one accessible menu trigger.

The desktop Explore Demo menu uses the existing Radix Dropdown Menu primitives for focus management, Escape dismissal, arrow-key navigation, and close-after-selection behavior. Its items contain a short title, description, optional Demo badge, and a footer link to `/demo`.

The mobile menu uses the existing Radix Sheet primitives. It contains Explore, Account, and Demo Workspaces groups followed by the full-width Request CTA. Radix provides focus trapping, Escape/overlay dismissal, focus restoration, and page-scroll locking. At 320px the drawer uses a capped viewport width and internal vertical scrolling without page-level horizontal overflow.

Current public sections use `aria-current="page"`. `/guides/:id` resolves to Browse Guides, `/local-guide/*` resolves to Local Guide, and `/signin` or `/signup` marks the relevant account destination without changing primary navigation.

Request CTA navigation remains `/?openRequest=1`, reusing the current one-shot Home behavior.

## Demo Workspaces page

Add `/demo` as a customer-facing public page using the unified header and footer. It contains:

- eyebrow `FriendLocalTrip Prototype`;
- one `h1`, `Explore the complete platform`;
- one concise deterministic-data disclosure;
- four role cards with exactly the approved descriptions, routes, and Demo badges.

Cards use semantic headings and links rather than clickable containers. The layout is one column at 320px, two columns at tablet width, and a balanced four-card grid or two-by-two layout on desktop. No implementation metadata or internal terminology is displayed.

## Traveler Sign In prototype

`/signin` becomes a focused Traveler form rendered with the unified public header/footer. State is local to the page and contains email, password, optional remember-demo checkbox, inline errors, and submission status.

Pure validation rules:

- email is required and must match a basic email structure;
- password is required;
- remember-demo is presentation-only and is not stored.

Every error has a stable ID, `role="alert"`, and is associated through `aria-describedby`; invalid fields use `aria-invalid`. Email and password use `autocomplete="email"` and `autocomplete="current-password"`.

On success:

1. Clear password and all form state containing credentials.
2. Navigate with replacement to `/bookings?demoSignedIn=1`.
3. Bookings displays `Demo sign-in complete. Here are your bookings.` in a restrained live region.
4. Bookings removes only `demoSignedIn` from the URL while preserving unrelated parameters.

No credential is sent, logged, persisted, placed in context, or encoded in the URL.

## Traveler Create Account prototype

`/signup` becomes a focused Traveler form with local state for display name, email, country/region, password, confirmation, terms acknowledgment, inline errors, and submission status.

Pure validation rules:

- trimmed display name must be non-empty;
- email must use the same basic structure as Sign in;
- country/region must be selected;
- password must be at least eight characters for the prototype;
- confirmation must match password;
- terms acknowledgment is required.

Password inputs use `autocomplete="new-password"`. On success the page clears display name, email, both password fields, country, and terms state before navigating with replacement to `/?openRequest=1&demoAccountCreated=1`.

Home consumes both signals in one pass:

- `openRequest=1` opens the existing Request Guide dialog once;
- `demoAccountCreated=1` displays `Demo account created. Tell us about your trip to find a Local Guide.` in a restrained live region;
- only consumed keys are removed, unrelated query parameters remain;
- history replacement prevents Back or refresh from replaying either event.

Auth utilities return validation errors only. They do not normalize, return, or expose a credential-bearing persistence payload.

## Workspace switcher

Create one `WorkspaceSwitcher` using Radix Dropdown Menu and shared route data. It offers Traveler Site, Local Guide Workspace, Partner Workspace, Admin Workspace, and All Demo Workspaces. The current workspace is marked by text and an icon, not color alone.

- Partner and Admin dashboards receive it through `RoleDashboardShell` in the top bar.
- Local Guide Dashboard receives the same component beside its existing dashboard exit/home affordance, without changing dashboard navigation or panels.
- On mobile it remains one compact trigger in the top bar and does not enter content panels or message composers.

The switcher is absent when `prototypeNavigationEnabled` is false.

## Footer and legacy recovery

Public footers gain a secondary `Explore Demo Workspaces` group with Local Guide, Partner Demo, Admin Demo, and All Workspaces links when prototype navigation is enabled. Dashboard shells do not render public footers, so they do not receive this block.

`/dashboard` remains a recovery page but gains a prominent `View All Demo Workspaces` route to `/demo`. `/signin` and `/signup` are removed from legacy recovery composition and routed to their new Traveler prototype pages. `/match`, `/book/:guideId`, and `/guide-dashboard` are unchanged.

## Accessibility and responsive behavior

- Radix controls provide keyboard navigation, focus management, Escape dismissal, and focus restoration.
- All menu triggers have visible text or an accessible name and expose expanded/current states.
- Mobile drawer links use at least 44px touch targets and the content scrolls internally when necessary.
- Forms use semantic labels, fieldsets for grouped choices, associated inline errors, appropriate autocomplete values, and polite live regions.
- Focus moves to the first invalid field after submit; no browser alert is used.
- Existing reduced-motion behavior is retained and new decorative transitions are disabled under `prefers-reduced-motion`.
- Header height and scroll margins use shared tokens so sticky navigation does not cover anchored content.

## Testing strategy

Use the existing `tsx --test` runner and TDD for pure modules. Add focused tests covering:

1. deterministic public links;
2. Explore Demo routes and Demo labels;
3. workspace switcher routes and current-workspace detection;
4. deterministic `/demo` cards;
5. Sign-in validation;
6. Sign-up validation and password mismatch;
7. absence of any persistent credential-normalization API;
8. one-time signal parsing/removal while preserving unrelated queries;
9. legacy dashboard recovery link to `/demo`.

Browser verification covers the approved public and dashboard routes at 1440×900, 1366×768, 768×1024, 390×844, 375×812, and 320×568. It explicitly verifies keyboard menus, form validation/success, signal cleanup, Back/refresh behavior, no horizontal overflow, no console warnings, and no auth/API/network requests.

## Constraints

- No backend, API, database, authentication state, permissions, OAuth, cookies, tokens, localStorage, sessionStorage, or new state-management system.
- No credential or submitted form value is logged or placed in a URL.
- No change to Traveler Request, matching, guide profiles, availability, booking, payment, history, chat, review, registration, dashboard logic, commission, fees, or Admin calculations.
- No new dependency or UI framework.
- No merge, rebase, or push during Phase 9.1.
