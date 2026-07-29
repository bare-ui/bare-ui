import type { TSESLint } from "@typescript-eslint/utils";
import compoundPartOutsideRoot from "./rules/compound-part-outside-root.js";
import misplacedClassName from "./rules/misplaced-classname.js";
import missingRootWrapper from "./rules/missing-root-wrapper.js";
import preferDataStateSelector from "./rules/prefer-data-state-selector.js";
import requiredPairProps from "./rules/required-pair-props.js";

const rules = {
	"compound-part-outside-root": compoundPartOutsideRoot,
	"misplaced-classname": misplacedClassName,
	"missing-root-wrapper": missingRootWrapper,
	"prefer-data-state-selector": preferDataStateSelector,
	"required-pair-props": requiredPairProps,
} satisfies Record<string, TSESLint.RuleModule<string, []>>;

// The rule severities the `recommended` preset turns on. Errors mark markup
// that silently fails at runtime — a part that can't reach its shared context,
// or a prop that leaves the component with nothing to render. Warnings mark
// code that works but styles nothing, which is a choice worth revisiting.
const recommendedRules = {
	"wire-ui/compound-part-outside-root": "error",
	"wire-ui/misplaced-classname": "warn",
	"wire-ui/missing-root-wrapper": "error",
	"wire-ui/prefer-data-state-selector": "warn",
	"wire-ui/required-pair-props": "error",
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
