# Wire UI for VS Code

> ⚠️ **Work in progress** — the Wire UI VS Code extension (roadmap milestone
> **0.8**) is still being built out.

A developer-experience layer that makes [Wire UI](https://wire-ui.com) feel
native in the editor: autocomplete, hover docs, snippets, and lints for the
AI-native unstyled primitives framework.

Published as `wire-ui.wire-ui` on the VS Code Marketplace and Open VSX.

## Snippets

Type `wire-` in a `.tsx`, `.jsx`, `.ts`, `.js`, or `.vue` file to scaffold any
Wire UI component — `wire-button`, `wire-modal`, `wire-combobox`, one per
component in the catalog. Each expands the component's full compound structure
with tab stops over the labels and placeholder text, and adds the matching
`@wire-ui/*` import if it isn't there already.

The syntax matches the framework you're writing: the file's existing Wire UI
imports decide, falling back to the workspace's dependency, then React. In a
`.vue` file the snippets are Vue template markup and only offered inside the
SFC's `<template>` block.

Set `wire-ui.snippets.autoImport` to `false` to insert the markup without the
import.

Hooks and AI primitives are there too — `wire-hotkeys`, `wire-debounce`, … for
every hook in the catalog, and `wire-ai-chat`, `wire-ai-stream`,
`wire-ai-markdown` for ready-to-style scaffolds.

## Commands

### Wire UI: Init

Sets the workspace up for Wire UI. It works out which package manager you use
(the `packageManager` field first, then the lockfile, then npm), then:

- installs `@wire-ui/<framework>` and any framework peer you're missing, in a
  terminal you can watch and cancel;
- writes a starter `wire-ui.css` — Wire UI ships no CSS, so this is a small
  stylesheet giving the `data-*` states a default look to build on. It lands in
  `src/`, `app/`, or `styles/` if you have one, otherwise the workspace root.

The framework is picked for you when the workspace already depends on one.
Nothing happens until you confirm the plan, an existing `package.json` or
stylesheet is never overwritten, and running it a second time on a set-up
workspace just offers to open the stylesheet.

> The starter stylesheet is a placeholder for milestone **0.7**'s
> `@wire-ui/themes` package; once that ships, Init will install a real theme.

### Wire UI: Add Component

Scaffolds a **new** compound component written the way Wire UI's own primitives
are — context + `Root` + parts, controllable open state, `data-state` and the
interactive `data-*` attributes wired up, types and a barrel file alongside.
It's for authoring your own primitive; to compose one the catalog already
ships, use the `wire-` snippets above.

Prompts for a name (PascalCase, spaces and dashes converted), the parts besides
`Root`, and a folder. Parts named `Trigger` and `Content`/`Panel` get their
conventional behaviour — a button that toggles, and markup that unmounts while
closed — and anything else becomes a styleable passthrough that reads the shared
state.

React and Solid get `Name.tsx` + `Name.types.ts` + `index.ts`; Vue gets one SFC
per part plus `keys.ts` for the injection key. Existing files are never
overwritten.

## Planned features

See [`.claude/roadmap.md`](../../.claude/roadmap.md) (milestone 0.8) for the full
scope. In short:

- **Editing intelligence** — `data-*` attribute & `data-state` value
  autocomplete, component-parts autocomplete, hover docs, go-to-definition, and
  diagnostic warnings for common misuses.
- **Snippets** — component, hook, and AI-primitive scaffolds (done, above).
- **Theme integration** (depends on 0.7) — theme preview swatches and an inline
  theme switcher.
- **Project tooling** — `Wire UI: Init` and `Wire UI: Add Component` (done,
  above), plus the `Wire UI: Open Playground` command and MCP detection.

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
