import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Framework } from "../data/types.js";

const GUIDES: Record<Framework, string> = {
	react: `# @wire-ui/react Installation Guide

## Install

\`\`\`bash
npm install @wire-ui/react
\`\`\`

## Peer Dependencies

React >= 19.0.0 and React DOM >= 19.0.0.

\`\`\`bash
npm install react@^19 react-dom@^19
\`\`\`

## Styling Approach

Wire UI ships zero CSS. All interactive states are exposed through data-* attributes.
Style with any approach: Tailwind, CSS Modules, plain CSS, or inline styles.

### Tailwind Example

\`\`\`tsx
<Button className="data-[hover]:bg-blue-700 data-[active]:scale-95 data-[disabled]:opacity-50">
  Click me
</Button>
\`\`\`

### Plain CSS Example

\`\`\`css
button[data-hover]    { background: #1d4ed8; }
button[data-active]   { transform: scale(0.95); }
button[data-disabled] { opacity: 0.5; }
\`\`\`

## Validation Pattern

Wire UI never validates internally. Set \`invalidType\` when your validation logic decides something is invalid:

\`\`\`tsx
<Input.Root
  invalidType={error}
  errorMessage={{ required: 'Required', email: 'Invalid email' }}
>
  <Input.Field type="email" />
  <Input.Error />
</Input.Root>
\`\`\`
`,

	solid: `# @wire-ui/solid Installation Guide

## Install

\`\`\`bash
npm install @wire-ui/solid
\`\`\`

## Peer Dependencies

Solid.js >= 1.9.0.

\`\`\`bash
npm install solid-js@^1.9
\`\`\`

## Styling Approach

Wire UI ships zero CSS. All interactive states are exposed through data-* attributes.
Style with any approach: Tailwind, CSS Modules, plain CSS, or inline styles.

### Tailwind Example

\`\`\`tsx
<Button class="data-[hover]:bg-blue-700 data-[active]:scale-95 data-[disabled]:opacity-50">
  Click me
</Button>
\`\`\`

### Plain CSS Example

\`\`\`css
button[data-hover]    { background: #1d4ed8; }
button[data-active]   { transform: scale(0.95); }
button[data-disabled] { opacity: 0.5; }
\`\`\`

## Signals and Reactivity

Wire UI Solid uses signals throughout. When passing controlled values, call the signal as a function:

\`\`\`tsx
const [value, setValue] = createSignal('');

<Input.Root value={value()} onChange={setValue}>
  <Input.Field type="email" />
</Input.Root>
\`\`\`

## Validation Pattern

Same as React — set \`invalidType\` from your own validation logic.
`,

	vue: `# @wire-ui/vue Installation Guide

## Install

\`\`\`bash
npm install @wire-ui/vue
\`\`\`

## Peer Dependencies

Vue >= 3.5.0.

\`\`\`bash
npm install vue@^3.5
\`\`\`

## Styling Approach

Wire UI ships zero CSS. All interactive states are exposed through data-* attributes.
Style with any approach: Tailwind, CSS Modules, plain CSS, or inline styles.

### Tailwind Example

\`\`\`vue
<template>
  <Button class="data-[hover]:bg-blue-700 data-[active]:scale-95 data-[disabled]:opacity-50">
    Click me
  </Button>
</template>
\`\`\`

### Plain CSS Example

\`\`\`css
button[data-hover]    { background: #1d4ed8; }
button[data-active]   { transform: scale(0.95); }
button[data-disabled] { opacity: 0.5; }
\`\`\`

## SFC Template Conventions

Use v-bind (\`:prop\`) for dynamic props, kebab-case events for change handlers:

\`\`\`vue
<template>
  <Modal.Root :open="open" @open-change="open = $event">
    <Modal.Portal>...</Modal.Portal>
  </Modal.Root>
</template>
\`\`\`

## Validation Pattern

Same as React/Solid — set \`invalidType\` from your own validation logic.
`,
};

const SHARED = `## Data Attributes

Attributes are present as an empty string when active, and absent when not — never "true" or "false".

| Attribute           | When present                            |
|---------------------|-----------------------------------------|
| data-hover          | Mouse is over the element               |
| data-focus-visible  | Keyboard focus (mirrors :focus-visible) |
| data-active         | Element is being pressed                |
| data-disabled       | Element is disabled                     |
| data-state          | Named state; values vary by component   |
| data-invalid        | Consumer-controlled via invalidType     |
| data-success        | Consumer-controlled via isSuccess (Input, Textarea) |
| data-highlighted    | Keyboard-highlighted option/item        |
| data-selected       | Currently selected item                 |
| data-checked        | Checkbox/Radio/Switch is on             |
| data-side / data-align | Resolved popover placement           |
| data-part           | Marks an element Wire UI renders for you |

\`data-state\` is always a named string, never a boolean. The value set depends on the component:
\`open|closed\` (Modal, Popover, Accordion, Select, …), \`active|inactive\` (Tabs), \`on|off\` (Toolbar.Toggle),
\`active|completed|inactive\` (Stepper), \`visible|hidden\` (ScrollArea), \`typing|done\` (Typewriter).

Checked state is presence-based \`data-checked\`, **not** \`data-state="checked"\`.

Components that render internal elements for you (Slider, ProgressBar, Alert, Image) mark them with
\`data-part\`; that attribute is the only styling hook those elements have.
`;

const schema = {
	framework: z
		.enum(["react", "vue", "solid"])
		.optional()
		.default("react")
		.describe("Target framework (default: react)"),
};

export function registerGetInstallationGuide(server: McpServer) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(server as any).tool(
		"get_installation_guide",
		"Get Wire UI installation instructions, peer dependencies, styling approach, and data attribute reference for the chosen framework.",
		schema,
		async ({ framework }: { framework: Framework }) => {
			return {
				content: [
					{
						type: "text" as const,
						text: GUIDES[framework] + "\n" + SHARED,
					},
				],
			};
		},
	);
}
