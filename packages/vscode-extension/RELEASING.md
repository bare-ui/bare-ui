# Releasing the Wire UI extension

Two registries, one artifact, and one thing a machine cannot check for you.

## Why two registries

The Marketplace only serves Microsoft's own VS Code. **Cursor, Windsurf and
VSCodium resolve extensions from Open VSX**, so an extension published only to
the Marketplace does not exist as far as the forks are concerned. Both get the
same `.vsix`, built once — see
[`.github/workflows/release-extension.yml`](../../.github/workflows/release-extension.yml).

## One-time setup

| Secret     | Where it comes from                                                                     |
| ---------- | --------------------------------------------------------------------------------------- |
| `VSCE_PAT` | Azure DevOps PAT for the `wire-ui` publisher, scope **Marketplace → Manage**, all orgs.  |
| `OVSX_PAT` | open-vsx.org access token (Eclipse account), for the `wire-ui` namespace.               |

Both live in the repo's Actions secrets. The Open VSX namespace is created by
the workflow's first run; it is a no-op afterwards.

## Cutting a release

1. Bump `version` in `package.json`. It ships as `0.0.0` and the workflow
   **refuses to publish that** — the check is there because a `0.0.0` on a
   registry cannot be replaced, only superseded.
2. Move the `CHANGELOG.md` `[Unreleased]` section under the new version. The
   changelog ships in the `.vsix` and the Marketplace renders it as a tab.
3. Confirm the README's opening still matches what the extension does — it is
   the listing page, and its first screen is what decides installs.
4. Tag and push:

   ```bash
   git tag vscode-extension-v0.1.0
   git push origin vscode-extension-v0.1.0
   ```

The workflow builds, typechecks, tests, verifies the tag matches the manifest,
packages, uploads the `.vsix` as a build artifact, and publishes to both
registries. To rehearse without publishing, run it from the Actions tab with
**publish** left off — it stops after the artifact upload.

Locally, `npm run package --workspace wire-ui` produces the same `wire-ui.vsix`.

## What packaging has to do that `vsce` cannot

`contributes.typescriptServerPlugins` names a **module**, and the process that
resolves it is tsserver, not the extension host: VS Code passes the installed
extension's directory as a plugin probe location and tsserver requires the name
from `<extension>/node_modules`. Bundling the plugin into `dist/extension.js`
satisfies nobody — that bundle is for the extension host.

`vsce` will not put it there. `--no-dependencies` globs the package with a
hard-coded `node_modules/**` ignore that runs *before* `.vscodeignore`, so no
negation can re-include it; and letting vsce compute the dependency tree instead
runs `npm list --production` inside a workspace package, which reports the repo
root and every hoisted package and exits non-zero. So `npm run package` is
`scripts/package.mjs`: generate the pack, run `vsce package`, add the pack to the
archive. Two things follow.

- **The pack lives under `node_modules/`, so `npm install` deletes it** as an
  extraneous package. Anything that needs it regenerates it first; never assume
  it is there.
- **`vsce ls` cannot tell you what shipped** — the pack is added after vsce
  writes the archive. `src/package.test.ts` packages for real and opens the
  `.vsix`.

When this breaks, nothing crashes: the extension activates, the status bar
appears, snippets work, and every language feature is simply absent. The only
evidence is a `Failed to load module` line in *TypeScript > tsserver log*.

## Verifying on the forks

CI covers everything about fork compatibility that is mechanically checkable:

- **The engine floor is enforced by the compiler.** `@types/vscode` is pinned to
  *exactly* the floor in `engines.vscode` (`1.82.0` / `^1.82.0`), and a test
  asserts they stay equal. A caret on the types is what silently lets `tsc`
  accept APIs that a lagging fork does not have — raise both together, never
  one, and only when something actually needs the newer API.
- **Activation survives a host without the built-in TypeScript extension**, one
  whose `exports.getAPI` is missing, and one whose `configurePlugin` throws —
  three ways a fork differs from stock VS Code, each covered in
  `src/extension.test.ts`.
- **The `.vsix` packages**, with an icon that exists, no proposed APIs, and the
  TypeScript plugin at a module specifier tsserver can resolve.

What no CI here can do is install the thing in a real fork. Before a release,
run this by hand in **Cursor** and **Windsurf** (VSCodium if you have it).

An AppImage build has no `cursor` on the PATH, but it carries the CLI: mount it
with `Cursor --appimage-mount`, then use
`<mount>/usr/share/cursor/bin/cursor --install-extension …`. Passing arguments to
the AppImage itself just opens a window. Add `--user-data-dir <tmp>` when
launching so the check runs against a clean profile without disturbing yours;
`--extensions-dir <tmp>` isolates the install too.

1. `npm run package --workspace wire-ui`, then in the fork:
   Extensions → `…` → **Install from VSIX…** → pick `wire-ui.vsix`.
2. Open a `.tsx` file. The **Wire UI** item appears in the status bar — that is
   activation; if it is missing, check the Output panel's *Wire UI* channel.
3. Click it. The MCP notification names whether the workspace configures
   `@wire-ui/mcp`.
4. Type `wire-` in the file. Component snippets are offered and insert their
   import.
5. Run **Wire UI: Add Component** from the palette. It scaffolds and the files
   compile.
6. Hover a Wire UI component and type `data-` inside one. These come from the
   TypeScript plugin rather than the extension, so they are the parts most
   likely to differ on a fork — a fork bundling its own TypeScript extension
   may not load `typescriptServerPlugins` at all.

**Step 6 is not a UI check.** Set `"typescript.tsserver.log": "verbose"`, open
the *TypeScript > tsserver log*, and read it. It is the only surface that
reports a plugin failing to load, and it is where both Day 19 bugs were found —
neither produced so much as a notification. Look for:

- `Loading global plugin wire-ui-typescript-plugin-pack` followed by
  `[wire-ui] plugin loaded — N components in catalog`. A `Failed to load module`
  instead means the pack did not ship.
- No `Debug Failure` anywhere. tsserver asserting is how a plugin misusing the
  language service shows up, and it takes the whole request with it.

Record the result — fork, version, what worked — in the Day 19 notes of
`.claude/vscode-extension-tasks.md`. Steps 1–5 are extension-only and should be
identical everywhere; step 6 is the one worth reporting in detail.
