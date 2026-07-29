import type { Framework } from "@wire-ui/typescript-plugin/metadata";

/**
 * One editor snippet for one Wire UI component, in one framework's authoring
 * syntax. Everything here is derived from the @wire-ui/mcp catalog (via the
 * metadata layer) — nothing is hand-written per component.
 */
export interface WireSnippet {
	/** Canonical component name, e.g. `Modal`. */
	component: string;
	/** What the user types to reach the snippet, e.g. `wire-modal`. */
	prefix: string;
	/** Framework whose authoring syntax `body` is written in. */
	framework: Framework;
	/** VS Code snippet body: tab-indented, `${n:…}` placeholders, trailing `$0`. */
	body: string;
	/** One-line component description, shown next to the suggestion. */
	description: string;
	/** The import the snippet needs, e.g. `import { Modal } from '@wire-ui/react'`. */
	importStatement: string;
	/** Module the component is imported from, e.g. `@wire-ui/react`. */
	moduleId: string;
	/** Canonical documentation URL on wire-ui.com. */
	docsUrl: string;
}
