// The `Wire UI: Add Component` command — prompts, then writes.
//
// The scaffold is authored *in* the Wire UI compound pattern rather than
// wrapping a catalog component: context + Root + parts, controllable state,
// `data-*` for every interactive state. Day 12's snippets already cover
// composing what the catalog ships; this covers writing your own primitive.

import * as fs from "node:fs";
import * as path from "node:path";
import * as vscode from "vscode";
import {
	FRAMEWORKS,
	type Framework,
} from "@wire-ui/typescript-plugin/metadata";
import { frameworkPackage, installedFrameworks } from "../init/detect.js";
import {
	splitParts,
	toPascalCase,
	validateComponentName,
	validatePartNames,
} from "./names.js";
import {
	componentDirectoryCandidates,
	describeAddComponentPlan,
	planAddComponent,
	type AddComponentPlan,
} from "./plan.js";

export const ADD_COMPONENT_COMMAND_ID = "wire-ui.addComponent";

/** Parts most compound components start from. */
const DEFAULT_PARTS = "Trigger, Content";

const BROWSE = "$(folder-opened) Another folder…";

export function registerAddComponentCommand(
	output: vscode.OutputChannel,
): vscode.Disposable {
	return vscode.commands.registerCommand(ADD_COMPONENT_COMMAND_ID, () =>
		runAddComponent(output),
	);
}

export async function runAddComponent(
	output: vscode.OutputChannel,
): Promise<void> {
	const folder = await pickWorkspaceFolder();
	if (!folder) {
		void vscode.window.showErrorMessage(
			"Wire UI: open a folder before adding a component.",
		);
		return;
	}
	const root = folder.uri.fsPath;

	const framework = await pickFramework(readManifest(root));
	if (!framework) return;

	const rawName = await vscode.window.showInputBox({
		title: "Wire UI: Add Component",
		prompt: "Component name — PascalCase; spaces and dashes are converted",
		placeHolder: "RatingStars",
		validateInput: (value) => validateComponentName(toPascalCase(value)),
	});
	if (rawName === undefined) return;
	const name = toPascalCase(rawName);

	const rawParts = await vscode.window.showInputBox({
		title: `Wire UI: Add Component — ${name}`,
		prompt: "Parts besides Root, comma separated",
		value: DEFAULT_PARTS,
		validateInput: validatePartNames,
	});
	if (rawParts === undefined) return;
	const parts = splitParts(rawParts);

	const directory = await pickDirectory(root);
	if (!directory) return;

	const plan = planAddComponent({
		name,
		parts,
		framework,
		directory,
		fileExists: (relativePath) =>
			fs.existsSync(path.join(root, ...relativePath.split("/"))),
	});

	if (plan.conflicts.length > 0) {
		void vscode.window.showErrorMessage(
			`Wire UI: ${plan.conflicts.join(", ")} already exists. Pick another name or folder.`,
		);
		return;
	}

	const proceed = "Create component";
	const choice = await vscode.window.showInformationMessage(
		`Create ${name} in ${plan.componentDirectory}?`,
		{ modal: true, detail: describeAddComponentPlan(plan) },
		proceed,
	);
	if (choice !== proceed) return;

	try {
		writePlan(root, plan);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		output.appendLine(`Add Component failed: ${message}`);
		void vscode.window.showErrorMessage(
			`Wire UI: could not write ${name} — ${message}`,
		);
		return;
	}

	output.appendLine(
		`Add Component: wrote ${plan.files.length} files to ${plan.componentDirectory}`,
	);

	await openFile(path.join(root, ...plan.primaryFile.split("/")));
	void vscode.window.showInformationMessage(
		`Wire UI: created ${name} (${["Root", ...parts].join(", ")}).`,
	);
}

/** Writes every file in the plan, creating directories as needed. */
export function writePlan(root: string, plan: AddComponentPlan): void {
	for (const file of plan.files) {
		const target = path.join(root, ...file.path.split("/"));
		fs.mkdirSync(path.dirname(target), { recursive: true });
		fs.writeFileSync(target, file.contents, "utf8");
	}
}

async function pickWorkspaceFolder(): Promise<
	vscode.WorkspaceFolder | undefined
> {
	const folders = vscode.workspace.workspaceFolders ?? [];
	if (folders.length === 0) return undefined;
	if (folders.length === 1) return folders[0];
	return vscode.window.showWorkspaceFolderPick({
		placeHolder: "Which folder should the component go in?",
	});
}

function readManifest(root: string): unknown {
	try {
		return JSON.parse(
			fs.readFileSync(path.join(root, "package.json"), "utf8"),
		);
	} catch {
		return undefined;
	}
}

/**
 * Which framework to write for. Unlike Init this cannot fall back to a default:
 * the three scaffolds are not interchangeable, so an ambiguous workspace asks.
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
				? `${frameworkPackage(framework)} — installed`
				: frameworkPackage(framework),
			framework,
		})),
		{ placeHolder: "Which framework should the component be written for?" },
	);

	return picked?.framework;
}

async function pickDirectory(root: string): Promise<string | undefined> {
	const candidates = componentDirectoryCandidates((relativePath) => {
		const target = path.join(root, ...relativePath.split("/"));
		return fs.existsSync(target) && fs.statSync(target).isDirectory();
	});

	const picked = await vscode.window.showQuickPick(
		[...candidates.map((label) => ({ label })), { label: BROWSE }],
		{ placeHolder: "Where should the component go?" },
	);
	if (!picked) return undefined;
	if (picked.label !== BROWSE) return picked.label;

	const typed = await vscode.window.showInputBox({
		title: "Wire UI: Add Component",
		prompt: "Folder, relative to the workspace root",
		value: candidates[0],
		validateInput: (value) =>
			value.trim() === "" ? "Enter a folder." : undefined,
	});
	return typed?.trim() || undefined;
}

async function openFile(fsPath: string): Promise<void> {
	try {
		const document = await vscode.workspace.openTextDocument(fsPath);
		await vscode.window.showTextDocument(document, { preview: false });
	} catch {
		// Opening the file is a convenience; failing to is not worth an error.
	}
}
