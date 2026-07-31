// Naming rules for a scaffolded component.
//
// The name and its parts end up as identifiers, file names, and `displayName`
// strings, so they are validated once here rather than at each use. Pure, and
// shared by the input-box validators and the generator.

/** Parts every compound component has; `Root` is generated, never requested. */
export const ROOT_PART = "Root";

/** What the generator is willing to name a component or a part. */
const IDENTIFIER = /^[A-Z][A-Za-z0-9]*$/;

/**
 * Turn free text into the PascalCase identifier it is trying to be:
 * `rating stars` / `rating-stars` / `rating_stars` all become `RatingStars`.
 * Returns an empty string when there is nothing usable in the input.
 */
export function toPascalCase(input: string): string {
	return input
		.split(/[^A-Za-z0-9]+/)
		.filter(Boolean)
		.map((word) => word[0].toUpperCase() + word.slice(1))
		.join("");
}

/**
 * Why a component name is unusable, or undefined when it is fine. Shaped for
 * `InputBox.validateInput`, which shows the string and blocks Enter.
 */
export function validateComponentName(input: string): string | undefined {
	const name = input.trim();
	if (!name) return "Enter a component name.";
	if (/^[0-9]/.test(name))
		return "A component name cannot start with a digit.";
	if (!IDENTIFIER.test(name))
		return "Use PascalCase letters and digits only, e.g. RatingStars.";
	return undefined;
}

/** Why a part list is unusable, or undefined when it is fine. */
export function validatePartNames(input: string): string | undefined {
	const parts = splitParts(input);
	if (parts.length === 0)
		return "Name at least one part, e.g. Trigger, Content.";

	for (const part of parts) {
		if (part === ROOT_PART)
			return "Root is always generated — list only the other parts.";
		if (!IDENTIFIER.test(part))
			return `"${part}" must be PascalCase letters and digits, e.g. Trigger.`;
	}

	const seen = new Set<string>();
	for (const part of parts) {
		if (seen.has(part)) return `"${part}" is listed twice.`;
		seen.add(part);
	}

	return undefined;
}

/** Split a part list on commas or whitespace, dropping empties. */
export function splitParts(input: string): string[] {
	return input
		.split(/[,\s]+/)
		.map((part) => part.trim())
		.filter(Boolean);
}

/** The behaviour a part gets, decided by what it is called. */
export type PartKind = "trigger" | "content" | "plain";

/**
 * Two part names carry a conventional meaning across the catalog, and a
 * scaffold that ignored them would generate a `Trigger` that triggers nothing.
 * Everything else is a styleable passthrough for the author to fill in.
 */
export function partKind(part: string): PartKind {
	if (part === "Trigger") return "trigger";
	if (part === "Content" || part === "Panel") return "content";
	return "plain";
}
