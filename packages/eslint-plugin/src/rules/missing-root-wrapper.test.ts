import tsParser from "@typescript-eslint/parser";
import { RuleTester } from "eslint";
import { describe } from "vitest";
import rule from "./missing-root-wrapper.js";

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

describe("missing-root-wrapper", () => {
	ruleTester.run("missing-root-wrapper", rule as unknown as EslintRule, {
		valid: [
			// Part nested inside its root — reaches the shared context.
			{
				filename: "ok.tsx",
				code: `
					import { Input } from '@wire-ui/react'
					const El = () => <Input.Root><Input.Field /></Input.Root>
				`,
			},
			// Nested through intermediate markup still counts as wrapped.
			{
				filename: "nested.tsx",
				code: `
					import { Input } from '@wire-ui/react'
					const El = () => <Input.Root><div><Input.Field /></div></Input.Root>
				`,
			},
			// A root IS present but the part is outside it — that's the sibling
			// rule's job (compound-part-outside-root), not this one.
			{
				filename: "outside.tsx",
				code: `
					import { Input } from '@wire-ui/react'
					const El = () => <><Input.Root><Input.Field /></Input.Root><Input.Error /></>
				`,
			},
			// Same-named tag not imported from Wire UI — never flagged.
			{
				filename: "foreign.tsx",
				code: `
					import { Input } from 'some-other-ui'
					const El = () => <Input.Field />
				`,
			},
		],
		invalid: [
			// Part with no root wrapper anywhere in the file.
			{
				filename: "bad.tsx",
				code: `
					import { Input } from '@wire-ui/react'
					const El = () => <Input.Field />
				`,
				errors: [{ messageId: "missingRootWrapper" }],
			},
			// Alias-aware: the local name is aliased, the metadata still resolves.
			{
				filename: "aliased.tsx",
				code: `
					import { Input as TextField } from '@wire-ui/react'
					const El = () => <TextField.Field />
				`,
				errors: [
					{
						messageId: "missingRootWrapper",
						data: { tag: "TextField", part: "Field", component: "Input" },
					},
				],
			},
		],
	});
});
