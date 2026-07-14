---
name: Next.js → Vite/wouter port lessons (LocaLink)
description: Pitfalls hit while porting the imported Next.js app to Vite + wouter in artifacts/localink
---

- **wouter search-param reactivity**: `useLocation()` tracks pathname only. Any page that reads query params AND updates them via `setLocation('/same-path?...')` must derive params from `useSearch()` (reactive), never `window.location.search` at render time — otherwise same-path query navigations don't rerender.
  **Why:** code review caught stale filter UI on the guides page after the port initially parsed `window.location.search`.
  **How to apply:** `const params = new URLSearchParams(useSearch())` in render; reading `window.location.search` inside event handlers is fine.

- **Unlayered design-system CSS beats Tailwind utilities**: the app's `globals.css` defines unlayered rules like `.guide-category-scroll button { display: flex }`, which override layered utilities such as `md:hidden`. When responsive show/hide breaks, add a scoped media-query rule in globals.css rather than fighting utility classes.

- **Migration copy layout**: the Vercel import backup sits nested at `.migration-backup/app/`; `fullstack-copy-frontend.sh <artifact> --client-dir app` handles it (auto-detect fails on this layout).
