# @wire-ui/eslint-plugin

ESLint rules that catch Wire UI compound-component misuse. The rules read the
**same metadata catalog** as the VS Code extension — `@wire-ui/typescript-plugin/metadata`,
itself a view over `@wire-ui/mcp` — so the editor diagnostics and the lint rules
never drift.

## Rules

| Rule | Flags |
| --- | --- |
| `wire-ui/compound-part-outside-root` | A compound part (`<Accordion.Trigger>`) that renders outside its component's root even though a root exists elsewhere in the file. |
| `wire-ui/missing-root-wrapper` | A compound part (`<Input.Field>`) with no root wrapper (`<Input.Root>`) present at all. |

Both are import-gated and alias-aware: only tags imported from a `@wire-ui/*`
package are considered, and `import { Input as TextField }` still resolves to
`Input`'s metadata. They mirror the TypeScript plugin's semantic diagnostics
(`compound-part-outside-root` / `missing-root-wrapper`) — the same invariant,
exposed through a second surface.

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

The `recommended` preset turns both rules on as **errors** — each marks markup
that silently fails to reach a component's shared context.
