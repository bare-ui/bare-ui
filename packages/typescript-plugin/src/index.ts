import type * as ts from "typescript/lib/tsserverlibrary";
import { listComponentNames } from "./metadata/index.js";
import { collectWireComponentsInProgram } from "./scan.js";

const LOG_PREFIX = "[wire-ui]";

function init(modules: { typescript: typeof ts }): ts.server.PluginModule {
	const tsLib = modules.typescript;

	function create(info: ts.server.PluginCreateInfo): ts.LanguageService {
		const logger = info.project.projectService.logger;
		const log = (message: string) =>
			logger.info(`${LOG_PREFIX} ${message}`);

		log(
			`plugin loaded — ${listComponentNames().length} components in catalog`,
		);

		// Report the Wire UI components this project uses. Guarded so a scan
		// failure can never take down the host tsserver.
		try {
			const program = info.languageService.getProgram();
			if (program) {
				const sightings = collectWireComponentsInProgram(
					tsLib,
					program,
				);
				const seen = new Set(sightings.map((s) => s.component));
				log(
					seen.size > 0
						? `saw ${seen.size} component(s): ${[...seen].sort().join(", ")}`
						: "no Wire UI components in this project yet",
				);
			}
		} catch (error) {
			log(
				`component scan failed: ${error instanceof Error ? error.message : String(error)}`,
			);
		}

		// Passthrough proxy — no language features overridden yet. Each method is
		// bound to the original service; later days replace individual members
		// (getCompletionsAtPosition, getSemanticDiagnostics, …).
		const proxy = Object.create(null) as ts.LanguageService;
		for (const key of Object.keys(info.languageService) as Array<
			keyof ts.LanguageService
		>) {
			const member = info.languageService[key];
			// @ts-expect-error — index assignment across the heterogeneous LS surface
			proxy[key] =
				typeof member === "function"
					? member.bind(info.languageService)
					: member;
		}
		return proxy;
	}

	return { create };
}

export = init;
