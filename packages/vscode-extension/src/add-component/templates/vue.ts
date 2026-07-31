// The Vue scaffold.
//
// Vue's compound components are one SFC per part plus a `keys.ts` holding the
// injection key, because a part has to be a component file to be usable in a
// template. Mirrors `packages/vue/src/components/*`.

import { partKind } from "../names.js";
import type { ScaffoldFile } from "./types.js";

/** The interaction handlers Vue's `useInteractiveState` returns, as template bindings. */
const HANDLER_BINDINGS = [
	'@mouseenter="handlers.onMouseenter"',
	'@mouseleave="handlers.onMouseleave"',
	'@focus="handlers.onFocus"',
	'@blur="handlers.onBlur"',
	'@pointerdown="handlers.onPointerdown"',
	'@pointerup="handlers.onPointerup"',
	'@keydown="handlers.onKeydown"',
	'@keyup="handlers.onKeyup"',
]
	.map((binding) => `\t\t${binding}`)
	.join("\n");

export function vueScaffold(name: string, parts: string[]): ScaffoldFile[] {
	return [
		{ path: `${name}Root.vue`, contents: root(name) },
		...parts.map((part) => ({
			path: `${name}${part}.vue`,
			contents: partFile(name, part),
		})),
		{ path: "keys.ts", contents: keys(name) },
		{ path: `${name}.types.ts`, contents: types(name, parts) },
		{ path: "index.ts", contents: barrel(name, parts) },
	];
}

function root(name: string): string {
	return `<script setup lang="ts">
import { computed, provide, reactive, ref, toRef } from 'vue';
import { useInteractiveState } from '@wire-ui/vue';
import { ${name}Key } from './keys';

defineOptions({ name: '${name}Root' });

const props = withDefaults(
\tdefineProps<{
\t\t/** Controlled open state. */
\t\topen?: boolean;
\t\t/** Initial open state when uncontrolled. */
\t\tdefaultOpen?: boolean;
\t\t/** Called whenever the open state changes. */
\t\tonOpenChange?: (open: boolean) => void;
\t\t/** Disables the component and marks it \`data-disabled\`. */
\t\tdisabled?: boolean;
\t}>(),
\t{
\t\topen: undefined,
\t\tdefaultOpen: false,
\t\tonOpenChange: undefined,
\t\tdisabled: false,
\t},
);

const uncontrolledOpen = ref(props.defaultOpen);
const isControlled = computed(() => props.open !== undefined);
const openValue = computed(() =>
\tisControlled.value ? props.open! : uncontrolledOpen.value,
);

function setOpen(next: boolean) {
\tif (props.disabled) return;
\tif (!isControlled.value) uncontrolledOpen.value = next;
\tprops.onOpenChange?.(next);
}

const { handlers, dataAttributes } = useInteractiveState({
\tdisabled: () => props.disabled,
});

provide(
\t${name}Key,
\treactive({ open: openValue, disabled: toRef(props, 'disabled'), setOpen }),
);
</script>

<template>
\t<div
\t\t:data-state="openValue ? 'open' : 'closed'"
\t\tv-bind="dataAttributes"
${HANDLER_BINDINGS}>
\t\t<slot />
\t</div>
</template>
`;
}

function partFile(name: string, part: string): string {
	const useContext = `const context = use${name}Context('${part}');`;

	switch (partKind(part)) {
		case "trigger":
			return `<script setup lang="ts">
import { use${name}Context } from './keys';

defineOptions({ name: '${name}${part}' });

${useContext}

function toggle() {
\tcontext.setOpen(!context.open);
}
</script>

<template>
\t<button
\t\ttype="button"
\t\t:aria-expanded="context.open"
\t\t:disabled="context.disabled"
\t\t:data-state="context.open ? 'open' : 'closed'"
\t\t:data-disabled="context.disabled ? '' : undefined"
\t\t@click="toggle">
\t\t<slot />
\t</button>
</template>
`;

		case "content":
			return `<script setup lang="ts">
import { use${name}Context } from './keys';

defineOptions({ name: '${name}${part}' });

${useContext}
</script>

<template>
\t<!-- Unmounted while closed. Swap v-if for v-show and style
\t     [data-state="closed"] if you need an exit transition. -->
\t<div v-if="context.open" data-state="open">
\t\t<slot />
\t</div>
</template>
`;

		case "plain":
			return `<script setup lang="ts">
import { use${name}Context } from './keys';

defineOptions({ name: '${name}${part}' });

${useContext}
</script>

<template>
\t<div
\t\t:data-state="context.open ? 'open' : 'closed'"
\t\t:data-disabled="context.disabled ? '' : undefined">
\t\t<slot />
\t</div>
</template>
`;
	}
}

function keys(name: string): string {
	return `import { inject, type InjectionKey } from 'vue';
import type { ${name}ContextValue } from './${name}.types';

export const ${name}Key: InjectionKey<${name}ContextValue> = Symbol('${name}Context');

export function use${name}Context(part: string): ${name}ContextValue {
\tconst context = inject(${name}Key);
\tif (!context) {
\t\tthrow new Error(\`<${name}.\${part}> must be used inside <${name}.Root>\`);
\t}
\treturn context;
}
`;
}

function types(name: string, parts: string[]): string {
	const partProps = parts
		.map(
			(part) =>
				`/** \`<${name}.${part}>\` takes no props of its own — style it from the parent. */\nexport type ${name}${part}Props = Record<string, never>;`,
		)
		.join("\n\n");

	return `/** Shared state every ${name} part can read. */
export interface ${name}ContextValue {
\topen: boolean;
\tsetOpen: (open: boolean) => void;
\tdisabled: boolean;
}

export interface ${name}RootProps {
\t/** Controlled open state. */
\topen?: boolean;
\t/** Initial open state when uncontrolled. */
\tdefaultOpen?: boolean;
\t/** Called whenever the open state changes. */
\tonOpenChange?: (open: boolean) => void;
\t/** Disables the component and marks it \`data-disabled\`. */
\tdisabled?: boolean;
}

${partProps}
`;
}

function barrel(name: string, parts: string[]): string {
	const imports = [
		`import ${name}Root from './${name}Root.vue';`,
		...parts.map(
			(part) => `import ${name}${part} from './${name}${part}.vue';`,
		),
	].join("\n");

	const members = [
		"Root: " + name + "Root",
		...parts.map((part) => `${part}: ${name}${part}`),
	].join(", ");

	return `${imports}

export const ${name} = { ${members} };
export type * from './${name}.types';
`;
}
