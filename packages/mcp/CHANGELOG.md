# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.5.1] - 2026-07-29

### Added

- **`contextOnlyParts`** on `ComponentData`, returned by `get_component`. Lists the parts that render no DOM element —
  context providers, portals, and render-prop passthroughs — so consumers know a `className` written there has nowhere
  to land and is silently dropped. Populated for `Modal` (`Root`, `Portal`), `Drawer` (`Root`, `Portal`), `Sheet`
  (`Root`, `Portal`), `Toast` (`Provider`), and `Diff` (`Stats`), each verified against all three libraries. The field
  is omitted for components where every part renders markup.

  `Carousel.Indicators` is deliberately excluded: it renders nothing in React and Solid, but Vue wraps its slot in a
  `display: contents` div, so the fact is not true across the three.

  This is what `@wire-ui/eslint-plugin`'s `misplaced-classname` rule and the TypeScript plugin's matching diagnostic
  read; adding a component here is all it takes to extend their coverage.

## [0.5.0] - 2026-07-28

Catches the MCP catalog up to the `0.5.0` releases of `@wire-ui/react`, `@wire-ui/solid`, and `@wire-ui/vue`. This release is
mostly corrections: several entries described parts and props that never existed, so `get_component` was handing AI tools code
that could not compile.

### Fixed

- **`Popover` and `Tabs` are no longer documented as React-only.** Both ship in all three libraries; the catalog claimed
  otherwise and shipped only a `react` snippet. Added the missing `solid` and `vue` snippets and dropped the stale notes.
- **Corrected compound `parts` that did not match the libraries.** Each of these was reported by `get_component` and would have
  produced non-existent components in generated code:
  - `Combobox` — `Item` → `Items` (a render prop; the options-driven API was undocumented)
  - `TagInput` — `Item`, `Dismiss`, `Input` → `Items`, `Tag`, `Field`
  - `FileUpload` — `List`, `Item`, `Clear` → `Items`
  - `Form` — `Message`, `Submit` → `Error` (there is no `Form.Submit`; use a plain `<button type="submit">`)
  - `Pagination` — `Button` → `Items`
  - `ResizablePanels` — `Root` → `Group` (and the axis prop is `orientation`, not `direction`)
  - `MenuBar` — removed `Sub`, `SubTrigger`, `SubContent`; MenuBar is a single level of menus
  - `Breadcrumb` — removed `Ellipsis`
  - `Toast` — removed `Action`
  - `TreeView` — removed `Item`, `Trigger`, `Content`, `Label`. TreeView is **not** compound: it is data-driven via `nodes` plus
    a `renderItem` render prop, and is now marked `isCompound: false`.
- **Corrected prop names** that were documented under names the libraries never used: `Tabs.Root.onValueChange` → `onChange`,
  `Pagination.Root.total`/`onPageChange` → `totalPages`/`onChange`, `Pagination.Item.value` → `page`,
  `Breadcrumb.Item.isCurrent` → `current`, `Form.Field.invalidType`/`isRequired` → `invalid`/`required`,
  `TreeView.Root.value`/`expandedValues` → `selected`/`expanded`, `Toast.Provider.duration` → `defaultDuration`.
- **Rewrote every affected `basicExample`** so the snippets compile against the real API, including the render-prop parts
  (`Combobox.Items`, `TagInput.Items`, `FileUpload.Items`, `Pagination.Items`, `Toast.Viewport`, `TreeView.renderItem`) and
  their Vue scoped-slot equivalents.
- Removed the `Popover.Portal` part and documented that `Content` renders in place.
- `Toast.Viewport`'s required render prop `(toast, dismiss) => ReactNode` is now documented; the old examples rendered
  `<Toast.Viewport />` with no children, which is invalid.

### Added

- **`direction` hook** — `useDirection` (React/Vue), `createDirection` (Solid), plus the synchronous `getDirection` and `isRtl`
  helpers. Previously absent from the catalog despite being public in all three libraries.
