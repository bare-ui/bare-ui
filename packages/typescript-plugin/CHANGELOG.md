# Changelog

All notable changes to `@wire-ui/typescript-plugin` will be documented in this
file.

## [Unreleased]

### Added

- Initial package scaffold: `tsserver` plugin entry point (`create(info)`) that
  loads the metadata layer and logs the Wire UI components it sees, plus a
  passthrough Language Service proxy. No editor features yet — see roadmap
  milestone 0.8.
- `./metadata` export: the side-effect-free metadata layer over the
  `@wire-ui/mcp` catalog (relocated here from the VS Code extension so the plugin
  and the extension share one source).
