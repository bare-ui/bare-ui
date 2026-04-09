import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerListComponents } from "./tools/list-components.js";
import { registerGetComponent } from "./tools/get-component.js";
import { registerGetDecisionTree } from "./tools/get-decision-tree.js";
import { registerSearchDocs } from "./tools/search-docs.js";
import { registerGetInstallationGuide } from "./tools/get-installation-guide.js";
import { registerGetExportsList } from "./tools/get-exports-list.js";

export function createServer() {
	const server = new McpServer({
		name: "wire-ui",
		version: "0.1.0",
	});

	registerListComponents(server);
	registerGetComponent(server);
	registerGetDecisionTree(server);
	registerSearchDocs(server);
	registerGetInstallationGuide(server);
	registerGetExportsList(server);

	return server;
}
