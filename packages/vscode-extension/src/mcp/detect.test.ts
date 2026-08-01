import { describe, expect, it } from "vitest";
import {
	detectMcp,
	isConfigured,
	MCP_CONFIG_FILES,
	MCP_PACKAGE,
	parseJsonc,
	wireUiServerSnippet,
	type McpConfigFile,
	type McpSnapshot,
} from "./detect.js";

function snapshot(overrides: Partial<McpSnapshot> = {}): McpSnapshot {
	return {
		manifest: undefined,
		hasPackageDirectory: false,
		configs: [],
		...overrides,
	};
}

/** A config file holding `json`, as `readMcpSnapshot` would hand it over. */
function config(path: string, json: unknown): McpConfigFile {
	return { path, contents: json };
}

describe("detectMcp — installed", () => {
	it("sees a dependency declaration", () => {
		const detection = detectMcp(
			snapshot({
				manifest: { dependencies: { [MCP_PACKAGE]: "^0.5.0" } },
			}),
		);
		expect(detection.installed).toBe(true);
		expect(detection.installedVia).toBe("manifest");
	});

	it("sees a devDependency declaration — where an MCP server usually goes", () => {
		const detection = detectMcp(
			snapshot({
				manifest: { devDependencies: { [MCP_PACKAGE]: "^0.5.0" } },
			}),
		);
		expect(detection.installedVia).toBe("manifest");
	});

	it("falls back to node_modules for an undeclared install", () => {
		const detection = detectMcp(snapshot({ hasPackageDirectory: true }));
		expect(detection.installed).toBe(true);
		expect(detection.installedVia).toBe("node_modules");
	});

	it("prefers the declaration over the directory", () => {
		const detection = detectMcp(
			snapshot({
				manifest: { dependencies: { [MCP_PACKAGE]: "^0.5.0" } },
				hasPackageDirectory: true,
			}),
		);
		expect(detection.installedVia).toBe("manifest");
	});

	it("reports nothing for an empty workspace", () => {
		const detection = detectMcp(snapshot());
		expect(detection.installed).toBe(false);
		expect(detection.installedVia).toBeUndefined();
		expect(isConfigured(detection)).toBe(false);
	});

	it("does not mistake another @wire-ui package for the server", () => {
		const detection = detectMcp(
			snapshot({
				manifest: { dependencies: { "@wire-ui/react": "^0.5.0" } },
			}),
		);
		expect(detection.installed).toBe(false);
	});
});

