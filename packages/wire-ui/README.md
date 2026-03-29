# wire-ui

A headless, unstyled React 19 component library. Components ship with zero CSS — style them entirely with your own classes and CSS by targeting `data-*` attributes that reflect interactive state.

## Philosophy

- **Unstyled by default.** No opinions on colors, spacing, or fonts. You own the design.
- **State via `data-*` attributes.** Interactive states are exposed as data attributes (empty string when active, absent when not), so you style with `[data-hover]`, `[data-active]`, `[data-disabled]`, etc.
- **Compound components.** Complex widgets (Modal, Input, Accordion, etc.) follow the `Component.Part` pattern — you compose the structure yourself, giving you full control over markup order and wrapping elements.
- **Controlled & uncontrolled.** Every stateful component works both ways.
- **`asChild` for polymorphism.** Pass `asChild` to Button to merge all props and data attributes onto your own child element — useful for router links, icon buttons, and custom wrappers.
- **Consumer-owned validation.** Form components expose `invalidType` and `errorMessage` props but perform no validation internally. You decide when and how to validate — set `invalidType` to the error key and the component renders the error state.

---

## Installation

```bash
npm install wire-ui
```

### Peer requirements

```json
{
  "react": ">=19.0.0",
  "react-dom": ">=19.0.0"
}
```

---

## Data attributes reference

All interactive components expose state through data attributes. Attributes are present as an **empty string** when active and **absent** when not — never `"true"` or `"false"`.

| Attribute | When present |
|---|---|
| `data-hover` | Mouse is over the element |
| `data-focus-visible` | Element has keyboard focus (mirrors `:focus-visible`) |
| `data-active` | Element is being pressed (pointer down or Space/Enter held) |
| `data-disabled` | Element is disabled |
| `data-autofocus` | Element was rendered with `autoFocus` |
| `data-state` | Open/closed, checked/unchecked — varies per component |
| `data-invalid` | Form field is in an invalid state (consumer-controlled via `invalidType`) |
| `data-success` | Form field is in a success state (consumer-controlled via `isSuccess`) |

---

## Components

### Button

A native `<button>` with interactive state tracking. Use `asChild` to render as any element.

```tsx
import { Button } from 'wire-ui'

// Default button
<Button onClick={() => console.log('clicked')}>
  Save changes
</Button>

// Disabled
<Button disabled>Unavailable</Button>

// Submit inside a form
<Button type="submit">Submit</Button>

// Render as a router link (asChild)
<Button asChild>
  <a href="/dashboard">Go to dashboard</a>
</Button>

// Style with Tailwind using data attributes
<Button className="
  px-4 py-2 rounded bg-blue-600 text-white
  [data-hover]:bg-blue-700
  [data-active]:scale-95
  [data-focus-visible]:ring-2
  [data-disabled]:opacity-50 [data-disabled]:cursor-not-allowed
">
  Styled button
</Button>
```

**Props:** All standard `ButtonHTMLAttributes` plus `asChild?: boolean`.

---

### Input

Compound component for text inputs. Validation is entirely consumer-controlled — set `invalidType` to trigger the error state.

```tsx
import { Input } from 'wire-ui'

// Uncontrolled
<Input.Root>
  <Input.Label>Username</Input.Label>
  <Input.Field placeholder="Enter username" />
</Input.Root>

// Controlled
const [value, setValue] = useState('')

<Input.Root value={value} onChange={setValue}>
  <Input.Label>Email</Input.Label>
  <Input.Field type="email" placeholder="you@example.com" />
</Input.Root>

// With consumer-controlled error state
const [invalidType, setInvalidType] = useState('')

function handleSubmit() {
  if (!value) setInvalidType('required')
  else if (!value.includes('@')) setInvalidType('email')
  else setInvalidType('')
}

<Input.Root
  value={value}
  onChange={setValue}
  invalidType={invalidType}
  isRequired
  errorMessage={{
    required: 'Email is required',
    email: 'Enter a valid email address',
  }}
>
  <Input.Label>Email</Input.Label>
  <Input.Field type="email" placeholder="you@example.com" />
  <Input.Error />
</Input.Root>
```

