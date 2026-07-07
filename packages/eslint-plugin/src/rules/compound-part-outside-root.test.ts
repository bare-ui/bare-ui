import tsParser from "@typescript-eslint/parser";
import { RuleTester } from "eslint";
import { describe } from "vitest";
import rule from "./compound-part-outside-root.js";

type EslintRule = Parameters<RuleTester["run"]>[1];

const ruleTester = new RuleTester({
	languageOptions: {
		parser: tsParser,
		ecmaVersion: 2022,
		sourceType: "module",
		parserOptions: { ecmaFeatures: { jsx: true } },
	},
});

describe("compound-part-outside-root", () => {
	ruleTester.run(
		"compound-part-outside-root",
		rule as unknown as EslintRule,
		{
			valid: [
				// Part nested inside its root.
				{
					filename: "ok.tsx",
					code: `
						import { Input } from '@wire-ui/react'
						const El = () => <Input.Root><Input.Field /></Input.Root>
					`,
				},
				// No root anywhere — that's missing-root-wrapper's job, not this one.
				{
					filename: "missing.tsx",
					code: `
						import { Input } from '@wire-ui/react'
						const El = () => <Input.Field />
					`,
				},
				// Two independent, correctly-wrapped compounds.
				{
					filename: "two.tsx",
					code: `
						import { Input, Switch } from '@wire-ui/react'
						const El = () => <><Input.Root><Input.Field /></Input.Root><Switch.Root><Switch.Thumb /></Switch.Root></>
					`,
				},
			],
			invalid: [
				// A root exists in the file, but this part renders outside it.
				{
					filename: "escaped.tsx",
					code: `
						import { Input } from '@wire-ui/react'
						const El = () => <><Input.Root><Input.Field /></Input.Root><Input.Error /></>
					`,
					errors: [
						{
							messageId: "compoundPartOutsideRoot",
							data: { tag: "Input", part: "Error", component: "Input" },
						},
					],
				},
			],
		},
	);
});
