import tsParser from "@typescript-eslint/parser";
import { RuleTester } from "eslint";
import { describe } from "vitest";
import rule from "./misplaced-classname.js";

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

describe("misplaced-classname", () => {
	ruleTester.run("misplaced-classname", rule as unknown as EslintRule, {
		valid: [
			// Parts that render markup take className happily.
			{
				filename: "ok.tsx",
				code: `
					import { Modal } from '@wire-ui/react'
					const El = () => <Modal.Root><Modal.Content className="panel" /></Modal.Root>
				`,
			},
			// A context-only part with no styling attribute at all.
			{
				filename: "bare.tsx",
				code: `
					import { Modal } from '@wire-ui/react'
					const El = () => <Modal.Root><Modal.Content /></Modal.Root>
				`,
			},
			// Input has no context-only parts, so its Root is fine to style.
			{
				filename: "input.tsx",
				code: `
					import { Input } from '@wire-ui/react'
					const El = () => <Input.Root className="field"><Input.Field /></Input.Root>
				`,
			},
			// Same-named tag not imported from Wire UI — never flagged.
			{
				filename: "foreign.tsx",
				code: `
					import { Modal } from 'some-other-ui'
					const El = () => <Modal.Root className="shell" />
				`,
			},
		],
		invalid: [
			{
				filename: "bad.tsx",
				code: `
					import { Modal } from '@wire-ui/react'
					const El = () => <Modal.Root className="shell"><Modal.Content /></Modal.Root>
				`,
				errors: [
					{
						messageId: "misplacedClassName",
						data: {
							tag: "Modal.Root",
							attribute: "className",
							targets:
								"<Modal.Overlay>, <Modal.Content>, <Modal.Close>",
						},
					},
				],
			},
			// The Vue-via-JSX spelling, on a portal rather than a root.
			{
				filename: "vue-jsx.tsx",
				code: `
					import { Drawer } from '@wire-ui/vue'
					const El = () => <Drawer.Root><Drawer.Portal class="shell" /></Drawer.Root>
				`,
				errors: [{ messageId: "misplacedClassName" }],
			},
			// A bare compound tag reads as its root.
			{
				filename: "bare-root.tsx",
				code: `
					import { Modal } from '@wire-ui/react'
					const El = () => <Modal className="shell" />
				`,
				errors: [{ messageId: "misplacedClassName" }],
			},
		],
	});
});
