import type { DecisionTree } from "./types.js";

export const decisionTrees: DecisionTree[] = [
	{
		name: "form",
		question: "What kind of form input do you need?",
		entries: [
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
			{ condition: "Need a star rating?", component: "Rating" },
			{ condition: "Need a numeric range?", component: "Slider (React only)" },
			{ condition: "Need keyword tags?", component: "TagInput" },
			{ condition: "Need to pick a date?", component: "DatePicker" },
			{ condition: "Need a file uploader?", component: "FileUpload" },
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
				condition: "Need an anchored floating panel?",
				component: "Popover (React only)",
			},
			{ condition: "Need a menu from a trigger?", component: "Dropdown" },
			{ condition: "Need a right-click menu?", component: "ContextMenu" },
			{ condition: "Need hover/focus info?", component: "Tooltip" },
			{ condition: "Need collapsible sections?", component: "Accordion" },
		],
	},
	{
		name: "navigation",
		question: "What kind of navigation do you need?",
		entries: [
			{ condition: "Need a hierarchical trail?", component: "Breadcrumb" },
			{ condition: "Need page paging?", component: "Pagination" },
			{ condition: "Need switchable views?", component: "Tabs (React only)" },
			{
				condition: "Need top-level app navigation?",
				component: "NavigationMenu",
			},
			{ condition: "Need an application menu bar?", component: "MenuBar" },
			{ condition: "Need a file/folder tree?", component: "TreeView" },
		],
	},
	{
		name: "feedback",
		question: "What kind of feedback do you need to show?",
		entries: [
			{ condition: "Need a loading spinner?", component: "Spinner" },
			{ condition: "Need a placeholder while loading?", component: "Skeleton" },
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
				condition: "Need to debounce a callback?",
				component: "useDebounce / createDebounce",
			},
			{
				condition: "Need to react to viewport size or visibility?",
				component:
					"useMediaQuery, useResizeObserver, useIntersectionObserver",
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
		],
	},
];