describe("detectMcp — configured", () => {
	it("reads Claude Code / Cursor's `mcpServers` key", () => {
		const detection = detectMcp(
			snapshot({
				configs: [
					config(".mcp.json", {
						mcpServers: {
							"wire-ui": { command: "npx", args: [MCP_PACKAGE] },
						},
					}),
				],
			}),
		);
		expect(detection.configuredIn).toEqual([".mcp.json"]);
	});

	it("reads VS Code's `servers` key", () => {
		const detection = detectMcp(
			snapshot({
				configs: [
					config(".vscode/mcp.json", {
						servers: {
							"wire-ui": { command: "npx", args: [MCP_PACKAGE] },
						},
					}),
				],
			}),
		);
		expect(isConfigured(detection)).toBe(true);
	});

	it("matches on the published bin, whatever the entry is called", () => {
		const detection = detectMcp(
			snapshot({
				configs: [
					config(".mcp.json", {
						mcpServers: { catalog: { command: "wire-ui-mcp" } },
					}),
				],
			}),
		);
		expect(isConfigured(detection)).toBe(true);
	});

	it("matches a remote server by URL", () => {
		const detection = detectMcp(
			snapshot({
				configs: [
					config(".mcp.json", {
						mcpServers: {
							catalog: {
								type: "http",
								url: `https://example.com/${MCP_PACKAGE}`,
							},
						},
					}),
				],
			}),
		);
		expect(isConfigured(detection)).toBe(true);
	});

	it("falls back to the conventional `wire-ui` key", () => {
		const detection = detectMcp(
			snapshot({
				configs: [
					config(".mcp.json", {
						mcpServers: {
							wire_ui: { command: "node", args: ["./server.js"] },
						},
					}),
				],
			}),
		);
		expect(isConfigured(detection)).toBe(true);
	});

	it("ignores servers that are somebody else's", () => {
		const detection = detectMcp(
			snapshot({
				configs: [
					config(".mcp.json", {
						mcpServers: {
							postgres: {
								command: "npx",
								args: ["@some/other-mcp"],
							},
						},
					}),
				],
			}),
		);
		expect(detection.configuredIn).toEqual([]);
	});

	it("reports every config that registers it, in the order checked", () => {
		const entry = {
			mcpServers: { "wire-ui": { command: "npx", args: [MCP_PACKAGE] } },
		};
		const detection = detectMcp(
			snapshot({
				configs: [
					config(".mcp.json", entry),
					config(".vscode/mcp.json", undefined),
					config(".cursor/mcp.json", entry),
				],
			}),
		);
		expect(detection.configuredIn).toEqual([
			".mcp.json",
			".cursor/mcp.json",
		]);
	});

	it("survives a config that is absent, empty, or the wrong shape", () => {
		const detection = detectMcp(
			snapshot({
				configs: [
					config(".mcp.json", undefined),
					config(".vscode/mcp.json", null),
					config(".cursor/mcp.json", { servers: "not-an-object" }),
				],
			}),
		);
		expect(isConfigured(detection)).toBe(false);
	});

	it("is independent of installation — npx configs install nothing", () => {
		const detection = detectMcp(
			snapshot({
				configs: [
					config(".mcp.json", {
						mcpServers: {
							"wire-ui": { command: "npx", args: [MCP_PACKAGE] },
						},
					}),
				],
			}),
		);
		expect(isConfigured(detection)).toBe(true);
		expect(detection.installed).toBe(false);
	});
});

describe("wireUiServerSnippet", () => {
	// The snippet we hand out has to be one we would then detect, or the status
	// bar tells people to paste something it will go on ignoring.
	it.each(["servers", "mcpServers"] as const)(
		"round-trips through detection (%s)",
		(key) => {
			const detection = detectMcp(
				snapshot({
					configs: [
						config(
							".mcp.json",
							parseJsonc(wireUiServerSnippet(key)),
						),
					],
				}),
			);
			expect(isConfigured(detection)).toBe(true);
		},
	);
});

describe("parseJsonc", () => {
	it("parses plain JSON", () => {
		expect(parseJsonc('{"a": 1}')).toEqual({ a: 1 });
	});

	it("parses the commented template VS Code writes", () => {
		const text = `{
			// Wire UI's catalog, for the assistant.
			"servers": {
				/* stdio */
				"wire-ui": { "command": "npx", "args": ["${MCP_PACKAGE}"] },
			},
		}`;
		expect(parseJsonc(text)).toEqual({
			servers: {
				"wire-ui": { command: "npx", args: [MCP_PACKAGE] },
			},
		});
	});

	it("leaves `//` inside a string alone", () => {
		expect(parseJsonc('{"url": "https://example.com/mcp"}')).toEqual({
			url: "https://example.com/mcp",
		});
	});

	it("leaves a comma-before-brace inside a string alone", () => {
		expect(parseJsonc('{"a": "x,}", /* c */ "b": 1,}')).toEqual({
			a: "x,}",
			b: 1,
		});
	});

	it("handles escaped quotes when scanning strings", () => {
		expect(parseJsonc('{"a": "say \\"//\\"", "b": 1,}')).toEqual({
			a: 'say "//"',
			b: 1,
		});
	});

	it("returns undefined for something that is not JSON at all", () => {
		expect(parseJsonc("not json")).toBeUndefined();
		expect(parseJsonc("")).toBeUndefined();
	});
});

describe("MCP_CONFIG_FILES", () => {
	it("covers the workspace-scoped configs of the clients the README documents", () => {
		expect(MCP_CONFIG_FILES).toContain(".mcp.json"); // Claude Code
		expect(MCP_CONFIG_FILES).toContain(".vscode/mcp.json"); // VS Code
		expect(MCP_CONFIG_FILES).toContain(".cursor/mcp.json"); // Cursor
	});
});
