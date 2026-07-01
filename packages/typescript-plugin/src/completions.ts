import type * as ts from "typescript";
import {
	getComponentMetadata,
	type ComponentMetadata,
	type DataAttributeMetadata,
} from "./metadata/index.js";
import { wireImportBindings, type TsModule } from "./scan.js";

/**
 * Marks the completion entries this plugin injects, so `getCompletionEntryDetails`
 * can recognise them and serve Wire UI docs instead of delegating to tsserver.
 */
export const WIRE_DATA_ATTRIBUTE_SOURCE = "wire-ui/data-attributes";

/** Marks the `data-*` *value* completion entries this plugin injects. */
export const WIRE_DATA_VALUE_SOURCE = "wire-ui/data-values";

/**
 * The resolved context for offering `data-*` completions: the Wire UI component
 * under the cursor, the compound part being edited (if the tag is `X.Part`), and
 * the `data-*` attributes valid for that part.
 */
export interface DataAttributeContext {
	component: ComponentMetadata;
	/** The compound part being edited (`Accordion.Item` → `Item`), if any. */
	part?: string;
	/** `data-*` attributes valid at this position, filtered by `part`. */
	attributes: DataAttributeMetadata[];
}

/** Innermost node whose full span contains `position`. */
function findTokenAtPosition(
	sourceFile: ts.SourceFile,
	position: number,
): ts.Node | undefined {
	function find(node: ts.Node): ts.Node | undefined {
		if (position < node.getFullStart() || position > node.getEnd()) {
			return undefined;
		}
		let match: ts.Node | undefined;
		node.forEachChild((child) => {
			if (
				!match &&
				position >= child.getFullStart() &&
				position <= child.getEnd()
			) {
				match = find(child);
			}
		});
		return match ?? node;
	}
	return find(sourceFile);
}

/** Nearest ancestor (inclusive) satisfying `predicate`. */
function findAncestor<T extends ts.Node>(
	node: ts.Node | undefined,
	predicate: (n: ts.Node) => n is T,
): T | undefined {
	for (let current = node; current; current = current.parent) {
		if (predicate(current)) return current;
	}
	return undefined;
}

type JsxOpeningLikeElement = ts.JsxOpeningElement | ts.JsxSelfClosingElement;

function findOpeningLikeElement(
	tsLib: TsModule,
	node: ts.Node | undefined,
): JsxOpeningLikeElement | undefined {
	return findAncestor(
		node,
		(n): n is JsxOpeningLikeElement =>
			tsLib.isJsxOpeningElement(n) || tsLib.isJsxSelfClosingElement(n),
	);
}

/** Resolve a JSX tag name to a component and, for `X.Part`, its part. */
function resolveTag(
	tsLib: TsModule,
	tagName: ts.JsxTagNameExpression,
): { name: string; part?: string } | undefined {
	if (tsLib.isIdentifier(tagName)) return { name: tagName.text };
	if (
		tsLib.isPropertyAccessExpression(tagName) &&
		tsLib.isIdentifier(tagName.expression) &&
		tsLib.isIdentifier(tagName.name)
	) {
		return { name: tagName.expression.text, part: tagName.name.text };
	}
	return undefined;
}

/**
 * A `data-*` attribute applies at this position when the tag is the bare
 * component (`part` undefined → offer everything), or when the attribute is
 * unscoped, or when its `appliesTo` list names the current part.
 */
function appliesToPart(
	appliesTo: string | undefined,
	part: string | undefined,
): boolean {
	if (!part || !appliesTo) return true;
	return appliesTo
		.split(",")
		.map((p) => p.trim())
		.includes(part);
}

/**
 * Resolve a JSX opening element to the Wire UI component it renders and the
 * compound part being edited. The tag's local name must map to a real
 * `@wire-ui/*` import in this file — this rejects same-named components from
 * other libraries and makes aliased imports (`Switch as Toggle` → `<Toggle>`)
 * work. Returns `undefined` when the tag is not a Wire component or names an
 * unknown compound part.
 */
