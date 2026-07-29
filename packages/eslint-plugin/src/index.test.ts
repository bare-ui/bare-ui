import { describe, expect, it } from "vitest";
import plugin from "./index.js";

/** The five rules the roadmap scopes for this plugin, in registration order. */
const RULE_NAMES = [
	"compound-part-outside-root",
	"misplaced-classname",
	"missing-root-wrapper",
	"prefer-data-state-selector",
	"required-pair-props",
];

describe("@wire-ui/eslint-plugin", () => {
	it("exposes every ported rule", () => {
		expect(Object.keys(plugin.rules).sort()).toEqual(RULE_NAMES);
	});

	it("gives each rule docs and a schema", () => {
		for (const rule of Object.values(plugin.rules)) {
			expect(rule.meta?.docs?.description).toBeTruthy();
			expect(rule.meta?.schema).toEqual([]);
		}
	});

	it("marks only the rewritable rule fixable", () => {
		const fixable = Object.entries(plugin.rules)
			.filter(([, rule]) => rule.meta?.fixable)
			.map(([name]) => name);
		expect(fixable).toEqual(["prefer-data-state-selector"]);
	});

	it("ships a flat `recommended` config with every rule turned on", () => {
		const recommended = plugin.configs.recommended as {
			plugins: Record<string, unknown>;
			rules: Record<string, string>;
		};
		expect(recommended.plugins["wire-ui"]).toBe(plugin);
		// Runtime failures are errors; "works but styles nothing" is a warning.
		expect(recommended.rules).toEqual({
			"wire-ui/compound-part-outside-root": "error",
			"wire-ui/misplaced-classname": "warn",
			"wire-ui/missing-root-wrapper": "error",
			"wire-ui/prefer-data-state-selector": "warn",
			"wire-ui/required-pair-props": "error",
		});
	});

	it("ships a legacy eslintrc config for `plugin:wire-ui/recommended-legacy`", () => {
		const legacy = plugin.configs["recommended-legacy"] as {
			plugins: string[];
			rules: Record<string, string>;
		};
		expect(legacy.plugins).toEqual(["wire-ui"]);
		expect(legacy.rules["wire-ui/missing-root-wrapper"]).toBe("error");
		expect(legacy.rules["wire-ui/required-pair-props"]).toBe("error");
	});
});
