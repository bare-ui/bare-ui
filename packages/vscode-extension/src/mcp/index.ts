export {
	detectWorkspaceMcp,
	MCP_STATUS_COMMAND_ID,
	readMcpSnapshot,
	registerMcpStatus,
	showMcpStatus,
} from "./command.js";
export {
	detectMcp,
	isConfigured,
	MCP_CONFIG_FILES,
	MCP_PACKAGE,
	parseJsonc,
	wireUiServerSnippet,
} from "./detect.js";
export type { McpDetection, McpSnapshot } from "./detect.js";
export { describeMcpDetails, describeMcpStatus, mcpState } from "./status.js";
export type { McpState, McpStatusPresentation } from "./status.js";
