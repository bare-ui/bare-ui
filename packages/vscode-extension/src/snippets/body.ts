// Turning a catalog example into a VS Code snippet body.
//
// The @wire-ui/mcp catalog already carries a correct, framework-idiomatic usage
// example for every component — the full compound structure with sensible
// defaults. That *is* the snippet; this module only re-dresses it for the
// snippet grammar: unwrap the Vue SFC wrapper, re-indent with tabs, escape the
// three syntax characters, and turn the literal strings a user would actually
// edit into tab stops.

import type { Framework } from "@wire-ui/typescript-plugin/metadata";

/**
 * Literal text a user is likely to replace, in one of two shapes:
 * a quoted attribute value (`placeholder="Search…"`) or a single-line element
 * child (`<Modal.Close>Close</Modal.Close>`).
 */
const EDITABLE_TEXT = /="([^"\n]*)"|>([^<>{}\n]+)</g;

/**
 * An attribute value carrying any of these reads as code, not copy — a Vue
 * binding (`@change="value = $event"`, `v-slot="{ option }"`) rather than
 * something to type over. Tab stops on those are noise.
 */
const CODE_LIKE = /[{}$()=]/;

/** The catalog authors examples at two spaces per level; the repo indents with tabs. */
const CATALOG_INDENT = 2;

/** Escape the characters the snippet grammar reserves. */
export function escapeSnippetText(text: string): string {
	return text.replace(/[\\$}]/g, "\\$&");
}

/**
 * Strip the `<template>` wrapper the catalog's Vue examples carry. The snippet
 * is inserted *inside* an SFC's template block, so the wrapper would nest a
 * second one.
 */
export function unwrapVueTemplate(example: string): string {
	const match = /^<template>\r?\n([\s\S]*)\r?\n<\/template>$/.exec(
		example.trim(),
	);
	return match ? dedent(match[1]) : example.trim();
}

/** Remove the indentation shared by every non-blank line. */
function dedent(text: string): string {
	const lines = text.split("\n");
	let common = Infinity;
	for (const line of lines) {
		if (!line.trim()) continue;
		common = Math.min(common, /^ */.exec(line)![0].length);
	}
	if (!Number.isFinite(common) || common === 0) return text;
	return lines.map((line) => line.slice(common)).join("\n");
}

/** Re-express leading spaces as tabs so VS Code re-indents to the user's settings. */
function toTabIndent(line: string): string {
	const spaces = /^ */.exec(line)![0].length;
	if (spaces === 0) return line;
	const tabs = Math.floor(spaces / CATALOG_INDENT);
	const remainder = spaces % CATALOG_INDENT;
	return "\t".repeat(tabs) + " ".repeat(remainder) + line.slice(spaces);
}

/**
 * Convert a catalog `basicExample` into a snippet body: placeholders over the
 * text worth editing, `$0` where the cursor lands last.
 */
export function toSnippetBody(example: string, framework: Framework): string {
	const source =
		framework === "vue" ? unwrapVueTemplate(example) : example.trim();
	const text = source.split("\n").map(toTabIndent).join("\n");

	let body = "";
	let cursor = 0;
	let stop = 0;
	const placeholder = (value: string) =>
		`\${${++stop}:${escapeSnippetText(value)}}`;

	EDITABLE_TEXT.lastIndex = 0;
	for (
		let match = EDITABLE_TEXT.exec(text);
		match;
		match = EDITABLE_TEXT.exec(text)
	) {
		const [whole, attributeValue, childText] = match;
		body += escapeSnippetText(text.slice(cursor, match.index));
		cursor = match.index + whole.length;

		if (attributeValue !== undefined) {
			if (!attributeValue.trim() || CODE_LIKE.test(attributeValue)) {
				body += escapeSnippetText(whole);
				continue;
			}
			body += `="${placeholder(attributeValue)}"`;
			continue;
		}

		// Element child: keep the surrounding whitespace literal so the tab stop
		// selects the words, not the padding.
		const [, lead, core, trail] = /^(\s*)(.*?)(\s*)$/.exec(childText)!;
		if (!core) {
			body += escapeSnippetText(whole);
			continue;
		}
		body += `>${lead}${placeholder(core)}${trail}<`;
	}

	return `${body}${escapeSnippetText(text.slice(cursor))}$0`;
}
