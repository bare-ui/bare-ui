import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
	__fireWatchers,
	__fireWorkspaceFoldersChanged,
	__reset,
	__runCommand,
	__state,
	__statusBarItem,
	type ShownMessage,
} from "../test/vscode.js";
import { MCP_PACKAGE } from "./detect.js";
import { MCP_STATUS_COMMAND_ID, registerMcpStatus } from "./command.js";

// Detection reads real files, so these run against a real temporary workspace.
// Only the editor surface — status bar, watchers, dialogs — is stubbed.

let root: string;

const output = {
	appendLine() {},
	show() {},
	dispose() {},
} as unknown as import("vscode").OutputChannel;

function useWorkspace(...roots: string[]): void {
	__state.workspaceFolders = roots.map((fsPath, index) => ({
		uri: { fsPath },
		name: path.basename(fsPath),
		index,
	}));
}

function write(relativePath: string, contents: string, at = root): void {
	const target = path.join(at, ...relativePath.split("/"));
	fs.mkdirSync(path.dirname(target), { recursive: true });
	fs.writeFileSync(target, contents, "utf8");
}

/** The `npx` config every client doc shows, under the given key. */
function serverConfig(key: "servers" | "mcpServers"): string {
	return JSON.stringify({
		[key]: { "wire-ui": { command: "npx", args: [MCP_PACKAGE] } },
	});
}

function lastMessage(): ShownMessage {
	const message = __state.messages.at(-1);
	if (!message) throw new Error("no message shown");
	return message;
}

/** Clicks the button whose label matches, or fails if it was never offered. */
function clickButton(label: string): void {
	__state.onMessage = (message: ShownMessage) => {
		if (!message.items.includes(label)) return undefined;
		return label;
	};
}

beforeEach(() => {
	__reset();
	root = fs.mkdtempSync(path.join(os.tmpdir(), "wire-ui-mcp-"));
	useWorkspace(root);
});

afterEach(() => {
	fs.rmSync(root, { recursive: true, force: true });
});

describe("registerMcpStatus", () => {
	it("shows an item that opens the status command", () => {
		registerMcpStatus(output);

		const item = __statusBarItem();
		expect(item.shown).toBe(true);
		expect(item.command).toBe(MCP_STATUS_COMMAND_ID);
		expect(item.text).toContain("Wire UI");
	});

	it("reflects a configured workspace", () => {
		write(".vscode/mcp.json", serverConfig("servers"));
		registerMcpStatus(output);

		expect(__statusBarItem().tooltip).toContain(".vscode/mcp.json");
	});

	it("reflects an installed-but-unconfigured workspace", () => {
		write(
			"package.json",
			JSON.stringify({ devDependencies: { [MCP_PACKAGE]: "^0.5.0" } }),
		);
		registerMcpStatus(output);

		expect(__statusBarItem().tooltip).toContain(MCP_PACKAGE);
		expect(__statusBarItem().tooltip).toContain("no workspace MCP config");
	});

	it("reads a config written in JSONC", () => {
		write(
			".vscode/mcp.json",
			`{
				// Added by hand.
				"servers": {
					"wire-ui": { "command": "npx", "args": ["${MCP_PACKAGE}"] },
				},
			}`,
		);
		registerMcpStatus(output);

		expect(__statusBarItem().tooltip).toContain(".vscode/mcp.json");
	});

	it("survives a malformed package.json", () => {
		write("package.json", "{ not json");
		expect(() => registerMcpStatus(output)).not.toThrow();
		expect(__statusBarItem().shown).toBe(true);
	});

	it("survives a workspace with no folders open", () => {
		__state.workspaceFolders = [];
		expect(() => registerMcpStatus(output)).not.toThrow();
		expect(__statusBarItem().text).toContain("Wire UI");
		expect(__state.watchers).toHaveLength(0);
	});
});

