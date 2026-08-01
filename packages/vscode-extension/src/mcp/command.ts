// The editor-facing half of MCP detection: a status bar item that reflects
// whether `@wire-ui/mcp` is present in the workspace, and the command behind it.
//
// Detection is re-run when the files it read change — a `package.json` or an
// MCP config — so installing or configuring the server updates the status bar
// without a reload. In a multi-root workspace the *best* state wins: a monorepo
// where one package configures the server is a workspace where the AI assistant
// has the catalog, which is the only thing the item is claiming.

import * as fs from "node:fs";
import * as path from "node:path";
import * as vscode from "vscode";
import {
	detectMcp,
	isConfigured,
	MCP_CONFIG_FILES,
	MCP_PACKAGE,
	parseJsonc,
	wireUiServerSnippet,
	type McpDetection,
	type McpSnapshot,
} from "./detect.js";
import {
	describeMcpDetails,
	describeMcpStatus,
	mcpState,
	type McpState,
} from "./status.js";

export const MCP_STATUS_COMMAND_ID = "wire-ui.mcpStatus";
export const SHOW_OUTPUT_COMMAND_ID = "wire-ui.showOutput";

/** Best-state-wins ordering for multi-root workspaces. */
const RANK: Record<McpState, number> = {
	absent: 0,
	installed: 1,
	configured: 2,
};

/**
 * Creates the status bar item, keeps it current, and registers the command it
 * points at. The returned disposable tears down all of it.
 */
export function registerMcpStatus(
	output: vscode.OutputChannel,
): vscode.Disposable {
	const item = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Right,
		100,
	);
	item.command = MCP_STATUS_COMMAND_ID;
	item.show();

	let detection = detectWorkspaceMcp();
	apply(item, detection);
	logDetection(output, detection);

	const refresh = (): void => {
		const next = detectWorkspaceMcp();
		if (sameDetection(detection, next)) return;
		detection = next;
		apply(item, detection);
		logDetection(output, detection);
	};

	const disposables: vscode.Disposable[] = [
		item,
		vscode.commands.registerCommand(MCP_STATUS_COMMAND_ID, () =>
			showMcpStatus(detection),
		),
		vscode.workspace.onDidChangeWorkspaceFolders(refresh),
		...watchWorkspace(refresh),
	];

	return vscode.Disposable.from(...disposables);
}

function apply(item: vscode.StatusBarItem, detection: McpDetection): void {
	const presentation = describeMcpStatus(detection);
	item.text = presentation.text;
	item.tooltip = presentation.tooltip;
}

function logDetection(
	output: vscode.OutputChannel,
	detection: McpDetection,
): void {
	output.appendLine(
		`MCP: ${mcpState(detection)}${
			detection.installedVia ? ` (${detection.installedVia})` : ""
		}${
			isConfigured(detection)
				? ` — ${detection.configuredIn.join(", ")}`
				: ""
		}`,
	);
}

/** Detection across every workspace folder, best state first. */
export function detectWorkspaceMcp(): McpDetection {
	const folders = vscode.workspace.workspaceFolders ?? [];
	const detections = folders.map((folder) =>
		detectMcp(readMcpSnapshot(folder.uri.fsPath)),
	);

	let best: McpDetection = { installed: false, configuredIn: [] };
	for (const detection of detections)
		if (RANK[mcpState(detection)] > RANK[mcpState(best)]) best = detection;

	return best;
}

/** Everything `detectMcp` needs, read in one pass over a workspace folder. */
export function readMcpSnapshot(root: string): McpSnapshot {
	let manifest: unknown;
	try {
		manifest = JSON.parse(
			fs.readFileSync(path.join(root, "package.json"), "utf8"),
		);
	} catch {
		// Absent or malformed: treated as declaring nothing.
	}

	const configs = MCP_CONFIG_FILES.map((relativePath) => {
		let contents: unknown;
		try {
			contents = parseJsonc(
				fs.readFileSync(
					path.join(root, ...relativePath.split("/")),
					"utf8",
				),
			);
		} catch {
			// Absent or unreadable.
		}
		return { path: relativePath, contents };
	});

	return {
		manifest,
		hasPackageDirectory: fs.existsSync(
			path.join(root, "node_modules", ...MCP_PACKAGE.split("/")),
		),
		configs,
	};
}

/**
 * One watcher per folder over exactly the files detection reads. `package.json`
 * is matched at the folder root only — a watcher over `**​/package.json` in a
 * repo with a populated `node_modules` is a lot of file events for a status bar
 * icon.
 */
function watchWorkspace(refresh: () => void): vscode.Disposable[] {
	const folders = vscode.workspace.workspaceFolders ?? [];
	return folders.map((folder) => {
		const watcher = vscode.workspace.createFileSystemWatcher(
			new vscode.RelativePattern(
				folder,
				`{package.json,${MCP_CONFIG_FILES.join(",")}}`,
			),
		);
		watcher.onDidCreate(refresh);
		watcher.onDidChange(refresh);
		watcher.onDidDelete(refresh);
		return watcher;
	});
}

function sameDetection(a: McpDetection, b: McpDetection): boolean {
	return (
		a.installed === b.installed &&
		a.installedVia === b.installedVia &&
		a.configuredIn.join("|") === b.configuredIn.join("|")
	);
}

/**
 * What clicking the item does: says what was detected and, when nothing
 * registers the server, hands over a config snippet rather than writing one —
 * which client file it belongs in is the user's call, and the three candidates
 * disagree on both location and key.
 */
export async function showMcpStatus(detection: McpDetection): Promise<void> {
	// A notification, not a modal: this is informational and unasked-for. That
	// rules out `detail`, which only renders in modal dialogs — the lines are
	// joined into the message instead.
	const message = `Wire UI MCP — ${describeMcpDetails(detection).join(" ")}`;

	const copyVsCode = "Copy config (VS Code)";
	const copyClaude = "Copy config (Claude Code / Cursor)";
	const showLog = "Show Log";

	const actions = isConfigured(detection)
		? [showLog]
		: [copyVsCode, copyClaude, showLog];

	const choice = await vscode.window.showInformationMessage(
		message,
		...actions,
	);

	if (choice === showLog) {
		await vscode.commands.executeCommand(SHOW_OUTPUT_COMMAND_ID);
		return;
	}

	if (choice === copyVsCode || choice === copyClaude) {
		const key = choice === copyVsCode ? "servers" : "mcpServers";
		const target =
			choice === copyVsCode
				? ".vscode/mcp.json"
				: ".mcp.json (or .cursor/mcp.json)";
		await vscode.env.clipboard.writeText(wireUiServerSnippet(key));
		void vscode.window.showInformationMessage(
			`Wire UI: MCP config copied — paste it into ${target}.`,
		);
	}
}
