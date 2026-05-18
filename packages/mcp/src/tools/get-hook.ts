import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { hooks } from "../data/hooks.js";
import type { Framework } from "../data/types.js";

const schema = {
	name: z
		.string()
		.describe(
			'Hook name in any form — useDisclosure, createDisclosure, or canonical "disclosure".',
		),
	framework: z
		.enum(["react", "vue", "solid"])
		.optional()
		.default("react")
		.describe("Target framework (default: react)"),
};

function normalize(input: string): string {
	return input
		.replace(/^(use|create)/i, "")
		.replace(/[-_\s]/g, "")
		.toLowerCase();
}

export function registerGetHook(server: McpServer) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(server as any).tool(
		"get_hook",
		"Get full details for a Wire UI hook/primitive/composable — description, signature, and example code for the chosen framework.",
		schema,
		async ({ name, framework }: { name: string; framework: Framework }) => {
			const normalized = normalize(name);

			const hook = hooks.find((h) => {
				const canon = h.canonicalName.replace(/-/g, "").toLowerCase();
				if (canon === normalized) return true;
				for (const fw of Object.values(h.frameworks)) {
					if (fw && normalize(fw.name) === normalized) return true;
				}
				return false;
			});

			if (!hook) {
				const available = hooks
					.map(
						(h) => h.frameworks[framework]?.name ?? h.canonicalName,
					)
					.join(", ");
				return {
					content: [
						{
							type: "text" as const,
							text: `Hook "${name}" not found. Available in ${framework}: ${available}`,
						},
					],
					isError: true,
				};
			}

			const snippet = hook.frameworks[framework];
			const availableFrameworks = Object.keys(hook.frameworks);

			if (!snippet) {
				return {
					content: [
						{
							type: "text" as const,
							text: `Hook "${hook.canonicalName}" is not available in @wire-ui/${framework}. Available frameworks: ${availableFrameworks.join(", ")}.`,
						},
					],
				};
			}

			const result = {
				name: snippet.name,
				canonicalName: hook.canonicalName,
				category: hook.category,
				description: hook.description,
				signature: hook.signature,
				returns: hook.returns,
				import: snippet.importStatement,
				example: snippet.basicExample,
				notes: hook.notes,
				availableFrameworks,
			};

			return {
				content: [
					{
						type: "text" as const,
						text: JSON.stringify(result, null, 2),
					},
				],
			};
		},
	);
}
