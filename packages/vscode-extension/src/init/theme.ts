// The starter stylesheet `Wire UI: Init` writes.
//
// Wire UI ships no CSS — every interactive state is exposed as a `data-*`
// attribute for the consumer to style. That is the right design and also the
// blank page a new user stares at, so Init leaves behind something that already
// responds to hover, focus and disabled, written the way the docs recommend.
//
// This is a *starting point*, not a theme package. Milestone 0.7 adds
// `@wire-ui/themes`; when it lands, Init should install a theme from it and this
// file becomes the no-theme fallback.
//
// Every attribute selector below is one the catalog actually exposes — a test
// asserts it, so a renamed attribute upstream breaks the build rather than
// silently shipping dead CSS.

import type { Framework } from "@wire-ui/typescript-plugin/metadata";

/** The `data-*` attributes the starter stylesheet targets. */
export const THEMED_ATTRIBUTES = [
	"data-hover",
	"data-focus-visible",
	"data-active",
	"data-disabled",
	"data-invalid",
	"data-success",
	"data-checked",
	"data-selected",
	"data-highlighted",
	"data-loading",
	"data-state",
	"data-orientation",
] as const;

/** `data-state` values the starter stylesheet writes rules for. */
export const THEMED_STATE_VALUES = ["open", "closed"] as const;

const CSS = `/* Wire UI — starter styles
 *
 * Wire UI ships no CSS. Components expose their interactive state as data-*
 * attributes; these rules give those states a default look you can rewrite,
 * extend, or delete outright. Nothing here is required by the library.
 *
 * Docs: https://wire-ui.com/docs/data-attributes
 */

:root {
	--wire-accent: #2563eb;
	--wire-accent-hover: #1d4ed8;
	--wire-accent-contrast: #ffffff;
	--wire-danger: #dc2626;
	--wire-success: #16a34a;
	--wire-surface: #ffffff;
	--wire-surface-raised: #f4f4f5;
	--wire-text: #18181b;
	--wire-muted: #71717a;
	--wire-border: #d4d4d8;
	--wire-radius: 0.375rem;
	--wire-ring-width: 2px;
	--wire-transition: 120ms ease;
}

@media (prefers-color-scheme: dark) {
	:root {
		--wire-surface: #18181b;
		--wire-surface-raised: #27272a;
		--wire-text: #fafafa;
		--wire-muted: #a1a1aa;
		--wire-border: #3f3f46;
	}
}

/* --- Interactive states -------------------------------------------------- */
/* Presence attributes: set while the state holds, absent otherwise. */

[data-hover] {
	background-color: var(--wire-surface-raised);
}

[data-active] {
	transform: scale(0.98);
}

/* Mirrors :focus-visible, so a focus ring shows for keyboard users only. */
[data-focus-visible] {
	outline: var(--wire-ring-width) solid var(--wire-accent);
	outline-offset: 2px;
}

[data-disabled] {
	opacity: 0.5;
	cursor: not-allowed;
	pointer-events: none;
}

/* Set from your own \`invalidType\` / \`isSuccess\` props — Wire UI never decides
 * validity for you. */
[data-invalid] {
	border-color: var(--wire-danger);
	color: var(--wire-danger);
}

[data-success] {
	border-color: var(--wire-success);
}

/* The option the pointer or arrow keys are on, in listbox-style components. */
[data-highlighted] {
	background-color: var(--wire-surface-raised);
}

[data-selected],
[data-checked] {
	background-color: var(--wire-accent);
	color: var(--wire-accent-contrast);
}

[data-loading] {
	cursor: progress;
	opacity: 0.7;
}

/* --- Value attributes ---------------------------------------------------- */

[data-state="closed"] {
	display: none;
}

[data-state="open"] {
	display: block;
}

[data-orientation="horizontal"] {
	flex-direction: row;
}

[data-orientation="vertical"] {
	flex-direction: column;
}

/* --- Starting points ----------------------------------------------------- */
/* Scoped classes you opt into, so the bare element rules above stay generic.
 * Rename them, or throw them away once you have a design. */

.wire-button {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	padding: 0.5rem 1rem;
	border: none;
	border-radius: var(--wire-radius);
	background-color: var(--wire-accent);
	color: var(--wire-accent-contrast);
	font: inherit;
	cursor: pointer;
	transition:
		background-color var(--wire-transition),
		transform var(--wire-transition);
}

.wire-button[data-hover] {
	background-color: var(--wire-accent-hover);
}

.wire-field {
	width: 100%;
	padding: 0.5rem 0.75rem;
	border: 1px solid var(--wire-border);
	border-radius: var(--wire-radius);
	background-color: var(--wire-surface);
	color: var(--wire-text);
	font: inherit;
	transition: border-color var(--wire-transition);
}

.wire-field[data-hover] {
	border-color: var(--wire-muted);
}
`;

/**
 * The stylesheet's contents. Framework-independent — `data-*` selectors are the
 * whole styling contract, and it does not vary by renderer.
 */
export function starterThemeCss(): string {
	return CSS;
}

/**
 * How to pull the stylesheet into an app, phrased for the framework in play.
 * Deliberately a hint rather than an edit: entry points differ per bundler and
 * per meta-framework, and guessing wrong edits the wrong file.
 */
export function themeImportHint(
	framework: Framework,
	themePath: string,
): string {
	const statement = `import "./${themePath.split("/").pop()}";`;
	const entry: Record<Framework, string> = {
		react: "your app entry (main.tsx, or the root layout in Next.js)",
		vue: "your app entry (main.ts)",
		solid: "your app entry (index.tsx)",
	};
	return `Add \`${statement}\` to ${entry[framework]}.`;
}
