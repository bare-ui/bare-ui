# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2026-05-23

### Added

#### Hooks

- **`useCopyToClipboard`** — clipboard write helper returning `{ copy, copied, error }`; configurable auto-reset timeout
  for the `copied` flag
- **`useDocumentVisibility`** — reactive `document.visibilityState` value; SSR-safe with a sensible default
- **`useElementSize`** — live content-box `{ width, height }` of a referenced element via `ResizeObserver`
- **`useEventListener`** — typed `addEventListener` subscription for `window`, `document`, elements, or refs; accepts
  `null` targets for conditional binding; auto-cleans on unmount
- **`useHotkeys`** — declarative keyboard-shortcut binder with combo matching (e.g. `mod+k`, `shift+/`),
  `enableOnFormTags`, and `preventDefault` options
- **`useInterval`** — `setInterval` wrapper with pause/resume/reset controls; pass `null` delay to halt
- **`useIsomorphicLayoutEffect`** — `useLayoutEffect` on the client, `useEffect` on the server; avoids SSR warnings
- **`useLocalStorage`** / **`useSessionStorage`** — `useState`-shaped hooks backed by `localStorage` / `sessionStorage`
  with cross-tab sync, custom serializer/deserializer, and SSR-safe initial value
- **`useLongPress`** — long-press gesture handler with configurable `threshold`, `onStart`/`onFinish`/`onCancel`
  callbacks, and pointer/touch support
- **`useMutationObserver`** — observes DOM mutations on a referenced element with full `MutationObserverInit` options
- **`useOnlineStatus`** — reactive `navigator.onLine` boolean with SSR-safe default
- **`usePrevious`** — returns the value from the previous render
- **`useStateMachine`** — finite-state-machine hook with `states`, `events`, `transitions`, and guarded transitions
- **`useTimeout`** — `setTimeout` wrapper with `start`/`clear`/`reset` controls and `isPending` flag
- **`useUndoRedo`** — state container with bounded history; exposes `undo`, `redo`, `canUndo`, `canRedo`, `clear`
- **`useWindowSize`** — reactive `{ width, height }` of the viewport with SSR-safe default

### Changed

- **AlertRoot** — auto-dismiss timer now uses [[use-timeout]] instead of inline `setTimeout` bookkeeping
- **AvatarFallback** — show-delay timer now uses [[use-timeout]]
- **ContextMenu** — outside-click/Escape handling now uses [[use-event-listener]]
- **Group** — internal listeners now use [[use-event-listener]]
- **NavigationMenu** — hover-intent open/close timers now use [[use-timeout]] (no behavior change to the timer-hoist
  fix from 0.2.0)
- **Timeago** — periodic re-render now uses [[use-interval]] instead of a manual `setInterval`
- **Toast** — per-toast auto-dismiss timer now uses [[use-timeout]]
- **Tooltip** — show/hide delay timers now use [[use-timeout]]

### Fixed

- **`useEventListener`** — target type now accepts `null`, so conditional bindings on refs that may be unset typecheck
  without a cast

## [0.2.0] - 2026-05-17

### Added

#### Components

- **AspectRatio** — wrapper that locks children to a given `ratio` (e.g. `16 / 9`); renders a padding-bottom spacer plus
  an absolutely-positioned content slot
- **Breadcrumb** — navigation trail with `Breadcrumb.Root`, `Breadcrumb.List`, `Breadcrumb.Item`, `Breadcrumb.Link`,
  `Breadcrumb.Separator`, and `Breadcrumb.Ellipsis`; `aria-current="page"` on the active item
- **Calendar** — date grid with `month`/`year` navigation, single and range selection, controlled/uncontrolled state,
  `disabled` and `min`/`max` boundaries; `data-selected`, `data-today`, `data-outside`, `data-range-start`/`-end` per day
- **Combobox** — input + listbox with async filtering, keyboard navigation (ArrowUp/Down, Enter, Escape, Home/End),
  `data-highlighted` on active option, controlled/uncontrolled value; sub-components: `Combobox.Root`, `Combobox.Input`,
  `Combobox.Trigger`, `Combobox.Content`, `Combobox.Item`, `Combobox.Empty`
- **ContextMenu** — right-click menu rendered into a portal at the pointer position, Escape and click-outside close,
  keyboard navigation; sub-components: `ContextMenu.Root`, `ContextMenu.Trigger`, `ContextMenu.Content`,
  `ContextMenu.Item`, `ContextMenu.Separator`