**Root props:** `value`, `defaultValue`, `onChange(value: string)`, `onFocus`, `onBlur`, `isRequired`, `isSuccess`, `invalidType` (key into `errorMessage`), `errorMessage` (record of error key → message string), `id`.

**Field data attributes:** `data-active` (focused), `data-invalid` (when `invalidType` is set), `data-success` (when `isSuccess` is true). `aria-invalid` is also set when invalid.

---

### Textarea

Same API as Input, but renders a `<textarea>`. Validation is consumer-controlled via `invalidType`.

```tsx
import { Textarea } from 'wire-ui'

// Basic usage
<Textarea.Root>
  <Textarea.Label>Message</Textarea.Label>
  <Textarea.Field placeholder="Write something..." rows={4} />
</Textarea.Root>

// With consumer-controlled error
<Textarea.Root
  invalidType={invalidType}
  errorMessage={{ required: 'Message is required' }}
>
  <Textarea.Label>Message</Textarea.Label>
  <Textarea.Field placeholder="Write something..." rows={4} />
  <Textarea.Error />
</Textarea.Root>
```

---

### Password

Input compound component with a built-in show/hide toggle. Validation is consumer-controlled via `invalidType`.

```tsx
import { Password } from 'wire-ui'

// Basic usage
<Password.Root>
  <Password.Label>Password</Password.Label>
  <Password.Field placeholder="••••••••" />
  <Password.Toggle />
</Password.Root>

// With consumer-controlled error
<Password.Root
  invalidType={invalidType}
  errorMessage={{ required: 'Password is required' }}
>
  <Password.Label>Password</Password.Label>
  <Password.Field placeholder="••••••••" />
  <Password.Toggle />
  <Password.Error />
</Password.Root>
```

**Toggle data attribute:** `data-visible` — present when the password is visible.

---

### Modal

Compound modal dialog with portal rendering, overlay click to close, and Escape key support.

```tsx
import { Modal } from 'wire-ui'

// Uncontrolled
<Modal.Root defaultOpen>
  <Modal.Portal>
    <Modal.Overlay className="fixed inset-0 bg-black/50">
      <Modal.Content className="...">
        <h2>Confirm action</h2>
        <p>Are you sure?</p>
        <Modal.Close>Cancel</Modal.Close>
      </Modal.Content>
    </Modal.Overlay>
  </Modal.Portal>
</Modal.Root>

// Controlled
const [open, setOpen] = useState(false)

<Modal.Root open={open} onOpenChange={setOpen}>
  <Modal.Portal>
    <Modal.Overlay>
      <Modal.Content>...</Modal.Content>
    </Modal.Overlay>
  </Modal.Portal>
</Modal.Root>
```

**Content:** renders as `role="dialog"` with `aria-modal="true"`. **data-state:** `"open"` or `"closed"` on Overlay and Content.

---

### Drawer

Same structure as Modal, designed for side panels. Includes an optional Header sub-component.

```tsx
import { Drawer } from 'wire-ui'

<Drawer.Root open={open} onOpenChange={setOpen}>
  <Drawer.Portal>
    <Drawer.Overlay className="fixed inset-0 bg-black/40">
      <Drawer.Content className="fixed right-0 top-0 h-full w-80 bg-white">
        <Drawer.Header>
          <h2>Settings</h2>
          <Drawer.Close>✕</Drawer.Close>
        </Drawer.Header>
        <p>Drawer body content</p>
      </Drawer.Content>
    </Drawer.Overlay>
  </Drawer.Portal>
</Drawer.Root>
```

---

### Accordion

Collapsible sections. Supports `single` (one item open at a time) and `multiple` (many open at once).

