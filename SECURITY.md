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
  event handlers, no network requests, fonts, or images. Compatible with a
  strict Content Security Policy (`script-src 'self'`).
- **XSS-safe by default.** Component output is rendered through the framework's
  normal escaping. `Markdown` and `CodeBlock` never inject raw HTML, and the
  built-in `Markdown`/`Citation` URL renderers strip dangerous schemes
  (`javascript:`, `vbscript:`, unsafe `data:`, `file:`) before they reach an
  `href`/`src`.
- **One opt-in raw-HTML path.** `Icon` renders the SVG strings supplied in its
  `icons` map via `dangerouslySetInnerHTML` (and framework equivalents). These
  must be **trusted, author-controlled** assets — never built from user input.
  Sanitize user-supplied SVG with a dedicated tool (e.g. DOMPurify) first.

A more detailed write-up — including CSP guidance for server-rendered apps and a
dependency license audit — is published at
<https://wire-ui.com/security>.
