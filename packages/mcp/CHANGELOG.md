# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
