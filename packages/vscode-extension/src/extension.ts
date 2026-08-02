import * as vscode from "vscode";
import { registerAddComponentCommand } from "./add-component/index.js";
import { registerInitCommand } from "./init/index.js";
import { registerMcpStatus } from "./mcp/index.js";
import { registerOpenPlaygroundCommand } from "./playground/index.js";
import { registerSnippetCompletions } from "./snippets/index.js";

// The plugin's *shipped* module name, which is what tsserver loaded it under
// and therefore the only key `configurePlugin` answers to. It is deliberately
// not `@wire-ui/typescript-plugin` — see scripts/ts-plugin-pack.mjs. Must stay
// equal to `contributes.typescriptServerPlugins[0].name`; a test asserts it.
const TS_PLUGIN_ID = "wire-ui-typescript-plugin-pack";
const TS_EXTENSION_ID = "vscode.typescript-language-features";

let output: vscode.OutputChannel | undefined;

export async function activate(
	context: vscode.ExtensionContext,
): Promise<void> {
	output = vscode.window.createOutputChannel("Wire UI");
	context.subscriptions.push(output);
	output.appendLine("Wire UI extension activated.");

	context.subscriptions.push(
		vscode.commands.registerCommand("wire-ui.showOutput", () =>
			output?.show(true),
		),
	);

	// The status bar item lives here: it reports MCP presence, and its own
	// command is what the click opens.
	context.subscriptions.push(registerMcpStatus(output));

	context.subscriptions.push(registerSnippetCompletions(output));
	context.subscriptions.push(registerInitCommand(output));
	context.subscriptions.push(registerAddComponentCommand(output));
	context.subscriptions.push(registerOpenPlaygroundCommand(output));

	await configureTypeScriptPlugin(output);
}

export function deactivate(): void {
	// Disposables registered on `context.subscriptions` are cleaned up by VS Code;
	// nothing else to tear down yet.
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
