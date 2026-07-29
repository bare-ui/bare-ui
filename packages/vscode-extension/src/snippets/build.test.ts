import { describe, expect, it } from "vitest";
import {
	FRAMEWORKS,
	getAllComponentMetadata,
	type Framework,
} from "@wire-ui/typescript-plugin/metadata";
import {
	buildComponentSnippets,
	getComponentSnippets,
	moduleIdFor,
	snippetPrefix,
} from "./build.js";

describe("snippetPrefix", () => {
	it("kebab-cases the component behind a shared `wire-` stem", () => {
		expect(snippetPrefix("Button")).toBe("wire-button");
		expect(snippetPrefix("Modal")).toBe("wire-modal");
		expect(snippetPrefix("Combobox")).toBe("wire-combobox");
		expect(snippetPrefix("NumberInput")).toBe("wire-number-input");
	});
});

// The 0.8 ship criterion: snippet coverage for 100% of components.
describe.each(FRAMEWORKS)("%s snippet coverage", (framework: Framework) => {
	const snippets = buildComponentSnippets(framework);
	const components = getAllComponentMetadata().filter((component) =>
		component.frameworks.includes(framework),
	);

	it("covers every component the catalog ships", () => {
		expect(components.length).toBeGreaterThan(0);
		expect(snippets.map((s) => s.component).sort()).toEqual(
			components.map((c) => c.name).sort(),
		);
	});

	it("gives every snippet a unique prefix", () => {
		const prefixes = snippets.map((s) => s.prefix);
		expect(new Set(prefixes).size).toBe(prefixes.length);
	});

	it("produces a usable body for every component", () => {
		for (const snippet of snippets) {
			expect(snippet.body, snippet.component).toContain("$0");
			expect(snippet.body.trim(), snippet.component).not.toBe("$0");
			// The component's own tag has to appear, or the snippet scaffolds
			// something other than what its prefix promises.
			expect(snippet.body, snippet.component).toContain(
				`<${snippet.component}`,
			);
		}
	});

	it("leaves no unescaped snippet syntax outside a tab stop", () => {
		for (const snippet of snippets) {
			// Strip escaped characters and well-formed tab stops; nothing the
			// grammar reserves may remain.
			const rest = snippet.body
				.replace(/\\[\\$}]/g, "")
				.replace(/\$\{\d+:[^}]*\}/g, "")
				.replace(/\$0/g, "");
			expect(rest, `${snippet.component}: ${snippet.body}`).not.toMatch(
				/[$}]/,
			);
		}
	});

	it("points every snippet at its framework package and docs", () => {
		for (const snippet of snippets) {
			expect(snippet.framework).toBe(framework);
			expect(snippet.moduleId).toBe(`@wire-ui/${framework}`);
			expect(snippet.importStatement).toContain(`@wire-ui/${framework}`);
			expect(snippet.importStatement).toContain(snippet.component);
			expect(snippet.docsUrl).toMatch(
				/^https:\/\/wire-ui\.com\/docs\/components\//,
			);
			expect(snippet.description.trim()).not.toBe("");
		}
	});
});

describe("framework flavours", () => {
	it("uses each framework's own authoring syntax", () => {
		const body = (framework: Framework, component: string) =>
			buildComponentSnippets(framework).find(
				(s) => s.component === component,
			)!.body;

		// Solid calls its signals; React reads them directly.
		expect(body("react", "Input")).toContain("value={value\\}");
		expect(body("solid", "Input")).toContain("value={value()\\}");
		// Vue binds attributes and never carries the SFC template wrapper.
		expect(body("vue", "Input")).toContain(':value="');
		expect(body("vue", "Input")).not.toContain("<template>");
	});

	it("names the module each framework imports from", () => {
		expect(moduleIdFor("react")).toBe("@wire-ui/react");
		expect(moduleIdFor("vue")).toBe("@wire-ui/vue");
		expect(moduleIdFor("solid")).toBe("@wire-ui/solid");
	});
});

describe("getComponentSnippets", () => {
	it("builds each framework's set once", () => {
		expect(getComponentSnippets("react")).toBe(
			getComponentSnippets("react"),
		);
		expect(getComponentSnippets("react")).not.toBe(
			getComponentSnippets("vue"),
		);
	});
});
