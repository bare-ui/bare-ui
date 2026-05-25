<script setup lang="ts">
import { provide, reactive, ref, computed } from 'vue';
import { CarouselKey } from './keys';
import type { CarouselContextValue, CarouselOrientation } from './Carousel.types';

defineOptions({ name: 'CarouselRoot' })

const props = withDefaults(defineProps<{
	orientation?: CarouselOrientation;
	loop?: boolean;
	defaultIndex?: number;
	onIndexChange?: (index: number) => void;
}>(), {
	orientation: 'horizontal',
	loop: false,
	defaultIndex: 0,
	onIndexChange: undefined,
});

// Viewport element written by CarouselViewport via setViewportEl
const viewportEl = ref<HTMLDivElement | null>(null);

// Slides registry
const slides: HTMLElement[] = [];
const count = ref(0);
const current = ref(props.defaultIndex);

function domOrder(a: HTMLElement, b: HTMLElement): number {
	return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
}

function setCurrentIndex(index: number) {
	if (current.value === index) return;
	props.onIndexChange?.(index);
	current.value = index;
}

function registerSlide(el: HTMLElement): () => void {
	slides.push(el);
	slides.sort(domOrder);
	count.value = slides.length;
	return () => {
		const i = slides.indexOf(el);
		if (i !== -1) slides.splice(i, 1);
		count.value = slides.length;
	};
}

function offsetOf(el: HTMLElement): number {
	const vp = viewportEl.value;
	if (!vp) return 0;
	const vertical = props.orientation === 'vertical';
	const vpRect = vp.getBoundingClientRect();
	const rect = el.getBoundingClientRect();
	return vertical ? rect.top - vpRect.top + vp.scrollTop : rect.left - vpRect.left + vp.scrollLeft;
}

function updateCurrent() {
	const vp = viewportEl.value;
	if (!vp || slides.length === 0) return;
	const vertical = props.orientation === 'vertical';
	const scroll = vertical ? vp.scrollTop : vp.scrollLeft;
	let best = 0;
	let bestDist = Infinity;
	slides.forEach((el, i) => {
		const dist = Math.abs(offsetOf(el) - scroll);
		if (dist < bestDist) {
			bestDist = dist;
			best = i;
		}
	});
	setCurrentIndex(best);
}

function scrollTo(index: number, behavior: 'auto' | 'smooth' | 'instant' = 'smooth') {
	const clamped = Math.min(Math.max(index, 0), Math.max(slides.length - 1, 0));
	setCurrentIndex(clamped);
	const vp = viewportEl.value;
	const el = slides[clamped];
	if (!vp || !el) return;
	const target = offsetOf(el);
	const vertical = props.orientation === 'vertical';
	if (typeof vp.scrollTo === 'function') {
		vp.scrollTo(vertical ? { top: target, behavior } : { left: target, behavior });
	} else if (vertical) {
		vp.scrollTop = target;
	} else {
		vp.scrollLeft = target;
	}
}

function scrollNext() {
	const next = current.value + 1;
	if (next < count.value) scrollTo(next);
	else if (props.loop) scrollTo(0);
}

function scrollPrev() {
	const prev = current.value - 1;
	if (prev >= 0) scrollTo(prev);
	else if (props.loop) scrollTo(count.value - 1);
}

function setViewportEl(el: HTMLDivElement | null) {
	viewportEl.value = el;
}

// Cast through unknown to satisfy the InjectionKey type while still using reactive()
// for auto-unwrapping of computed refs. At runtime, ctx.count etc. are plain values
// because reactive() unwraps ComputedRef automatically.
provide(CarouselKey, reactive({
	orientation: computed(() => props.orientation),
	loop: computed(() => props.loop),
	count: computed(() => count.value),
	current: computed(() => current.value),
	canScrollPrev: computed(() => props.loop ? count.value > 1 : current.value > 0),
	canScrollNext: computed(() => props.loop ? count.value > 1 : current.value < count.value - 1),
	viewportEl: null as HTMLDivElement | null,
	setViewportEl,
	registerSlide,
	updateCurrent,
	scrollTo,
	scrollNext,
	scrollPrev,
}) as unknown as CarouselContextValue);
</script>

<template>
	<div
		role="region"
		aria-roledescription="carousel"
		:data-orientation="orientation"
	>
		<slot />
	</div>
</template>
