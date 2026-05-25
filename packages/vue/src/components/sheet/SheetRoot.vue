<script setup lang="ts">
import { computed, onMounted, onUnmounted, provide, reactive, ref } from 'vue';
import { useControllableState } from '@/composables/use-controllable-state';
import { useId } from '@/composables/use-id';
import { useKeyboard } from '@/composables/use-keyboard';
import { useScrollLock } from '@/composables/use-scroll-lock';
import { SheetKey } from './keys';

defineOptions({ name: 'SheetRoot' })

const props = withDefaults(defineProps<{
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	side?: 'top' | 'bottom';
	snapPoints?: number[];
	activeSnapPoint?: number;
	defaultActiveSnapPoint?: number;
	onActiveSnapPointChange?: (index: number) => void;
	modal?: boolean;
	dismissible?: boolean;
}>(), {
	open: undefined,
	defaultOpen: false,
	onOpenChange: undefined,
	side: 'bottom',
	snapPoints: () => [1],
	activeSnapPoint: undefined,
	defaultActiveSnapPoint: undefined,
	onActiveSnapPointChange: undefined,
	modal: true,
	dismissible: true,
})

// ---------------------------------------------------------------------------
// Open state
// ---------------------------------------------------------------------------

const isOpen = useControllableState<boolean>({
	value: () => props.open,
	defaultValue: props.defaultOpen,
	onChange: (v) => props.onOpenChange?.(v),
})

// ---------------------------------------------------------------------------
// Viewport / snap geometry
// ---------------------------------------------------------------------------

const viewport = ref(typeof window !== 'undefined' ? window.innerHeight : 0)

function readViewport() {
	viewport.value = window.innerHeight
}

onMounted(() => {
	// Re-read on mount in case SSR placeholder was used, then track resizes
	readViewport()
	window.addEventListener('resize', readViewport)
})

onUnmounted(() => {
	window.removeEventListener('resize', readViewport)
})

const snapSizes = computed(() =>
	props.snapPoints.map((p) => (p <= 1 ? p * viewport.value : p)),
)

const maxSize = computed(() =>
	snapSizes.value.length ? Math.max(...snapSizes.value) : viewport.value,
)

const closedOffset = computed(() => maxSize.value)

const snapOffsets = computed(() =>
	snapSizes.value.map((s) => maxSize.value - s),
)

// ---------------------------------------------------------------------------
// Active snap
// ---------------------------------------------------------------------------

const defaultSnap = computed(() =>
	props.defaultActiveSnapPoint !== undefined
		? props.defaultActiveSnapPoint
		: props.snapPoints.length - 1,
)

const activeSnap = useControllableState<number>({
	value: () => props.activeSnapPoint,
	defaultValue: defaultSnap.value,
	onChange: (v) => props.onActiveSnapPointChange?.(v),
})

// ---------------------------------------------------------------------------
// Drag state
// ---------------------------------------------------------------------------

const dragOffset = ref<number | null>(null)

let dragStart: { x: number; y: number; offset: number } | null = null

function clamp(n: number, min: number, max: number) {
	return Math.min(Math.max(n, min), max)
}

function offsetDelta(dy: number): number {
	return props.side === 'top' ? -dy : dy
}

function currentOffset(): number {
	const snap = clamp(activeSnap.value, 0, snapOffsets.value.length - 1)
	return isOpen.value ? (snapOffsets.value[snap] ?? 0) : closedOffset.value
}

function startDrag(clientX: number, clientY: number) {
	dragStart = { x: clientX, y: clientY, offset: currentOffset() }
	dragOffset.value = currentOffset()
}

function moveDrag(_clientX: number, clientY: number) {
	if (!dragStart) return
	const delta = offsetDelta(clientY - dragStart.y)
	const max = props.dismissible ? closedOffset.value : Math.max(...snapOffsets.value, 0)
	dragOffset.value = clamp(dragStart.offset + delta, 0, max)
}

function endDrag() {
	const start = dragStart
	dragStart = null
	if (dragOffset.value === null || !start) {
		dragOffset.value = null
		return
	}

	const smallestVisibleOffset = Math.max(...snapOffsets.value, 0)
	const closeThreshold = smallestVisibleOffset + (closedOffset.value - smallestVisibleOffset) / 2

	if (props.dismissible && dragOffset.value > closeThreshold) {
		dragOffset.value = null
		isOpen.value = false
		return
	}

	// Snap to nearest open position
	let nearest = 0
	let best = Infinity
	snapOffsets.value.forEach((o, i) => {
		const dist = Math.abs((dragOffset.value as number) - o)
		if (dist < best) {
			best = dist
			nearest = i
		}
	})
	dragOffset.value = null
	activeSnap.value = nearest
}

// ---------------------------------------------------------------------------
// Keyboard / scroll lock
// ---------------------------------------------------------------------------

useKeyboard({
	Escape: () => {
		if (isOpen.value && props.dismissible) isOpen.value = false
	},
})

useScrollLock(computed(() => isOpen.value && props.modal))

// ---------------------------------------------------------------------------
// IDs
// ---------------------------------------------------------------------------

const baseId = useId('sheet')
const titleId = `${baseId}-title`
const descriptionId = `${baseId}-description`

// ---------------------------------------------------------------------------
// Provide context
// ---------------------------------------------------------------------------

provide(SheetKey, reactive({
	open: isOpen,
	setOpen: (v: boolean) => { isOpen.value = v },
	side: computed(() => props.side),
	modal: computed(() => props.modal),
	dismissible: computed(() => props.dismissible),
	snapSizes,
	snapOffsets,
	maxSize,
	closedOffset,
	activeSnap,
	setActiveSnap: (v: number) => { activeSnap.value = v },
	dragOffset,
	startDrag,
	moveDrag,
	endDrag,
	titleId,
	descriptionId,
}))
</script>

<template>
	<slot />
</template>
