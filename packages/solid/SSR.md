# Server-side rendering & client/server split

`@wire-ui/solid` is built to render correctly under server rendering (SolidStart,
Astro's Solid integration, plain Vite SSR) and to hydrate without leaking
non-deterministic output.

## Client / server split

Components are shipped as **per-module files** (`preserveModules`), and the
`'use client'` directive is preserved through the build into every published
`dist` file — so it is the consumer's bundler (not just our source) that sees it.

Two categories:

| Category | Directive | Why |
| --- | --- | --- |
| **Interactive components** (59) — anything using `createSignal` / `createMemo` / `createEffect` / `onMount` / `onCleanup`, context (`createContext` / `useContext`), refs, or event handlers (Button, Dropdown, Modal, Calendar, Input, Breadcrumb, …) | `'use client'` | They rely on client-only reactivity and form a client boundary in an RSC-style tree. |
| **Presentational components** (11) — `AspectRatio`, `Badge`, `Card`, `Divider`, `EmptyState`, `Icon`, `List`, `ProgressBar`, `Skeleton`, `Spinner`, `Stat` | _none_ | They render static markup from props (`splitProps` / `mergeProps` / `Show` / `Dynamic` only — no signals, effects, or context), so they stay **shared modules** that can render on the server without forcing a client boundary. |

The package barrel (`index.ts`) and the per-component `index.ts` re-exports are
intentionally **not** marked `'use client'`. Because exports are per-module, a
server component that imports a presentational component pays no client-boundary
cost, while importing an interactive one correctly resolves to its own
`'use client'` module.

Primitives (`createMediaQuery`, `createFloating`, `createFocusTrap`, …) are
shared modules: they are only ever *called* from client components, so they need
no directive of their own. The same applies to `utils/` and `types/`.

> **Note on `'use client'` in Solid.** Unlike `"use server"` (a first-class
> SolidStart server-function marker), `"use client"` is not yet a runtime
> primitive in core Solid/SolidStart. We emit it for two reasons: (1) parity with
> RSC-aware bundlers and tooling that key off the directive, and (2) an explicit,
> machine-readable record of each module's client/server boundary. Under
> traditional Solid SSR it is **inert but harmless** — what actually matters there
> is SSR-safety, covered below.

## SSR safety

Every `'use client'` component is still rendered to HTML on the server first, so
the server output must be deterministic and free of browser-API access.

- **No module-level browser access.** Every `window` / `document` /
  `localStorage` / `navigator` read lives inside an effect, an event handler, or
  behind a `typeof document !== 'undefined'` guard. Importing the package never
  touches the DOM, so it never crashes a server bundle. (Solid effects —
  `createEffect` / `onMount` — do not run during server render, so DOM access in
  them is automatically server-safe.)
- **Generated IDs.** Form controls (`Input`, `Textarea`, `Password`, `Radio`,
  `Checkbox`, `Form`, `Select`, `Tabs`, …) generate ids through the `createId`
  primitive, which wraps Solid's `createUniqueId()`. Under hydration Solid issues
  the **same id sequence** on server and client, so `id` / `for` /
  `aria-describedby` / `aria-controls` match and hydration adopts the existing
  DOM cleanly.
- **Portals** (`Modal`, `Drawer`, `Sheet`, `ContextMenu`, `MenuBar`, `Combobox`)
  use Solid's `<Portal>` from `solid-js/web`, which renders **nothing on the
  server** and mounts on the client during hydration. The `mount` target
  (defaulting to `document.body`) is only resolved on the client, so an
  open-by-default overlay never reads `document` during a server render.

### Components that intentionally reconcile after hydration

A few components depend on the wall clock or local timezone, which differ between
the server (often UTC) and the client. Solid hydration is non-throwing: it adopts
the server DOM and the reactive expression updates the text on the client without
a warning. These are deterministic enough to hydrate cleanly and self-correct:

- **`Timeago`** — the relative text ("5 minutes ago") is computed against the
  current instant, so the server render and the first client render can differ by
  a tick or by timezone. The machine-readable `<time datetime="…">` attribute is
  always the deterministic ISO value; the human text reconciles on the client and
  then refreshes on its interval.
- **`Calendar`** — "today" (the `data-today` / `aria-current` marker) depends on
  the wall clock and local timezone. For a fully deterministic **visible month**
  under SSR, pass `defaultMonth` (or a controlled `value` / `month`); otherwise it
  defaults to the current month, which can differ from the server only at a month
  boundary.

## How server rendering is compiled

Solid needs a **separate compile target** for the server: `vite-plugin-solid`
must emit the SSR variant (`generate: 'ssr'`) and `solid-js/web` must resolve to
its server build. Frameworks handle this for you:

- **SolidStart** — works out of the box; SSR + hydration is the default.
- **Astro** (`@astrojs/solid-js`) — islands hydrate the interactive components;
  presentational ones can render in a static (server-only) island.
- **Plain Vite SSR** — configure `vite-plugin-solid` with the `ssr` build and
  generate a hydration script (`generateHydrationScript` from `solid-js/web`); see
  `vitest.ssr.config.ts` in this package for a minimal SSR compile setup.

> **Remix / TanStack Start** are React frameworks and do not apply to the Solid
> package; their Solid-ecosystem counterparts are SolidStart and Astro above.

The `"solid"` export condition in `package.json` lets Solid-aware bundlers pick
the source-shaped entry for their own SSR/DOM compilation.

## Verifying

Two scripts, run as a two-phase pipeline because the server render and the client
hydrate need different Solid compile targets (`generate: 'ssr'` vs
`generate: 'dom', hydratable: true`):

- **`npm run test:ssr`** (phase 1, node, no DOM) renders representative
  components with `renderToString` and asserts the markup is **identical across
  two renders** (after normalizing Solid's monotonic `createUniqueId` counter,
  which legitimately advances per render) — i.e. no `Math.random()` or wall-clock
  value leaks into the server output. It also confirms generated ids are unique
  within a render and that portal-backed overlays render without reading
  `document` on the server. It writes each scenario's markup to a fixture file.
- **`npm run test:hydrate`** (phase 1, then phase 2 in jsdom) replays each server
  fixture through a real `hydrate()` against the client-compiled component and
  **fails on any `console.error` / `console.warn`** — Solid's channel for
  hydration mismatches and reactive errors. This is the hydration-mismatch audit;
  it covers presentational, id-bearing form, open-context, and closed-overlay
  components.

> SSR safety relies on `solid-js`'s **server** build, where `onMount` /
> `createEffect` are no-ops — that is why DOM listeners registered in `onMount`
> (e.g. click-outside in Popover/Tooltip/Select) never run on the server. The
> test configs pin solid-js to its server build to reproduce that faithfully.
