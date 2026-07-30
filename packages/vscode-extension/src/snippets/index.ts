export { registerSnippetCompletions } from "./provider.js";
export {
	buildComponentSnippets,
	buildHookSnippets,
	buildScaffoldSnippets,
	getComponentSnippets,
	getHookSnippets,
	getScaffoldSnippets,
	hookSnippetPrefix,
	moduleIdFor,
	scaffoldSnippetPrefix,
	snippetPrefix,
} from "./build.js";
export type {
	WireSnippet,
	WireSnippetImport,
	WireSnippetKind,
} from "./types.js";
