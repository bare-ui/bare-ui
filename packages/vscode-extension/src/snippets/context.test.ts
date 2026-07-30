import { describe, expect, it } from "vitest";
import {
	detectFramework,
	frameworksFromPackageJson,
	frameworksImportedIn,
	hasVueSfcBlocks,
	isInVueScript,
	isInVueTemplate,
	planImportEdit,
} from "./context.js";

describe("frameworksImportedIn", () => {
	it("reads the Wire UI packages a file imports, in catalog order", () => {
		expect(
			frameworksImportedIn(
				"import { Button } from '@wire-ui/solid';\nimport { Modal } from '@wire-ui/react';",
			),
		).toEqual(["react", "solid"]);
	});

	it("ignores other packages", () => {
		expect(frameworksImportedIn("import React from 'react'")).toEqual([]);
	});
});

describe("frameworksFromPackageJson", () => {
	it("reads every dependency field", () => {
		expect(
			frameworksFromPackageJson({
				dependencies: { "@wire-ui/vue": "^0.5.0", vue: "^3.5.0" },
				devDependencies: { "@wire-ui/react": "^0.5.0" },
			}),
		).toEqual(["react", "vue"]);
	});

	it("tolerates a missing or malformed manifest", () => {
		expect(frameworksFromPackageJson(undefined)).toEqual([]);
		expect(frameworksFromPackageJson({ dependencies: "nope" })).toEqual([]);
	});
});

describe("detectFramework", () => {
	it("treats every .vue file as Vue", () => {
		expect(detectFramework({ languageId: "vue", documentText: "" })).toBe(
			"vue",
		);
	});

	it("follows what the file already imports", () => {
		expect(
			detectFramework({
				languageId: "typescriptreact",
				documentText: "import { Button } from '@wire-ui/solid';",
			}),
		).toBe("solid");
	});

	it("falls back to the workspace's dependency", () => {
		expect(
			detectFramework({
				languageId: "typescriptreact",
				documentText: "",
				workspaceFrameworks: ["solid"],
			}),
		).toBe("solid");
	});

	// The catalog's Vue example is SFC template markup — unusable in a JSX
	// render function, where the React example is valid for either.
	it("never picks Vue for a JSX file", () => {
		expect(
			detectFramework({
				languageId: "typescriptreact",
				documentText: "import { Button } from '@wire-ui/vue';",
				workspaceFrameworks: ["vue"],
			}),
		).toBe("react");
	});

	it("defaults to React when nothing says otherwise", () => {
		expect(
			detectFramework({ languageId: "javascript", documentText: "" }),
		).toBe("react");
	});
});

describe("isInVueTemplate", () => {
	const sfc = [
		'<script setup lang="ts">',
		"import { Button } from '@wire-ui/vue';",
		"</script>",
		"",
		"<template>",
		"  <Button>Go</Button>",
		"</template>",
	].join("\n");

	it("accepts an offset inside the root template", () => {
		expect(isInVueTemplate(sfc, sfc.indexOf("<Button>"))).toBe(true);
	});

	it("rejects an offset in the script block", () => {
		expect(isInVueTemplate(sfc, sfc.indexOf("import"))).toBe(false);
	});

	it("rejects a file with no template block", () => {
		expect(isInVueTemplate("<script setup></script>", 5)).toBe(false);
	});

	it("ignores an indented nested template", () => {
		const nested = [
			"<template>",
			'  <template v-if="ok">',
			"    <Button>Go</Button>",
			"  </template>",
			"</template>",
		].join("\n");
		expect(isInVueTemplate(nested, nested.indexOf("<Button>"))).toBe(true);
	});
});

describe("isInVueScript", () => {
	const sfc = [
		'<script setup lang="ts">',
		"const open = ref(false);",
		"</script>",
		"",
		"<template>",
		"  <Button>Go</Button>",
		"</template>",
	].join("\n");

	it("accepts an offset inside the script block", () => {
		expect(isInVueScript(sfc, sfc.indexOf("const open"))).toBe(true);
	});

	it("rejects an offset in the template block", () => {
		expect(isInVueScript(sfc, sfc.indexOf("<Button>"))).toBe(false);
	});

	// The two checks partition an SFC: neither answers true at the top level,
	// which is where a whole-file scaffold belongs.
	it("leaves the top level to neither region", () => {
		expect(isInVueScript("", 0)).toBe(false);
		expect(isInVueTemplate("", 0)).toBe(false);
		expect(isInVueScript("<template>\n</template>\n", 0)).toBe(false);
	});
});

