# Security Policy

## Supported Versions

Security fixes are applied to the latest published minor version of each Wire UI
package. We recommend always tracking the latest release.

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |
| Older   | :x:                |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues,
discussions, or pull requests.**

Instead, report them privately through either of these channels:

- **Email:** [security@wire-ui.com](mailto:security@wire-ui.com)
- **GitHub:** open a private advisory via
  **Security → Report a vulnerability** on the
  [repository](https://github.com/wire-ui/wire-ui/security/advisories/new).

Please include as much of the following as you can:

- The package and version affected (e.g. `@wire-ui/react@0.4.0`).
- A description of the vulnerability and its impact.
- Steps to reproduce, ideally a minimal proof of concept.
- Any suggested remediation.

### What to expect

- **Acknowledgement** within **48 hours**.
- An initial assessment and **fix timeline within 7 days**.
- We will keep you informed as we work on a fix, and credit you in the release
  notes and advisory unless you prefer to remain anonymous.
- Please allow us a reasonable period to release a fix before any public
  disclosure (coordinated disclosure).

## Security Model

Wire UI is a set of headless UI primitives. The following properties hold across
the published `@wire-ui/react`, `@wire-ui/vue`, and `@wire-ui/solid` packages:

- **Zero runtime dependencies.** Each package declares `"dependencies": {}` and
  lists only its host framework as a peer dependency. There is no transitive
  supply-chain surface in what ships to your users.
- **No `eval` / dynamic code execution.** The library never calls `eval()` or
  `Function()`. It needs no `script-src 'unsafe-eval'`.
- **No inline scripts or external resources.** No `<script>` tags, no inline
  event handlers (all handlers are attached as JavaScript listeners, never
  `onclick="…"` attributes), no network requests, fonts, or images. The library
  needs no `'unsafe-inline'` or `'unsafe-eval'` in `script-src` and is compatible
  with a strict `script-src 'self'`.
- **Inline `style` attributes require `style-src 'unsafe-inline'`.** Components
  that position or size themselves at runtime — popovers/tooltips, slider fills,
  progress bars, virtualized list offsets, `display: contents`/visually-hidden
  helpers — write computed values to the `style` attribute. CSP cannot whitelist
  style *attributes* with a hash or nonce, so a page that renders Wire UI must
  allow `style-src 'unsafe-inline'` (equivalently `style-src-attr 'unsafe-inline'`
  on CSP3-aware browsers). This relaxes only the style channel; `script-src`
  stays strict, so no script-injection capability is granted.
- **XSS-safe by default.** Component output is rendered through the framework's
  normal escaping. `Markdown` and `CodeBlock` never inject raw HTML, and the
  built-in `Markdown`/`Citation` URL renderers strip dangerous schemes
  (`javascript:`, `vbscript:`, unsafe `data:`, `file:`) before they reach an
  `href`/`src`.
- **One opt-in raw-HTML path.** `Icon` renders the SVG strings supplied in its
  `icons` map via `dangerouslySetInnerHTML` (and framework equivalents). These
  must be **trusted, author-controlled** assets — never built from user input.
  Sanitize user-supplied SVG with a dedicated tool (e.g. DOMPurify) first.

### Recommended Content Security Policy

A page rendering Wire UI works under the following baseline — no `'unsafe-eval'`
and a locked-down `script-src`:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data:;
```

Notes:

- `script-src 'self'` (no `'unsafe-inline'`, no `'unsafe-eval'`) is sufficient —
  Wire UI ships no inline scripts and runs no dynamic code.
- `style-src 'unsafe-inline'` is required for the runtime-computed `style`
  attributes described above. If you do not render any component that uses them,
  you may be able to drop it; verify with CSP report-only mode first.
- `img-src 'self' data:` covers `Markdown`/`Avatar` images, including the safe
  raster `data:` images the `Markdown` renderer permits. Tighten or widen the
  source list to match where your own image URLs come from.

A more detailed write-up — including CSP guidance for server-rendered apps and a
dependency license audit — is published at
<https://wire-ui.com/security>.
