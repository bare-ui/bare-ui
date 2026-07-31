// What `Wire UI: Add Component` will write, decided before it writes anything.
//
// Same split as Init: a pure planner the confirmation dialog is rendered from,
// and a command layer that only does I/O.

import type { Framework } from "@wire-ui/typescript-plugin/metadata";
import { scaffoldFiles, type ScaffoldFile } from "./templates/index.js";

/** Directories a component tree conventionally lives in, best first. */
const CANDIDATE_DIRECTORIES = [
	"src/components",
	"app/components",
	"components",
	"src/ui",
	"src",
	"app",
];

/**
 * Where to offer to put the component. Existing directories come first in
 * preference order; `src/components` is always offered last-resort so a bare
 * workspace still has an answer that follows the convention.
 */
export function componentDirectoryCandidates(
	directoryExists: (relativePath: string) => boolean,
): string[] {
	const existing = CANDIDATE_DIRECTORIES.filter(directoryExists);
	return existing.length > 0 ? existing : [CANDIDATE_DIRECTORIES[0]];
}

export interface AddComponentRequest {
	name: string;
	/** Parts besides `Root`, which is always generated. */
	parts: string[];
	framework: Framework;
	/** Workspace-relative directory the component's own folder goes in. */
	directory: string;
	fileExists: (relativePath: string) => boolean;
}

export interface AddComponentPlan {
	name: string;
	parts: string[];
	framework: Framework;
	/** Workspace-relative directory holding the generated files. */
	componentDirectory: string;
	/** Files to write, paths workspace-relative. */
	files: ScaffoldFile[];
	/** Paths that already exist — the command refuses to overwrite these. */
	conflicts: string[];
	/** The file to open once written. */
	primaryFile: string;
}

/**
 * A component gets its own directory, the way the library's own components do
 * (`components/accordion/Accordion.tsx`, not `components/Accordion.tsx`). Vue
 * needs it — one SFC per part — and it keeps the types and barrel next to the
 * component everywhere else.
 */
export function planAddComponent(
	request: AddComponentRequest,
): AddComponentPlan {
	const componentDirectory = joinPath(request.directory, request.name);

	const files = scaffoldFiles(
		request.framework,
		request.name,
		request.parts,
	).map((file) => ({
		path: joinPath(componentDirectory, file.path),
		contents: file.contents,
	}));

	return {
		name: request.name,
		parts: request.parts,
		framework: request.framework,
		componentDirectory,
		files,
		conflicts: files
			.map((file) => file.path)
			.filter((path) => request.fileExists(path)),
		primaryFile: joinPath(
			componentDirectory,
			request.framework === "vue"
				? `${request.name}Root.vue`
				: `${request.name}.tsx`,
		),
	};
}

/** A human-readable summary of the plan, for the confirmation dialog. */
export function describeAddComponentPlan(plan: AddComponentPlan): string {
	const parts = [`Root`, ...plan.parts]
		.map((part) => `${plan.name}.${part}`)
		.join(", ");

	return [`${parts}`, "", ...plan.files.map((file) => `• ${file.path}`)].join(
		"\n",
	);
}

function joinPath(...segments: string[]): string {
	return segments
		.map((segment) => segment.replace(/^\/+|\/+$/g, ""))
		.filter(Boolean)
		.join("/");
}
