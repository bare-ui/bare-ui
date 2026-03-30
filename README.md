<p align="center">
  <img src="./apps/docs/public/images/logo/wire-ui-logo.svg" alt="Wire UI" height="48" />
</p>

<h3 align="center">Wire UI</h3>

<p align="center">
  Headless, unstyled React 19 primitives. Style everything with your own CSS.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@wire-ui/react"><img src="https://img.shields.io/npm/v/@wire-ui/react?style=flat-square&colorA=0a0a0a&colorB=0a0a0a" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/@wire-ui/react"><img src="https://img.shields.io/npm/dm/@wire-ui/react?style=flat-square&colorA=0a0a0a&colorB=0a0a0a" alt="npm downloads" /></a>
  <a href="https://github.com/wire-ui/wire-ui/blob/main/packages/wire-ui/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square&colorA=0a0a0a&colorB=0a0a0a" alt="MIT license" /></a>
  <img src="https://img.shields.io/badge/react-%3E%3D19.0.0-blue?style=flat-square&colorA=0a0a0a&colorB=0a0a0a" alt="react >= 19" />
</p>

---

## Overview

Wire UI is a headless component library for React 19. Every component ships with **zero CSS** — interactive states are exposed through `data-*` attributes so you style them exactly the way you want, using Tailwind, CSS Modules, plain CSS, or any other approach.

```tsx
<Button
  className="px-4 py-2 rounded-lg bg-indigo-600 text-white
    [data-hover]:bg-indigo-700
    [data-active]:scale-95
    [data-focus-visible]:ring-2 [data-focus-visible]:ring-indigo-500
    [data-disabled]:opacity-40 [data-disabled]:cursor-not-allowed"
>
  Save changes
</Button>
```

## Packages

| Package | Version | Description |
|---|---|---|
| [`@wire-ui/react`](./packages/wire-ui) | [![npm](https://img.shields.io/npm/v/@wire-ui/react?style=flat-square)](https://www.npmjs.com/package/@wire-ui/react) | React 19 component library |

## Repository structure

```
wire-ui/
├── apps/
│   └── docs/          # Nextra v4 documentation site
└── packages/
    └── wire-ui/       # @wire-ui/react — the npm package
```

## Documentation

Full documentation is available at [wire-ui.com](https://wire-ui.com).

## Authors

- Jerald Austero ([@jaoaustero](https://github.com/jaoaustero))

## Contributing

See the [contributing guide](./CONTRIBUTING.md) for local development instructions and pull request guidelines.

## License

MIT License © 2025 Wire UI. See [LICENSE](./packages/wire-ui/LICENSE) for details.
