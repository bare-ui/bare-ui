import type { Framework } from "@wire-ui/typescript-plugin/metadata";
import { reactScaffold } from "./react.js";
import { solidScaffold } from "./solid.js";
import type { ScaffoldFile } from "./types.js";
import { vueScaffold } from "./vue.js";

export type { ScaffoldFile } from "./types.js";
export { reactScaffold } from "./react.js";
export { solidScaffold } from "./solid.js";
export { vueScaffold } from "./vue.js";

/** The files a component scaffold is made of, for one framework. */
export function scaffoldFiles(
	framework: Framework,
	name: string,
	parts: string[],
): ScaffoldFile[] {
	switch (framework) {
		case "react":
			return reactScaffold(name, parts);
		case "vue":
			return vueScaffold(name, parts);
		case "solid":
			return solidScaffold(name, parts);
	}
}