```tsx
import { Accordion } from 'wire-ui'

// Single — collapsible
<Accordion.Root type="single" collapsible defaultValue="item-1">
  <Accordion.Item value="item-1">
    <Accordion.Trigger>Section 1</Accordion.Trigger>
    <Accordion.Content>Content for section 1</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Trigger>Section 2</Accordion.Trigger>
    <Accordion.Content>Content for section 2</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>

// Multiple
<Accordion.Root type="multiple" defaultValue={['item-1', 'item-2']}>
  ...
</Accordion.Root>
```

**Root props (single):** `type: 'single'`, `value`, `defaultValue`, `onChange(value: string)`, `collapsible`, `disabled`.

**Root props (multiple):** `type: 'multiple'`, `value: string[]`, `defaultValue: string[]`, `onChange(value: string[])`, `disabled`.

**Item data attributes:** `data-state` (`"open"` / `"closed"`), `data-disabled`. **Trigger:** `aria-expanded`.

---

### Dropdown

A trigger + menu pattern with keyboard and click-outside support.

```tsx
import { Dropdown } from 'wire-ui'

<Dropdown.Root>
  <Dropdown.Trigger>Options ▾</Dropdown.Trigger>
  <Dropdown.Menu>
    <button onClick={() => {}}>Edit</button>
    <button onClick={() => {}}>Delete</button>
  </Dropdown.Menu>
</Dropdown.Root>
```

**Root props:** `open`, `defaultOpen`, `onOpenChange(open: boolean)`, `placement` (`'bottom-start' | 'bottom-end' | ...`).

**Trigger:** sets `aria-expanded`. **Menu data-state:** `"open"` or `"closed"`.

---

### Tooltip

Hover/focus tooltip with configurable delay and side.

```tsx
import { Tooltip } from 'wire-ui'

<Tooltip.Root delayDuration={200}>
  <Tooltip.Trigger>
    <button>Hover me</button>
  </Tooltip.Trigger>
  <Tooltip.Content side="top" className="bg-gray-900 text-white text-sm px-2 py-1 rounded">
    This is a tooltip
  </Tooltip.Content>
</Tooltip.Root>
```

**Root props:** `open`, `defaultOpen`, `onOpenChange`, `delayDuration` (ms, default `300`).

**Content props:** `side` (`'top' | 'bottom' | 'left' | 'right'`, default `'top'`). **Content data attributes:** `data-state` (`"open"` / `"closed"`), `data-side`.

---

### Select

Accessible select menu with groups, separators, and a custom trigger.

```tsx
import { Select } from 'wire-ui'

<Select.Root value={value} onValueChange={setValue}>
  <Select.Trigger>
    <Select.Value placeholder="Pick a fruit" />
  </Select.Trigger>
  <Select.Content>
    <Select.Group>
      <Select.GroupLabel>Fruits</Select.GroupLabel>
      <Select.Item value="apple">Apple</Select.Item>
      <Select.Item value="banana">Banana</Select.Item>
    </Select.Group>
    <Select.Separator />
    <Select.Item value="other">Other</Select.Item>
  </Select.Content>
</Select.Root>
```

---

### Checkbox

Group and individual checkbox items.

```tsx
import { Checkbox } from 'wire-ui'

<Checkbox.Root value={checked} onChange={setChecked}>
  <Checkbox.Item value="newsletters">
    <Checkbox.Indicator>✓</Checkbox.Indicator>
    <Checkbox.Label>Subscribe to newsletters</Checkbox.Label>
  </Checkbox.Item>
  <Checkbox.Item value="updates">
    <Checkbox.Indicator>✓</Checkbox.Indicator>
    <Checkbox.Label>Product updates</Checkbox.Label>
  </Checkbox.Item>
</Checkbox.Root>
```

**Root props:** `value: (string | number)[]`, `onChange`.

---

### Radio

Single-selection radio group.

