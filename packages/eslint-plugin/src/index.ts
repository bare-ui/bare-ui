import type { TSESLint } from "@typescript-eslint/utils";
import compoundPartOutsideRoot from "./rules/compound-part-outside-root.js";
import missingRootWrapper from "./rules/missing-root-wrapper.js";

const rules = {
	"compound-part-outside-root": compoundPartOutsideRoot,
	"missing-root-wrapper": missingRootWrapper,
} satisfies Record<string, TSESLint.RuleModule<string, []>>;

// The rule severities the `recommended` preset turns on. Both start as errors:
// each marks markup that silently fails to reach a component's shared context.
const recommendedRules = {
	"wire-ui/compound-part-outside-root": "error",
	"wire-ui/missing-root-wrapper": "error",
} as const;

const plugin = {
	meta: { name: "@wire-ui/eslint-plugin", version: "0.0.0" },
	rules,
	// Populated below so the flat config can reference `plugin` itself.
	configs: {} as Record<string, unknown>,
};

// Flat config (ESLint 9+): `...wireUi.configs.recommended` in eslint.config.js.
plugin.configs.recommended = {
	name: "wire-ui/recommended",
	plugins: { "wire-ui": plugin },
	rules: recommendedRules,
};

// Legacy eslintrc config: `extends: ["plugin:wire-ui/recommended-legacy"]`.
plugin.configs["recommended-legacy"] = {
	plugins: ["wire-ui"],
	rules: recommendedRules,
};

export = plugin;