describe("refreshing", () => {
	it("updates when a config appears", () => {
		registerMcpStatus(output);
		const before = __statusBarItem().text;

		write(".mcp.json", serverConfig("mcpServers"));
		__fireWatchers();

		expect(__statusBarItem().text).not.toBe(before);
		expect(__statusBarItem().tooltip).toContain(".mcp.json");
	});

	it("updates when a config goes away", () => {
		write(".mcp.json", serverConfig("mcpServers"));
		registerMcpStatus(output);

		fs.rmSync(path.join(root, ".mcp.json"));
		__fireWatchers();

		expect(__statusBarItem().tooltip).not.toContain(".mcp.json");
	});

	it("watches the files detection reads, at the folder root", () => {
		registerMcpStatus(output);

		expect(__state.watchers).toHaveLength(1);
		const { pattern } = __state.watchers[0] as {
			pattern: { base: unknown; pattern: string };
		};
		expect(pattern.pattern).toContain("package.json");
		expect(pattern.pattern).toContain(".vscode/mcp.json");
		expect(pattern.pattern).not.toContain("**");
	});

	it("re-runs when the folder set changes", () => {
		registerMcpStatus(output);
		const before = __statusBarItem().text;

		write(".mcp.json", serverConfig("mcpServers"));
		__fireWorkspaceFoldersChanged();

		expect(__statusBarItem().text).not.toBe(before);
	});

	it("stops updating once disposed", () => {
		const registration = registerMcpStatus(output);
		const before = __statusBarItem().text;

		registration.dispose();
		write(".mcp.json", serverConfig("mcpServers"));
		__fireWatchers();

		expect(__statusBarItem().text).toBe(before);
		expect(__statusBarItem().disposed).toBe(true);
		expect(__state.watchers[0].disposed).toBe(true);
		expect(__state.commands.has(MCP_STATUS_COMMAND_ID)).toBe(false);
	});
});

describe("multi-root workspaces", () => {
	let second: string;

	beforeEach(() => {
		second = fs.mkdtempSync(path.join(os.tmpdir(), "wire-ui-mcp-2-"));
		useWorkspace(root, second);
	});

	afterEach(() => {
		fs.rmSync(second, { recursive: true, force: true });
	});

	it("reports the best state across folders", () => {
		write(".mcp.json", serverConfig("mcpServers"), second);
		registerMcpStatus(output);

		expect(__statusBarItem().tooltip).toContain(".mcp.json");
	});

	it("watches every folder", () => {
		registerMcpStatus(output);
		expect(__state.watchers).toHaveLength(2);
	});
});

describe("the status command", () => {
	it("reports what was detected", async () => {
		write(".mcp.json", serverConfig("mcpServers"));
		registerMcpStatus(output);

		await __runCommand(MCP_STATUS_COMMAND_ID);

		expect(lastMessage().message).toContain(".mcp.json");
	});

	it("offers a config to copy only when nothing registers the server", async () => {
		registerMcpStatus(output);
		await __runCommand(MCP_STATUS_COMMAND_ID);
		expect(lastMessage().items.join(" ")).toContain("Copy config");

		write(".mcp.json", serverConfig("mcpServers"));
		__fireWatchers();
		await __runCommand(MCP_STATUS_COMMAND_ID);
		expect(lastMessage().items.join(" ")).not.toContain("Copy config");
	});

	it("copies a config in the format the chosen client reads", async () => {
		registerMcpStatus(output);

		clickButton("Copy config (VS Code)");
		await __runCommand(MCP_STATUS_COMMAND_ID);
		expect(JSON.parse(__state.clipboard)).toHaveProperty("servers");

		clickButton("Copy config (Claude Code / Cursor)");
		await __runCommand(MCP_STATUS_COMMAND_ID);
		expect(JSON.parse(__state.clipboard)).toHaveProperty("mcpServers");
	});

	it("copies a config that this detector would then recognise", async () => {
		registerMcpStatus(output);
		clickButton("Copy config (VS Code)");
		await __runCommand(MCP_STATUS_COMMAND_ID);

		write(".vscode/mcp.json", __state.clipboard);
		__fireWatchers();

		expect(__statusBarItem().tooltip).toContain(".vscode/mcp.json");
	});

	it("opens the log on request", async () => {
		let shown = false;
		__state.commands.set("wire-ui.showOutput", () => {
			shown = true;
		});
		registerMcpStatus(output);

		clickButton("Show Log");
		await __runCommand(MCP_STATUS_COMMAND_ID);

		expect(shown).toBe(true);
	});

	it("does nothing when the notification is dismissed", async () => {
		registerMcpStatus(output);
		__state.onMessage = () => undefined;

		await __runCommand(MCP_STATUS_COMMAND_ID);

		expect(__state.clipboard).toBe("");
		expect(__state.messages).toHaveLength(1);
	});
});
