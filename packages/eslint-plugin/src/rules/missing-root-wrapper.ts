import { createCompoundVisitor, createRule } from "../util.js";

/**
 * Flags a compound part that has no root wrapper for its component anywhere in
 * the file — e.g. `<Input.Field>` with no `<Input.Root>` — so it can't reach the
 * shared context. The sibling `compound-part-outside-root` rule covers the case
 * where a root exists but the part renders outside it.
 */
export default createRule({
	name: "missing-root-wrapper",
	meta: {
		type: "problem",
		docs: {
			description:
				"Require a Wire UI compound component to have its root wrapper present",
		},
		schema: [],
		messages: {
			missingRootWrapper:
				"<{{tag}}.{{part}}> has no {{component}} root wrapper, so it can't reach the shared context. Wrap it in <{{tag}}.Root>.",
		},
	},
	defaultOptions: [],
	create(context) {
		return createCompoundVisitor(context, "missing", "missingRootWrapper");
	},
});
