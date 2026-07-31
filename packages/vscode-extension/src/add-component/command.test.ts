import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
	__reset,
	__runCommand,
	__state,
	type InputBoxOptions,
	type ShownMessage,
} from "../test/vscode.js";
import {
	ADD_COMPONENT_COMMAND_ID,
	registerAddComponentCommand,
} from "./command.js";

let root: string;

const output = {
	appendLine() {},
	show() {},
	dispose() {},
} as unknown as import("vscode").OutputChannel;

/** Answers the input boxes in order: name, then parts. */
function answerPrompts(name: string, parts?: string): void {
	const answers = [name, ...(parts === undefined ? [] : [parts])];
	let index = 0;
	__state.onInputBox = (options: InputBoxOptions) =>
		index < answers.length ? answers[index++] : options.value;
}

function acceptDialogs(): void {
	__state.onMessage = (message: ShownMessage) => message.items[0];
}

function useWorkspace(fsPath: string): void {
	__state.workspaceFolders = [{ uri: { fsPath }, name: "my-app", index: 0 }];
}

function write(relativePath: string, contents: string): void {
	const target = path.join(root, ...relativePath.split("/"));
	fs.mkdirSync(path.dirname(target), { recursive: true });
	fs.writeFileSync(target, contents, "utf8");
}

function read(relativePath: string): string {
	return fs.readFileSync(path.join(root, ...relativePath.split("/")), "utf8");
}

function exists(relativePath: string): boolean {
	return fs.existsSync(path.join(root, ...relativePath.split("/")));
}

/** A workspace already depending on one framework, so no framework prompt shows. */
function reactWorkspace(): void {
	write(
		"package.json",
		JSON.stringify({ dependencies: { "@wire-ui/react": "^0.5.0" } }),
	);
}

beforeEach(() => {
	__reset();
	root = fs.mkdtempSync(path.join(os.tmpdir(), "wire-ui-add-"));
	registerAddComponentCommand(output);
	useWorkspace(root);
});

afterEach(() => {
	fs.rmSync(root, { recursive: true, force: true });
});

describe("registration", () => {
	it("registers under the id the manifest contributes", () => {
		expect(__state.commands.has(ADD_COMPONENT_COMMAND_ID)).toBe(true);
		expect(ADD_COMPONENT_COMMAND_ID).toBe("wire-ui.addComponent");
	});
});

