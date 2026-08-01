// What the status bar says about the MCP server.
//
// Pure: detection in, the item's text/tooltip out. The status bar is ambient —
// it is read out of the corner of an eye and never asked for — so the three
// states differ by icon and wording only. Nothing here uses a warning colour:
// a workspace without an MCP config is a normal workspace, and user-scoped
// configs (which `detect.ts` cannot see) mean an unconfigured-looking workspace
// may well be configured.

import { isConfigured, MCP_PACKAGE, type McpDetection } from "./detect.js";

export type McpState = "configured" | "installed" | "absent";

export interface McpStatusPresentation {
	text: string;
	tooltip: string;
}

export function mcpState(detection: McpDetection): McpState {
	if (isConfigured(detection)) return "configured";
	return detection.installed ? "installed" : "absent";
}

export function describeMcpStatus(
	detection: McpDetection,
): McpStatusPresentation {
	switch (mcpState(detection)) {
		case "configured":
			return {
				text: "$(plug) Wire UI",
				tooltip: `Wire UI MCP server configured in ${detection.configuredIn.join(", ")} — the component catalog is available to your AI assistant.`,
			};
		case "installed":
			return {
				text: "$(debug-disconnect) Wire UI",
				tooltip: `${MCP_PACKAGE} is installed but no workspace MCP config registers it. Click for the config snippet.`,
			};
		case "absent":
			return {
				text: "$(symbol-misc) Wire UI",
				tooltip: "Wire UI — click for MCP setup and the extension log.",
			};
	}
}

/** The lines the status command shows when the item is clicked. */
export function describeMcpDetails(detection: McpDetection): string[] {
	const lines: string[] = [];

	lines.push(
		detection.installedVia === "manifest"
			? `${MCP_PACKAGE} is a dependency of this workspace.`
			: detection.installedVia === "node_modules"
				? `${MCP_PACKAGE} is installed in node_modules (not declared in package.json).`
				: `${MCP_PACKAGE} is not installed here — the documented setup runs it with npx, which needs no install.`,
	);

	lines.push(
		isConfigured(detection)
			? `Registered by ${detection.configuredIn.join(", ")}.`
			: "No workspace MCP config registers it. A user-scoped config (VS Code's or Claude Desktop's) would not be visible here.",
	);

	return lines;
}
