import type * as ts from "typescript";
import type { TsModule } from "../scan.js";
import { isRootTag, resolveWireElement, tagText } from "./helpers.js";
import { WIRE_RULES, type Rule } from "./types.js";

/**
 * Whether the tag has an ancestor that is its component's root — a bare `<X>`
 * or `<X.Root>` wrapping it. The tag's own element never counts (it resolves to
 * the part, not the root), so nesting through intermediate markup
 * (`<X.Root><div><X.Part/></div></X.Root>`) still resolves correctly.
 */
function hasRootAncestor(
	tsLib: TsModule,
	bindings: Map<string, string>,
	element: ts.Node,
	componentName: string,
): boolean {
	for (
		let node: ts.Node | undefined = element.parent;
		node;
		node = node.parent
	) {
		if (!tsLib.isJsxElement(node)) continue;
		const resolved = resolveWireElement(
			tsLib,
			bindings,
			node.openingElement,
		);
		if (
			resolved &&
			resolved.component.name === componentName &&
			isRootTag(resolved.part)
		) {
			return true;
		}
	}
	return false;
}

/**
 * The pair of rules that key off the one invariant the catalog encodes: a
 * compound component's non-`Root` part only reaches its shared context when
 * nested inside that component's root (`<X.Root>` or the bare `<X>`). A part
 * without such a root ancestor is flagged — as `compound-part-outside-root`
 * when a root for that component exists elsewhere in the file (the part escaped
 * it), or `missing-root-wrapper` when no root is present at all.
 */
export const compoundRootRule: Rule = (context) => {
	const { tsLib, bindings } = context;

	// Component names (canonical) that have a root element somewhere in the file.
	const rootsPresent = new Set<string>();
	for (const usage of context.elements) {
		if (isRootTag(usage.part)) rootsPresent.add(usage.component.name);
	}

	for (const usage of context.elements) {
		const { component, part } = usage;
		// Only real, non-Root parts of a compound component qualify.
		if (
			isRootTag(part) ||
			!component.isCompound ||
			part === undefined ||
			!component.parts.includes(part)
		) {
			continue;
		}

		if (hasRootAncestor(tsLib, bindings, usage.element, component.name)) {
			continue;
		}

		const outside = rootsPresent.has(component.name);
		const rule = outside
			? WIRE_RULES.compoundPartOutsideRoot
			: WIRE_RULES.missingRootWrapper;

		const messageText = outside
			? `<${tagText(usage)}> renders outside its ${component.name} root, so it can't reach the shared context. Nest it inside <${usage.localName}.Root>.`
			: `<${tagText(usage)}> has no ${component.name} root wrapper, so it can't reach the shared context. Wrap it in <${usage.localName}.Root>.`;

		context.report(rule, usage.element.tagName, messageText);
	}
};
