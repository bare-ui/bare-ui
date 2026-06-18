# Server-side rendering & React Server Components

`@wire-ui/react` is built to render correctly under server rendering (Next.js
App Router / RSC, Remix / React Router 7, TanStack Start) and to hydrate without
mismatches.

## Client / server split

Components are shipped as **per-module files** (`preserveModules`), and the
`'use client'` directive is preserved through the build into every published
`dist` file — so it is the consumer's bundler (not just our source) that sees it.

Two categories:

| Category | Directive | Why |
| --- | --- | --- |
| **Interactive components** (58) — anything using hooks, context, refs, or event handlers (Button, Dropdown, Modal, Calendar, Input, …) | `'use client'` | They rely on client-only React features and form a client boundary in an RSC tree. |
| **Presentational components** (12) — `AspectRatio`, `Badge`, `Breadcrumb`, `Card`, `Divider`, `EmptyState`, `Icon`, `List`, `ProgressBar`, `Skeleton`, `Spinner`, `Stat` | _none_ | They render static markup with no hooks/state/effects, so they stay **shared modules** that can render in a Server Component without forcing a client boundary. |

The package barrel (`index.ts`) is intentionally **not** marked `'use client'`.
Because exports are per-module, a Server Component that imports a presentational
component pays no client-boundary cost, while importing an interactive one
correctly resolves to its own `'use client'` module.

Hooks (`useMediaQuery`, `useFloating`, …) are shared modules: they are only ever
*called* from client components, so they need no directive of their own.

## Hydration safety

Even `'use client'` components are rendered to HTML on the server first, so the
first client render must match the server output. The following were made
deterministic:

- **Generated IDs** — form controls (`Input`, `Textarea`, `Password`, `Radio`,
  `Checkbox`) use React's `useId()` instead of a random/time-based generator, so
  `id` / `htmlFor` / `name` / `aria-describedby` are identical on server and
  client.
- **`Timeago`** — the relative-time text legitimately differs between the server
  render instant and the client hydration instant (and across timezones), so the
  `<time>` element carries `suppressHydrationWarning`; its machine-readable
  `dateTime` attribute stays deterministic.
- **`Calendar`** — "today" depends on the wall clock and local timezone (server
  is often UTC), so the `data-today` / `aria-current` marker and roving
  `tabIndex` are resolved after mount; the first render matches the server. For a
  fully deterministic *visible month* under SSR, pass `defaultMonth` (or a
  controlled `value` / `month`); otherwise it defaults to the current month,
  which can differ from the server only at a month boundary.
- **Portals** (`Modal`, `Drawer`, `Sheet`, `ContextMenu`) — guarded with
  `typeof document === 'undefined'` so an open-by-default overlay never reads
  `document.body` during a server render.

All browser-API access lives inside hooks/effects/handlers (guarded by `typeof`
checks, `useSyncExternalStore` server snapshots, or `useIsomorphicLayoutEffect`).
There is **no module-level browser access**, so importing the package never
crashes a server bundle.

## Framework notes

- **Next.js (App Router / RSC):** works out of the box. Presentational components
  render as Server Components; interactive ones are client boundaries.
- **Remix / React Router 7, TanStack Start:** traditional SSR (no RSC). The
  `'use client'` directives are inert here; what matters is SSR-safety, which is
  covered above. A Vite-based app may surface a benign
  `"Module level directives cause errors when bundled"` notice for the directive
  — it is cosmetic and does not affect output.

## Verifying

A two-phase pipeline reproduces the real Next.js / Remix / TanStack Start flow —
the server render runs in a **no-DOM node** environment and the hydration runs in
**jsdom**, exactly as a real app splits them. The shared scenarios live in
`src/test/scenarios.tsx`; the phases hand off server markup through a gitignored
fixture file.

- **`npm run test:ssr`** (phase 1, `vitest.ssr.config.ts`, `environment: node`)
  renders every scenario with `react-dom/server` and asserts the markup is
  **byte-identical across two renders** — i.e. no `Date.now()` / `Math.random()`
  or other non-determinism leaks into the server output (React's `useId` is
  position-based, so a stable tree yields stable ids). Running with no DOM also
  proves there is **no module-level (or render-time) browser access**: any
  `window` / `document` read on import or during render throws here. It writes
  each scenario's markup to a fixture for phase 2.
- **`npm run test:hydrate`** (phase 1, then phase 2 in `vitest.hydrate.config.ts`,
  `environment: jsdom`) replays each server fixture through a real `hydrateRoot()`
  and **fails on any recoverable error** (`onRecoverableError`, React's channel
  for a mismatch) **and any hydration `console.error`**. It also asserts hydration
  *adopted* the server markup rather than wiping and re-rendering.

Coverage spans presentational (`Badge`, `Button`, `Card`, `Divider`,
`ProgressBar`, `Skeleton`, `Spinner`, `Switch`), id-bearing forms (`Input`,
`Textarea`, `Password`, `Checkbox`, `Radio`), context/open components (`Tabs`,
`Accordion`, `Dropdown`, `Popover`, `Select`), and portal overlays
(`Modal` / `Drawer`, closed).
