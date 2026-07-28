import type { HookData } from "./types.js";

// ────────────────────────────────────────────────────────────────────
// Wire UI 0.2 + 0.3 hooks / primitives / composables catalog
//
//   React  → useX
//   Solid  → createX
//   Vue    → useX
//
// `canonicalName` is the kebab-case identifier used by tools.
// Per-framework `name` fields hold the literal export name.
// ────────────────────────────────────────────────────────────────────

export const hooks: HookData[] = [
	// ─── State Management ───────────────────────────────────────────────

	{
		canonicalName: "controllable-state",
		category: "state",
		description:
			"Unified controlled/uncontrolled state pattern. Pass value, defaultValue, and onChange — the hook decides which one wins.",
		signature:
			"(options: { value?, defaultValue?, onChange? }) => [state, setState]",
		returns: "Tuple/array of [state, setter].",
		frameworks: {
			react: {
				name: "useControllableState",
				importStatement:
					"import { useControllableState } from '@wire-ui/react'",
				basicExample: `const [value, setValue] = useControllableState({
  value: props.value,
  defaultValue: props.defaultValue ?? '',
  onChange: props.onChange,
});`,
			},
			solid: {
				name: "createControllableState",
				importStatement:
					"import { createControllableState } from '@wire-ui/solid'",
				basicExample: `const [value, setValue] = createControllableState({
  value: () => props.value,
  defaultValue: () => props.defaultValue ?? '',
  onChange: props.onChange,
});`,
			},
			vue: {
				name: "useControllableState",
				importStatement:
					"import { useControllableState } from '@wire-ui/vue'",
				basicExample: `const [value, setValue] = useControllableState({
  value: () => props.value,
  defaultValue: () => props.defaultValue ?? '',
  onChange: (v) => emit('change', v),
});`,
			},
		},
	},

	{
		canonicalName: "disclosure",
		category: "state",
		description:
			'Boolean state with open/close/toggle actions. Use for any "is this thing open?" state.',
		signature:
			"(options?: { defaultOpen?, onOpenChange? }) => { isOpen, open, close, toggle }",
		returns: "Object with isOpen + imperative actions.",
		frameworks: {
			react: {
				name: "useDisclosure",
				importStatement:
					"import { useDisclosure } from '@wire-ui/react'",
				basicExample: `const { isOpen, open, close, toggle } = useDisclosure();
return <button onClick={toggle}>{isOpen ? 'Close' : 'Open'}</button>;`,
			},
			solid: {
				name: "createDisclosure",
				importStatement:
					"import { createDisclosure } from '@wire-ui/solid'",
				basicExample: `const { isOpen, open, close, toggle } = createDisclosure();
return <button onClick={toggle}>{isOpen() ? 'Close' : 'Open'}</button>;`,
			},
			vue: {
				name: "useDisclosure",
				importStatement: "import { useDisclosure } from '@wire-ui/vue'",
				basicExample: `const { isOpen, open, close, toggle } = useDisclosure();`,
			},
		},
	},

	{
		canonicalName: "merged-refs",
		category: "state",
		description:
			"Compose multiple refs (or callback refs) onto a single element. Useful for forwarding refs through wrappers.",
		signature: "(...refs: Ref[]) => Ref",
		returns: "A single ref/callback that fans out to all inputs.",
		frameworks: {
			react: {
				name: "useMergedRefs",
				importStatement:
					"import { useMergedRefs } from '@wire-ui/react'",
				basicExample: `const ref = useMergedRefs(forwardedRef, localRef);
return <div ref={ref} />;`,
			},
			solid: {
				name: "createMergedRefs",
				importStatement:
					"import { createMergedRefs } from '@wire-ui/solid'",
				basicExample: `const ref = createMergedRefs(forwardedRef, localRef);
return <div ref={ref} />;`,
			},
		},
		notes: [
			"Not exported from @wire-ui/vue — Vue refs compose differently.",
		],
	},

	{
		canonicalName: "id",
		category: "state",
		description:
			"SSR-safe id generator with optional prefix. Stable between server and client.",
		signature: "(prefix?: string, staticId?: string) => string",
		returns: "A unique id string.",
		frameworks: {
			react: {
				name: "useId",
				importStatement: "import { useId } from '@wire-ui/react'",
				basicExample: `const id = useId('input');`,
			},
			solid: {
				name: "createId",
				importStatement: "import { createId } from '@wire-ui/solid'",
				basicExample: `const id = createId('input');`,
			},
			vue: {
				name: "useId",
				importStatement: "import { useId } from '@wire-ui/vue'",
				basicExample: `const id = useId('input');`,
			},
		},
	},

	// ─── Interaction ────────────────────────────────────────────────────

	{
		canonicalName: "interactive-state",
		category: "interaction",
		description:
			"Tracks hover, keyboard-focus, and press state. Returns event handlers plus a data-attributes object you can spread onto an element.",
		signature:
			"(options?: { disabled? }) => { handlers, dataAttributes, isHovered, isFocusVisible, isActive }",
		returns: "An object with handlers, dataAttributes, and reactive state.",
		frameworks: {
			react: {
				name: "useInteractiveState",
				importStatement:
					"import { useInteractiveState } from '@wire-ui/react'",
				basicExample: `const { handlers, dataAttributes } = useInteractiveState();
return <button {...handlers} {...dataAttributes}>Hover me</button>;`,
			},
			solid: {
				name: "createInteractiveState",
				importStatement:
					"import { createInteractiveState } from '@wire-ui/solid'",
				basicExample: `const { handlers, dataAttributes } = createInteractiveState();
return <button {...handlers()} {...dataAttributes()}>Hover me</button>;`,
			},
			vue: {
				name: "useInteractiveState",
				importStatement:
					"import { useInteractiveState } from '@wire-ui/vue'",
				basicExample: `const { handlers, dataAttributes } = useInteractiveState();`,
			},
		},
	},

	{
		canonicalName: "click-outside",
		category: "interaction",
		description:
			"Fires a callback when a pointer event occurs outside the referenced element.",
		signature: "(ref: Ref<HTMLElement>, callback: () => void) => void",
		frameworks: {
			react: {
				name: "useClickOutside",
				importStatement:
					"import { useClickOutside } from '@wire-ui/react'",
				basicExample: `const ref = useRef<HTMLDivElement>(null);
useClickOutside(ref, () => close());
return <div ref={ref}>...</div>;`,
			},
			solid: {
				name: "createClickOutside",
				importStatement:
					"import { createClickOutside } from '@wire-ui/solid'",
				basicExample: `let el: HTMLDivElement | undefined;
createClickOutside(() => el, () => close());
return <div ref={el}>...</div>;`,
			},
			vue: {
				name: "useClickOutside",
				importStatement:
					"import { useClickOutside } from '@wire-ui/vue'",
				basicExample: `const el = ref<HTMLDivElement>();
useClickOutside(el, () => close());`,
			},
		},
	},

	{
		canonicalName: "keyboard",
		category: "interaction",
		description:
			"Declarative keydown/keyup handler with key-combo matching. Map shortcut strings to handler functions.",
		signature:
			"(map: KeyboardMap, options?: { event?: 'keydown' | 'keyup' }) => void",
		frameworks: {
			react: {
				name: "useKeyboard",
				importStatement: "import { useKeyboard } from '@wire-ui/react'",
				basicExample: `useKeyboard({
  'Escape': () => close(),
  'Mod+s': (e) => { e.preventDefault(); save(); },
});`,
			},
			solid: {
				name: "createKeyboard",
				importStatement:
					"import { createKeyboard } from '@wire-ui/solid'",
				basicExample: `createKeyboard({
  'Escape': () => close(),
  'Mod+s': (e) => { e.preventDefault(); save(); },
});`,
			},
			vue: {
				name: "useKeyboard",
				importStatement: "import { useKeyboard } from '@wire-ui/vue'",
				basicExample: `useKeyboard({
  'Escape': () => close(),
});`,
			},
		},
	},

	{
		canonicalName: "focus-trap",
		category: "interaction",
		description:
			"Contains keyboard focus within an element while active. Used internally by Modal and Drawer.",
		signature:
			"(ref: Ref<HTMLElement>, options?: { active?, onEscape? }) => void",
		frameworks: {
			react: {
				name: "useFocusTrap",
				importStatement:
					"import { useFocusTrap } from '@wire-ui/react'",
				basicExample: `const ref = useRef<HTMLDivElement>(null);
useFocusTrap(ref, { active: open, onEscape: () => setOpen(false) });`,
			},
			solid: {
				name: "createFocusTrap",
				importStatement:
					"import { createFocusTrap } from '@wire-ui/solid'",
				basicExample: `let el: HTMLDivElement | undefined;
createFocusTrap(() => el, { active: open, onEscape: () => setOpen(false) });`,
			},
			vue: {
				name: "useFocusTrap",
				importStatement: "import { useFocusTrap } from '@wire-ui/vue'",
				basicExample: `const el = ref<HTMLDivElement>();
useFocusTrap(el, { active: open, onEscape: () => (open.value = false) });`,
			},
		},
	},

	{
		canonicalName: "focus-visible",
		category: "interaction",
		description:
			"Tracks whether focus came from keyboard vs pointer, so you can apply data-focus-visible styling.",
		signature: "() => { isFocusVisible }",
		frameworks: {
			react: {
				name: "useFocusVisible",
				importStatement:
					"import { useFocusVisible } from '@wire-ui/react'",
				basicExample: `const { isFocusVisible } = useFocusVisible();`,
			},
			solid: {
				name: "createFocusVisible",
				importStatement:
					"import { createFocusVisible } from '@wire-ui/solid'",
				basicExample: `const { isFocusVisible } = createFocusVisible();`,
			},
			vue: {
				name: "useFocusVisible",
				importStatement:
					"import { useFocusVisible } from '@wire-ui/vue'",
				basicExample: `const { isFocusVisible } = useFocusVisible();`,
			},
		},
	},

	// ─── Positioning ────────────────────────────────────────────────────

	{
		canonicalName: "floating",
		category: "positioning",
		description:
			"Anchored-positioning primitive used by Tooltip/Popover/DatePicker/Combobox. Computes collision-aware side/align coordinates.",
		signature:
			"(options: { reference, floating, placement?, strategy? }) => { x, y, placement }",
		frameworks: {
			react: {
				name: "useFloating",
				importStatement: "import { useFloating } from '@wire-ui/react'",
				basicExample: `const { floatingRef, x, y, placement } = useFloating({
  reference: triggerRef,
  placement: { side: 'bottom', align: 'start' },
});`,
			},
			solid: {
				name: "createFloating",
				importStatement:
					"import { createFloating } from '@wire-ui/solid'",
				basicExample: `const { floatingRef, x, y, placement } = createFloating({
  reference: () => triggerEl,
  placement: { side: 'bottom', align: 'start' },
});`,
			},
			vue: {
				name: "useFloating",
				importStatement: "import { useFloating } from '@wire-ui/vue'",
				basicExample: `const { floatingRef, x, y, placement } = useFloating({
  reference: triggerRef,
  placement: { side: 'bottom', align: 'start' },
});`,
			},
		},
	},

	{
		canonicalName: "scroll-lock",
		category: "positioning",
		description:
			"Locks page scroll while active. Used internally by Modal/Drawer to prevent body scroll.",
		signature: "(active: boolean) => void",
		frameworks: {
			react: {
				name: "useScrollLock",
				importStatement:
					"import { useScrollLock } from '@wire-ui/react'",
				basicExample: `useScrollLock(open);`,
			},
			solid: {
				name: "createScrollLock",
				importStatement:
					"import { createScrollLock } from '@wire-ui/solid'",
				basicExample: `createScrollLock(() => open());`,
			},
			vue: {
				name: "useScrollLock",
				importStatement: "import { useScrollLock } from '@wire-ui/vue'",
				basicExample: `useScrollLock(open);`,
			},
		},
	},

	// ─── Observers ──────────────────────────────────────────────────────

	{
		canonicalName: "intersection-observer",
		category: "observer",
		description:
			"Observes when an element enters or leaves the viewport. Configurable threshold and rootMargin.",
		signature:
			"(ref: Ref<HTMLElement>, options?: { threshold?, rootMargin? }) => boolean",
		frameworks: {
			react: {
				name: "useIntersectionObserver",
				importStatement:
					"import { useIntersectionObserver } from '@wire-ui/react'",
				basicExample: `const ref = useRef(null);
const isVisible = useIntersectionObserver(ref, { threshold: 0.5 });`,
			},
			solid: {
				name: "createIntersectionObserver",
				importStatement:
					"import { createIntersectionObserver } from '@wire-ui/solid'",
				basicExample: `let el;
const isVisible = createIntersectionObserver(() => el, { threshold: 0.5 });`,
			},
			vue: {
				name: "useIntersectionObserver",
				importStatement:
					"import { useIntersectionObserver } from '@wire-ui/vue'",
				basicExample: `const el = ref();
const isVisible = useIntersectionObserver(el, { threshold: 0.5 });`,
			},
		},
	},

	{
		canonicalName: "resize-observer",
		category: "observer",
		description:
			"Observes element size with a debounced callback. Returns the latest width/height.",
		signature:
			"(ref: Ref<HTMLElement>, callback?: (size) => void) => { width, height }",
		frameworks: {
			react: {
				name: "useResizeObserver",
				importStatement:
					"import { useResizeObserver } from '@wire-ui/react'",
				basicExample: `const ref = useRef(null);
const { width, height } = useResizeObserver(ref);`,
			},
			solid: {
				name: "createResizeObserver",
				importStatement:
					"import { createResizeObserver } from '@wire-ui/solid'",
				basicExample: `let el;
const { width, height } = createResizeObserver(() => el);`,
			},
			vue: {
				name: "useResizeObserver",
				importStatement:
					"import { useResizeObserver } from '@wire-ui/vue'",
				basicExample: `const el = ref();
const { width, height } = useResizeObserver(el);`,
			},
		},
	},

	{
		canonicalName: "media-query",
		category: "observer",
		description: "Reactive boolean that matches a CSS media query.",
		signature: "(query: string) => boolean",
		frameworks: {
			react: {
				name: "useMediaQuery",
				importStatement:
					"import { useMediaQuery } from '@wire-ui/react'",
				basicExample: `const isMobile = useMediaQuery('(max-width: 768px)');`,
			},
			solid: {
				name: "createMediaQuery",
				importStatement:
					"import { createMediaQuery } from '@wire-ui/solid'",
				basicExample: `const isMobile = createMediaQuery('(max-width: 768px)');`,
			},
			vue: {
				name: "useMediaQuery",
				importStatement: "import { useMediaQuery } from '@wire-ui/vue'",
				basicExample: `const isMobile = useMediaQuery('(max-width: 768px)');`,
			},
		},
	},

	{
		canonicalName: "reduce-motion",
		category: "observer",
		description:
			"Reactive boolean for the user's prefers-reduced-motion setting.",
		signature: "() => boolean",
		frameworks: {
			react: {
				name: "useReduceMotion",
				importStatement:
					"import { useReduceMotion } from '@wire-ui/react'",
				basicExample: `const reduceMotion = useReduceMotion();`,
			},
			solid: {
				name: "createReduceMotion",
				importStatement:
					"import { createReduceMotion } from '@wire-ui/solid'",
				basicExample: `const reduceMotion = createReduceMotion();`,
			},
			vue: {
				name: "useReduceMotion",
				importStatement:
					"import { useReduceMotion } from '@wire-ui/vue'",
				basicExample: `const reduceMotion = useReduceMotion();`,
			},
		},
	},

	// ─── Timing ─────────────────────────────────────────────────────────

	{
		canonicalName: "debounce",
		category: "timing",
		description:
			"Debounces a VALUE — returns the input value, updated only after `delay` ms have passed without a change. Use for derived state that drives expensive work (network requests, filters). To debounce a function, use debounced-callback instead.",
		signature: "<T>(value: T, delay: number) => T",
		returns:
			"The debounced value. React returns it directly; Vue returns a Ref<T>; Solid returns an Accessor<T>.",
		frameworks: {
			react: {
				name: "useDebounce",
				importStatement: "import { useDebounce } from '@wire-ui/react'",
				basicExample: `const debouncedQuery = useDebounce(query, 250);
useEffect(() => { search(debouncedQuery); }, [debouncedQuery]);`,
			},
			solid: {
				name: "createDebounce",
				importStatement:
					"import { createDebounce } from '@wire-ui/solid'",
				basicExample: `const debouncedQuery = createDebounce(query, 250);
createEffect(() => search(debouncedQuery()));`,
			},
			vue: {
				name: "useDebounce",
				importStatement: "import { useDebounce } from '@wire-ui/vue'",
				basicExample: `const debouncedQuery = useDebounce(query, 250);
watch(debouncedQuery, (q) => search(q));`,
			},
		},
		notes: [
			"This does NOT return { execute, cancel, flush } — it returns the debounced value itself.",
			"Vue accepts a MaybeRefOrGetter source; Solid accepts an Accessor.",
		],
	},

	{
		canonicalName: "debounced-callback",
		category: "timing",
		description:
			"Convenience wrapper around debounce that returns a single function (not an object).",
		signature: "(callback, delay) => (...args) => void",
		frameworks: {
			react: {
				name: "useDebouncedCallback",
				importStatement:
					"import { useDebouncedCallback } from '@wire-ui/react'",
				basicExample: `const debouncedSearch = useDebouncedCallback((q) => search(q), 300);`,
			},
			solid: {
				name: "createDebouncedCallback",
				importStatement:
					"import { createDebouncedCallback } from '@wire-ui/solid'",
				basicExample: `const debouncedSearch = createDebouncedCallback((q) => search(q), 300);`,
			},
			vue: {
				name: "useDebouncedCallback",
				importStatement:
					"import { useDebouncedCallback } from '@wire-ui/vue'",
				basicExample: `const debouncedSearch = useDebouncedCallback((q) => search(q), 300);`,
			},
		},
	},

	{
		canonicalName: "throttle",
		category: "timing",
		description:
			"Throttles a VALUE — returns the input value, updated at most once per `delay` ms. To throttle a function, use throttled-callback instead.",
		signature: "<T>(value: T, delay: number) => T",
		returns:
			"The throttled value. React returns it directly; Vue returns a Ref<T>; Solid returns an Accessor<T>.",
		frameworks: {
			react: {
				name: "useThrottle",
				importStatement: "import { useThrottle } from '@wire-ui/react'",
				basicExample: `const throttledY = useThrottle(scrollY, 100);`,
			},
			solid: {
				name: "createThrottle",
				importStatement:
					"import { createThrottle } from '@wire-ui/solid'",
				basicExample: `const throttledY = createThrottle(scrollY, 100);`,
			},
			vue: {
				name: "useThrottle",
				importStatement: "import { useThrottle } from '@wire-ui/vue'",
				basicExample: `const throttledY = useThrottle(scrollY, 100);`,
			},
		},
		notes: [
			"This does NOT return { execute, cancel } and takes no leading/trailing options — it returns the throttled value itself.",
			"Vue accepts a MaybeRefOrGetter source; Solid accepts an Accessor.",
		],
	},

	{
		canonicalName: "throttled-callback",
		category: "timing",
		description:
			"Convenience wrapper around throttle returning a single function.",
		signature: "(callback, delay) => (...args) => void",
		frameworks: {
			react: {
				name: "useThrottledCallback",
				importStatement:
					"import { useThrottledCallback } from '@wire-ui/react'",
				basicExample: `const throttledScroll = useThrottledCallback(onScroll, 100);`,
			},
			solid: {
				name: "createThrottledCallback",
				importStatement:
					"import { createThrottledCallback } from '@wire-ui/solid'",
				basicExample: `const throttledScroll = createThrottledCallback(onScroll, 100);`,
			},
			vue: {
				name: "useThrottledCallback",
				importStatement:
					"import { useThrottledCallback } from '@wire-ui/vue'",
				basicExample: `const throttledScroll = useThrottledCallback(onScroll, 100);`,
			},
		},
	},

	// ════════════════════════════════════════════════════════════════════
	// Added in 0.3
	// ════════════════════════════════════════════════════════════════════

	// ─── State ──────────────────────────────────────────────────────────

	{
		canonicalName: "local-storage",
		category: "state",
		description:
			"useState-shaped hook backed by localStorage. SSR-safe initial value, cross-tab sync, and custom serialize/deserialize.",
		signature:
			"<T>(key: string, initialValue: T, options?: { serialize?, deserialize?, syncAcrossTabs? }) => [value, setValue, remove]",
		returns: "Tuple of [value, setValue, remove].",
		frameworks: {
			react: {
				name: "useLocalStorage",
				importStatement:
					"import { useLocalStorage } from '@wire-ui/react'",
				basicExample: `const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light');`,
			},
			solid: {
				name: "createLocalStorage",
				importStatement:
					"import { createLocalStorage } from '@wire-ui/solid'",
				basicExample: `const [theme, setTheme, removeTheme] = createLocalStorage('theme', 'light');`,
			},
			vue: {
				name: "useLocalStorage",
				importStatement:
					"import { useLocalStorage } from '@wire-ui/vue'",
				basicExample: `const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light');`,
			},
		},
		notes: [
			"Cross-tab sync is on by default for localStorage (storage event).",
		],
	},

	{
		canonicalName: "session-storage",
		category: "state",
		description:
			"Same API as useLocalStorage but backed by sessionStorage. Per-tab; cross-tab sync is off by default.",
		signature:
			"<T>(key: string, initialValue: T, options?: { serialize?, deserialize? }) => [value, setValue, remove]",
		returns: "Tuple of [value, setValue, remove].",
		frameworks: {
			react: {
				name: "useSessionStorage",
				importStatement:
					"import { useSessionStorage } from '@wire-ui/react'",
				basicExample: `const [draft, setDraft, clearDraft] = useSessionStorage('draft', '');`,
			},
			solid: {
				name: "createSessionStorage",
				importStatement:
					"import { createSessionStorage } from '@wire-ui/solid'",
				basicExample: `const [draft, setDraft, clearDraft] = createSessionStorage('draft', '');`,
			},
			vue: {
				name: "useSessionStorage",
				importStatement:
					"import { useSessionStorage } from '@wire-ui/vue'",
				basicExample: `const [draft, setDraft, clearDraft] = useSessionStorage('draft', '');`,
			},
		},
	},

	{
		canonicalName: "previous",
		category: "state",
		description:
			"Returns the value from the previous render. Undefined on the first render.",
		signature: "<T>(value: T) => T | undefined",
		returns: "The prior render's value, or undefined initially.",
		frameworks: {
			react: {
				name: "usePrevious",
				importStatement: "import { usePrevious } from '@wire-ui/react'",
				basicExample: `const previousCount = usePrevious(count);`,
			},
			solid: {
				name: "createPrevious",
				importStatement:
					"import { createPrevious } from '@wire-ui/solid'",
				basicExample: `const previousCount = createPrevious(count);
// read with previousCount()`,
			},
			vue: {
				name: "usePrevious",
				importStatement: "import { usePrevious } from '@wire-ui/vue'",
				basicExample: `const previousCount = usePrevious(count);`,
			},
		},
	},

	{
		canonicalName: "state-machine",
		category: "state",
		description:
			"Tiny, fully-typed finite state machine. States map events to next states; send() is a no-op for events the current state doesn't accept.",
		signature:
			"<S, E>(config: Record<S, Partial<Record<E, S>>>, init: { initial: S, onTransition? }) => { state, send, can, reset, transitions }",
		returns: "Object with state, send, can, reset, and transitions.",
		frameworks: {
			react: {
				name: "useStateMachine",
				importStatement:
					"import { useStateMachine } from '@wire-ui/react'",
				basicExample: `const { state, send, can } = useStateMachine({
  idle: { fetch: 'loading' },
  loading: { resolve: 'success', reject: 'error' },
  success: { reset: 'idle' },
  error: { retry: 'loading', reset: 'idle' },
} as const, { initial: 'idle' });`,
			},
			solid: {
				name: "createStateMachine",
				importStatement:
					"import { createStateMachine } from '@wire-ui/solid'",
				basicExample: `const { state, send, can } = createStateMachine({
  idle: { fetch: 'loading' },
  loading: { resolve: 'success', reject: 'error' },
} as const, { initial: 'idle' });
// read with state()`,
			},
			vue: {
				name: "useStateMachine",
				importStatement:
					"import { useStateMachine } from '@wire-ui/vue'",
				basicExample: `const { state, send, can } = useStateMachine({
  idle: { fetch: 'loading' },
  loading: { resolve: 'success', reject: 'error' },
} as const, { initial: 'idle' });`,
			},
		},
	},

	{
		canonicalName: "undo-redo",
		category: "state",
		description:
			"State container with bounded undo/redo history. set() pushes the prior value and clears the redo stack.",
		signature:
			"<T>(initialValue: T, options?: { limit? }) => { value, set, undo, redo, reset, clear, canUndo, canRedo }",
		returns:
			"Object with value, set, undo, redo, reset, clear, canUndo, canRedo (+ pastSize/futureSize).",
		frameworks: {
			react: {
				name: "useUndoRedo",
				importStatement: "import { useUndoRedo } from '@wire-ui/react'",
				basicExample: `const { value, set, undo, redo, canUndo, canRedo } = useUndoRedo('');`,
			},
			solid: {
				name: "createUndoRedo",
				importStatement:
					"import { createUndoRedo } from '@wire-ui/solid'",
				basicExample: `const { value, set, undo, redo, canUndo, canRedo } = createUndoRedo('');
// read with value(); canUndo() / canRedo() are accessors`,
			},
			vue: {
				name: "useUndoRedo",
				importStatement: "import { useUndoRedo } from '@wire-ui/vue'",
				basicExample: `const { value, set, undo, redo, canUndo, canRedo } = useUndoRedo('');`,
			},
		},
		notes: [
			"History is bounded by `limit` (default 100); set Infinity for unbounded.",
		],
	},

	// ─── Interaction ────────────────────────────────────────────────────

	{
		canonicalName: "copy-to-clipboard",
		category: "interaction",
		description:
			"Clipboard write helper. Returns copy() plus a copied flag that auto-resets, and the last value/error.",
		signature:
			"(options?: { resetAfter? }) => { copy, copied, value, error, reset }",
		returns: "Object with copy(), copied, value, error, reset.",
		frameworks: {
			react: {
				name: "useCopyToClipboard",
				importStatement:
					"import { useCopyToClipboard } from '@wire-ui/react'",
				basicExample: `const { copy, copied } = useCopyToClipboard();
return <button onClick={() => copy('hello')}>{copied ? 'Copied!' : 'Copy'}</button>;`,
			},
			solid: {
				name: "createCopyToClipboard",
				importStatement:
					"import { createCopyToClipboard } from '@wire-ui/solid'",
				basicExample: `const { copy, copied } = createCopyToClipboard();
return <button onClick={() => copy('hello')}>{copied() ? 'Copied!' : 'Copy'}</button>;`,
			},
			vue: {
				name: "useCopyToClipboard",
				importStatement:
					"import { useCopyToClipboard } from '@wire-ui/vue'",
				basicExample: `const { copy, copied } = useCopyToClipboard();`,
			},
		},
		notes: [
			"`resetAfter` defaults to 2000ms; set to 0 to keep `copied` true until manually reset.",
		],
	},

	{
		canonicalName: "hotkeys",
		category: "interaction",
		description:
			"Declarative keyboard-shortcut binder with combo matching (e.g. mod+k, shift+/). Supports scopes and input-suppression.",
		signature:
			"(map: Record<string, (e: KeyboardEvent) => void>, options?: { target?, event?, scope?, enableInInputs?, preventDefault? }) => void",
		frameworks: {
			react: {
				name: "useHotkeys",
				importStatement: "import { useHotkeys } from '@wire-ui/react'",
				basicExample: `useHotkeys({
  'mod+k': () => openPalette(),
  'shift+/': () => openHelp(),
});`,
			},
			solid: {
				name: "createHotkeys",
				importStatement:
					"import { createHotkeys } from '@wire-ui/solid'",
				basicExample: `createHotkeys({
  'mod+k': () => openPalette(),
  'shift+/': () => openHelp(),
});`,
			},
			vue: {
				name: "useHotkeys",
				importStatement: "import { useHotkeys } from '@wire-ui/vue'",
				basicExample: `useHotkeys({
  'mod+k': () => openPalette(),
});`,
			},
		},
		notes: [
			"`mod` resolves to Cmd on macOS and Ctrl elsewhere.",
			"By default hotkeys don't fire inside inputs/textareas; set enableInInputs to override.",
		],
	},

	{
		canonicalName: "long-press",
		category: "interaction",
		description:
			"Long-press gesture handler. Returns pointer handlers you spread onto an element; fires after a held threshold without movement.",
		signature:
			"(callback, options?: { threshold?, moveThreshold?, onStart?, onCancel?, onFinish?, disabled? }) => LongPressHandlers",
		returns: "Object of pointer event handlers to spread onto an element.",
		frameworks: {
			react: {
				name: "useLongPress",
				importStatement:
					"import { useLongPress } from '@wire-ui/react'",
				basicExample: `const handlers = useLongPress(() => openMenu(), { threshold: 500 });
return <button {...handlers}>Hold me</button>;`,
			},
			solid: {
				name: "createLongPress",
				importStatement:
					"import { createLongPress } from '@wire-ui/solid'",
				basicExample: `const handlers = createLongPress(() => openMenu(), { threshold: 500 });
return <button {...handlers}>Hold me</button>;`,
			},
			vue: {
				name: "useLongPress",
				importStatement: "import { useLongPress } from '@wire-ui/vue'",
				basicExample: `const handlers = useLongPress(() => openMenu(), { threshold: 500 });`,
			},
		},
		notes: ["Unifies mouse, touch, and pen via Pointer Events."],
	},

	// ─── Observers ──────────────────────────────────────────────────────

	{
		canonicalName: "document-visibility",
		category: "observer",
		description:
			"Reactive document.visibilityState ('visible' | 'hidden'). SSR-safe — returns 'visible' on the server.",
		signature: "() => DocumentVisibilityState",
		returns: "'visible' or 'hidden'.",
		frameworks: {
			react: {
				name: "useDocumentVisibility",
				importStatement:
					"import { useDocumentVisibility } from '@wire-ui/react'",
				basicExample: `const visibility = useDocumentVisibility();
if (visibility === 'hidden') pausePolling();`,
			},
			solid: {
				name: "createDocumentVisibility",
				importStatement:
					"import { createDocumentVisibility } from '@wire-ui/solid'",
				basicExample: `const visibility = createDocumentVisibility();
// read with visibility()`,
			},
			vue: {
				name: "useDocumentVisibility",
				importStatement:
					"import { useDocumentVisibility } from '@wire-ui/vue'",
				basicExample: `const visibility = useDocumentVisibility();`,
			},
		},
	},

	{
		canonicalName: "online-status",
		category: "observer",
		description:
			"Reactive navigator.onLine boolean. SSR-safe default of true.",
		signature: "() => boolean",
		returns: "true when online, false when offline.",
		frameworks: {
			react: {
				name: "useOnlineStatus",
				importStatement:
					"import { useOnlineStatus } from '@wire-ui/react'",
				basicExample: `const isOnline = useOnlineStatus();`,
			},
			solid: {
				name: "createOnlineStatus",
				importStatement:
					"import { createOnlineStatus } from '@wire-ui/solid'",
				basicExample: `const isOnline = createOnlineStatus();
// read with isOnline()`,
			},
			vue: {
				name: "useOnlineStatus",
				importStatement:
					"import { useOnlineStatus } from '@wire-ui/vue'",
				basicExample: `const isOnline = useOnlineStatus();`,
			},
		},
	},

	{
		canonicalName: "element-size",
		category: "observer",
		description:
			"Live content-box { width, height } of a referenced element via ResizeObserver. Thin alias over useResizeObserver.",
		signature: "(ref: Ref<HTMLElement>) => { width, height }",
		returns: "Object with width and height.",
		frameworks: {
			react: {
				name: "useElementSize",
				importStatement:
					"import { useElementSize } from '@wire-ui/react'",
				basicExample: `const ref = useRef<HTMLDivElement>(null);
const { width, height } = useElementSize(ref);`,
			},
			solid: {
				name: "createElementSize",
				importStatement:
					"import { createElementSize } from '@wire-ui/solid'",
				basicExample: `let el: HTMLDivElement | undefined;
const { width, height } = createElementSize(() => el);`,
			},
			vue: {
				name: "useElementSize",
				importStatement:
					"import { useElementSize } from '@wire-ui/vue'",
				basicExample: `const el = ref<HTMLDivElement>();
const { width, height } = useElementSize(el);`,
			},
		},
	},

	{
		canonicalName: "window-size",
		category: "observer",
		description:
			"Reactive { width, height } of the viewport. SSR-safe default; updates on resize and orientation change.",
		signature: "() => { width, height }",
		returns: "Object with width and height.",
		frameworks: {
			react: {
				name: "useWindowSize",
				importStatement:
					"import { useWindowSize } from '@wire-ui/react'",
				basicExample: `const { width, height } = useWindowSize();`,
			},
			solid: {
				name: "createWindowSize",
				importStatement:
					"import { createWindowSize } from '@wire-ui/solid'",
				basicExample: `const size = createWindowSize();
// read with size().width`,
			},
			vue: {
				name: "useWindowSize",
				importStatement: "import { useWindowSize } from '@wire-ui/vue'",
				basicExample: `const { width, height } = useWindowSize();`,
			},
		},
	},

	{
		canonicalName: "mutation-observer",
		category: "observer",
		description:
			"Observes DOM mutations on a referenced element with full MutationObserverInit options.",
		signature:
			"(ref: Ref<Node>, callback: MutationCallback, options?: MutationObserverInit & { enabled? }) => void",
		frameworks: {
			react: {
				name: "useMutationObserver",
				importStatement:
					"import { useMutationObserver } from '@wire-ui/react'",
				basicExample: `const ref = useRef<HTMLDivElement>(null);
useMutationObserver(ref, (records) => console.log(records), { childList: true });`,
			},
			solid: {
				name: "createMutationObserver",
				importStatement:
					"import { createMutationObserver } from '@wire-ui/solid'",
				basicExample: `let el: HTMLDivElement | undefined;
createMutationObserver(() => el, (records) => console.log(records), { childList: true });`,
			},
			vue: {
				name: "useMutationObserver",
				importStatement:
					"import { useMutationObserver } from '@wire-ui/vue'",
				basicExample: `const el = ref<HTMLDivElement>();
useMutationObserver(el, (records) => console.log(records), { childList: true });`,
			},
		},
	},

	// ─── Timing ─────────────────────────────────────────────────────────

	{
		canonicalName: "timeout",
		category: "timing",
		description:
			"setTimeout wrapper with start/stop/reset controls and an isPending flag. Always invokes the latest callback.",
		signature:
			"(callback: () => void, delay: number, options?: { autoStart? }) => { isPending, start, stop, reset }",
		returns: "Object with isPending, start, stop, reset.",
		frameworks: {
			react: {
				name: "useTimeout",
				importStatement: "import { useTimeout } from '@wire-ui/react'",
				basicExample: `const { start, stop, isPending } = useTimeout(() => setShown(false), 3000);`,
			},
			solid: {
				name: "createTimeout",
				importStatement:
					"import { createTimeout } from '@wire-ui/solid'",
				basicExample: `const { start, stop, isPending } = createTimeout(() => setShown(false), 3000);
// isPending() is an accessor`,
			},
			vue: {
				name: "useTimeout",
				importStatement: "import { useTimeout } from '@wire-ui/vue'",
				basicExample: `const { start, stop, isPending } = useTimeout(() => setShown(false), 3000);`,
			},
		},
		notes: [
			"Used internally by Tooltip, Toast, Alert, Avatar, and NavigationMenu for their delay/dismiss timers.",
		],
	},

	{
		canonicalName: "interval",
		category: "timing",
		description:
			"setInterval wrapper with start/stop/reset controls and an isRunning flag. Pass delay = null to pause without unmounting.",
		signature:
			"(callback: () => void, delay: number | null, options?: { autoStart?, immediate? }) => { isRunning, start, stop, reset }",
		returns: "Object with isRunning, start, stop, reset.",
		frameworks: {
			react: {
				name: "useInterval",
				importStatement: "import { useInterval } from '@wire-ui/react'",
				basicExample: `const { stop, isRunning } = useInterval(() => setNow(Date.now()), 1000);`,
			},
			solid: {
				name: "createInterval",
				importStatement:
					"import { createInterval } from '@wire-ui/solid'",
				basicExample: `const { stop, isRunning } = createInterval(() => setNow(Date.now()), 1000);
// isRunning() is an accessor`,
			},
			vue: {
				name: "useInterval",
				importStatement: "import { useInterval } from '@wire-ui/vue'",
				basicExample: `const { stop, isRunning } = useInterval(() => setNow(Date.now()), 1000);`,
			},
		},
		notes: ["Used internally by Timeago for its periodic re-render."],
	},

	// ─── DOM ────────────────────────────────────────────────────────────

	{
		canonicalName: "event-listener",
		category: "dom",
		description:
			"Typed addEventListener subscription for window, document, an element, or a ref. Accepts null targets for conditional binding; auto-cleans on unmount.",
		signature:
			"(eventName, handler, target?: Window | Document | HTMLElement | Ref | null, options?) => void",
		frameworks: {
			react: {
				name: "useEventListener",
				importStatement:
					"import { useEventListener } from '@wire-ui/react'",
				basicExample: `useEventListener('scroll', () => setY(window.scrollY));
useEventListener('click', onClick, buttonRef);`,
			},
			solid: {
				name: "createEventListener",
				importStatement:
					"import { createEventListener } from '@wire-ui/solid'",
				basicExample: `createEventListener('scroll', () => setY(window.scrollY));
createEventListener('click', onClick, () => buttonEl);`,
			},
			vue: {
				name: "useEventListener",
				importStatement:
					"import { useEventListener } from '@wire-ui/vue'",
				basicExample: `useEventListener('scroll', () => setY(window.scrollY));
useEventListener('click', onClick, buttonRef);`,
			},
		},
		notes: [
			"Always calls the latest handler without resubscribing — inline functions are safe.",
			"Used internally by ContextMenu (outside-click/Escape) and Group.",
		],
	},

	{
		canonicalName: "isomorphic-layout-effect",
		category: "dom",
		description:
			"useLayoutEffect on the client, useEffect on the server — avoids the React SSR layout-effect warning.",
		signature: "(effect, deps?) => void",
		frameworks: {
			react: {
				name: "useIsomorphicLayoutEffect",
				importStatement:
					"import { useIsomorphicLayoutEffect } from '@wire-ui/react'",
				basicExample: `useIsomorphicLayoutEffect(() => {
  measure();
}, []);`,
			},
		},
		notes: [
			"React-only. Vue and Solid have no equivalent SSR layout-effect hazard, so they don't ship this primitive.",
		],
	},

	{
		canonicalName: "direction",
		category: "dom",
		description:
			"Resolves an element's text direction (ltr/rtl). Ships as a reactive hook for render-time reads plus two synchronous helpers, getDirection and isRtl, for event-time reads.",
		signature: "(el) => Direction  //  'ltr' | 'rtl'",
		returns:
			"The reactive form returns the current direction (React: a value; Vue: a Ref; Solid: an Accessor). getDirection/isRtl return a plain value.",
		frameworks: {
			react: {
				name: "useDirection",
				importStatement:
					"import { useDirection, getDirection, isRtl } from '@wire-ui/react'",
				basicExample: `const ref = useRef<HTMLDivElement>(null);
const dir = useDirection(ref);
const style = { insetInlineStart: dir === 'rtl' ? \`\${100 - pct}%\` : \`\${pct}%\` };

// Event-time reads — no state, always current:
function onKeyDown(e: React.KeyboardEvent) {
  const rtl = isRtl(e.currentTarget);
}`,
			},
			solid: {
				name: "createDirection",
				importStatement:
					"import { createDirection, getDirection, isRtl } from '@wire-ui/solid'",
				basicExample: `let track: HTMLDivElement | undefined;
const dir = createDirection(() => track);
const style = () => ({ insetInlineStart: dir() === 'rtl' ? \`\${100 - pct}%\` : \`\${pct}%\` });`,
			},
			vue: {
				name: "useDirection",
				importStatement:
					"import { useDirection, getDirection, isRtl } from '@wire-ui/vue'",
				basicExample: `const track = ref<HTMLElement | null>(null);
const dir = useDirection(track);
// dir.value === 'rtl'`,
			},
		},
		notes: [
			"Resolution order: the nearest ancestor carrying a dir attribute wins, then the computed direction style. Defaults to 'ltr' on the server.",
			"Use getDirection/isRtl inside event handlers (pointer math, arrow keys) where the value must be correct at the moment of interaction; use the reactive form for values consumed during render.",
			"The reactive form observes dir attribute changes on the nearest direction host via MutationObserver, so a later flip is picked up.",
		],
	},

	{
		canonicalName: "is-mounted",
		category: "state",
		description:
			"Tracks whether the component has mounted on the client. False during server render and the first hydration render, then true.",
		signature: "() => Readonly<Ref<boolean>>",
		returns: "A readonly ref that flips to true after mount.",
		frameworks: {
			vue: {
				name: "useIsMounted",
				importStatement: "import { useIsMounted } from '@wire-ui/vue'",
				basicExample: `const mounted = useIsMounted();
// <Teleport v-if="mounted" to="body">…</Teleport>`,
			},
		},
		notes: [
			"Vue-only. Use it to gate client-only output — most importantly <Teleport> — so server markup and the first client render agree and hydration stays mismatch-free.",
			"Not exported from @wire-ui/react or @wire-ui/solid.",
		],
	},
];
