---
name: wire-ui
description: AI-native unstyled primitives framework. Headless, compound components with zero CSS.
version: 0.1.6
tags:
  - react
  - headless
  - unstyled
  - compound-components
  - data-attributes
  - ai-native
---

# Wire UI

AI-native unstyled primitives framework. Headless, compound components with zero CSS — style via `data-*` attributes.

## Scope

This skill covers building UIs with `@wire-ui/react`. It helps you:

- Import and compose Wire UI components
- Style components using `data-*` attribute selectors
- Handle form validation with consumer-controlled patterns
- Use compound component APIs correctly
- Avoid common mistakes

## Installation

```bash
npm install @wire-ui/react
```

Peer dependencies: `react >= 19.0.0`, `react-dom >= 19.0.0`.

## Core Concepts

### 1. Zero CSS — Style via data-* attributes

Wire UI ships no CSS. All interactive states are exposed as data attributes. Style them with any CSS approach.

**Attributes available on interactive components:**

| Attribute | When present |
|---|---|
| `data-hover` | Mouse is over the element |
| `data-focus-visible` | Keyboard focus (mirrors `:focus-visible`) |
| `data-active` | Element is being pressed |
| `data-disabled` | Element is disabled |
| `data-state` | `"open"` / `"closed"`, `"checked"` / `"unchecked"` — varies per component |
| `data-invalid` | Consumer-controlled via `invalidType` |
| `data-success` | Consumer-controlled via `isSuccess` |

**Styling with Tailwind:**
```tsx
<Button className="[data-hover]:bg-blue-700 [data-active]:scale-95 [data-disabled]:opacity-50">
```

**Styling with plain CSS:**
```css
button[data-hover]    { background: #1d4ed8; }
button[data-active]   { transform: scale(0.95); }
button[data-disabled] { opacity: 0.5; }
```

### 2. Compound Components

Complex components use the `Component.Part` pattern. You compose the parts and control markup order.

```tsx
<Input.Root value={email} onChange={setEmail} invalidType={error}>
  <Input.Label>Email</Input.Label>
  <Input.Field type="email" />
  <Input.Error />
</Input.Root>
```

### 3. asChild Polymorphism

Pass `asChild` to merge all behaviour onto a child element. The component renders the child instead of its default element.

```tsx
<Button asChild>
  <a href="/dashboard">Go to dashboard</a>
</Button>
```

**Decision rule:** Use `asChild` when you need a Wire UI component to render as a different HTML element (e.g., `<a>`, `<Link>`, custom component).

### 4. Consumer-Owned Validation

Form components never validate internally. You set `invalidType` when your logic decides something is invalid.

```tsx
<Input.Root
  invalidType={error}
  errorMessage={{ required: 'Required', email: 'Invalid email' }}
>
  <Input.Field type="email" />
  <Input.Error />
</Input.Root>
```

**Decision rule:** Always set `invalidType` from your own validation logic (onBlur, onSubmit, etc.). Never expect the component to validate for you.

## Component Reference

### Button

```tsx
import { Button } from '@wire-ui/react'

<Button>Click me</Button>
<Button disabled>Disabled</Button>
<Button asChild><a href="/link">As link</a></Button>
```

Props: All `<button>` HTML attributes + `asChild`, `autoFocus`, `disabled`.
Data attributes: `data-hover`, `data-focus-visible`, `data-active`, `data-disabled`, `data-autofocus`.

### Input

```tsx
import { Input } from '@wire-ui/react'

<Input.Root value={value} onChange={setValue} invalidType={error} errorMessage={{ required: 'Required' }}>
  <Input.Label>Email</Input.Label>
  <Input.Field type="email" placeholder="you@example.com" />
  <Input.Error />
</Input.Root>
```

Parts: `Root`, `Label`, `Field`, `Error`.
Root props: `value`, `defaultValue`, `onChange`, `onFocus`, `onBlur`, `invalidType`, `errorMessage`, `isRequired`, `isSuccess`, `id`.
Field data attributes: `data-active`, `data-invalid`, `data-success`.

