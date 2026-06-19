#!/usr/bin/env node
// Regenerates the cross-framework API parity matrix published in the docs.
//
// Reads the public export surface of each framework package straight from its
// `src/index.ts` and computes, for every component and hook, which frameworks
// ship it and under what name. The three packages name the hook concept
// differently — React `useX`, Solid `createX`, Vue `useX` (composable) — so
// hooks are matched on the concept (the name minus its framework prefix), and
// the matrix records the real identifier per framework.
//
// Output: apps/docs/src/data/api-parity.json, rendered by the "API Parity"
// docs page. This is a static source parse — no build required.
//
//   node scripts/update-parity-matrix.mjs           # rewrite the JSON
//   node scripts/update-parity-matrix.mjs --check    # fail if it's stale (CI)

import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const check = process.argv.includes('--check')

const FRAMEWORKS = ['react', 'solid', 'vue']
// The hook-equivalents live in a differently-named barrel per framework.
const HOOK_BARREL = { react: './hooks', solid: './primitives', vue: './composables' }
// The prefix each framework puts on its hook concept.
const HOOK_PREFIX = { react: 'use', solid: 'create', vue: 'use' }

// Identifiers that sit in the components barrel but aren't components.
const NOT_COMPONENT = new Set(['useToast', 'getPaginationItems', 'iconNames', 'iconSizes'])
// Bare helpers re-exported from the hook barrel that aren't hooks.
const NOT_HOOK = new Set(['getDirection', 'isRtl'])

/** Pull the members of `export { ... } from '<from>'` (no nested braces to worry about). */
function barrelMembers(src, from) {
  const re = new RegExp(`export \\{([^}]*)\\} from '${from.replace(/\./g, '\\.')}'`)
  const m = src.match(re)
  if (!m) return []
  return m[1]
    .split(',')
    .map((s) => s.replace(/\/\/.*/, '').trim())
    .filter(Boolean)
}

const kebab = (name) =>
  name === 'OTP' ? 'otp' : name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

const componentDocs = new Set(
  readdirSync(join(root, 'apps/docs/content/components'))
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, '')),
)
const hookDocs = new Set(
  readdirSync(join(root, 'apps/docs/content/hooks'))
    .filter((f) => f.endsWith('.mdx') && f !== 'index.mdx')
    .map((f) => f.replace(/\.mdx$/, '')),
)

const src = Object.fromEntries(
  FRAMEWORKS.map((p) => [p, readFileSync(join(root, 'packages', p, 'src/index.ts'), 'utf8')]),
)

// --- Components: matched by identical export name across frameworks. ---
const componentSets = Object.fromEntries(
  FRAMEWORKS.map((p) => [
    p,
    new Set(barrelMembers(src[p], './components').filter((x) => !NOT_COMPONENT.has(x))),
  ]),
)
const componentNames = [...new Set(FRAMEWORKS.flatMap((p) => [...componentSets[p]]))].sort()
const components = componentNames.map((name) => {
  const slug = kebab(name)
  const row = { name, doc: componentDocs.has(slug) ? slug : null }
  for (const p of FRAMEWORKS) row[p] = componentSets[p].has(name)
  return row
})

// --- Hooks: matched by concept (export name minus the framework prefix). ---
const concepts = {}
for (const p of FRAMEWORKS) {
  for (const id of barrelMembers(src[p], HOOK_BARREL[p])) {
    if (NOT_HOOK.has(id)) continue
    const concept = id.replace(new RegExp(`^${HOOK_PREFIX[p]}`), '')
    ;(concepts[concept] ??= {})[p] = id
  }
}
const hooks = Object.keys(concepts)
  .sort()
  .map((concept) => {
    const byFw = concepts[concept]
    // Doc pages follow the React/Vue `use-*` slug; derive from whichever exists.
    const useName = byFw.react ?? byFw.vue ?? `use${concept}`
    const slug = kebab(useName)
    const row = { concept, doc: hookDocs.has(slug) ? slug : null }
    for (const p of FRAMEWORKS) row[p] = byFw[p] ?? null
    return row
  })

const data = {
  frameworks: FRAMEWORKS,
  hookPrefix: HOOK_PREFIX,
  summary: {
    components: { total: components.length, shared: components.filter(everywhere).length },
    hooks: { total: hooks.length, shared: hooks.filter(everywhere).length },
  },
  components,
  hooks,
}

function everywhere(row) {
  return FRAMEWORKS.every((p) => Boolean(row[p]))
}

const outPath = join(root, 'apps/docs/src/data/api-parity.json')
const json = JSON.stringify(data, null, 2) + '\n'

if (check) {
  const current = existsSync(outPath) ? readFileSync(outPath, 'utf8') : ''
  if (current !== json) {
    console.error(
      'API parity matrix is out of date.\n' +
        'Run `npm run parity:update` and commit apps/docs/src/data/api-parity.json.',
    )
    process.exit(1)
  }
  console.log(
    `✓ API parity matrix up to date (${components.length} components, ${hooks.length} hooks)`,
  )
} else {
  writeFileSync(outPath, json)
  console.log(
    `✓ wrote apps/docs/src/data/api-parity.json\n` +
      `  components: ${data.summary.components.shared}/${data.summary.components.total} in all three\n` +
      `  hooks:      ${data.summary.hooks.shared}/${data.summary.hooks.total} in all three`,
  )
}
