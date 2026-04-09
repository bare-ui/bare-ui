import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const installationGuide = `# Wire UI Installation Guide

## Install

\`\`\`bash
npm install @wire-ui/react
\`\`\`

## Peer Dependencies

React >= 19.0.0 and React DOM >= 19.0.0 are required.

\`\`\`bash
npm install react@^19 react-dom@^19
\`\`\`

## Styling Approach

Wire UI ships zero CSS. All interactive states are exposed through data-* attributes.
Style with any approach: Tailwind, CSS Modules, plain CSS, or inline styles.

### Tailwind Example

\`\`\`tsx
<Button className="[data-hover]:bg-blue-700 [data-active]:scale-95 [data-disabled]:opacity-50">
  Click me
</Button>
\`\`\`

### Plain CSS Example

\`\`\`css
button[data-hover]    { background: #1d4ed8; }
button[data-active]   { transform: scale(0.95); }
button[data-disabled] { opacity: 0.5; }
\`\`\`

## Data Attributes

Attributes are present as an empty string when active, and absent when not — never "true" or "false".

| Attribute           | When present                        |
|---------------------|-------------------------------------|
| data-hover          | Mouse is over the element           |
| data-focus-visible  | Keyboard focus (mirrors :focus-visible) |
| data-active         | Element is being pressed            |
| data-disabled       | Element is disabled                 |
| data-state          | Open/closed, checked/unchecked      |
| data-invalid        | Consumer-controlled via invalidType |
| data-success        | Consumer-controlled via isSuccess   |

## Validation Pattern

Wire UI never validates internally. Set invalidType when your validation logic decides something is invalid:

\`\`\`tsx
<Input.Root
  invalidType={error}
  errorMessage={{ required: 'Required', email: 'Invalid email' }}
>
  <Input.Field type="email" />
  <Input.Error />
</Input.Root>
\`\`\`
`;

export function registerGetInstallationGuide(server: McpServer) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(server as any).tool(
		"get_installation_guide",
		"Get Wire UI installation instructions, peer dependencies, styling approach, and data attribute reference.",
		{},
		async () => {
			return {
				content: [
					{
						type: "text" as const,
						text: installationGuide,
					},
				],
			};
		},
	);
}
