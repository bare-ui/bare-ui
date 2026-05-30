<script setup lang="ts">
import { provide } from 'vue';
import { ToolbarKey } from './keys';
import type { ToolbarContextValue, ToolbarOrientation } from './Toolbar.types';
import { ref } from 'vue';

defineOptions({ name: 'ToolbarRoot' });

const props = withDefaults(defineProps<{
	/** Layout + arrow-key axis. Default `'horizontal'`. */
	orientation?: ToolbarOrientation;
	/** Wrap focus from last → first and vice versa. Default `true`. */
	loop?: boolean;
}>(), {
	orientation: 'horizontal',
	loop: true,
});

// ---------------------------------------------------------------------------
// Roving tabindex state.
//
// `items` is an intentionally plain array (not reactive) — registration and
// unregistration must not trigger component re-renders on their own.
// `activeId` is a ref so that tabIndex computeds on items re-evaluate when
// focus moves.
// ---------------------------------------------------------------------------

interface ToolbarItem {
	id: string;
	el: HTMLElement;
}

const items: ToolbarItem[] = [];
const activeId = ref<string | null>(null);

function register(id: string, el: HTMLElement): () => void {
	items.push({ id, el });
	// First registered item becomes the roving-tabindex anchor.
	if (activeId.value === null) {
		activeId.value = id;
	}
	return () => {
		const idx = items.findIndex((it) => it.id === id);
		if (idx !== -1) items.splice(idx, 1);
		if (activeId.value === id) {
			activeId.value = items[0]?.id ?? null;
		}
	};
}

// NOTE: this function is called inside a `computed()` in each child item, so
// Vue tracks `activeId` as a reactive dependency and the computed re-runs
// whenever focus moves.
function isTabbable(id: string): boolean {
	return activeId.value === id;
}

function onItemFocus(id: string): void {
	activeId.value = id;
}

function orderedEnabled(): ToolbarItem[] {
	return [...items]
		.filter((it) => {
			const btn = it.el as HTMLButtonElement;
			return !btn.disabled && it.el.getAttribute('aria-disabled') !== 'true';
		})
		.sort((a, b) =>
			a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
		);
}

function onItemKeyDown(e: KeyboardEvent): void {
	const nextKey = props.orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
	const prevKey = props.orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';

	if (!['Home', 'End', nextKey, prevKey].includes(e.key)) return;

	const ordered = orderedEnabled();
	if (ordered.length === 0) return;

	const currentIndex = ordered.findIndex((it) => it.el === document.activeElement);

	let nextIndex = currentIndex;
	if (e.key === nextKey) {
		nextIndex = currentIndex + 1;
		if (nextIndex >= ordered.length) nextIndex = props.loop ? 0 : ordered.length - 1;
	} else if (e.key === prevKey) {
		nextIndex = currentIndex - 1;
		if (nextIndex < 0) nextIndex = props.loop ? ordered.length - 1 : 0;
	} else if (e.key === 'Home') {
		nextIndex = 0;
	} else if (e.key === 'End') {
		nextIndex = ordered.length - 1;
	}

	const target = ordered[nextIndex];
	if (target) {
		e.preventDefault();
		target.el.focus();
		onItemFocus(target.id);
	}
}

// Provide context as a plain object whose methods close over reactive refs.
// Item children call `isTabbable` inside `computed()` so Vue tracks `activeId`
// as a dependency without needing a `reactive()` wrapper on this object.
const ctx: ToolbarContextValue = {
	get orientation() { return props.orientation; },
	isTabbable,
	register,
	onItemFocus,
	onItemKeyDown,
};

provide(ToolbarKey, ctx);
</script>

<template>
	<div
		role="toolbar"
		:aria-orientation="orientation"
		:data-orientation="orientation"
	>
		<slot />
	</div>
</template>
