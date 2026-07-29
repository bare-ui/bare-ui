import * as vscode from "vscode";
import { registerSnippetCompletions } from "./snippets/index.js";

const TS_PLUGIN_ID = "@wire-ui/typescript-plugin";
const TS_EXTENSION_ID = "vscode.typescript-language-features";

let output: vscode.OutputChannel | undefined;
let statusBar: vscode.StatusBarItem | undefined;

export async function activate(
	context: vscode.ExtensionContext,
): Promise<void> {
	output = vscode.window.createOutputChannel("Wire UI");
	context.subscriptions.push(output);
	output.appendLine("Wire UI extension activated.");

	statusBar = createStatusBar();
	context.subscriptions.push(statusBar);

	context.subscriptions.push(
		vscode.commands.registerCommand("wire-ui.showOutput", () =>
			output?.show(true),
		),
	);

	context.subscriptions.push(registerSnippetCompletions(output));

	await configureTypeScriptPlugin(output);
}

export function deactivate(): void {
	// Disposables registered on `context.subscriptions` are cleaned up by VS Code;
	// nothing else to tear down yet.
}

function createStatusBar(): vscode.StatusBarItem {
	const item = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Right,
		100,
	);
	item.text = "$(symbol-misc) Wire UI";
	item.tooltip = "Wire UI — click to open the log";
	item.command = "wire-ui.showOutput";
	item.show();
	return item;
}

/**
 * Hand the TypeScript Language Service plugin its configuration. The plugin is
 * *loaded* by VS Code's TS extension from the manifest; this only establishes
 * the live config channel (`configurePlugin`) so later days can push settings
 * (enabled rules, trace level, …) without a reload. Best-effort: if the TS
 * extension or its API is unavailable, the plugin still loads with defaults.
 */
async function configureTypeScriptPlugin(
	log: vscode.OutputChannel,
): Promise<void> {
	try {
		const tsExtension = vscode.extensions.getExtension(TS_EXTENSION_ID);
		if (!tsExtension) {
			log.appendLine(
				"TypeScript extension not found; skipping plugin configuration.",
			);
			return;
		}
		await tsExtension.activate();

		const api = tsExtension.exports?.getAPI?.(0);
		if (!api) {
			log.appendLine(
				"TypeScript API unavailable; plugin loads with defaults.",
			);
			return;
		}

		api.configurePlugin(TS_PLUGIN_ID, {});
		log.appendLine(`Configured TypeScript plugin "${TS_PLUGIN_ID}".`);
	} catch (error) {
		log.appendLine(
			`Failed to configure TypeScript plugin: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}
