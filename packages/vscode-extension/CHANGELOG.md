# Changelog

All notable changes to the Wire UI VS Code extension will be documented in this
file.

## [Unreleased]

### Added

- Initial package scaffold (manifest, build config, empty extension entry
  point). No features yet — see roadmap milestone 0.8.
- Activation shell: real `activationEvents` (js/jsx/ts/tsx/vue) and a
  `contributes` skeleton — `typescriptServerPlugins` (loads
  `@wire-ui/typescript-plugin` into tsserver), a `Wire UI: Show Output Log`
  command, and `wire-ui.enable` / `wire-ui.trace.server` settings.
- `activate()` now stands up a "Wire UI" output channel and a status bar item,
  and hands the TypeScript plugin its initial configuration via the built-in TS
  extension's API.
- F5 launch + build tasks (`.vscode/launch.json`, `.vscode/tasks.json`).
- Component snippets for every component in the catalog, reachable by typing
  `wire-` (`wire-button`, `wire-modal`, `wire-combobox`, …). Each expands the
  component's full compound structure with tab stops over the text worth
  editing, and brings its own `@wire-ui/*` import.
- `wire-ui.snippets.autoImport` setting to turn that import off.
- Hook snippets (`wire-hotkeys`, `wire-debounce`, …) and AI-primitive scaffolds
  (`wire-ai-chat`, `wire-ai-stream`, `wire-ai-markdown`), covering every hook and
  scaffold in the catalog.
- `Wire UI: Init` command — sets a workspace up for Wire UI: detects the package
  manager (`packageManager` field, then lockfile, then npm), installs
  `@wire-ui/<framework>` plus any missing framework peers in a visible terminal,
  and writes a starter `wire-ui.css` styling the `data-*` states. Shows the plan
  before touching anything, creates a `package.json` when there is none, and
  leaves an existing Wire UI dependency or stylesheet alone.
- `Wire UI: Add Component` command — scaffolds a new compound component in Wire
  UI's own pattern (context + `Root` + parts, controllable open state, `data-*`
  for every interactive state) for React, Vue, or Solid. Prompts for a name,
  its parts, and a target folder; refuses to overwrite existing files. The
  generated output is typechecked against the real `@wire-ui/*` declarations in
  CI via `tsc` / `vue-tsc`.

### Changed

- Metadata is now sourced from `@wire-ui/typescript-plugin/metadata` (the shared
  layer moved into the TS plugin) instead of a direct `@wire-ui/mcp` dependency.
- The build bundles `@wire-ui/typescript-plugin` into `dist/extension.js` rather
  than leaving it external — `vsce package --no-dependencies` would otherwise
  ship a .vsix whose extension host cannot resolve the catalog.
