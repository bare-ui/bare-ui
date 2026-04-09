import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Framework } from "../data/types.js";

const SUPPORTED_FRAMEWORKS: Framework[] = ["react"];

const exports: Partial<
	Record<
		Framework,
		{
			package: string;
			components: string[];
			hooks: string[];
			types: string[];
		}
	>
> = {
	react: {
		package: "@wire-ui/react",
		components: [
			"Accordion",
			"Alert",
			"Avatar",
			"Badge",
			"Button",
			"Card",
			"Checkbox",
			"Divider",
			"Drawer",
			"Dropdown",
			"Icon",
			"Image",
			"Input",
			"List",
			"Modal",
			"OTP",
			"Password",
			"ProgressBar",
			"Radio",
			"Rating",
			"Search",
			"Select",
			"Switch",
			"Textarea",
			"Timeago",
			"Tooltip",
		],
		hooks: ["useInteractiveState", "useClickOutside"],
		types: [
			"Size",
			"Status",
			"HorizontalPosition",
			"BaseFormFieldProps",
			"BaseOption",
			"ButtonProps",
			"InputRootProps",
			"TextareaRootProps",
			"PasswordRootProps",
			"ModalRootProps",
			"AccordionRootProps",
			"SearchOption",
			"IconSize",
			"InteractiveStateOptions",
			"InteractiveStateResult",
		],
	},
};

const schema = {
	framework: z
		.enum(["react", "vue", "solid"])
		.optional()
		.default("react")
		.describe("Target framework (default: react)"),
};

export function registerGetExportsList(server: McpServer) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(server as any).tool(
		"get_exports_list",
		"List all exports from the Wire UI package — components, hooks, and TypeScript types.",
		schema,
		async ({ framework }: { framework: Framework }) => {
			if (!SUPPORTED_FRAMEWORKS.includes(framework)) {
				return {
					content: [
						{
							type: "text" as const,
							text: `The "${framework}" framework is not yet supported. Currently available: ${SUPPORTED_FRAMEWORKS.join(", ")}.`,
						},
					],
				};
			}

			const data = exports[framework]!;

			const text = [
				`# ${data.package} exports`,
				"",
				`## Components (${data.components.length})`,
				"",
				`\`\`\`tsx`,
				`import { ${data.components.slice(0, 5).join(", ")}, ... } from '${data.package}'`,
				`\`\`\``,
				"",
				data.components.map((c: string) => `- ${c}`).join("\n"),
				"",
				`## Hooks (${data.hooks.length})`,
				"",
				`\`\`\`tsx`,
				`import { ${data.hooks.join(", ")} } from '${data.package}'`,
				`\`\`\``,
				"",
				data.hooks.map((h: string) => `- ${h}`).join("\n"),
				"",
				`## Types (${data.types.length})`,
				"",
				`\`\`\`tsx`,
				`import type { ${data.types.slice(0, 4).join(", ")}, ... } from '${data.package}'`,
				`\`\`\``,
				"",
				data.types.map((t: string) => `- ${t}`).join("\n"),
			].join("\n");

			return {
				content: [
					{
						type: "text" as const,
						text,
					},
				],
			};
		},
	);
}
