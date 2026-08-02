# Wire UI for VS Code

Editor intelligence for [Wire UI](https://wire-ui.com) — the AI-native unstyled
primitives framework. Autocomplete that knows every `data-*` attribute your
components expose, hover docs with the parts and states tables, snippets for the
whole catalog, and lints for the mistakes compound components invite.

Works in VS Code, Cursor, Windsurf and VSCodium, for **React, Vue and Solid**.

![Typing wire-switch expands the full compound structure, then data- completes the attributes Switch actually exposes](assets/hero.gif)

## Install

Search **Wire UI** in the Extensions view, or:

```
ext install wire-ui.wire-ui
```

Then open any `.tsx`, `.jsx`, `.ts`, `.js` or `.vue` file. Run **Wire UI: Init**
from the palette if the workspace isn't set up yet.

## Autocomplete that knows the component

![data-state inside a Switch completes to checked and unchecked; inside an Accordion, to open and closed](assets/completions.gif)

- **`data-*` attributes**, filtered to the ones that component actually exposes,
  each with its description.
- **`data-state` values** per component — `checked`/`unchecked` for `Switch`,
  `open`/`closed` for `Accordion` — read from the catalog, never hardcoded.
- **Compound parts**: type `<Accordion.` and get `Root`, `Item`, `Trigger`,
  `Content` with snippet bodies, `Root` first.

## Hover docs

![Hovering Accordion.Trigger shows the parts table with the hovered part marked, the data attribute table, and a docs link](assets/hover.gif)

Hover any Wire UI component or part for its parts table (with props), its
`data-*` attributes and their value enums, and a link to the docs page. Every
component in the catalog is covered — that's asserted by a test, not a promise.

Cmd-click resolves too: to the component's source when it's in the workspace, to
its docs page when it isn't.

## Lints for what compound components get wrong

![Input.Field written without an Input.Root wrapper gets a squiggle explaining it can't reach the shared context](assets/diagnostics.gif)

Ten diagnostics, as you type — a part used outside its root, a `Root` wrapper
missing entirely, `invalidType` set without an `errorMessage`, a `className` on a
part that renders no element, `[aria-expanded="true"]` where a `data-state`
selector belongs, and more.

The same rules ship as [`@wire-ui/eslint-plugin`](../eslint-plugin) for CI, off
the same metadata, so your editor and your pipeline agree.

## Snippets for the whole catalog

Type `wire-` to scaffold any component — `wire-button`, `wire-modal`,
`wire-combobox`, one per component. Each expands the full compound structure with
tab stops over the text worth editing, and adds the matching `@wire-ui/*` import.

The syntax matches the framework you're writing: the file's existing Wire UI
imports decide, falling back to the workspace's dependency, then React. In a
`.vue` file you get Vue template markup, offered only inside `<template>`.

Hooks and AI primitives too — `wire-hotkeys`, `wire-debounce`, … for every hook,
and `wire-ai-chat`, `wire-ai-stream`, `wire-ai-markdown` for ready-to-style
scaffolds.

## Commands

| Command | What it does |
| --- | --- |
| **Wire UI: Init** | Sets the workspace up: detects your package manager, installs `@wire-ui/<framework>` plus any missing framework peer in a terminal you can watch, and writes a starter `wire-ui.css`. Shows the plan first; never overwrites an existing `package.json` or stylesheet. |
| **Wire UI: Add Component** | Scaffolds a **new** compound component in Wire UI's own pattern — context + `Root` + parts, controllable open state, `data-*` for every interactive state. Prompts for a name, its parts and a folder. The generated code is typechecked against the real `@wire-ui/*` declarations in CI. |
| **Wire UI: MCP Server Status** | Reports whether the workspace has `@wire-ui/mcp` installed and whether an MCP client is configured to run it — and copies a config snippet when nothing is. |
| **Wire UI: Show Output Log** | Opens the Wire UI output channel. |

**Add Component** authors a *new* primitive; to compose one the catalog already
ships, use the `wire-` snippets.

## Settings

| Setting | Default | What it does |
| --- | --- | --- |
| `wire-ui.enable` | `true` | Editor intelligence on/off. |
| `wire-ui.snippets.autoImport` | `true` | Add the matching `@wire-ui` import when a snippet is inserted. |
| `wire-ui.trace.server` | `off` | Trace communication with the TypeScript plugin. |

## Requirements

VS Code **1.82** or newer, or any fork built on it (Cursor, Windsurf, VSCodium).
Completions, hover, go-to-definition and diagnostics come from a TypeScript
Language Service plugin, so they need the editor's built-in TypeScript
extension — snippets, commands and the status bar work regardless.

## Not here yet

- **Theme preview swatches and the theme switcher**, waiting on Wire UI's
  `@wire-ui/themes` package (milestone 0.7). Until then **Init** writes a
  starter stylesheet instead of installing a theme.
- **Export to the playground**, waiting on playground.wire-ui.com (0.6).

## Architecture

The extension is a thin shell. The intelligence lives in
[`@wire-ui/typescript-plugin`](../typescript-plugin), a TypeScript Language
Service plugin, so the same capabilities can be reused by other editors; the
component metadata comes from [`@wire-ui/mcp`](../mcp) rather than being
duplicated here. Adding a component to the catalog gives it snippets, completions
and hover docs with no change to this package.

## Development

```bash
# from the repo root
npm install
npm run build --workspace wire-ui   # or `dev` to watch
```

Open the **repo root** in VS Code and press `F5` ("Run Wire UI Extension") to
start an Extension Development Host. On activation the extension logs to the
**Wire UI** output channel and shows a status bar item.

Releasing is [`RELEASING.md`](./RELEASING.md) — read it before packaging; the
TypeScript plugin does not ship the way you would expect.

## License

[MIT](./LICENSE)
