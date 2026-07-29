import {
	appliesToParts,
	attributeStringValue,
	attributesOf,
	tagText,
} from "./helpers.js";
import { WIRE_RULES, type Rule } from "./types.js";

/**
 * The three mistakes that come from hand-writing a `data-*` the component
 * already owns. All are catalog-gated on the attribute appearing in *this*
 * component's `dataAttributes`, so a consumer's own `data-*` is never touched.
 *
 * - `data-attribute-wrong-part` — the catalog scopes the attribute to other
 *   parts (`data-invalid` lives on `Input.Field`, not `Input.Root`).
 * - `invalid-data-state-value` — a `data-state` written with a value the
 *   component never emits, so no selector will ever match it.
 * - `managed-data-attribute` — otherwise: the component sets this attribute
 *   from its own state, and the hand-written value is overwritten.
 *
 * The three are mutually exclusive, so one attribute never reports twice.
 */
export const dataAttributesRule: Rule = (context) => {
	const { tsLib } = context;

	for (const usage of context.elements) {
		const { component, effectivePart } = usage;

		for (const attribute of attributesOf(tsLib, usage.element)) {
			if (!tsLib.isIdentifier(attribute.name)) continue;
			const name = attribute.name.text;
			if (!name.startsWith("data-")) continue;

			const documented = component.dataAttributes.find(
				(candidate) => candidate.name === name,
			);
			if (!documented) continue;

			const scope = appliesToParts(component, documented);
			if (scope.length > 0 && !scope.includes(effectivePart)) {
				const where = scope
					.map((part) => `<${usage.localName}.${part}>`)
					.join(", ");
				context.report(
					WIRE_RULES.dataAttributeWrongPart,
					attribute,
					`${component.name} exposes ${name} on ${where}, not on <${tagText(usage)}>.`,
				);
				continue;
			}

			const value = attributeStringValue(tsLib, attribute);
			if (
				name === "data-state" &&
				value !== undefined &&
				component.dataStateValues.length > 0 &&
				!component.dataStateValues.includes(value)
			) {
				context.report(
					WIRE_RULES.invalidDataStateValue,
					attribute,
					`"${value}" is not a data-state ${component.name} emits. Valid values: ${component.dataStateValues.join(", ")}.`,
				);
				continue;
			}

			context.report(
				WIRE_RULES.managedDataAttribute,
				attribute,
				`${component.name} sets ${name} itself, so a hand-written value is overwritten on the next render. Target it from your styles instead.`,
			);
		}
	}
};