```tsx
import { Radio } from 'wire-ui'

<Radio.Root value={selected} onChange={setSelected} name="plan">
  <Radio.Item value="starter">
    <Radio.Indicator />
    <Radio.Label>Starter</Radio.Label>
  </Radio.Item>
  <Radio.Item value="pro">
    <Radio.Indicator />
    <Radio.Label>Pro</Radio.Label>
  </Radio.Item>
</Radio.Root>
```

---

### Switch

Toggle on/off with a thumb element.

```tsx
import { Switch } from 'wire-ui'

<Switch.Root checked={on} onCheckedChange={setOn}>
  <Switch.Thumb />
</Switch.Root>
```

**Root data attributes:** `data-state` (`"checked"` / `"unchecked"`), `data-disabled`.

---

### OTP

One-time password input with individual slots and optional separators.

```tsx
import { OTP } from 'wire-ui'

<OTP.Root length={6} onComplete={(code) => console.log(code)}>
  <OTP.Slot index={0} />
  <OTP.Slot index={1} />
  <OTP.Slot index={2} />
  <OTP.Separator />
  <OTP.Slot index={3} />
  <OTP.Slot index={4} />
  <OTP.Slot index={5} />
</OTP.Root>
```

**Root props:** `length`, `value`, `defaultValue`, `onChange`, `onComplete`, `disabled`, `alphanumeric`.

**Root data attributes:** `data-complete` when all slots are filled.

---

### Search

Search input with a dropdown results list, keyboard navigation, and loading state.

```tsx
import { Search } from 'wire-ui'
import type { SearchOption } from 'wire-ui'

const options: SearchOption[] = [
  { id: 'react', title: 'React' },
  { id: 'vue', title: 'Vue' },
  { id: 'svelte', title: 'Svelte' },
]

<Search.Root onSearchChange={setQuery} onSelect={(opt) => console.log(opt)} loading={isLoading}>
  <Search.Input placeholder="Search frameworks..." />
  <Search.Content>
    {options.map((opt) => (
      <Search.Item key={opt.id} option={opt}>
        {opt.title}
      </Search.Item>
    ))}
    <Search.Empty>No results found</Search.Empty>
  </Search.Content>
</Search.Root>
```

**SearchOption:** `{ id: string | number; title: string; subtitle?: string }`.

**Root data attributes:** `data-loading` when `loading={true}`.

---

### Alert

Dismissible alert with auto-dismiss support.

```tsx
import { Alert } from 'wire-ui'

<Alert.Root
  data-status="warning"
  isAutoDismissable
  dismissDuration={5000}
  onDismiss={() => console.log('dismissed')}
>
  <Alert.Title>Heads up</Alert.Title>
  <Alert.Description>Your session expires in 5 minutes.</Alert.Description>
  <Alert.Dismiss>✕</Alert.Dismiss>
</Alert.Root>
```

---

### Avatar

Image with a fallback for loading errors or missing sources.

```tsx
import { Avatar } from 'wire-ui'

<Avatar.Root>
  <Avatar.Image src="https://example.com/avatar.jpg" alt="User avatar" />
  <Avatar.Fallback>JD</Avatar.Fallback>
</Avatar.Root>
```

**Image data attribute:** `data-status` (`"loading"` / `"loaded"` / `"error"`). Fallback is shown when status is `"error"` or src is empty.

---

### Badge

Numeric count badge, capped at 9+.

```tsx
import { Badge } from 'wire-ui'

<Badge count={3} />       // renders "3"
<Badge count={12} />      // renders "9+"
<Badge count={0} />       // renders nothing (count ≤ 0)
```

**data-count** always holds the raw numeric value.

---

### Card

A simple container element with optional color and size variants.

```tsx
import { Card } from 'wire-ui'

<Card data-color="blue" data-size="large" className="p-4 rounded shadow">
  Card content
</Card>
```

---

### Divider

Horizontal or vertical separator line.

```tsx
import { Divider } from 'wire-ui'

// Decorative (default)
<Divider />

// Semantic separator
<Divider decorative={false} aria-label="Section break" />

// Vertical
<Divider orientation="vertical" />
```

