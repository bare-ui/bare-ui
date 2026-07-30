// Reading the editing context a snippet lands in — all pure text analysis, so
// it is unit-testable without a running VS Code.
//
// Deliberately regex-based rather than AST-based. The TypeScript Language
// Service plugin owns AST-driven intelligence, but snippets also have to work
// inside `.vue` single-file components, whose template markup never reaches the
// TS AST. One text-level implementation covers both surfaces.

import {
	FRAMEWORKS,
	type Framework,
} from "@wire-ui/typescript-plugin/metadata";

/** Languages the snippet provider attaches to — mirrors `activationEvents`. */
export const SNIPPET_LANGUAGES = [
	"javascript",
	"javascriptreact",
	"typescript",
	"typescriptreact",
	"vue",
] as const;

/** A single text insertion, in document offsets. */
export interface ImportEdit {
	/** Offset the text is inserted at. */
	offset: number;
	newText: string;
}

function escapeRegExp(text: string): string {
	return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Frameworks whose package this text imports from, in catalog order. */
export function frameworksImportedIn(text: string): Framework[] {
	const found = new Set<string>();
	const pattern = /from\s*['"]@wire-ui\/(react|vue|solid)['"]/g;
	for (let m = pattern.exec(text); m; m = pattern.exec(text)) found.add(m[1]);
	return FRAMEWORKS.filter((framework) => found.has(framework));
}

/** Frameworks a workspace's `package.json` depends on, in catalog order. */
export function frameworksFromPackageJson(manifest: unknown): Framework[] {
	if (typeof manifest !== "object" || manifest === null) return [];
	const record = manifest as Record<string, unknown>;
	const names = new Set<string>();
	for (const field of [
		"dependencies",
		"devDependencies",
		"peerDependencies",
	]) {
		const deps = record[field];
		if (typeof deps === "object" && deps !== null)
			for (const name of Object.keys(deps)) names.add(name);
	}
	return FRAMEWORKS.filter((framework) => names.has(`@wire-ui/${framework}`));
}

/**
 * Decide which framework's authoring syntax to insert.
 *
 * A `.vue` file can only be Vue. Everywhere else the file is JSX, so Vue is
 * ruled out even in a Vue workspace — the catalog's Vue example is SFC template
 * markup, which a JSX render function can't use, while the React example is
 * valid JSX for either. Signal order: what the file already imports, then what
 * the workspace depends on, then React.
 */
export function detectFramework(context: {
	languageId: string;
	documentText: string;
	workspaceFrameworks?: readonly Framework[];
}): Framework {
	if (context.languageId === "vue") return "vue";

	const isJsxFramework = (framework: Framework) => framework !== "vue";
	const imported = frameworksImportedIn(context.documentText).filter(
		isJsxFramework,
	);
	if (imported.length > 0) return imported[0];

	const workspace = (context.workspaceFrameworks ?? []).filter(
		isJsxFramework,
	);
	if (workspace.length > 0) return workspace[0];

	return "react";
}

/**
 * Whether an offset sits in an SFC's root `<template>` block — the only place
 * component markup belongs in a `.vue` file. Both the opening and closing tag
 * are matched at column 0, which is where the SFC convention puts them; nested
 * `<template v-if>` blocks are indented and so never mistaken for the root.
 */
export function isInVueTemplate(text: string, offset: number): boolean {
	const open = /^<template(\s[^>]*)?>/m.exec(text);
	if (!open) return false;

	const start = open.index + open[0].length;
	const closing = text.lastIndexOf("\n</template>");
	const end = closing === -1 ? text.length : closing;
	return offset >= start && offset <= end;
}

/** The span of a document that holds import statements. */
interface ScriptRegion {
	start: number;
	end: number;
}

function vueScriptRegion(text: string): ScriptRegion | undefined {
	const open = /^<script(\s[^>]*)?>/m.exec(text);
	if (!open) return undefined;
	const start = open.index + open[0].length;
	const closing = text.indexOf("</script>", start);
	return { start, end: closing === -1 ? text.length : closing };
}

function scriptRegion(
	text: string,
	languageId: string,
): ScriptRegion | undefined {
	if (languageId !== "vue") return { start: 0, end: text.length };

	// An SFC keeps its imports in the script block; without one there is nowhere
	// to put an import, and guessing would mangle the file.
	return vueScriptRegion(text);
}

/**
 * Whether an offset sits in an SFC's `<script>` block — where statements belong,
 * and so where a hook snippet may be offered. The counterpart to
 * `isInVueTemplate`; an offset in neither is at SFC top level, which is where a
 * whole-file scaffold goes.
 */
export function isInVueScript(text: string, offset: number): boolean {
	const region = vueScriptRegion(text);
	if (!region) return false;
	return offset >= region.start && offset <= region.end;
}

/**
 * Whether a `.vue` file already has SFC blocks. A whole-SFC scaffold can only
 * land in one that has none — a file with a `<template>` or `<script>` cannot
 * take a second of either.
 */
export function hasVueSfcBlocks(text: string): boolean {
	return /^<(template|script|style)\b/m.test(text);
}

/**
 * Names an `import { … }` clause mentions, ignoring any `as` alias and any
 * inline `type` marker — a name already spelled in the clause is left alone
 * either way, since re-importing it would be a duplicate identifier.
 */
function importedNames(clause: string): string[] {
	return clause
		.split(",")
		.map((specifier) =>
			specifier
				.trim()
				.replace(/^type\s+/, "")
				.split(/\s+as\s+/)[0]
				.trim(),
		)
		.filter(Boolean);
}

/**
 * Work out the edit that makes `names` available, or `undefined` when they all
 * already are (or when there is nowhere safe to put the import). Merges into an
 * existing import from the same module when there is one, otherwise adds a line
 * after the last import. Most snippets need a single name; a few hooks ship
 * helpers alongside the hook itself (`useDirection`, `getDirection`, `isRtl`).
 */
export function planImportEdit(options: {
	text: string;
	languageId: string;
	names: readonly string[];
	moduleId: string;
}): ImportEdit | undefined {
	const { text, languageId, names, moduleId } = options;
	if (names.length === 0) return undefined;

	const region = scriptRegion(text, languageId);
	if (!region) return undefined;

	const source = text.slice(region.start, region.end);
	const module = escapeRegExp(moduleId);

	const named = new RegExp(
		`import\\s+(type\\s+)?\\{([^}]*)\\}\\s*from\\s*(['"])${module}\\3`,
		"g",
	);
	for (let m = named.exec(source); m; m = named.exec(source)) {
		if (m[1]) continue; // `import type { … }` binds no value.
		const present = importedNames(m[2]);
		const missing = names.filter((name) => !present.includes(name));
		if (missing.length === 0) return undefined;

		const braceOpen = region.start + m.index + m[0].indexOf("{");
		const braceClose = braceOpen + 1 + m[2].length;
		let offset = braceClose;
		while (offset > braceOpen + 1 && /\s/.test(text[offset - 1])) offset--;

		const added = missing.join(", ");
		if (offset === braceOpen + 1) return { offset, newText: ` ${added} ` };
		const separator = text[offset - 1] === "," ? "" : ",";
		return { offset, newText: `${separator} ${added}` };
	}

	const statement = `import { ${names.join(", ")} } from ${quoteStyle(source)}${moduleId}${quoteStyle(source)}${semicolonStyle(source)}`;

	const anyImport = /import\s+[\s\S]*?from\s*(['"])[^'"]*\1;?/g;
	let lastEnd: number | undefined;
	for (let m = anyImport.exec(source); m; m = anyImport.exec(source))
		lastEnd = region.start + m.index + m[0].length;

	if (lastEnd !== undefined)
		return { offset: lastEnd, newText: `\n${statement}` };
	if (languageId === "vue")
		return { offset: region.start, newText: `\n${statement}` };
	return { offset: 0, newText: `${statement}\n` };
}

/** Match the file's own quote style; Wire UI's own examples use single quotes. */
function quoteStyle(source: string): string {
	return /from\s*"/.test(source) && !/from\s*'/.test(source) ? '"' : "'";
}

function semicolonStyle(source: string): string {
	const existing = /from\s*(['"])[^'"]*\1([ \t]*;)?/.exec(source);
	if (!existing) return ";";
	return existing[2] ? ";" : "";
}