- **DatePicker** — input + popover calendar built on Calendar; controlled/uncontrolled `Date` value, custom format,
  `min`/`max`/`disabled`; sub-components: `DatePicker.Root`, `DatePicker.Trigger`, `DatePicker.Input`,
  `DatePicker.Content`, `DatePicker.Calendar`
- **FileUpload** — drag-and-drop + click-to-browse uploader with `accept`, `multiple`, `maxSize`, per-file progress,
  remove/clear handlers; `data-dragging`, `data-disabled` on root; sub-components: `FileUpload.Root`,
  `FileUpload.Trigger`, `FileUpload.Input`, `FileUpload.List`, `FileUpload.Item`, `FileUpload.Clear`
- **Form** — form primitive with field-level validation, controlled/uncontrolled values, `onSubmit`/`onInvalid`,
  per-field `data-invalid`; sub-components: `Form.Root`, `Form.Field`, `Form.Label`, `Form.Control`, `Form.Message`,
  `Form.Submit`
- **MenuBar** — horizontal application menu with cascading submenus, arrow-key navigation, click-outside close;
  sub-components: `MenuBar.Root`, `MenuBar.Menu`, `MenuBar.Trigger`, `MenuBar.Content`, `MenuBar.Item`,
  `MenuBar.Separator`, `MenuBar.Sub`, `MenuBar.SubTrigger`, `MenuBar.SubContent`
- **NavigationMenu** — top-level navigation with hover-intent open/close, configurable `delayDuration` /
  `skipDelayDuration`, controlled/uncontrolled active item, `data-state` on Trigger/Content, `data-active` on Link;
  sub-components: `NavigationMenu.Root`, `NavigationMenu.List`, `NavigationMenu.Item`, `NavigationMenu.Trigger`,
  `NavigationMenu.Content`, `NavigationMenu.Link`
- **NumberInput** — numeric input with increment/decrement controls, `min`/`max`/`step`, mouse-wheel and keyboard
  adjustment, controlled/uncontrolled state; sub-components: `NumberInput.Root`, `NumberInput.Field`,
  `NumberInput.Increment`, `NumberInput.Decrement`
- **Pagination** — page-navigation control with previous/next, page items, optional ellipsis, configurable
  `siblingCount` and `boundaryCount`; `aria-current="page"` on the active page
- **Popover** — floating panel anchored to a trigger with portal rendering, click-outside and Escape close,
  configurable `side` and `align`, controlled/uncontrolled; sub-components: `Popover.Root`, `Popover.Trigger`,
  `Popover.Portal`, `Popover.Content`, `Popover.Close`
- **ResizablePanels** — split-pane layout with draggable handles, `direction="horizontal" | "vertical"`, per-panel
  `defaultSize` / `minSize` / `maxSize`, controlled sizes; sub-components: `ResizablePanels.Root`,
  `ResizablePanels.Panel`, `ResizablePanels.Handle`
- **Skeleton** — animated placeholder block for loading states; `data-loading` toggle; renders a styled `<span>` by
  default
- **Slider** — value selector with one or many thumbs, `min`/`max`/`step`, keyboard arrow nudging,
  `orientation="horizontal" | "vertical"`, controlled/uncontrolled; sub-components: `Slider.Root`, `Slider.Track`,
  `Slider.Range`, `Slider.Thumb`
- **Tabs** — tab list with controlled/uncontrolled active tab, arrow-key navigation, optional `loop` and `activationMode`
  (`automatic` | `manual`); sub-components: `Tabs.Root`, `Tabs.List`, `Tabs.Trigger`, `Tabs.Content`
- **Tag** — pill element with optional `Tag.Dismiss` button; `data-color` and `data-size` variant attributes
- **TagInput** — token-style input with keyboard-driven add (Enter/comma), Backspace-to-remove, paste-to-split,
  `maxTags`, controlled/uncontrolled values; sub-components: `TagInput.Root`, `TagInput.Input`, `TagInput.List`,
  `TagInput.Item`, `TagInput.Dismiss`
- **Toast** — notification system with imperative `toast()` API, auto-dismiss timer, configurable position and
  duration, swipe-to-dismiss, action and close slots; sub-components: `Toast.Provider`, `Toast.Viewport`, `Toast.Root`,
  `Toast.Title`, `Toast.Description`, `Toast.Action`, `Toast.Close`
