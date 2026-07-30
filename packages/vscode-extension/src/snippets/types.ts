import type { Framework } from "@wire-ui/typescript-plugin/metadata";

/**
 * What a snippet scaffolds, which also decides where it may be offered and
 * whether it needs an import brought along:
 *
 * - `component` — markup for one component (`<Modal.Root>…`). Vue: inside the
 *   SFC `<template>`. Needs its import.
 * - `hook` — a hook call and the statements around it. Vue: inside `<script>`.
 *   Needs its import.
 * - `scaffold` — a whole ready-to-style file composing several primitives.
 *   Vue: at SFC top level, because the body *is* an SFC. Carries its own imports.
 */
export type WireSnippetKind = "component" | "hook" | "scaffold";

/** The import a snippet's body depends on. */
export interface WireSnippetImport {
	/** Every name the body references, e.g. `["useDirection", "isRtl"]`. */
	names: string[];
	/** The statement as authored in the catalog, shown with the suggestion. */
	statement: string;
	/** Module the names come from, e.g. `@wire-ui/react`. */
	moduleId: string;
}

/**
 * One editor snippet, in one framework's authoring syntax. Everything here is
 * derived from the @wire-ui/mcp catalog (via the metadata layer) — nothing is
 * hand-written per component, hook, or scaffold.
 */
export interface WireSnippet {
	kind: WireSnippetKind;
	/** Catalog identity — `Modal`, `hotkeys`, `chat`. */
	name: string;
	/** Label for the suggestion's detail line, e.g. `Modal`, `useHotkeys`. */
	title: string;
	/** What the user types to reach the snippet, e.g. `wire-modal`. */
	prefix: string;
	/** Framework whose authoring syntax `body` is written in. */
	framework: Framework;
	/** VS Code snippet body: tab-indented, `${n:…}` placeholders, trailing `$0`. */
	body: string;
	/** One-line description, shown next to the suggestion. */
	description: string;
	/** `undefined` for scaffolds, whose body already carries its imports. */
	imports?: WireSnippetImport;
	/** `undefined` when the catalog entry has no documentation page yet. */
	docsUrl?: string;
	/** Call signature, for hooks. */
	signature?: string;
}
