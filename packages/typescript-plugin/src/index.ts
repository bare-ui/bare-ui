import type * as ts from "typescript/lib/tsserverlibrary";
import {
	buildDataAttributeEntries,
	getDataAttributeEntryDetails,
	resolveDataAttributeContext,
	WIRE_DATA_ATTRIBUTE_SOURCE,
} from "./completions.js";
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

		// Start from a passthrough proxy — every method bound to the original
		// service — then override the individual members we augment below.
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

		// data-* attribute completion. Merge Wire UI's attributes into whatever
		// tsserver already offers inside a Wire UI JSX element. Guarded so a
		// failure falls back to the host's own completions.
		proxy.getCompletionsAtPosition = (
			fileName,
			position,
			options,
			formattingSettings,
		) => {
			const prior = info.languageService.getCompletionsAtPosition(
				fileName,
				position,
				options,
				formattingSettings,
			);
			try {
				const sourceFile = info.languageService
					.getProgram()
					?.getSourceFile(fileName);
				if (!sourceFile) return prior;

				const context = resolveDataAttributeContext(
					tsLib,
					sourceFile,
					position,
				);
				if (!context) return prior;

				const entries = buildDataAttributeEntries(tsLib, context);
				if (!prior) {
					return {
						isGlobalCompletion: false,
						isMemberCompletion: false,
						isNewIdentifierLocation: true,
						entries,
					};
				}

				const seen = new Set(prior.entries.map((e) => e.name));
				const additions = entries.filter((e) => !seen.has(e.name));
				return { ...prior, entries: [...additions, ...prior.entries] };
			} catch (error) {
				log(
					`completion augmentation failed: ${error instanceof Error ? error.message : String(error)}`,
				);
				return prior;
			}
		};

		// Serve Wire UI docs for the entries we injected; delegate everything else.
		proxy.getCompletionEntryDetails = (
			fileName,
			position,
			entryName,
			formatOptions,
			source,
			preferences,
			data,
		) => {
			if (source === WIRE_DATA_ATTRIBUTE_SOURCE) {
				try {
					const sourceFile = info.languageService
						.getProgram()
						?.getSourceFile(fileName);
					const context =
						sourceFile &&
						resolveDataAttributeContext(
							tsLib,
							sourceFile,
							position,
						);
					const details =
						context &&
						getDataAttributeEntryDetails(tsLib, context, entryName);
					if (details) return details;
				} catch (error) {
					log(
						`completion detail lookup failed: ${error instanceof Error ? error.message : String(error)}`,
					);
				}
			}
			return info.languageService.getCompletionEntryDetails(
				fileName,
				position,
				entryName,
				formatOptions,
				source,
				preferences,
				data,
			);
		};

		return proxy;
	}

	return { create };
}

export = init;