### Textarea

Same compound API as Input but renders `<textarea>`.

```tsx
import { Textarea } from '@wire-ui/react'

<Textarea.Root>
  <Textarea.Label>Message</Textarea.Label>
  <Textarea.Field rows={4} placeholder="Write something..." />
  <Textarea.Error />
</Textarea.Root>
```

### Password

```tsx
import { Password } from '@wire-ui/react'

<Password.Root>
  <Password.Label>Password</Password.Label>
  <Password.Field placeholder="••••••••" />
  <Password.Toggle />
  <Password.Error />
</Password.Root>
```

Toggle data attribute: `data-visible` (password is shown).

### Checkbox

```tsx
import { Checkbox } from '@wire-ui/react'

<Checkbox.Root value={selected} onChange={setSelected}>
  <Checkbox.Item value="a">
    <Checkbox.Indicator>✓</Checkbox.Indicator>
    <Checkbox.Label>Option A</Checkbox.Label>
  </Checkbox.Item>
</Checkbox.Root>
```

Root props: `value` (array), `defaultValue`, `onChange`, `disabled`.
Item data attribute: `data-checked`.

### Radio

```tsx
import { Radio } from '@wire-ui/react'

<Radio.Root value={selected} onChange={setSelected} name="options">
  <Radio.Item value="a">
    <Radio.Indicator />
    <Radio.Label>Option A</Radio.Label>
  </Radio.Item>
</Radio.Root>
```

Root props: `value`, `defaultValue`, `onChange`, `name`, `disabled`.
Item data attribute: `data-checked`.

### Switch

```tsx
import { Switch } from '@wire-ui/react'

<Switch.Root checked={on} onCheckedChange={setOn}>
  <Switch.Thumb />
</Switch.Root>
```

Data attributes: `data-state` (`"checked"` / `"unchecked"`), `data-disabled`.

### Select

```tsx
import { Select } from '@wire-ui/react'

<Select.Root value={value} onChange={setValue}>
  <Select.Trigger>
    <Select.Value placeholder="Pick one" />
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="a">Option A</Select.Item>
    <Select.Item value="b">Option B</Select.Item>
  </Select.Content>
</Select.Root>
```

Supports: `Select.Group`, `Select.GroupLabel`, `Select.Separator`.
Trigger data attribute: `data-state` (`"open"` / `"closed"`).
Item data attributes: `data-selected`, `data-hover`, `data-disabled`.

### Search

```tsx
import { Search } from '@wire-ui/react'

<Search.Root onSearchChange={setQuery} onSelect={(opt) => console.log(opt)}>
  <Search.Input placeholder="Search..." />
  <Search.Content>
    {results.map(r => <Search.Item key={r.id} option={r}>{r.title}</Search.Item>)}
    <Search.Empty>No results</Search.Empty>
  </Search.Content>
</Search.Root>
```

Root props: `onSearchChange`, `onSelect`, `loading`, `searchDelay`.
Item data attribute: `data-highlighted`.
Keyboard: Arrow keys navigate, Enter selects, Escape closes.

### OTP

```tsx
import { OTP } from '@wire-ui/react'

<OTP.Root length={6} onComplete={(code) => verify(code)}>
  <OTP.Slot index={0} />
  <OTP.Slot index={1} />
  <OTP.Slot index={2} />
  <OTP.Separator />
  <OTP.Slot index={3} />
  <OTP.Slot index={4} />
  <OTP.Slot index={5} />
</OTP.Root>
```

Root props: `length`, `value`, `onChange`, `onComplete`, `disabled`, `alphanumeric`.
Root data attribute: `data-complete`.
Slot data attributes: `data-active`, `data-filled`.

### Modal

