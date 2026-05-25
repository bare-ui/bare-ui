<script setup lang="ts">
import { ref, computed, watch, provide, reactive, onUnmounted } from 'vue';
import { useReduceMotion } from '@/composables/use-reduce-motion';
import { TypewriterKey } from './keys';
import type { TypewriterMode } from './Typewriter.types';

defineOptions({ name: 'TypewriterRoot' });

// `class` is intentionally NOT declared here — declaring it would remove it
// from Vue's attribute fallthrough and silently drop the consumer's class.
// The public `class?: string` type lives in Typewriter.types.ts.
const props = withDefaults(defineProps<{
	text: string;
	speed?: number;
	mode?: TypewriterMode;
	startDelay?: number;
	autoStart?: boolean;
	resetOnTextChange?: boolean;
	loop?: boolean;
	loopDelay?: number;
	onComplete?: () => void;
}>(), {
	speed: 30,
	mode: 'char',
	startDelay: 0,
	autoStart: true,
	resetOnTextChange: false,
	loop: false,
	loopDelay: 1000,
	onComplete: undefined,
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns the index one whole word (plus trailing whitespace) past `from`. */
function nextWordBoundary(text: string, from: number): number {
	const rest = text.slice(from);
	const match = rest.match(/^\s*\S+\s*/);
	return match ? from + match[0].length : text.length;
}

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

const reduceMotion = useReduceMotion();

const count = ref(0);
// Bumped on each loop restart so the reveal effect re-runs from zero.
const cycle = ref(0);

// The reveal chain reschedules itself with setTimeout, so it advances
// independently of Vue re-renders. `countRef` carries the live position
// across ticks without forcing watchers to re-run on every token.
let countRef = 0;
let startedRef = false;
let firedRef = false;
let timerHandle: ReturnType<typeof globalThis.setTimeout> | undefined;

function setBoth(next: number) {
	countRef = next;
	count.value = next;
}

// Restart from the beginning when text changes and the consumer opted in.
watch(
	() => props.text,
	() => {
		if (props.resetOnTextChange) {
			firedRef = false;
			setBoth(0);
		}
	},
);

// ---------------------------------------------------------------------------
// Reveal chain
// ---------------------------------------------------------------------------

function cancelTimer() {
	if (timerHandle !== undefined) {
		globalThis.clearTimeout(timerHandle);
		timerHandle = undefined;
	}
}

function scheduleReveal() {
	cancelTimer();

	if (!props.autoStart || reduceMotion.value) return;
	if (countRef >= props.text.length) return;

	let cancelled = false;

	const tick = () => {
		if (cancelled) return;
		const c = countRef;
		if (c >= props.text.length) return;
		const next =
			props.mode === 'word'
				? nextWordBoundary(props.text, c)
				: Math.min(c + 1, props.text.length);
		setBoth(next);
		if (next < props.text.length) {
			timerHandle = globalThis.setTimeout(tick, props.speed);
		}
	};

	const initial = startedRef ? 0 : props.startDelay;
	startedRef = true;
	timerHandle = globalThis.setTimeout(tick, initial);

	// Return cleanup so watcher can cancel
	return () => {
		cancelled = true;
		cancelTimer();
	};
}

// Re-run reveal chain when text grows (streaming) or on loop restart.
// We track the cleanup function manually.
let revealCleanup: (() => void) | undefined;

watch(
	[() => props.text, () => props.autoStart, reduceMotion, () => props.speed, () => props.mode, () => props.startDelay, cycle],
	() => {
		revealCleanup?.();
		revealCleanup = scheduleReveal() ?? undefined;
	},
	{ immediate: true },
);

onUnmounted(() => {
	revealCleanup?.();
	cancelTimer();
});

// ---------------------------------------------------------------------------
// Derived reveal count
// ---------------------------------------------------------------------------

// Reduced motion reveals everything at once (derived, never animated).
const revealed = computed(() =>
	reduceMotion.value ? props.text.length : Math.min(count.value, props.text.length),
);

// ---------------------------------------------------------------------------
// onComplete
// ---------------------------------------------------------------------------

watch(
	[revealed, () => props.text.length],
	([rev, len]) => {
		if (len > 0 && rev >= len && !firedRef) {
			firedRef = true;
			props.onComplete?.();
		}
	},
);

// ---------------------------------------------------------------------------
// Loop
// ---------------------------------------------------------------------------

let loopTimer: ReturnType<typeof globalThis.setTimeout> | undefined;

watch(
	[() => props.loop, reduceMotion, revealed, () => props.text.length, () => props.loopDelay],
	([loop, rm, rev, len, delay]) => {
		if (loopTimer !== undefined) {
			globalThis.clearTimeout(loopTimer);
			loopTimer = undefined;
		}
		if (!loop || rm || len === 0 || rev < len) return;
		loopTimer = globalThis.setTimeout(() => {
			firedRef = false;
			setBoth(0);
			cycle.value += 1;
		}, delay);
	},
);

onUnmounted(() => {
	if (loopTimer !== undefined) globalThis.clearTimeout(loopTimer);
});

// ---------------------------------------------------------------------------
// Context / state exposed to children
// ---------------------------------------------------------------------------

const isTyping = computed(() => revealed.value < props.text.length);

const contextValue = reactive({
	displayed: computed(() => props.text.slice(0, revealed.value)),
	isTyping,
	isDone: computed(() => !isTyping.value),
	progress: computed(() =>
		props.text.length === 0 ? 1 : revealed.value / props.text.length,
	),
});

provide(TypewriterKey, contextValue);
</script>

<template>
	<span
		:data-state="isTyping ? 'typing' : 'done'"
		:aria-busy="isTyping || undefined"
	>
		<slot
			:displayed="contextValue.displayed"
			:is-typing="contextValue.isTyping"
			:is-done="contextValue.isDone"
			:progress="contextValue.progress"
		>{{ contextValue.displayed }}</slot>
	</span>
</template>
