# Changelog

All notable changes to the Wire UI VS Code extension will be documented in this
file.

## [0.1.0] — 2026-08-02

First public release: everything below shipped as one milestone (0.8), so it is
listed as one version rather than replayed as the days it was built over.

### Added

- **Editor intelligence**, from the bundled `@wire-ui/typescript-plugin`:
  `data-*` attribute completion filtered to the component under the cursor,
  `data-state` value completion per component, compound-part completion after
  `<Component.`, hover docs with the parts and `data-*` tables and a docs link
  (every component in the catalog, asserted by test), and go-to-definition for
  components and parts.
- **Ten diagnostics** for compound-component misuse — `missing-root-wrapper`,
  `compound-part-outside-root`, `required-pair-props`, `misplaced-classname`,
  `prefer-data-state-selector`, `invalid-data-state-value`,
  `managed-data-attribute`, `data-attribute-wrong-part`, `as-child-single-child`
  and `presence-attribute-false-selector`. The same rules ship as
  `@wire-ui/eslint-plugin` off the same metadata.
- MCP detection: a status bar item reporting whether the workspace has
  `@wire-ui/mcp` installed and whether an MCP client is configured to run it,
  with a `Wire UI: MCP Server Status` command that copies a config snippet.
- Activation shell: `activationEvents` for js/jsx/ts/tsx/vue, a "Wire UI" output
  channel, a `Wire UI: Show Output Log` command, and the `wire-ui.enable` /
  `wire-ui.trace.server` settings.
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

### Fixed before release

Neither of these ever reached a published build — both were found by installing
a real `.vsix` in Cursor and reading tsserver's log, and both are recorded here
because they are the failure modes to check for first if language features ever
go quiet again.

- **The TypeScript plugin never loaded from a packaged `.vsix`.** Everything it
  powers — `data-*` completion, component parts, hover docs, go-to-definition
  and all ten diagnostics — was dead in an installed build, while working
  perfectly in the F5 dev host. `contributes.typescriptServerPlugins` names a
  module that _tsserver_ resolves from the installed extension's own directory,
  and bundling the plugin into `dist/extension.js` does nothing for that; the
  failure was one `Failed to load module` line in a tsserver log. The plugin now
  ships as `node_modules/wire-ui-typescript-plugin-pack` inside the `.vsix`, and
  a test packages for real and opens the archive to check it is there.
- The plugin scanned the project from `create()`, which runs before tsserver has
  built the project graph. That desynchronised `project.program` and made the
  next `updateGraphWorker()` fail an internal assertion, taking down the
  `updateOpen` request for the first file opened in a window. The scan now runs
  on the first request served.

### Not shipped

- `Wire UI: Open Playground` was cut before the first release rather than
  shipped as a stub. playground.wire-ui.com is milestone 0.6 and does not exist
  yet, so the command could only ever apologise — worse, in a palette, than not
  being there. It returns implemented, once there is a share-link format to
  build against.
- Theme preview swatches and the theme switcher wait on `@wire-ui/themes`
  (milestone 0.7). `Wire UI: Init` writes a starter stylesheet in the meantime.
