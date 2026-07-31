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

export interface FakeWorkspaceFolder {
	uri: { fsPath: string };
	name: string;
	index: number;
}

/** A message the extension showed, recorded rather than displayed. */
export interface ShownMessage {
	kind: "info" | "warning" | "error";
	message: string;
	options?: unknown;
	items: string[];
}

export interface FakeTerminal {
	name: string;
	cwd?: string;
	shown: boolean;
	sent: string[];
}

/** Test-visible state; reset between cases with `__reset()`. */
export const __state = {
	registrations: [] as Registration[],
	configuration: new Map<string, unknown>(),
	workspaceFolder: undefined as { uri: { fsPath: string } } | undefined,
	commands: new Map<string, (...args: unknown[]) => unknown>(),
	workspaceFolders: [] as FakeWorkspaceFolder[],
	messages: [] as ShownMessage[],
	terminals: [] as FakeTerminal[],
	openedDocuments: [] as string[],
	/** Answers a quick pick; returning undefined models a dismissal. */
	onQuickPick: undefined as
		| ((items: readonly unknown[], options?: unknown) => unknown)
		| undefined,
	/** Answers a message with buttons; returns the chosen item, or undefined. */
	onMessage: undefined as
		| ((message: ShownMessage) => string | undefined)
		| undefined,
	onWorkspaceFolderPick: undefined as
		| (() => FakeWorkspaceFolder | undefined)
		| undefined,
	/**
	 * Answers an input box. The stub runs the box's own `validateInput` over the
	 * answer and throws if it fails, so a test cannot feed the extension input a
	 * real user would have been blocked from entering.
	 */
	onInputBox: undefined as
		| ((options: InputBoxOptions) => string | undefined)
		| undefined,
};

export interface InputBoxOptions {
	title?: string;
	prompt?: string;
	value?: string;
	placeHolder?: string;
	validateInput?: (value: string) => string | undefined;
}

export function __reset(): void {
	__state.registrations = [];
	__state.configuration.clear();
	__state.workspaceFolder = undefined;
	__state.commands.clear();
	__state.workspaceFolders = [];
	__state.messages = [];
	__state.terminals = [];
	__state.openedDocuments = [];
	__state.onQuickPick = undefined;
	__state.onMessage = undefined;
	__state.onWorkspaceFolderPick = undefined;
	__state.onInputBox = undefined;
}

/** Invokes a registered command the way the command palette would. */
export async function __runCommand(id: string, ...args: unknown[]) {
	const handler = __state.commands.get(id);
	if (!handler) throw new Error(`command not registered: ${id}`);
	return handler(...args);
}

function show(
	kind: ShownMessage["kind"],
	message: string,
	...rest: unknown[]
): Promise<string | undefined> {
	// VS Code's overloads put an optional options object before the button
	// labels; both forms have to be understood to record the buttons.
	const options =
		rest.length > 0 && typeof rest[0] === "object" && rest[0] !== null
			? rest[0]
			: undefined;
	const items = (options === undefined ? rest : rest.slice(1)) as string[];

	const entry: ShownMessage = { kind, message, options, items };
	__state.messages.push(entry);
	return Promise.resolve(__state.onMessage?.(entry));
}

export const commands = {
	registerCommand(id: string, handler: (...args: unknown[]) => unknown) {
		__state.commands.set(id, handler);
		return {
			dispose() {
				__state.commands.delete(id);
			},
		};
	},
};

export const languages = {
	registerCompletionItemProvider(
		selector: unknown,
		provider: Registration["provider"],
	) {
		__state.registrations.push({ selector, provider });
		return { dispose() {} };
	},
};

export const window = {
	showInformationMessage: (message: string, ...rest: unknown[]) =>
		show("info", message, ...rest),
	showWarningMessage: (message: string, ...rest: unknown[]) =>
		show("warning", message, ...rest),
	showErrorMessage: (message: string, ...rest: unknown[]) =>
		show("error", message, ...rest),

	showQuickPick(items: readonly unknown[], options?: unknown) {
		return Promise.resolve(__state.onQuickPick?.(items, options));
	},

	showWorkspaceFolderPick() {
		return Promise.resolve(__state.onWorkspaceFolderPick?.());
	},

	showInputBox(options: InputBoxOptions = {}) {
		const answer = __state.onInputBox?.(options);
		if (answer === undefined) return Promise.resolve(undefined);

		const complaint = options.validateInput?.(answer);
		if (complaint)
			throw new Error(
				`input box rejected ${JSON.stringify(answer)}: ${complaint}`,
			);

		return Promise.resolve(answer);
	},

	createTerminal(options: { name: string; cwd?: string }) {
		const terminal: FakeTerminal = {
			name: options.name,
			cwd: options.cwd,
			shown: false,
			sent: [],
		};
		__state.terminals.push(terminal);
		return {
			show() {
				terminal.shown = true;
			},
			sendText(text: string) {
				terminal.sent.push(text);
			},
		};
	},

	showTextDocument(document: { fileName: string }) {
		__state.openedDocuments.push(document.fileName);
		return Promise.resolve({ document });
	},
};

export const workspace = {
	get workspaceFolders(): FakeWorkspaceFolder[] | undefined {
		return __state.workspaceFolders.length > 0
			? __state.workspaceFolders
			: undefined;
	},
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
	openTextDocument(fileName: string) {
		return Promise.resolve({ fileName });
	},
};