- **`is-mounted` hook** — Vue-only `useIsMounted`, for gating `<Teleport>` and other client-only output during hydration.
- **Completed a full `data-*` audit across all 70 components**, taking the catalog from 137 to 223 documented attributes. Since
  the `data-*` contract *is* the public API of a headless library, an under-reported attribute set is a wrong answer, not a
  merely incomplete one. Newly documented, among others:
  - Interactive-state attributes (`data-hover`, `data-focus-visible`, `data-active`, `data-disabled`) wherever a part uses the
    shared interactive-state primitive — `Checkbox.Item`, `Radio.Item`, `Switch.Root`, `Select.Trigger`/`Item`, `Search.Item`,
    `DatePicker.Trigger`, `Popover.Trigger`/`Close`, `Tabs.Trigger`.
  - Element markers that are the only styling hook for internally-rendered elements: `data-part` (`Slider` track/fill/thumb,
    `ProgressBar` fill, `Alert` title/description, `Image` loader/img), `data-toolbar-item`, `data-command-root`,
    `data-sheet-handle`, `data-scroll-area-scrollbar`/`-thumb`, `data-virtualizer-sizer`, `data-virtual-item`,
    `data-carousel-content`, `data-chat-item`, `data-chat-list-sizer`, `data-diff-line`, `data-diff-row`,
    `data-color-picker-*-thumb`.
  - Missing state attributes: `Select` `data-open`/`data-placeholder`/`data-highlighted`, `Calendar` `data-date`,
    `Rating` `data-readonly`, `Slider` `data-thumb-index`, `Dropdown` `data-position`, `Icon` `data-name`,
    `AspectRatio` `data-ratio`, `Divider` `data-orientation`, `Typewriter` `data-state`, `OTP` `data-disabled`,
    `Tag` `data-disabled`, `Checkbox` `data-indeterminate`, plus `data-taginput-tag`, `data-taginput-remove`, `data-panel`,
    `data-handle`, `data-menu-value`, `data-tree-toggle`, `data-level`, `data-has-children`, and `data-id`.
- Documented previously-missing props across the corrected components (for example `Combobox.options`/`filter`,
  `FileUpload.onReject`/`maxFiles`, `TagInput.validate`/`commitKeys`/`allowDuplicates`, `Tabs.activationMode`,
  `Pagination.boundaryCount`, `Popover.closeOnOutsideClick`/`closeOnEscape`).

- **Removed 10 phantom props that no library has ever accepted.** A second audit ran the comparison in the opposite direction —
  catalog entry → implementation — which surfaced props that existed only in the catalog. These are the most damaging kind of
  drift, because generated code compiles cleanly against the wrong name and then silently does nothing:
  - `Switch.Root.onCheckedChange` → the real callback is `onChange` (and `defaultChecked` was undocumented)
  - `Alert.Root.dismissDuration` → the real prop is `dismissCountdown` (default `3000`)
  - `Skeleton.isLoading` → the real prop is `loading`
  - `OTP.Root.alphanumeric` → not a prop at all; it is a *value* of `pattern: "numeric" | "alphanumeric"`
  - `Password.Root.isSuccess` and its `data-success` attribute → `Password` has no success state, only `invalidType`.
    (`Input` and `Textarea` do have `isSuccess`, which is likely where the entry was copied from.)
  - `Tag.Root.color` / `.size` / `.onRemove` and the `data-color` / `data-size` attributes → none exist. `Tag.Root` takes only
    `disabled`; the remove button is `Tag.Remove` with an `aria-label`.
- **Removed 6 further phantom props that a weaker first scan had missed**, and corrected two prop *names* that were wrong
  rather than merely absent. The first pass checked whether a documented prop name appeared anywhere in the component's source,
  which common words like `value`, `min`, and `name` satisfy incidentally; the second pass checked each prop against the
  members of its own part's exported `*Props` interface:
  - `Calendar.Root.min` / `.max` → the real props are `minDate` / `maxDate`
  - `Icon.name` → the selector prop is `type`. (`name` type-checks as SVG passthrough and silently does nothing, which is the
    worst possible failure mode: no compile error, no icon.)
  - `ProgressBar.value` / `.min` / `.max` → `ProgressBar` takes only `percentage` and `size`
- **Documented 30 props that existed in the libraries but not the catalog**, closing the last category of drift. Notably
  `Calendar.Root` was missing 6 of its 11 props (`defaultMonth`, `month`, `onMonthChange`, `isDateDisabled`, `weekStartsOn`,
  `locale`) plus both `Calendar.Grid` render props; `NavigationMenu.Root`'s entire controlled API (`value`, `defaultValue`,
  `onValueChange`, `skipDelayDuration`) was absent; and `Avatar.Fallback.delayMs`, `Accordion.Content.forceMount`,
  `Tooltip.Root`'s controlled API, `NumberInput`'s `Intl` formatting props, `Select.Item.textValue`, and
  `Checkbox.Item.indeterminate` were all undocumented.
