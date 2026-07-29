// End-to-end wiring for the snippet completion provider, driven through the
// `vscode` stub (see src/test/vscode.ts).

import { beforeEach, describe, expect, it } from "vitest";
import {
	Position,
	Range,
	SnippetString,
	__reset,
	__state,
	type Registration,
} from "../test/vscode.js";
import { registerSnippetCompletions } from "./provider.js";

const log = { appendLine() {} } as unknown as Parameters<
	typeof registerSnippetCompletions
>[0];

/** Just enough TextDocument for the provider; offsets index the raw text. */
function fakeDocument(text: string, languageId: string) {
	return {
		languageId,
		uri: { fsPath: "/workspace/file", toString: () => "file:///file" },
		getText: () => text,
		offsetAt: (position: Position) => position.character,
		positionAt: (offset: number) => new Position(0, offset),
		getWordRangeAtPosition(position: Position, pattern: RegExp) {
			const line = text.slice(0, position.character);
			const match = new RegExp(`(?:${pattern.source})$`).exec(line);
			if (!match) return undefined;
			return new Range(
				new Position(0, position.character - match[0].length),
				position,
			);
		},
	};
}

function provider(): Registration["provider"] {
	const registration = __state.registrations.at(-1);
	if (!registration) throw new Error("no completion provider registered");
	return registration.provider;
}

function complete(text: string, languageId: string, offset = text.length) {
	const document = fakeDocument(text, languageId);
	const items = provider().provideCompletionItems(
		document,
		new Position(0, offset),
	) as Array<{
		label: string;
		insertText: SnippetString;
		detail?: string;
		filterText?: string;
		range?: unknown;
	}>;
	return { document, items };
}

beforeEach(() => {
	__reset();
	registerSnippetCompletions(log);
});

describe("registration", () => {
	it("attaches to every language the extension activates on", () => {
		const selector = __state.registrations[0].selector as Array<{
			language: string;
			scheme: string;
		}>;
		expect(selector.map((s) => s.language)).toEqual([
			"javascript",
			"javascriptreact",
			"typescript",
			"typescriptreact",
			"vue",
		]);
		expect(selector.every((s) => s.scheme === "file")).toBe(true);
	});
});

describe("provideCompletionItems", () => {
	it("offers one snippet per component", () => {
		const { items } = complete("wire-", "typescriptreact");
		expect(items.length).toBeGreaterThan(50);
		const modal = items.find((item) => item.label === "wire-modal")!;
		expect(modal.detail).toBe("Wire UI · Modal");
		expect(modal.insertText.value).toContain("<Modal.Root");
		expect(modal.insertText.value.endsWith("$0")).toBe(true);
	});

	it("replaces the typed prefix rather than appending to it", () => {
		const { items } = complete("wire-mod", "typescriptreact");
		const modal = items.find((item) => item.label === "wire-modal")!;
		expect(modal.range).toEqual(
			new Range(new Position(0, 0), new Position(0, 8)),
		);
	});

	it("uses the framework the file imports from", () => {
		const source = "import { Input } from '@wire-ui/solid';\nwire-";
		const { items } = complete("wire-", "typescriptreact");
		expect(
			items.find((i) => i.label === "wire-input")!.insertText.value,
		).toContain("value={value\\}");

		const solid = provider().provideCompletionItems(
			fakeDocument(source, "typescriptreact"),
			new Position(0, source.length),
		) as Array<{ label: string; insertText: SnippetString }>;
		expect(
			solid.find((i) => i.label === "wire-input")!.insertText.value,
		).toContain("value={value()\\}");
	});

	it("serves Vue markup inside an SFC template and nothing outside it", () => {
		const sfc = "<script setup>\n</script>\n\n<template>\n\n</template>";
		const inTemplate = sfc.indexOf("<template>") + "<template>\n".length;

		const { items } = complete(sfc, "vue", inTemplate);
		expect(
			items.find((i) => i.label === "wire-modal")!.insertText.value,
		).toContain(':open="');

		expect(complete(sfc, "vue", 15).items).toEqual([]);
	});

	it("goes quiet when the extension is disabled", () => {
		__state.configuration.set("wire-ui.enable", false);
		expect(complete("wire-", "typescriptreact").items).toEqual([]);
	});
});

describe("resolveCompletionItem", () => {
	const resolve = (text: string, languageId: string, label: string) => {
		const { items } = complete(text, languageId);
		const item = items.find((i) => i.label === label)!;
		return provider().resolveCompletionItem!(item) as {
			additionalTextEdits?: Array<{
				position: Position;
				newText: string;
			}>;
		};
	};

	it("brings the component's import with it", () => {
		const resolved = resolve("wire-", "typescriptreact", "wire-modal");
		expect(resolved.additionalTextEdits).toHaveLength(1);
		expect(resolved.additionalTextEdits![0].newText).toBe(
			"import { Modal } from '@wire-ui/react';\n",
		);
	});

	it("adds no import when the component is already in scope", () => {
		const resolved = resolve(
			"import { Modal } from '@wire-ui/react';\nwire-",
			"typescriptreact",
			"wire-modal",
		);
		expect(resolved.additionalTextEdits).toBeUndefined();
	});

	it("respects the auto-import setting", () => {
		__state.configuration.set("wire-ui.snippets.autoImport", false);
		const resolved = resolve("wire-", "typescriptreact", "wire-modal");
		expect(resolved.additionalTextEdits).toBeUndefined();
	});
});
