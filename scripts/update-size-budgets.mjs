#!/usr/bin/env node
// Regenerates per-component bundle-size budgets and the published docs table.
//
// For every documented component it measures the gzipped cost of a single
// tree-shaken import (`import { Button } from '@wire-ui/<fw>'`) in each
// framework package, then:
//   1. writes `packages/<fw>/.size-limit.json` with a budget per component
//      (measured size + headroom) — this is what `npm run size` gates in CI,
//      so a PR that bloats a component past its budget fails the build; and
//   2. writes `apps/docs/src/data/bundle-sizes.json` with the raw measured
//      sizes, which the docs "Bundle Size" page renders into a table.
//
// Re-run this (then commit the diff) to re-baseline budgets after an
// intentional size change. Requires each package to be built first
// (`npm run build`), since size-limit measures the published `dist`.
//
//   node scripts/update-size-budgets.mjs            # all frameworks
//   node scripts/update-size-budgets.mjs react      # one framework

import { execFileSync } from 'node:child_process'
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

/** Framework packages and the peer deps size-limit must treat as external. */
const FRAMEWORKS = {
  react: { ignore: ['react', 'react-dom', 'react/jsx-runtime'] },
  solid: { ignore: ['solid-js', 'solid-js/web', 'solid-js/store'] },
  vue: { ignore: ['vue'] },
}

/** Doc slugs whose exported symbol isn't a plain PascalCase of the slug. */
const EXPORT_OVERRIDES = { otp: 'OTP' }

const targets = process.argv.slice(2).filter((a) => FRAMEWORKS[a])
const selected = targets.length ? targets : Object.keys(FRAMEWORKS)

/** The documented component set is the source of truth (docs ↔ budgets stay in lockstep). */
function componentSlugs() {
  return readdirSync(join(root, 'apps/docs/content/components'))
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''))
    .sort()
}

const exportName = (slug) =>
  EXPORT_OVERRIDES[slug] ??
  slug
    .split('-')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join('')

const title = (slug) =>
  slug
    .split('-')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ')

/** Round bytes up to the nearest `step`. */
const ceilTo = (bytes, step) => Math.ceil(bytes / step) * step

/** Format a byte budget as a size-limit limit string ("1.25 kB"). */
const kb = (bytes) => `${+(bytes / 1000).toFixed(2)} kB`

/** Per-component budget: measured + ~35% headroom (floor 180 B), rounded up to 50 B. */
const componentBudget = (bytes) => ceilTo(Math.max(bytes * 1.35, bytes + 180), 50)

/** Barrel budget: measured + 20%, rounded up to 1 kB. */
const barrelBudget = (bytes) => ceilTo(bytes * 1.2, 1000)

/** Write a size-limit config for `pkg`; if `limits` is null, entries are measure-only. */
function writeSizeConfig(pkgDir, ignore, slugs, limits) {
  const entries = slugs.map((slug) => ({
    name: `${title(slug)} (single import)`,
    path: 'dist/index.js',
    import: `{ ${exportName(slug)} }`,
    ignore,
    ...(limits ? { limit: limits[slug] } : {}),
  }))
  entries.push({
    name: 'Whole library (barrel import)',
    path: 'dist/index.js',
    import: '*',
    ignore,
    ...(limits ? { limit: limits.__barrel__ } : {}),
  })
  writeFileSync(join(pkgDir, '.size-limit.json'), JSON.stringify(entries, null, '\t') + '\n')
}

/** Run size-limit in `pkgDir` and return a name→size(bytes) map. */
function measure(pkgDir) {
  const out = execFileSync('npx', ['size-limit', '--json'], {
    cwd: pkgDir,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 64,
  })
  const rows = JSON.parse(out)
  return Object.fromEntries(rows.map((r) => [r.name, r.size]))
}

const slugs = componentSlugs()
const docData = { frameworks: selected, components: [], barrel: {} }
// Seed component rows so ordering is stable regardless of framework loop order.
const rowBySlug = Object.fromEntries(
  slugs.map((slug) => {
    const row = { slug, name: exportName(slug), sizes: {} }
    docData.components.push(row)
    return [slug, row]
  }),
)

for (const fw of selected) {
  const pkgDir = join(root, 'packages', fw)
  const { ignore } = FRAMEWORKS[fw]
  console.log(`\n▸ ${fw}: measuring ${slugs.length} components…`)

  // Phase 1: measure-only config, then read the real sizes.
  writeSizeConfig(pkgDir, ignore, slugs, null)
  const sizes = measure(pkgDir)

  // Phase 2: turn measurements into budgets and rewrite the committed config.
  const limits = {}
  for (const slug of slugs) {
    const bytes = sizes[`${title(slug)} (single import)`]
    if (bytes == null) throw new Error(`${fw}: no measurement for ${slug} (${exportName(slug)})`)
    limits[slug] = kb(componentBudget(bytes))
    rowBySlug[slug].sizes[fw] = bytes
  }
  const barrelBytes = sizes['Whole library (barrel import)']
  limits.__barrel__ = kb(barrelBudget(barrelBytes))
  docData.barrel[fw] = barrelBytes

  writeSizeConfig(pkgDir, ignore, slugs, limits)
  console.log(`  ✓ wrote packages/${fw}/.size-limit.json (barrel ${kb(barrelBytes)})`)
}

const dataPath = join(root, 'apps/docs/src/data/bundle-sizes.json')
writeFileSync(dataPath, JSON.stringify(docData, null, 2) + '\n')
console.log(`\n✓ wrote apps/docs/src/data/bundle-sizes.json (${slugs.length} components)`)
