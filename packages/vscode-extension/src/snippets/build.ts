// The snippet set, derived from the component catalog.
//
// One snippet per component per framework, built from the catalog's own usage
// example. Nothing here restates component structure — add a component to
// @wire-ui/mcp and its snippet appears; change its parts and the snippet
// follows.

import {
	getAllComponentMetadata,
	toComponentSlug,
	type ComponentMetadata,
	type Framework,
} from "@wire-ui/typescript-plugin/metadata";
import { toSnippetBody } from "./body.js";
import type { WireSnippet } from "./types.js";

/** Prefix stem, so every Wire UI snippet is reachable by typing `wire-`. */
const PREFIX = "wire";

export function snippetPrefix(component: string): string {
	return `${PREFIX}-${toComponentSlug(component)}`;
}

export function moduleIdFor(framework: Framework): string {
	return `@wire-ui/${framework}`;
}

function toSnippet(
	component: ComponentMetadata,
	framework: Framework,
): WireSnippet | undefined {
	const example = component.examples[framework];
	if (!example) return undefined;

	return {
		component: component.name,
		prefix: snippetPrefix(component.name),
		framework,
		body: toSnippetBody(example.basicExample, framework),
		description: component.description,
		importStatement: example.importStatement,
		moduleId: moduleIdFor(framework),
		docsUrl: component.docsUrl,
	};
}

/** Build the snippet set for one framework, in catalog order. */
export function buildComponentSnippets(framework: Framework): WireSnippet[] {
	const snippets: WireSnippet[] = [];
	for (const component of getAllComponentMetadata()) {
		const snippet = toSnippet(component, framework);
		if (snippet) snippets.push(snippet);
	}
	return snippets;
}

// The catalog is static for the process lifetime, so build each framework's set
// once — the provider asks for it on every keystroke.
const cache = new Map<Framework, WireSnippet[]>();

export function getComponentSnippets(framework: Framework): WireSnippet[] {
	let snippets = cache.get(framework);
	if (!snippets) {
		snippets = buildComponentSnippets(framework);
		cache.set(framework, snippets);
	}
	return snippets;
}
