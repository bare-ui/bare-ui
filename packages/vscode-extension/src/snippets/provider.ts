// The VS Code surface for component snippets.
//
// Everything decision-shaped lives in the sibling pure modules; this file only
// translates between them and the editor API. Snippets are served as completion
// items rather than a static `contributes.snippets` file so they can pick the
// right framework's syntax per document and bring their own import.

import * as fs from "node:fs";
import * as path from "node:path";
import * as vscode from "vscode";
import { getComponentSnippets } from "./build.js";
import {
	SNIPPET_LANGUAGES,
	detectFramework,
	frameworksFromPackageJson,
	isInVueTemplate,
	planImportEdit,
} from "./context.js";
import type { WireSnippet } from "./types.js";
import type { Framework } from "@wire-ui/typescript-plugin/metadata";

/** Matches the partial prefix a user types (`wire`, `wire-mod`, `wire-modal`). */
const PREFIX_PATTERN = /wire[-\w]*/;

/** Carries the snippet and its document through to `resolveCompletionItem`. */
class WireSnippetItem extends vscode.CompletionItem {
	constructor(
		readonly snippet: WireSnippet,
		readonly document: vscode.TextDocument,
	) {
		super(snippet.prefix, vscode.CompletionItemKind.Snippet);
	}
}

export function registerSnippetCompletions(
	log: vscode.OutputChannel,
): vscode.Disposable {
	const provider = new WireSnippetProvider(log);
	const disposable = vscode.languages.registerCompletionItemProvider(
		SNIPPET_LANGUAGES.map((language) => ({ scheme: "file", language })),
		provider,
	);
	log.appendLine(
		`Registered component snippets for ${getComponentSnippets("react").length} components.`,
	);
	return disposable;
}

class WireSnippetProvider implements vscode.CompletionItemProvider<WireSnippetItem> {
	constructor(private readonly log: vscode.OutputChannel) {}

	provideCompletionItems(
		document: vscode.TextDocument,
		position: vscode.Position,
	): WireSnippetItem[] {
		try {
			const config = vscode.workspace.getConfiguration("wire-ui");
			if (!config.get<boolean>("enable", true)) return [];

			const text = document.getText();
			if (
				document.languageId === "vue" &&
				!isInVueTemplate(text, document.offsetAt(position))
			)
				return [];

			const framework = detectFramework({
				languageId: document.languageId,
				documentText: text,
				workspaceFrameworks: workspaceFrameworks(document),
			});
			const range = document.getWordRangeAtPosition(
				position,
				PREFIX_PATTERN,
			);

			return getComponentSnippets(framework).map((snippet) =>
				toCompletionItem(snippet, document, range),
			);
		} catch (error) {
			this.log.appendLine(`Snippet completion failed: ${message(error)}`);
			return [];
		}
	}

	// The import edit is per-item and needs a document scan, so it is computed
	// only for the item the user actually lands on.
	resolveCompletionItem(item: WireSnippetItem): WireSnippetItem {
		try {
			const config = vscode.workspace.getConfiguration("wire-ui");
			if (!config.get<boolean>("snippets.autoImport", true)) return item;

			const edit = planImportEdit({
				text: item.document.getText(),
				languageId: item.document.languageId,
				component: item.snippet.component,
				moduleId: item.snippet.moduleId,
			});
			if (edit)
				item.additionalTextEdits = [
					vscode.TextEdit.insert(
						item.document.positionAt(edit.offset),
						edit.newText,
					),
				];
		} catch (error) {
			this.log.appendLine(`Snippet import failed: ${message(error)}`);
		}
		return item;
	}
}

function toCompletionItem(
	snippet: WireSnippet,
	document: vscode.TextDocument,
	range: vscode.Range | undefined,
): WireSnippetItem {
	const item = new WireSnippetItem(snippet, document);
	item.detail = `Wire UI · ${snippet.component}`;
	item.insertText = new vscode.SnippetString(snippet.body);
	item.documentation = documentationFor(snippet);
	item.filterText = snippet.prefix;
	// Group the whole set together, above alphabetical neighbours.
	item.sortText = `01_wire_${snippet.prefix}`;
	if (range) item.range = range;
	return item;
}

function documentationFor(snippet: WireSnippet): vscode.MarkdownString {
	const markdown = new vscode.MarkdownString();
	markdown.appendMarkdown(`${snippet.description}\n\n`);
	markdown.appendCodeblock(snippet.importStatement, "ts");
	markdown.appendMarkdown(`\n[Documentation](${snippet.docsUrl})`);
	return markdown;
}

function workspaceFrameworks(
	document: vscode.TextDocument,
): Framework[] | undefined {
	const folder = vscode.workspace.getWorkspaceFolder(document.uri);
	if (!folder) return undefined;
	return manifestFrameworks(folder);
}

// One filesystem read per workspace folder; the answer changes about as often as
// the project's dependencies do.
const manifestCache = new Map<string, Framework[]>();

function manifestFrameworks(folder: vscode.WorkspaceFolder): Framework[] {
	const key = folder.uri.toString();
	const cached = manifestCache.get(key);
	if (cached) return cached;

	let frameworks: Framework[] = [];
	try {
		const manifest = fs.readFileSync(
			path.join(folder.uri.fsPath, "package.json"),
			"utf8",
		);
		frameworks = frameworksFromPackageJson(JSON.parse(manifest));
	} catch {
		// No manifest, or an unreadable one — fall back to the language default.
	}
	manifestCache.set(key, frameworks);
	return frameworks;
}

function message(error: unknown): string {
	return error instanceof Error ? error.message : String(error);
}
