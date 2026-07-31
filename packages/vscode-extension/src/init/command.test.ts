import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
	__reset,
	__runCommand,
	__state,
	type ShownMessage,
} from "../test/vscode.js";
import { INIT_COMMAND_ID, registerInitCommand } from "./command.js";

// Init's whole job is to change a folder on disk, so these run against a real
// temporary one. Only the dialogs are stubbed.

let root: string;

const output = {
	appendLine() {},
	show() {},
	dispose() {},
} as unknown as import("vscode").OutputChannel;

/** Answers the confirmation dialog by clicking its one action button. */
function acceptDialogs(): void {
	__state.onMessage = (message: ShownMessage) => message.items[0];
}

function useWorkspace(fsPath: string, name = "my-app"): void {
	__state.workspaceFolders = [{ uri: { fsPath }, name, index: 0 }];
}

function write(relativePath: string, contents: string): void {
	const target = path.join(root, ...relativePath.split("/"));
	fs.mkdirSync(path.dirname(target), { recursive: true });
	fs.writeFileSync(target, contents, "utf8");
}

function read(relativePath: string): string {
	return fs.readFileSync(path.join(root, ...relativePath.split("/")), "utf8");
}

function exists(relativePath: string): boolean {
	return fs.existsSync(path.join(root, ...relativePath.split("/")));
}

function messagesOfKind(kind: ShownMessage["kind"]): ShownMessage[] {
	return __state.messages.filter((message) => message.kind === kind);
}

beforeEach(() => {
	__reset();
	root = fs.mkdtempSync(path.join(os.tmpdir(), "wire-ui-init-"));
	registerInitCommand(output);
});

afterEach(() => {
	fs.rmSync(root, { recursive: true, force: true });
});

describe("registration", () => {
	it("registers under the id the manifest contributes", () => {
		expect(__state.commands.has(INIT_COMMAND_ID)).toBe(true);
		expect(INIT_COMMAND_ID).toBe("wire-ui.init");
	});
});

describe("an empty workspace", () => {
	// The Day 14 exit criterion: empty folder in, working Wire UI setup out.
	it("gets a manifest, a stylesheet, and an install", async () => {
		useWorkspace(root);
		__state.onQuickPick = (items) => items[0]; // react
		acceptDialogs();

		await __runCommand(INIT_COMMAND_ID);

		const manifest = JSON.parse(read("package.json"));
		expect(manifest.name).toBe("my-app");
		expect(manifest.private).toBe(true);

		expect(read("wire-ui.css")).toContain("[data-hover]");

		expect(__state.terminals).toHaveLength(1);
		expect(__state.terminals[0].name).toBe("Wire UI");
		expect(__state.terminals[0].cwd).toBe(root);
		expect(__state.terminals[0].shown).toBe(true);
		expect(__state.terminals[0].sent).toEqual([
			"npm install @wire-ui/react react@^19 react-dom@^19",
		]);
	});

	it("opens the stylesheet and says how to import it", async () => {
		useWorkspace(root);
		__state.onQuickPick = (items) => items[0];
		acceptDialogs();

		await __runCommand(INIT_COMMAND_ID);

		expect(__state.openedDocuments).toEqual([
			path.join(root, "wire-ui.css"),
		]);
		const last = __state.messages.at(-1)!;
		expect(last.message).toContain('import "./wire-ui.css";');
	});
});

describe("an existing project", () => {
	it("uses the workspace's package manager and src/ directory", async () => {
		useWorkspace(root);
		write(
			"package.json",
			JSON.stringify({
				name: "app",
				dependencies: { react: "^19.1.0", "react-dom": "^19.1.0" },
			}),
		);
		write("pnpm-lock.yaml", "");
		fs.mkdirSync(path.join(root, "src"));
		__state.onQuickPick = (items) => items[0];
		acceptDialogs();

		await __runCommand(INIT_COMMAND_ID);

		expect(__state.terminals[0].sent).toEqual(["pnpm add @wire-ui/react"]);
		expect(exists("src/wire-ui.css")).toBe(true);
		expect(exists("wire-ui.css")).toBe(false);
	});

	it("leaves an existing package.json untouched", async () => {
		useWorkspace(root);
		const original = JSON.stringify({ name: "keep-me", version: "2.0.0" });
		write("package.json", original);
		__state.onQuickPick = (items) => items[0];
		acceptDialogs();

		await __runCommand(INIT_COMMAND_ID);

		expect(read("package.json")).toBe(original);
	});

	it("picks the framework itself when the workspace already has one", async () => {
		useWorkspace(root);
		write(
			"package.json",
			JSON.stringify({ dependencies: { "@wire-ui/vue": "^0.5.0" } }),
		);
		let quickPickShown = false;
		__state.onQuickPick = (items) => {
			quickPickShown = true;
			return items[0];
		};
		acceptDialogs();

		await __runCommand(INIT_COMMAND_ID);

		expect(quickPickShown).toBe(false);
		// @wire-ui/vue is already declared, so only the missing peer is installed.
		expect(__state.terminals[0].sent).toEqual(["npm install vue@^3.5"]);
	});

	it("never overwrites a stylesheet that is already there", async () => {
		useWorkspace(root);
		write(
			"package.json",
			JSON.stringify({ dependencies: { "@wire-ui/react": "^0.5.0" } }),
		);
		write("wire-ui.css", "/* mine */\n");
		acceptDialogs();

		await __runCommand(INIT_COMMAND_ID);

		expect(read("wire-ui.css")).toBe("/* mine */\n");
	});

	it("does nothing but offer the stylesheet when already set up", async () => {
		useWorkspace(root);
		write(
			"package.json",
			JSON.stringify({
				dependencies: {
					"@wire-ui/react": "^0.5.0",
					react: "^19.1.0",
					"react-dom": "^19.1.0",
				},
			}),
		);
		write("wire-ui.css", "/* mine */\n");
		__state.onMessage = () => undefined; // Dismiss the "already set up" notice.

		await __runCommand(INIT_COMMAND_ID);

		expect(__state.terminals).toHaveLength(0);
		expect(__state.messages).toHaveLength(1);
		expect(__state.messages[0].message).toContain("already set up");
	});
});

describe("bailing out", () => {
	it("writes nothing when the confirmation is dismissed", async () => {
		useWorkspace(root);
		__state.onQuickPick = (items) => items[0];
		__state.onMessage = () => undefined; // Dismissed.

		await __runCommand(INIT_COMMAND_ID);

		expect(exists("package.json")).toBe(false);
		expect(exists("wire-ui.css")).toBe(false);
		expect(__state.terminals).toHaveLength(0);
	});

	it("writes nothing when the framework pick is dismissed", async () => {
		useWorkspace(root);
		__state.onQuickPick = () => undefined;

		await __runCommand(INIT_COMMAND_ID);

		expect(exists("wire-ui.css")).toBe(false);
		expect(__state.messages).toHaveLength(0);
	});

	it("asks for a folder before doing anything", async () => {
		await __runCommand(INIT_COMMAND_ID);

		expect(messagesOfKind("error")).toHaveLength(1);
		expect(messagesOfKind("error")[0].message).toContain("open a folder");
		expect(__state.terminals).toHaveLength(0);
	});
});
