<p align="center">
  <img src="./apps/docs/public/images/logo/wire-ui-logo.svg" alt="Wire UI" height="48" />
</p>

<h3 align="center">Wire UI</h3>

<p align="center">
  AI-native unstyled primitives framework. Headless, compound components with zero CSS.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@wire-ui/react"><img src="https://img.shields.io/npm/v/@wire-ui/react?style=flat-square&colorA=0a0a0a&colorB=0a0a0a" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/@wire-ui/react"><img src="https://img.shields.io/npm/dm/@wire-ui/react?style=flat-square&colorA=0a0a0a&colorB=0a0a0a" alt="npm downloads" /></a>
  <a href="https://github.com/wire-ui/wire-ui/blob/main/packages/react/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square&colorA=0a0a0a&colorB=0a0a0a" alt="MIT license" /></a>
  <img src="https://img.shields.io/badge/react-%3E%3D19.0.0-blue?style=flat-square&colorA=0a0a0a&colorB=0a0a0a" alt="react >= 19" />
</p>

---

## Overview

Wire UI is an AI-native, headless component library. Every component ships with **zero CSS** — interactive states are exposed through `data-*` attributes so you style them exactly the way you want, using Tailwind, CSS Modules, plain CSS, or any other approach. AI-integrated docs with `llms.txt` and machine-readable API references make it built for AI-assisted workflows.

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

| Package                              | Version                                                                                                               | Description                                     |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| [`@wire-ui/react`](./packages/react) | [![npm](https://img.shields.io/npm/v/@wire-ui/react?style=flat-square)](https://www.npmjs.com/package/@wire-ui/react) | AI-native unstyled component library (React 19) |
| [`@wire-ui/vue`](./packages/vue)     | [![npm](https://img.shields.io/npm/v/@wire-ui/vue?style=flat-square)](https://www.npmjs.com/package/@wire-ui/vue)     | AI-native unstyled component library (Vue 3)    |

## Repository structure

```
wire-ui/
├── apps/
│   └── docs/          # Nextra v4 documentation site
└── packages/
    ├── react/         # @wire-ui/react — React 19 component library
    ├── vue/           # @wire-ui/vue — Vue 3 component library
    └── mcp/           # @wire-ui/mcp — MCP server for AI integration
```

## Documentation

Full documentation is available at [wire-ui.com](https://wire-ui.com).

## Community

- Follow on X: [@wireuijs](https://x.com/wireuijs)

## Authors

- Jerald Austero ([@jaoaustero](https://github.com/jaoaustero))

## Contributing

See the [contributing guide](./CONTRIBUTING.md) for local development instructions and pull request guidelines.

## License

MIT License © 2025 Wire UI. See [LICENSE](./packages/react/LICENSE) for details.
