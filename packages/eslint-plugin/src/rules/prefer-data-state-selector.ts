import type { TSESTree } from "@typescript-eslint/utils";
import {
	createRule,
	knownDataStateValues,
	wireImportBindings,
} from "../util.js";

/**
 * ARIA states Wire UI mirrors into `data-state`. The correspondence is the ARIA
 * convention, not component data, so it lives here — but each suggestion is
 * gated on the target value existing somewhere in the catalog's `data-state`
 * vocabulary, so a mapping the libraries don't actually produce never fires.
 *
 * `aria-checked` has no entry on purpose: Checkbox, Radio, and Switch expose
 * their checked state as the presence attribute `data-checked`, not as a
 * `data-state` value, so there is nothing here to rewrite it to.
 */
const ARIA_STATE_EQUIVALENTS: Record<string, Record<string, string>> = {
	"aria-expanded": { true: "open", false: "closed" },
	"aria-pressed": { true: "on", false: "off" },
	"aria-selected": { true: "active", false: "inactive" },
};

/** `[aria-expanded="true"]`, with the quotes optional. */
const ARIA_SELECTOR =
	/\[\s*(aria-[a-z]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([A-Za-z]+))\s*\]/g;

/**
 * Flags a selector that matches Wire UI's ARIA mirror instead of its `data-*`
 * contract, and rewrites it. `aria-*` exists for assistive tech; `data-state`
 * is the styling API, and it survives a component changing which ARIA attribute
 * it uses. Reads string and template literals rather than JSX, because that is
 * where selectors live — CSS-in-JS, class-name strings, `querySelector` calls.
 *
 * Import-gated like every other rule in this plugin, so the fix only ever runs
 * in a file that pulls in Wire UI. The replacement reuses the quote style of the
 * selector it replaces, so it can never break the literal it sits in.
 */
export default createRule({
	name: "prefer-data-state-selector",
	meta: {
		type: "suggestion",
		fixable: "code",
		docs: {
			description:
				"Prefer Wire UI's data-state selector over matching the ARIA mirror",
		},
		schema: [],
		messages: {
			preferDataStateSelector:
				'{{selector}} targets the ARIA mirror. Wire UI\'s styling contract is data-*, so use [data-state="{{value}}"].',
		},
	},
	defaultOptions: [],
	create(context) {
		const bindings = wireImportBindings(context.sourceCode.ast);
		if (bindings.size === 0) return {};

		const dataStateValues = knownDataStateValues();

		/** Scan a literal's raw source text, so match offsets line up with the file. */
		function scan(node: TSESTree.Node): void {
			const raw = context.sourceCode.getText(node);

			for (const match of raw.matchAll(ARIA_SELECTOR)) {
				const attribute = match[1];
				const quote =
					match[2] !== undefined
						? '"'
						: match[3] !== undefined
							? "'"
							: "";
				const value = match[2] ?? match[3] ?? match[4];
				const replacement = ARIA_STATE_EQUIVALENTS[attribute]?.[value];
				if (!replacement || !dataStateValues.has(replacement)) continue;

				const start = node.range[0] + (match.index ?? 0);
				const range: TSESTree.Range = [start, start + match[0].length];

				context.report({
					node,
					loc: {
						start: context.sourceCode.getLocFromIndex(range[0]),
						end: context.sourceCode.getLocFromIndex(range[1]),
					},
					messageId: "preferDataStateSelector",
					data: { selector: match[0], value: replacement },
					fix: (fixer) =>
						fixer.replaceTextRange(
							range,
							`[data-state=${quote}${replacement}${quote}]`,
						),
				});
			}
		}

		return {
			Literal(node) {
				if (typeof node.value === "string") scan(node);
			},
			TemplateElement: scan,
		};
	},
});
