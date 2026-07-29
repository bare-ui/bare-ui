import {
	findAttribute,
	hasSpreadAttribute,
	partDeclaresProp,
	tagText,
} from "./helpers.js";
import { WIRE_RULES, type Rule } from "./types.js";

/**
 * Props that are inert on their own. Wire UI validates nothing internally: the
 * consumer sets `invalidType` from their own logic, and the component looks the
 * key up in `errorMessage` to decide what the `Error` part renders. Setting the
 * first without the second produces an invalid field with a blank message.
 *
 * The relation lives here — it's rule knowledge, not component data — but every
 * report is gated on the catalog actually declaring *both* props on the part
 * being written, so the pair only fires where it is real.
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

/** `required-pair-props` — a prop whose partner the component needs is absent. */
export const requiredPairPropsRule: Rule = (context) => {
	const { tsLib } = context;

	for (const usage of context.elements) {
		// A spread can carry the partner prop; we can't see through it.
		if (hasSpreadAttribute(tsLib, usage.element)) continue;

		for (const pair of PROP_PAIRS) {
			const { component, effectivePart } = usage;
			if (
				!partDeclaresProp(component, effectivePart, pair.trigger) ||
				!partDeclaresProp(component, effectivePart, pair.requires)
			) {
				continue;
			}

			const trigger = findAttribute(tsLib, usage.element, pair.trigger);
			if (!trigger) continue;
			if (findAttribute(tsLib, usage.element, pair.requires)) continue;

			context.report(
				WIRE_RULES.requiredPairProps,
				trigger,
				`<${tagText(usage)}> sets ${pair.trigger} without ${pair.requires}, so ${pair.why}. Add ${pair.requires} with a key matching each ${pair.trigger}.`,
			);
		}
	}
};
