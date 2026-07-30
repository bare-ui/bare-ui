import { describe, expect, it } from "vitest";
import { components, hooks, scaffolds } from "@wire-ui/mcp/data";
import type { Framework } from "@wire-ui/mcp/data";
import {
	FRAMEWORKS,
	getAllComponentMetadata,
	getAllHookMetadata,
	getAllScaffoldMetadata,
	getComponentMetadata,
	getHookMetadata,
	getScaffoldMetadata,
	isWireComponent,
	isWireHook,
	listComponentNames,
	listHookNames,
	toComponentSlug,
} from "./index.js";

describe("metadata coverage", () => {
	it("exposes metadata for every component in the MCP catalog", () => {
		expect(components.length).toBeGreaterThan(0);
		expect(listComponentNames()).toHaveLength(components.length);

		for (const component of components) {
			const meta = getComponentMetadata(component.name);
			expect(
				meta,
				`missing metadata for ${component.name}`,
			).toBeDefined();
		}
	});

	// Every component is authored for one or more frameworks. Each
	// (component, framework) pair the catalog claims must be reachable through
	// the metadata layer, so the editor tooling never goes blind on a framework
	// the catalog actually ships.
	it.each(FRAMEWORKS)("covers every %s component", (framework: Framework) => {
		const inFramework = components.filter((c) => c.frameworks[framework]);
		expect(inFramework.length).toBeGreaterThan(0);

		for (const component of inFramework) {
			const meta = getComponentMetadata(component.name);
			expect(
				meta,
				`missing metadata for ${component.name}`,
			).toBeDefined();
			expect(
				meta!.frameworks,
				`${component.name} should list ${framework}`,
			).toContain(framework);
		}
	});

	it("looks components up case-insensitively", () => {
		expect(getComponentMetadata("accordion")?.name).toBe("Accordion");
		expect(getComponentMetadata("ACCORDION")?.name).toBe("Accordion");
		expect(isWireComponent("button")).toBe(true);
		expect(isWireComponent("NotAComponent")).toBe(false);
		expect(getComponentMetadata("NotAComponent")).toBeUndefined();
	});

	it("returns a stable cached reference", () => {
		expect(getComponentMetadata("Accordion")).toBe(
			getComponentMetadata("Accordion"),
		);
	});
});

describe("metadata shape", () => {
	it("parses data-attribute value unions into arrays", () => {
		const all = getAllComponentMetadata();
		const withState = all.filter((c) =>
			c.dataAttributes.some((a) => a.name === "data-state"),
		);
		expect(withState.length).toBeGreaterThan(0);

		for (const meta of withState) {
			const attr = meta.dataAttributes.find(
				(a) => a.name === "data-state",
			)!;
			// data-state always carries a value enum; presence flags do not.
			expect(attr.values.length).toBeGreaterThan(0);
			expect(meta.dataStateValues).toEqual(attr.values);
		}
	});

	it("derives a kebab-case docs URL", () => {
		expect(getComponentMetadata("Accordion")?.docsUrl).toBe(
			"https://wire-ui.com/docs/components/accordion",
		);
		expect(getComponentMetadata("NumberInput")?.docsUrl).toBe(
			"https://wire-ui.com/docs/components/number-input",
		);
		expect(getComponentMetadata("OTP")?.docsUrl).toBe(
			"https://wire-ui.com/docs/components/otp",
		);
		expect(getComponentMetadata("MenuBar")?.docsUrl).toBe(
			"https://wire-ui.com/docs/components/menu-bar",
		);
	});

	it("exposes the slug helper the docs URL is built from", () => {
		expect(toComponentSlug("Accordion")).toBe("accordion");
		expect(toComponentSlug("NumberInput")).toBe("number-input");
		expect(toComponentSlug("MenuBar")).toBe("menu-bar");
		expect(toComponentSlug("OTP")).toBe("otp");
		expect(toComponentSlug("ResizablePanels")).toBe("resizable-panels");
	});

	// Snippet generation reads `examples`; a framework the catalog claims but
	// leaves without a usable example would silently drop that component from
	// the editor's snippet set.
	it("carries an import statement and example for every claimed framework", () => {
		for (const meta of getAllComponentMetadata()) {
			expect(
				meta.frameworks.length,
				`${meta.name} ships in no framework`,
			).toBeGreaterThan(0);

			for (const framework of meta.frameworks) {
				const example = meta.examples[framework];
				expect(
					example,
					`${meta.name} is missing its ${framework} example`,
				).toBeDefined();
				expect(example!.importStatement.trim()).not.toBe("");
				expect(example!.basicExample.trim()).not.toBe("");
			}
		}
	});
});

