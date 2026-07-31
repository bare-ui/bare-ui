// Reading a workspace well enough to install into it.
//
// Everything here is a pure function over a snapshot of the workspace — the
// file names at its root, its parsed `package.json` — so the decisions Init
// makes are unit-testable without a real folder on disk. The command layer
// (`command.ts`) does the I/O and hands the results in.

import {
	FRAMEWORKS,
	type Framework,
} from "@wire-ui/typescript-plugin/metadata";

export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

/** How a package manager was decided on — surfaced so the user can see why. */
export type PackageManagerSource = "packageManager" | "lockfile" | "default";

export interface DetectedPackageManager {
	manager: PackageManager;
	source: PackageManagerSource;
}

/**
 * Lockfile → manager. `bun.lock` is Bun 1.2's text lockfile; `bun.lockb` the
 * binary one it replaced. Both still appear in the wild.
 */
const LOCKFILES: ReadonlyArray<readonly [string, PackageManager]> = [
	["pnpm-lock.yaml", "pnpm"],
	["bun.lock", "bun"],
	["bun.lockb", "bun"],
	["yarn.lock", "yarn"],
	["package-lock.json", "npm"],
];

const MANAGERS: readonly PackageManager[] = ["npm", "pnpm", "yarn", "bun"];

function isPackageManager(value: string): value is PackageManager {
	return (MANAGERS as readonly string[]).includes(value);
}

/**
 * Which package manager to drive.
 *
 * The `packageManager` field wins: it is Corepack's declaration of intent, and
 * running a different manager against a repo that pins one is how you end up
 * with two lockfiles. A lockfile is the next best evidence. Failing both, npm —
 * it is the one manager guaranteed to be present wherever Node is.
 *
 * Lockfile precedence matters only in the already-broken case of a workspace
 * holding several; pnpm and bun are checked before yarn and npm because their
 * users are the likeliest to have a stray `package-lock.json` lying around.
 */
export function detectPackageManager(workspace: {
	rootFiles: readonly string[];
	packageManagerField?: unknown;
}): DetectedPackageManager {
	const field = workspace.packageManagerField;
	if (typeof field === "string") {
		// The field is `name@version`; a name alone is tolerated since it is a
		// common hand-written shorthand.
		const name = field.split("@")[0].trim();
		if (isPackageManager(name))
			return { manager: name, source: "packageManager" };
	}

	const present = new Set(workspace.rootFiles);
	for (const [lockfile, manager] of LOCKFILES)
		if (present.has(lockfile)) return { manager, source: "lockfile" };

	return { manager: "npm", source: "default" };
}

/** The command that adds `packages` as production dependencies. */
export function installCommand(
	manager: PackageManager,
	packages: readonly string[],
): string {
	const verb = manager === "npm" ? "install" : "add";
	return `${manager} ${verb} ${packages.join(" ")}`;
}

/** The framework package a Wire UI install centres on. */
export function frameworkPackage(framework: Framework): string {
	return `@wire-ui/${framework}`;
}

/**
 * Peer dependencies Wire UI expects the workspace to bring. Wire UI itself has
 * no production dependencies; these are the host framework, which most
 * workspaces already have — `missingPeers` is what decides whether to add them.
 *
 * Ranges mirror the published peer ranges (see `getting-started.mdx`).
 */
const PEERS: Record<Framework, readonly string[]> = {
	react: ["react@^19", "react-dom@^19"],
	vue: ["vue@^3.5"],
	solid: ["solid-js@^1.9"],
};

/** Every dependency name the manifest declares, across all dependency fields. */
export function declaredDependencies(manifest: unknown): Set<string> {
	const names = new Set<string>();
	if (typeof manifest !== "object" || manifest === null) return names;

	const record = manifest as Record<string, unknown>;
	for (const field of [
		"dependencies",
		"devDependencies",
		"peerDependencies",
		"optionalDependencies",
	]) {
		const deps = record[field];
		if (typeof deps === "object" && deps !== null)
			for (const name of Object.keys(deps)) names.add(name);
	}
	return names;
}

/** Peer packages the workspace does not already declare, version range included. */
export function missingPeers(
	manifest: unknown,
	framework: Framework,
): string[] {
	const declared = declaredDependencies(manifest);
	// A peer is spelled `name@range`; the declaration check is on the name.
	return PEERS[framework].filter((peer) => {
		const name = peer.slice(0, peer.lastIndexOf("@"));
		return !declared.has(name);
	});
}

/** Wire UI framework packages the workspace already depends on, in catalog order. */
export function installedFrameworks(manifest: unknown): Framework[] {
	const declared = declaredDependencies(manifest);
	return FRAMEWORKS.filter((framework) =>
		declared.has(frameworkPackage(framework)),
	);
}

/**
 * Where the starter stylesheet goes. A `src/` directory is the near-universal
 * convention in the frameworks Wire UI targets, and dropping a stylesheet at the
 * repo root of a Vite or Next app puts it somewhere the bundler won't look.
 * Directory names are workspace-root-relative, as is the returned path.
 */
export function resolveThemePath(rootDirectories: readonly string[]): string {
	const dirs = new Set(rootDirectories);
	if (dirs.has("src")) return "src/wire-ui.css";
	if (dirs.has("app")) return "app/wire-ui.css";
	if (dirs.has("styles")) return "styles/wire-ui.css";
	return "wire-ui.css";
}
