# Render benchmarks

Compares Wire UI render performance against [Kobalte](https://kobalte.dev/) and
[Corvu](https://corvu.dev/) on equivalent component trees. Kobalte is the
Radix-style analogue (full compound coverage); Corvu is the leaner
overlay/disclosure-focused library.

Unlike React (whose `renderToStaticMarkup` runs against the same build as the
client), Solid's server render needs a separate compile target, so the two
suites use separate Vitest configs and run as separate scripts:

```bash
npm run bench         # mount + SSR
npm run bench:mount   # client mount suite only
npm run bench:ssr     # SSR suite only
```

## Suites

| File                     | What it measures                                                            |
| ------------------------ | -------------------------------------------------------------------------- |
| `render.ssr.bench.tsx`   | `renderToString` throughput — pure server render, deterministic.           |
| `render.mount.bench.tsx` | Client mount + dispose into jsdom via `render` (synchronous).              |

Scenarios live in `scenarios.tsx`; each is implemented with an identical
structure across libraries so the comparison is apples-to-apples.

## Coverage

| Scenario  | Wire | Kobalte | Corvu | SSR  | Mount |
| --------- | :--: | :-----: | :---: | :--: | :---: |
| Switch    |  ✓   |    ✓    |   —   |  ✓   |   ✓   |
| Tabs      |  ✓   |    ✓    |   —   |  ✓   |   ✓   |
| Accordion |  ✓   |    ✓    |   ✓   |  ✓   |  ✓\* |
| Dialog    |  ✓   |    ✓    |   ✓   |  —   |  ✓\* |
| Tooltip   |  ✓   |    ✓    |   ✓   |  —   |   ✓   |

Corvu ships no Switch or Tabs primitive (it focuses on overlay/disclosure
patterns), so those scenarios compare Wire vs Kobalte only.

\* **Some competitor variants don't render in the jsdom *mount* harness** and are
dropped at runtime (the harness smoke-tests every variant first and prints a
`skipped …` summary — they are never silently omitted):

- `Accordion/kobalte` — recurses to a stack overflow without real layout.
- `Accordion/corvu`, `Dialog/corvu` — corvu's precompiled overlay primitives hit
  a circular-import temporal-dead-zone when re-processed by the Solid transform.

These are properties of the jsdom harness, not the libraries. Note that
`Accordion/corvu` and `Accordion/kobalte` both render fine in the **SSR** suite —
the failures are specific to the client mount path.

## Caveats

- **Dialog/Tooltip are mount-only.** They render through portals, which are
  client-only in Solid's server renderer, so they are excluded from the SSR suite.
- Numbers are relative, not absolute: jsdom is not a real browser (no layout or
  paint), and results vary by machine. Treat them as a regression signal and a
  rough cross-library comparison, not a published benchmark.
- Differences largely reflect feature scope — Kobalte and Corvu ship
  collision-aware floating positioning and heavier focus-management layers that
  Wire UI's leaner primitives do not.
