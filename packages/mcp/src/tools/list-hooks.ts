import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { hooks } from "../data/hooks.js";
import type { Framework } from "../data/types.js";

const schema = {
	framework: z
		.enum(["react", "vue", "solid"])
		.optional()
		.default("react")
		.describe(
			"Target framework. Hooks are exposed as useX (React/Vue) or createX (Solid).",
		),
	category: z
		.enum([
			"state",
			"interaction",
			"observer",
			"positioning",
			"timing",
			"dom",
		])
		.optional()
		.describe("Filter by hook category"),
};

export function registerListHooks(server: McpServer) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(server as any).tool(
		"list_hooks",
		"List all Wire UI hooks/primitives/composables available in the chosen framework. React/Vue expose them as useX; Solid as createX.",
		schema,
		async ({
			framework,
			category,
		}: {
			framework: Framework;
			category?: string;
		}) => {
			let filtered = hooks.filter((h) => h.frameworks[framework]);
			if (category) {
				filtered = filtered.filter((h) => h.category === category);
			}

			const list = filtered.map((h) => {
				const fw = h.frameworks[framework]!;
				return {
					name: fw.name,
					canonicalName: h.canonicalName,
					category: h.category,
					description: h.description,
				};
			});

			return {
				content: [
					{
						type: "text" as const,
						text: JSON.stringify(list, null, 2),
					},
				],
			};
		},
	);
}