```tsx
import { Modal } from '@wire-ui/react'

<Modal.Root open={open} onOpenChange={setOpen}>
  <Modal.Portal>
    <Modal.Overlay>
      <Modal.Content>
        <h2>Title</h2>
        <p>Body</p>
        <Modal.Close>Close</Modal.Close>
      </Modal.Content>
    </Modal.Overlay>
  </Modal.Portal>
</Modal.Root>
```

Parts: `Root`, `Portal`, `Overlay`, `Content`, `Close`.
Root props: `open`, `defaultOpen`, `onOpenChange`.
Data attribute: `data-state` (`"open"` / `"closed"`) on Overlay and Content.
Closes on: Escape key, overlay click.

### Drawer

Same compound API as Modal. Renders as a side panel.

```tsx
import { Drawer } from '@wire-ui/react'

<Drawer.Root open={open} onOpenChange={setOpen}>
  <Drawer.Portal>
    <Drawer.Overlay>
      <Drawer.Content>
        <Drawer.Header>
          <h2>Title</h2>
          <Drawer.Close>✕</Drawer.Close>
        </Drawer.Header>
        <p>Body</p>
      </Drawer.Content>
    </Drawer.Overlay>
  </Drawer.Portal>
</Drawer.Root>
```

### Dropdown

```tsx
import { Dropdown } from '@wire-ui/react'

<Dropdown.Root>
  <Dropdown.Trigger>Options</Dropdown.Trigger>
  <Dropdown.Menu>
    <button>Edit</button>
    <button>Delete</button>
  </Dropdown.Menu>
</Dropdown.Root>
```

Menu data attribute: `data-state` (`"open"` / `"closed"`).
Hide closed menu: `className="data-[state=closed]:hidden"`.

### Tooltip

```tsx
import { Tooltip } from '@wire-ui/react'

<Tooltip.Root delayDuration={300}>
  <Tooltip.Trigger><button>Hover me</button></Tooltip.Trigger>
  <Tooltip.Content side="top">Tooltip text</Tooltip.Content>
</Tooltip.Root>
```

Content props: `side` (`"top"` / `"bottom"` / `"left"` / `"right"`).
Content data attributes: `data-state`, `data-side`.

### Accordion

```tsx
import { Accordion } from '@wire-ui/react'

<Accordion.Root type="single" collapsible defaultValue="item-1">
  <Accordion.Item value="item-1">
    <Accordion.Trigger>Section 1</Accordion.Trigger>
    <Accordion.Content>Content</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

Root types: `type="single"` (one open) or `type="multiple"` (many open).
Data attribute: `data-state` (`"open"` / `"closed"`) on Item, Trigger, Content.

### Rating

```tsx
import { Rating } from '@wire-ui/react'

<Rating defaultValue={3} onChange={(v) => console.log(v)} />
<Rating value={4} readOnly />
<Rating value={2} disabled />
```

Props: `value`, `defaultValue`, `onChange`, `max`, `readOnly`, `disabled`, `starClassName`.
Star data attributes: `data-filled`, `data-highlighted`.

### ProgressBar

```tsx
import { ProgressBar } from '@wire-ui/react'

<ProgressBar percentage={65} />
```

Props: `value`, `min`, `max`.
Renders `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`.

### Alert

```tsx
import { Alert } from '@wire-ui/react'

<Alert.Root status="warning" onDismiss={() => setVisible(false)}>
  <Alert.Title>Warning</Alert.Title>
  <Alert.Description>Check your input.</Alert.Description>
  <Alert.Dismiss>✕</Alert.Dismiss>
</Alert.Root>
```

Root props: `onDismiss`, `isAutoDismissable`, `dismissDuration`.

### Avatar

```tsx
import { Avatar } from '@wire-ui/react'

<Avatar.Root>
  <Avatar.Image src="/avatar.jpg" alt="User" />
  <Avatar.Fallback>JD</Avatar.Fallback>
