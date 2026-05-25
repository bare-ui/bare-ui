<script setup lang="ts">
import { provide, reactive, onBeforeUnmount } from 'vue';
import { useControllableState } from '@/composables/use-controllable-state';
import { HoverCardKey } from './keys';

defineOptions({ name: 'HoverCardRoot' });

const props = withDefaults(defineProps<{
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	openDelay?: number;
	closeDelay?: number;
}>(), {
	open: undefined,
	defaultOpen: false,
	onOpenChange: undefined,
	openDelay: 300,
	closeDelay: 200,
});

const open = useControllableState<boolean>({
	value: () => props.open,
	defaultValue: props.defaultOpen,
	onChange: (next) => props.onOpenChange?.(next),
});

let openTimer: ReturnType<typeof setTimeout> | null = null;
let closeTimer: ReturnType<typeof setTimeout> | null = null;

function clearTimers() {
	if (openTimer) clearTimeout(openTimer);
	if (closeTimer) clearTimeout(closeTimer);
	openTimer = null;
	closeTimer = null;
}

onBeforeUnmount(clearTimers);

function scheduleOpen() {
	if (closeTimer) clearTimeout(closeTimer);
	closeTimer = null;
	if (openTimer) return;
	openTimer = setTimeout(() => {
		openTimer = null;
		open.value = true;
	}, props.openDelay);
}

function scheduleClose() {
	if (openTimer) clearTimeout(openTimer);
	openTimer = null;
	if (closeTimer) return;
	closeTimer = setTimeout(() => {
		closeTimer = null;
		open.value = false;
	}, props.closeDelay);
}

function openNow() {
	clearTimers();
	open.value = true;
}

function closeNow() {
	clearTimers();
	open.value = false;
}

provide(HoverCardKey, reactive({
	open,
	scheduleOpen,
	scheduleClose,
	openNow,
	closeNow,
}));
</script>

<template>
	<span :style="{ position: 'relative', display: 'inline-block' }">
		<slot />
	</span>
</template>
