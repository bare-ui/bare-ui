// The React scaffold — context + Root + parts, in the shape the library's own
// components are written in (see `packages/react/src/components/*`).
//
// It only ever imports from `@wire-ui/react`'s public surface. The library's
// internals reach for `@/utils/merge-props`, which consumers cannot import, so
// the generated Root spreads `rest` before the interaction handlers and says so
// in a comment rather than silently dropping either.

import { partKind } from "../names.js";
import type { ScaffoldFile } from "./types.js";

export function reactScaffold(name: string, parts: string[]): ScaffoldFile[] {
	return [
		{ path: `${name}.tsx`, contents: component(name, parts) },
		{ path: `${name}.types.ts`, contents: types(name, parts) },
		{ path: "index.ts", contents: barrel(name) },
	];
}

function component(name: string, parts: string[]): string {
	const typeImports = [
		`${name}ContextValue`,
		`${name}RootProps`,
		...parts.map((part) => `${name}${part}Props`),
	];

	return `'use client';

import React, { createContext, useContext } from 'react';
import { useControllableState, useInteractiveState } from '@wire-ui/react';
import type {
${typeImports.map((type) => `\t${type},`).join("\n")}
} from './${name}.types';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const ${name}Context = createContext<${name}ContextValue | null>(null);

function use${name}Context(part: string): ${name}ContextValue {
\tconst context = useContext(${name}Context);
\tif (!context) {
\t\tthrow new Error(\`<${name}.\${part}> must be used inside <${name}.Root>\`);
\t}
\treturn context;
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

const Root = React.forwardRef<HTMLDivElement, ${name}RootProps>(
\t(
\t\t{
\t\t\topen: controlledOpen,
\t\t\tdefaultOpen = false,
\t\t\tonOpenChange,
\t\t\tdisabled = false,
\t\t\tclassName,
\t\t\tchildren,
\t\t\t...rest
\t\t},
\t\tref,
\t) => {
\t\tconst [open, setOpen] = useControllableState({
\t\t\tvalue: controlledOpen,
\t\t\tdefaultValue: defaultOpen,
\t\t\tonChange: onOpenChange,
\t\t});

\t\tconst { handlers, dataAttributes } = useInteractiveState({ disabled });

\t\treturn (
\t\t\t<${name}Context.Provider value={{ open, setOpen, disabled }}>
\t\t\t\t{/* \`handlers\` come last so interaction tracking always runs; pass your
\t\t\t\t    own onMouseEnter etc. through a wrapper if you need both. */}
\t\t\t\t<div
\t\t\t\t\tref={ref}
\t\t\t\t\tclassName={className}
\t\t\t\t\tdata-state={open ? 'open' : 'closed'}
\t\t\t\t\t{...rest}
\t\t\t\t\t{...dataAttributes}
\t\t\t\t\t{...handlers}>
\t\t\t\t\t{children}
\t\t\t\t</div>
\t\t\t</${name}Context.Provider>
\t\t);
\t},
);

Root.displayName = '${name}.Root';
${parts.map((part) => part_(name, part)).join("")}
// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const ${name} = { Root${parts.map((part) => `, ${part}`).join("")} };

export { Root${parts.map((part) => `, ${part}`).join("")} };
`;
}

function part_(name: string, part: string): string {
	const heading = `
// ---------------------------------------------------------------------------
// ${part}
// ---------------------------------------------------------------------------
`;

	switch (partKind(part)) {
		case "trigger":
			return `${heading}
const ${part} = React.forwardRef<HTMLButtonElement, ${name}${part}Props>(
\t({ className, children, onClick, ...rest }, ref) => {
\t\tconst { open, setOpen, disabled } = use${name}Context('${part}');

\t\treturn (
\t\t\t<button
\t\t\t\tref={ref}
\t\t\t\ttype='button'
\t\t\t\tclassName={className}
\t\t\t\taria-expanded={open}
\t\t\t\tdisabled={disabled}
\t\t\t\tdata-state={open ? 'open' : 'closed'}
\t\t\t\tdata-disabled={disabled ? '' : undefined}
\t\t\t\tonClick={(event) => {
\t\t\t\t\tonClick?.(event);
\t\t\t\t\tif (!event.defaultPrevented) setOpen(!open);
\t\t\t\t}}
\t\t\t\t{...rest}>
\t\t\t\t{children}
\t\t\t</button>
\t\t);
\t},
);

${part}.displayName = '${name}.${part}';
`;

		case "content":
			return `${heading}
const ${part} = React.forwardRef<HTMLDivElement, ${name}${part}Props>(
\t({ className, children, ...rest }, ref) => {
\t\tconst { open } = use${name}Context('${part}');

\t\t// Unmounted while closed. Render it always and style [data-state="closed"]
\t\t// instead if you need an exit transition.
\t\tif (!open) return null;

\t\treturn (
\t\t\t<div
\t\t\t\tref={ref}
\t\t\t\tclassName={className}
\t\t\t\tdata-state='open'
\t\t\t\t{...rest}>
\t\t\t\t{children}
\t\t\t</div>
\t\t);
\t},
);

${part}.displayName = '${name}.${part}';
`;

		case "plain":
			return `${heading}
const ${part} = React.forwardRef<HTMLDivElement, ${name}${part}Props>(
\t({ className, children, ...rest }, ref) => {
\t\tconst { open, disabled } = use${name}Context('${part}');

\t\treturn (
\t\t\t<div
\t\t\t\tref={ref}
\t\t\t\tclassName={className}
\t\t\t\tdata-state={open ? 'open' : 'closed'}
\t\t\t\tdata-disabled={disabled ? '' : undefined}
\t\t\t\t{...rest}>
\t\t\t\t{children}
\t\t\t</div>
\t\t);
\t},
);

${part}.displayName = '${name}.${part}';
`;
	}
}

function types(name: string, parts: string[]): string {
	const partTypes = parts
		.map((part) => {
			const element =
				partKind(part) === "trigger"
					? "React.ButtonHTMLAttributes<HTMLButtonElement>"
					: "React.HTMLAttributes<HTMLDivElement>";
			return `export type ${name}${part}Props = ${element};`;
		})
		.join("\n\n");

	return `import type React from 'react';

/** Shared state every ${name} part can read. */
export interface ${name}ContextValue {
\topen: boolean;
\tsetOpen: (open: boolean) => void;
\tdisabled: boolean;
}

export interface ${name}RootProps extends React.HTMLAttributes<HTMLDivElement> {
\t/** Controlled open state. */
\topen?: boolean;
\t/** Initial open state when uncontrolled. */
\tdefaultOpen?: boolean;
\t/** Called whenever the open state changes. */
\tonOpenChange?: (open: boolean) => void;
\t/** Disables the component and marks it \`data-disabled\`. */
\tdisabled?: boolean;
}

${partTypes}
`;
}

function barrel(name: string): string {
	return `export { ${name} } from './${name}';
export type * from './${name}.types';
`;
}
