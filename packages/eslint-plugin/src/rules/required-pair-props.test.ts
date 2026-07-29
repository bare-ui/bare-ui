import tsParser from "@typescript-eslint/parser";
import { RuleTester } from "eslint";
import { describe } from "vitest";
import rule from "./required-pair-props.js";

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

describe("required-pair-props", () => {
	ruleTester.run("required-pair-props", rule as unknown as EslintRule, {
		valid: [
			// The pair written together.
			{
				filename: "ok.tsx",
				code: `
					import { Input } from '@wire-ui/react'
					const El = () => <Input.Root invalidType={error} errorMessage={messages}><Input.Field /></Input.Root>
				`,
			},
			// Neither prop set at all.
			{
				filename: "plain.tsx",
				code: `
					import { Input } from '@wire-ui/react'
					const El = () => <Input.Root><Input.Field /></Input.Root>
				`,
			},
			// A spread could carry errorMessage; we can't see through it.
			{
				filename: "spread.tsx",
				code: `
					import { Input } from '@wire-ui/react'
					const El = () => <Input.Root invalidType={error} {...rest}><Input.Field /></Input.Root>
				`,
			},
			// The catalog gives Accordion.Item neither prop, so it isn't our pair.
			{
				filename: "elsewhere.tsx",
				code: `
					import { Accordion } from '@wire-ui/react'
					const El = () => <Accordion><Accordion.Item invalidType={e} /></Accordion>
				`,
			},
			// Same-named tag not imported from Wire UI — never flagged.
			{
				filename: "foreign.tsx",
				code: `
					import { Input } from 'some-other-ui'
					const El = () => <Input.Root invalidType={e} />
				`,
			},
		],
		invalid: [
			{
				filename: "bad.tsx",
				code: `
					import { Input } from '@wire-ui/react'
					const El = () => <Input.Root invalidType={error}><Input.Field /></Input.Root>
				`,
				errors: [
					{
						messageId: "requiredPairProps",
						data: {
							tag: "Input.Root",
							trigger: "invalidType",
							requires: "errorMessage",
							why: "the error state has no message to render",
						},
					},
				],
			},
			// Alias-aware, and it fires on Textarea/Password the same way.
			{
				filename: "aliased.tsx",
				code: `
					import { Textarea as Notes } from '@wire-ui/solid'
					const El = () => <Notes.Root invalidType={error} />
				`,
				errors: [{ messageId: "requiredPairProps" }],
			},
		],
	});
});
