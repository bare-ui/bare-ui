import type * as ts from "typescript";
import type { TsModule } from "../scan.js";
import { knownDataStateValues, knownPresenceAttributes } from "./helpers.js";
import { WIRE_RULES, type Rule } from "./types.js";

/**
 * ARIA states Wire UI mirrors into `data-state`. The correspondence is the
 * ARIA convention, not component data, so it lives here — but each suggestion
 * is gated on the target value existing somewhere in the catalog's `data-state`
 * vocabulary, so a mapping the libraries don't actually produce never fires.
 */
const ARIA_STATE_EQUIVALENTS: Record<string, Record<string, string>> = {
	"aria-expanded": { true: "open", false: "closed" },
	"aria-pressed": { true: "on", false: "off" },
	"aria-selected": { true: "active", false: "inactive" },
	// `aria-checked` has no entry on purpose: Checkbox, Radio, and Switch expose
	// their checked state as the presence attribute `data-checked`, not as a
	// `data-state` value, so there is nothing here to rewrite it to.
};

/** `[aria-expanded="true"]`, with the quotes optional. */
const ARIA_SELECTOR =
	/\[\s*(aria-[a-z]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([A-Za-z]+))\s*\]/g;

/** `[data-hover="false"]`, with the quotes optional. */
const FALSE_PRESENCE_SELECTOR =
	/\[\s*(data-[a-z-]+)\s*=\s*(?:"false"|'false'|false)\s*\]/g;

/** Visit every string-ish literal, handing back its raw source span. */
function forEachStringLike(
	tsLib: TsModule,
	sourceFile: ts.SourceFile,
	visit: (raw: string, start: number) => void,
): void {
	const walk = (node: ts.Node) => {
		if (
			tsLib.isStringLiteralLike(node) ||
			node.kind === tsLib.SyntaxKind.TemplateHead ||
			node.kind === tsLib.SyntaxKind.TemplateMiddle ||
			node.kind === tsLib.SyntaxKind.TemplateTail
		) {
			const start = node.getStart(sourceFile);
			// Slice the raw source rather than reading `node.text`, so a match's
			// offset lines up with the file even when the literal has escapes.
			visit(sourceFile.text.slice(start, node.getEnd()), start);
		}
		node.forEachChild(walk);
	};
	walk(sourceFile);
}

/**
 * The two selector rules. Both read string literals rather than JSX, because
 * that's where selectors live — CSS-in-JS templates, class-name strings, and
 * `querySelector` arguments. Like every other rule they only run on files that
 * import Wire UI, so a selector aimed at unrelated markup is never rewritten.
 *
 * - `prefer-data-state-selector` — matching the ARIA mirror instead of the
 *   `data-*` contract. `aria-*` is there for assistive tech; `data-state` is
 *   the styling API, and it's the one that survives a component's internals
 *   changing which ARIA attribute it uses.
 * - `presence-attribute-false-selector` — Wire UI presence attributes are `''`
 *   when on and absent when off, never the string `"false"`, so
 *   `[data-hover="false"]` matches nothing at all.
 */
export const selectorRules: Rule = (context) => {
	const dataStateValues = knownDataStateValues();
	const presenceAttributes = knownPresenceAttributes();

	forEachStringLike(context.tsLib, context.sourceFile, (raw, start) => {
		for (const match of raw.matchAll(ARIA_SELECTOR)) {
			const attribute = match[1];
			const value = match[2] ?? match[3] ?? match[4];
			const replacement = ARIA_STATE_EQUIVALENTS[attribute]?.[value];
			if (!replacement || !dataStateValues.has(replacement)) continue;

			context.reportSpan(
				WIRE_RULES.preferDataStateSelector,
				start + (match.index ?? 0),
				match[0].length,
				`${match[0]} targets the ARIA mirror. Wire UI's styling contract is data-*, so use [data-state="${replacement}"].`,
			);
		}

		for (const match of raw.matchAll(FALSE_PRESENCE_SELECTOR)) {
			const attribute = match[1];
			if (!presenceAttributes.has(attribute)) continue;

			context.reportSpan(
				WIRE_RULES.presenceAttributeFalseSelector,
				start + (match.index ?? 0),
				match[0].length,
				`${match[0]} never matches — ${attribute} is a presence attribute, so it is '' when on and absent when off. Use :not([${attribute}]).`,
			);
		}
	});
};
