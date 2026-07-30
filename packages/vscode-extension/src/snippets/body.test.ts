import { describe, expect, it } from "vitest";
import {
	demoTailToComment,
	escapeSnippetText,
	toCodeSnippetBody,
	toScaffoldBody,
	toSnippetBody,
	unwrapVueTemplate,
} from "./body.js";

describe("escapeSnippetText", () => {
	it("escapes only the characters the snippet grammar reserves", () => {
		expect(escapeSnippetText("a $b }c \\d")).toBe("a \\$b \\}c \\\\d");
		expect(escapeSnippetText("<Modal.Root open={open}>")).toBe(
			"<Modal.Root open={open\\}>",
		);
		expect(escapeSnippetText("plain text")).toBe("plain text");
	});
});

describe("unwrapVueTemplate", () => {
	it("removes the SFC wrapper and dedents the markup", () => {
		expect(
			unwrapVueTemplate("<template>\n  <Button>Go</Button>\n</template>"),
		).toBe("<Button>Go</Button>");
	});

	it("dedents by the shared indentation, not per line", () => {
		const example = [
			"<template>",
			"  <Modal.Root>",
			"    <Modal.Content />",
			"  </Modal.Root>",
			"</template>",
		].join("\n");
		expect(unwrapVueTemplate(example)).toBe(
			"<Modal.Root>\n  <Modal.Content />\n</Modal.Root>",
		);
	});

	it("leaves markup that carries no wrapper alone", () => {
		expect(unwrapVueTemplate("<Button>Go</Button>")).toBe(
			"<Button>Go</Button>",
		);
	});
});

describe("toSnippetBody", () => {
	it("ends every body on a final tab stop", () => {
		expect(toSnippetBody("<Button>Go</Button>", "react")).toBe(
			"<Button>${1:Go}</Button>$0",
		);
	});

	it("re-indents two-space catalog markup with tabs", () => {
		const body = toSnippetBody(
			"<Modal.Root>\n  <Modal.Content>\n    <p>Body</p>\n  </Modal.Content>\n</Modal.Root>",
			"react",
		);
		expect(body.split("\n")[1]).toBe("\t<Modal.Content>");
		expect(body.split("\n")[2]).toBe("\t\t<p>${1:Body}</p>");
	});

	it("numbers tab stops in source order", () => {
		const body = toSnippetBody(
			'<Input.Root>\n  <Input.Label>Email</Input.Label>\n  <Input.Field placeholder="you@example.com" />\n</Input.Root>',
			"react",
		);
		expect(body).toContain("${1:Email}");
		expect(body).toContain('placeholder="${2:you@example.com}"');
	});

	it("escapes JSX expression braces it leaves in place", () => {
		expect(
			toSnippetBody("<Button onClick={send}>Go</Button>", "react"),
		).toBe("<Button onClick={send\\}>${1:Go}</Button>$0");
	});

	it("skips attribute values that are code rather than copy", () => {
		const body = toSnippetBody(
			'<Modal.Root :open="open" @open-change="open = $event" />',
			"vue",
		);
		expect(body).toContain(':open="${1:open}"');
		// The handler is an expression — a tab stop over it would be noise, and
		// its `$` still has to survive the snippet grammar.
		expect(body).toContain('@open-change="open = \\$event"');
		expect(body).not.toContain("${2:");
	});

	it("escapes Vue interpolation without turning it into a tab stop", () => {
		const body = toSnippetBody(
			"<template>\n  <p>{{ item.label }}</p>\n</template>",
			"vue",
		);
		expect(body).toBe("<p>{{ item.label \\}\\}</p>$0");
	});

	it("keeps whitespace around a child out of the tab stop", () => {
		expect(toSnippetBody("<Button>  Go  </Button>", "react")).toBe(
			"<Button>  ${1:Go}  </Button>$0",
		);
	});

	it("leaves empty children and empty attribute values literal", () => {
		expect(toSnippetBody('<Input.Field placeholder="" />', "react")).toBe(
			'<Input.Field placeholder="" />$0',
		);
		expect(toSnippetBody("<Modal.Content></Modal.Content>", "react")).toBe(
			"<Modal.Content></Modal.Content>$0",
		);
	});

	it("unwraps the Vue template only for Vue", () => {
		const example = "<template>\n  <Button>Go</Button>\n</template>";
		expect(toSnippetBody(example, "vue")).toBe(
			"<Button>${1:Go}</Button>$0",
		);
		expect(toSnippetBody(example, "react")).toContain("<template>");
	});
});

