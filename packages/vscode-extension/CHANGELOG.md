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

### Changed

- Metadata is now sourced from `@wire-ui/typescript-plugin/metadata` (the shared
  layer moved into the TS plugin) instead of a direct `@wire-ui/mcp` dependency.
