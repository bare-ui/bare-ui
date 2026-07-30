import { describe, expect, it } from "vitest";
import {
	FRAMEWORKS,
	getAllComponentMetadata,
	getAllHookMetadata,
	getAllScaffoldMetadata,
	type Framework,
} from "@wire-ui/typescript-plugin/metadata";
import {
	buildComponentSnippets,
	buildHookSnippets,
	buildScaffoldSnippets,
	getComponentSnippets,
	getHookSnippets,
	getScaffoldSnippets,
	hookSnippetPrefix,
	moduleIdFor,
	scaffoldSnippetPrefix,
	snippetPrefix,
} from "./build.js";
import type { WireSnippet } from "./types.js";

describe("prefixes", () => {
	it("kebab-cases the component behind a shared `wire-` stem", () => {
		expect(snippetPrefix("Button")).toBe("wire-button");
		expect(snippetPrefix("Modal")).toBe("wire-modal");
		expect(snippetPrefix("Combobox")).toBe("wire-combobox");
		expect(snippetPrefix("NumberInput")).toBe("wire-number-input");
	});

	it("reaches a hook by its framework-independent canonical name", () => {
		// Not `wire-use-hotkeys` — one prefix has to serve `useHotkeys` and
		// `createHotkeys`, or the same snippet needs two names.
		expect(hookSnippetPrefix("hotkeys")).toBe("wire-hotkeys");
		expect(hookSnippetPrefix("debounce")).toBe("wire-debounce");
		expect(hookSnippetPrefix("controllable-state")).toBe(
			"wire-controllable-state",
		);
	});

	it("keeps scaffolds clear of the components they compose", () => {
		expect(scaffoldSnippetPrefix("chat")).toBe("wire-ai-chat");
		expect(scaffoldSnippetPrefix("markdown")).toBe("wire-ai-markdown");
		expect(scaffoldSnippetPrefix("stream")).toBe("wire-ai-stream");
	});

	it("gives every snippet in a framework a unique prefix", () => {
		for (const framework of FRAMEWORKS) {
			const prefixes = [
				...buildComponentSnippets(framework),
				...buildHookSnippets(framework),
				...buildScaffoldSnippets(framework),
			].map((snippet) => snippet.prefix);
			expect(new Set(prefixes).size, framework).toBe(prefixes.length);
		}
	});
});

/** Assertions every snippet has to satisfy, whatever it scaffolds. */
function expectWellFormed(snippet: WireSnippet, framework: Framework) {
	expect(snippet.framework).toBe(framework);
	expect(snippet.description.trim(), snippet.prefix).not.toBe("");
	expect(snippet.title.trim(), snippet.prefix).not.toBe("");
	expect(snippet.body, snippet.prefix).toContain("$0");
	expect(snippet.body.trim(), snippet.prefix).not.toBe("$0");

	// Strip escaped characters and well-formed tab stops; nothing the grammar
	// reserves may remain.
	const rest = snippet.body
		.replace(/\\[\\$}]/g, "")
		.replace(/\$\{\d+:[^}]*\}/g, "")
		.replace(/\$0/g, "");
	expect(rest, `${snippet.prefix}: ${snippet.body}`).not.toMatch(/[$}]/);
}

// The Day 12 ship criterion: snippet coverage for 100% of components.
describe.each(FRAMEWORKS)("%s component snippets", (framework: Framework) => {
	const snippets = buildComponentSnippets(framework);
	const components = getAllComponentMetadata().filter((component) =>
		component.frameworks.includes(framework),
	);

	it("covers every component the catalog ships", () => {
		expect(components.length).toBeGreaterThan(0);
		expect(snippets.map((s) => s.name).sort()).toEqual(
			components.map((c) => c.name).sort(),
		);
	});

	it("produces a usable body for every component", () => {
		for (const snippet of snippets) {
			expectWellFormed(snippet, framework);
			// The component's own tag has to appear, or the snippet scaffolds
			// something other than what its prefix promises.
			expect(snippet.body, snippet.name).toContain(`<${snippet.name}`);
		}
	});

	it("points every snippet at its framework package and docs", () => {
		for (const snippet of snippets) {
			expect(snippet.kind).toBe("component");
			expect(snippet.imports!.names).toEqual([snippet.name]);
			expect(snippet.imports!.moduleId).toBe(`@wire-ui/${framework}`);
			expect(snippet.imports!.statement).toContain(
				`@wire-ui/${framework}`,
			);
			expect(snippet.docsUrl).toMatch(
				/^https:\/\/wire-ui\.com\/docs\/components\//,
			);
		}
	});
});

