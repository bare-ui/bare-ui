import { beforeEach, describe, expect, it } from "vitest";
import { __reset, __runCommand, __state } from "../test/vscode.js";
import {
	OPEN_PLAYGROUND_COMMAND_ID,
	PLAYGROUND_URL,
	registerOpenPlaygroundCommand,
} from "./command.js";

// The command is a stub until 0.6 ships playground.wire-ui.com. What is worth
// asserting is that it stays one: registered and discoverable, honest about
// being unavailable, and exporting nothing.

const logged: string[] = [];

const output = {
	appendLine(line: string) {
		logged.push(line);
	},
	show() {},
	dispose() {},
} as unknown as import("vscode").OutputChannel;

beforeEach(() => {
	__reset();
	logged.length = 0;
	registerOpenPlaygroundCommand(output);
});

describe("Wire UI: Open Playground (stub)", () => {
	it("registers under the manifest's command id", () => {
		expect(__state.commands.has(OPEN_PLAYGROUND_COMMAND_ID)).toBe(true);
	});

	it("says it is not available yet, and why", async () => {
		await __runCommand(OPEN_PLAYGROUND_COMMAND_ID);

		const [message] = __state.messages;
		expect(message.kind).toBe("info");
		expect(message.message).toContain("0.6");
		expect(message.message).toContain("Nothing was exported");
	});

	it("exports nothing — no clipboard, no editor, no browser", async () => {
		await __runCommand(OPEN_PLAYGROUND_COMMAND_ID);

		expect(__state.clipboard).toBe("");
		expect(__state.openedDocuments).toEqual([]);
	});

	it("records the attempt in the log", async () => {
		await __runCommand(OPEN_PLAYGROUND_COMMAND_ID);
		expect(logged.join(" ")).toContain(PLAYGROUND_URL);
	});

	it("unregisters when disposed", () => {
		const registration = registerOpenPlaygroundCommand(output);
		registration.dispose();
		expect(__state.commands.has(OPEN_PLAYGROUND_COMMAND_ID)).toBe(false);
	});
});
