---
name: wire-ui
description: AI-native unstyled primitives framework. Headless, compound components with zero CSS.
version: 0.5.0
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

### Carousel

```tsx
import { Carousel } from '@wire-ui/react'

<Carousel.Root>
  <Carousel.Viewport>
    <Carousel.Content>
      <Carousel.Slide>Slide 1</Carousel.Slide>
      <Carousel.Slide>Slide 2</Carousel.Slide>
    </Carousel.Content>
  </Carousel.Viewport>
  <Carousel.Previous>‹</Carousel.Previous>
  <Carousel.Next>›</Carousel.Next>
  <Carousel.Indicators>
    {({ index, selected, scrollTo }) => <button key={index} onClick={scrollTo} aria-current={selected} />}
  </Carousel.Indicators>
</Carousel.Root>
```

Root props: `orientation` (`"horizontal"` / `"vertical"`), `loop`, `index`, `defaultIndex`, `onIndexChange`.
Data attributes: `data-orientation` on Root.

### InfiniteScroll

```tsx
import { InfiniteScroll } from '@wire-ui/react'

<InfiniteScroll.Root onLoadMore={loadMore} hasMore={hasMore} loading={loading}>
  <ul>{items.map((i) => <li key={i}>{i}</li>)}</ul>
  <InfiniteScroll.Loader>Loading…</InfiniteScroll.Loader>
  <InfiniteScroll.EndMessage>No more</InfiniteScroll.EndMessage>
  <InfiniteScroll.Sentinel />
</InfiniteScroll.Root>
```

Root props: `onLoadMore`, `hasMore`, `loading`, `disabled`, `rootMargin`. Built on `useIntersectionObserver`.
Data attributes: `data-loading`, `data-has-more` on Root.

### ScrollArea

```tsx
import { ScrollArea } from '@wire-ui/react'

<ScrollArea.Root>
  <ScrollArea.Viewport>{/* content */}</ScrollArea.Viewport>
  <ScrollArea.Scrollbar orientation="vertical"><ScrollArea.Thumb /></ScrollArea.Scrollbar>
</ScrollArea.Root>
```

Scrollbar props: `orientation` (`"vertical"` / `"horizontal"`), `forceMount`.

### Virtualizer

```tsx
import { Virtualizer } from '@wire-ui/react'

<Virtualizer.Root count={1000} estimateSize={44}>
  {({ index }) => <div>Row {index}</div>}
</Virtualizer.Root>
```

Root props: `count`, `estimateSize`, `overscan`, `orientation`, `getItemKey`. Render-prop children receive a `VirtualItem` (`{ index, start, size }`).

### EmptyState

```tsx
import { EmptyState } from '@wire-ui/react'

<EmptyState.Root>
  <EmptyState.Media>🗂️</EmptyState.Media>
  <EmptyState.Title>No projects yet</EmptyState.Title>
  <EmptyState.Description>Create your first project.</EmptyState.Description>
  <EmptyState.Actions><button>Create</button></EmptyState.Actions>
</EmptyState.Root>
```

Parts: `Root` (`role="status"`), `Media` (`aria-hidden`), `Title`, `Description`, `Actions`.

### Stat

```tsx
import { Stat } from '@wire-ui/react'

<Stat.Root>
  <Stat.Label>Revenue</Stat.Label>
  <Stat.Value>$48,250</Stat.Value>
  <Stat.Delta value={12.5}>▲ 12.5%</Stat.Delta>
  <Stat.HelpText>vs last month</Stat.HelpText>
  <Stat.Sparkline data={[12, 18, 15, 22, 28]} />
</Stat.Root>
```

`Stat.Delta` infers direction from the sign of `value` (`data-direction`). `Stat.Sparkline` props: `data`, `width`, `height`, `strokeWidth`.

### ColorPicker

