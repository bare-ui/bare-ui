# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.1] - 2026-03-29

### Added

#### Components

- **Accordion** — collapsible sections with `single` and `multiple` selection types, controlled/uncontrolled state, `collapsible` mode, per-item and root `disabled` support, and `data-state` on Item, Trigger, and Content
- **Alert** — dismissible alert with `data-status`, auto-dismiss timer (`isAutoDismissable`, `dismissDuration`), and `onDismiss` callback; sub-components: `Alert.Root`, `Alert.Title`, `Alert.Description`, `Alert.Dismiss`
- **Avatar** — image with lazy-loading fallback; `data-status` reflects `loading` / `loaded` / `error`; sub-components: `Avatar.Root`, `Avatar.Image`, `Avatar.Fallback`
- **Badge** — numeric count badge capped at 9+; renders nothing for counts ≤ 0; exposes raw value via `data-count`
- **Button** — native `<button>` with full interactive state tracking (`data-hover`, `data-focus-visible`, `data-active`, `data-disabled`, `data-autofocus`); `asChild` prop merges all props onto a child element for polymorphic rendering; `type`, `disabled`, `autoFocus` forwarded to the DOM element
- **Card** — unstyled container element with optional `data-color` and `data-size` variant attributes
- **Checkbox** — multi-select checkbox group; controlled via `value: (string | number)[]` and `onChange`; sub-components: `Checkbox.Root`, `Checkbox.Item`, `Checkbox.Indicator`, `Checkbox.Label`
- **Divider** — horizontal or vertical separator; `orientation` prop; `decorative` prop (default `true`) toggles between `role="none"` / `aria-hidden` and `role="separator"` / `aria-orientation`
- **Drawer** — side-panel overlay with portal rendering, overlay-click and Escape key close, controlled/uncontrolled state; sub-components: `Drawer.Root`, `Drawer.Portal`, `Drawer.Overlay`, `Drawer.Content`, `Drawer.Header`, `Drawer.Close`
- **Dropdown** — trigger + menu pattern with click-outside close, Escape key close, `aria-expanded` on trigger, `data-state` on menu; sub-components: `Dropdown.Root`, `Dropdown.Trigger`, `Dropdown.Menu`
- **Icon** — renders consumer-supplied SVG strings by name; `aria-hidden` by default; `label` prop makes it accessible; `size` prop sets `data-size`; ships no SVG assets
- **Image** — image wrapper with loader placeholder shown until load event; `data-loaded` on img after load; `data-position` on wrapper; `onImageLoaded` callback
- **Input** — text input with consumer-controlled error state via `invalidType`; `data-active` / `data-invalid` / `data-success` on the field element, `aria-invalid` and `aria-required`; sub-components: `Input.Root`, `Input.Field`, `Input.Label`, `Input.Error`
- **List** — ordered or unordered list container; `isOrdered` prop; `data-type`, `data-striped`, `data-divider`, `data-size` variant attributes
- **Modal** — dialog with portal rendering, overlay-click and Escape key close, `role="dialog"`, `aria-modal="true"`, `data-state` on Overlay and Content, controlled/uncontrolled state; sub-components: `Modal.Root`, `Modal.Portal`, `Modal.Overlay`, `Modal.Content`, `Modal.Close`
- **OTP** — one-time password input with individual slot elements, auto-advance on type, Backspace handling, `onComplete` callback, alphanumeric mode, `data-complete` on root; sub-components: `OTP.Root`, `OTP.Slot`, `OTP.Separator`
- **Password** — password input compound component with built-in show/hide toggle; consumer-controlled error state via `invalidType`; `data-visible` on Toggle when visible; sub-components: `Password.Root`, `Password.Field`, `Password.Toggle`, `Password.Label`, `Password.Error`
- **ProgressBar** — `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`; value clamped to `[min, max]`; inner fill width set via inline style; `data-size`
- **Radio** — single-selection radio group; controlled via `value` and `onChange`; `name` attribute shared across items; `disabled` per-item or on root; sub-components: `Radio.Root`, `Radio.Item`, `Radio.Indicator`, `Radio.Label`
- **Rating** — star rating component; `max` prop (default 5); hover preview; `readOnly` (renders `role="img"`) and `disabled` modes; controlled/uncontrolled
- **Search** — search input with dropdown results, keyboard navigation (ArrowUp/Down, Enter, Escape), `data-highlighted` on active item, `loading` state (`data-loading` on root), `onSearchChange`, `onSelect`, `searchDelay`; sub-components: `Search.Root`, `Search.Input`, `Search.Content`, `Search.Item`, `Search.Empty`
- **Select** — accessible select menu with groups, separators, and a custom trigger; sub-components: `Select.Root`, `Select.Trigger`, `Select.Value`, `Select.Content`, `Select.Item`, `Select.Group`, `Select.GroupLabel`, `Select.Separator`
- **Spinner** — animated 12-dot loading indicator; `role="status"` with `aria-label="Loading"`; `size` prop (`small | medium | large`); `color` prop sets `--spinner-color` CSS variable
- **Switch** — toggle with a thumb element; `data-state` (`checked` / `unchecked`), `data-disabled`; sub-components: `Switch.Root`, `Switch.Thumb`
- **Textarea** — multi-line text input with same consumer-controlled error state as Input; sub-components: `Textarea.Root`, `Textarea.Field`, `Textarea.Label`, `Textarea.Error`
- **Timeago** — relative timestamp (`isDuration` mode: "Just Now", "5 minutes ago", "2 hours ago") and formatted display ("Today, 09:00", full date); accepts `Date`, ISO string, or numeric timestamp; live-updating via `setInterval`
- **Tooltip** — hover/focus tooltip with configurable `delayDuration` and `side` (`top | bottom | left | right`); `data-state` and `data-side` on Content; controlled/uncontrolled

#### Hooks

- **`useInteractiveState`** — publicly exported hook tracking hover, keyboard-focus (`data-focus-visible`), and press (`data-active`) state; returns `handlers`, `dataAttributes`, and raw boolean values; used internally by Button, Accordion.Trigger, Modal.Close, and Drawer.Close
- **`useClickOutside`** — fires a callback when a pointer event occurs outside a referenced element

#### Infrastructure

- Vite library build (`es` and `cjs` formats) with React and react-dom externalized
- TypeScript declaration output alongside compiled library
- Storybook for component development and documentation
- Vitest + React Testing Library unit test suite (27 test files, 280 tests)
- ESLint + Prettier code quality tooling
- `mergeProps` utility for composing event handler objects without overwriting consumer handlers