- **TreeView** — hierarchical disclosure with expand/collapse, keyboard navigation, single- and multi-select,
  controlled/uncontrolled state; sub-components: `TreeView.Root`, `TreeView.Item`, `TreeView.Trigger`,
  `TreeView.Content`, `TreeView.Label`

#### Hooks

- **`useControllableState`** — unified controlled/uncontrolled state pattern with `value` / `defaultValue` / `onChange`
- **`useDebounce`** — debounced callback with configurable delay and a `cancel()` method
- **`useDisclosure`** — boolean state with `open` / `close` / `toggle` actions
- **`useFloating`** — anchored-positioning primitive used by Popover, Tooltip, DatePicker, and Combobox; computes
  `side`, `align`, and collision-aware coordinates
- **`useFocusTrap`** — contains keyboard focus within a referenced element while active
- **`useFocusVisible`** — tracks keyboard-vs-pointer focus for `data-focus-visible` styling
- **`useId`** — SSR-safe id generator with optional prefix
- **`useIntersectionObserver`** — observes element visibility with configurable `threshold` / `rootMargin`
- **`useKeyboard`** — declarative `keydown`/`keyup` handler with key-combo matching
- **`useMediaQuery`** — reactive boolean matching a CSS media query
- **`useMergedRefs`** — composes multiple refs onto a single element
- **`useReduceMotion`** — reactive `prefers-reduced-motion` boolean
- **`useResizeObserver`** — observes element size with debounced callback
- **`useScrollLock`** — locks page scroll while active (used by Modal, Drawer)
- **`useThrottle`** — throttled callback with leading/trailing options

### Fixed

- **NavigationMenu** — moving the cursor from the Trigger into the Content no longer closes the menu. The close timer
  was hoisted from per-Trigger/per-Content refs to a single timer on `Root` so either piece can cancel it on
  `pointerenter`. Previously, Content's `pointerenter` cleared its own (null) timer while Trigger's pending close timer
  kept running and shut the menu.

## [0.1.6] - 2026-04-07

### Remove

#### Components

-**Spinner** — Deprecate the spinner, its not part of primitive components.

## [0.1.4] - 2026-03-29

### Added

#### Components

- **Accordion** — collapsible sections with `single` and `multiple` selection types, controlled/uncontrolled state,
  `collapsible` mode, per-item and root `disabled` support, and `data-state` on Item, Trigger, and Content
- **Alert** — dismissible alert with `data-status`, auto-dismiss timer (`isAutoDismissable`, `dismissDuration`), and
  `onDismiss` callback; sub-components: `Alert.Root`, `Alert.Title`, `Alert.Description`, `Alert.Dismiss`
- **Avatar** — image with lazy-loading fallback; `data-status` reflects `loading` / `loaded` / `error`; sub-components:
  `Avatar.Root`, `Avatar.Image`, `Avatar.Fallback`
- **Badge** — numeric count badge capped at 9+; renders nothing for counts ≤ 0; exposes raw value via `data-count`
- **Button** — native `<button>` with full interactive state tracking (`data-hover`, `data-focus-visible`,
  `data-active`, `data-disabled`, `data-autofocus`); `asChild` prop merges all props onto a child element for
  polymorphic rendering; `type`, `disabled`, `autoFocus` forwarded to the DOM element
- **Card** — unstyled container element with optional `data-color` and `data-size` variant attributes
- **Checkbox** — multi-select checkbox group; controlled via `value: (string | number)[]` and `onChange`;
  sub-components: `Checkbox.Root`, `Checkbox.Item`, `Checkbox.Indicator`, `Checkbox.Label`
- **Divider** — horizontal or vertical separator; `orientation` prop; `decorative` prop (default `true`) toggles between
  `role="none"` / `aria-hidden` and `role="separator"` / `aria-orientation`
- **Drawer** — side-panel overlay with portal rendering, overlay-click and Escape key close, controlled/uncontrolled
  state; sub-components: `Drawer.Root`, `Drawer.Portal`, `Drawer.Overlay`, `Drawer.Content`, `Drawer.Header`,
  `Drawer.Close`
- **Dropdown** — trigger + menu pattern with click-outside close, Escape key close, `aria-expanded` on trigger,
  `data-state` on menu; sub-components: `Dropdown.Root`, `Dropdown.Trigger`, `Dropdown.Menu`
- **Icon** — renders consumer-supplied SVG strings by name; `aria-hidden` by default; `label` prop makes it accessible;
  `size` prop sets `data-size`; ships no SVG assets
