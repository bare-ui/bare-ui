<p align="center">
  <img src="https://raw.githubusercontent.com/wire-ui/wire-ui/main/apps/docs/public/images/logo/wire-ui-logo.svg" alt="Wire UI" height="52" />
</p>

<h3 align="center">Wire UI</h3>

<p align="center">
  AI-native unstyled primitives framework. Headless, compound components with zero CSS.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@wire-ui/vue"><img src="https://img.shields.io/npm/v/@wire-ui/vue?style=flat-square&colorA=0a0a0a&colorB=0a0a0a" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/@wire-ui/vue"><img src="https://img.shields.io/npm/dm/@wire-ui/vue?style=flat-square&colorA=0a0a0a&colorB=0a0a0a" alt="npm downloads" /></a>
  <img src="https://img.shields.io/badge/vue-%3E%3D3.5.0-blue?style=flat-square&colorA=0a0a0a&colorB=0a0a0a" alt="vue >= 3.5" />
  <a href="https://github.com/wire-ui/wire-ui/blob/main/packages/vue/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square&colorA=0a0a0a&colorB=0a0a0a" alt="MIT license" /></a>
</p>

---

## What is Wire UI?

Wire UI is an AI-native, headless component library. Every component ships with **zero CSS** — style everything using your own classes by targeting `data-*` attributes that reflect interactive state. AI-integrated docs with `llms.txt` and machine-readable API references make it built for AI-assisted workflows.

- **AI-native.** AI-integrated docs with `llms.txt`, machine-readable API references, and MCP server support. Built for AI-assisted development.
- **Unstyled primitives.** No colors, spacing, or fonts baked in. You own every pixel of your design.
- **Compound components.** Complex widgets use provide/inject with named sub-components, giving you full control over markup structure and element nesting.
- **State via `data-*` attributes.** Hover, focus, pressed, disabled, open — all exposed as `data-hover`, `data-focus-visible`, `data-active`, etc.
- **`asChild` polymorphism.** Merge all behaviour onto your own element — perfect for router links, icon buttons, and custom wrappers.
- **Consumer-owned validation.** Form components expose `invalidType` and `errorMessage` but never validate internally. Your logic, your rules.

## Documentation

