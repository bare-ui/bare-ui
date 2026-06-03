# Render benchmarks

Compares Wire UI render performance against [Radix UI](https://www.radix-ui.com/)
and [Headless UI](https://headlessui.com/) on equivalent component trees.

```bash
npm run bench                 # run every benchmark
npm run bench -- render.ssr   # SSR suite only
npm run bench -- render.mount # mount suite only
```

## Suites

| File                    | What it measures                                                                 |
| ----------------------- | -------------------------------------------------------------------------------- |
| `render.ssr.bench.tsx`  | `renderToStaticMarkup` throughput — pure server render, deterministic.           |
| `render.mount.bench.tsx`| Client mount + unmount into jsdom via `createRoot` + `flushSync` (synchronous).  |

Scenarios live in `scenarios.tsx`; each is implemented three ways (`wire`,
`radix`, `headless`) with an identical structure so the comparison is
apples-to-apples.

## Coverage

| Scenario  | Wire | Radix | Headless | SSR | Mount |
| --------- | :--: | :---: | :------: | :-: | :---: |
| Switch    |  ✓   |   ✓   |    ✓     |  ✓  |   ✓   |
| Tabs      |  ✓   |   ✓   |    ✓     |  ✓  |   ✓   |
| Accordion |  ✓   |   ✓   |   ✓\*    |  ✓  |   ✓   |
| Dialog    |  ✓   |   ✓   |    ✓     |  —  |   ✓   |
| Tooltip   |  ✓   |   ✓   |    —     |  —  |   ✓   |

\* Headless UI has no Accordion primitive — a stack of `Disclosure`s is the
idiomatic equivalent.

## Caveats

- **Dialog/Tooltip are mount-only.** They render through portals, which the
  React server renderer does not support, so they are excluded from the SSR suite.
- **Headless UI has no Tooltip primitive**, so that scenario compares Wire vs Radix only.
- Numbers are relative, not absolute: jsdom is not a real browser (no layout or
  paint), and results vary by machine. Treat them as a regression signal and a
  rough cross-library comparison, not a published benchmark.
- Differences largely reflect feature scope — Radix and Headless UI ship
  collision-aware positioning and heavier focus-management layers that Wire UI's
  leaner primitives do not.
