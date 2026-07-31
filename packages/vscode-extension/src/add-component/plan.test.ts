import { describe, expect, it } from "vitest";
import {
	componentDirectoryCandidates,
	describeAddComponentPlan,
	planAddComponent,
} from "./plan.js";

const none = () => false;

describe("componentDirectoryCandidates", () => {
	it("offers the directories the workspace actually has, best first", () => {
		const exists = (relativePath: string) =>
			["components", "src/components", "src"].includes(relativePath);
		expect(componentDirectoryCandidates(exists)).toEqual([
			"src/components",
			"components",
			"src",
		]);
	});

	it("falls back to the convention in a bare workspace", () => {
		expect(componentDirectoryCandidates(none)).toEqual(["src/components"]);
	});
});

describe("planAddComponent", () => {
	it("gives the component its own directory", () => {
		const plan = planAddComponent({
			name: "Rating",
			parts: ["Trigger", "Content"],
			framework: "react",
			directory: "src/components",
			fileExists: none,
		});

		expect(plan.componentDirectory).toBe("src/components/Rating");
		expect(plan.files.map((file) => file.path)).toEqual([
			"src/components/Rating/Rating.tsx",
			"src/components/Rating/Rating.types.ts",
			"src/components/Rating/index.ts",
		]);
		expect(plan.primaryFile).toBe("src/components/Rating/Rating.tsx");
	});

	it("writes one SFC per part for Vue, plus the injection keys", () => {
		const plan = planAddComponent({
			name: "Rating",
			parts: ["Trigger", "Content"],
			framework: "vue",
			directory: "src/components",
			fileExists: none,
		});

		expect(plan.files.map((file) => file.path)).toEqual([
			"src/components/Rating/RatingRoot.vue",
			"src/components/Rating/RatingTrigger.vue",
			"src/components/Rating/RatingContent.vue",
			"src/components/Rating/keys.ts",
			"src/components/Rating/Rating.types.ts",
			"src/components/Rating/index.ts",
		]);
		expect(plan.primaryFile).toBe("src/components/Rating/RatingRoot.vue");
	});

	it("reports every file that is already there", () => {
		const plan = planAddComponent({
			name: "Rating",
			parts: ["Trigger"],
			framework: "react",
			directory: "src/components",
			fileExists: (relativePath) =>
				relativePath === "src/components/Rating/index.ts",
		});

		expect(plan.conflicts).toEqual(["src/components/Rating/index.ts"]);
	});

	it("normalises stray slashes in the chosen directory", () => {
		const plan = planAddComponent({
			name: "Rating",
			parts: ["Trigger"],
			framework: "react",
			directory: "/src/components/",
			fileExists: none,
		});

		expect(plan.componentDirectory).toBe("src/components/Rating");
	});

	it("puts the component at the root when no directory is chosen", () => {
		const plan = planAddComponent({
			name: "Rating",
			parts: ["Trigger"],
			framework: "react",
			directory: "",
			fileExists: none,
		});

		expect(plan.componentDirectory).toBe("Rating");
	});
});

describe("describeAddComponentPlan", () => {
	it("names the compound API and every file", () => {
		const description = describeAddComponentPlan(
			planAddComponent({
				name: "Rating",
				parts: ["Trigger", "Content"],
				framework: "react",
				directory: "src/components",
				fileExists: none,
			}),
		);

		expect(description).toContain(
			"Rating.Root, Rating.Trigger, Rating.Content",
		);
		expect(description).toContain("• src/components/Rating/Rating.tsx");
	});
});