Full documentation with live examples is at **[wire-ui.com](https://wire-ui.com)**.

---

## Installation

```bash
npm install @wire-ui/vue
```

**Peer requirements**

```json
{
  "vue": ">=3.5.0"
}
```

---

## Quick start

```vue
<script setup>
import { Button } from '@wire-ui/vue'
</script>

<template>
  <Button
    class="
      px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium
      [data-hover]:bg-indigo-700
      [data-active]:scale-95
      [data-focus-visible]:ring-2 [data-focus-visible]:ring-indigo-500
      [data-disabled]:opacity-40 [data-disabled]:cursor-not-allowed
    "
  >
    Save changes
  </Button>
</template>
```

---

## Components

### Form inputs

| Component | Description |
|---|---|
| `Input` | Text input with label, error, and success states |
| `Textarea` | Multi-line input with the same compound API as Input |
| `Password` | Input with a built-in show/hide toggle |
| `Checkbox` | Group and individual checkbox items |
| `Radio` | Single-selection radio group |
| `Switch` | Toggle on/off with a thumb element |
| `OTP` | One-time password input with individual slots |
| `Select` | Accessible select menu with groups and separators |
| `Search` | Search input with keyboard-navigable results list |

### Overlay & dialog

| Component | Description |
|---|---|
| `Modal` | Dialog with Teleport rendering, overlay click-to-close, and Escape key |
| `Drawer` | Side-panel dialog — same structure as Modal |
| `Dropdown` | Trigger + floating menu with click-outside support |
| `Tooltip` | Hover/focus tooltip with configurable delay and side |

### Layout & navigation

| Component | Description |
|---|---|
| `Accordion` | Collapsible sections — `single` or `multiple` open mode |
| `Divider` | Horizontal or vertical separator |

### Display

| Component | Description |
|---|---|
| `Alert` | Dismissible alert with optional auto-dismiss |
| `Avatar` | Image with a text/initial fallback |
| `Badge` | Numeric count badge, capped at 9+ |
| `Card` | Container with optional color and size variants |
| `Icon` | SVG renderer from a consumer-supplied icon map |
| `Image` | Image with a loading placeholder |
| `List` | Ordered/unordered list with optional dividers and striping |
| `ProgressBar` | Accessible progress indicator |
| `Rating` | Interactive or read-only star rating |
| `Timeago` | Relative or formatted timestamp that updates live |

---

## Key concepts

### Data attributes

Attributes are present as an **empty string** when active, and **absent** when not — never `"true"` or `"false"`.

| Attribute | When present |
|---|---|
| `data-hover` | Mouse is over the element |
| `data-focus-visible` | Keyboard focus (mirrors `:focus-visible`) |
| `data-active` | Element is being pressed |
| `data-disabled` | Element is disabled |
| `data-state` | Open/closed, checked/unchecked — varies per component |
| `data-invalid` | Consumer-controlled via `invalidType` |
| `data-success` | Consumer-controlled via `isSuccess` |

Style them in Tailwind:

```vue
<Button class="[data-hover]:bg-blue-700 [data-active]:scale-95 [data-disabled]:opacity-50">
```

Or in plain CSS:

```css
button[data-hover]  { background: #1d4ed8; }
button[data-active] { transform: scale(0.95); }
```

### Compound components

Complex widgets use named sub-components with provide/inject so you control the structure:

```vue
<InputRoot v-model="email" :invalid-type="error">
  <InputLabel>Email</InputLabel>
  <InputField type="email" placeholder="you@example.com" />
  <InputError />
</InputRoot>
```

### `asChild` polymorphism

Pass `asChild` to merge behaviour onto your own element:

```vue
<!-- Renders as <a> but with all Button data attributes -->
<Button asChild>
  <a href="/dashboard">Go to dashboard</a>
</Button>
```

### Consumer-owned validation

Set `invalidType` to a key and the component renders the matching error message — no internal validation ever runs:

```vue
<InputRoot
  :invalid-type="error"
  :error-message="{
    required: 'Email is required',
    email: 'Enter a valid email address',
  }"
>
  <InputField type="email" />
  <InputError />
</InputRoot>
```

---

## Composables

### `useInteractiveState`

The same composable used internally by `Button`, `AccordionTrigger`, and `ModalClose` — exported for building your own interactive elements.

```vue
<script setup>
import { useInteractiveState } from '@wire-ui/vue'

const props = defineProps<{ disabled?: boolean }>()
const { attrs, handlers } = useInteractiveState({ disabled: props.disabled })
</script>

<template>
  <div
    v-bind="attrs"
    v-on="handlers"
    class="[data-hover]:bg-gray-100 [data-active]:scale-95"
  >
    Card content
  </div>
</template>
```

### `useClickOutside`

Fires a callback when the user clicks outside a referenced element.

```vue
<script setup>
import { ref } from 'vue'
import { useClickOutside } from '@wire-ui/vue'

const popoverRef = ref<HTMLDivElement | null>(null)
useClickOutside(popoverRef, () => { open.value = false })
</script>

<template>
  <div ref="popoverRef">Popover content</div>
</template>
```

---

## TypeScript

All component props and composable types are exported:

```ts
import type {
  ButtonProps,
  InputRootProps,
  TextareaRootProps,
  PasswordRootProps,
  ModalRootProps,
  AccordionRootProps,
  SearchOption,
  IconSize,
  Size,
  Status,
  InteractiveStateOptions,
  InteractiveStateResult,
} from '@wire-ui/vue'
```

---

## Development

```bash
# Install dependencies (from monorepo root)
npm install

# Run Storybook
npm run storybook

# Unit tests (watch mode)
npm test

# Unit tests (single run)
npm run test:run

# Unit tests with coverage
npm run test:coverage

# Type check + build
npm run build

# Lint
npm run lint

# Format
npm run format
```

---

## Community

- Follow on X: [@wireuijs](https://x.com/wireuijs)

## Authors

- Jerald Austero ([@jaoaustero](https://github.com/jaoaustero))

---

## Contributing

See the [contributing guide](../../CONTRIBUTING.md) for local development instructions and pull request guidelines.

## License

MIT License © 2025 Wire UI. See [LICENSE](./LICENSE) for details.
