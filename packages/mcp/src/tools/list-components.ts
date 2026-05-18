import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { components } from "../data/components.js";
import type { Framework } from "../data/types.js";

const schema = {
	framework: z
		.enum(["react", "vue", "solid"])
		.optional()
		.default("react")
		.describe("Target framework (default: react)"),
	category: z
		.enum(["form", "overlay", "display", "layout", "navigation", "feedback"])
		.optional()
		.describe("Filter by component category"),
};

export function registerListComponents(server: McpServer) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(server as any).tool(
		"list_components",
		"List all Wire UI components available in the chosen framework, with categories and descriptions. Optionally filter by category.",
		schema,
		async ({
			framework,
			category,
		}: {
			framework: Framework;
			category?: string;
		}) => {
			let filtered = components.filter((c) => c.frameworks[framework]);

			if (category) {
				filtered = filtered.filter((c) => c.category === category);
			}

			const list = filtered.map((c) => ({
				name: c.name,
				category: c.category,
				description: c.description,
				isCompound: c.isCompound,
				parts: c.parts,
			}));

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
