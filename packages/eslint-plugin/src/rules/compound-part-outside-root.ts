import { createCompoundVisitor, createRule } from "../util.js";

/**
 * Flags a compound part that renders outside its component's root even though a
 * root for that component exists elsewhere in the file — the part escaped it and
 * can't reach the shared context. The sibling `missing-root-wrapper` rule covers
 * the case where no root is present at all.
 */
export default createRule({
	name: "compound-part-outside-root",
	meta: {
		type: "problem",
		docs: {
			description:
				"Require a Wire UI compound part to render inside its component root",
		},
		schema: [],
		messages: {
			compoundPartOutsideRoot:
				"<{{tag}}.{{part}}> renders outside its {{component}} root, so it can't reach the shared context. Nest it inside <{{tag}}.Root>.",
		},
	},
	defaultOptions: [],
	create(context) {
		return createCompoundVisitor(
			context,
			"outside",
			"compoundPartOutsideRoot",
		);
	},
});
