import { describe, expect, it } from "vitest";
import {
	describePlan,
	minimalManifest,
	planInit,
	type WorkspaceSnapshot,
} from "./plan.js";

/** An empty workspace, with overrides for whatever a case cares about. */
function snapshot(
	overrides: Partial<WorkspaceSnapshot> = {},
): WorkspaceSnapshot {
	return {
		rootFiles: [],
		rootDirectories: [],
		hasManifest: false,
		fileExists: () => false,
		...overrides,
	};
}

describe("planInit", () => {
	it("takes an empty workspace to a full setup", () => {
		const plan = planInit(snapshot(), "react");

		expect(plan.createsManifest).toBe(true);
		expect(plan.packages).toEqual([
			"@wire-ui/react",
			"react@^19",
			"react-dom@^19",
		]);
		expect(plan.installCommand).toBe(
			"npm install @wire-ui/react react@^19 react-dom@^19",
		);
		expect(plan.theme).toEqual({ path: "wire-ui.css", action: "create" });
		expect(plan.isNoop).toBe(false);
	});

	it("installs only Wire UI when the framework is already there", () => {
		const plan = planInit(
			snapshot({
				hasManifest: true,
				rootFiles: ["package.json", "pnpm-lock.yaml"],
				rootDirectories: ["src"],
				manifest: {
					dependencies: { react: "^19.1.0", "react-dom": "^19.1.0" },
				},
			}),
			"react",
		);

		expect(plan.packages).toEqual(["@wire-ui/react"]);
		expect(plan.installCommand).toBe("pnpm add @wire-ui/react");
		expect(plan.createsManifest).toBe(false);
		expect(plan.theme.path).toBe("src/wire-ui.css");
	});

	it("skips the install when Wire UI and its peers are all present", () => {
		const plan = planInit(
			snapshot({
				hasManifest: true,
				rootFiles: ["package.json"],
				manifest: {
					dependencies: {
						"@wire-ui/vue": "^0.5.0",
						vue: "^3.5.13",
					},
				},
			}),
			"vue",
		);

		expect(plan.frameworkAlreadyInstalled).toBe(true);
		expect(plan.packages).toEqual([]);
		expect(plan.installCommand).toBeUndefined();
		// Still worth running: the stylesheet is the other half of the command.
		expect(plan.theme.action).toBe("create");
		expect(plan.isNoop).toBe(false);
	});

	it("never overwrites an existing stylesheet", () => {
		const plan = planInit(
			snapshot({
				hasManifest: true,
				rootDirectories: ["src"],
				fileExists: (relativePath) =>
					relativePath === "src/wire-ui.css",
				manifest: { dependencies: { "@wire-ui/react": "^0.5.0" } },
			}),
			"react",
		);

		expect(plan.theme).toEqual({ path: "src/wire-ui.css", action: "keep" });
	});

	it("is a no-op once the workspace is fully set up", () => {
		const plan = planInit(
			snapshot({
				hasManifest: true,
				rootDirectories: ["src"],
				fileExists: (relativePath) =>
					relativePath === "src/wire-ui.css",
				manifest: {
					dependencies: {
						"@wire-ui/react": "^0.5.0",
						react: "^19.1.0",
						"react-dom": "^19.1.0",
					},
				},
			}),
			"react",
		);

		expect(plan.isNoop).toBe(true);
	});

	it("honours the packageManager field over the lockfile", () => {
		const plan = planInit(
			snapshot({
				hasManifest: true,
				rootFiles: ["package.json", "package-lock.json"],
				manifest: { packageManager: "yarn@4.5.0" },
			}),
			"solid",
		);

		expect(plan.packageManager).toEqual({
			manager: "yarn",
			source: "packageManager",
		});
		expect(plan.installCommand).toBe(
			"yarn add @wire-ui/solid solid-js@^1.9",
		);
	});

	it("treats a malformed package.json as declaring nothing, but keeps it", () => {
		const plan = planInit(
			snapshot({ hasManifest: true, rootFiles: ["package.json"] }),
			"react",
		);

		expect(plan.createsManifest).toBe(false);
		expect(plan.packages).toContain("@wire-ui/react");
	});
});

describe("describePlan", () => {
	it("names every step it is about to take", () => {
		const lines = describePlan(planInit(snapshot(), "react"));

		expect(lines[0]).toBe("Create package.json");
		expect(lines[1]).toContain("npm install @wire-ui/react");
		expect(lines[1]).toContain("no lockfile");
		expect(lines[2]).toBe("Write starter styles to wire-ui.css");
	});

	it("says why the install is being skipped", () => {
		const lines = describePlan(
			planInit(
				snapshot({
					hasManifest: true,
					manifest: {
						dependencies: { "@wire-ui/vue": "^0.5.0", vue: "^3.5" },
					},
				}),
				"vue",
			),
		);

		expect(lines[0]).toContain("Skip install");
		expect(lines[0]).toContain("@wire-ui/vue");
	});
});

describe("minimalManifest", () => {
	it("names the package after the folder", () => {
		expect(JSON.parse(minimalManifest("my-app")).name).toBe("my-app");
	});

	it("makes an npm-legal name out of an awkward folder name", () => {
		expect(JSON.parse(minimalManifest("My App (v2)")).name).toBe(
			"my-app-v2",
		);
		expect(JSON.parse(minimalManifest("...")).name).toBe("wire-ui-app");
	});

	it("is private, so a stray publish cannot happen", () => {
		expect(JSON.parse(minimalManifest("app")).private).toBe(true);
	});

	it("ends with a newline", () => {
		expect(minimalManifest("app").endsWith("\n")).toBe(true);
	});
});
