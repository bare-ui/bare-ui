# Changelog

All notable changes to `@wire-ui/vue` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.0] - 2026-05-30

### Added

#### Components

- **Carousel** — snap-scrolling carousel with `orientation="horizontal" | "vertical"`, optional `loop`,
  uncontrolled active index (`defaultIndex` / `onIndexChange`), and arrow-key navigation; `data-orientation`
  on root; sub-components: `Carousel.Root`, `Carousel.Viewport`, `Carousel.Content`, `Carousel.Slide`,
  `Carousel.Previous`, `Carousel.Next`, `Carousel.Indicators` (scoped slot with `{ index, selected, scrollTo }`)
- **Chat** — streaming-aware chat surface with a virtualized message list, auto-growing composer, and
  controlled/uncontrolled input (`value` / `defaultValue` / `onValueChange` / `onSubmit`); `isStreaming` toggles
  `data-streaming`, list supports `stickToBottom`, `estimateItemHeight`, and `overscan`; sub-components: `Chat.Root`,
  `Chat.List`, `Chat.Message` (per-message `role` + `streaming` → `data-role` / `data-streaming`), `Chat.Composer`,
  `Chat.Input` (`submitOnEnter`, `autoResize`), `Chat.Send`
- **Citation** — footnote-style references with auto-numbering and bidirectional anchors from a `sources` array; refs
  render `role="doc-noteref"`, footnotes `role="doc-endnote"`, `data-index` on both; sub-components: `Citation.Root`,
  `Citation.Ref` (`for` source id, scoped slot or default `<sup>`), `Citation.List` (scoped slot over sources)
- **CodeBlock** — code display with line numbers (`startLine`), per-line `diff` markers, `highlightLines`, and
  copy-to-clipboard (`copyResetAfter`); `data-language` on root and `<pre>`; sub-components: `CodeBlock.Root`,
  `CodeBlock.Code`, `CodeBlock.Lines` (scoped slot with `{ line }` where `line` is `{ number, content, diff, highlighted }`),
  `CodeBlock.CopyButton` (scoped slot with `{ copied }`)
- **ColorPicker** — HSVA color picker with pointer-drag saturation/value area, hue and alpha tracks, controlled value
  as a hex string (`value` / `defaultValue` / `onChange`), and toggleable `alpha`; sub-components: `ColorPicker.Root`,
  `ColorPicker.Area`, `ColorPicker.AreaThumb`, `ColorPicker.Hue`, `ColorPicker.HueThumb`, `ColorPicker.Alpha`,
  `ColorPicker.AlphaThumb`, `ColorPicker.Swatch`, `ColorPicker.Input`
- **Command** — command palette with fuzzy `filter`, roving arrow-key navigation (`loop`), optional global `shortcut`
  (e.g. `mod+k`), controlled search (`searchValue` / `defaultSearchValue` / `onSearchChange`) and open state; `data-highlighted`
  on the active item; sub-components: `Command.Root`, `Command.Input`, `Command.List`, `Command.Group` (optional `heading`),
  `Command.Item` (`value`, `keywords`, `onSelect`), `Command.Separator`, `Command.Empty`
- **Diff** — line-by-line text diff (LCS-based) with unified and side-by-side views from `oldValue` / `newValue`;
  exposes line `type` (`equal` / `insert` / `delete`) with 1-based `oldLine` / `newLine`; sub-components: `Diff.Root`,
  `Diff.Unified`, `Diff.Split` (paired rows), `Diff.Stats` (`{ additions, deletions }`)
- **Editable** — inline editable field toggling between preview and edit modes with a draft buffer, `submitOnBlur`, and
  `onSubmit` / `onCancel` / `onEdit` callbacks; controlled value and editing state; sub-components: `Editable.Root`,
  `Editable.Preview`, `Editable.Input`, `Editable.Area`, `Editable.EditTrigger`, `Editable.SubmitTrigger`,
  `Editable.CancelTrigger`
- **EmptyState** — placeholder layout for empty/zero-data views; root carries `role="status"`, media is
  `aria-hidden`; sub-components: `EmptyState.Root`, `EmptyState.Media`, `EmptyState.Title`, `EmptyState.Description`,
  `EmptyState.Actions`