- **Rewrote the `Spinner` entry, which was fabricated end to end.** It described an "animated 12-dot spinner" with `size` and
  `color` props, a `data-size` attribute, and a `--spinner-color` CSS variable — a component that would have violated the
  zero-CSS rule had it existed. The real `Spinner` is an accessibility wrapper (`role="status"`, `aria-live="polite"`) taking
  `label` and `decorative`, with no `data-*` at all; the consumer supplies the visual indicator as children.
- **`Switch` no longer documents a `data-state` attribute with `"checked" | "unchecked"` values — it never emitted one.** The
  real attribute is presence-based `data-checked` on `Root` and `Thumb`. This one had teeth: `@wire-ui/typescript-plugin` was
  offering `data-state="checked"` completions for `Switch`, so the editor was actively suggesting a selector that can never
  match. Its test fixtures encoded the same wrong data and have been re-pointed at `Accordion.Item`, which really does carry an
  enum-valued `data-state`.

### Hooks

- **`debounce` and `throttle` were documented as something they have never been.** Both were described as callback wrappers
  returning `{ execute, cancel, flush }` / `{ execute, cancel }` with `leading`/`trailing` options. Both are actually *value*
  debouncers/throttlers with the signature `<T>(value: T, delay: number) => T`. Every example in both entries — all six across
  the three frameworks — was unusable, and destructuring `{ execute }` from a debounced value fails at runtime rather than at
  compile time. Rewrote the descriptions, signatures, `returns`, and all six examples, and added notes pointing at
  `debounced-callback` / `throttled-callback` for the callback-wrapping behaviour the old entries described.
- `id`'s signature was missing its second parameter: `(prefix?: string, staticId?: string) => string`.
- Verified the framework-availability claims that were previously only asserted: `merged-refs` genuinely has no Vue
  composable, and `isomorphic-layout-effect` is genuinely React-only. Both notes stand.
- Verified all six split entries (`debounce`/`debounced-callback`, `throttle`/`throttled-callback`,
  `local-storage`/`session-storage`) are real, distinct exports in all three packages.

### Changed

- **`Accordion` is recategorised from `overlay` to `layout`.** It expands in flow rather than floating above content, so it
  never belonged with Modal/Popover/Tooltip. This changes which results `list_components` returns when filtered by category
  (`overlay` 10 → 9, `layout` 7 → 8), and its decision-tree entry moved from the `overlay` tree to the `layout` tree. `Command`
  stays `overlay` — a command palette genuinely is one.

### Decision trees and tools

- **Added `display` and `layout` decision trees** and widened `get_decision_tree`'s `scenario` enum to accept them — without
  that enum change a new tree is unreachable, since the tool validates the argument before looking it up. All 70 components are
  now reachable from at least one tree (verified programmatically); previously 24 were absent from every tree, including
  everything added in 0.4.
- Removed the same stale "(React only)" annotations from the tree entries for `Slider`, `Popover`, and `Tabs`.
- Filled in tree entries for components that had none: `Toggle`, `ColorPicker`, `Editable`, `Mention`, `RichText`, `Button`
  (form); `Sheet`, `HoverCard`, `Command` (overlay); `Toolbar`, `Stepper` (navigation). Expanded the `hooks` tree from 8 to 18
  entries, including the newly catalogued `direction` and `is-mounted`.
- Added two `styling` entries covering the rules most often got wrong: presence-based attributes match `[data-disabled]`, never
  `[data-disabled=true]`; and elements Wire UI renders for you are targeted via their `data-part` marker.
- **`get_installation_guide` fixes:** the Vue guide advertised `Vue >= 3.4.0` / `npm install vue@^3.5` while
  `packages/vue/package.json` declares `>=3.5.0`. The shared data-attribute table also described `data-state` as
  "Open/closed, checked/unchecked" — no component has ever emitted `data-state="checked"`. The table now lists the real value
  sets per component, documents presence-based `data-checked`, and covers `data-part`.
- **`search_docs` now indexes the fields this release edited.** It scored `dataAttributes[].name` only, so attribute
  descriptions, the `values` enum, and `appliesTo` were unsearchable; hook `returns`, `notes`, and `importStatement` were
  likewise skipped. Searching "thumb" now returns `Slider`/`ColorPicker`/`ScrollArea`, and "isRtl" resolves to `useDirection` —
  both returned nothing before, because those names live in descriptions and import statements rather than in a `name` field.