describe("hook metadata", () => {
	it("exposes metadata for every hook in the MCP catalog", () => {
		expect(hooks.length).toBeGreaterThan(0);
		expect(listHookNames()).toEqual(hooks.map((h) => h.canonicalName));
		expect(getAllHookMetadata()).toHaveLength(hooks.length);

		for (const hook of hooks) {
			const meta = getHookMetadata(hook.canonicalName);
			expect(
				meta,
				`missing metadata for ${hook.canonicalName}`,
			).toBeDefined();
			expect(meta!.frameworks.length).toBeGreaterThan(0);
		}
	});

	// A hook the catalog claims for a framework but leaves without an example
	// would silently drop out of the editor's snippet set.
	it.each(FRAMEWORKS)("covers every %s hook", (framework: Framework) => {
		const inFramework = hooks.filter((h) => h.frameworks[framework]);
		expect(inFramework.length).toBeGreaterThan(0);

		for (const hook of inFramework) {
			const meta = getHookMetadata(hook.canonicalName)!;
			expect(
				meta.frameworks,
				`${hook.canonicalName} should list ${framework}`,
			).toContain(framework);

			const example = meta.examples[framework]!;
			expect(example.name.trim()).not.toBe("");
			expect(example.importStatement.trim()).not.toBe("");
			expect(example.basicExample.trim()).not.toBe("");
			expect(example.importedNames).toContain(example.name);
		}
	});

	it("resolves a hook by canonical name or any framework's export name", () => {
		const canonical = getHookMetadata("hotkeys");
		expect(canonical?.canonicalName).toBe("hotkeys");
		expect(getHookMetadata("useHotkeys")).toBe(canonical);
		expect(getHookMetadata("createHotkeys")).toBe(canonical);
		expect(getHookMetadata("CREATEHOTKEYS")).toBe(canonical);

		expect(isWireHook("useDebounce")).toBe(true);
		expect(isWireHook("click-outside")).toBe(true);
		expect(isWireHook("useNotAHook")).toBe(false);
		expect(getHookMetadata("useNotAHook")).toBeUndefined();
	});

	it("splits out every name an import statement binds", () => {
		// useDirection ships two synchronous helpers alongside the reactive hook.
		expect(
			getHookMetadata("direction")?.examples.react?.importedNames,
		).toEqual(["useDirection", "getDirection", "isRtl"]);
		expect(
			getHookMetadata("disclosure")?.examples.react?.importedNames,
		).toEqual(["useDisclosure"]);
	});

	it("derives a docs URL, and none for the hooks without a page", () => {
		expect(getHookMetadata("hotkeys")?.docsUrl).toBe(
			"https://wire-ui.com/docs/hooks/use-hotkeys",
		);
		// Documented on a sibling's page rather than one of its own.
		expect(getHookMetadata("debounced-callback")?.docsUrl).toBe(
			"https://wire-ui.com/docs/hooks/use-debounce",
		);
		expect(getHookMetadata("session-storage")?.docsUrl).toBe(
			"https://wire-ui.com/docs/hooks/use-local-storage",
		);
		// No page yet — better no link than a 404.
		expect(getHookMetadata("direction")?.docsUrl).toBeUndefined();
		expect(getHookMetadata("is-mounted")?.docsUrl).toBeUndefined();
	});

	it("shares hook and component name spaces without collision", () => {
		// Editor prefixes are built from these, so a clash would shadow a snippet.
		const componentSlugs = new Set(
			listComponentNames().map((name) => toComponentSlug(name)),
		);
		const clashes = listHookNames().filter((name) =>
			componentSlugs.has(name),
		);
		expect(clashes).toEqual([]);
	});
});

describe("scaffold metadata", () => {
	it("exposes every scaffold in the MCP catalog", () => {
		expect(scaffolds.length).toBeGreaterThan(0);
		expect(getAllScaffoldMetadata()).toHaveLength(scaffolds.length);
		expect(getScaffoldMetadata("CHAT")?.name).toBe("chat");
		expect(getScaffoldMetadata("not-a-scaffold")).toBeUndefined();
	});

	// Scaffolds are inserted verbatim, so each must be a whole file: it brings its
	// own imports, and never leans on an import edit the way a component does.
	it.each(FRAMEWORKS)(
		"carries a complete %s file",
		(framework: Framework) => {
			for (const meta of getAllScaffoldMetadata()) {
				expect(
					meta.frameworks,
					`${meta.name} should ship in ${framework}`,
				).toContain(framework);

				const source = meta.sources[framework]!;
				expect(source).toContain(`@wire-ui/${framework}`);
				expect(source).toMatch(/^import |^<script/);
				for (const component of meta.components)
					expect(
						source,
						`${meta.name} never uses ${component}`,
					).toContain(component);
			}
		},
	);

	it("names components and hooks the catalog actually has", () => {
		for (const meta of getAllScaffoldMetadata()) {
			for (const component of meta.components)
				expect(isWireComponent(component), component).toBe(true);
			for (const hook of meta.hooks)
				expect(isWireHook(hook), hook).toBe(true);
		}
	});
});

// The Day 1 exit criterion, asserted directly.
describe('exit criterion: getComponentMetadata("Accordion")', () => {
	it("returns parts and data-state from MCP", () => {
		const meta = getComponentMetadata("Accordion");
		expect(meta).toBeDefined();
		expect(meta!.parts).toEqual(["Root", "Item", "Trigger", "Content"]);
		expect(meta!.dataStateValues).toEqual(["open", "closed"]);

		const dataState = meta!.dataAttributes.find(
			(a) => a.name === "data-state",
		);
		expect(dataState).toBeDefined();
		expect(dataState!.appliesTo).toBe("Item, Trigger, Content");
	});
});
