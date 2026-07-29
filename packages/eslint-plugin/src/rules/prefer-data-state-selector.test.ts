import tsParser from "@typescript-eslint/parser";
import { RuleTester } from "eslint";
import { describe } from "vitest";
import rule from "./prefer-data-state-selector.js";

// eslint's RuleTester and typescript-eslint's RuleModule are structurally
// compatible at runtime; the cast just bridges their nominal types.
type EslintRule = Parameters<RuleTester["run"]>[1];

const ruleTester = new RuleTester({
	languageOptions: {
		parser: tsParser,
		ecmaVersion: 2022,
		sourceType: "module",
		parserOptions: { ecmaFeatures: { jsx: true } },
	},
});

const IMPORT = "import { Accordion } from '@wire-ui/react'\n";

describe("prefer-data-state-selector", () => {
	ruleTester.run(
		"prefer-data-state-selector",
		rule as unknown as EslintRule,
		{
			valid: [
				// Already using the data-* contract.
				{
					filename: "ok.ts",
					code: `${IMPORT}const css = '[data-state="open"] { color: red }'`,
				},
				// An aria state with no data-state equivalent: checked lives on the
				// presence attribute data-checked.
				{
					filename: "checked.ts",
					code: `${IMPORT}const css = '[aria-checked="true"] {}'`,
				},
				// Not a state selector at all.
				{
					filename: "label.ts",
					code: `${IMPORT}const css = '[aria-label="Close"] {}'`,
				},
				// No Wire UI import — the selector belongs to something else.
				{
					filename: "unrelated.ts",
					code: `const css = '[aria-expanded="true"] {}'`,
				},
			],
			invalid: [
				{
					filename: "expanded.ts",
					code: `${IMPORT}const css = '[aria-expanded="true"] { color: red }'`,
					output: `${IMPORT}const css = '[data-state="open"] { color: red }'`,
					errors: [
						{
							messageId: "preferDataStateSelector",
							data: {
								selector: '[aria-expanded="true"]',
								value: "open",
							},
						},
					],
				},
				// The false case, and the fix reuses the selector's own quote style
				// so it can't break the string it sits in.
				{
					filename: "collapsed.ts",
					code: `${IMPORT}const css = "[aria-expanded='false'] {}"`,
					output: `${IMPORT}const css = "[data-state='closed'] {}"`,
					errors: [{ messageId: "preferDataStateSelector" }],
				},
				// Template literals, including the spans around an interpolation.
				{
					filename: "template.ts",
					code:
						IMPORT +
						'const css = `[aria-pressed="true"] { ${rule} } [aria-selected="true"] {}`',
					output:
						IMPORT +
						'const css = `[data-state="on"] { ${rule} } [data-state="active"] {}`',
					errors: [
						{ messageId: "preferDataStateSelector" },
						{ messageId: "preferDataStateSelector" },
					],
				},
				// A querySelector argument is a selector too.
				{
					filename: "query.ts",
					code: `${IMPORT}const el = root.querySelector('[aria-expanded=true]')`,
					output: `${IMPORT}const el = root.querySelector('[data-state=open]')`,
					errors: [{ messageId: "preferDataStateSelector" }],
				},
			],
		},
	);
});
