// The `Wire UI: Init` command — the editor-facing half of Init.
//
// All of the deciding lives in `plan.ts`; this module does I/O and dialogs. It
// reads the workspace, asks for a framework, shows the plan, writes the files,
// and hands the install to a terminal.
//
// The install runs in a visible terminal rather than a spawned process on
// purpose: registry auth prompts, proxy failures and 2FA all need somewhere to
// talk to the user, and a package install is exactly the operation people want
// to watch. The cost is that the exit code is not observable, so nothing here
// waits on the install — the files are written first and stand on their own.

import * as fs from "node:fs";
import * as path from "node:path";
import * as vscode from "vscode";
import {
	FRAMEWORKS,
	type Framework,
} from "@wire-ui/typescript-plugin/metadata";
import { frameworkPackage, installedFrameworks } from "./detect.js";
import {
	describePlan,
	minimalManifest,
	planInit,
	type InitPlan,
	type WorkspaceSnapshot,
} from "./plan.js";
import { starterThemeCss, themeImportHint } from "./theme.js";

export const INIT_COMMAND_ID = "wire-ui.init";

/** Registers the command; the returned disposable unregisters it. */
export function registerInitCommand(
	output: vscode.OutputChannel,
): vscode.Disposable {
	return vscode.commands.registerCommand(INIT_COMMAND_ID, () =>
		runInit(output),
	);
}

export async function runInit(output: vscode.OutputChannel): Promise<void> {
	const folder = await pickWorkspaceFolder();
	if (!folder) {
		void vscode.window.showErrorMessage(
			"Wire UI: open a folder before running Init.",
		);
		return;
	}

	const root = folder.uri.fsPath;
	const snapshot = readWorkspace(root);

	const framework = await pickFramework(snapshot.manifest);
	if (!framework) return; // Dismissed.

	const plan = planInit(snapshot, framework);
	output.appendLine(
		`Init: ${framework}, ${plan.packageManager.manager} (${plan.packageManager.source})`,
	);

	if (plan.isNoop) {
		const open = "Open stylesheet";
		const choice = await vscode.window.showInformationMessage(
			`Wire UI is already set up in this workspace (${frameworkPackage(framework)}, ${plan.theme.path}).`,
			open,
		);
		if (choice === open) await openFile(path.join(root, plan.theme.path));
		return;
	}

	const proceed = await confirm(plan);
	if (!proceed) return;

	try {
		applyPlan(root, folder.name, plan, output);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		output.appendLine(`Init failed: ${message}`);
		void vscode.window.showErrorMessage(
			`Wire UI: Init failed — ${message}`,
		);
		return;
	}

	if (plan.installCommand) runInstall(plan.installCommand, root);

	if (plan.theme.action === "create") {
		await openFile(path.join(root, plan.theme.path));
		void vscode.window.showInformationMessage(
			`Wire UI: ready. ${themeImportHint(framework, plan.theme.path)}`,
		);
	} else {
		void vscode.window.showInformationMessage("Wire UI: ready.");
	}
}

/** The folder to initialise — prompting only when the workspace has several. */
async function pickWorkspaceFolder(): Promise<
	vscode.WorkspaceFolder | undefined
> {
	const folders = vscode.workspace.workspaceFolders ?? [];
	if (folders.length === 0) return undefined;
	if (folders.length === 1) return folders[0];
	return vscode.window.showWorkspaceFolderPick({
		placeHolder: "Which folder should Wire UI be set up in?",
	});
}

/** Everything `planInit` needs, read in one pass over the workspace root. */
export function readWorkspace(root: string): WorkspaceSnapshot {
	const rootFiles: string[] = [];
	const rootDirectories: string[] = [];

	try {
		for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
			if (entry.isDirectory()) rootDirectories.push(entry.name);
			else rootFiles.push(entry.name);
		}
	} catch {
		// An unreadable root is handled as an empty one; the write below will
		// surface the real error with a better message than a listing would.
	}

	const manifestPath = path.join(root, "package.json");
	const hasManifest = rootFiles.includes("package.json");
	let manifest: unknown;
	if (hasManifest) {
		try {
			manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
		} catch {
			// Malformed package.json: treat it as declaring nothing, but keep
			// `hasManifest` true so Init never overwrites it.
		}
	}

	return {
		rootFiles,
		rootDirectories,
		manifest,
		hasManifest,
		fileExists: (relativePath) =>
			fs.existsSync(path.join(root, ...relativePath.split("/"))),
	};
}

/**
 * Which framework to set up. A workspace that already depends on exactly one
 * Wire UI package answers the question itself; otherwise the user picks, with
 * anything already installed listed first.
 */
async function pickFramework(
	manifest: unknown,
): Promise<Framework | undefined> {
	const installed = installedFrameworks(manifest);
	if (installed.length === 1) return installed[0];

	const ordered = [
		...installed,
		...FRAMEWORKS.filter((framework) => !installed.includes(framework)),
	];

	const picked = await vscode.window.showQuickPick(
		ordered.map((framework) => ({
			label: framework,
			description: installed.includes(framework)
				? `${frameworkPackage(framework)} — already installed`
				: frameworkPackage(framework),
			framework,
		})),
		{ placeHolder: "Which Wire UI package should this workspace use?" },
	);

	return picked?.framework;
}

async function confirm(plan: InitPlan): Promise<boolean> {
	const steps = describePlan(plan)
		.map((line) => `• ${line}`)
		.join("\n");

	const proceed = "Set up Wire UI";
	const choice = await vscode.window.showInformationMessage(
		"Wire UI: Init",
		{ modal: true, detail: steps },
		proceed,
	);
	return choice === proceed;
}

/**
 * The file-writing half of the plan. Throws on write failure so the caller can
 * report it before a terminal is opened for an install that would land in a
 * half-set-up workspace.
 */
export function applyPlan(
	root: string,
	folderName: string,
	plan: InitPlan,
	output: vscode.OutputChannel,
): void {
	if (plan.createsManifest) {
		fs.writeFileSync(
			path.join(root, "package.json"),
			minimalManifest(folderName),
			"utf8",
		);
		output.appendLine("Init: wrote package.json");
	}

	if (plan.theme.action === "create") {
		const target = path.join(root, ...plan.theme.path.split("/"));
		fs.mkdirSync(path.dirname(target), { recursive: true });
		fs.writeFileSync(target, starterThemeCss(), "utf8");
		output.appendLine(`Init: wrote ${plan.theme.path}`);
	}
}

function runInstall(command: string, cwd: string): void {
	const terminal = vscode.window.createTerminal({ name: "Wire UI", cwd });
	terminal.show();
	terminal.sendText(command);
}

async function openFile(fsPath: string): Promise<void> {
	try {
		const document = await vscode.workspace.openTextDocument(fsPath);
		await vscode.window.showTextDocument(document, { preview: false });
	} catch {
		// Opening the file is a convenience; failing to is not worth an error.
	}
}
