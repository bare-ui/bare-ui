// What `Wire UI: Init` will do, decided before it does any of it.
//
// The command shows this plan to the user and then executes it, so the decision
// making is a pure function over a workspace snapshot — testable, and impossible
// for the confirmation dialog to describe inaccurately.

import type { Framework } from "@wire-ui/typescript-plugin/metadata";
import {
	detectPackageManager,
	frameworkPackage,
	installCommand,
	installedFrameworks,
	missingPeers,
	resolveThemePath,
	type DetectedPackageManager,
} from "./detect.js";

/** A snapshot of the workspace root, gathered by the command layer. */
export interface WorkspaceSnapshot {
	/** File names directly in the workspace root. */
	rootFiles: readonly string[];
	/** Directory names directly in the workspace root. */
	rootDirectories: readonly string[];
	/** Parsed `package.json`, or undefined when there is none (or it is unreadable). */
	manifest?: unknown;
	/** Whether a `package.json` file exists, even if it failed to parse. */
	hasManifest: boolean;
	/**
	 * Whether a workspace-relative path exists. Injected rather than derived from
	 * `rootFiles` because the stylesheet's home is usually a subdirectory, which a
	 * root listing cannot speak to.
	 */
	fileExists: (relativePath: string) => boolean;
}

export interface InitPlan {
	framework: Framework;
	packageManager: DetectedPackageManager;
	/** Packages the install command adds; empty when all are already declared. */
	packages: string[];
	/** The command to run, or undefined when there is nothing to install. */
	installCommand?: string;
	/** True when `@wire-ui/<framework>` is already a dependency. */
	frameworkAlreadyInstalled: boolean;
	/** True when Init has to write a minimal `package.json` first. */
	createsManifest: boolean;
	theme: {
		/** Workspace-relative path of the starter stylesheet. */
		path: string;
		/** `keep` when a file is already there — Init never overwrites one. */
		action: "create" | "keep";
	};
	/** True when the workspace is already set up and there is nothing to do. */
	isNoop: boolean;
}

/**
 * Decide the whole of Init up front.
 *
 * Two graceful-degradation rules carry most of the weight here. An existing
 * `@wire-ui/<framework>` dependency is left alone rather than reinstalled — a
 * bare `install` would move the workspace to the latest version, which is not
 * what "initialise" should mean to someone who ran the command to add a
 * stylesheet. And an existing stylesheet at the target path is never
 * overwritten, because the user's own theme is exactly the file that would be
 * sitting there.
 */
export function planInit(
	snapshot: WorkspaceSnapshot,
	framework: Framework,
): InitPlan {
	const packageManager = detectPackageManager({
		rootFiles: snapshot.rootFiles,
		packageManagerField: readPackageManagerField(snapshot.manifest),
	});

	const frameworkAlreadyInstalled = installedFrameworks(
		snapshot.manifest,
	).includes(framework);

	const packages = [
		...(frameworkAlreadyInstalled ? [] : [frameworkPackage(framework)]),
		...missingPeers(snapshot.manifest, framework),
	];

	const themePath = resolveThemePath(snapshot.rootDirectories);
	const theme = {
		path: themePath,
		action: snapshot.fileExists(themePath)
			? ("keep" as const)
			: ("create" as const),
	};

	return {
		framework,
		packageManager,
		packages,
		installCommand:
			packages.length > 0
				? installCommand(packageManager.manager, packages)
				: undefined,
		frameworkAlreadyInstalled,
		createsManifest: !snapshot.hasManifest,
		theme,
		isNoop:
			packages.length === 0 &&
			theme.action === "keep" &&
			snapshot.hasManifest,
	};
}

function readPackageManagerField(manifest: unknown): unknown {
	if (typeof manifest !== "object" || manifest === null) return undefined;
	return (manifest as Record<string, unknown>).packageManager;
}

/** The minimal `package.json` written into a workspace that has none. */
export function minimalManifest(folderName: string): string {
	const name =
		folderName
			.toLowerCase()
			.replace(/[^a-z0-9._-]+/g, "-")
			.replace(/^[-_.]+|[-_.]+$/g, "") || "wire-ui-app";

	return `${JSON.stringify({ name, version: "0.0.0", private: true, type: "module" }, null, 2)}\n`;
}

/** A human-readable summary of the plan, for the confirmation dialog. */
export function describePlan(plan: InitPlan): string[] {
	const lines: string[] = [];

	if (plan.createsManifest) lines.push("Create package.json");

	if (plan.installCommand)
		lines.push(
			`Run \`${plan.installCommand}\` (${plan.packageManager.manager} detected from ${describeSource(plan.packageManager)})`,
		);
	else if (plan.frameworkAlreadyInstalled)
		lines.push(
			`Skip install — ${frameworkPackage(plan.framework)} is already a dependency`,
		);

	lines.push(
		plan.theme.action === "create"
			? `Write starter styles to ${plan.theme.path}`
			: `Keep the existing ${plan.theme.path}`,
	);

	return lines;
}

function describeSource(detected: DetectedPackageManager): string {
	switch (detected.source) {
		case "packageManager":
			return "the packageManager field";
		case "lockfile":
			return "the lockfile";
		case "default":
			return "no lockfile — defaulting to npm";
	}
}
