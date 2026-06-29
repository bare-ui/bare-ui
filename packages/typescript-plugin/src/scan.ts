import type * as ts from "typescript";
import { isWireComponent } from "./metadata/index.js";

// The `typescript` value passed into the plugin via `init({ typescript })`. We
// only touch the AST helpers, which `tsserverlibrary` shares with `typescript`,
// so the narrower `typeof import('typescript')` type accepts either.
export type TsModule = typeof import("typescript");

/**
 * True for module specifiers that resolve to a Wire UI framework package —
 * `@wire-ui/react`, `@wire-ui/vue`, `@wire-ui/solid`, or a bare `wire-ui`.
 */
export function isWireUiModuleSpecifier(specifier: string): boolean {
	return /(^|\/)@?wire-ui(\/|$)/.test(specifier);
}

/**
 * Collect the Wire UI component names imported from a `@wire-ui/*` package in a
 * single source file. Uses the *imported* name (not the local alias) when
 * checking against the metadata catalog, so `import { Switch as Toggle }` still
 * resolves to the `Switch` component.
 */
export function collectWireComponentsInFile(
	tsLib: TsModule,
	sourceFile: ts.SourceFile,
): string[] {
	const found = new Set<string>();

	for (const statement of sourceFile.statements) {
		if (!tsLib.isImportDeclaration(statement)) continue;

		const specifier = statement.moduleSpecifier;
		if (!tsLib.isStringLiteral(specifier)) continue;
		if (!isWireUiModuleSpecifier(specifier.text)) continue;

		const bindings = statement.importClause?.namedBindings;
		if (!bindings || !tsLib.isNamedImports(bindings)) continue;

		for (const element of bindings.elements) {
			// `propertyName` is set when the import is aliased (`X as Y`).
			const importedName = (element.propertyName ?? element.name).text;
			if (isWireComponent(importedName)) found.add(importedName);
		}
	}

	return [...found];
}

/** A Wire UI component seen in a project file, with the file it was found in. */
export interface WireComponentSighting {
	component: string;
	fileName: string;
}

/**
 * Scan every user source file in a program for Wire UI component imports.
 * Skips declaration files and anything under `node_modules`.
 */
export function collectWireComponentsInProgram(
	tsLib: TsModule,
	program: ts.Program,
): WireComponentSighting[] {
	const sightings: WireComponentSighting[] = [];

	for (const sourceFile of program.getSourceFiles()) {
		if (sourceFile.isDeclarationFile) continue;
		if (sourceFile.fileName.includes("node_modules")) continue;

		for (const component of collectWireComponentsInFile(
			tsLib,
			sourceFile,
		)) {
			sightings.push({ component, fileName: sourceFile.fileName });
		}
	}

	return sightings;
}
