import { describe, expect, it } from "vitest";
import plugin from "./index.js";

describe("@wire-ui/eslint-plugin", () => {
	it("exposes both ported rules", () => {
		expect(Object.keys(plugin.rules).sort()).toEqual([
			"compound-part-outside-root",
			"missing-root-wrapper",
		]);
	});

	it("ships a flat `recommended` config enabling both rules as errors", () => {
		const recommended = plugin.configs.recommended as {
			plugins: Record<string, unknown>;
			rules: Record<string, string>;
		};
		expect(recommended.plugins["wire-ui"]).toBe(plugin);
		expect(recommended.rules).toEqual({
			"wire-ui/compound-part-outside-root": "error",
			"wire-ui/missing-root-wrapper": "error",
		});
	});

	it("ships a legacy eslintrc config for `plugin:wire-ui/recommended-legacy`", () => {
		const legacy = plugin.configs["recommended-legacy"] as {
			plugins: string[];
			rules: Record<string, string>;
		};
		expect(legacy.plugins).toEqual(["wire-ui"]);
		expect(legacy.rules["wire-ui/missing-root-wrapper"]).toBe("error");
	});
});
