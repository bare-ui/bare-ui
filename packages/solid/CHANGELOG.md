# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.5.0] - 2026-06-20

Cross-cutting quality pass — accessibility, performance, SSR, security, i18n, and cross-framework parity. No new
components; this release hardens the existing surface.

### Added

#### Internationalization

- **`WireUIProvider`** — provider propagating `locale` and a `messages` catalog to locale-aware components
  (Calendar, DatePicker, NumberInput, Timeago, …); exports `useWireUILocale`, `useWireUIMessages`, `useWireUI`,
  `DEFAULT_LOCALE`, and `WireUIContext`, plus the `WireUIProviderProps` / `WireUIContextValue` types
- **Intl formatters** — `formatDate`, `formatNumber`, `formatRelativeTime`, `parseLocaleNumber`, `getDayNames`,
  `getMonthNames`, and the memoized `Intl` factory helpers `getDateTimeFormat` / `getNumberFormat` /
  `getRelativeTimeFormat`; delegate to the platform `Intl` APIs with **no bundled locale data**
- **Message catalog** — `defaultMessages` and `mergeMessages` for overriding built-in strings, with the `WireUIMessages`
  / `PartialMessages` types

#### Primitives

- **`createDirection`** — resolves the nearest ancestor's text direction (`'ltr'` / `'rtl'`) for an element accessor and
  reacts to later `dir` changes; ships alongside the static `getDirection` / `isRtl` helpers and the `Direction` type

#### Security

- **`sanitizeUrl`** — exported URL sanitizer (strips `javascript:` / `vbscript:` / unsafe `data:` / `file:` schemes) for
  reuse in custom Markdown / CodeBlock / Citation renderers, with the `SanitizeUrlOptions` type

#### Components

- **TagInput.Tag** — convenience sub-component rendering a labelled tag with a built-in remove button (accessible name
  defaults to `Remove {label}`); moves focus to the adjacent remove button after removal

#### Tooling & tests

- **Quality scripts** in `package.json`: `typecheck` (`tsc -b`), `size` (size-limit per-component budgets), `attw`
  (`@arethetypeswrong/cli` export-map check), `bench` / `bench:mount` / `bench:ssr` (render benchmark suite vs Kobalte /
  Corvu, with separate DOM and SSR configs since the Solid compiler emits different output per mode), `compiler:check`
  (`scripts/compiler-check.mjs` — transpiles every `.tsx` through the Babel Solid preset in both DOM and SSR modes), and
  `license:check` (permissive-license guardrail); split test scripts `test:unit`, `test:sr`, `test:parity`, `test:a11y`,
  `test:ssr`, `test:hydrate`
- **Accessibility tests** — a `.sr.test.tsx` screen-reader suite for all 70 components plus shared `src/test/sr.ts`
  helpers; axe-core runs through a Storybook browser test project (`a11y.test = 'error'`)
- **2-phase SSR / hydration tests** — dedicated `vitest.ssr.config.ts` (node, no DOM) and `vitest.hydrate.config.ts`
  (jsdom, real `hydrate()` replay that fails on any hydration mismatch), with shared `scenarios` / fixtures
- **RTL** (`src/test/rtl.test.tsx`), **behavioral parity** (`src/test/parity/*` — same scenarios run against
  React/Vue/Solid), **`create-direction`** / **`create-menu-navigation`** primitive tests, and **i18n formatter** /
  **sanitize-url** unit tests

### Changed

- **Package `exports` map** — build output renamed to `dist/index.js` (ESM), `dist/index.cjs` (CJS), and
  `dist/index.d.ts` / `dist/index.d.cts`, with a conditional `import` / `require` exports map carrying per-condition
  types (the `solid` export condition now points at `dist/index.js`). `main` / `module` updated accordingly. Improves
  Node16/ESM resolution and `@arethetypeswrong/cli` correctness; consumers using the documented package entry are
  unaffected, but deep imports of the old `wire-ui-solid.es.js` / `wire-ui-solid.cjs.js` filenames must update
- **RTL support** — interactive components resolve text direction via `createDirection` and mirror arrow-key navigation
  and positioning under `dir="rtl"`
- **Localization** — components no longer hard-code user-facing English strings; they read from the `messages` context
  (with `defaultMessages` fallback) and format dates / numbers / relative time through the locale-aware formatters