```tsx
import { ColorPicker } from '@wire-ui/react'

<ColorPicker.Root value={color} onChange={setColor}>
  <ColorPicker.Area><ColorPicker.AreaThumb /></ColorPicker.Area>
  <ColorPicker.Hue><ColorPicker.HueThumb /></ColorPicker.Hue>
  <ColorPicker.Alpha><ColorPicker.AlphaThumb /></ColorPicker.Alpha>
  <ColorPicker.Swatch />
  <ColorPicker.Input />
</ColorPicker.Root>
```

Root props: `value` / `defaultValue` (hex string), `onChange`, `alpha`.

### Editable

```tsx
import { Editable } from '@wire-ui/react'

<Editable.Root defaultValue="Click to edit" submitOnBlur>
  <Editable.Preview />
  <Editable.Input />
</Editable.Root>
```

Root props: `value` / `defaultValue`, `editing`, `submitOnBlur`, `onSubmit`, `onCancel`, `onEdit`. Parts also include `Area`, `EditTrigger`, `SubmitTrigger`, `CancelTrigger`.

### RichText

```tsx
import { RichText } from '@wire-ui/react'

<RichText.Root defaultMode="split" parse={parse}>
  <RichText.Toolbar>
    <RichText.Action wrap="**">B</RichText.Action>
    <RichText.Action insert={'\n- '}>List</RichText.Action>
  </RichText.Toolbar>
  <RichText.Editor />
  <RichText.Preview />
</RichText.Root>
```

Root props: `value`, `defaultMode` (`"edit"` / `"preview"` / `"split"`), `parse`, `components`. `RichText.Action` takes `wrap` (string | `[string, string]`) or `insert`. Built on `Markdown`.

### Toggle

```tsx
import { Toggle, ToggleGroup } from '@wire-ui/react'

<Toggle defaultPressed aria-label="Bold"><b>B</b></Toggle>

<ToggleGroup.Root type="multiple" defaultValue={['bold']}>
  <Toggle value="bold"><b>B</b></Toggle>
  <Toggle value="italic"><i>I</i></Toggle>
</ToggleGroup.Root>
```

`Toggle` props: `pressed` / `defaultPressed` / `onPressedChange` (`aria-pressed`, `data-state` `"on"` / `"off"`). `ToggleGroup.Root` props: `type` (`"single"` / `"multiple"`), `value` / `defaultValue` / `onValueChange`, `loop`, `orientation`.

### Stepper

```tsx
import { Stepper } from '@wire-ui/react'

<Stepper.Root count={3} defaultValue={0} linear>
  <Stepper.List>
    <Stepper.Item index={0}><Stepper.Trigger>Account</Stepper.Trigger><Stepper.Separator /></Stepper.Item>
    <Stepper.Item index={1}><Stepper.Trigger>Review</Stepper.Trigger></Stepper.Item>
  </Stepper.List>
  <Stepper.Content index={0}>…</Stepper.Content>
  <Stepper.PrevTrigger>Back</Stepper.PrevTrigger>
  <Stepper.NextTrigger>Next</Stepper.NextTrigger>
</Stepper.Root>
```

Root props: `count`, `value` / `defaultValue` / `onValueChange` (0-based), `orientation`, `linear` (blocks forward jumps). Prev/Next triggers auto-disable at boundaries.

### Toolbar

```tsx
import { Toolbar } from '@wire-ui/react'

<Toolbar.Root aria-label="Format">
  <Toolbar.Toggle aria-label="Bold"><b>B</b></Toolbar.Toggle>
  <Toolbar.Separator />
  <Toolbar.Button>Align</Toolbar.Button>
  <Toolbar.Link href="#">Help</Toolbar.Link>
</Toolbar.Root>
```

`role="toolbar"` with roving focus + arrow-key navigation. Root props: `orientation`, `loop`. `Toolbar.Toggle`: `pressed` / `onPressedChange` (`data-state`).

### Command

```tsx
import { Command } from '@wire-ui/react'

<Command.Root shortcut="mod+k">
  <Command.Input placeholder="Search…" />
  <Command.List>
    <Command.Empty>No results.</Command.Empty>
    <Command.Group heading="Actions">
      <Command.Item value="New File" keywords={['create']} onSelect={create}>New File</Command.Item>
    </Command.Group>
  </Command.List>
</Command.Root>
```

