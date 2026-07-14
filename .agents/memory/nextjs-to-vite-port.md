---
name: Next.js → Vite/wouter port lessons (LocaLink)
description: Pitfalls hit while porting the imported Next.js app to Vite + wouter in artifacts/localink
---

- **Unlayered CSS beats Tailwind v4 utilities — root cause of "broken UI" reports**: any unlayered rule in the design-system globals.css overrides layered Tailwind utilities regardless of specificity. The big one was a universal reset `* { margin: 0; padding: 0 }` that zeroed out ALL p-*/m-* utilities app-wide (cards, footer, everything). Fixed by keeping only `box-sizing` in that reset — Tailwind preflight (@layer base) already provides the margin/padding reset.
  **Why:** cascade layers are compared before specificity; unlayered author CSS always wins over layered.
  **How to apply:** when a Tailwind spacing/typography class "doesn't work" in this app, first probe computed styles (temporary console.log + screenshot captures browser logs), then look for a conflicting unlayered rule in globals.css. Prefer fixing/removing the unlayered rule or styling via the design system's own classes; known remaining conflicts: `.btn-sm` padding beats py-*/px-* utilities, broad `.site-footer.dark-surface span/div` color rules beat text-* utilities.

- **wouter search-param reactivity**: `useLocation()` tracks pathname only. Any page that reads query params AND updates them via `setLocation('/same-path?...')` must derive params from `useSearch()` (reactive), never `window.location.search` at render time — otherwise same-path query navigations don't rerender.
  **Why:** code review caught stale filter UI on the guides page after the port initially parsed `window.location.search`.
  **How to apply:** `const params = new URLSearchParams(useSearch())` in render; reading `window.location.search` inside event handlers is fine.

- **Migration copy layout**: the Vercel import backup sits nested at `.migration-backup/app/`; `fullstack-copy-frontend.sh <artifact> --client-dir app` handles it (auto-detect fails on this layout). Original-app screenshots in `.migration-backup/app/*.png` are useful as visual ground truth for how components were meant to render.