### Downstream consumers

- No `types.ts` or `data/index.ts` change was required — this release changes catalog *content*, never its shape.
- **`@wire-ui/typescript-plugin` must be rebuilt for any catalog change to reach editors.** Its `src/metadata/` layer bundles
  the catalog into `dist/` at build time, and `@wire-ui/eslint-plugin` and the `wire-ui` VS Code extension both consume it from
  there rather than reading `@wire-ui/mcp/data` themselves. Rebuilt and verified the artifact carries the corrections. Anyone
  publishing the catalog alone would ship stale metadata to every editor integration.
- `@wire-ui/eslint-plugin`'s rules (`missing-root-wrapper`, `compound-part-outside-root`) read `parts`, which changed for 11
  components; 13/13 pass against the rebuilt metadata.

### Notes

- `use-menu-navigation` / `create-menu-navigation` exist in all three libraries but are **not** exported from any public entry
  point, so they remain out of the catalog by design.
- `Card` legitimately has `color` / `size` props emitting `data-color` / `data-size` — it is the one component where that
  pattern is real, and the likely source of the fabricated `Tag` and `Spinner` entries removed above.
- `Button.disabled` and `Button.autoFocus` are documented despite not being declared on `ButtonProps`: they come from the
  spread `React.ButtonHTMLAttributes`, and the component explicitly reflects them as `data-disabled` / `data-autofocus`. They
  are genuine public API, not drift.
- **Genuine parity divergence, documented rather than papered over:** `Rating`'s per-star class prop is `starClassName` in
  React and Vue but `starClass` in Solid, following Solid's `class` convention. The catalog notes both spellings; unifying them
  would be a breaking change and is a decision for the libraries, not the catalog.
- Three attributes are **deliberately excluded** from the catalog as Vue-only rendering artifacts rather than contract, and are
  called out in the relevant component notes instead: `data-text` (Vue's `Markdown` wraps text nodes in a keyed `<span>`;
  React/Solid emit bare text), `data-tick` (`Timeago`'s re-render trigger), and `data-carousel-indicators` (a
  `display: contents` host for the render prop, where React/Solid emit a fragment). Styling against any of them would break
  cross-framework parity.
- `Timeago`, `EmptyState`, and `Spinner` are the only components with no `data-*` at all — all verified against the source, not
  assumed.
- **Unrelated library bug found while auditing, not fixed here:** `packages/react/src/components/alert/Alert.tsx` has a JSDoc
  block claiming the Root exposes `data-dismissed` "when the alert has been dismissed". It cannot — the component returns
  `null` once dismissed, so the attribute is unreachable in the DOM. The catalog correctly omits it; the stale JSDoc should be
  removed separately.
- The `components.ts` header still described a "Wire UI 0.2 catalog" with React-only components as an expected category; it now
  states the full-parity rule.

## [0.4.0] - 2026-05-31

Catches the MCP catalog up to the `0.4.0` releases of `@wire-ui/react`, `@wire-ui/solid`, and `@wire-ui/vue`.

### Added

- 22 new components catalogued (the 0.4 component expansion), surfaced by `list_components`, `get_component`, and `get_exports_list` across all three frameworks:
  - **Display** — `Carousel`, `Chat`, `Citation`, `CodeBlock`, `Diff`, `Markdown`, `Stat`, `Typewriter`
  - **Form** — `ColorPicker`, `Editable`, `Mention`, `RichText`, `Toggle` (ships with `ToggleGroup`)
  - **Overlay** — `Command`, `HoverCard`, `Sheet`
  - **Layout** — `InfiniteScroll`, `ScrollArea`, `Virtualizer`
  - **Navigation** — `Stepper`, `Toolbar` (with `Toolbar.Toggle`)
  - Render-prop parts document their children signatures and provided fields (e.g. `Carousel.Indicators`, `Chat.List`, `CodeBlock.Lines`, `Diff.Unified`/`Diff.Split`, `Mention.Items`, `Virtualizer`).

### Changed