- **URL sanitization** — Markdown, CodeBlock, and Citation sanitize `href` / `src` output by default (Icon SVG remains
  the one documented opt-in raw path)
- **NavigationMenu** — opens on ArrowDown (focusing the first link) and restores focus to the trigger on Escape,
  matching React / Vue
- **TypeScript strict mode** — production `src` is free of `any` and `@ts-ignore` / `@ts-expect-error`

### Fixed

- **SSR / hydration** — eliminated hydration mismatches and `console.error`s across examples (deterministic ids, guarded
  browser-only access in client-only effects, portals that emit nothing on the server and first client render)

## [0.4.0] - 2026-05-30

### Added

#### Components

- **Carousel** — snap-scrolling carousel with `orientation="horizontal" | "vertical"`, optional `loop`,
  controlled/uncontrolled active index (`defaultIndex` / `onIndexChange`), and arrow-key navigation; `data-orientation`
  on root; sub-components: `Carousel.Root`, `Carousel.Viewport`, `Carousel.Content`, `Carousel.Slide`,
  `Carousel.Previous`, `Carousel.Next`, `Carousel.Indicators` (children-as-function with `{ index, selected, scrollTo }`)
- **Chat** — streaming-aware chat surface with a virtualized message list, auto-growing composer, and
  controlled/uncontrolled input (`value` / `defaultValue` / `onValueChange` / `onSubmit`); `isStreaming` toggles
  `data-streaming`, list supports `stickToBottom` and `overscan`; sub-components: `Chat.Root`, `Chat.List`,
  `Chat.Message` (per-message `role` + `streaming` → `data-role` / `data-streaming`), `Chat.Composer`, `Chat.Input`
  (`submitOnEnter`, `autoResize`), `Chat.Send`
- **Citation** — footnote-style references with auto-numbering and bidirectional anchors from a `sources` array; refs
  render `role="doc-noteref"`, footnotes `role="doc-endnote"`, `data-index` on both; sub-components: `Citation.Root`,
  `Citation.Ref` (`for` source id, children-as-function or default `<sup>`), `Citation.List` (children-as-function over
  sources)
- **CodeBlock** — code display with line numbers (`startLine`), per-line `diff` markers, `highlightLines`, and
  copy-to-clipboard (`copyResetAfter`); `data-language` on root and `<pre>`; sub-components: `CodeBlock.Root`,
  `CodeBlock.Code`, `CodeBlock.Lines` (children-as-function with `{ line }` carrying `{ number, content, diff, highlighted }`),
  `CodeBlock.CopyButton` (children-as-function with `{ copied }`)
- **ColorPicker** — HSVA color picker with pointer-drag saturation/value area, hue and alpha tracks, controlled value
  as a hex string (`value` / `defaultValue` / `onChange`), and toggleable `alpha`; sub-components: `ColorPicker.Root`,
  `ColorPicker.Area`, `ColorPicker.AreaThumb`, `ColorPicker.Hue`, `ColorPicker.HueThumb`, `ColorPicker.Alpha`,
  `ColorPicker.AlphaThumb`, `ColorPicker.Swatch`, `ColorPicker.Input`
- **Command** — command palette with fuzzy `filter`, roving arrow-key navigation (`loop`), optional global `shortcut`
  (e.g. `mod+k`), controlled search (`searchValue` / `onSearchChange`) and open state; `data-active` on the active
  item; sub-components: `Command.Root`, `Command.Input`, `Command.List`, `Command.Group` (optional `heading`),
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
- **HoverCard** — richer hover-triggered floating card with configurable `openDelay` / `closeDelay`, `side` /
  `sideOffset`, `forceMount`, and controlled/uncontrolled open state; sub-components: `HoverCard.Root`,
  `HoverCard.Trigger`, `HoverCard.Content`
- **InfiniteScroll** — sentinel-based load-more primitive built on [[create-intersection-observer]]; fires `onLoadMore`
  when the sentinel enters view while `hasMore && !loading && !disabled`, with configurable `rootMargin`; `data-loading`
  and `data-has-more` on root; sub-components: `InfiniteScroll.Root`, `InfiniteScroll.Sentinel`,
  `InfiniteScroll.Loader`, `InfiniteScroll.EndMessage`
