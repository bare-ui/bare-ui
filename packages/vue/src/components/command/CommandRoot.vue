<script setup lang="ts">
import { computed, provide, ref, watch } from 'vue';
import { useControllableState } from '@/composables/use-controllable-state';
import { useHotkeys } from '@/composables/use-hotkeys';
import { useId } from '@/composables/use-id';
import { CommandKey } from './keys';
import type { CommandContextValue, CommandFilter, CommandRegistryEntry } from './Command.types';

defineOptions({ name: 'CommandRoot' });

const props = withDefaults(defineProps<{
	searchValue?: string;
	defaultSearchValue?: string;
	onSearchChange?: (value: string) => void;
	filter?: CommandFilter;
	onSelect?: (value: string) => void;
	loop?: boolean;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	shortcut?: string;
}>(), {
	defaultSearchValue: undefined,
	onSearchChange: undefined,
	filter: undefined,
	onSelect: undefined,
	loop: true,
	open: undefined,
	defaultOpen: undefined,
	onOpenChange: undefined,
	shortcut: undefined,
});

// ---------------------------------------------------------------------------
// Default filter
// ---------------------------------------------------------------------------

const defaultFilter: CommandFilter = (value, search, keywords) => {
	if (!search) return true;
	const haystack = `${value} ${keywords.join(' ')}`.toLowerCase();
	return haystack.includes(search.trim().toLowerCase());
};

// ---------------------------------------------------------------------------
// Search query state
// ---------------------------------------------------------------------------

const query = useControllableState<string>({
	value: () => props.searchValue,
	defaultValue: props.defaultSearchValue ?? '',
	onChange: (v) => props.onSearchChange?.(v),
});

// ---------------------------------------------------------------------------
// Open state (managed mode)
// ---------------------------------------------------------------------------

const managed = computed(() => props.open !== undefined || props.defaultOpen !== undefined || !!props.shortcut);

const isOpen = useControllableState<boolean>({
	value: () => props.open,
	defaultValue: props.defaultOpen ?? !props.shortcut,
	onChange: (v) => props.onOpenChange?.(v),
});

// Hotkey to toggle open
useHotkeys(
	computed(() => props.shortcut ? { [props.shortcut]: () => { isOpen.value = !isOpen.value; } } : {}).value,
	{ enabled: () => !!props.shortcut, enableInInputs: true },
);

// ---------------------------------------------------------------------------
// Item registry
// ---------------------------------------------------------------------------

// Plain Map — not reactive; registration bumps `version` to trigger recomputes.
const registry = new Map<string, CommandRegistryEntry>();
const version = ref(0);

function registerItem(value: string, entry: CommandRegistryEntry): () => void {
	registry.set(value, entry);
	version.value++;
	return () => {
		registry.delete(value);
		version.value++;
	};
}

// ---------------------------------------------------------------------------
// Visible items (filtered)
// ---------------------------------------------------------------------------

const visible = computed<string[]>(() => {
	// depend on version so recomputes when items register/unregister
	void version.value;
	const filterFn = props.filter ?? defaultFilter;
	const result: string[] = [];
	for (const [value, entry] of registry) {
		if (filterFn(value, query.value, entry.keywords)) result.push(value);
	}
	return result;
});

// ---------------------------------------------------------------------------
// Active item
// ---------------------------------------------------------------------------

const activeRaw = ref<string | null>(null);

const activeValue = computed<string | null>(() => {
	if (activeRaw.value && visible.value.includes(activeRaw.value)) return activeRaw.value;
	return visible.value[0] ?? null;
});

function setActiveValue(value: string): void {
	activeRaw.value = value;
}

function moveActive(delta: number): void {
	if (visible.value.length === 0) return;
	const currentIndex = activeValue.value ? visible.value.indexOf(activeValue.value) : -1;
	let nextIndex = currentIndex + delta;
	if (nextIndex < 0) nextIndex = props.loop ? visible.value.length - 1 : 0;
	else if (nextIndex >= visible.value.length) nextIndex = props.loop ? 0 : visible.value.length - 1;
	activeRaw.value = visible.value[nextIndex];
}

// ---------------------------------------------------------------------------
// Select
// ---------------------------------------------------------------------------

function close(): void {
	if (managed.value) isOpen.value = false;
}

function selectItem(value: string): void {
	const entry = registry.get(value);
	if (!entry || entry.disabled) return;
	entry.onSelect?.(value);
	props.onSelect?.(value);
	if (managed.value) isOpen.value = false;
}

// ---------------------------------------------------------------------------
// IDs
// ---------------------------------------------------------------------------

const baseId = useId('command');
const listboxId = `${baseId}-list`;

function getItemId(value: string): string {
	return `${baseId}-item-${encodeURIComponent(value)}`;
}

// ---------------------------------------------------------------------------
// Group visibility helper
// ---------------------------------------------------------------------------

function groupHasVisible(groupId: string): boolean {
	return visible.value.some((v) => registry.get(v)?.groupId === groupId);
}

// ---------------------------------------------------------------------------
// Provide context
// ---------------------------------------------------------------------------

// Use a getter-based object rather than reactive() to avoid double-unwrapping
// issues with computed refs. Children that need reactivity call the functions
// or read properties inside their own computed().
const ctx: CommandContextValue = {
	get query() { return query.value; },
	setQuery(value: string) { query.value = value; },
	get searching() { return query.value.trim().length > 0; },
	get visible() { return visible.value; },
	get activeValue() { return activeValue.value; },
	setActiveValue,
	moveActive,
	registerItem,
	selectItem,
	isVisible(value: string) { return visible.value.includes(value); },
	isActive(value: string) { return value === activeValue.value; },
	groupHasVisible,
	get listboxId() { return listboxId; },
	getItemId,
	close,
};

provide(CommandKey, ctx);

// Track onSelect changes so per-item handlers always use the latest
watch(() => props.onSelect, () => { /* no-op: prop is read directly */ });
</script>

<template>
	<div
		v-if="!managed || isOpen"
		data-command-root=""
	>
		<slot />
	</div>
</template>
