import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { components } from "../data/components.js";
import { hooks } from "../data/hooks.js";
import { decisionTrees } from "../data/decision-trees.js";
import type { Framework } from "../data/types.js";

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
			if (attr.description.toLowerCase().includes(token)) score += 1;
			// `values` carries the named data-state enum ("open" | "closed"), which
			// is often what a consumer actually searches for.
			if (attr.values?.toLowerCase().includes(token)) score += 2;
			if (attr.appliesTo?.toLowerCase().includes(token)) score += 1;
		}
		if (component.notes) {
			for (const note of component.notes) {
				if (note.toLowerCase().includes(token)) score += 1;
			}
		}
	}

	return score;
}

function scoreHook(
	query: string,
	hook: (typeof hooks)[number],
	framework: Framework,
): number {
	const tokens = query.toLowerCase().split(/\s+/);
	let score = 0;
	const fwName = hook.frameworks[framework]?.name ?? "";

	for (const token of tokens) {
		if (hook.canonicalName.toLowerCase().includes(token)) score += 8;
		if (fwName.toLowerCase().includes(token)) score += 8;
		if (hook.description.toLowerCase().includes(token)) score += 4;
		if (hook.category.includes(token)) score += 3;
		if (hook.signature && hook.signature.toLowerCase().includes(token))
			score += 2;
		if (hook.returns?.toLowerCase().includes(token)) score += 1;
		if (hook.notes) {
			for (const note of hook.notes) {
				if (note.toLowerCase().includes(token)) score += 1;
			}
		}
		// Sibling helpers (getDirection, isRtl) live in the import statement rather
		// than `name`, so index it too or they are unsearchable.
		if (
			hook.frameworks[framework]?.importStatement
				.toLowerCase()
				.includes(token)
		)
			score += 4;
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
		"Search Wire UI documentation by keyword across components, hooks, and decision trees. Returns matches ranked by relevance for the chosen framework.",
		schema,
		async ({
			query,
			framework,
		}: {
			query: string;
			framework: Framework;
		}) => {
			const scoredComponents = components
				.filter((c) => c.frameworks[framework])
				.map((c) => ({ component: c, score: scoreComponent(query, c) }))
				.filter((s) => s.score > 0)
				.sort((a, b) => b.score - a.score)
				.slice(0, 5);

			const scoredHooks = hooks
				.filter((h) => h.frameworks[framework])
				.map((h) => ({
					hook: h,
					score: scoreHook(query, h, framework),
				}))
				.filter((s) => s.score > 0)
				.sort((a, b) => b.score - a.score)
				.slice(0, 5);

			if (scoredComponents.length === 0 && scoredHooks.length === 0) {
				return {
					content: [
						{
							type: "text" as const,
							text: `No matches for "${query}". Try component names (Button, Input, Modal), hook names (useDisclosure, useFloating), features (validation, toggle, dropdown), or data attributes (data-hover, data-state).`,
						},
					],
				};
			}

			const componentResults = scoredComponents.map((s) => {
				const snippets = s.component.frameworks[framework];
				return {
					name: s.component.name,
					category: s.component.category,
					description: s.component.description,
					relevance: s.score,
					...(snippets && { import: snippets.importStatement }),
				};
			});

			const hookResults = scoredHooks.map((s) => {
				const snippets = s.hook.frameworks[framework];
				return {
					name: snippets?.name ?? s.hook.canonicalName,
					category: s.hook.category,
					description: s.hook.description,
					relevance: s.score,
					...(snippets && { import: snippets.importStatement }),
				};
			});

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

			const output: Record<string, unknown> = {};
			if (componentResults.length > 0)
				output.components = componentResults;
			if (hookResults.length > 0) output.hooks = hookResults;
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
