// A minimal stand-in for the `vscode` module.
//
// The extension host supplies `vscode` at runtime, so it cannot be imported in
// a unit test. Vitest aliases the specifier to this file (see vitest.config.ts)
// so the editor-facing wiring — what the completion provider registers, what it
// hands back — is testable without launching an Extension Development Host.
// Only the surface the extension actually touches is implemented.

export class Position {
	constructor(
		readonly line: number,
		readonly character: number,
	) {}
}

export class Range {
	constructor(
		readonly start: Position,
		readonly end: Position,
	) {}
}

export enum CompletionItemKind {
	Snippet = 27,
}

export class CompletionItem {
	detail?: string;
	insertText?: unknown;
	documentation?: unknown;
	filterText?: string;
	sortText?: string;
	range?: unknown;
	additionalTextEdits?: unknown[];

	constructor(
		readonly label: string,
		readonly kind?: CompletionItemKind,
	) {}
}

export class SnippetString {
	constructor(readonly value: string) {}
}

export class MarkdownString {
	value = "";

	appendMarkdown(text: string): this {
		this.value += text;
		return this;
	}

	appendCodeblock(code: string, language: string): this {
		this.value += `\n\`\`\`${language}\n${code}\n\`\`\`\n`;
		return this;
	}
}

export const TextEdit = {
	insert(position: Position, newText: string) {
		return { position, newText };
	},
};

export enum StatusBarAlignment {
	Left = 1,
	Right = 2,
}

export interface Registration {
	selector: unknown;
	provider: {
		provideCompletionItems(document: unknown, position: Position): unknown;
		resolveCompletionItem?(item: unknown): unknown;
	};
}

/** Test-visible state; reset between cases with `__reset()`. */
export const __state = {
	registrations: [] as Registration[],
	configuration: new Map<string, unknown>(),
	workspaceFolder: undefined as { uri: { fsPath: string } } | undefined,
};

export function __reset(): void {
	__state.registrations = [];
	__state.configuration.clear();
	__state.workspaceFolder = undefined;
}

export const languages = {
	registerCompletionItemProvider(
		selector: unknown,
		provider: Registration["provider"],
	) {
		__state.registrations.push({ selector, provider });
		return { dispose() {} };
	},
};

export const workspace = {
	getConfiguration(section: string) {
		return {
			get<T>(key: string, fallback: T): T {
				const value = __state.configuration.get(`${section}.${key}`);
				return value === undefined ? fallback : (value as T);
			},
		};
	},
	getWorkspaceFolder() {
		return __state.workspaceFolder;
	},
};
