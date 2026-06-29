# @wire-ui/typescript-plugin

TypeScript Language Service plugin powering [Wire UI](https://wire-ui.com) editor
intelligence — the shared brain behind the VS Code extension and (later) other
editors.

The plugin loads into `tsserver`, reads component metadata from
[`@wire-ui/mcp`](../mcp) (the single source of truth — no data is duplicated
here), and exposes editor features as Language Service capabilities. Keeping the
logic in a TS plugin means it is framework- and editor-agnostic: any editor that
speaks the TypeScript Language Service gets the same intelligence.

> Status: milestone 0.8, **scaffold**. The plugin attaches to a project, loads
> the metadata layer, and logs the Wire UI components it sees. Completions, hover
> docs, and diagnostics land in subsequent days.

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
