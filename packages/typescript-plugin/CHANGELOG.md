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
- Semantic diagnostics covering ten mistake patterns (codes `90001`–`90010`),
  every one derived from the catalog: compound parts that reach no context,
  `invalidType` without `errorMessage`, styling attributes on parts that render
  no element, `data-*` values the component never emits or manages itself,
  `asChild` without a single element child, and selectors aimed at the ARIA
  mirror instead of the `data-*` contract. See the README table.
- `contextOnlyParts` on `ComponentMetadata`, mirroring the new catalog field —
  the parts that render no DOM element (providers, portals, render-prop
  passthroughs).