</Avatar.Root>
```

Image data attribute: `data-status` (`"loading"` / `"loaded"` / `"error"`).
Fallback renders when `data-status` is `"error"` or `src` is empty.

### Badge

```tsx
import { Badge } from '@wire-ui/react'

<Badge count={3} />   // renders "3"
<Badge count={12} />  // renders "9+"
<Badge count={0} />   // renders nothing
```

### Card

Simple container. Style with `data-color` and `data-size` attributes.

```tsx
import { Card } from '@wire-ui/react'

<Card color="primary" size="large">Content</Card>
```

### Divider

```tsx
import { Divider } from '@wire-ui/react'

<Divider />
<Divider orientation="vertical" />
<Divider decorative={false} aria-label="Section break" />
```

### List

```tsx
import { List } from '@wire-ui/react'

<List><li>Item 1</li><li>Item 2</li></List>
<List isOrdered><li>First</li><li>Second</li></List>
```

### Image

```tsx
import { Image } from '@wire-ui/react'

<Image src="/photo.jpg" alt="Photo" position="center" onImageLoaded={() => {}} />
```

Data attributes: `data-position` on wrapper, `data-loaded` on `<img>` after load.

### Timeago

```tsx
import { Timeago } from '@wire-ui/react'

<Timeago datetime={new Date()} isDuration />
<Timeago datetime="2025-06-15T09:00:00" />
<Timeago datetime={new Date()} timeOnly />
```

Props: `datetime`, `isDuration`, `timeOnly`.

### Icon

Renders consumer-supplied SVG strings by name. Ships no SVG assets.

```tsx
import { Icon } from '@wire-ui/react'

<Icon name="check" icons={{ check: '<svg>...</svg>' }} size="medium" />
```

## Hooks

### useInteractiveState

Returns `handlers` and `dataAttributes` for building custom interactive elements.

```tsx
import { useInteractiveState } from '@wire-ui/react'

const { handlers, dataAttributes } = useInteractiveState({ disabled })
return <div {...handlers} {...dataAttributes}>Custom element</div>
```

### useClickOutside

Fires callback when clicking outside a ref.

```tsx
import { useClickOutside } from '@wire-ui/react'

const ref = useRef(null)
useClickOutside(ref, () => setOpen(false))
```

## Decision Trees

### Choosing a form component

- Need a text input? → `Input`
- Need multi-line text? → `Textarea`
- Need a password with show/hide? → `Password`
- Need a one-time code? → `OTP`
- Need a dropdown selection? → `Select`
- Need a search with results? → `Search`
- Need multi-select? → `Checkbox`
- Need single-select from visible options? → `Radio`
- Need an on/off toggle? → `Switch`
- Need a star rating? → `Rating`

### Choosing an overlay

- Need a centered dialog? → `Modal`
- Need a side panel? → `Drawer`
- Need a menu from a trigger? → `Dropdown`
- Need hover/focus info? → `Tooltip`

### Styling approach

- Using Tailwind? → `className="[data-hover]:bg-blue-700"`
- Using CSS Modules? → `[data-hover] { background: #1d4ed8; }`
- Using plain CSS? → `button[data-hover] { background: #1d4ed8; }`

## Anti-Patterns

- **Do not** expect components to ship any CSS — you must style everything yourself.
- **Do not** use `data-focus` — Wire UI uses `data-focus-visible` (keyboard only, not mouse clicks).
- **Do not** set `invalidType` inside the component — validation is always consumer-controlled.
- **Do not** rely on `data-state="true"` or `data-state="false"` — attributes use empty string when present and are absent when not (except `data-state` which uses named values like `"open"` / `"closed"`).
- **Do not** add `type="submit"` to Button expecting form submission by default — Button defaults to `type="button"` to prevent accidental form submission.
- **Do not** forget `Modal.Portal` — Modal content must be wrapped in Portal for correct rendering.
- **Do not** use `data-open` / `data-closed` — use `data-state="open"` / `data-state="closed"` instead.
