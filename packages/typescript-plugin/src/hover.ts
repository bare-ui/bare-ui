import type * as ts from "typescript";
import { resolveWireTagContext, type WireTagContext } from "./ast.js";
import { type ComponentMetadata } from "./metadata/index.js";
import { type TsModule } from "./scan.js";

/**
 * The resolved context for a Wire UI hover: the component under the cursor, the
 * compound part when the tag is `X.Part`, and the tag-name span the hover
 * highlights. Structurally the shared {@link WireTagContext}.
 */
export type HoverContext = WireTagContext;

/**
 * Resolve the hover context at `position`, or `undefined` unless the cursor is
 * over the *tag name* of a Wire UI JSX element. Thin alias over the shared
 * {@link resolveWireTagContext}, which hover and go-to-definition both use.
 */
export function resolveHoverContext(
	tsLib: TsModule,
	sourceFile: ts.SourceFile,
	position: number,
): HoverContext | undefined {
	return resolveWireTagContext(tsLib, sourceFile, position);
}

/** Sanitize a value for a markdown table cell (escape pipes, flatten newlines). */
function escapeCell(text: string): string {
	return text
		.replace(/\|/g, "\\|")
		.replace(/\s*\n\s*/g, " ")
		.trim();
}

/** Markdown table of the component's compound parts and their props. */
function partsTable(
	component: ComponentMetadata,
	focusedPart?: string,
): string {
	const rows = component.parts
		// Skip dotted catalog entries (e.g. Toggle's `ToggleGroup.Root`).
		.filter((part) => !part.includes("."))
		.map((part) => {
			const props = component.props[part];
			const propList =
				props && props.length > 0
					? props.map((prop) => `\`${prop.name}\``).join(", ")
					: "—";
			const marker = part === focusedPart ? "▸ " : "";
			return `| ${marker}\`${component.name}.${part}\` | ${propList} |`;
		});
	if (rows.length === 0) return "";
	return ["**Parts**", "", "| Part | Props |", "| --- | --- |", ...rows].join(
		"\n",
	);
}

/** Markdown table of the component's `data-*` attributes. */
function dataAttributesTable(component: ComponentMetadata): string {
	const rows = component.dataAttributes.map((attr) => {
		const values =
			attr.values.length > 0
				? attr.values.map((value) => `\`${value}\``).join(" \\| ")
				: "—";
		const applies = attr.appliesTo
			? escapeCell(attr.appliesTo)
			: "all parts";
		return `| \`${attr.name}\` | ${values} | ${applies} | ${escapeCell(attr.description)} |`;
	});
	if (rows.length === 0) return "";
	return [
		"**Data attributes**",
		"",
		"| Attribute | Values | Applies to | Description |",
		"| --- | --- | --- | --- |",
		...rows,
	].join("\n");
}

/** Render the markdown documentation body for a hover. */
export function buildHoverMarkdown(context: HoverContext): string {
	const { component, part } = context;
	const sections: string[] = [];

	if (part) {
		sections.push(
			`**${component.name}.${part}** — compound part of \`${component.name}\` · _${component.category}_`,
		);
	} else {
		sections.push(`**${component.name}** · _${component.category}_`);
	}
	sections.push(component.description);

	const parts = partsTable(component, part);
	if (parts) sections.push(parts);

	const attributes = dataAttributesTable(component);
	if (attributes) sections.push(attributes);

	if (component.notes.length > 0) {
		sections.push(component.notes.map((note) => `> ${note}`).join("\n"));
	}

	sections.push(`[Wire UI docs](${component.docsUrl})`);
	return sections.join("\n\n");
}

/** Build the tsserver `QuickInfo` for a resolved Wire UI hover context. */
export function buildHoverQuickInfo(
	tsLib: TsModule,
	context: HoverContext,
): ts.QuickInfo {
	const title = context.part
		? `${context.component.name}.${context.part}`
		: context.component.name;

	return {
		kind: tsLib.ScriptElementKind.classElement,
		kindModifiers: "",
		textSpan: context.span,
		displayParts: [
			{ text: "(", kind: "punctuation" },
			{ text: "Wire UI", kind: "text" },
			{ text: ") ", kind: "punctuation" },
			{ text: title, kind: "className" },
		],
		documentation: [{ text: buildHoverMarkdown(context), kind: "text" }],
	};
}