- **HoverCard** — richer hover-triggered floating card with configurable `openDelay` / `closeDelay` on `Root`, and
  `side` / `sideOffset` / `forceMount` on `Content`, plus controlled/uncontrolled open state; sub-components:
  `HoverCard.Root`, `HoverCard.Trigger`, `HoverCard.Content`
- **InfiniteScroll** — sentinel-based load-more primitive built on [[use-intersection-observer]]; fires `onLoadMore`
  when the sentinel enters view while `hasMore && !loading && !disabled`, with configurable `rootMargin`; `data-loading`
  and `data-has-more` on root; sub-components: `InfiniteScroll.Root`, `InfiniteScroll.Sentinel`,
  `InfiniteScroll.Loader`, `InfiniteScroll.EndMessage`
- **Markdown** — parser-agnostic Markdown renderer that accepts a pre-parsed `nodes` tree or raw `content` + `parse`
  function, with a `components` override map keyed by mdast node type; default renderers emit semantic HTML for
  paragraphs, headings, lists, code, links, images, blockquotes, and inline marks
- **Mention** — inline `@`-mention input with caret-aware suggestion detection over an `options` list, custom
  `trigger` and `filter`, `appendSpace`, and `onSelect`; controlled/uncontrolled value (`value` / `defaultValue` /
  `onChange`); sub-components: `Mention.Root`, `Mention.Input` (textarea), `Mention.Content`, `Mention.Items`
  (scoped slot with `{ option, active, index }`), `Mention.Empty`
- **RichText** — slot-based Markdown editor scaffold built on [[Markdown]] with `edit` / `preview` / `split` modes,
  selection-wrapping and text-insertion actions, and a controlled Markdown `value`; sub-components: `RichText.Root`,
  `RichText.Toolbar`, `RichText.Action` (`wrap` / `insert`), `RichText.Editor`, `RichText.Preview`
- **ScrollArea** — scroll container with a custom, styleable scrollbar; independent vertical/horizontal scrollbars with
  draggable thumbs and live `metrics` via `ResizeObserver`; `forceMount` to render bars without overflow;
  sub-components: `ScrollArea.Root`, `ScrollArea.Viewport`, `ScrollArea.Scrollbar` (`orientation`), `ScrollArea.Thumb`
- **Sheet** — drawer-adjacent sliding panel with `side="top" | "bottom"`, `snapPoints` (viewport-fraction or px),
  drag-to-dismiss via a handle, optional `modal` backdrop with focus trap and scroll lock, and controlled/uncontrolled
  open + active snap point (`activeSnapPoint` / `defaultActiveSnapPoint` / `onActiveSnapPointChange`); sub-components:
  `Sheet.Root`, `Sheet.Trigger`, `Sheet.Portal`, `Sheet.Overlay`, `Sheet.Content`, `Sheet.Handle`, `Sheet.Title`,
  `Sheet.Description`, `Sheet.Close`
- **Stat** — KPI / metric display with label, value, delta (direction auto-inferred from sign, `data-direction`), help
  text, and an SVG `Sparkline`; root carries `role="group"`; sub-components: `Stat.Root`, `Stat.Label`, `Stat.Value`,
  `Stat.Delta`, `Stat.HelpText`, `Stat.Sparkline` (`data`, `width`, `height`, `strokeWidth`)
- **Stepper** — multi-step / wizard flow with `count`, controlled/uncontrolled 0-based active step
  (`value` / `defaultValue` / `onChange`), `orientation="horizontal" | "vertical"`, and `linear` mode that blocks
  forward jumps; per-step state (`active` / `completed` / `inactive`), `data-orientation` on root; sub-components:
  `Stepper.Root`, `Stepper.List`, `Stepper.Item`, `Stepper.Trigger`, `Stepper.Separator`, `Stepper.Content`
  (`forceMount`), `Stepper.PrevTrigger`, `Stepper.NextTrigger` (auto-disabled at boundaries)
- **Toggle** — two-state pressable button with `pressed` / `defaultPressed` / `onPressedChange`, `aria-pressed`, and
  `data-state` (`on` / `off`); ships with **ToggleGroup** for `single` / `multiple` selection with roving focus,
  arrow-key navigation, `loop`, and `orientation`; sub-components: standalone `Toggle` and `ToggleGroup.Root`. Inside a
  group, a `Toggle` carries a `value` prop and the group owns its pressed state
