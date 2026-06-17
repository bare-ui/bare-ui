# Server-side rendering & hydration

`@wire-ui/vue` is built to render correctly under server rendering (Nuxt, plain
Vite SSR, vike, Astro's Vue integration) and to hydrate without mismatches.

## No client/server directive (and why)

Unlike React Server Components, Vue 3 has **no `'use client'` / `'use server'`
boundary directive** — every component is rendered to HTML on the server with
`@vue/server-renderer` and then the *same* component tree is hydrated on the
client with `createSSRApp(...).mount(el)`. There is no separate "server
component" runtime, so there is nothing to mark. (This is checklist item 8 —
"explicit client/server split" — which is **N/A for Vue**; the React and Solid
packages emit `'use client'` for RSC-aware bundlers, Vue has no equivalent.)

Components are still shipped as **per-module files** (`preserveModules`) so a
consumer's bundler can tree-shake unused components — but that is a bundling
concern, not a rendering boundary.

What matters for Vue, therefore, is **SSR safety**: every component's server
output must be deterministic and free of browser-API access so the first client
(hydration) render agrees with it.

## SSR safety

- **No module-level browser access.** Every `window` / `document` /
  `localStorage` / `navigator` read lives inside a lifecycle hook
  (`onMounted`), an event handler, or behind a `typeof document !== 'undefined'`
  guard. Importing the package never touches the DOM, so it never crashes a
  server bundle. (`onMounted` never runs during server render, so DOM access in
  it is automatically server-safe.)
- **Generated IDs.** Form controls (`Input`, `Textarea`, `Password`, `Radio`,
  `Checkbox`, `Form`, `Select`, `Tabs`, …) generate ids through the `useId`
  composable, which wraps Vue's built-in `useId()`. Vue issues the **same id
  sequence** on server and client under hydration, so `id` / `for` /
  `aria-describedby` / `aria-controls` match and hydration adopts the existing
  DOM cleanly. Pass an explicit `id` to opt out and honor your own.
- **Portals** (`Modal`, `Drawer`, `Sheet`, `ContextMenu`) render their
  `<Teleport>` only on the client. A `<Teleport>` has **no server-side target**
  (there is no `document.body` to teleport into during a string render), so each
  portal gates the teleport behind the `useIsMounted()` composable —
  `<Teleport v-if="mounted && open" to="body">`. `useIsMounted()` returns
  `false` during the server render **and the first client render**, then flips to
  `true` after `onMounted`; so the server markup and the hydration render agree
  (both emit nothing), and the overlay mounts on the next tick. An open-by-default
  overlay therefore never reads `document` on the server and never mismatches.

### Components that intentionally reconcile after hydration

A few components depend on the wall clock or local timezone, which differ between
the server (often UTC) and the client. Vue hydration adopts the server DOM and
patches these on the client:

- **`Timeago`** — the human text ("5 minutes ago", "Today, 09:00") is computed
  against the current instant and the local timezone, so the server render and
  the first client render can differ by a tick or by timezone. The text
  reconciles on the client (and, with `isLive`, refreshes on its 60s interval).
  Pass a stable `datetime` prop; the *value* you pass is deterministic even
  though the rendered relative text is not.
- **`Calendar`** — "today" (the `data-today` / `aria-current="date"` marker)
  depends on the wall clock and local timezone. For a fully deterministic
  **visible month** under SSR, pass `defaultMonth` (or a controlled `value` /
  `month`); otherwise it defaults to the current month, which can differ from the
  server only at a month boundary. The today marker itself reconciles on
  hydration if the server/client dates straddle midnight.

## Framework notes

- **Nuxt** — works out of the box; SSR + hydration is the default. Components
  render on the server and hydrate on the client with no extra configuration.
- **Plain Vite SSR / [vike](https://vike.dev)** — render on the server with
  `renderToString` from `@vue/server-renderer`, send the HTML, then hydrate the
  same app on the client with `createSSRApp(App).mount('#app')`. (This is exactly
  the flow the hydration test below reproduces.)
- **Astro** (`@astrojs/vue`) — interactive components hydrate as islands
  (`client:load` / `client:visible`); purely presentational usage can render in a
  static, server-only island with no client JS.

> **Remix / TanStack Start** are React frameworks and do not apply to the Vue
> package; their Vue-ecosystem counterpart is **Nuxt** (above).

The package ships standard `import` (ESM) and `require` (CJS) entry points; any
Vue-aware SSR bundler picks them up without special export conditions.

## Verifying

A two-phase pipeline reproduces the real Nuxt / vite-ssr / vike flow — the server
render runs in a **no-DOM node** environment and the hydration runs in **jsdom**,
exactly as a real app splits them. The shared scenarios live in
`src/test/scenarios.ts`; the phases hand off server markup through a gitignored
fixture file.

- **`npm run test:ssr`** (phase 1, `vitest.ssr.config.ts`, `environment: node`)
  renders every scenario with `@vue/server-renderer` and asserts the markup is
  **byte-identical across two renders** — i.e. no `Date.now()` / `Math.random()`
  or other non-determinism leaks into the server output. Running with no DOM also
  proves there is **no module-level (or render-time) browser access**: any
  `window` / `document` read during render throws here. It also confirms
  generated ids are unique within a render, and writes each scenario's markup to
  a fixture for phase 2.
- **`npm run test:hydrate`** (phase 1, then phase 2 in `vitest.hydrate.config.ts`,
  `environment: jsdom`) replays each server fixture through a real
  `createSSRApp(...).mount()` hydration and **fails on any hydration / mismatch
  log** — Vue's channel for server/client divergence. It also asserts hydration
  *adopted* the server markup rather than wiping and re-rendering.

Coverage spans presentational (`Badge`, `Card`, `Divider`, `ProgressBar`,
`Skeleton`, `Spinner`), id-bearing forms (`Input`, `Textarea`, `Password`,
`Checkbox`, `Radio`), context/open components (`Tabs`, `Accordion`, `Dropdown`,
`Popover`, `Select`), and — critically — the four portal components rendered
**open** (`Modal` / `Drawer` / `Sheet` / `ContextMenu`), which is the exact case
that mismatches without the `useIsMounted()` Teleport guard.
