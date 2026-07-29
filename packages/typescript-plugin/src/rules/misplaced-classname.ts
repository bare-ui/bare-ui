import { findAttribute, renderingParts, tagText } from "./helpers.js";
import { WIRE_RULES, type Rule } from "./types.js";

/** React/Solid spell it `className`; Vue-via-JSX spells it `class`. */
const STYLING_ATTRIBUTES = ["className", "class"];

/**
 * `misplaced-classname` — a styling attribute written on a part the catalog
 * marks context-only. Those parts are providers, portals, and render-prop
 * passthroughs: they render no element of their own, so the class name has
 * nothing to land on and disappears without a runtime error.
 */
export const misplacedClassNameRule: Rule = (context) => {
	const { tsLib } = context;

	for (const usage of context.elements) {
		const { component, effectivePart, localName } = usage;
		if (!component.contextOnlyParts.includes(effectivePart)) continue;

		for (const name of STYLING_ATTRIBUTES) {
			const attribute = findAttribute(tsLib, usage.element, name);
			if (!attribute) continue;

			const targets = renderingParts(component)
				.slice(0, 3)
				.map((part) => `<${localName}.${part}>`);
			const suggestion = targets.length
				? ` Move it to a part that renders markup: ${targets.join(", ")}.`
				: "";

			context.report(
				WIRE_RULES.misplacedClassName,
				attribute,
				`<${tagText(usage)}> renders no element, so ${name} is dropped.${suggestion}`,
			);
		}
	}
};