- **Toolbar** — accessible `role="toolbar"` container with roving focus and arrow-key navigation,
  `orientation="horizontal" | "vertical"`, and `loop`; sub-components: `Toolbar.Root`, `Toolbar.Button`,
  `Toolbar.Toggle` (`pressed` / `onPressedChange`, `data-state`), `Toolbar.Link`, `Toolbar.Separator`
- **Typewriter** — token-by-token text reveal with `char` / `word` mode, configurable `speed`, `startDelay`,
  `autoStart`, `loop` / `loopDelay`, streaming-friendly growing `text` (with `resetOnTextChange`), and `onComplete`;
  scoped-slot state `{ displayed, isTyping, isDone, progress }`; respects `prefers-reduced-motion` (reveals instantly);
  sub-components: `Typewriter.Root`, `Typewriter.Text`, `Typewriter.Cursor`
- **Virtualizer** — windowing primitive for large lists with `count`, `estimateSize`, `overscan`,
  `orientation="vertical" | "horizontal"`, and stable `getItemKey`; dynamic per-item measurement via `ResizeObserver`
  with prefix-sum offsets, scoped-slot children receiving `VirtualItem` (`{ index, start, size }`) and `data-index` on
  items; sub-components: `Virtualizer.Root`

### Changed

- **`useLocalStorage`** / **`useSessionStorage`** — moved into a shared `use-storage` module for naming consistency;
  no API change (exports and behavior are unchanged)

## [0.3.0] - 2026-05-23

### Added

#### Composables

- **`useCopyToClipboard`** — clipboard write helper returning `{ copy, copied, error }`; configurable auto-reset
  timeout for the `copied` flag
- **`useDocumentVisibility`** — reactive `document.visibilityState` ref; SSR-safe with a sensible default
- **`useElementSize`** — live content-box `{ width, height }` of a referenced element via `ResizeObserver`
- **`useEventListener`** — typed `addEventListener` subscription for `window`, `document`, elements, or refs; accepts
  `null` targets for conditional binding; auto-cleans on unmount
- **`useHotkeys`** — declarative keyboard-shortcut binder with combo matching (e.g. `mod+k`, `shift+/`),
  `enableOnFormTags`, and `preventDefault` options
- **`useInterval`** — `setInterval` wrapper with pause/resume/reset controls; pass `null` delay to halt
- **`useLocalStorage`** / **`useSessionStorage`** — `ref`-shaped composables backed by `localStorage` /
  `sessionStorage` with cross-tab sync, custom serializer/deserializer, and SSR-safe initial value
- **`useLongPress`** — long-press gesture handler with configurable `threshold`, `onStart`/`onFinish`/`onCancel`
  callbacks, and pointer/touch support
- **`useMutationObserver`** — observes DOM mutations on a referenced element with full `MutationObserverInit` options
- **`useOnlineStatus`** — reactive `navigator.onLine` ref with SSR-safe default
- **`usePrevious`** — returns the value from the previous render
- **`useStateMachine`** — finite-state-machine composable with `states`, `events`, `transitions`, and guarded
  transitions
- **`useTimeout`** — `setTimeout` wrapper with `start`/`clear`/`reset` controls and `isPending` ref
- **`useUndoRedo`** — state container with bounded history; exposes `undo`, `redo`, `canUndo`, `canRedo`, `clear`
- **`useWindowSize`** — reactive `{ width, height }` of the viewport with SSR-safe default

### Changed

- **AlertRoot** — auto-dismiss timer now uses [[use-timeout]] instead of inline `setTimeout` bookkeeping
- **AvatarFallback** — show-delay timer now uses [[use-timeout]]
- **PanelGroup** (ResizablePanels) — drag-end persistence timer now uses [[use-timeout]]
- **Timeago** — periodic re-render now uses [[use-timeout]] instead of a manual `setInterval`/`setTimeout` chain
- **TooltipRoot** — show/hide delay timers now use [[use-timeout]]

## [0.2.0] - 2026-05-17

First functional release of `@wire-ui/vue` — 44 components and 16 composables ported from `@wire-ui/react` with full
behavioural and data-attribute parity. Targets Vue 3.

### Added

#### Components

- **Accordion** — collapsible sections with `single` and `multiple` selection types, controlled/uncontrolled state,
  `collapsible` mode, per-item and root `disabled` support, and `data-state` on Item, Trigger, and Content
