import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { decisionTrees } from "../data/decision-trees.js";

const schema = {
	scenario: z
		.enum([
			"form",
			"overlay",
			"navigation",
			"feedback",
			"hooks",
			"styling",
		])
		.describe("Which decision tree to retrieve"),
};

export function registerGetDecisionTree(server: McpServer) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(server as any).tool(
		"get_decision_tree",
		"Get a decision tree to help choose the right Wire UI component (or hook) for a given scenario.",
		schema,
		async ({ scenario }: { scenario: string }) => {
			const tree = decisionTrees.find((t) => t.name === scenario);

			if (!tree) {
				return {
					content: [
						{
							type: "text" as const,
							text: `Decision tree "${scenario}" not found. Available: ${decisionTrees.map((t) => t.name).join(", ")}`,
						},
					],
					isError: true,
				};
			}

			const lines = [
				tree.question,
				"",
				...tree.entries.map((e) => `- ${e.condition} → ${e.component}`),
			];

			return {
				content: [
					{
						type: "text" as const,
						text: lines.join("\n"),
					},
				],
			};
		},
	);
}
