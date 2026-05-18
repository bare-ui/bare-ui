import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { components } from "../data/components.js";
import { hooks } from "../data/hooks.js";
import type { Framework } from "../data/types.js";

const PACKAGE_BY_FRAMEWORK: Record<Framework, string> = {
	react: "@wire-ui/react",
	solid: "@wire-ui/solid",
	vue: "@wire-ui/vue",
};

const HOOK_NOUN: Record<Framework, string> = {
	react: "Hooks",
	solid: "Primitives",
	vue: "Composables",
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
		"List all exports from a Wire UI package — components, hooks/primitives/composables, and a sample of TypeScript types — for the chosen framework.",
		schema,
		async ({ framework }: { framework: Framework }) => {
			const pkg = PACKAGE_BY_FRAMEWORK[framework];
			const componentNames = components
				.filter((c) => c.frameworks[framework])
				.map((c) => c.name)
				.sort();

			const hookNames = hooks
				.filter((h) => h.frameworks[framework])
				.map((h) => h.frameworks[framework]!.name)
				.sort();

			const hookNoun = HOOK_NOUN[framework];

			const text = [
				`# ${pkg} exports`,
				"",
				`## Components (${componentNames.length})`,
				"",
				"```ts",
				`import { ${componentNames.slice(0, 5).join(", ")}, ... } from '${pkg}'`,
				"```",
				"",
				componentNames.map((c) => `- ${c}`).join("\n"),
				"",
				`## ${hookNoun} (${hookNames.length})`,
				"",
				"```ts",
				`import { ${hookNames.slice(0, 5).join(", ")}, ... } from '${pkg}'`,
				"```",
				"",
				hookNames.map((h) => `- ${h}`).join("\n"),
				"",
				`## Types`,
				"",
				"All component sub-part types and shared types (Size, Status, HorizontalPosition, BaseFormFieldProps, BaseOption, framework-specific hook options) are exported as type-only re-exports.",
				"",
				"```ts",
				`import type { Size, Status, BaseFormFieldProps, ButtonProps, InputRootProps, ModalRootProps, ... } from '${pkg}'`,
				"```",
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