function resolveWireComponent(
	tsLib: TsModule,
	sourceFile: ts.SourceFile,
	element: JsxOpeningLikeElement,
): { component: ComponentMetadata; part?: string } | undefined {
	const tag = resolveTag(tsLib, element.tagName);
	if (!tag) return undefined;

	const componentName = wireImportBindings(tsLib, sourceFile).get(tag.name);
	if (!componentName) return undefined;

	const component = getComponentMetadata(componentName);
	if (!component) return undefined;
	// `Accordion.NotAPart` — a compound access that names no real part.
	if (tag.part && !component.parts.includes(tag.part)) return undefined;

	return { component, part: tag.part };
}

/**
 * Resolve the `data-*` completion context at `position`, or `undefined` when the
 * cursor is not inside the attribute-name region of a Wire UI JSX element.
 *
 * Deliberately returns `undefined` for attribute *value* positions
 * (`data-state="…"`) — that is `resolveDataAttributeValueContext`'s job.
 */
export function resolveDataAttributeContext(
	tsLib: TsModule,
	sourceFile: ts.SourceFile,
	position: number,
): DataAttributeContext | undefined {
	const token = findTokenAtPosition(sourceFile, position);
	if (!token) return undefined;

	// Inside an attribute's value (a string or `{expr}` initializer) is a value
	// position, not a name position — leave it to value completion.
	const attribute = findAncestor(token, tsLib.isJsxAttribute);
	if (attribute?.initializer) {
		const init = attribute.initializer;
		if (
			position >= init.getStart(sourceFile) &&
			position <= init.getEnd()
		) {
			return undefined;
		}
	}

	const element = findOpeningLikeElement(tsLib, token);
	if (!element) return undefined;
	// Must be past the tag name — inside the attribute zone, not still typing the
	// element name (`<Switc|`).
	if (position <= element.tagName.getEnd()) return undefined;

	const resolved = resolveWireComponent(tsLib, sourceFile, element);
	if (!resolved) return undefined;

	const attributes = resolved.component.dataAttributes.filter((attr) =>
		appliesToPart(attr.appliesTo, resolved.part),
	);
	if (attributes.length === 0) return undefined;

	return { component: resolved.component, part: resolved.part, attributes };
}

/**
 * The resolved context for completing a `data-*` attribute's *value*: the Wire
 * UI component, the specific attribute, its value enum, and the text span the
 * completion should replace (the string's content, inside the quotes).
 */
export interface DataAttributeValueContext {
	component: ComponentMetadata;
	attribute: DataAttributeMetadata;
	/** The attribute's value enum, e.g. `["checked", "unchecked"]`. */
	values: string[];
	/** Content span inside the quotes, replaced when a value is selected. */
	replacementSpan: ts.TextSpan;
}

/**
 * Resolve the `data-*` value completion context at `position`, or `undefined`
 * unless the cursor is inside the string-literal value of a value-carrying
 * `data-*` attribute on a Wire UI element (`<Switch data-state="|">`).
 * Expression values (`data-state={…}`) are intentionally not handled.
 */
export function resolveDataAttributeValueContext(
	tsLib: TsModule,
	sourceFile: ts.SourceFile,
	position: number,
): DataAttributeValueContext | undefined {
	const token = findTokenAtPosition(sourceFile, position);
	if (!token || !tsLib.isStringLiteral(token)) return undefined;

	const attribute = token.parent;
	if (
		!attribute ||
		!tsLib.isJsxAttribute(attribute) ||
		attribute.initializer !== token
	) {
		return undefined;
	}

	// Cursor must sit inside the quotes. The string may be unterminated while
	// typing (`data-state="|`), so only strip a trailing quote when one is there.
	const raw = token.getText(sourceFile);
	const start = token.getStart(sourceFile);
	const end = token.getEnd();
	const terminated = raw.length >= 2 && raw[raw.length - 1] === raw[0];
	const contentStart = start + 1;
	const contentEnd = terminated ? end - 1 : end;
	if (position < contentStart || position > contentEnd) return undefined;

	const element = findOpeningLikeElement(tsLib, attribute);
	if (!element) return undefined;

	const resolved = resolveWireComponent(tsLib, sourceFile, element);
	if (!resolved) return undefined;

	const attrName = attribute.name.getText(sourceFile);
	const attrMeta = resolved.component.dataAttributes.find(
		(attr) =>
			attr.name === attrName &&
			appliesToPart(attr.appliesTo, resolved.part),
	);
	if (!attrMeta || attrMeta.values.length === 0) return undefined;

	return {
		component: resolved.component,
		attribute: attrMeta,
		values: attrMeta.values,
		replacementSpan: {
			start: contentStart,
			length: contentEnd - contentStart,
		},
	};
}