Root props: `filter`, `loop`, `shortcut` (e.g. `mod+k`), `searchValue` / `onSearchChange`, `open` / `onOpenChange`. `Command.Item`: `value`, `keywords`, `onSelect`, `disabled` (`data-highlighted` on the active item).

### HoverCard

```tsx
import { HoverCard } from '@wire-ui/react'

<HoverCard.Root openDelay={200}>
  <HoverCard.Trigger>@wire-ui</HoverCard.Trigger>
  <HoverCard.Content side="bottom">Profile preview…</HoverCard.Content>
</HoverCard.Root>
```

Root props: `openDelay`, `closeDelay`, `open` / `defaultOpen` / `onOpenChange`. `HoverCard.Content`: `side`, `sideOffset`, `forceMount`. (Hover/focus intent — for click menus use `Dropdown`, for tooltips use `Tooltip`.)

### Sheet

```tsx
import { Sheet } from '@wire-ui/react'

<Sheet.Root side="bottom" snapPoints={[0.4]} modal>
  <Sheet.Trigger>Open</Sheet.Trigger>
  <Sheet.Portal>
    <Sheet.Overlay />
    <Sheet.Content>
      <Sheet.Handle />
      <Sheet.Title>Bottom sheet</Sheet.Title>
      <Sheet.Close>Done</Sheet.Close>
    </Sheet.Content>
  </Sheet.Portal>
</Sheet.Root>
```

Root props: `side` (`"top"` / `"bottom"`), `snapPoints` (fraction or px), `modal`, `open` / `defaultOpen` / `onOpenChange`, `activeSnapPoint` / `onActiveSnapPointChange`. Drag-to-dismiss via `Sheet.Handle`.

### Chat

```tsx
import { Chat } from '@wire-ui/react'

<Chat.Root onSubmit={send} isStreaming={streaming}>
  <Chat.List count={messages.length}>
    {({ index }) => <Chat.Message role={messages[index].role}>{messages[index].text}</Chat.Message>}
  </Chat.List>
  <Chat.Composer>
    <Chat.Input placeholder="Send a message…" />
    <Chat.Send>Send</Chat.Send>
  </Chat.Composer>
</Chat.Root>
```

Root props: `value` / `defaultValue` / `onValueChange`, `onSubmit`, `isStreaming` (`data-streaming`). `Chat.List`: `count`, `stickToBottom`, `overscan` (virtualized). `Chat.Message`: `role`, `streaming` (`data-role`, `data-streaming`). `Chat.Input`: `submitOnEnter`, `autoResize`.

### Citation

```tsx
import { Citation } from '@wire-ui/react'

<Citation.Root sources={sources}>
  <p>HTTP defines status codes<Citation.Ref for="rfc" />.</p>
  <Citation.List />
</Citation.Root>
```

Root props: `sources` (array of `{ id, title, url }`). `Citation.Ref` takes `for` (source id), renders `role="doc-noteref"`; `Citation.List` renders footnotes (`role="doc-endnote"`). Auto-numbered with `data-index` on both.

### CodeBlock

```tsx
import { CodeBlock } from '@wire-ui/react'

<CodeBlock.Root code={src} language="js" startLine={1} highlightLines={[2]}>
  <CodeBlock.CopyButton>{({ copied }) => (copied ? 'Copied!' : 'Copy')}</CodeBlock.CopyButton>
  <CodeBlock.Code>
    <CodeBlock.Lines>{({ line }) => <span>{line.number}: {line.content}</span>}</CodeBlock.Lines>
  </CodeBlock.Code>
</CodeBlock.Root>
```

Root props: `code`, `language`, `startLine`, `highlightLines`, `copyResetAfter`. `CodeBlock.Lines` render-prop carries `{ number, content, diff, highlighted }`; `CodeBlock.CopyButton` carries `{ copied }`. `data-language` on Root and `<pre>`.

### Diff