- **Markdown** — parser-agnostic Markdown renderer that accepts a pre-parsed `nodes` tree or raw `content` + `parse`
  function, with a `components` override map keyed by mdast node type; default renderers emit semantic HTML for
  paragraphs, headings, lists, code, links, images, blockquotes, and inline marks
- **Mention** — inline `@`-mention input with caret-aware suggestion detection over an `options` list, custom
  `trigger` and `filter`, `appendSpace`, and `onSelect`; controlled/uncontrolled value; sub-components: `Mention.Root`,
  `Mention.Input` (textarea), `Mention.Content`, `Mention.Items` (children-as-function with `{ option, active, index }`),
  `Mention.Empty`
- **RichText** — slot-based Markdown editor scaffold built on [[Markdown]] with `edit` / `preview` / `split` modes,
  selection-wrapping and text-insertion actions, and a controlled Markdown `value`; sub-components: `RichText.Root`,
  `RichText.Toolbar`, `RichText.Action` (`wrap` / `insert`), `RichText.Editor`, `RichText.Preview`
- **ScrollArea** — scroll container with a custom, styleable scrollbar; independent vertical/horizontal scrollbars with
  draggable thumbs and live `metrics` via `ResizeObserver`; `forceMount` to render bars without overflow;
  sub-components: `ScrollArea.Root`, `ScrollArea.Viewport`, `ScrollArea.Scrollbar` (`orientation`), `ScrollArea.Thumb`
- **Sheet** — drawer-adjacent sliding panel with `side="top" | "bottom"`, `snapPoints` (viewport-fraction when ≤ 1, px
  when > 1), drag-to-dismiss via a handle, optional `modal` backdrop with focus trap and scroll lock, and
  controlled/uncontrolled open + active snap point; sub-components: `Sheet.Root`, `Sheet.Trigger`, `Sheet.Portal`,
  `Sheet.Overlay`, `Sheet.Content`, `Sheet.Handle`, `Sheet.Title`, `Sheet.Description`, `Sheet.Close`
- **Stat** — KPI / metric display with label, value, delta (direction auto-inferred from sign, `data-direction`), help
  text, and an SVG `Sparkline`; root carries `role="group"`; sub-components: `Stat.Root`, `Stat.Label`, `Stat.Value`,
  `Stat.Delta`, `Stat.HelpText`, `Stat.Sparkline` (`data`, `width`, `height`, `strokeWidth`)
- **Stepper** — multi-step / wizard flow with `count`, controlled/uncontrolled 0-based active step,
  `orientation="horizontal" | "vertical"`, and `linear` mode that blocks forward jumps; per-step state
  (`active` / `completed` / `inactive`), `data-orientation` on root; sub-components: `Stepper.Root`, `Stepper.List`,
  `Stepper.Item`, `Stepper.Trigger`, `Stepper.Separator`, `Stepper.Content` (`forceMount`), `Stepper.PrevTrigger`,
  `Stepper.NextTrigger` (auto-disabled at boundaries)
- **Toggle** — two-state pressable button with `pressed` / `defaultPressed` / `onPressedChange`, `aria-pressed`, and
  `data-state` (`on` / `off`); ships with **ToggleGroup** for `single` / `multiple` selection with roving focus,
  arrow-key navigation, `loop`, and `orientation`; sub-components: `Toggle`, `ToggleGroup.Root`. Group items are the
  standalone `Toggle` given a `value` prop — inside a `ToggleGroup.Root` the group owns the pressed state via context
  (Solid has no separate `ToggleGroup.Item`)
- **Toolbar** — accessible `role="toolbar"` container with roving focus and arrow-key navigation,
  `orientation="horizontal" | "vertical"`, and `loop`; sub-components: `Toolbar.Root`, `Toolbar.Button`,
  `Toolbar.Toggle` (`pressed` / `onPressedChange`, `data-state`), `Toolbar.Link`, `Toolbar.Separator`
- **Typewriter** — token-by-token text reveal with `char` / `word` granularity, configurable `speed`, `startDelay`,
  `autoStart`, `loop` / `loopDelay`, streaming-friendly growing `text`, and `onComplete`; children-as-function state
  `{ displayed, isTyping, isDone, progress }`; respects `prefers-reduced-motion` (reveals instantly); sub-components:
  `Typewriter.Root`, `Typewriter.Text`, `Typewriter.Cursor`
