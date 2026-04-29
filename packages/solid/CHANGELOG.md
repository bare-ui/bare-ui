# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
