<p align="center">
  <img src="https://raw.githubusercontent.com/wire-ui/wire-ui/main/apps/docs/public/images/logo/wire-ui-logo.svg" alt="Wire UI" height="52" />
</p>

<h3 align="center">Wire UI — SolidJS</h3>

<p align="center">
  AI-native unstyled primitives framework. Headless, compound components with zero CSS.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@wire-ui/solid"><img src="https://img.shields.io/npm/v/@wire-ui/solid?style=flat-square&colorA=0a0a0a&colorB=0a0a0a" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/@wire-ui/solid"><img src="https://img.shields.io/npm/dm/@wire-ui/solid?style=flat-square&colorA=0a0a0a&colorB=0a0a0a" alt="npm downloads" /></a>
  <img src="https://img.shields.io/badge/solid--js-%3E%3D1.9.0-blue?style=flat-square&colorA=0a0a0a&colorB=0a0a0a" alt="solid-js >= 1.9" />
  <a href="https://github.com/wire-ui/wire-ui/blob/main/packages/solid/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square&colorA=0a0a0a&colorB=0a0a0a" alt="MIT license" /></a>
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

> **Solid edition.** This is the SolidJS port of `@wire-ui/react`, targeting **Solid 1.9**. Behaviour and data-attribute APIs match the React package exactly. See the [Solid-specific notes](#solid-specific-notes) below for the small idiomatic differences.

## Documentation

Full documentation with live examples is at **[wire-ui.com](https://wire-ui.com)**.

---

## Installation

```bash
npm install @wire-ui/solid
```

**Peer requirement**

```json
{
  "solid-js": ">=1.9.0"
}
```

---

## Quick start

```tsx
import { Button } from '@wire-ui/solid'

export default function App() {
  return (
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
<Button class="[data-hover]:bg-blue-700 [data-active]:scale-95 [data-disabled]:opacity-50">
```

Or in plain CSS:

```css
button[data-hover]  { background: #1d4ed8; }
button[data-active] { transform: scale(0.95); }
```

### Compound components

Complex widgets follow the `Component.Part` pattern so you control the structure:

```tsx
import { createSignal } from 'solid-js'
import { Input } from '@wire-ui/solid'

function EmailField() {
  const [email, setEmail] = createSignal('')
  const [error, setError] = createSignal('')

  return (
    <Input.Root value={email()} onChange={setEmail} invalidType={error()}>
      <Input.Label>Email</Input.Label>
      <Input.Field type="email" placeholder="you@example.com" />
      <Input.Error />
    </Input.Root>
  )
}
```

### `asChild` polymorphism

Pass `asChild` to merge behaviour onto your own element. The component evaluates the child to a DOM node and applies its `data-*` attributes and event listeners imperatively, so the child element renders as-is:

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
  invalidType={error()}            // e.g. "required" or "email"
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

## Primitives

### `createInteractiveState`

The same primitive used internally by `Button`, `Accordion.Trigger`, `Modal.Close`, and the rest — exported for building your own interactive elements. Pass an options object with a `disabled` getter to keep the value reactive:

```tsx
import { createInteractiveState } from '@wire-ui/solid'

function MyCard(props: { disabled?: boolean }) {
  const state = createInteractiveState({
    get disabled() { return !!props.disabled },
  })

  return (
    <div
      {...state.handlers}
      {...state.dataAttributes}
      class="[data-hover]:bg-gray-100 [data-active]:scale-95"
    >
      Card content
    </div>
  )
}
```

### `createClickOutside`

Fires a callback when the user clicks outside a referenced element. Pass a getter accessor so the listener picks up ref changes:

```tsx
import { createSignal } from 'solid-js'
import { createClickOutside } from '@wire-ui/solid'

function Popover() {
  const [, setOpen] = createSignal(true)
  let rootEl: HTMLDivElement | undefined

  createClickOutside(() => rootEl, () => setOpen(false))

  return <div ref={rootEl}>Popover content</div>
}
```

---

## Solid-specific notes

`@wire-ui/solid` mirrors the React package's behaviour and data-attribute API exactly. The differences are idiomatic to Solid:

- **`class`, not `className`.** Solid uses the native HTML `class` attribute throughout.
- **`createSignal` over `useState`.** Same controlled/uncontrolled pattern, just with accessors.
- **Primitives instead of hooks.** `useInteractiveState` → `createInteractiveState`, `useClickOutside` → `createClickOutside`.
- **No `forwardRef`.** Refs are passed as plain props or callbacks in Solid 1.x.
- **`Show` / `For` instead of conditional / array rendering.** Necessary because Solid components run once at setup time.
- **`Portal` from `solid-js/web`.** Used internally by Modal and Drawer in place of `react-dom`'s `createPortal`.
- **Reactive options.** Where React passes plain values (e.g. `useInteractiveState({ disabled })`), the Solid equivalent expects either a static value or an object with a `get disabled()` getter so reactivity is preserved.

Targets **Solid 1.9** — Solid 2.0 is in beta as of March 2026; this package will track the 1.x line until 2.0 stabilises and a 2.x release lands.

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
  IconName,
  IconSize,
  Size,
  Status,
  InteractiveStateOptions,
  InteractiveStateResult,
} from '@wire-ui/solid'
```

---

## Accessibility

Accessibility is verified in three layers, from static markup to real assistive technology:

1. **Static audit (axe-core).** Every Storybook story is rendered in a real browser and run
   through axe-core via `@storybook/addon-a11y` (`a11y.test = 'error'`). This fails the build on
   any invalid ARIA, missing required parent/child roles, or other static violations.
   Run with `npm run test:a11y`. Because the library ships zero CSS, `color-contrast` is the
   consumer's responsibility and is disabled in the audit.

2. **Screen-reader semantics (`*.sr.test.tsx`).** axe proves the markup is _valid_; these tests
   prove it _says the right thing_ to a screen reader — the part axe cannot check. Each
   interactive component has a `<Component>.sr.test.tsx` suite asserting the things VoiceOver,
   NVDA, and JAWS actually convey:

   - the computed **accessible name** a control is announced by,
   - the **role** it is exposed as,
   - ARIA **state** (expanded / selected / checked / pressed / current / disabled) and that it
     **transitions** on interaction,
   - exposed **relationships** (`aria-labelledby` / `describedby` / `controls` / `activedescendant`),
   - **live-region** announcements when content changes without focus moving (toasts, alerts,
     status, async results),
   - **focus management** for overlays (focus moves into a dialog on open, returns to the trigger
     on close).

   These run in the fast jsdom unit project. Run just this layer with `npm run test:sr`. Shared
   assertions live in [`src/test/sr.ts`](src/test/sr.ts) (`expectExposedAs`, `expectAnnounced`,
   `liveRegionText`, `accessibleNameVia`).

3. **Manual screen-reader pass.** Layers 1–2 make the manual pass repeatable and guard against
   regressions, but they are not a substitute for it. Before a release, smoke-test the primary
   flows with **VoiceOver (Safari)**, **NVDA (Firefox/Chrome)**, and **JAWS** — the `*.sr.test.tsx`
   files document the expected announcements to check against.

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

# Screen-reader semantics tests (accessible name/role/state/live regions)
npm run test:sr

# Accessibility audit (axe-core over every story)
npm run test:a11y

# Type check
npm run typecheck

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

MIT License © 2026 Wire UI. See [LICENSE](./LICENSE) for details.
