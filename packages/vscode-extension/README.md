# Wire UI for VS Code

> ⚠️ **Work in progress** — this is the initial scaffold for the Wire UI VS Code
> extension (roadmap milestone **0.8**). It does not provide any features yet.

A developer-experience layer that makes [Wire UI](https://wire-ui.com) feel
native in the editor: autocomplete, hover docs, snippets, and lints for the
AI-native unstyled primitives framework.

Published as `wire-ui.wire-ui` on the VS Code Marketplace and Open VSX.

## Planned features

See [`.claude/roadmap.md`](../../.claude/roadmap.md) (milestone 0.8) for the full
scope. In short:

- **Editing intelligence** — `data-*` attribute & `data-state` value
  autocomplete, component-parts autocomplete, hover docs, go-to-definition, and
  diagnostic warnings for common misuses.
- **Snippets** — compound component scaffolds, hook snippets, and AI-primitive
  scaffolds.
- **Theme integration** (depends on 0.7) — theme preview swatches and an inline
  theme switcher.
- **Project tooling** — `Wire UI: Init`, `Wire UI: Add Component`, and
  `Wire UI: Open Playground` commands, plus MCP detection.

## Architecture

The extension is a thin UI shell. The actual intelligence is intended to come
from a TypeScript Language Service plugin (`@wire-ui/typescript-plugin`) so the
same capabilities can be reused in other editors later. Component metadata is
sourced from the existing [`@wire-ui/mcp`](../mcp) package rather than
duplicated here.

## Development

```bash
# from the repo root
npm install

# build / watch this package
npm run build  --workspace wire-ui
npm run dev    --workspace wire-ui
```

Open the **repo root** in VS Code and press `F5` (the "Run Wire UI Extension"
launch config) to start an Extension Development Host. It runs
`build:vscode-extension` first (builds the extension plus its
`@wire-ui/typescript-plugin` / `@wire-ui/mcp` dependencies via Turbo), then
launches. On activation the extension logs to the **Wire UI** output channel
(Output panel → "Wire UI", or run **Wire UI: Show Output Log**) and shows a
status bar item.

## License

[MIT](./LICENSE)