// The Day 13 exit criterion: snippet coverage for 100% of hooks.
describe.each(FRAMEWORKS)("%s hook snippets", (framework: Framework) => {
	const snippets = buildHookSnippets(framework);
	const hooks = getAllHookMetadata().filter((hook) =>
		hook.frameworks.includes(framework),
	);

	it("covers every hook the catalog ships", () => {
		expect(hooks.length).toBeGreaterThan(0);
		expect(snippets.map((s) => s.name).sort()).toEqual(
			hooks.map((h) => h.canonicalName).sort(),
		);
	});

	it("produces a usable body for every hook", () => {
		for (const snippet of snippets) {
			expectWellFormed(snippet, framework);
			// The hook's own export name has to appear, or the snippet scaffolds
			// something other than what its prefix promises.
			expect(snippet.body, snippet.name).toContain(snippet.title);
		}
	});

	it("titles each hook with the framework's export name", () => {
		for (const snippet of snippets) {
			expect(snippet.kind).toBe("hook");
			const expected = framework === "solid" ? /^create/ : /^use/;
			expect(snippet.title, snippet.name).toMatch(expected);
			expect(snippet.imports!.names, snippet.name).toContain(
				snippet.title,
			);
			expect(snippet.imports!.moduleId).toBe(`@wire-ui/${framework}`);
		}
	});

	// A hook snippet lands inside an existing function, so a demonstration
	// `return` from the catalog example must not come along as live code.
	it("inserts statements, never a stray return", () => {
		for (const snippet of snippets)
			expect(snippet.body, snippet.name).not.toMatch(/^return /m);
	});
});

// The Day 13 exit criterion for the AI primitives: ready-to-style scaffolds.
describe.each(FRAMEWORKS)("%s scaffold snippets", (framework: Framework) => {
	const snippets = buildScaffoldSnippets(framework);

	it("covers every scaffold the catalog ships", () => {
		expect(snippets.length).toBeGreaterThan(0);
		expect(snippets.map((s) => s.name)).toEqual(
			getAllScaffoldMetadata().map((s) => s.name),
		);
	});

	it("inserts a whole file that brings its own imports", () => {
		for (const snippet of snippets) {
			expectWellFormed(snippet, framework);
			expect(snippet.kind).toBe("scaffold");
			// No import edit to plan — an added import would duplicate one the
			// body already has.
			expect(snippet.imports, snippet.name).toBeUndefined();
			expect(snippet.body, snippet.name).toContain(
				`@wire-ui/${framework}`,
			);
			// Whole files are read as code, so they carry no tab stops.
			expect(snippet.body, snippet.name).not.toMatch(/\$\{\d+:/);
		}
	});

	it("covers the AI primitives the roadmap names", () => {
		expect(snippets.map((s) => s.prefix)).toEqual(
			expect.arrayContaining([
				"wire-ai-chat",
				"wire-ai-stream",
				"wire-ai-markdown",
			]),
		);
	});
});

describe("framework flavours", () => {
	it("uses each framework's own authoring syntax", () => {
		const body = (framework: Framework, component: string) =>
			buildComponentSnippets(framework).find((s) => s.name === component)!
				.body;

		// Solid calls its signals; React reads them directly.
		expect(body("react", "Input")).toContain("value={value\\}");
		expect(body("solid", "Input")).toContain("value={value()\\}");
		// Vue binds attributes and never carries the SFC template wrapper.
		expect(body("vue", "Input")).toContain(':value="');
		expect(body("vue", "Input")).not.toContain("<template>");
	});

	it("uses each framework's own hook naming", () => {
		const body = (framework: Framework, hook: string) =>
			buildHookSnippets(framework).find((s) => s.name === hook)!.body;

		expect(body("react", "hotkeys")).toContain("useHotkeys(");
		expect(body("vue", "hotkeys")).toContain("useHotkeys(");
		expect(body("solid", "hotkeys")).toContain("createHotkeys(");
	});

	// Scaffolds are the only snippet whose Vue form is a whole SFC rather than a
	// fragment, since they land at the top level of an empty file.
	it("ships the Vue scaffolds as single-file components", () => {
		for (const snippet of buildScaffoldSnippets("vue"))
			expect(snippet.body, snippet.name).toContain("<script setup");
		for (const snippet of buildScaffoldSnippets("react"))
			expect(snippet.body, snippet.name).not.toContain("<script setup");
	});

	it("names the module each framework imports from", () => {
		expect(moduleIdFor("react")).toBe("@wire-ui/react");
		expect(moduleIdFor("vue")).toBe("@wire-ui/vue");
		expect(moduleIdFor("solid")).toBe("@wire-ui/solid");
	});
});

describe("caching", () => {
	it("builds each set once, per kind and framework", () => {
		expect(getComponentSnippets("react")).toBe(
			getComponentSnippets("react"),
		);
		expect(getHookSnippets("react")).toBe(getHookSnippets("react"));
		expect(getScaffoldSnippets("react")).toBe(getScaffoldSnippets("react"));

		expect(getComponentSnippets("react")).not.toBe(
			getComponentSnippets("vue"),
		);
		expect(getComponentSnippets("react")).not.toBe(
			getHookSnippets("react"),
		);
	});
});
