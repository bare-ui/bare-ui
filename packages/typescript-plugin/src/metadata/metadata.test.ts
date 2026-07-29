import { describe, expect, it } from "vitest";
import { components } from "@wire-ui/mcp/data";
import type { Framework } from "@wire-ui/mcp/data";
import {
	FRAMEWORKS,
	getAllComponentMetadata,
	getComponentMetadata,
	isWireComponent,
	listComponentNames,
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
