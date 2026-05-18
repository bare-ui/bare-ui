import type { HookData } from "./types.js";

// ────────────────────────────────────────────────────────────────────
// Wire UI 0.2 hooks / primitives / composables catalog
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
		signature: "(options: { value?, defaultValue?, onChange? }) => [state, setState]",
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
			"Boolean state with open/close/toggle actions. Use for any \"is this thing open?\" state.",
		signature: "(options?: { defaultOpen?, onOpenChange? }) => { isOpen, open, close, toggle }",
		returns: "Object with isOpen + imperative actions.",
		frameworks: {
			react: {
				name: "useDisclosure",
				importStatement: "import { useDisclosure } from '@wire-ui/react'",
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
		notes: ["Not exported from @wire-ui/vue — Vue refs compose differently."],
	},

	{
		canonicalName: "id",
		category: "state",
		description:
			"SSR-safe id generator with optional prefix. Stable between server and client.",
		signature: "(prefix?: string) => string",
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
		signature: "(options?: { disabled? }) => { handlers, dataAttributes, isHovered, isFocusVisible, isActive }",
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
		signature: "(map: KeyboardMap, options?: { event?: 'keydown' | 'keyup' }) => void",
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
		signature: "(ref: Ref<HTMLElement>, options?: { active?, onEscape? }) => void",
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
		signature: "(options: { reference, floating, placement?, strategy? }) => { x, y, placement }",
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
		signature: "(ref: Ref<HTMLElement>, options?: { threshold?, rootMargin? }) => boolean",
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
		signature: "(ref: Ref<HTMLElement>, callback?: (size) => void) => { width, height }",
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
		description:
			"Reactive boolean that matches a CSS media query.",
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
				importStatement:
					"import { useMediaQuery } from '@wire-ui/vue'",
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
			"Debounces a callback. Returns { execute, cancel, flush } so you can manually cancel pending invocations.",
		signature: "(callback, delay) => { execute, cancel, flush }",
		frameworks: {
			react: {
				name: "useDebounce",
				importStatement: "import { useDebounce } from '@wire-ui/react'",
				basicExample: `const { execute, cancel } = useDebounce((q) => search(q), 300);
return <input onChange={(e) => execute(e.target.value)} />;`,
			},
			solid: {
				name: "createDebounce",
				importStatement:
					"import { createDebounce } from '@wire-ui/solid'",
				basicExample: `const { execute, cancel } = createDebounce((q) => search(q), 300);`,
			},
			vue: {
				name: "useDebounce",
				importStatement: "import { useDebounce } from '@wire-ui/vue'",
				basicExample: `const { execute, cancel } = useDebounce((q) => search(q), 300);`,
			},
		},
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
			"Throttles a callback. Supports leading/trailing options.",
		signature: "(callback, delay, options?: { leading?, trailing? }) => { execute, cancel }",
		frameworks: {
			react: {
				name: "useThrottle",
				importStatement: "import { useThrottle } from '@wire-ui/react'",
				basicExample: `const { execute } = useThrottle((y) => track(y), 100);`,
			},
			solid: {
				name: "createThrottle",
				importStatement:
					"import { createThrottle } from '@wire-ui/solid'",
				basicExample: `const { execute } = createThrottle((y) => track(y), 100);`,
			},
			vue: {
				name: "useThrottle",
				importStatement: "import { useThrottle } from '@wire-ui/vue'",
				basicExample: `const { execute } = useThrottle((y) => track(y), 100);`,
			},
		},
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
];
