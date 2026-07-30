// The snippet set, derived from the catalog.
//
// One snippet per component, per hook, and per scaffold, per framework, built
// from the catalog's own examples. Nothing here restates component structure or
// hook signatures — add an entry to @wire-ui/mcp and its snippet appears; change
// it and the snippet follows.

import {
	getAllComponentMetadata,
	getAllHookMetadata,
	getAllScaffoldMetadata,
	toComponentSlug,
	type ComponentMetadata,
	type Framework,
	type HookMetadata,
	type ScaffoldMetadata,
} from "@wire-ui/typescript-plugin/metadata";
import { toCodeSnippetBody, toScaffoldBody, toSnippetBody } from "./body.js";
import type { WireSnippet } from "./types.js";

/** Prefix stem, so every Wire UI snippet is reachable by typing `wire-`. */
const PREFIX = "wire";

/**
 * Scaffolds sit behind a second segment. `Chat` and `Markdown` are components in
 * their own right, so `wire-chat` is already taken by a component snippet — and
 * a scaffold inserts something very different from that component's markup.
 * `wire-ai-chat` keeps the two apart while still surfacing when `wire-chat` is
 * typed, which matches it as a subsequence.
 */
const SCAFFOLD_PREFIX = "ai";

export function snippetPrefix(component: string): string {
	return `${PREFIX}-${toComponentSlug(component)}`;
}

/** Hook canonical names are already kebab-case: `hotkeys` -> `wire-hotkeys`. */
export function hookSnippetPrefix(canonicalName: string): string {
	return `${PREFIX}-${canonicalName}`;
}

export function scaffoldSnippetPrefix(name: string): string {
	return `${PREFIX}-${SCAFFOLD_PREFIX}-${name}`;
}

export function moduleIdFor(framework: Framework): string {
	return `@wire-ui/${framework}`;
}

function toComponentSnippet(
	component: ComponentMetadata,
	framework: Framework,
): WireSnippet | undefined {
	const example = component.examples[framework];
	if (!example) return undefined;

	return {
		kind: "component",
		name: component.name,
		title: component.name,
		prefix: snippetPrefix(component.name),
		framework,
		body: toSnippetBody(example.basicExample, framework),
		description: component.description,
		imports: {
			names: [component.name],
			statement: example.importStatement,
			moduleId: moduleIdFor(framework),
		},
		docsUrl: component.docsUrl,
	};
}

function toHookSnippet(
	hook: HookMetadata,
	framework: Framework,
): WireSnippet | undefined {
	const example = hook.examples[framework];
	if (!example) return undefined;

	return {
		kind: "hook",
		name: hook.canonicalName,
		// The export name, not the canonical one — `createHotkeys` is what a Solid
		// user is looking at once the snippet lands.
		title: example.name,
		prefix: hookSnippetPrefix(hook.canonicalName),
		framework,
		body: toCodeSnippetBody(example.basicExample),
		description: hook.description,
		imports: {
			names: example.importedNames,
			statement: example.importStatement,
			moduleId: moduleIdFor(framework),
		},
		docsUrl: hook.docsUrl,
		signature: hook.signature,
	};
}

function toScaffoldSnippet(
	scaffold: ScaffoldMetadata,
	framework: Framework,
): WireSnippet | undefined {
	const source = scaffold.sources[framework];
	if (!source) return undefined;

	return {
		kind: "scaffold",
		name: scaffold.name,
		title: scaffold.title,
		prefix: scaffoldSnippetPrefix(scaffold.name),
		framework,
		body: toScaffoldBody(source),
		description: scaffold.description,
		// No `imports`: the body is a whole file and brings its own.
	};
}

function collect<T>(
	entries: T[],
	framework: Framework,
	toSnippet: (entry: T, framework: Framework) => WireSnippet | undefined,
): WireSnippet[] {
	const snippets: WireSnippet[] = [];
	for (const entry of entries) {
		const snippet = toSnippet(entry, framework);
		if (snippet) snippets.push(snippet);
	}
	return snippets;
}

/** Build one framework's component snippets, in catalog order. */
export function buildComponentSnippets(framework: Framework): WireSnippet[] {
	return collect(getAllComponentMetadata(), framework, toComponentSnippet);
}

/** Build one framework's hook snippets, in catalog order. */
export function buildHookSnippets(framework: Framework): WireSnippet[] {
	return collect(getAllHookMetadata(), framework, toHookSnippet);
}

/** Build one framework's scaffold snippets, in catalog order. */
export function buildScaffoldSnippets(framework: Framework): WireSnippet[] {
	return collect(getAllScaffoldMetadata(), framework, toScaffoldSnippet);
}

// The catalog is static for the process lifetime, so build each set once — the
// provider asks for it on every keystroke.
const caches = new Map<string, WireSnippet[]>();

function cached(key: string, build: () => WireSnippet[]): WireSnippet[] {
	let snippets = caches.get(key);
	if (!snippets) {
		snippets = build();
		caches.set(key, snippets);
	}
	return snippets;
}

export function getComponentSnippets(framework: Framework): WireSnippet[] {
	return cached(`component:${framework}`, () =>
		buildComponentSnippets(framework),
	);
}

export function getHookSnippets(framework: Framework): WireSnippet[] {
	return cached(`hook:${framework}`, () => buildHookSnippets(framework));
}

export function getScaffoldSnippets(framework: Framework): WireSnippet[] {
	return cached(`scaffold:${framework}`, () =>
		buildScaffoldSnippets(framework),
	);
}
