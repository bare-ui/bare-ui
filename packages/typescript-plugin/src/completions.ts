import type * as ts from "typescript";
import {
	findAncestor,
	findOpeningLikeElement,
	findTokenAtPosition,
	resolveTag,
	type JsxOpeningLikeElement,
} from "./ast.js";
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

/** Marks the compound-*part* completion entries this plugin injects. */
export const WIRE_COMPONENT_PARTS_SOURCE = "wire-ui/component-parts";

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

/**
 * The resolved context for completing a compound component's *parts* after the
 * dot (`<Accordion.|`): the Wire UI component, the local tag name (an alias when
 * the import is aliased), the parts to offer (Root first), the span the selection
 * replaces, and whether the completion may expand into a full element snippet.
 */
export interface ComponentPartsContext {
	component: ComponentMetadata;
	/** Local name the tag uses (`Accordion`, or an alias) — for the snippet body. */
	localName: string;
	/** Offerable single-segment parts, Root first, then catalog order. */
	parts: string[];
	/** Span of the partial part name after the dot, replaced on selection. */
	replacementSpan: ts.TextSpan;
	/**
	 * True when the tag is a clean self-closing element with no attributes, so a
	 * selected part can own the whole tag and expand into a full element snippet
	 * (`<Accordion.Item>…</Accordion.Item>`). Otherwise we insert the bare part.
	 */
	expand: boolean;
}

/**
 * The parts worth offering after `<X.` — single-segment parts that are not the
 * component's own name, with `Root` sorted first. Filters out the dotted /
 * self-named entries a few catalog components carry (e.g. `Toggle` lists
 * `ToggleGroup.Root`), which are not members of `X`.
 */
function offerableParts(component: ComponentMetadata): string[] {
	const parts = component.parts.filter(
		(part) => !part.includes(".") && part !== component.name,
	);
	return parts.sort((a, b) => {
		if (a === b) return 0;
		if (a === "Root") return -1;
		if (b === "Root") return 1;
		return parts.indexOf(a) - parts.indexOf(b);
	});
}

/**
 * Resolve the compound-part completion context at `position`, or `undefined`
 * unless the cursor sits in the *name* region of a Wire UI component's
 * property-access tag (`<Accordion.|`, `<Accordion.Ite|m`). Returns `undefined`
 * for non-compound components, unknown / unimported tags, and positions outside
 * the tag-name (attributes, values, children).
 */
export function resolveComponentPartsContext(
	tsLib: TsModule,
	sourceFile: ts.SourceFile,
	position: number,
): ComponentPartsContext | undefined {
	const token = findTokenAtPosition(sourceFile, position);
	if (!token) return undefined;

	const element = findOpeningLikeElement(tsLib, token);
	if (!element) return undefined;

	// The tag must be `X.Part` with a plain identifier on the left.
	const tagName = element.tagName;
	if (
		!tsLib.isPropertyAccessExpression(tagName) ||
		!tsLib.isIdentifier(tagName.expression)
	) {
		return undefined;
	}

	// Cursor must be in the name region — after the dot, not past the tag name
	// into the attribute zone.
	if (
		position <= tagName.expression.getEnd() ||
		position > tagName.getEnd()
	) {
		return undefined;
	}

	const componentName = wireImportBindings(tsLib, sourceFile).get(
		tagName.expression.text,
	);
	if (!componentName) return undefined;

	const component = getComponentMetadata(componentName);
	if (!component || !component.isCompound) return undefined;

	const parts = offerableParts(component);
	if (parts.length === 0) return undefined;

	const nameStart = tagName.name.getStart(sourceFile);
	const nameEnd = tagName.name.getEnd();
	const expand =
		tsLib.isJsxSelfClosingElement(element) &&
		element.attributes.properties.length === 0;

	return {
		component,
		localName: tagName.expression.text,
		parts,
		// When expanding, own the rest of the tag (its ` />` terminator) so the
		// snippet replaces it cleanly; otherwise replace just the partial name.
		replacementSpan: {
			start: nameStart,
			length: (expand ? element.getEnd() : nameEnd) - nameStart,
		},
		expand,
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

/** Snippet body inserted for a part that owns a clean self-closing tag. */
function partSnippet(localName: string, part: string): string {
	// The plugin can't tell leaf parts from container parts (the catalog carries
	// no such flag), so offer the container shape — the common compound case —
	// with the cursor between the tags. Consumers control the markup anyway.
	return `${part}>$0</${localName}.${part}>`;
}

/** Short description for a compound part, derived from the catalog. */
function describePart(component: ComponentMetadata, part: string): string {
	const props = component.props[part];
	const propNote =
		props && props.length > 0
			? ` Accepts ${props.length} prop${props.length === 1 ? "" : "s"}.`
			: "";
	if (part === "Root") {
		return `Root of the ${component.name} compound — wraps the parts and provides their shared context.${propNote}`;
	}
	return `\`${component.name}.${part}\` — a compound part of ${component.name}.${propNote}`;
}

/** Completion entries for a compound component's parts at this position. */
export function buildComponentPartEntries(
	tsLib: TsModule,
	context: ComponentPartsContext,
): ts.CompletionEntry[] {
	return context.parts.map((part, index) => {
		const entry: ts.CompletionEntry = {
			name: part,
			kind: tsLib.ScriptElementKind.memberVariableElement,
			kindModifiers: "",
			// Sort ahead of tsserver's own entries, preserving the Root-first order.
			sortText: `01_wire_${String(index).padStart(3, "0")}`,
			source: WIRE_COMPONENT_PARTS_SOURCE,
			replacementSpan: context.replacementSpan,
			labelDetails: {
				description: `Wire UI · ${context.component.name}`,
			},
			insertText: context.expand
				? partSnippet(context.localName, part)
				: part,
		};
		if (context.expand) entry.isSnippet = true;
		return entry;
	});
}

/** Detail pane (description + docs link) for one injected part entry. */
export function getComponentPartEntryDetails(
	tsLib: TsModule,
	context: ComponentPartsContext,
	entryName: string,
): ts.CompletionEntryDetails | undefined {
	if (!context.parts.includes(entryName)) return undefined;

	const doc = [
		describePart(context.component, entryName),
		`[Wire UI docs](${context.component.docsUrl})`,
	];

	return {
		name: entryName,
		kind: tsLib.ScriptElementKind.memberVariableElement,
		kindModifiers: "",
		displayParts: [
			{ text: "(", kind: "punctuation" },
			{ text: "Wire UI", kind: "text" },
			{ text: ") ", kind: "punctuation" },
			{
				text: `${context.component.name}.${entryName}`,
				kind: "className",
			},
		],
		documentation: [{ text: doc.join("\n\n"), kind: "text" }],
	};
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
