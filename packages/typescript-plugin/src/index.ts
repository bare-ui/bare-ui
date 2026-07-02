import type * as ts from "typescript/lib/tsserverlibrary";
import {
	buildComponentPartEntries,
	buildDataAttributeEntries,
	buildDataAttributeValueEntries,
	getComponentPartEntryDetails,
	getDataAttributeEntryDetails,
	getDataAttributeValueEntryDetails,
	resolveComponentPartsContext,
	resolveDataAttributeContext,
	resolveDataAttributeValueContext,
	WIRE_COMPONENT_PARTS_SOURCE,
	WIRE_DATA_ATTRIBUTE_SOURCE,
	WIRE_DATA_VALUE_SOURCE,
} from "./completions.js";
import { buildHoverQuickInfo, resolveHoverContext } from "./hover.js";
import { listComponentNames } from "./metadata/index.js";
import { collectWireComponentsInProgram } from "./scan.js";

const LOG_PREFIX = "[wire-ui]";

/** Docs for an injected data-* attribute-name entry, or `undefined` if it isn't ours. */
function nameDetails(
	tsLib: typeof ts,
	sourceFile: ts.SourceFile,
	position: number,
	entryName: string,
): ts.CompletionEntryDetails | undefined {
	const context = resolveDataAttributeContext(tsLib, sourceFile, position);
	return context && getDataAttributeEntryDetails(tsLib, context, entryName);
}

/** Docs for an injected data-* value entry, or `undefined` if it isn't ours. */
function valueDetails(
	tsLib: typeof ts,
	sourceFile: ts.SourceFile,
	position: number,
	entryName: string,
): ts.CompletionEntryDetails | undefined {
	const context = resolveDataAttributeValueContext(
		tsLib,
		sourceFile,
		position,
	);
	return (
		context && getDataAttributeValueEntryDetails(tsLib, context, entryName)
	);
}

/** Docs for an injected compound-part entry, or `undefined` if it isn't ours. */
function partDetails(
	tsLib: typeof ts,
	sourceFile: ts.SourceFile,
	position: number,
	entryName: string,
): ts.CompletionEntryDetails | undefined {
	const context = resolveComponentPartsContext(tsLib, sourceFile, position);
	return context && getComponentPartEntryDetails(tsLib, context, entryName);
}

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

		// data-* completion. Inside a Wire UI JSX element, merge Wire's attribute
		// names (name position) or a data-* attribute's valid values (inside its
		// string value). Guarded so a failure falls back to host completions.
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

				// Value position (inside `data-state="…"`) — mutually exclusive
				// with the name position below.
				const valueContext = resolveDataAttributeValueContext(
					tsLib,
					sourceFile,
					position,
				);
				if (valueContext) {
					const entries = buildDataAttributeValueEntries(
						tsLib,
						valueContext,
					);
					if (!prior) {
						return {
							isGlobalCompletion: false,
							isMemberCompletion: false,
							isNewIdentifierLocation: false,
							optionalReplacementSpan:
								valueContext.replacementSpan,
							entries,
						};
					}
					const seen = new Set(prior.entries.map((e) => e.name));
					const additions = entries.filter((e) => !seen.has(e.name));
					return {
						...prior,
						optionalReplacementSpan:
							prior.optionalReplacementSpan ??
							valueContext.replacementSpan,
						entries: [...additions, ...prior.entries],
					};
				}

				// Compound-part position (`<Accordion.|`) — a tag-name position,
				// mutually exclusive with the attribute-name position below.
				const partsContext = resolveComponentPartsContext(
					tsLib,
					sourceFile,
					position,
				);
				if (partsContext) {
					const entries = buildComponentPartEntries(
						tsLib,
						partsContext,
					);
					if (!prior) {
						return {
							isGlobalCompletion: false,
							isMemberCompletion: true,
							isNewIdentifierLocation: false,
							optionalReplacementSpan:
								partsContext.replacementSpan,
							entries,
						};
					}
					const seen = new Set(prior.entries.map((e) => e.name));
					const additions = entries.filter((e) => !seen.has(e.name));
					return {
						...prior,
						entries: [...additions, ...prior.entries],
					};
				}

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
			if (
				source === WIRE_DATA_ATTRIBUTE_SOURCE ||
				source === WIRE_DATA_VALUE_SOURCE ||
				source === WIRE_COMPONENT_PARTS_SOURCE
			) {
				try {
					const sourceFile = info.languageService
						.getProgram()
						?.getSourceFile(fileName);
					if (sourceFile) {
						const details =
							source === WIRE_DATA_VALUE_SOURCE
								? valueDetails(
										tsLib,
										sourceFile,
										position,
										entryName,
									)
								: source === WIRE_COMPONENT_PARTS_SOURCE
									? partDetails(
											tsLib,
											sourceFile,
											position,
											entryName,
										)
									: nameDetails(
											tsLib,
											sourceFile,
											position,
											entryName,
										);
						if (details) return details;
					}
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

		// Hover docs. Over a Wire UI tag name (`<Accordion>`, `<Accordion.Trigger>`,
		// or the closing tag), replace tsserver's type hover with a reference card:
		// parts table + data-* table + docs link. Guarded → fall back to host.
		proxy.getQuickInfoAtPosition = (fileName, position) => {
			try {
				const sourceFile = info.languageService
					.getProgram()
					?.getSourceFile(fileName);
				if (sourceFile) {
					const context = resolveHoverContext(
						tsLib,
						sourceFile,
						position,
					);
					if (context) return buildHoverQuickInfo(tsLib, context);
				}
			} catch (error) {
				log(
					`hover augmentation failed: ${error instanceof Error ? error.message : String(error)}`,
				);
			}
			return info.languageService.getQuickInfoAtPosition(
				fileName,
				position,
			);
		};

		return proxy;
	}

	return { create };
}

export = init;
