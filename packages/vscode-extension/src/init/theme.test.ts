import { getAllComponentMetadata } from "@wire-ui/typescript-plugin/metadata";
import { describe, expect, it } from "vitest";
import {
	starterThemeCss,
	themeImportHint,
	THEMED_ATTRIBUTES,
	THEMED_STATE_VALUES,
} from "./theme.js";

/** Every `data-*` attribute name the catalog exposes, across all components. */
function catalogAttributes(): Set<string> {
	const names = new Set<string>();
	for (const component of getAllComponentMetadata())
		for (const attribute of component.dataAttributes)
			names.add(attribute.name);
	return names;
}

/** Every value the catalog gives `data-state`. */
function catalogStateValues(): Set<string> {
	const values = new Set<string>();
	for (const component of getAllComponentMetadata())
		for (const attribute of component.dataAttributes)
			if (attribute.name === "data-state")
				for (const value of attribute.values) values.add(value);
	return values;
}

// The stylesheet is hand-designed — a generated one would produce nonsense for
// exotic attributes — but it may not invent selectors. These tie it to the
// catalog, so an upstream rename fails here instead of shipping dead CSS.
describe("catalog truth", () => {
	it("targets only data-* attributes the catalog exposes", () => {
		const known = catalogAttributes();
		const invented = THEMED_ATTRIBUTES.filter(
			(attribute) => !known.has(attribute),
		);
		expect(invented).toEqual([]);
	});

	it("writes data-state rules only for values the catalog uses", () => {
		const known = catalogStateValues();
		const invented = THEMED_STATE_VALUES.filter(
			(value) => !known.has(value),
		);
		expect(invented).toEqual([]);
	});

	it("declares every attribute the stylesheet actually selects on", () => {
		const css = starterThemeCss();
		const selected = new Set(
			[...css.matchAll(/\[(data-[a-z-]+)/g)].map((match) => match[1]),
		);
		expect([...selected].sort()).toEqual([...THEMED_ATTRIBUTES].sort());
	});
});

describe("starterThemeCss", () => {
	const css = starterThemeCss();

	it("styles the states a new user meets first", () => {
		expect(css).toContain("[data-hover]");
		expect(css).toContain("[data-focus-visible]");
		expect(css).toContain("[data-disabled]");
		expect(css).toContain('[data-state="open"]');
	});

	it("defines the custom properties its rules consume", () => {
		const used = new Set(
			[...css.matchAll(/var\((--[a-z-]+)\)/g)].map((match) => match[1]),
		);
		const declared = new Set(
			[...css.matchAll(/^\t(--[a-z-]+):/gm)].map((match) => match[1]),
		);
		for (const property of used) expect(declared).toContain(property);
	});

	it("balances its braces", () => {
		const open = (css.match(/\{/g) ?? []).length;
		const close = (css.match(/\}/g) ?? []).length;
		expect(open).toBe(close);
		expect(open).toBeGreaterThan(0);
	});

	it("points at the docs and ends with a newline", () => {
		expect(css).toContain("https://wire-ui.com/docs/data-attributes");
		expect(css.endsWith("\n")).toBe(true);
	});
});

describe("themeImportHint", () => {
	it("names the file and the framework's entry point", () => {
		expect(themeImportHint("react", "src/wire-ui.css")).toContain(
			'import "./wire-ui.css";',
		);
		expect(themeImportHint("react", "src/wire-ui.css")).toContain(
			"main.tsx",
		);
		expect(themeImportHint("vue", "wire-ui.css")).toContain("main.ts");
		expect(themeImportHint("solid", "src/wire-ui.css")).toContain(
			"index.tsx",
		);
	});
});