- **Image** — image wrapper with loader placeholder shown until load event; `data-loaded` on img after load;
  `data-position` on wrapper; `onImageLoaded` callback
- **Input** — text input with consumer-controlled error state via `invalidType`; `data-active` / `data-invalid` /
  `data-success` on the field element, `aria-invalid` and `aria-required`; sub-components: `Input.Root`, `Input.Field`,
  `Input.Label`, `Input.Error`
- **List** — ordered or unordered list container; `isOrdered` prop; `data-type`, `data-striped`, `data-divider`,
  `data-size` variant attributes
- **Modal** — dialog with portal rendering, overlay-click and Escape key close, `role="dialog"`, `aria-modal="true"`,
  `data-state` on Overlay and Content, controlled/uncontrolled state; sub-components: `Modal.Root`, `Modal.Portal`,
  `Modal.Overlay`, `Modal.Content`, `Modal.Close`
- **OTP** — one-time password input with individual slot elements, auto-advance on type, Backspace handling,
  `onComplete` callback, alphanumeric mode, `data-complete` on root; sub-components: `OTP.Root`, `OTP.Slot`,
  `OTP.Separator`
- **Password** — password input compound component with built-in show/hide toggle; consumer-controlled error state via
  `invalidType`; `data-visible` on Toggle when visible; sub-components: `Password.Root`, `Password.Field`,
  `Password.Toggle`, `Password.Label`, `Password.Error`
- **ProgressBar** — `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`; value clamped to
  `[min, max]`; inner fill width set via inline style; `data-size`
- **Radio** — single-selection radio group; controlled via `value` and `onChange`; `name` attribute shared across items;
  `disabled` per-item or on root; sub-components: `Radio.Root`, `Radio.Item`, `Radio.Indicator`, `Radio.Label`
- **Rating** — star rating component; `max` prop (default 5); hover preview; `readOnly` (renders `role="img"`) and
  `disabled` modes; controlled/uncontrolled
- **Search** — search input with dropdown results, keyboard navigation (ArrowUp/Down, Enter, Escape), `data-highlighted`
  on active item, `loading` state (`data-loading` on root), `onSearchChange`, `onSelect`, `searchDelay`; sub-components:
  `Search.Root`, `Search.Input`, `Search.Content`, `Search.Item`, `Search.Empty`
- **Select** — accessible select menu with groups, separators, and a custom trigger; sub-components: `Select.Root`,
  `Select.Trigger`, `Select.Value`, `Select.Content`, `Select.Item`, `Select.Group`, `Select.GroupLabel`,
  `Select.Separator`
- **Spinner** — animated 12-dot loading indicator; `role="status"` with `aria-label="Loading"`; `size` prop
  (`small | medium | large`); `color` prop sets `--spinner-color` CSS variable
- **Switch** — toggle with a thumb element; `data-state` (`checked` / `unchecked`), `data-disabled`; sub-components:
  `Switch.Root`, `Switch.Thumb`
- **Textarea** — multi-line text input with same consumer-controlled error state as Input; sub-components:
  `Textarea.Root`, `Textarea.Field`, `Textarea.Label`, `Textarea.Error`
- **Timeago** — relative timestamp (`isDuration` mode: "Just Now", "5 minutes ago", "2 hours ago") and formatted display
  ("Today, 09:00", full date); accepts `Date`, ISO string, or numeric timestamp; live-updating via `setInterval`
- **Tooltip** — hover/focus tooltip with configurable `delayDuration` and `side` (`top | bottom | left | right`);
  `data-state` and `data-side` on Content; controlled/uncontrolled

#### Hooks

- **`useInteractiveState`** — publicly exported hook tracking hover, keyboard-focus (`data-focus-visible`), and press
  (`data-active`) state; returns `handlers`, `dataAttributes`, and raw boolean values; used internally by Button,
  Accordion.Trigger, Modal.Close, and Drawer.Close
- **`useClickOutside`** — fires a callback when a pointer event occurs outside a referenced element

#### Infrastructure

- Vite library build (`es` and `cjs` formats) with React and react-dom externalized
- TypeScript declaration output alongside compiled library
- Storybook for component development and documentation
- Vitest + React Testing Library unit test suite (27 test files, 280 tests)
- ESLint + Prettier code quality tooling
- `mergeProps` utility for composing event handler objects without overwriting consumer handlers
