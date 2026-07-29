import {
	createRule,
	findAttribute,
	renderingParts,
	resolveElement,
	tagText,
	wireImportBindings,
} from "../util.js";

/** React/Solid spell it `className`; Vue-via-JSX spells it `class`. */
const STYLING_ATTRIBUTES = ["className", "class"];

/**
 * Flags a styling attribute written on a part the catalog marks context-only.
 * Those parts are providers, portals, and render-prop passthroughs: they render
 * no element of their own, so the class name has nothing to land on and
 * disappears without a runtime error. Not auto-fixable — moving the attribute
 * means choosing which part should carry it, which is the author's call.
 */
export default createRule({
	name: "misplaced-classname",
	meta: {
		type: "problem",
		docs: {
			description:
				"Disallow styling attributes on Wire UI parts that render no element",
		},
		schema: [],
		messages: {
			misplacedClassName:
				"<{{tag}}> renders no element, so {{attribute}} is dropped. Move it to a part that renders markup: {{targets}}.",
			misplacedClassNameNoTargets:
				"<{{tag}}> renders no element, so {{attribute}} is dropped.",
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
				if (
					!resolved.component.contextOnlyParts.includes(
						resolved.effectivePart,
					)
				) {
					return;
				}

				const targets = renderingParts(resolved.component)
					.slice(0, 3)
					.map((part) => `<${resolved.localName}.${part}>`);

				for (const name of STYLING_ATTRIBUTES) {
					const attribute = findAttribute(node, name);
					if (!attribute) continue;

					context.report({
						node: attribute,
						messageId: targets.length
							? "misplacedClassName"
							: "misplacedClassNameNoTargets",
						data: {
							tag: tagText(resolved),
							attribute: name,
							targets: targets.join(", "),
						},
					});
				}
			},
		};
	},
});
