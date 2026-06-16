<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { VirtualizerOrientation, VirtualItem } from './Virtualizer.types';

defineOptions({ name: 'VirtualizerRoot' });

const props = withDefaults(defineProps<{
	count: number;
	estimateSize?: number;
	overscan?: number;
	orientation?: VirtualizerOrientation;
	getItemKey?: (index: number) => string | number;
}>(), {
	estimateSize: 50,
	overscan: 4,
	orientation: 'vertical',
});

const emit = defineEmits<{
	scroll: [event: Event];
}>();

// Template refs
const scrollEl = ref<HTMLDivElement | null>(null);

// State
const scrollOffset = ref(0);
const viewport = ref(0);
const version = ref(0); // bumped whenever a measurement changes

// Mutable, non-reactive maps – no need to be reactive refs
const measuredSizes = new Map<number, number>();
const itemElements = new Map<number, HTMLElement>();
let itemObserver: ResizeObserver | null = null;
let viewportObserver: ResizeObserver | null = null;

const isVertical = computed(() => props.orientation === 'vertical');

// Prefix-sum offsets; measured sizes take over from the estimate once known.
const offsets = computed(() => {
	// depend on version to recompute when measurements update
	void version.value;
	const arr = new Array<number>(props.count + 1);
	arr[0] = 0;
	for (let i = 0; i < props.count; i++) {
		const m = measuredSizes.get(i);
		arr[i + 1] = arr[i] + (m && m > 0 ? m : props.estimateSize);
	}
	return arr;
});

const totalSize = computed(() => offsets.value[props.count] ?? 0);

const virtualItems = computed<VirtualItem[]>(() => {
	if (props.count === 0) return [];
	const offs = offsets.value;
	const offset = scrollOffset.value;
	const vp = viewport.value;

	let start = 0;
	while (start < props.count && offs[start + 1] <= offset) start++;
	let end = start;
	const limit = offset + vp;
	while (end < props.count && offs[end] < limit) end++;
	start = Math.max(0, start - props.overscan);
	end = Math.min(props.count, end + props.overscan);

	const items: VirtualItem[] = [];
	for (let index = start; index < end; index++) {
		items.push({
			index,
			start: offs[index],
			size: offs[index + 1] - offs[index],
		});
	}
	return items;
});

function setItemRef(index: number) {
	return (el: Element | null) => {
		const prev = itemElements.get(index);
		if (prev && prev !== el) {
			itemObserver?.unobserve(prev);
			itemElements.delete(index);
		}
		if (el instanceof HTMLElement) {
			el.dataset.index = String(index);
			itemElements.set(index, el);
			itemObserver?.observe(el);
		}
	};
}

function handleScroll(e: Event) {
	const el = e.currentTarget as HTMLDivElement;
	scrollOffset.value = isVertical.value ? el.scrollTop : el.scrollLeft;
	emit('scroll', e);
}

onMounted(() => {
	const el = scrollEl.value;
	if (!el) return;

	// Measure viewport
	viewport.value = isVertical.value ? el.clientHeight : el.clientWidth;

	if (typeof ResizeObserver === 'undefined') return;

	// Viewport observer
	viewportObserver = new ResizeObserver(() => {
		viewport.value = isVertical.value ? el.clientHeight : el.clientWidth;
	});
	viewportObserver.observe(el);

	// Item measurement observer
	itemObserver = new ResizeObserver((entries) => {
		let changed = false;
		for (const entry of entries) {
			const target = entry.target as HTMLElement;
			const index = Number(target.dataset.index);
			const size = isVertical.value ? target.offsetHeight : target.offsetWidth;
			if (size > 0 && measuredSizes.get(index) !== size) {
				measuredSizes.set(index, size);
				changed = true;
			}
		}
		if (changed) version.value++;
	});
});

onUnmounted(() => {
	viewportObserver?.disconnect();
	itemObserver?.disconnect();
	itemObserver = null;
	viewportObserver = null;
});
</script>

<template>
	<div
		ref="scrollEl"
		:data-orientation="orientation"
		:tabindex="0"
		:style="{
			position: 'relative',
			overflowY: isVertical ? 'auto' : 'hidden',
			overflowX: isVertical ? 'hidden' : 'auto',
		}"
		@scroll="handleScroll"
	>
		<div
			data-virtualizer-sizer=""
			:style="
				isVertical
					? { position: 'relative', width: '100%', height: `${totalSize}px` }
					: { position: 'relative', height: '100%', width: `${totalSize}px` }
			"
		>
			<div
				v-for="item in virtualItems"
				:key="getItemKey ? getItemKey(item.index) : item.index"
				:ref="(el) => setItemRef(item.index)(el as Element | null)"
				data-virtual-item=""
				:data-index="item.index"
				:style="
					isVertical
						? { position: 'absolute', top: `${item.start}px`, left: 0, width: '100%' }
						: { position: 'absolute', left: `${item.start}px`, top: 0, height: '100%' }
				"
			>
				<slot :item="item" :index="item.index" :start="item.start" :size="item.size" />
			</div>
		</div>
	</div>
</template>