```tsx
import { Diff } from '@wire-ui/react'

<Diff.Root oldValue={before} newValue={after}>
  <Diff.Stats>{({ additions, deletions }) => <span>+{additions} −{deletions}</span>}</Diff.Stats>
  <Diff.Unified>{({ line }) => <div>{line.content}</div>}</Diff.Unified>
</Diff.Root>
```

Root props: `oldValue`, `newValue` (LCS-based). `Diff.Unified` / `Diff.Split` render lines with `type` (`equal` / `insert` / `delete`) and 1-based `oldLine` / `newLine`. `Diff.Stats` carries `{ additions, deletions }`.

### Markdown

```tsx
import { Markdown } from '@wire-ui/react'

<Markdown content={text} parse={parse} components={{ a: MyLink }} />
// or pre-parsed:
<Markdown nodes={nodes} />
```

Parser-agnostic. Props: `nodes` (pre-parsed mdast tree) or `content` + `parse`, plus a `components` override map keyed by node type. Default renderers emit semantic HTML.

### Mention

```tsx
import { Mention } from '@wire-ui/react'

<Mention.Root options={people}>
  <Mention.Input placeholder="Type @ to mention…" />
  <Mention.Content>
    <Mention.Items>{({ option }) => <div>{option.label}</div>}</Mention.Items>
    <Mention.Empty>No matches</Mention.Empty>
  </Mention.Content>
</Mention.Root>
```

Root props: `options`, `trigger` (default `@`), `filter`, `appendSpace`, `onSelect`, `value` / `defaultValue`. `Mention.Input` is a textarea; `Mention.Items` render-prop carries `{ option, active, index }`.

### Typewriter

```tsx
import { Typewriter } from '@wire-ui/react'

<Typewriter.Root text="Composing a reply…" speed={45}>
  <Typewriter.Text />
  <Typewriter.Cursor>▋</Typewriter.Cursor>
</Typewriter.Root>
```

Root props: `text` (streaming-friendly — appends as it grows), `granularity` (`"char"` / `"word"`), `speed`, `startDelay`, `autoStart`, `loop` / `loopDelay`, `onComplete`. Render-prop state: `{ displayed, isTyping, isDone, progress }`. Respects `prefers-reduced-motion`.

## Hooks

`@wire-ui/react` exports 33 hooks. Vue exposes the same APIs as `useX` composables; Solid exposes them as `createX` primitives. The list below uses React names.

### State

#### useControllableState

Unified controlled/uncontrolled state. Returns `[value, setValue]`.

```tsx
const [value, setValue] = useControllableState({
  value: props.value,
  defaultValue: props.defaultValue ?? '',
  onChange: props.onChange,
})
```

#### useDisclosure

Boolean open/close with stable handlers.

```tsx
const { isOpen, open, close, toggle } = useDisclosure({ defaultOpen: false })
```

#### useId

SSR-safe unique id with an optional prefix.

```tsx
const id = useId('field')
```

#### usePrevious

Returns the value from the previous render (`undefined` on first render).

```tsx
const previous = usePrevious(count)
```

#### useStateMachine

Typed finite state machine. Invalid events are silent no-ops.

```tsx
const { state, send, can } = useStateMachine(
  { idle: { fetch: 'loading' }, loading: { resolve: 'idle' } },
  { initial: 'idle' },
)
```

#### useUndoRedo

Bounded undo/redo container. `set` clears the redo stack.

```tsx
const { value, set, undo, redo, canUndo, canRedo } = useUndoRedo('', { limit: 100 })
```

### Interaction

#### useInteractiveState

`handlers` + `dataAttributes` for building custom interactive elements.

```tsx
const { handlers, dataAttributes } = useInteractiveState({ disabled })
return <div {...handlers} {...dataAttributes}>Custom element</div>
```

#### useClickOutside

Fires a callback on outside click/tap.

```tsx
const ref = useRef(null)
useClickOutside(ref, () => setOpen(false))
```

#### useFocusTrap

Trap keyboard focus inside a container while active.

```tsx
const ref = useRef(null)
useFocusTrap(ref, { isActive: isOpen })
```

#### useFocusVisible

Track whether focus arrived from the keyboard or a pointer.

