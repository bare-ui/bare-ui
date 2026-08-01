// Is `@wire-ui/mcp` present in this workspace, and is anything wired up to run it?
//
// Two independent questions, deliberately kept apart:
//
//   *installed*   — the package is a dependency of the workspace.
//   *configured*  — a workspace MCP config registers the server.
//
// Neither implies the other. The documented setup is `npx @wire-ui/mcp`, which
// installs nothing; equally, a workspace can depend on the package and have no
// client pointed at it. Everything here is a pure function over a snapshot so
// the decisions are unit-testable; `command.ts` does the reading.

import { declaredDependencies } from "../init/detect.js";

export const MCP_PACKAGE = "@wire-ui/mcp";

/** The `bin` the package publishes — a config may name it instead of the package. */
const MCP_BIN = "wire-ui-mcp";

/**
 * Workspace-scoped MCP configs, in the order they are reported. User-scoped
 * configs (`~/.config/Code/User/mcp.json`, Claude Desktop's) are deliberately
 * not read: they live outside the workspace and often outside the user's
 * sandbox, so "no config found" can only ever mean *none in this workspace* —
 * which is why nothing here treats it as a problem to be fixed.
 */
export const MCP_CONFIG_FILES: readonly string[] = [
	".mcp.json", // Claude Code, workspace scope
	".vscode/mcp.json", // VS Code
	".cursor/mcp.json", // Cursor
];

/** A config file read off disk. `contents` is undefined when absent or unparseable. */
export interface McpConfigFile {
	/** Workspace-relative, forward-slashed. */
	path: string;
	contents: unknown;
}

export interface McpSnapshot {
	/** The workspace `package.json`, parsed. */
	manifest: unknown;
	/** `node_modules/@wire-ui/mcp` exists — an install the manifest may not declare. */
	hasPackageDirectory: boolean;
	configs: readonly McpConfigFile[];
}

/** How an install was seen. A declaration outranks a bare directory. */
export type McpInstallSource = "manifest" | "node_modules";

export interface McpDetection {
	installed: boolean;
	installedVia?: McpInstallSource;
	/** Config files that register the Wire UI server, workspace-relative. */
	configuredIn: string[];
}

export function detectMcp(snapshot: McpSnapshot): McpDetection {
	const declared = declaredDependencies(snapshot.manifest).has(MCP_PACKAGE);
	const installedVia: McpInstallSource | undefined = declared
		? "manifest"
		: snapshot.hasPackageDirectory
			? "node_modules"
			: undefined;

	const configuredIn = snapshot.configs
		.filter((config) => registersWireUi(config.contents))
		.map((config) => config.path);

	return {
		installed: installedVia !== undefined,
		...(installedVia ? { installedVia } : {}),
		configuredIn,
	};
}

export function isConfigured(detection: McpDetection): boolean {
	return detection.configuredIn.length > 0;
}

/**
 * Does this parsed config register Wire UI's MCP server?
 *
 * Client formats differ only in the key: VS Code's `mcp.json` uses `servers`,
 * Claude Code and Cursor use `mcpServers`. Both are accepted rather than
 * guessing from the file's path, since a config written for one client is
 * routinely copied into another's file.
 */
function registersWireUi(contents: unknown): boolean {
	if (typeof contents !== "object" || contents === null) return false;
	const record = contents as Record<string, unknown>;

	for (const key of ["servers", "mcpServers"]) {
		const servers = record[key];
		if (typeof servers !== "object" || servers === null) continue;
		for (const [name, entry] of Object.entries(
			servers as Record<string, unknown>,
		))
			if (isWireUiServer(name, entry)) return true;
	}
	return false;
}

/**
 * An entry is Wire UI's if it runs the package — by name, by bin, or by a URL
 * for the remote form. The entry's *key* is only a fallback: `wire-ui` is the
 * name every doc uses, but a server called `wire-ui` that runs something else
 * is a config the user has already broken for themselves.
 */
function isWireUiServer(name: string, entry: unknown): boolean {
	for (const value of commandStrings(entry))
		if (value.includes(MCP_PACKAGE) || value.includes(MCP_BIN)) return true;

	return name.toLowerCase().replace(/[_\s]/g, "-") === "wire-ui";
}

/** The strings in an entry that can name what gets run. */
function commandStrings(entry: unknown): string[] {
	if (typeof entry !== "object" || entry === null) return [];
	const record = entry as Record<string, unknown>;

	const values: string[] = [];
	for (const key of ["command", "url"])
		if (typeof record[key] === "string") values.push(record[key] as string);

	if (Array.isArray(record.args))
		for (const arg of record.args)
			if (typeof arg === "string") values.push(arg);

	return values;
}

/**
 * The server entry we tell people to add — and that `detectMcp` recognises. A
 * test asserts the round trip, so the snippet can't drift from the matcher.
 */
export function wireUiServerSnippet(key: "servers" | "mcpServers"): string {
	return JSON.stringify(
		{ [key]: { "wire-ui": { command: "npx", args: [MCP_PACKAGE] } } },
		null,
		2,
	);
}

/**
 * JSON as the config files are actually written: `.vscode/mcp.json` is JSONC,
 * and VS Code's own template for it ships with comments. Parsing it strictly
 * would report "no MCP config" for the most common file in the list.
 *
 * Returns undefined for anything that still won't parse — an unreadable config
 * is reported as no config rather than as an error, since detection is
 * ambient and has nowhere to complain.
 */
export function parseJsonc(text: string): unknown {
	try {
		return JSON.parse(text);
	} catch {
		// Fall through to the tolerant pass.
	}
	try {
		return JSON.parse(dropTrailingCommas(stripComments(text)));
	} catch {
		return undefined;
	}
}

/** Both passes are string-aware, so a `//` inside a URL literal survives. */
function stripComments(text: string): string {
	let out = "";
	let index = 0;
	while (index < text.length) {
		const char = text[index];

		if (char === '"') {
			const end = endOfString(text, index);
			out += text.slice(index, end);
			index = end;
			continue;
		}
		if (char === "/" && text[index + 1] === "/") {
			while (index < text.length && text[index] !== "\n") index++;
			continue;
		}
		if (char === "/" && text[index + 1] === "*") {
			index += 2;
			while (
				index < text.length &&
				!(text[index] === "*" && text[index + 1] === "/")
			)
				index++;
			index += 2;
			continue;
		}

		out += char;
		index++;
	}
	return out;
}

function dropTrailingCommas(text: string): string {
	let out = "";
	let index = 0;
	while (index < text.length) {
		const char = text[index];

		if (char === '"') {
			const end = endOfString(text, index);
			out += text.slice(index, end);
			index = end;
			continue;
		}
		if (char === ",") {
			let next = index + 1;
			while (next < text.length && /\s/.test(text[next])) next++;
			if (text[next] === "}" || text[next] === "]") {
				index++;
				continue;
			}
		}

		out += char;
		index++;
	}
	return out;
}

/** Index just past the string literal opening at `start`. */
function endOfString(text: string, start: number): number {
	let index = start + 1;
	while (index < text.length) {
		if (text[index] === "\\") {
			index += 2;
			continue;
		}
		if (text[index] === '"') return index + 1;
		index++;
	}
	return text.length; // Unterminated; the parse will fail on it.
}
