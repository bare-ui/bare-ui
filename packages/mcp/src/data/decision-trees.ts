import type { DecisionTree } from "./types.js";

// ────────────────────────────────────────────────────────────────────
// Task-oriented trees: "I need to do X" → which component/hook.
//
// These are keyed by task, not by the `category` field on ComponentData,
// so a component may appear in more than one tree (e.g. Alert is a display
// component but answers a feedback question). Every component in the catalog
// should be reachable from at least one tree.
//
// Every component ships in all three libraries — never annotate an entry with
// a framework restriction.
// ────────────────────────────────────────────────────────────────────

export const decisionTrees: DecisionTree[] = [
	{
		name: "form",
		question: "What kind of form input do you need?",
		entries: [
			{ condition: "Need a clickable action?", component: "Button" },
			{ condition: "Need a text input?", component: "Input" },
			{ condition: "Need multi-line text?", component: "Textarea" },
			{
				condition: "Need a password with show/hide?",
				component: "Password",
			},
			{ condition: "Need a numeric input?", component: "NumberInput" },
			{ condition: "Need a one-time code?", component: "OTP" },
			{ condition: "Need a dropdown selection?", component: "Select" },
			{
				condition: "Need an autocomplete with filterable options?",
				component: "Combobox",
			},
			{ condition: "Need a search with results?", component: "Search" },
			{ condition: "Need multi-select?", component: "Checkbox" },
			{
				condition: "Need single-select from visible options?",
				component: "Radio",
			},
			{ condition: "Need an on/off toggle?", component: "Switch" },
			{
				condition: "Need a pressed/unpressed button, or a toggle group?",
				component: "Toggle",
			},
			{ condition: "Need a star rating?", component: "Rating" },
			{ condition: "Need a numeric range?", component: "Slider" },
			{ condition: "Need keyword tags?", component: "TagInput" },
			{ condition: "Need to pick a date?", component: "DatePicker" },
			{ condition: "Need to pick a colour?", component: "ColorPicker" },
			{ condition: "Need a file uploader?", component: "FileUpload" },
			{
				condition: "Need click-to-edit inline text?",
				component: "Editable",
			},
			{
				condition: "Need @-mention autocomplete inside a text field?",
				component: "Mention",
			},
			{
				condition: "Need a markdown editor with preview?",
				component: "RichText",
			},
			{
				condition: "Need form-level validation wrapping fields?",
				component: "Form",
			},
		],
	},
	{
		name: "overlay",
		question: "What kind of overlay or popup do you need?",
		entries: [
			{ condition: "Need a centered dialog?", component: "Modal" },
			{ condition: "Need a side panel?", component: "Drawer" },
			{
				condition: "Need a bottom sheet with snap points and drag-to-dismiss?",
				component: "Sheet",
			},
			{
				condition: "Need an anchored floating panel?",
				component: "Popover",
			},
			{ condition: "Need a menu from a trigger?", component: "Dropdown" },
			{ condition: "Need a right-click menu?", component: "ContextMenu" },
			{ condition: "Need hover/focus info?", component: "Tooltip" },
			{
				condition: "Need a richer preview card on hover?",
				component: "HoverCard",
			},
			{
				condition: "Need a searchable command palette?",
				component: "Command",
			},
		],
	},
	{
		name: "navigation",
		question: "What kind of navigation do you need?",
		entries: [
			{
				condition: "Need a hierarchical trail?",
				component: "Breadcrumb",
			},
			{ condition: "Need page paging?", component: "Pagination" },
			{ condition: "Need switchable views?", component: "Tabs" },
			{
				condition: "Need top-level app navigation?",
				component: "NavigationMenu",
			},
			{
				condition: "Need an application menu bar?",
				component: "MenuBar",
			},
			{
				condition: "Need a row of actions with roving-tabindex keyboard nav?",
				component: "Toolbar",
			},
			{
				condition: "Need a multi-step flow with progress?",
				component: "Stepper",
			},
			{ condition: "Need a file/folder tree?", component: "TreeView" },
		],
	},
	{
		name: "display",
		question: "What kind of content display do you need?",
		entries: [
			{ condition: "Need a grouped content container?", component: "Card" },
			{
				condition: "Need a user picture with initials fallback?",
				component: "Avatar",
			},
			{ condition: "Need a small count or status label?", component: "Badge" },
			{
				condition: "Need a removable keyword chip?",
				component: "Tag",
			},
			{ condition: "Need an inline status banner?", component: "Alert" },
			{ condition: "Need a single headline metric?", component: "Stat" },
			{
				condition: "Need an empty/zero-state placeholder?",
				component: "EmptyState",
			},
			{
				condition: "Need an image with load state and fallback?",
				component: "Image",
			},
			{ condition: "Need an inline icon?", component: "Icon" },
			{
				condition: "Need a relative timestamp that self-updates?",
				component: "Timeago",
			},
			{ condition: "Need a month grid?", component: "Calendar" },
			{ condition: "Need a hierarchical tree?", component: "TreeView" },
			{
				condition: "Need a horizontally scrollable slide deck?",
				component: "Carousel",
			},
			{
				condition: "Need a message thread with streaming support?",
				component: "Chat",
			},
			{
				condition: "Need to render markdown?",
				component: "Markdown",
			},
			{
				condition: "Need syntax-highlighted code with copy?",
				component: "CodeBlock",
			},
			{
				condition: "Need a unified or split file diff?",
				component: "Diff",
			},
			{
				condition: "Need footnote-style source references?",
				component: "Citation",
			},
			{
				condition: "Need token-by-token text reveal for streamed output?",
				component: "Typewriter",
			},
		],
	},
	{
		name: "layout",
		question: "What kind of layout primitive do you need?",
		entries: [
			{
				condition: "Need a semantic separator between sections?",
				component: "Divider",
			},
			{
				condition: "Need a semantic ordered/unordered list wrapper?",
				component: "List",
			},
			{
				condition: "Need to lock a box to a fixed width:height ratio?",
				component: "AspectRatio",
			},
			{
				condition: "Need collapsible sections that expand in flow?",
				component: "Accordion",
			},
			{
				condition: "Need draggable split panes?",
				component: "ResizablePanels",
			},
			{
				condition: "Need custom scrollbars over a scroll container?",
				component: "ScrollArea",
			},
			{
				condition: "Need to render only the visible rows of a long list?",
				component: "Virtualizer",
			},
			{
				condition: "Need to load more content as the user scrolls?",
				component: "InfiniteScroll",
			},
		],
	},
	{
		name: "feedback",
		question: "What kind of feedback do you need to show?",
		entries: [
			{
				condition: "Need to announce a loading state to screen readers?",
				component: "Spinner",
			},
			{
				condition: "Need a placeholder while loading?",
				component: "Skeleton",
			},
			{ condition: "Need a progress bar?", component: "ProgressBar" },
			{
				condition: "Need an inline status banner?",
				component: "Alert",
			},
			{ condition: "Need a transient notification?", component: "Toast" },
		],
	},
	{
		name: "hooks",
		question: "Which hook/primitive/composable should you use?",
		entries: [
			{
				condition: "Need controlled/uncontrolled state in one API?",
				component: "useControllableState / createControllableState",
			},
			{
				condition: "Need open/close/toggle boolean state?",
				component: "useDisclosure / createDisclosure",
			},
			{
				condition: "Need to position a floating element?",
				component: "useFloating / createFloating",
			},
			{
				condition: "Need to contain focus inside an element?",
				component: "useFocusTrap / createFocusTrap",
			},
			{
				condition: "Need to detect clicks outside an element?",
				component: "useClickOutside / createClickOutside",
			},
			{
				condition: "Need to lock page scroll?",
				component: "useScrollLock / createScrollLock",
			},
			{
				condition: "Need hover/focus-visible/active/disabled data attributes?",
				component: "useInteractiveState / createInteractiveState",
			},
			{
				condition: "Need to know if the layout is RTL?",
				component:
					"useDirection / createDirection (or getDirection / isRtl for event-time reads)",
			},
			{
				condition: "Need an SSR-safe unique id?",
				component: "useId / createId",
			},
			{
				condition: "Need to gate client-only output during hydration?",
				component: "useIsMounted (Vue only)",
			},
			{
				condition: "Need to debounce a value or callback?",
				component:
					"useDebounce / useDebouncedCallback (createDebounce / createDebouncedCallback)",
			},
			{
				condition: "Need to throttle a value or callback?",
				component:
					"useThrottle / useThrottledCallback (createThrottle / createThrottledCallback)",
			},
			{
				condition: "Need to react to viewport size or visibility?",
				component:
					"useMediaQuery, useResizeObserver, useIntersectionObserver",
			},
			{
				condition: "Need to persist state across reloads?",
				component: "useLocalStorage / useSessionStorage",
			},
			{
				condition: "Need undo/redo history?",
				component: "useUndoRedo / createUndoRedo",
			},
			{
				condition: "Need to copy text to the clipboard?",
				component: "useCopyToClipboard / createCopyToClipboard",
			},
			{
				condition: "Need global keyboard shortcuts?",
				component: "useHotkeys / createHotkeys",
			},
			{
				condition: "Need to respect prefers-reduced-motion?",
				component: "useReduceMotion / createReduceMotion",
			},
		],
	},
	{
		name: "styling",
		question: "How should you style Wire UI components?",
		entries: [
			{
				condition: "Using Tailwind?",
				component: 'class="data-[hover]:bg-blue-700"',
			},
			{
				condition: "Using CSS Modules?",
				component: "[data-hover] { background: #1d4ed8; }",
			},
			{
				condition: "Using plain CSS?",
				component: "button[data-hover] { background: #1d4ed8; }",
			},
			{
				condition: "Need to style an element Wire UI renders for you?",
				component:
					"Target its marker attribute — e.g. [data-part=thumb] on Slider, [data-toolbar-item] on Toolbar",
			},
			{
				condition: "Checking whether a flag is on?",
				component:
					"Presence-based attrs are '' when on and absent when off — match [data-disabled], never [data-disabled=true]",
			},
		],
	},
];