- **Virtualizer** — windowing primitive for large lists with `count`, `estimateSize`, `overscan`,
  `orientation="vertical" | "horizontal"`, and stable `getItemKey`; dynamic per-item measurement via `ResizeObserver`
  with prefix-sum offsets, children-as-function receiving `VirtualItem` (`{ index, start, size }`) and `data-index` on
  items; sub-component: `Virtualizer.Root`

## [0.3.0] - 2026-05-23

### Added

#### Primitives

- **`createCopyToClipboard`** — clipboard write helper returning `{ copy, copied, error }`; configurable auto-reset
  timeout for the `copied` flag
- **`createDocumentVisibility`** — reactive `document.visibilityState` accessor; SSR-safe with a sensible default
- **`createElementSize`** — live content-box `{ width, height }` of a referenced element via `ResizeObserver`
- **`createEventListener`** — typed `addEventListener` subscription for `window`, `document`, elements, or refs;
  accepts `null` targets for conditional binding; auto-cleans on dispose
- **`createHotkeys`** — declarative keyboard-shortcut binder with combo matching (e.g. `mod+k`, `shift+/`),
  `enableOnFormTags`, and `preventDefault` options
- **`createInterval`** — `setInterval` wrapper with pause/resume/reset controls; pass `null` delay to halt
- **`createLocalStorage`** / **`createSessionStorage`** — Solid signal–shaped primitives backed by `localStorage` /
  `sessionStorage` with cross-tab sync, custom serializer/deserializer, and SSR-safe initial value
- **`createLongPress`** — long-press gesture handler with configurable `threshold`, `onStart`/`onFinish`/`onCancel`
  callbacks, and pointer/touch support
- **`createMutationObserver`** — observes DOM mutations on a referenced element with full `MutationObserverInit`
  options
- **`createOnlineStatus`** — reactive `navigator.onLine` accessor with SSR-safe default
- **`createPrevious`** — returns the value from the previous tracked update
- **`createStateMachine`** — finite-state-machine primitive with `states`, `events`, `transitions`, and guarded
  transitions
- **`createTimeout`** — `setTimeout` wrapper with `start`/`clear`/`reset` controls and `isPending` accessor
- **`createUndoRedo`** — state container with bounded history; exposes `undo`, `redo`, `canUndo`, `canRedo`, `clear`
- **`createWindowSize`** — reactive `{ width, height }` of the viewport with SSR-safe default

### Changed

- **Alert** — auto-dismiss timer now uses [[create-timeout]] instead of inline `setTimeout` bookkeeping
- **Avatar** — fallback show-delay timer now uses [[create-timeout]]
- **Timeago** — periodic re-render now uses [[create-interval]] instead of a manual `setInterval`
- **Tooltip** — show/hide delay timers now use [[create-timeout]]
- **`createInterval`** / **`createTimeout`** — accept omitted/`undefined` delay arguments and treat them as paused
  instead of throwing

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
- **ContextMenu** — right-click menu rendered into a `<Portal>` at the pointer position, Escape and click-outside
  close, keyboard navigation; sub-components: `ContextMenu.Root`, `ContextMenu.Trigger`, `ContextMenu.Content`,
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
- **ResizablePanels** — split-pane layout with draggable handles, `direction="horizontal" | "vertical"`, per-panel
  `defaultSize` / `minSize` / `maxSize`, controlled sizes; sub-components: `ResizablePanels.Root`,
  `ResizablePanels.Panel`, `ResizablePanels.Handle`
- **Skeleton** — animated placeholder block for loading states; `data-loading` toggle; renders a styled `<span>` by
  default
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

#### Primitives

- **`createControllableState`** — unified controlled/uncontrolled state pattern with `value` / `defaultValue` /
  `onChange`
- **`createDebounce`** — debounced callback with configurable delay and a `cancel()` method
- **`createDisclosure`** — boolean state signal with `open` / `close` / `toggle` actions
- **`createFloating`** — anchored-positioning primitive used by Tooltip, DatePicker, and Combobox; computes `side`,
  `align`, and collision-aware coordinates
