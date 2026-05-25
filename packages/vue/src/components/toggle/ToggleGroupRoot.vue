<script setup lang="ts">
import { provide, ref, computed } from 'vue';
import { ToggleGroupKey } from './keys';

defineOptions({ name: 'ToggleGroupRoot' })

// We accept a union type that TypeScript can't fully narrow as a single interface,
// so we define a broad props shape that covers both modes.
const props = withDefaults(defineProps<{
	type: 'single' | 'multiple';
	value?: string | string[] | null;
	defaultValue?: string | string[] | null;
	onChange?: ((value: string | null) => void) | ((value: string[]) => void);
	disabled?: boolean;
	orientation?: 'horizontal' | 'vertical';
	loop?: boolean;
	rovingFocus?: boolean;
}>(), {
	value: undefined,
	defaultValue: undefined,
	onChange: undefined,
	disabled: false,
	orientation: 'horizontal',
	loop: true,
	rovingFocus: true,
});

const isSingle = computed(() => props.type === 'single');

// Compute the initial uncontrolled value immediately (not lazily).
function computeInitialValue(): string[] {
	if (props.type === 'single') {
		const dv = props.defaultValue as string | null | undefined;
		return dv ? [dv] : [];
	}
	return ((props.defaultValue as string[] | undefined) ?? []).slice();
}

// Normalize internal state to string[] for both modes.
const uncontrolledValue = ref<string[]>(computeInitialValue());

const controlledValue = computed<string[] | undefined>(() => {
	const raw = props.value;
	if (raw === undefined) return undefined;
	if (isSingle.value) {
		// null means deselected; empty string also means deselected
		return raw ? [raw as string] : [];
	}
	return raw as string[];
});

const current = computed<string[]>(() =>
	controlledValue.value !== undefined ? controlledValue.value : uncontrolledValue.value,
);

function emitChange(next: string[]) {
	const isControlled = controlledValue.value !== undefined;
	if (!isControlled) uncontrolledValue.value = next;
	if (isSingle.value) {
		(props.onChange as ((v: string | null) => void) | undefined)?.(next[0] ?? null);
	} else {
		(props.onChange as ((v: string[]) => void) | undefined)?.(next);
	}
}

function isPressed(v: string): boolean {
	return current.value.includes(v);
}

function toggle(v: string) {
	if (isSingle.value) {
		emitChange(current.value.includes(v) ? [] : [v]);
	} else {
		emitChange(current.value.includes(v) ? current.value.filter((x) => x !== v) : [...current.value, v]);
	}
}

// --- Roving focus ---
const itemsRef: Array<{ id: string; el: HTMLElement }> = [];
const activeId = ref<string | null>(null);

function register(id: string, el: HTMLElement): () => void {
	itemsRef.push({ id, el });
	if (activeId.value === null) {
		activeId.value = id;
	}
	return () => {
		const idx = itemsRef.findIndex((it) => it.id === id);
		if (idx !== -1) itemsRef.splice(idx, 1);
		if (activeId.value === id) {
			activeId.value = itemsRef[0]?.id ?? null;
		}
	};
}

function isTabbable(id: string): boolean {
	return activeId.value === id;
}

function onItemFocus(id: string) {
	activeId.value = id;
}

function onItemKeyDown(e: KeyboardEvent) {
	if (!props.rovingFocus) return;
	const nextKey = props.orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
	const prevKey = props.orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
	if (!['Home', 'End', nextKey, prevKey].includes(e.key)) return;

	const items = [...itemsRef]
		.filter((it) => !(it.el as HTMLButtonElement).disabled)
		.sort((a, b) => (a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
	if (items.length === 0) return;
	const currentIndex = items.findIndex((it) => it.el === document.activeElement);

	let nextIndex = currentIndex;
	if (e.key === nextKey) {
		nextIndex = currentIndex + 1;
		if (nextIndex >= items.length) nextIndex = props.loop ? 0 : items.length - 1;
	} else if (e.key === prevKey) {
		nextIndex = currentIndex - 1;
		if (nextIndex < 0) nextIndex = props.loop ? items.length - 1 : 0;
	} else if (e.key === 'Home') {
		nextIndex = 0;
	} else if (e.key === 'End') {
		nextIndex = items.length - 1;
	}

	const target = items[nextIndex];
	if (target) {
		e.preventDefault();
		target.el.focus();
		onItemFocus(target.id);
	}
}

// Provide context using a plain object whose properties are computed getters,
// so Toggle children can read reactive values without a reactive() wrapper.
provide(ToggleGroupKey, {
	isPressed,
	toggle,
	get disabled() { return props.disabled; },
	get orientation() { return props.orientation as 'horizontal' | 'vertical'; },
	get rovingFocus() { return props.rovingFocus; },
	isTabbable,
	register,
	onItemFocus,
	onItemKeyDown,
});
</script>

<template>
	<div
		role="group"
		:aria-orientation="orientation"
		:data-orientation="orientation"
		:data-disabled="disabled ? '' : undefined"
	>
		<slot />
	</div>
</template>