- **Alert** — dismissible alert with `data-status`, auto-dismiss timer (`isAutoDismissable`, `dismissDuration`), and
  `onDismiss` callback; sub-components: `Alert.Root`, `Alert.Title`, `Alert.Description`, `Alert.Dismiss`
- **AspectRatio** — wrapper that locks children to a given `ratio` (e.g. `16 / 9`); renders a padding-bottom spacer plus
  an absolutely-positioned content slot
- **Avatar** — image with lazy-loading fallback; `data-status` reflects `loading` / `loaded` / `error`; sub-components:
  `Avatar.Root`, `Avatar.Image`, `Avatar.Fallback`
- **Badge** — numeric count badge capped at 9+; renders nothing for counts ≤ 0; exposes raw value via `data-count`
- **Breadcrumb** — navigation trail with `Breadcrumb.Root`, `Breadcrumb.List`, `Breadcrumb.Item`, `Breadcrumb.Link`,
  `Breadcrumb.Separator`, and `Breadcrumb.Ellipsis`; `aria-current="page"` on the active item
- **Button** — native `<button>` with full interactive state tracking (`data-hover`, `data-focus-visible`,
  `data-active`, `data-disabled`, `data-autofocus`); `asChild` prop renders the slot's first child directly with merged
  props; `type`, `disabled`, `autofocus` forwarded to the DOM element
- **Calendar** — date grid with `month`/`year` navigation, single and range selection, controlled/uncontrolled state,
  `disabled` and `min`/`max` boundaries; `data-selected`, `data-today`, `data-outside`, `data-range-start`/`-end` per day
- **Card** — unstyled container element with optional `data-color` and `data-size` variant attributes
- **Checkbox** — multi-select checkbox group; controlled via `value: (string | number)[]` and `onChange`;
  sub-components: `Checkbox.Root`, `Checkbox.Item`, `Checkbox.Indicator`, `Checkbox.Label`
- **Combobox** — input + listbox with async filtering, keyboard navigation (ArrowUp/Down, Enter, Escape, Home/End),
  `data-highlighted` on active option, controlled/uncontrolled value; sub-components: `Combobox.Root`, `Combobox.Input`,
  `Combobox.Trigger`, `Combobox.Content`, `Combobox.Item`, `Combobox.Empty`
- **ContextMenu** — right-click menu rendered via `<Teleport>` at the pointer position, Escape and click-outside
  close, keyboard navigation; sub-components: `ContextMenu.Root`, `ContextMenu.Trigger`, `ContextMenu.Content`,
  `ContextMenu.Item`, `ContextMenu.Separator`
- **DatePicker** — input + popover calendar built on Calendar; controlled/uncontrolled `Date` value, custom format,
  `min`/`max`/`disabled`; sub-components: `DatePicker.Root`, `DatePicker.Trigger`, `DatePicker.Input`,
  `DatePicker.Content`, `DatePicker.Calendar`
- **Divider** — horizontal or vertical separator; `orientation` prop; `decorative` prop (default `true`) toggles between
  `role="none"` / `aria-hidden` and `role="separator"` / `aria-orientation`
- **Drawer** — side-panel overlay rendered via `<Teleport>`, overlay-click and Escape key close,
  controlled/uncontrolled state; sub-components: `Drawer.Root`, `Drawer.Portal`, `Drawer.Overlay`, `Drawer.Content`,
  `Drawer.Header`, `Drawer.Close`
- **Dropdown** — trigger + menu pattern with click-outside close, Escape key close, `aria-expanded` on trigger,
  `data-state` on menu; sub-components: `Dropdown.Root`, `Dropdown.Trigger`, `Dropdown.Menu`
- **FileUpload** — drag-and-drop + click-to-browse uploader with `accept`, `multiple`, `maxSize`, per-file progress,
  remove/clear handlers; `data-dragging`, `data-disabled` on root; sub-components: `FileUpload.Root`,
  `FileUpload.Trigger`, `FileUpload.Input`, `FileUpload.List`, `FileUpload.Item`, `FileUpload.Clear`
- **Form** — form primitive with field-level validation, controlled/uncontrolled values, `onSubmit`/`onInvalid`,
  per-field `data-invalid`; sub-components: `Form.Root`, `Form.Field`, `Form.Label`, `Form.Control`, `Form.Message`,
  `Form.Submit`
