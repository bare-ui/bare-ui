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
- **The `.vsix` packages**, with an icon that exists and no proposed APIs.

What no CI here can do is install the thing in a real fork. Before a release,
run this by hand in **Cursor** and **Windsurf** (VSCodium if you have it):

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

Record the result — fork, version, what worked — in the Day 19 notes of
`.claude/vscode-extension-tasks.md`. Steps 1–5 are extension-only and should be
identical everywhere; step 6 is the one worth reporting in detail.