#### useKeyboard

Map keys to handlers with modifier matching.

```tsx
useKeyboard({ Escape: onClose, s: [onSave, { meta: true, preventDefault: true }] })
```

#### useHotkeys

Declarative hotkey binder. `mod+k` is ⌘K on macOS, Ctrl+K elsewhere. Suppressed inside inputs by default; supports scopes.

```tsx
useHotkeys({
  'mod+k': (e) => { e.preventDefault(); openPalette() },
  'escape': closePalette,
})
```

#### useLongPress

Long-press gesture; spread the returned handlers onto an element.

```tsx
const handlers = useLongPress((e) => console.log('held'), { threshold: 500 })
return <div {...handlers}>Press and hold</div>
```

#### useCopyToClipboard

Async clipboard write with a `copied` flag that auto-resets after `resetAfter` ms.

```tsx
const { copy, copied } = useCopyToClipboard({ resetAfter: 2000 })
return <button onClick={() => copy(text)}>{copied ? 'Copied!' : 'Copy'}</button>
```

### Layout

#### useFloating

Position a floating element relative to a reference (used by Tooltip, Popover, Dropdown, etc.).

#### useScrollLock

Lock document scrolling without layout shift.

### Observers

#### useIntersectionObserver

Observe element visibility within a scroll container.

#### useResizeObserver

Observe an element's content-box `{ width, height }`.

#### useMutationObserver

Observe DOM mutations on a ref target.

```tsx
useMutationObserver(ref, (mutations) => { /* … */ }, { attributes: true })
```

#### useElementSize

Live content-box `{ width, height }` of a referenced element. Thin wrapper over `useResizeObserver`.

#### useWindowSize

Live `{ width, height }` of the viewport. SSR-safe.

### Timing

#### useTimeout

Managed `setTimeout` with `start` / `stop` / `reset` and `isPending`. Latest callback is always invoked.

```tsx
const { isPending, start, stop, reset } = useTimeout(onDismiss, 3000, { autoStart: true })
```

#### useInterval

Managed `setInterval` with pause/resume. Pass `delay = null` to pause without unmounting.

```tsx
const { isRunning, start, stop } = useInterval(tick, 1000, { autoStart: true })
```

#### useDebounce / useDebouncedCallback

Debounce a value or a callback — only fires after `delay` ms of inactivity.

```tsx
const debouncedQuery = useDebounce(query, 250)
const saveDraft = useDebouncedCallback((v) => fetch('/draft', { body: v }), 500)
```

#### useThrottle / useThrottledCallback

Throttle a value or a callback — fires at most once per `delay` window.

### Storage

#### useLocalStorage / useSessionStorage

`useState`-shaped hook backed by Web Storage. SSR-safe. `useLocalStorage` syncs across tabs by default; `useSessionStorage` does not.

```tsx
const [theme, setTheme, removeTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light')
```

### DOM

#### useEventListener

Typed `addEventListener` for window / document / element / ref. Tolerates `null` targets.

```tsx
useEventListener('resize', () => console.log(window.innerWidth))
useEventListener('click', onClick, ref)
```

#### useDocumentVisibility

Reactive `'visible' | 'hidden'`. SSR-safe (defaults to `'visible'`).

#### useOnlineStatus

Reactive `navigator.onLine` boolean. SSR-safe (defaults to `true`).

#### useMediaQuery

Reactively match a CSS media query.

```tsx
const isMobile = useMediaQuery('(max-width: 640px)')
```

#### useReduceMotion

Detect the OS-level reduced-motion preference.

#### useIsomorphicLayoutEffect

`useLayoutEffect` on the client, `useEffect` on the server — silences SSR warnings while keeping synchronous DOM measurements on the client.

### Utilities

#### useMergedRefs

Merge multiple refs onto a single element. Accepts ref objects, callback refs, or `null` (skipped).