---

### Icon

Renders an SVG from a consumer-supplied icon map. The library ships no SVG assets.

```tsx
import { Icon } from 'wire-ui'

// Bring your own SVG strings
const icons = {
  home: '<svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>',
}

// Decorative (aria-hidden by default)
<Icon type="home" icons={icons} size="medium" />

// Accessible
<Icon type="home" icons={icons} label="Go home" />
```

**Sizes:** `'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge'`.

---

### Image

Image with a loader placeholder shown until the image loads.

```tsx
import { Image } from 'wire-ui'

<Image src="/photo.jpg" alt="A photo" position="center" className="rounded" />
```

**Wrapper data attributes:** `data-position`. **Img data attribute:** `data-loaded` after a successful load event.

---

### List

Ordered or unordered list with optional striped rows and dividers.

```tsx
import { List } from 'wire-ui'

<List data-type="disc" data-striped data-divider data-size="medium">
  <li>Item one</li>
  <li>Item two</li>
  <li>Item three</li>
</List>

// Ordered
<List isOrdered>
  <li>First</li>
  <li>Second</li>
</List>
```

---

### ProgressBar

Accessible progress indicator.

```tsx
import { ProgressBar } from 'wire-ui'

<ProgressBar value={65} min={0} max={100} data-size="medium" />
```

Renders `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`. The inner fill div width is set via inline style.

---

### Rating

Star rating with hover preview, controlled and read-only modes.

```tsx
import { Rating } from 'wire-ui'

// Interactive
<Rating defaultValue={3} max={5} onChange={(v) => console.log(v)} />

// Controlled
<Rating value={rating} onChange={setRating} />

// Read-only (renders as img role)
<Rating value={4} readOnly />

// Disabled
<Rating value={2} disabled />
```

---

### Spinner

Animated loading indicator.

```tsx
import { Spinner } from 'wire-ui'

<Spinner />
<Spinner size="large" />
<Spinner size="small" color="#6366f1" />
```

**Sizes:** `'small' | 'medium' | 'large'` (default `'medium'`). **Color** sets the `--spinner-color` CSS variable. Renders `role="status"` with `aria-label="Loading"`.

---

### Timeago

Relative or formatted timestamp that updates live.

```tsx
import { Timeago } from 'wire-ui'

// Live relative time ("5 minutes ago", "2 hours ago")
<Timeago datetime={new Date()} isDuration />

// Formatted date/time
<Timeago datetime="2025-06-15T09:00:00" />

// Time only ("09:00")
<Timeago datetime={new Date()} timeOnly />
```

**Props:** `datetime: Date | string | number`, `isDuration?: boolean`, `timeOnly?: boolean`, `className?: string`.

---

## Hooks

### `useInteractiveState`

Tracks hover, keyboard focus, and press state for any element. The same hook used internally by Button, Accordion.Trigger, and Modal.Close — exported for building your own interactive components.

```tsx
import { useInteractiveState } from 'wire-ui'

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

**Returns:**
- `handlers` — event handlers to spread onto the element
- `dataAttributes` — `data-hover`, `data-focus-visible`, `data-active`, `data-disabled`
- `isHovered`, `isFocusVisible`, `isActive` — raw booleans for programmatic use

---

### `useClickOutside`

Fires a callback when the user clicks outside a referenced element.

```tsx
import { useRef } from 'react'
import { useClickOutside } from 'wire-ui'

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
  IconName,
  IconSize,
  Size,
  Status,
  InteractiveStateOptions,
  InteractiveStateResult,
} from 'wire-ui'
```

---

## Development

```bash
# Install dependencies
npm install

# Run Storybook
npm run storybook

# Run unit tests (watch mode)
npm test

# Run unit tests once
npm run test:run

# Run tests with coverage
npm run test:coverage

# Type check + build library
npm run build

# Lint
npm run lint

# Format
npm run format
```
