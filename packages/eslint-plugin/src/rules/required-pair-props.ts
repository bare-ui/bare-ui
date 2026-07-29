import {
	createRule,
	findAttribute,
	hasSpreadAttribute,
	partDeclaresProp,
	resolveElement,
	tagText,
	wireImportBindings,
} from "../util.js";

/**
 * Props that are inert on their own. Wire UI validates nothing internally: the
 * consumer sets `invalidType` from their own logic, and the component looks the
 * key up in `errorMessage` to decide what the `Error` part renders. Setting the
 * first without the second produces an invalid field with a blank message.
 *
 * The relation lives here — it's rule knowledge, not component data — but every
 * report is gated on the catalog declaring *both* props on the part being
 * written, so the pair only fires where it is real. Mirrors the TypeScript
 * plugin's rule of the same name.
 */
const PROP_PAIRS: readonly {
	trigger: string;
	requires: string;
	why: string;
}[] = [
	{
		trigger: "invalidType",
		requires: "errorMessage",
		why: "the error state has no message to render",
	},
];

/**
 * Flags a Wire UI prop whose partner prop the component needs to do anything
 * useful — `invalidType` without `errorMessage`. Not auto-fixable: only the
 * author knows what the message should say.
 */
export default createRule({
	name: "required-pair-props",
	meta: {
		type: "problem",
		docs: {
			description:
				"Require the partner prop when a Wire UI prop is inert without it",
		},
		schema: [],
		messages: {
			requiredPairProps:
				"<{{tag}}> sets {{trigger}} without {{requires}}, so {{why}}. Add {{requires}} with a key matching each {{trigger}}.",
		},
	},
	defaultOptions: [],
	create(context) {
		const bindings = wireImportBindings(context.sourceCode.ast);
		if (bindings.size === 0) return {};

		return {
			JSXOpeningElement(node) {
				const resolved = resolveElement(node, bindings);
				if (!resolved) return;
				// A spread can carry the partner prop; we can't see through it.
				if (hasSpreadAttribute(node)) return;

				for (const pair of PROP_PAIRS) {
					if (
						!partDeclaresProp(resolved, pair.trigger) ||
						!partDeclaresProp(resolved, pair.requires)
					) {
						continue;
					}

					const trigger = findAttribute(node, pair.trigger);
					if (!trigger) continue;
					if (findAttribute(node, pair.requires)) continue;

					context.report({
						node: trigger,
						messageId: "requiredPairProps",
						data: {
							tag: tagText(resolved),
							trigger: pair.trigger,
							requires: pair.requires,
							why: pair.why,
						},
					});
				}
			},
		};
	},
});
