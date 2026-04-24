export type MatrixValue = boolean | string;

export const FEATURE_MATRIX: {
	libraries: string[];
	rows: { feature: string; values: MatrixValue[] }[];
} = {
	libraries: [
		"Wire UI",
		"Radix UI",
		"Headless UI",
		"React Aria",
		"Ark UI",
		"Base UI",
	],
	rows: [
		{
			feature: "Unstyled (zero CSS)",
			values: [true, true, true, true, true, true],
		},
		{
			feature: "Multi-framework",
			values: [true, false, "React + Vue", false, true, false],
		},
		{
			feature: "TypeScript native",
			values: [true, true, true, true, true, true],
		},
		{
			feature: "asChild / polymorphism",
			values: [true, true, "v2+", true, true, true],
		},
		{
			feature: "data-* state attributes",
			values: [true, true, false, true, true, true],
		},
		{
			feature: "WCAG AA / ARIA",
			values: [true, true, true, true, true, true],
		},
		{
			feature: "llms.txt",
			values: [true, false, false, false, true, false],
		},
		{
			feature: "MCP server",
			values: [true, false, false, false, true, false],
		},
		{
			feature: "SKILL.md",
			values: [true, false, false, false, false, false],
		},
		{
			feature: "License",
			values: ["MIT", "MIT", "MIT", "Apache 2.0", "MIT", "MIT"],
		},
	],
};

export const METADATA = {
	capturedAt: "2026-04-22",
	note: "Numbers approximate. Captured from public docs and repos.",
};