describe("hasVueSfcBlocks", () => {
	it("tells a fresh .vue file from one that is already an SFC", () => {
		expect(hasVueSfcBlocks("")).toBe(false);
		expect(hasVueSfcBlocks("wire-")).toBe(false);
		expect(hasVueSfcBlocks("<template>\n</template>")).toBe(true);
		expect(hasVueSfcBlocks('<script setup lang="ts">\n</script>')).toBe(
			true,
		);
		expect(hasVueSfcBlocks("<style scoped>\n</style>")).toBe(true);
	});
});

describe("planImportEdit", () => {
	const jsx = (text: string, ...names: string[]) =>
		planImportEdit({
			text,
			languageId: "typescriptreact",
			names: names.length > 0 ? names : ["Modal"],
			moduleId: "@wire-ui/react",
		});

	const apply = (text: string, ...names: string[]) => {
		const edit = jsx(text, ...names);
		if (!edit) return text;
		return (
			text.slice(0, edit.offset) + edit.newText + text.slice(edit.offset)
		);
	};

	it("adds a first import at the top of the file", () => {
		expect(apply("export const App = () => null;\n")).toBe(
			"import { Modal } from '@wire-ui/react';\nexport const App = () => null;\n",
		);
	});

	it("adds the import after the last existing one", () => {
		expect(
			apply("import { useState } from 'react';\n\nconst a = 1;\n"),
		).toBe(
			"import { useState } from 'react';\nimport { Modal } from '@wire-ui/react';\n\nconst a = 1;\n",
		);
	});

	it("merges into an existing import from the same package", () => {
		expect(apply("import { Button } from '@wire-ui/react';\n")).toBe(
			"import { Button, Modal } from '@wire-ui/react';\n",
		);
	});

	it("merges into a multi-line and a trailing-comma clause", () => {
		expect(apply("import {\n\tButton,\n} from '@wire-ui/react';\n")).toBe(
			"import {\n\tButton, Modal\n} from '@wire-ui/react';\n",
		);
		expect(apply("import {} from '@wire-ui/react';\n")).toBe(
			"import { Modal } from '@wire-ui/react';\n",
		);
	});

	it("does nothing when the component is already imported", () => {
		expect(
			jsx("import { Modal } from '@wire-ui/react';\n"),
		).toBeUndefined();
		expect(
			jsx("import { Modal as M } from '@wire-ui/react';\n"),
		).toBeUndefined();
		expect(
			jsx("import { type Modal } from '@wire-ui/react';\n"),
		).toBeUndefined();
	});

	it("adds a value import alongside a type-only one", () => {
		expect(
			apply("import type { ModalProps } from '@wire-ui/react';\n"),
		).toBe(
			"import type { ModalProps } from '@wire-ui/react';\nimport { Modal } from '@wire-ui/react';\n",
		);
	});

	it("matches the file's quote and semicolon style", () => {
		expect(apply('import { useState } from "react"\n')).toBe(
			'import { useState } from "react"\nimport { Modal } from "@wire-ui/react"\n',
		);
	});

	it("writes into an SFC's script block, not its template", () => {
		const sfc = [
			'<script setup lang="ts">',
			"const open = ref(false);",
			"</script>",
			"",
			"<template>",
			"</template>",
		].join("\n");
		const edit = planImportEdit({
			text: sfc,
			languageId: "vue",
			names: ["Modal"],
			moduleId: "@wire-ui/vue",
		});
		expect(edit).toBeDefined();
		const applied =
			sfc.slice(0, edit!.offset) +
			edit!.newText +
			sfc.slice(edit!.offset);
		expect(applied).toContain(
			"<script setup lang=\"ts\">\nimport { Modal } from '@wire-ui/vue';\nconst open",
		);
	});

	it("brings every name a snippet needs, skipping the ones in scope", () => {
		// useDirection ships two helpers alongside the reactive hook.
		expect(
			apply("const a = 1;\n", "useDirection", "getDirection", "isRtl"),
		).toBe(
			"import { useDirection, getDirection, isRtl } from '@wire-ui/react';\nconst a = 1;\n",
		);
		expect(
			apply(
				"import { isRtl } from '@wire-ui/react';\n",
				"useDirection",
				"isRtl",
			),
		).toBe("import { isRtl, useDirection } from '@wire-ui/react';\n");
		expect(
			jsx(
				"import { isRtl, useDirection } from '@wire-ui/react';\n",
				"isRtl",
				"useDirection",
			),
		).toBeUndefined();
	});

	it("plans nothing when there is nothing to import", () => {
		expect(
			planImportEdit({
				text: "const a = 1;\n",
				languageId: "typescriptreact",
				names: [],
				moduleId: "@wire-ui/react",
			}),
		).toBeUndefined();
	});

	it("leaves an SFC with no script block alone", () => {
		expect(
			planImportEdit({
				text: "<template>\n</template>\n",
				languageId: "vue",
				names: ["Modal"],
				moduleId: "@wire-ui/vue",
			}),
		).toBeUndefined();
	});
});
