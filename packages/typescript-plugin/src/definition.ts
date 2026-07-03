import type * as ts from "typescript";
import type { WireTagContext } from "./ast.js";
import type { TsModule } from "./scan.js";

/**
 * Marks the synthetic docs definition this plugin emits when a Wire UI tag has
 * no navigable local source. It is not a `ts.DefinitionInfo` field — the plugin
 * keeps it out of the returned object — but names the concept for callers.
 */
export const WIRE_DOCS_DEFINITION_SOURCE = "wire-ui/docs";

/** A declaration file (`*.d.ts`) carries types but no navigable implementation. */
function isDeclarationFile(fileName: string): boolean {
	return /\.d\.[cm]?ts$/i.test(fileName);
}

/**
 * Whether the host already resolved the tag to real, navigable source — any
 * definition that is not a bundled declaration file. When false the component
 * ships only types (the typical `npm install`), and its docs page is the best
 * target we can offer.
 */
export function hasLocalSource(
	definitions: readonly ts.DefinitionInfo[],
): boolean {
	return definitions.some((def) => !isDeclarationFile(def.fileName));
}

/**
 * A synthetic definition pointing at the component's docs page. Its `fileName`
 * is the docs URL rather than a filesystem path; VS Code's built-in Go to
 * Definition only navigates `file:` targets, so turning this into a clickable
 * link is the extension's job — the plugin's role is to resolve the right
 * target and hand it over. `unverified` flags it as a best-effort result.
 */
export function buildDocsDefinition(
	tsLib: TsModule,
	context: WireTagContext,
): ts.DefinitionInfo {
	const name = context.part
		? `${context.component.name}.${context.part}`
		: context.component.name;
	return {
		fileName: context.component.docsUrl,
		textSpan: { start: 0, length: 0 },
		kind: tsLib.ScriptElementKind.classElement,
		name,
		containerKind: tsLib.ScriptElementKind.unknown,
		containerName: "Wire UI",
		unverified: true,
	};
}

/**
 * Merge Wire UI's docs target into the host's definitions for a resolved tag.
 * Keeps tsserver's source jump whenever real source exists; otherwise appends
 * the docs page as a fallback — never replacing what the host already found.
 */
export function augmentDefinitions(
	tsLib: TsModule,
	context: WireTagContext,
	priorDefinitions: readonly ts.DefinitionInfo[],
): ts.DefinitionInfo[] {
	if (hasLocalSource(priorDefinitions)) return [...priorDefinitions];
	return [...priorDefinitions, buildDocsDefinition(tsLib, context)];
}

/**
 * The bound-span variant used by `getDefinitionAndBoundSpan`: same merge, and
 * highlights the tag-name span when the host supplied none (e.g. an unresolved
 * import in a bare metadata project).
 */
export function augmentDefinitionAndBoundSpan(
	tsLib: TsModule,
	context: WireTagContext,
	prior: ts.DefinitionInfoAndBoundSpan | undefined,
): ts.DefinitionInfoAndBoundSpan {
	const priorDefinitions = prior?.definitions ?? [];
	return {
		definitions: augmentDefinitions(tsLib, context, priorDefinitions),
		textSpan: prior?.textSpan ?? context.span,
	};
}
