// Turning a catalog example into a VS Code snippet body.
//
// The @wire-ui/mcp catalog already carries a correct, framework-idiomatic usage
// example for every component, hook, and scaffold. That *is* the snippet; this
// module only re-dresses it for the snippet grammar: unwrap the Vue SFC wrapper,
// re-indent with tabs, escape the three syntax characters, and turn the literal
// text a user would actually edit into tab stops.
//
// Markup and code want different tab stops, so there are two transforms.
// `toSnippetBody` reads JSX/template markup (attribute values, element text);
// `toCodeSnippetBody` reads statements (string and number arguments, callback
// bodies). Scaffolds get `toScaffoldBody` and no tab stops at all — a
// whole-file body peppered with them would be hostile to tab through.

import type { Framework } from "@wire-ui/typescript-plugin/metadata";

/**
 * Literal text a user is likely to replace, in one of two shapes:
 * a quoted attribute value (`placeholder="Search…"`) or a single-line element
 * child (`<Modal.Close>Close</Modal.Close>`).
 */
const EDITABLE_TEXT = /="([^"\n]*)"|>([^<>{}\n]+)</g;

/**
 * The parts of a statement worth a tab stop, most specific first:
 *
 * 1. a single-expression callback body — `() => close()`, the thing a user
 *    swaps for their own function;
 * 2. a single-quoted string argument — `'theme'`, `'(max-width: 768px)'`;
 * 3. a bare number — `250`, `0.5`.
 *
 * The callback pattern deliberately refuses nested parentheses and quotes, so
 * `() => setNow(Date.now())` and `(v) => emit('change', v)` stay literal rather
 * than swallowing a stop over something a user has no reason to retype.
 */
const EDITABLE_CODE =
	/(=>\s*)([A-Za-z_$][\w$.]*\([\w$., ]*\))|'([^'\n]*)'|(?<![\w.$])(\d+(?:\.\d+)?)(?![\w.])/g;

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

function tabIndented(text: string): string {
	return text.split("\n").map(toTabIndent).join("\n");
}

/**
 * A catalog example ending on `return <div ref={ref}>…</div>` is showing where
 * the hook's result goes. Inserted into a function that already returns, that
 * would be a stray statement — so the line is commented out rather than dropped,
 * since the guidance is the whole point of it.
 */
export function demoTailToComment(example: string): string {
	const lines = example.split("\n");
	for (let index = lines.length - 1; index >= 0; index--) {
		const line = lines[index];
		if (!line.trim()) continue;
		if (!/^\s*return\s/.test(line)) break;
		lines[index] = line.replace(/^([ \t]*)/, "$1// ");
	}
	return lines.join("\n");
}

/** Whether an offset sits after a `//` on its own line — no tab stops in prose. */
function isInLineComment(text: string, offset: number): boolean {
	const lineStart = text.lastIndexOf("\n", offset - 1) + 1;
	const comment = text.indexOf("//", lineStart);
	return comment !== -1 && comment < offset;
}

/**
 * Walk `pattern` over `text`, letting `replace` turn each match into snippet
 * text. Everything between matches is escaped verbatim; returning `undefined`
 * leaves the match itself literal, which keeps the tab-stop numbering gapless.
 */
function withTabStops(
	text: string,
	pattern: RegExp,
	replace: (
		match: RegExpExecArray,
		placeholder: (value: string) => string,
	) => string | undefined,
): string {
	let body = "";
	let cursor = 0;
	let stop = 0;
	const placeholder = (value: string) =>
		`\${${++stop}:${escapeSnippetText(value)}}`;

	pattern.lastIndex = 0;
	for (let match = pattern.exec(text); match; match = pattern.exec(text)) {
		body += escapeSnippetText(text.slice(cursor, match.index));
		cursor = match.index + match[0].length;
		body += replace(match, placeholder) ?? escapeSnippetText(match[0]);
	}

	return `${body}${escapeSnippetText(text.slice(cursor))}$0`;
}

/**
 * Convert a component's `basicExample` into a snippet body: placeholders over
 * the markup text worth editing, `$0` where the cursor lands last.
 */
export function toSnippetBody(example: string, framework: Framework): string {
	const source =
		framework === "vue" ? unwrapVueTemplate(example) : example.trim();

	return withTabStops(
		tabIndented(source),
		EDITABLE_TEXT,
		(match, placeholder) => {
			const [, attributeValue, childText] = match;

			if (attributeValue !== undefined) {
				if (!attributeValue.trim() || CODE_LIKE.test(attributeValue))
					return undefined;
				return `="${placeholder(attributeValue)}"`;
			}

			// Element child: keep the surrounding whitespace literal so the tab
			// stop selects the words, not the padding.
			const [, lead, core, trail] = /^(\s*)(.*?)(\s*)$/.exec(childText)!;
			if (!core) return undefined;
			return `>${lead}${placeholder(core)}${trail}<`;
		},
	);
}

/**
 * Convert a hook's `basicExample` into a snippet body. Hook examples are
 * statements rather than markup, so the tab stops land on the arguments and
 * callbacks a user retypes — never on the identifiers they declare, which the
 * editor renames far better than a snippet can.
 */
export function toCodeSnippetBody(example: string): string {
	const text = tabIndented(demoTailToComment(example.trim()));

	return withTabStops(text, EDITABLE_CODE, (match, placeholder) => {
		if (isInLineComment(text, match.index)) return undefined;

		const [, arrow, callback, quoted, numeric] = match;
		if (callback !== undefined) return `${arrow}${placeholder(callback)}`;
		if (quoted !== undefined)
			return quoted.trim() ? `'${placeholder(quoted)}'` : undefined;
		if (numeric !== undefined) return placeholder(numeric);
		return undefined;
	});
}

/**
 * Convert a scaffold's source into a snippet body. A scaffold is a whole file,
 * read and edited as code, so it gets escaping and a final cursor position but
 * no tab stops — dozens of them would be hostile to tab through.
 */
export function toScaffoldBody(source: string): string {
	return `${escapeSnippetText(tabIndented(source.trim()))}$0`;
}
