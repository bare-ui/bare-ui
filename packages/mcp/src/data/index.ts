// Side-effect-free data export for @wire-ui/mcp.
//
// This is the library entry point (`@wire-ui/mcp/data`) that lets other
// packages — the VS Code extension, the TypeScript Language Service plugin,
// the ESLint plugin — read the component/hook catalog WITHOUT booting the
// MCP server or its stdio transport. The package's `src/index.ts` is the CLI
// and must never be imported as a library.
//
// `@wire-ui/mcp` is the single source of truth for component metadata. Do not
// duplicate this data in consuming packages; read it from here.

export type {
	Framework,
	ComponentCategory,
	HookCategory,
	PropInfo,
	DataAttributeInfo,
	FrameworkSnippets,
	ComponentData,
	HookFrameworkSnippet,
	HookData,
	DecisionEntry,
	DecisionTree,
} from "./types.js";

export { components } from "./components.js";
export { hooks } from "./hooks.js";
export { decisionTrees } from "./decision-trees.js";
