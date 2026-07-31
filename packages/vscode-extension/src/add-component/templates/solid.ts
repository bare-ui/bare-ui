// The Solid scaffold.
//
// Same pattern as React, different reactivity: props are never destructured
// (that would read them once and lose reactivity), state is a getter, and
// context values expose getters so readers stay tracked. Mirrors
// `packages/solid/src/components/*`.

import { partKind } from "../names.js";
import type { ScaffoldFile } from "./types.js";

export function solidScaffold(name: string, parts: string[]): ScaffoldFile[] {
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

import { createContext, splitProps, useContext, type JSX } from 'solid-js';
import { createControllableState, createInteractiveState } from '@wire-ui/solid';
import type {
${typeImports.map((type) => `\t${type},`).join("\n")}
} from './${name}.types';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const ${name}Context = createContext<${name}ContextValue>();

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

function Root(props: ${name}RootProps) {
\tconst [local, rest] = splitProps(props, [
\t\t'open',
\t\t'defaultOpen',
\t\t'onOpenChange',
\t\t'disabled',
\t\t'class',
\t\t'children',
\t]);

\tconst [open, setOpen] = createControllableState<boolean>({
\t\tget value() {
\t\t\treturn local.open;
\t\t},
\t\tdefaultValue: local.defaultOpen ?? false,
\t\tget onChange() {
\t\t\treturn local.onOpenChange;
\t\t},
\t});

\tconst disabled = () => !!local.disabled;
\tconst state = createInteractiveState({
\t\tget disabled() {
\t\t\treturn disabled();
\t\t},
\t});

\tconst context: ${name}ContextValue = {
\t\tget open() {
\t\t\treturn !!open();
\t\t},
\t\tsetOpen,
\t\tget disabled() {
\t\t\treturn disabled();
\t\t},
\t};

\treturn (
\t\t<${name}Context.Provider value={context}>
\t\t\t{/* \`state.handlers\` come last so interaction tracking always runs. */}
\t\t\t<div
\t\t\t\tclass={local.class}
\t\t\t\tdata-state={open() ? 'open' : 'closed'}
\t\t\t\t{...rest}
\t\t\t\t{...state.dataAttributes}
\t\t\t\t{...state.handlers}>
\t\t\t\t{local.children}
\t\t\t</div>
\t\t</${name}Context.Provider>
\t);
}
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
function ${part}(props: ${name}${part}Props) {
\tconst [local, rest] = splitProps(props, ['class', 'children', 'onClick']);
\tconst context = use${name}Context('${part}');

\tconst handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (event) => {
\t\tconst onClick = local.onClick;
\t\tif (typeof onClick === 'function') {
\t\t\t(onClick as (e: typeof event) => void)(event);
\t\t}
\t\tif (!event.defaultPrevented) context.setOpen(!context.open);
\t};

\treturn (
\t\t<button
\t\t\ttype='button'
\t\t\tclass={local.class}
\t\t\taria-expanded={context.open}
\t\t\tdisabled={context.disabled}
\t\t\tdata-state={context.open ? 'open' : 'closed'}
\t\t\tdata-disabled={context.disabled ? '' : undefined}
\t\t\tonClick={handleClick}
\t\t\t{...rest}>
\t\t\t{local.children}
\t\t</button>
\t);
}
`;

		case "content":
			return `${heading}
function ${part}(props: ${name}${part}Props) {
\tconst [local, rest] = splitProps(props, ['class', 'children']);
\tconst context = use${name}Context('${part}');

\t// Unmounted while closed. Render it always and style [data-state="closed"]
\t// instead if you need an exit transition.
\treturn (
\t\t<>
\t\t\t{context.open && (
\t\t\t\t<div class={local.class} data-state='open' {...rest}>
\t\t\t\t\t{local.children}
\t\t\t\t</div>
\t\t\t)}
\t\t</>
\t);
}
`;

		case "plain":
			return `${heading}
function ${part}(props: ${name}${part}Props) {
\tconst [local, rest] = splitProps(props, ['class', 'children']);
\tconst context = use${name}Context('${part}');

\treturn (
\t\t<div
\t\t\tclass={local.class}
\t\t\tdata-state={context.open ? 'open' : 'closed'}
\t\t\tdata-disabled={context.disabled ? '' : undefined}
\t\t\t{...rest}>
\t\t\t{local.children}
\t\t</div>
\t);
}
`;
	}
}

function types(name: string, parts: string[]): string {
	const partTypes = parts
		.map((part) => {
			const element =
				partKind(part) === "trigger"
					? "JSX.ButtonHTMLAttributes<HTMLButtonElement>"
					: "JSX.HTMLAttributes<HTMLDivElement>";
			return `export type ${name}${part}Props = ${element};`;
		})
		.join("\n\n");

	return `import type { JSX } from 'solid-js';

/** Shared state every ${name} part can read. */
export interface ${name}ContextValue {
\treadonly open: boolean;
\tsetOpen: (open: boolean) => void;
\treadonly disabled: boolean;
}

export interface ${name}RootProps extends JSX.HTMLAttributes<HTMLDivElement> {
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