describe("demoTailToComment", () => {
	it("comments out a trailing return so the snippet stays insertable", () => {
		expect(
			demoTailToComment(
				"const { isOpen, toggle } = useDisclosure();\nreturn <button onClick={toggle}>Go</button>;",
			),
		).toBe(
			"const { isOpen, toggle } = useDisclosure();\n// return <button onClick={toggle}>Go</button>;",
		);
	});

	it("leaves a return that is not the last statement alone", () => {
		const example = "if (a) return b;\nconst c = 1;";
		expect(demoTailToComment(example)).toBe(example);
	});

	it("leaves an example with no return alone", () => {
		expect(demoTailToComment("const id = useId('input');")).toBe(
			"const id = useId('input');",
		);
	});
});

describe("toCodeSnippetBody", () => {
	it("places tab stops on string and number arguments", () => {
		expect(toCodeSnippetBody("const id = useId('input');")).toBe(
			"const id = useId('${1:input}');$0",
		);
		expect(
			toCodeSnippetBody("const debounced = useDebounce(query, 250);"),
		).toBe("const debounced = useDebounce(query, ${1:250});$0");
		expect(
			toCodeSnippetBody(
				"const [theme, setTheme] = useLocalStorage('theme', 'light');",
			),
		).toBe(
			"const [theme, setTheme] = useLocalStorage('${1:theme}', '${2:light}');$0",
		);
	});

	it("places a tab stop on a single-call callback body", () => {
		expect(
			toCodeSnippetBody(
				"useHotkeys({\n  'mod+k': () => openPalette(),\n});",
			),
		).toBe(
			"useHotkeys({\n\t'${1:mod+k}': () => ${2:openPalette()},\n\\});$0",
		);
	});

	it("leaves a callback body it cannot read as a single call literal", () => {
		// Nested parentheses and quoted arguments are code a user does not retype.
		const body = toCodeSnippetBody(
			"const { stop } = useInterval(() => setNow(Date.now()), 1000);",
		);
		expect(body).toContain("() => setNow(Date.now())");
		expect(body).toContain("${1:1000}");
	});

	it("declines to tab-stop identifiers the editor can rename", () => {
		expect(toCodeSnippetBody("const isOnline = useOnlineStatus();")).toBe(
			"const isOnline = useOnlineStatus();$0",
		);
	});

	it("leaves comment text out of the tab stops", () => {
		const body = toCodeSnippetBody(
			"const dir = useDirection(ref);\n// dir === 'rtl'",
		);
		expect(body).toBe("const dir = useDirection(ref);\n// dir === 'rtl'$0");
	});

	it("re-indents two-space catalog code with tabs", () => {
		const body = toCodeSnippetBody(
			"useKeyboard({\n  'Escape': () => close(),\n});",
		);
		expect(body.split("\n")[1]).toBe(
			"\t'${1:Escape}': () => ${2:close()},",
		);
	});

	it("escapes the characters the snippet grammar reserves", () => {
		expect(toCodeSnippetBody("const { isOpen } = useDisclosure();")).toBe(
			"const { isOpen \\} = useDisclosure();$0",
		);
	});
});

describe("toScaffoldBody", () => {
	it("inserts a whole file verbatim, with no tab stops", () => {
		const source =
			"import { Chat } from '@wire-ui/react';\n\nexport function P() {}";
		const body = toScaffoldBody(source);
		expect(body).toBe(
			"import { Chat \\} from '@wire-ui/react';\n\nexport function P() {\\}$0",
		);
		expect(body).not.toMatch(/\$\{\d+:/);
	});

	it("re-indents two-space catalog source with tabs", () => {
		expect(
			toScaffoldBody("function a() {\n  return 1;\n}").split("\n")[1],
		).toBe("\treturn 1;");
	});
});