```tsx
const mergedRef = useMergedRefs(localRef, forwardedRef)
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
- Need an on/off toggle (form value)? → `Switch`
- Need a pressed/unpressed button (e.g. toolbar formatting)? → `Toggle` / `ToggleGroup`
- Need a star rating? → `Rating`
- Need a color value? → `ColorPicker`
- Need inline edit-in-place? → `Editable`
- Need a Markdown editor? → `RichText`
- Need a command palette (Cmd-K)? → `Command`

### Choosing an overlay

- Need a centered dialog? → `Modal`
- Need a side panel? → `Drawer`
- Need a bottom/top sheet with snap points and drag-to-dismiss? → `Sheet`
- Need a menu from a trigger? → `Dropdown`
- Need hover-intent rich content? → `HoverCard` (use `Tooltip` for plain text labels)
- Need hover/focus info? → `Tooltip`

### Choosing an AI / content component

- Streaming chat UI? → `Chat`
- Render Markdown? → `Markdown` (editable? → `RichText`)
- Display source code with copy / line numbers? → `CodeBlock`
- Show a text diff? → `Diff`
- Footnote-style references? → `Citation`
- `@`-mention autocomplete? → `Mention`
- Typing / streaming text animation? → `Typewriter`

### Styling approach

- Using Tailwind? → `className="[data-hover]:bg-blue-700"`
- Using CSS Modules? → `[data-hover] { background: #1d4ed8; }`
- Using plain CSS? → `button[data-hover] { background: #1d4ed8; }`

### Choosing a hook

- Boolean open/close (modal, drawer, dropdown)? → `useDisclosure`
- Controlled/uncontrolled wrapper for a custom component? → `useControllableState`
- Stable, SSR-safe id (for `htmlFor` / `aria-labelledby`)? → `useId`
- Track the value from the previous render? → `usePrevious`
- More than two states (`idle` → `loading` → `success` | `error`)? → `useStateMachine`
- Need undo/redo? → `useUndoRedo`
- Cmd-K / global shortcut? → `useHotkeys` (not `useKeyboard` — that's for element-scoped key handlers)
- Click outside to close? → `useClickOutside`
- Trap focus inside a dialog? → `useFocusTrap`
- "Copied!" affordance after writing to the clipboard? → `useCopyToClipboard`
- Long-press gesture? → `useLongPress`
- Position a floating element next to a trigger? → `useFloating`
- Lock body scroll while a modal is open? → `useScrollLock`
- Observe element size / window size? → `useElementSize` / `useWindowSize`
- Lazy-load when an element scrolls into view? → `useIntersectionObserver`
- Observe DOM mutations? → `useMutationObserver`
- One-shot `setTimeout` with pause/resume? → `useTimeout`
- Recurring tick? → `useInterval`
- Debounce/throttle a value or callback? → `useDebounce` / `useThrottle`
- Persist UI state with cross-tab sync? → `useLocalStorage` (use `useSessionStorage` for per-tab)
- Reactive `document.visibilityState`? → `useDocumentVisibility`
- Reactive `navigator.onLine`? → `useOnlineStatus`
- Typed `addEventListener` (window/document/element/ref)? → `useEventListener`
- Match a CSS media query reactively? → `useMediaQuery`
- Respect `prefers-reduced-motion`? → `useReduceMotion`
- Merge two refs onto one element? → `useMergedRefs`
- Need `useLayoutEffect` semantics without an SSR warning? → `useIsomorphicLayoutEffect`

## Anti-Patterns

- **Do not** expect components to ship any CSS — you must style everything yourself.
- **Do not** use `data-focus` — Wire UI uses `data-focus-visible` (keyboard only, not mouse clicks).
- **Do not** set `invalidType` inside the component — validation is always consumer-controlled.
- **Do not** rely on `data-state="true"` or `data-state="false"` — attributes use empty string when present and are absent when not (except `data-state` which uses named values like `"open"` / `"closed"`).
- **Do not** add `type="submit"` to Button expecting form submission by default — Button defaults to `type="button"` to prevent accidental form submission.
- **Do not** forget `Modal.Portal` — Modal content must be wrapped in Portal for correct rendering.
- **Do not** use `data-open` / `data-closed` — use `data-state="open"` / `data-state="closed"` instead.
