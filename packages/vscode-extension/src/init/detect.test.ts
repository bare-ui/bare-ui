import { describe, expect, it } from "vitest";
import {
	declaredDependencies,
	detectPackageManager,
	installCommand,
	installedFrameworks,
	missingPeers,
	resolveThemePath,
} from "./detect.js";

describe("detectPackageManager", () => {
	it("defaults to npm in a workspace with no evidence", () => {
		expect(detectPackageManager({ rootFiles: [] })).toEqual({
			manager: "npm",
			source: "default",
		});
	});

	it.each([
		["pnpm-lock.yaml", "pnpm"],
		["yarn.lock", "yarn"],
		["bun.lock", "bun"],
		["bun.lockb", "bun"],
		["package-lock.json", "npm"],
	])("reads %s as %s", (lockfile, manager) => {
		expect(detectPackageManager({ rootFiles: [lockfile] })).toEqual({
			manager,
			source: "lockfile",
		});
	});

	it("lets the packageManager field outrank a lockfile", () => {
		expect(
			detectPackageManager({
				rootFiles: ["package-lock.json"],
				packageManagerField: "pnpm@9.1.0",
			}),
		).toEqual({ manager: "pnpm", source: "packageManager" });
	});

	it("accepts a packageManager field without a version", () => {
		expect(
			detectPackageManager({
				rootFiles: [],
				packageManagerField: "yarn",
			}),
		).toEqual({ manager: "yarn", source: "packageManager" });
	});

	it("ignores a packageManager field naming something unknown", () => {
		expect(
			detectPackageManager({
				rootFiles: ["yarn.lock"],
				packageManagerField: "cnpm@1.0.0",
			}),
		).toEqual({ manager: "yarn", source: "lockfile" });
	});

	it("prefers pnpm over a stray npm lockfile", () => {
		expect(
			detectPackageManager({
				rootFiles: ["package-lock.json", "pnpm-lock.yaml"],
			}).manager,
		).toBe("pnpm");
	});
});

describe("installCommand", () => {
	it("uses `install` for npm and `add` for the rest", () => {
		expect(installCommand("npm", ["@wire-ui/react"])).toBe(
			"npm install @wire-ui/react",
		);
		expect(installCommand("pnpm", ["@wire-ui/react"])).toBe(
			"pnpm add @wire-ui/react",
		);
		expect(installCommand("yarn", ["@wire-ui/vue"])).toBe(
			"yarn add @wire-ui/vue",
		);
		expect(installCommand("bun", ["@wire-ui/solid"])).toBe(
			"bun add @wire-ui/solid",
		);
	});

	it("passes several packages in one command", () => {
		expect(installCommand("npm", ["@wire-ui/react", "react@^19"])).toBe(
			"npm install @wire-ui/react react@^19",
		);
	});
});

describe("declaredDependencies", () => {
	it("gathers names across every dependency field", () => {
		const names = declaredDependencies({
			dependencies: { react: "^19.0.0" },
			devDependencies: { vitest: "^4.0.0" },
			peerDependencies: { "react-dom": "^19.0.0" },
			optionalDependencies: { fsevents: "^2.0.0" },
		});
		expect([...names].sort()).toEqual([
			"fsevents",
			"react",
			"react-dom",
			"vitest",
		]);
	});

	it("survives a missing or malformed manifest", () => {
		expect(declaredDependencies(undefined).size).toBe(0);
		expect(declaredDependencies(null).size).toBe(0);
		expect(declaredDependencies("not an object").size).toBe(0);
		expect(declaredDependencies({ dependencies: "nonsense" }).size).toBe(0);
	});
});

describe("missingPeers", () => {
	it("asks for the framework when the workspace has none", () => {
		expect(missingPeers({}, "react")).toEqual([
			"react@^19",
			"react-dom@^19",
		]);
		expect(missingPeers({}, "vue")).toEqual(["vue@^3.5"]);
		expect(missingPeers({}, "solid")).toEqual(["solid-js@^1.9"]);
	});

	it("leaves peers the workspace already declares alone", () => {
		const manifest = { dependencies: { react: "^19.1.0" } };
		expect(missingPeers(manifest, "react")).toEqual(["react-dom@^19"]);
	});

	it("counts a devDependency as declared", () => {
		const manifest = { devDependencies: { vue: "^3.5.13" } };
		expect(missingPeers(manifest, "vue")).toEqual([]);
	});

	it("does not mistake the version range for part of the name", () => {
		// `solid-js@^1.9` splits at the *last* @, so scoped names stay intact.
		expect(
			missingPeers({ dependencies: { "solid-js": "1.9.0" } }, "solid"),
		).toEqual([]);
	});
});

describe("installedFrameworks", () => {
	it("finds Wire UI packages in catalog order", () => {
		const manifest = {
			dependencies: {
				"@wire-ui/vue": "^0.5.0",
				"@wire-ui/react": "^0.5.0",
			},
		};
		expect(installedFrameworks(manifest)).toEqual(["react", "vue"]);
	});

	it("returns nothing for a workspace without Wire UI", () => {
		expect(installedFrameworks({ dependencies: { react: "^19" } })).toEqual(
			[],
		);
	});
});

describe("resolveThemePath", () => {
	it("prefers src/, then app/, then styles/", () => {
		expect(resolveThemePath(["src", "app", "styles"])).toBe(
			"src/wire-ui.css",
		);
		expect(resolveThemePath(["app", "styles"])).toBe("app/wire-ui.css");
		expect(resolveThemePath(["styles"])).toBe("styles/wire-ui.css");
	});

	it("falls back to the workspace root", () => {
		expect(resolveThemePath([])).toBe("wire-ui.css");
		expect(resolveThemePath(["public", "node_modules"])).toBe(
			"wire-ui.css",
		);
	});
});
