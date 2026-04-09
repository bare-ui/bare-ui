import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { components } from "../data/components.js";
import { decisionTrees } from "../data/decision-trees.js";
import type { Framework } from "../data/types.js";

const SUPPORTED_FRAMEWORKS: Framework[] = ["react"];

function scoreComponent(
	query: string,
	component: (typeof components)[number],
): number {
	const tokens = query.toLowerCase().split(/\s+/);
	let score = 0;

	for (const token of tokens) {
		if (component.name.toLowerCase().includes(token)) score += 10;
		if (component.description.toLowerCase().includes(token)) score += 5;
		if (component.category.includes(token)) score += 3;
		for (const part of component.parts) {
			if (part.toLowerCase().includes(token)) score += 2;
		}
		for (const attrs of Object.values(component.props)) {
			for (const prop of attrs) {
				if (prop.name.toLowerCase().includes(token)) score += 2;
				if (prop.description.toLowerCase().includes(token)) score += 1;
			}
		}
		for (const attr of component.dataAttributes) {
			if (attr.name.toLowerCase().includes(token)) score += 2;
		}
		if (component.notes) {
			for (const note of component.notes) {
				if (note.toLowerCase().includes(token)) score += 1;
			}
		}
	}

	return score;
}

const schema = {
	query: z.string().describe("Free-text search query"),
	framework: z
		.enum(["react", "vue", "solid"])
		.optional()
		.default("react")
		.describe("Target framework (default: react)"),
};

export function registerSearchDocs(server: McpServer) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(server as any).tool(
		"search_docs",
		"Search Wire UI documentation by keyword. Returns matching components ranked by relevance.",
		schema,
		async ({
			query,
			framework,
		}: {
			query: string;
			framework: Framework;
		}) => {
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

			const scored = components
				.filter((c) => c.frameworks[framework])
				.map((c) => ({ component: c, score: scoreComponent(query, c) }))
				.filter((s) => s.score > 0)
				.sort((a, b) => b.score - a.score)
				.slice(0, 5);

			if (scored.length === 0) {
				return {
					content: [
						{
							type: "text" as const,
							text: `No components matched "${query}". Try searching for component names (Button, Input, Modal), features (validation, toggle, dropdown), or data attributes (data-hover, data-state).`,
						},
					],
				};
			}

			const results = scored.map((s) => {
				const snippets = s.component.frameworks[framework];
				return {
					name: s.component.name,
					category: s.component.category,
					description: s.component.description,
					relevance: s.score,
					...(snippets && { import: snippets.importStatement }),
				};
			});

			// Check decision trees for matches
			const queryLower = query.toLowerCase();
			const matchingTrees = decisionTrees.filter(
				(t) =>
					t.name.includes(queryLower) ||
					t.question.toLowerCase().includes(queryLower) ||
					t.entries.some(
						(e) =>
							e.condition.toLowerCase().includes(queryLower) ||
							e.component.toLowerCase().includes(queryLower),
					),
			);

			const output: Record<string, unknown> = { components: results };
			if (matchingTrees.length > 0) {
				output.decisionTrees = matchingTrees.map((t) => t.name);
			}

			return {
				content: [
					{
						type: "text" as const,
						text: JSON.stringify(output, null, 2),
					},
				],
			};
		},
	);
}