- **Icon** — renders consumer-supplied SVG strings by name; `aria-hidden` by default; `label` prop makes it accessible;
  `size` prop sets `data-size`; ships no SVG assets
- **Image** — image wrapper with loader placeholder shown until load event; `data-loaded` on img after load;
  `data-position` on wrapper; `onImageLoaded` callback
- **Input** — text input with consumer-controlled error state via `invalidType`; `data-active` / `data-invalid` /
  `data-success` on the field element, `aria-invalid` and `aria-required`; sub-components: `Input.Root`, `Input.Field`,
  `Input.Label`, `Input.Error`
- **List** — ordered or unordered list container; `isOrdered` prop; `data-type`, `data-striped`, `data-divider`,
  `data-size` variant attributes
- **MenuBar** — horizontal application menu with cascading submenus, arrow-key navigation, click-outside close;
  sub-components: `MenuBar.Root`, `MenuBar.Menu`, `MenuBar.Trigger`, `MenuBar.Content`, `MenuBar.Item`,
  `MenuBar.Separator`, `MenuBar.Sub`, `MenuBar.SubTrigger`, `MenuBar.SubContent`
- **Modal** — dialog rendered via `<Teleport>`, overlay-click and Escape key close, `role="dialog"`,
  `aria-modal="true"`, `data-state` on Overlay and Content, controlled/uncontrolled state; sub-components: `Modal.Root`,
  `Modal.Portal`, `Modal.Overlay`, `Modal.Content`, `Modal.Close`
- **NavigationMenu** — top-level navigation with hover-intent open/close, configurable `delayDuration` /
  `skipDelayDuration`, controlled/uncontrolled active item, `data-state` on Trigger/Content, `data-active` on Link;
  sub-components: `NavigationMenu.Root`, `NavigationMenu.List`, `NavigationMenu.Item`, `NavigationMenu.Trigger`,
  `NavigationMenu.Content`, `NavigationMenu.Link`
- **NumberInput** — numeric input with increment/decrement controls, `min`/`max`/`step`, mouse-wheel and keyboard
  adjustment, controlled/uncontrolled state; sub-components: `NumberInput.Root`, `NumberInput.Field`,
  `NumberInput.Increment`, `NumberInput.Decrement`
- **OTP** — one-time password input with individual slot elements, auto-advance on type, Backspace handling,
  `onComplete` callback, alphanumeric mode, `data-complete` on root; sub-components: `OTP.Root`, `OTP.Slot`,
  `OTP.Separator`
- **Pagination** — page-navigation control with previous/next, page items, optional ellipsis, configurable
  `siblingCount` and `boundaryCount`; `aria-current="page"` on the active page
- **Password** — password input compound component with built-in show/hide toggle; consumer-controlled error state via
  `invalidType`; `data-visible` on Toggle when visible; sub-components: `Password.Root`, `Password.Field`,
  `Password.Toggle`, `Password.Label`, `Password.Error`
- **ProgressBar** — `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`; value clamped to
  `[min, max]`; inner fill width set via inline style; `data-size`
- **Radio** — single-selection radio group; controlled via `value` and `onChange`; `name` attribute shared across items;
  `disabled` per-item or on root; sub-components: `Radio.Root`, `Radio.Item`, `Radio.Indicator`, `Radio.Label`
- **Rating** — star rating component; `max` prop (default 5); hover preview; `readOnly` (renders `role="img"`) and
  `disabled` modes; controlled/uncontrolled
- **ResizablePanels** — split-pane layout with draggable handles, `direction="horizontal" | "vertical"`, per-panel
  `defaultSize` / `minSize` / `maxSize`, controlled sizes; sub-components: `ResizablePanels.Root`,
  `ResizablePanels.Panel`, `ResizablePanels.Handle`
- **Search** — search input with dropdown results, keyboard navigation (ArrowUp/Down, Enter, Escape), `data-highlighted`
  on active item, `loading` state (`data-loading` on root), `onSearchChange`, `onSelect`, `searchDelay`; sub-components:
  `Search.Root`, `Search.Input`, `Search.Content`, `Search.Item`, `Search.Empty`
- **Select** — accessible select menu with groups, separators, and a custom trigger; sub-components: `Select.Root`,
  `Select.Trigger`, `Select.Value`, `Select.Content`, `Select.Item`, `Select.Group`, `Select.GroupLabel`,
  `Select.Separator`
