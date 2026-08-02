import * as fs from "node:fs";
import { fileURLToPath } from "node:url";
import { beforeEach, describe, expect, it } from "vitest";
import { __reset, __state } from "./test/vscode.js";
import { activate, deactivate } from "./extension.js";

// Activation, and the manifest facts that decide whether the .vsix installs at
// all. Both matter most on the VS Code forks (Cursor, Windsurf, VSCodium): a
// fork that lags upstream, or ships a different built-in TypeScript extension,
// is exactly where a too-high engine floor or an unguarded `exports.getAPI`
// turns into "does nothing on launch".

const manifest = JSON.parse(
	fs.readFileSync(
		fileURLToPath(new URL("../package.json", import.meta.url)),
		"utf8",
	),
) as {
	main: string;
	icon: string;
	engines: Record<string, string>;
	activationEvents: string[];
	enabledApiProposals?: string[];
	devDependencies: Record<string, string>;
	contributes: {
		commands: { command: string; title: string }[];
		typescriptServerPlugins: { name: string }[];
	};
};

function context(): { subscriptions: { dispose(): void }[] } {
	return { subscriptions: [] };
}

/** A TypeScript extension that behaves — the happy path on stock VS Code. */
function workingTypeScriptExtension(configured: string[]): void {
	__state.onGetExtension = () => ({
		activate: () => Promise.resolve(),
		exports: {
			getAPI: () => ({
				configurePlugin: (id: string) => configured.push(id),
			}),
		},
	});
}

beforeEach(() => {
	__reset();
});

describe("activate", () => {
	it("registers every command the manifest advertises", async () => {
		const ctx = context();
		await activate(ctx as never);

		const declared = manifest.contributes.commands
			.map((entry) => entry.command)
			.sort();
		expect([...__state.commands.keys()].sort()).toEqual(declared);
	});

	it("stands up the output channel and the status bar", async () => {
		await activate(context() as never);

		expect(__state.outputChannels.map((channel) => channel.name)).toEqual([
			"Wire UI",
		]);
		expect(__state.statusBarItems).toHaveLength(1);
		expect(__state.statusBarItems[0].shown).toBe(true);
	});

	it("registers the snippet completion provider", async () => {
		await activate(context() as never);
		expect(__state.registrations.length).toBeGreaterThan(0);
	});

	it("configures the TypeScript plugin when the host offers the API", async () => {
		const configured: string[] = [];
		workingTypeScriptExtension(configured);

		await activate(context() as never);

		// Read from the manifest rather than repeated here: `configurePlugin`
		// keys off the name tsserver loaded the plugin under, so a manifest rename
		// that leaves the code behind is a silent no-op, not a crash.
		expect(configured).toEqual([
			manifest.contributes.typescriptServerPlugins[0].name,
		]);
	});

	// The three ways a fork can differ from stock VS Code. None may take the
	// extension down with it: everything except the TS plugin still works.
	it("activates when the host has no TypeScript extension", async () => {
		__state.onGetExtension = () => undefined;

		const ctx = context();
		await expect(activate(ctx as never)).resolves.toBeUndefined();
		expect(__state.commands.size).toBe(manifest.contributes.commands.length);
	});

	it("activates when the TypeScript extension exposes no API", async () => {
		__state.onGetExtension = () => ({
			activate: () => Promise.resolve(),
			exports: {},
		});

		await expect(activate(context() as never)).resolves.toBeUndefined();
		expect(__state.statusBarItems[0].shown).toBe(true);
	});

	it("activates when configuring the plugin throws", async () => {
		__state.onGetExtension = () => ({
			activate: () => Promise.resolve(),
			exports: {
				getAPI: () => ({
					configurePlugin: () => {
						throw new Error("fork does not implement this");
					},
				}),
			},
		});

		await expect(activate(context() as never)).resolves.toBeUndefined();
		const logged = __state.outputChannels[0].lines.join(" ");
		expect(logged).toContain("Failed to configure TypeScript plugin");
	});

	it("puts everything it creates on context.subscriptions", async () => {
		const ctx = context();
		await activate(ctx as never);

		// Output channel, the status bar registration, snippets, and one per
		// command-owning module.
		expect(ctx.subscriptions.length).toBeGreaterThanOrEqual(6);
		expect(() => {
			for (const subscription of ctx.subscriptions) subscription.dispose();
			deactivate();
		}).not.toThrow();

		expect(__state.commands.size).toBe(0);
		expect(__state.statusBarItems[0].disposed).toBe(true);
		expect(__state.outputChannels[0].disposed).toBe(true);
	});
});

describe("manifest — what decides whether the .vsix installs", () => {
	it("pins @types/vscode to exactly the engine floor", () => {
		// The types package *is* the API floor: `^1.82.0` resolves to whatever
		// the latest types are, and the compiler then happily accepts calls that
		// do not exist on the oldest host we claim to support. Pinning is what
		// makes `tsc` fail instead of a user on a lagging fork.
		const types = manifest.devDependencies["@types/vscode"];
		expect(types).toMatch(/^\d+\.\d+\.\d+$/);
		expect(manifest.engines.vscode).toBe(`^${types}`);
	});

	it("declares no proposed APIs", () => {
		// Proposed APIs cannot be published to either registry, and forks
		// implement them selectively when they implement them at all.
		expect(manifest.enabledApiProposals).toBeUndefined();
	});

	it("ships an icon that exists", () => {
		const icon = fileURLToPath(
			new URL(`../${manifest.icon}`, import.meta.url),
		);
		expect(fs.existsSync(icon)).toBe(true);
	});

	it("points `main` at the bundled output", () => {
		expect(manifest.main).toBe("./dist/extension.js");
	});

	it("activates on the languages it claims to support", () => {
		expect(manifest.activationEvents).toContain("onLanguage:typescriptreact");
		expect(manifest.activationEvents).toContain("onLanguage:vue");
	});

	it("gives every command a title, so the palette can show it", () => {
		for (const command of manifest.contributes.commands) {
			expect(command.title).toBeTruthy();
			expect(command.command.startsWith("wire-ui.")).toBe(true);
		}
	});
});
