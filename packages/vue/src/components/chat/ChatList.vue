<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';

defineOptions({ name: 'ChatList' })

const props = withDefaults(defineProps<{
	count: number;
	estimateItemHeight?: number;
	overscan?: number;
	stickToBottom?: boolean;
}>(), {
	estimateItemHeight: 72,
	overscan: 6,
	stickToBottom: true,
});

// Template refs
const scrollEl = ref<HTMLDivElement | null>(null);
const sizerEl = ref<HTMLDivElement | null>(null);

// State
const scrollTop = ref(0);
const viewportHeight = ref(0);
const measuredHeights = ref<Map<number, number>>(new Map());
const version = ref(0); // bumped whenever a measurement changes
const stickActive = ref(props.stickToBottom);

// Track item elements and observers
const itemElements = new Map<number, HTMLElement>();
let itemObserver: ResizeObserver | null = null;
let viewportObserver: ResizeObserver | null = null;

// Prefix-sum offsets computed from measurements
const offsets = computed(() => {
	// depend on version to recompute when measurements update
	void version.value;
	const arr = new Array<number>(props.count + 1);
	arr[0] = 0;
	for (let i = 0; i < props.count; i++) {
		const measured = measuredHeights.value.get(i);
		const h = measured && measured > 0 ? measured : props.estimateItemHeight;
		arr[i + 1] = arr[i] + h;
	}
	return arr;
});

const totalHeight = computed(() => offsets.value[props.count] ?? 0);

const visibleRange = computed(() => {
	if (props.count === 0) return { start: 0, end: 0 };
	const offs = offsets.value;
	const st = scrollTop.value;
	const vh = viewportHeight.value;
	let s = 0;
	while (s < props.count && offs[s + 1] <= st) s++;
	let e = s;
	const bottom = st + vh;
	while (e < props.count && offs[e] < bottom) e++;
	return {
		start: Math.max(0, s - props.overscan),
		end: Math.min(props.count, e + props.overscan),
	};
});

// Visible items array for v-for
const visibleItems = computed(() => {
	const { start, end } = visibleRange.value;
	const result: Array<{ index: number; top: number }> = [];
	for (let i = start; i < end; i++) {
		result.push({ index: i, top: offsets.value[i] });
	}
	return result;
});

// Set up item ref callback
function setItemRef(index: number) {
	return (el: Element | null) => {
		const prev = itemElements.get(index);
		if (prev && prev !== el) {
			itemObserver?.unobserve(prev);
			itemElements.delete(index);
		}
		if (el instanceof HTMLElement) {
			(el as HTMLElement).dataset.index = String(index);
			itemElements.set(index, el as HTMLElement);
			itemObserver?.observe(el as HTMLElement);
		}
	};
}

function handleScroll(e: Event) {
	const el = e.currentTarget as HTMLDivElement;
	scrollTop.value = el.scrollTop;
	stickActive.value = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
}

// Scroll to bottom when count or totalHeight changes (stick-to-bottom)
watch(
	[() => props.count, totalHeight],
	async () => {
		if (!stickActive.value) return;
		await nextTick();
		const el = scrollEl.value;
		if (el) el.scrollTop = el.scrollHeight;
	},
);

onMounted(() => {
	const el = scrollEl.value;
	if (!el) return;

	// Measure viewport
	viewportHeight.value = el.clientHeight;
	if (typeof ResizeObserver !== 'undefined') {
		viewportObserver = new ResizeObserver(() => {
			viewportHeight.value = el.clientHeight;
		});
		viewportObserver.observe(el);

		// Item measurement observer
		itemObserver = new ResizeObserver((entries) => {
			let changed = false;
			for (const entry of entries) {
				const target = entry.target as HTMLElement;
				const idx = Number(target.dataset.index);
				const h = target.offsetHeight;
				if (h > 0 && measuredHeights.value.get(idx) !== h) {
					measuredHeights.value.set(idx, h);
					changed = true;
				}
			}
			if (changed) version.value++;
		});
	}

	// Initial stick-to-bottom
	if (stickActive.value) {
		el.scrollTop = el.scrollHeight;
	}
});

onUnmounted(() => {
	viewportObserver?.disconnect();
	itemObserver?.disconnect();
});
</script>

<template>
	<div
		ref="scrollEl"
		role="log"
		aria-live="polite"
		aria-relevant="additions"
		style="overflow-y: auto; position: relative;"
		@scroll="handleScroll"
	>
		<div
			ref="sizerEl"
			data-chat-list-sizer=""
			:style="{ position: 'relative', width: '100%', height: `${totalHeight}px` }"
		>
			<div
				v-for="item in visibleItems"
				:key="item.index"
				:ref="(el) => setItemRef(item.index)(el as Element | null)"
				data-chat-item=""
				:data-index="item.index"
				:style="{ position: 'absolute', top: `${item.top}px`, left: 0, width: '100%' }"
			>
				<slot :index="item.index" />
			</div>
		</div>
	</div>
</template>
