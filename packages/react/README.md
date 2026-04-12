<p align="center">
  <img src="https://raw.githubusercontent.com/wire-ui/wire-ui/main/apps/docs/public/images/logo/wire-ui-logo.svg" alt="Wire UI" height="52" />
</p>

<h3 align="center">Wire UI</h3>

<p align="center">
  AI-native unstyled primitives framework. Headless, compound components with zero CSS.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@wire-ui/react"><img src="https://img.shields.io/npm/v/@wire-ui/react?style=flat-square&colorA=0a0a0a&colorB=0a0a0a" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/@wire-ui/react"><img src="https://img.shields.io/npm/dm/@wire-ui/react?style=flat-square&colorA=0a0a0a&colorB=0a0a0a" alt="npm downloads" /></a>
  <img src="https://img.shields.io/badge/react-%3E%3D19.0.0-blue?style=flat-square&colorA=0a0a0a&colorB=0a0a0a" alt="react >= 19" />
  <a href="https://github.com/wire-ui/wire-ui/blob/main/packages/react/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square&colorA=0a0a0a&colorB=0a0a0a" alt="MIT license" /></a>
</p>

---

## What is Wire UI?

Wire UI is an AI-native, headless component library. Every component ships with **zero CSS** — style everything using your own classes by targeting `data-*` attributes that reflect interactive state. AI-integrated docs with `llms.txt` and machine-readable API references make it built for AI-assisted workflows.

- **AI-native.** AI-integrated docs with `llms.txt`, machine-readable API references, and MCP server support. Built for AI-assisted development.
- **Unstyled primitives.** No colors, spacing, or fonts baked in. You own every pixel of your design.
- **Compound components.** Complex widgets follow the `Component.Part` pattern, giving you full control over markup structure and element nesting.
- **State via `data-*` attributes.** Hover, focus, pressed, disabled, open — all exposed as `data-hover`, `data-focus-visible`, `data-active`, etc.
- **`asChild` polymorphism.** Merge all behaviour onto your own element — perfect for router links, icon buttons, and custom wrappers.
- **Consumer-owned validation.** Form components expose `invalidType` and `errorMessage` but never validate internally. Your logic, your rules.

## Documentation

Full documentation with live examples is at **[wire-ui.com](https://wire-ui.com)**.

---

## Installation

```bash
npm install @wire-ui/react
```

**Peer requirements**

```json
{
  "react": ">=19.0.0",
  "react-dom": ">=19.0.0"
}
```

---

## Quick start

```tsx
import { Button } from '@wire-ui/react'

export default function App() {
  return (
    <Button
      className="
        px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium
        [data-hover]:bg-indigo-700
        [data-active]:scale-95
        [data-focus-visible]:ring-2 [data-focus-visible]:ring-indigo-500
        [data-disabled]:opacity-40 [data-disabled]:cursor-not-allowed
      "
    >
      Save changes
    </Button>
  )
}
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
| `Modal` | Dialog with portal rendering, overlay click-to-close, and Escape key |
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

```tsx
<Button className="[data-hover]:bg-blue-700 [data-active]:scale-95 [data-disabled]:opacity-50">
```

Or in plain CSS:

```css
button[data-hover]  { background: #1d4ed8; }
button[data-active] { transform: scale(0.95); }
```

### Compound components

Complex widgets follow the `Component.Part` pattern so you control the structure:

```tsx
<Input.Root value={email} onChange={setEmail} invalidType={error}>
  <Input.Label>Email</Input.Label>
  <Input.Field type="email" placeholder="you@example.com" />
  <Input.Error />
</Input.Root>
```

### `asChild` polymorphism

Pass `asChild` to merge behaviour onto your own element:

```tsx
// Renders as <a> but with all Button data attributes
<Button asChild>
  <a href="/dashboard">Go to dashboard</a>
</Button>
```

### Consumer-owned validation

Set `invalidType` to a key and the component renders the matching error message — no internal validation ever runs:

```tsx
<Input.Root
  invalidType={error}         // e.g. "required" or "email"
  errorMessage={{
    required: 'Email is required',
    email: 'Enter a valid email address',
  }}
>
  <Input.Field type="email" />
  <Input.Error />   {/* renders the matching message */}
</Input.Root>
```

---

## Hooks

### `useInteractiveState`

The same hook used internally by `Button`, `Accordion.Trigger`, and `Modal.Close` — exported for building your own interactive elements.

```tsx
import { useInteractiveState } from '@wire-ui/react'

function MyCard({ disabled }: { disabled?: boolean }) {
  const { handlers, dataAttributes } = useInteractiveState({ disabled })

  return (
    <div
      {...handlers}
      {...dataAttributes}
      className="[data-hover]:bg-gray-100 [data-active]:scale-95"
    >
      Card content
    </div>
  )
}
```

### `useClickOutside`

Fires a callback when the user clicks outside a referenced element.

```tsx
import { useRef } from 'react'
import { useClickOutside } from '@wire-ui/react'

function Popover() {
  const ref = useRef<HTMLDivElement>(null)
  useClickOutside(ref, () => setOpen(false))

  return <div ref={ref}>Popover content</div>
}
```

---

## TypeScript

All component props and utility types are exported:

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
} from '@wire-ui/react'
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