/** Completion entries for the `data-*` attributes valid at this position. */
export function buildDataAttributeEntries(
	tsLib: TsModule,
	context: DataAttributeContext,
): ts.CompletionEntry[] {
	return context.attributes.map((attr, index) => ({
		name: attr.name,
		kind: tsLib.ScriptElementKind.jsxAttribute,
		kindModifiers: "",
		// Sort ahead of tsserver's own entries so the real attributes surface first.
		sortText: `01_wire_${String(index).padStart(3, "0")}`,
		source: WIRE_DATA_ATTRIBUTE_SOURCE,
		labelDetails: { description: "Wire UI" },
	}));
}

/** Detail pane (description + value enum + docs link) for one injected entry. */
export function getDataAttributeEntryDetails(
	tsLib: TsModule,
	context: DataAttributeContext,
	entryName: string,
): ts.CompletionEntryDetails | undefined {
	const attr = context.attributes.find((a) => a.name === entryName);
	if (!attr) return undefined;

	const doc = [attr.description];
	if (attr.values.length > 0) {
		doc.push(`Values: ${attr.values.map((v) => `\`${v}\``).join(" | ")}`);
	}
	doc.push(`[Wire UI docs](${context.component.docsUrl})`);

	return {
		name: attr.name,
		kind: tsLib.ScriptElementKind.jsxAttribute,
		kindModifiers: "",
		displayParts: [
			{ text: "(", kind: "punctuation" },
			{ text: "Wire UI", kind: "text" },
			{ text: ") ", kind: "punctuation" },
			{ text: attr.name, kind: "propertyName" },
		],
		documentation: [{ text: doc.join("\n\n"), kind: "text" }],
	};
}

/** Completion entries for a `data-*` attribute's valid values at this position. */
export function buildDataAttributeValueEntries(
	tsLib: TsModule,
	context: DataAttributeValueContext,
): ts.CompletionEntry[] {
	return context.values.map((value, index) => ({
		name: value,
		kind: tsLib.ScriptElementKind.string,
		kindModifiers: "",
		sortText: `01_wire_${String(index).padStart(3, "0")}`,
		source: WIRE_DATA_VALUE_SOURCE,
		// Replace whatever is already between the quotes, not just insert.
		replacementSpan: context.replacementSpan,
	}));
}

/** Detail pane for one injected `data-*` value entry. */
export function getDataAttributeValueEntryDetails(
	tsLib: TsModule,
	context: DataAttributeValueContext,
	entryName: string,
): ts.CompletionEntryDetails | undefined {
	if (!context.values.includes(entryName)) return undefined;

	const doc = [
		`\`${context.attribute.name}="${entryName}"\` on \`${context.component.name}\`.`,
		context.attribute.description,
		`[Wire UI docs](${context.component.docsUrl})`,
	];

	return {
		name: entryName,
		kind: tsLib.ScriptElementKind.string,
		kindModifiers: "",
		displayParts: [
			{ text: "(", kind: "punctuation" },
			{ text: "Wire UI", kind: "text" },
			{ text: ") ", kind: "punctuation" },
			{ text: `"${entryName}"`, kind: "stringLiteral" },
		],
		documentation: [{ text: doc.join("\n\n"), kind: "text" }],
	};
}