- **`createFocusTrap`** — contains keyboard focus within a referenced element while active
- **`createFocusVisible`** — tracks keyboard-vs-pointer focus for `data-focus-visible` styling
- **`createId`** — SSR-safe id generator with optional prefix
- **`createIntersectionObserver`** — observes element visibility with configurable `threshold` / `rootMargin`
- **`createKeyboard`** — declarative `keydown`/`keyup` handler with key-combo matching
- **`createMediaQuery`** — reactive boolean matching a CSS media query
- **`createMergedRefs`** — composes multiple refs onto a single element
- **`createReduceMotion`** — reactive `prefers-reduced-motion` boolean
- **`createResizeObserver`** — observes element size with debounced callback
- **`createScrollLock`** — locks page scroll while active (used by Modal, Drawer)
- **`createThrottle`** — throttled callback with leading/trailing options

### Fixed

- **NavigationMenu** — moving the cursor from the Trigger into the Content no longer closes the menu. The close timer
  was hoisted from per-Trigger/per-Content locals to a single timer on `Root` so either piece can cancel it on
  `pointerenter`. Previously, Content's `pointerenter` cleared its own (null) timer while Trigger's pending close timer
  kept running and shut the menu.

## [0.1.0] - 2026-04-29

Initial release of `@wire-ui/solid` — 26 components and 2 primitives ported from `@wire-ui/react` with full
behavioural and data-attribute parity. Targets SolidJS 1.9.

### Added

#### Components

- **Accordion** — collapsible sections with `single` and `multiple` selection types, controlled/uncontrolled state,
  `collapsible` mode, per-item and root `disabled` support, and `data-state` on Item, Trigger, and Content
- **Alert** — dismissible alert with `data-status`, auto-dismiss timer (`isAutoDismissable`, `dismissCountdown`), and
  `onDismiss` callback; sub-components: `Alert.Root`, `Alert.Title`, `Alert.Description`, `Alert.Dismiss`
- **Avatar** — image with lazy-loading fallback; `data-status` reflects `loading` / `loaded` / `error`; sub-components:
  `Avatar.Root`, `Avatar.Image`, `Avatar.Fallback`
- **Badge** — numeric count badge capped at 9+; renders nothing for counts ≤ 0; exposes raw value via `data-count`
- **Button** — native `<button>` with full interactive state tracking (`data-hover`, `data-focus-visible`,
  `data-active`, `data-disabled`, `data-autofocus`); `asChild` prop renders the child element directly and applies
  data-attributes / event listeners imperatively (Solid evaluates JSX children to DOM nodes, so cloning is replaced
  with `setAttribute` + `addEventListener`); `type`, `disabled`, `autofocus` forwarded to the DOM element
- **Card** — unstyled container element with optional `data-color` and `data-size` variant attributes
- **Checkbox** — multi-select checkbox group; controlled via `value: (string | number)[]` and `onChange`;
  sub-components: `Checkbox.Root`, `Checkbox.Item`, `Checkbox.Indicator`, `Checkbox.Label`
- **Divider** — horizontal or vertical separator; `orientation` prop; `decorative` prop (default `true`) toggles between
  `role="none"` / `aria-hidden` and `role="separator"` / `aria-orientation`
- **Drawer** — side-panel overlay rendered via `<Portal>` from `solid-js/web`, overlay-click and Escape key close,
  controlled/uncontrolled state; sub-components: `Drawer.Root`, `Drawer.Portal`, `Drawer.Overlay`, `Drawer.Content`,
  `Drawer.Header`, `Drawer.Close`
- **Dropdown** — trigger + menu pattern with click-outside close, Escape key close, `aria-expanded` on trigger,
  `data-state` on menu; sub-components: `Dropdown.Root`, `Dropdown.Trigger`, `Dropdown.Menu`
- **Icon** — renders consumer-supplied SVG strings by name via `innerHTML`; `aria-hidden` by default; `label` prop makes
  it accessible; `size` prop sets `data-size`; ships no SVG assets
- **Image** — image wrapper with loader placeholder shown until load event; `data-loaded` on img after load;
  `data-position` on wrapper; `onImageLoaded` callback
- **Input** — text input with consumer-controlled error state via `invalidType`; `data-active` / `data-invalid` /
  `data-success` on the field element, `aria-invalid` and `aria-required`; sub-components: `Input.Root`, `Input.Field`,
  `Input.Label`, `Input.Error`
- **List** — ordered or unordered list container (renders via `<Dynamic>` from `solid-js/web`); `isOrdered` prop;
  `data-type`, `data-striped`, `data-divider`, `data-size` variant attributes