- **Skeleton** — animated placeholder block for loading states; `data-loading` toggle; renders a styled `<span>` by
  default
- **Spinner** — animated 12-dot loading indicator; `role="status"` with `aria-label="Loading"`; `size` prop
  (`small | medium | large`); `color` prop sets `--spinner-color` CSS variable
- **Switch** — toggle with a thumb element; `data-state` (`checked` / `unchecked`), `data-disabled`; sub-components:
  `Switch.Root`, `Switch.Thumb`
- **Tag** — pill element with optional `Tag.Dismiss` button; `data-color` and `data-size` variant attributes
- **TagInput** — token-style input with keyboard-driven add (Enter/comma), Backspace-to-remove, paste-to-split,
  `maxTags`, controlled/uncontrolled values; sub-components: `TagInput.Root`, `TagInput.Input`, `TagInput.List`,
  `TagInput.Item`, `TagInput.Dismiss`
- **Textarea** — multi-line text input with same consumer-controlled error state as Input; sub-components:
  `Textarea.Root`, `Textarea.Field`, `Textarea.Label`, `Textarea.Error`
- **Timeago** — relative timestamp (`isDuration` mode: "Just Now", "5 minutes ago", "2 hours ago") and formatted display
  ("Today, 09:00", full date); accepts `Date`, ISO string, or numeric timestamp; live-updating via `setInterval`
- **Toast** — notification system with imperative `toast()` API, auto-dismiss timer, configurable position and
  duration, swipe-to-dismiss, action and close slots; sub-components: `Toast.Provider`, `Toast.Viewport`, `Toast.Root`,
  `Toast.Title`, `Toast.Description`, `Toast.Action`, `Toast.Close`
- **Tooltip** — hover/focus tooltip with configurable `delayDuration` and `side` (`top | bottom | left | right`);
  `data-state` and `data-side` on Content; controlled/uncontrolled
- **TreeView** — hierarchical disclosure with expand/collapse, keyboard navigation, single- and multi-select,
  controlled/uncontrolled state; sub-components: `TreeView.Root`, `TreeView.Item`, `TreeView.Trigger`,
  `TreeView.Content`, `TreeView.Label`

#### Composables

- **`useClickOutside`** — fires a callback when a pointer event occurs outside a referenced element
- **`useControllableState`** — unified controlled/uncontrolled state pattern with `value` / `defaultValue` / `onChange`
- **`useDebounce`** — debounced callback with configurable delay and a `cancel()` method
- **`useDisclosure`** — boolean state with `open` / `close` / `toggle` actions
- **`useFloating`** — anchored-positioning primitive used by Tooltip, DatePicker, and Combobox; computes `side`,
  `align`, and collision-aware coordinates
- **`useFocusTrap`** — contains keyboard focus within a referenced element while active
- **`useFocusVisible`** — tracks keyboard-vs-pointer focus for `data-focus-visible` styling
- **`useId`** — SSR-safe id generator with optional prefix
- **`useInteractiveState`** — tracks hover, keyboard-focus (`data-focus-visible`), and press (`data-active`) state;
  returns reactive `handlers`, `dataAttributes`, and refs; used internally by Button, Accordion.Trigger, Modal.Close,
  and Drawer.Close
- **`useIntersectionObserver`** — observes element visibility with configurable `threshold` / `rootMargin`
- **`useKeyboard`** — declarative `keydown`/`keyup` handler with key-combo matching
- **`useMediaQuery`** — reactive boolean matching a CSS media query
- **`useReduceMotion`** — reactive `prefers-reduced-motion` boolean
- **`useResizeObserver`** — observes element size with debounced callback
- **`useScrollLock`** — locks page scroll while active (used by Modal, Drawer)
- **`useThrottle`** — throttled callback with leading/trailing options

### Fixed

- **NavigationMenu** — moving the cursor from the Trigger into the Content no longer closes the menu. The close timer
  was hoisted from per-Trigger/per-Content locals to a single timer on `Root` so either piece can cancel it on
  `pointerenter`. Previously, Content's `pointerenter` cleared its own (null) timer while Trigger's pending close timer
  kept running and shut the menu.

## [0.1.0] - 2026-04-29

- Initial package setup
