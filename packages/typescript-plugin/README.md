# @wire-ui/typescript-plugin

TypeScript Language Service plugin powering [Wire UI](https://wire-ui.com) editor
intelligence — the shared brain behind the VS Code extension and (later) other
editors.

The plugin loads into `tsserver`, reads component metadata from
[`@wire-ui/mcp`](../mcp) (the single source of truth — no data is duplicated
here), and exposes editor features as Language Service capabilities. Keeping the
logic in a TS plugin means it is framework- and editor-agnostic: any editor that
speaks the TypeScript Language Service gets the same intelligence.

> Status: milestone 0.8, in progress. Completions (`data-*`, `data-state`
> values, compound parts), hover docs, go-to-definition, and semantic
> diagnostics are in. Snippets, commands, and theme integration land in
> subsequent days.

## Diagnostics

The plugin appends its own semantic diagnostics to tsserver's, covering the
mistakes the type system can't see — `data-*` values, parts that reach no
context, selectors aimed at the wrong contract. Every rule is derived from the
`@wire-ui/mcp` catalog, import-gated, and alias-aware, and each owns a code in
the `9xxxx` range so hosts can filter on rule identity rather than message text.

| Code | Rule | Severity | Flags |
| --- | --- | --- | --- |
| 90001 | `missing-root-wrapper` | error | `<Input.Field>` with no `<Input.Root>` anywhere in the file. |
| 90002 | `compound-part-outside-root` | error | A part that renders outside its root even though a root exists elsewhere. |
| 90003 | `required-pair-props` | error | `invalidType` set with no `errorMessage`, so the field goes invalid with a blank message. |
| 90004 | `misplaced-classname` | warning | `className` / `class` on a part that renders no element, where it is dropped. |
| 90005 | `prefer-data-state-selector` | warning | `[aria-expanded="true"]` where the styling contract is `[data-state="open"]`. |
| 90006 | `invalid-data-state-value` | error | A `data-state` written with a value the component never emits. |
| 90007 | `managed-data-attribute` | warning | A `data-*` the component sets itself, so the hand-written value is overwritten. |
| 90008 | `data-attribute-wrong-part` | warning | A `data-*` written on a part the catalog scopes it away from. |
| 90009 | `as-child-single-child` | error | `asChild` without exactly one element child to merge onto. |
| 90010 | `presence-attribute-false-selector` | warning | `[data-hover="false"]`, which never matches — presence attributes are `''` or absent. |

Scope caveat: the rules read the JSX AST, so they cover React/Solid TSX and
Vue-via-JSX render functions. Markup inside a Vue SFC `<template>` is Volar's
domain. `@wire-ui/eslint-plugin` mirrors the first five for CI.

## Usage

Add the plugin to your `tsconfig.json` and make sure your editor uses the
workspace TypeScript version:

```jsonc
{
  "compilerOptions": {
    "plugins": [{ "name": "@wire-ui/typescript-plugin" }]
  }
}
```

The VS Code extension bundles and enables it automatically.

## Exports

| Entry                            | Purpose                                                                 |
| -------------------------------- | ----------------------------------------------------------------------- |
| `@wire-ui/typescript-plugin`     | The `tsserver` plugin factory (CommonJS).                               |
| `@wire-ui/typescript-plugin/metadata` | Side-effect-free metadata layer over the `@wire-ui/mcp` catalog, consumed by the VS Code extension and other editor tooling. |

## Development

```bash
npm run build      # tsup → dist/index.js (plugin) + dist/metadata.js (library)
npm run test:run   # vitest
```
