import { describe, expect, it } from "vitest";
import {
	partKind,
	splitParts,
	toPascalCase,
	validateComponentName,
	validatePartNames,
} from "./names.js";

describe("toPascalCase", () => {
	it("leaves a PascalCase name alone", () => {
		expect(toPascalCase("RatingStars")).toBe("RatingStars");
	});

	it("joins whatever separators were typed", () => {
		expect(toPascalCase("rating stars")).toBe("RatingStars");
		expect(toPascalCase("rating-stars")).toBe("RatingStars");
		expect(toPascalCase("rating_stars")).toBe("RatingStars");
		expect(toPascalCase("  rating   stars  ")).toBe("RatingStars");
	});

	it("keeps digits and inner capitals", () => {
		expect(toPascalCase("otp input")).toBe("OtpInput");
		expect(toPascalCase("OTPInput")).toBe("OTPInput");
		expect(toPascalCase("grid 2 col")).toBe("Grid2Col");
	});

	it("is empty when there is nothing to work with", () => {
		expect(toPascalCase("")).toBe("");
		expect(toPascalCase("---")).toBe("");
	});
});

describe("validateComponentName", () => {
	it("accepts a PascalCase identifier", () => {
		expect(validateComponentName("Rating")).toBeUndefined();
		expect(validateComponentName("RatingStars")).toBeUndefined();
		expect(validateComponentName("Grid2Col")).toBeUndefined();
	});

	it("rejects an empty name", () => {
		expect(validateComponentName("")).toMatch(/Enter a component name/);
		expect(validateComponentName("   ")).toMatch(/Enter a component name/);
	});

	it("rejects a name that cannot be an identifier", () => {
		expect(validateComponentName("rating")).toMatch(/PascalCase/);
		expect(validateComponentName("Rating Stars")).toMatch(/PascalCase/);
		expect(validateComponentName("Rating-Stars")).toMatch(/PascalCase/);
		expect(validateComponentName("2Cool")).toMatch(
			/cannot start with a digit/,
		);
	});
});

describe("validatePartNames", () => {
	it("accepts a comma-separated list", () => {
		expect(validatePartNames("Trigger, Content")).toBeUndefined();
		expect(validatePartNames("Trigger Content")).toBeUndefined();
	});

	it("insists on at least one part", () => {
		expect(validatePartNames("")).toMatch(/at least one part/);
		expect(validatePartNames("  ,  ")).toMatch(/at least one part/);
	});

	it("rejects Root, which is always generated", () => {
		expect(validatePartNames("Root, Trigger")).toMatch(/Root is always/);
	});

	it("rejects a duplicate", () => {
		expect(validatePartNames("Trigger, Trigger")).toMatch(/listed twice/);
	});

	it("rejects a part that cannot be an identifier", () => {
		expect(validatePartNames("Trigger, my-part")).toMatch(/PascalCase/);
	});
});

describe("splitParts", () => {
	it("splits on commas and whitespace alike", () => {
		expect(splitParts("Trigger, Content")).toEqual(["Trigger", "Content"]);
		expect(splitParts("Trigger  Content")).toEqual(["Trigger", "Content"]);
		expect(splitParts(" Trigger ,, Content ")).toEqual([
			"Trigger",
			"Content",
		]);
	});
});

describe("partKind", () => {
	it("recognises the two names that carry a meaning", () => {
		expect(partKind("Trigger")).toBe("trigger");
		expect(partKind("Content")).toBe("content");
		expect(partKind("Panel")).toBe("content");
	});

	it("treats everything else as a styleable passthrough", () => {
		expect(partKind("Item")).toBe("plain");
		expect(partKind("Label")).toBe("plain");
	});
});