- **Modal** — dialog rendered via `<Portal>` from `solid-js/web`, overlay-click and Escape key close, `role="dialog"`,
  `aria-modal="true"`, `data-state` on Overlay and Content, controlled/uncontrolled state; sub-components: `Modal.Root`,
  `Modal.Portal`, `Modal.Overlay`, `Modal.Content`, `Modal.Close`
- **OTP** — one-time password input with individual slot elements, auto-advance on type, Backspace handling,
  `onComplete` callback, alphanumeric mode, `data-complete` on root; sub-components: `OTP.Root`, `OTP.Slot`,
  `OTP.Separator`
- **Password** — password input compound component with built-in show/hide toggle; consumer-controlled error state via
  `invalidType`; `data-visible` on Toggle when visible; sub-components: `Password.Root`, `Password.Field`,
  `Password.Toggle`, `Password.Label`, `Password.Error`
- **ProgressBar** — `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`; value clamped to
  `[0, 100]`; inner fill width set via inline style; `data-size`
- **Radio** — single-selection radio group; controlled via `value` and `onChange`; `name` attribute shared across items;
  `disabled` per-item or on root; sub-components: `Radio.Root`, `Radio.Item`, `Radio.Indicator`, `Radio.Label`
- **Rating** — star rating component; `max` prop (default 5); hover preview; `readOnly` (renders `role="img"`) and
  `disabled` modes; controlled/uncontrolled. The per-star `class` override is named `starClass` (Solid convention)
  rather than `starClassName`
- **Search** — search input with dropdown results, keyboard navigation (ArrowUp/Down, Enter, Escape), `data-highlighted`
  on active item, `loading` state (`data-loading` on root), `onSearchChange`, `onSelect`, `searchDelay`; sub-components:
  `Search.Root`, `Search.Input`, `Search.Content`, `Search.Item`, `Search.Empty`
- **Select** — accessible select menu with groups, separators, and a custom trigger; sub-components: `Select.Root`,
  `Select.Trigger`, `Select.Value`, `Select.Content`, `Select.Item`, `Select.Group`, `Select.GroupLabel`,
  `Select.Separator`
- **Switch** — toggle with a thumb element; `data-checked`, `data-disabled`; sub-components: `Switch.Root`,
  `Switch.Thumb`
- **Textarea** — multi-line text input with same consumer-controlled error state as Input; sub-components:
  `Textarea.Root`, `Textarea.Field`, `Textarea.Label`, `Textarea.Error`
- **Timeago** — relative timestamp (`isDuration` mode: "Just Now", "5 minutes ago", "2 hours ago") and formatted display
  ("Today, 09:00", full date); accepts `Date`, ISO string, or numeric timestamp; live-updating via `setInterval` driving
  a `tick` signal that a `createMemo` subscribes to
- **Tooltip** — hover/focus tooltip with configurable `delayDuration` and `side` (`top | bottom | left | right`);
  `data-state` and `data-side` on Content; controlled/uncontrolled

#### Primitives

- **`createInteractiveState`** — publicly exported primitive tracking hover, keyboard-focus (`data-focus-visible`), and
  press (`data-active`) state; returns `handlers`, reactive `dataAttributes`, and accessor signals (`isHovered`,
  `isFocusVisible`, `isActive`); used internally by Button, Accordion.Trigger, Modal.Close, Drawer.Close, and others.
  Accepts options as a plain object or an object with a `get disabled()` getter for reactive disabled state
- **`createClickOutside`** — fires a callback when a pointer event occurs outside a referenced element; takes an
  accessor function returning the element so the listener picks up ref changes after mount

#### Infrastructure

- Vite library build (`es` and `cjs` formats) with `solid-js`, `solid-js/web`, and `solid-js/store` externalized
- TypeScript declaration output alongside compiled library; `solid` export condition for bundlers that prefer
  the JSX-friendly entry
- Storybook 10 (`storybook-solidjs-vite`) for component development and documentation
- Vitest 4 + `@solidjs/testing-library` unit test suite (26 test files, 272 tests)
- ESLint 9 + `eslint-plugin-solid` + Prettier code quality tooling
- Per-package `mergeProps` utility implemented as a Proxy so consumer props (already reactive Solid Proxies via
  `splitProps`) keep their reactivity through the merge while still composing function-valued event handlers