describe("writing a component", () => {
	it("writes the compound component into its own directory", async () => {
		reactWorkspace();
		fs.mkdirSync(path.join(root, "src", "components"), { recursive: true });
		answerPrompts("Rating", "Trigger, Content");
		__state.onQuickPick = (items) => items[0]; // src/components
		acceptDialogs();

		await __runCommand(ADD_COMPONENT_COMMAND_ID);

		expect(exists("src/components/Rating/Rating.tsx")).toBe(true);
		expect(exists("src/components/Rating/Rating.types.ts")).toBe(true);
		expect(exists("src/components/Rating/index.ts")).toBe(true);

		const source = read("src/components/Rating/Rating.tsx");
		expect(source).toContain("const RatingContext = createContext");
		expect(source).toContain("Root.displayName = 'Rating.Root'");
		expect(source).toContain(
			"export const Rating = { Root, Trigger, Content }",
		);
	});

	it("converts a loosely typed name to PascalCase", async () => {
		reactWorkspace();
		answerPrompts("rating stars", "Item");
		__state.onQuickPick = (items) => items[0];
		acceptDialogs();

		await __runCommand(ADD_COMPONENT_COMMAND_ID);

		expect(exists("src/components/RatingStars/RatingStars.tsx")).toBe(true);
	});

	it("writes one SFC per part in a Vue workspace", async () => {
		write(
			"package.json",
			JSON.stringify({ dependencies: { "@wire-ui/vue": "^0.5.0" } }),
		);
		answerPrompts("Rating", "Trigger, Content");
		__state.onQuickPick = (items) => items[0];
		acceptDialogs();

		await __runCommand(ADD_COMPONENT_COMMAND_ID);

		expect(exists("src/components/Rating/RatingRoot.vue")).toBe(true);
		expect(exists("src/components/Rating/RatingTrigger.vue")).toBe(true);
		expect(exists("src/components/Rating/RatingContent.vue")).toBe(true);
		expect(exists("src/components/Rating/keys.ts")).toBe(true);
	});

	it("opens the component it wrote", async () => {
		reactWorkspace();
		answerPrompts("Rating", "Trigger");
		__state.onQuickPick = (items) => items[0];
		acceptDialogs();

		await __runCommand(ADD_COMPONENT_COMMAND_ID);

		expect(__state.openedDocuments).toEqual([
			path.join(root, "src", "components", "Rating", "Rating.tsx"),
		]);
	});

	it("asks which framework when the workspace has none", async () => {
		// No package.json at all, so the framework cannot be inferred.
		const placeHolders: string[] = [];
		__state.onQuickPick = (items, options) => {
			placeHolders.push(
				(options as { placeHolder?: string }).placeHolder ?? "",
			);
			return items[0];
		};
		answerPrompts("Rating", "Trigger");
		acceptDialogs();

		await __runCommand(ADD_COMPONENT_COMMAND_ID);

		expect(placeHolders).toHaveLength(2);
		expect(placeHolders[0]).toContain("Which framework");
		expect(placeHolders[1]).toContain("Where should the component go?");
		// React is offered first, so that is what the first pick selects.
		expect(exists("src/components/Rating/Rating.tsx")).toBe(true);
	});

	it("does not ask which framework when the workspace already has one", async () => {
		reactWorkspace();
		const placeHolders: string[] = [];
		__state.onQuickPick = (items, options) => {
			placeHolders.push(
				(options as { placeHolder?: string }).placeHolder ?? "",
			);
			return items[0];
		};
		answerPrompts("Rating", "Trigger");
		acceptDialogs();

		await __runCommand(ADD_COMPONENT_COMMAND_ID);

		expect(placeHolders).toEqual([
			expect.stringContaining("Where should the component go?"),
		]);
	});
});

describe("refusing to clobber", () => {
	it("stops when a file is already there", async () => {
		reactWorkspace();
		write("src/components/Rating/index.ts", "// mine\n");
		answerPrompts("Rating", "Trigger");
		__state.onQuickPick = (items) => items[0];
		acceptDialogs();

		await __runCommand(ADD_COMPONENT_COMMAND_ID);

		expect(read("src/components/Rating/index.ts")).toBe("// mine\n");
		expect(exists("src/components/Rating/Rating.tsx")).toBe(false);

		const errors = __state.messages.filter((m) => m.kind === "error");
		expect(errors).toHaveLength(1);
		expect(errors[0].message).toContain("already exists");
	});
});

describe("bailing out", () => {
	it("writes nothing when the confirmation is dismissed", async () => {
		reactWorkspace();
		answerPrompts("Rating", "Trigger");
		__state.onQuickPick = (items) => items[0];
		__state.onMessage = () => undefined;

		await __runCommand(ADD_COMPONENT_COMMAND_ID);

		expect(exists("src/components/Rating")).toBe(false);
	});

	it("writes nothing when the name prompt is dismissed", async () => {
		reactWorkspace();
		__state.onInputBox = () => undefined;

		await __runCommand(ADD_COMPONENT_COMMAND_ID);

		expect(exists("src/components")).toBe(false);
		expect(__state.messages).toHaveLength(0);
	});

	it("writes nothing when the directory pick is dismissed", async () => {
		reactWorkspace();
		answerPrompts("Rating", "Trigger");
		__state.onQuickPick = () => undefined;

		await __runCommand(ADD_COMPONENT_COMMAND_ID);

		expect(exists("src/components/Rating")).toBe(false);
	});

	it("asks for a folder before doing anything", async () => {
		__state.workspaceFolders = [];

		await __runCommand(ADD_COMPONENT_COMMAND_ID);

		const errors = __state.messages.filter((m) => m.kind === "error");
		expect(errors).toHaveLength(1);
		expect(errors[0].message).toContain("open a folder");
	});
});
