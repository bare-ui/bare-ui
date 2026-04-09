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
			{ condition: "Need a one-time code?", component: "OTP" },
			{ condition: "Need a dropdown selection?", component: "Select" },
			{ condition: "Need a search with results?", component: "Search" },
			{ condition: "Need multi-select?", component: "Checkbox" },
			{
				condition: "Need single-select from visible options?",
				component: "Radio",
			},
			{ condition: "Need an on/off toggle?", component: "Switch" },
			{ condition: "Need a star rating?", component: "Rating" },
		],
	},
	{
		name: "overlay",
		question: "What kind of overlay or popup do you need?",
		entries: [
			{ condition: "Need a centered dialog?", component: "Modal" },
			{ condition: "Need a side panel?", component: "Drawer" },
			{ condition: "Need a menu from a trigger?", component: "Dropdown" },
			{ condition: "Need hover/focus info?", component: "Tooltip" },
			{ condition: "Need collapsible sections?", component: "Accordion" },
		],
	},
	{
		name: "styling",
		question: "How should you style Wire UI components?",
		entries: [
			{
				condition: "Using Tailwind?",
				component: 'className="[data-hover]:bg-blue-700"',
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
