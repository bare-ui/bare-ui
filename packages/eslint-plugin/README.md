# @wire-ui/eslint-plugin

ESLint rules that catch Wire UI compound-component misuse. The rules read the
**same metadata catalog** as the VS Code extension — `@wire-ui/typescript-plugin/metadata`,
itself a view over `@wire-ui/mcp` — so the editor diagnostics and the lint rules
never drift.

## Rules

| Rule | Severity | Fixable | Flags |
| --- | --- | --- | --- |
| `wire-ui/compound-part-outside-root` | error | — | A compound part (`<Accordion.Trigger>`) that renders outside its component's root even though a root exists elsewhere in the file. |
| `wire-ui/missing-root-wrapper` | error | — | A compound part (`<Input.Field>`) with no root wrapper (`<Input.Root>`) present at all. |
| `wire-ui/required-pair-props` | error | — | A prop that is inert without its partner — `invalidType` set with no `errorMessage`, so the field goes invalid with a blank message. |
| `wire-ui/misplaced-classname` | warn | — | `className` / `class` on a part that renders no element (`<Modal.Root>`, `<Drawer.Portal>`), where it is silently dropped. |
| `wire-ui/prefer-data-state-selector` | warn | ✅ | A selector matching the ARIA mirror (`[aria-expanded="true"]`) instead of the styling contract (`[data-state="open"]`). |

Every rule is import-gated and alias-aware: only tags imported from a
`@wire-ui/*` package are considered, and `import { Input as TextField }` still
resolves to `Input`'s metadata. They mirror the TypeScript plugin's semantic
diagnostics — the same invariants, exposed through a second surface that also
runs in CI.

### Fixes

Only `prefer-data-state-selector` rewrites code, and the replacement reuses the
quote style of the selector it replaces so it can never break the literal it
sits in. The other rules stop short of a fix on purpose: moving a `className`
means choosing which part should carry it, and only the author knows what an
`errorMessage` should say.

### Which parts render no element

`misplaced-classname` reads `contextOnlyParts` from the catalog rather than
keeping its own list — the parts that are providers, portals, or render-prop
passthroughs. Adding one to `@wire-ui/mcp` is all it takes for the rule to cover
a new component.

## Usage

### Flat config (ESLint 9+)

```js
// eslint.config.js
import wireUi from '@wire-ui/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

export default [
  {
    files: ['**/*.{jsx,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    ...wireUi.configs.recommended,
  },
]
```

### Legacy config (`.eslintrc`)

```jsonc
{
  "extends": ["plugin:wire-ui/recommended-legacy"]
}
```

The `recommended` preset turns every rule on. Rules that mark a runtime failure
— markup that can't reach a component's shared context, or a prop that leaves
the component with nothing to render — are **errors**. Rules that mark code
which runs fine but styles nothing are **warnings**.
