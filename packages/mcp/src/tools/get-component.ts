import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { components } from "../data/components.js";
import type { Framework } from "../data/types.js";

const SUPPORTED_FRAMEWORKS: Framework[] = ["react"];

const schema = {
	name: z
		.string()
		.describe('Component name (e.g., "Button", "Input", "Modal")'),
	framework: z
		.enum(["react", "vue", "solid"])
		.optional()
		.default("react")
		.describe("Target framework (default: react)"),
};

export function registerGetComponent(server: McpServer) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(server as any).tool(
		"get_component",
		"Get full details for a specific Wire UI component including props, data attributes, and usage examples.",
		schema,
		async ({ name, framework }: { name: string; framework: Framework }) => {
			const component = components.find(
				(c) => c.name.toLowerCase() === name.toLowerCase(),
			);

			if (!component) {
				const available = components.map((c) => c.name).join(", ");
				return {
					content: [
						{
							type: "text" as const,
							text: `Component "${name}" not found. Available components: ${available}`,
						},
					],
					isError: true,
				};
			}

			if (!SUPPORTED_FRAMEWORKS.includes(framework)) {
				return {
					content: [
						{
							type: "text" as const,
							text: `The "${framework}" framework is not yet supported for ${component.name}. Currently available: ${SUPPORTED_FRAMEWORKS.join(", ")}.`,
						},
					],
				};
			}

			const snippets = component.frameworks[framework];

			const result = {
				name: component.name,
				category: component.category,
				description: component.description,
				isCompound: component.isCompound,
				parts: component.parts,
				props: component.props,
				dataAttributes: component.dataAttributes,
				notes: component.notes,
				...(snippets && {
					import: snippets.importStatement,
					example: snippets.basicExample,
				}),
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
