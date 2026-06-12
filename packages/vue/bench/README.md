# Render benchmarks

Compares Wire UI render performance against [Radix Vue](https://www.radix-vue.com/)
and [Headless UI](https://headlessui.com/) on equivalent component trees.

```bash
npm run bench                 # run every benchmark
npm run bench -- render.ssr   # SSR suite only
npm run bench -- render.mount # mount suite only
```

## Suites

| File                     | What it measures                                                                    |
| ------------------------ | ----------------------------------------------------------------------------------- |
| `render.ssr.bench.ts`    | `renderToString` throughput — pure server render, deterministic.                    |
| `render.mount.bench.ts`  | Client mount + unmount into jsdom via `createApp().mount()` (synchronous).          |

Scenarios live in `scenarios.ts`; each is implemented two or three ways (`wire`,
`radix`, `headless`) with an identical structure so the comparison is
apples-to-apples.

## Coverage

| Scenario  | Wire | Radix Vue | Headless UI | SSR | Mount |
| --------- | :--: | :-------: | :---------: | :-: | :---: |
| Switch    |  ✓   |     ✓     |      ✓      |  ✓  |   ✓   |
| Tabs      |  ✓   |     ✓     |      ✓      |  ✓  |   ✓   |
| Accordion |  ✓   |     ✓     |     ✓\*     |  ✓  |   ✓   |
| Dialog    |  ✓   |     ✓     |      ✓      |  —  |   ✓   |
| Tooltip   |  ✓   |     ✓     |      —      |  —  |   ✓   |

\* Headless UI has no Accordion primitive — a stack of `Disclosure`s is the
idiomatic equivalent.

## Caveats

- **Dialog/Tooltip are mount-only.** They render through Vue `<Teleport>`, which
  `@vue/server-renderer`'s `renderToString` renders inline rather than to a
  portal target — excluded from the SSR suite to keep results predictable.
- **Headless UI has no Tooltip primitive**, so that scenario compares Wire vs Radix only.
- **SSR bench callbacks are async** (`renderToString` returns a Promise). Each
  iteration includes `createSSRApp` construction overhead, which is comparable
  to React's per-iteration `createElement` cost.
- Numbers are relative, not absolute: jsdom is not a real browser (no layout or
  paint), and results vary by machine. Treat them as a regression signal and a
  rough cross-library comparison, not a published benchmark.
- Differences largely reflect feature scope — Radix Vue and Headless UI ship
  heavier focus-management and floating-position layers that Wire UI's leaner
  primitives do not include.