- Props for `Checkbox`, `Input`, `Search`, `Slider`, `DatePicker`, `Drawer`, `Dropdown`, `ContextMenu`, `Radio`, `Textarea`, and `Modal` synced to the real component types — corrected names, types, defaults, and descriptions, and filled in missing props (e.g. `Input`/`Textarea` `onFocus`/`onBlur`/`id`, `Checkbox`/`Radio` `name`, `Search` open/value props, `Dropdown` `Trigger.asChild` + `Menu.position`, `Modal`/`Drawer` `Portal.container`).
- `Slider` corrected from a compound `Root`/`Track`/`Range`/`Thumb` API to the actual single non-compound `<Slider>` component (`onChange`, `value: number | [number, number]`, `range`, `inverted`), and is now documented for all three frameworks (previously React-only).
- `DatePicker` parts fixed (`Value` replaces the non-existent `Input` part).

## [0.3.0] - 2026-05-23

Catches the MCP catalog up to the `0.3.0` releases of `@wire-ui/react`, `@wire-ui/solid`, and `@wire-ui/vue`.

### Added

- 17 new hook entries catalogued (the 0.3 hook expansion), surfaced by `list_hooks`, `get_hook`, and `get_exports_list`:
  - **State** — `useLocalStorage`, `useSessionStorage`, `usePrevious`, `useStateMachine`, `useUndoRedo`
  - **Interaction** — `useCopyToClipboard`, `useHotkeys`, `useLongPress`
  - **Observers** — `useDocumentVisibility`, `useOnlineStatus`, `useElementSize`, `useWindowSize`, `useMutationObserver`
  - **Timing** — `useTimeout`, `useInterval`
  - **DOM** — `useEventListener`, `useIsomorphicLayoutEffect`
  - Solid surfaces these as `createX` (storage via `createLocalStorage` / `createSessionStorage`); Vue as `useX`. `useIsomorphicLayoutEffect` is React-only.

### Changed

- Component notes updated to record the hooks now used internally (no public API change): `Alert`, `Avatar`, `Toast`, `Tooltip`, and `NavigationMenu` use `useTimeout`; `Timeago` uses `useInterval`; `ContextMenu` uses `useEventListener`.

## [0.2.0] - 2026-05-18

### Added

- Multi-framework support — `react`, `solid`, and `vue` are now first-class targets across every tool. The previous single-framework gate has been removed.
- 22 new components catalogued: `AspectRatio`, `Breadcrumb`, `Calendar`, `Combobox`, `ContextMenu`, `DatePicker`, `FileUpload`, `Form`, `MenuBar`, `NavigationMenu`, `NumberInput`, `Pagination`, `Popover` (React only), `ResizablePanels`, `Skeleton`, `Slider` (React only), `Spinner`, `Tabs` (React only), `Tag`, `TagInput`, `Toast`, `TreeView`.
- 19 hooks/primitives/composables catalogued: `useControllableState`, `useDisclosure`, `useMergedRefs`, `useId`, `useInteractiveState`, `useClickOutside`, `useKeyboard`, `useFocusTrap`, `useFocusVisible`, `useFloating`, `useScrollLock`, `useIntersectionObserver`, `useResizeObserver`, `useMediaQuery`, `useReduceMotion`, `useDebounce`, `useDebouncedCallback`, `useThrottle`, `useThrottledCallback`. Solid versions surface as `createX`.
- New tool `list_hooks` — list all hooks/primitives/composables for a framework, optionally filtered by category.
- New tool `get_hook` — full details (signature, returns, example, notes) for a specific hook, name-normalised across `use…`/`create…`/canonical forms.
- New component categories: `navigation` and `feedback`.
- New decision trees: `navigation`, `feedback`, `hooks`.

### Changed

- `get_installation_guide` now takes a `framework` parameter and returns framework-specific install steps, peer dependencies, and styling conventions.
- `get_exports_list` is now derived from the component/hook catalog and includes the framework-appropriate term (Hooks / Primitives / Composables).
- `search_docs` now searches across components, hooks, and decision trees for the chosen framework.
- Tailwind examples updated from the deprecated bracket syntax `[data-hover]:` to the current `data-[hover]:` syntax.

## [0.1.0] - 2026-04-09

### Added

- Initial release of `@wire-ui/mcp`
- `list_components` tool — list all components with categories and descriptions
- `get_component` tool — get full details for a specific component
- `get_decision_tree` tool — decision trees for form, overlay, and styling choices
- `search_docs` tool — free-text search across component documentation
- Framework parameter support (defaults to React, Vue and Solid planned)
- All 26 Wire UI components documented with props, data attributes, and examples
