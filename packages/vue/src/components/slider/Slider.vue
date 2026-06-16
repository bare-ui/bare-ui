<script setup lang="ts">
import { computed, onUnmounted, ref, type CSSProperties } from 'vue';
import { getDirection, useDirection } from '@/composables/use-direction';
import type { SliderOrientation, SliderValue } from './Slider.types';

defineOptions({ name: 'Slider' })

const props = withDefaults(defineProps<{
	/** Minimum value. */
	min?: number;
	/** Maximum value. */
	max?: number;
	/** Step increment. */
	step?: number;
	/** Layout orientation. */
	orientation?: SliderOrientation;
	/** Disable the slider. */
	disabled?: boolean;
	/** Inverted (right-to-left or top-to-bottom). */
	inverted?: boolean;
	/** Enable two-thumb range mode. With `range`, `value` becomes `[start, end]`. */
	range?: boolean;
	/** Controlled value — a number in single mode, `[start, end]` in range mode. */
	value?: number | [number, number];
	/** Initial value, uncontrolled — a number in single mode, `[start, end]` in range mode. */
	defaultValue?: number | [number, number];
	/** Called when the value changes. */
	onChange?: (value: number | [number, number]) => void;
	/** Optional human-readable label for ARIA. */
	'aria-label'?: string;
}>(), {
	min: 0,
	max: 100,
	step: 1,
	orientation: 'horizontal',
	disabled: false,
	inverted: false,
	range: false,
	value: undefined,
	defaultValue: undefined,
	onChange: undefined,
	'aria-label': undefined,
})

// --- Helpers ---------------------------------------------------------------
function clamp(v: number, min: number, max: number) {
	return Math.min(Math.max(v, min), max)
}

function snapToStep(value: number, min: number, step: number) {
	const stepped = Math.round((value - min) / step) * step + min
	return Number.isFinite(stepped) ? stepped : value
}

function getDecimals(step: number) {
	const s = step.toString()
	const dot = s.indexOf('.')
	return dot === -1 ? 0 : s.length - dot - 1
}

function roundFixed(value: number, decimals: number) {
	const factor = Math.pow(10, decimals)
	return Math.round(value * factor) / factor
}

function arraysEqual(a: SliderValue, b: SliderValue) {
	if (a.length !== b.length) return false
	for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false
	return true
}

const isRange = computed(() => props.range === true)

// --- Controlled / uncontrolled value state ---------------------------------
function makeInitial(): SliderValue {
	const decimals = getDecimals(props.step)
	const raw: SliderValue = isRange.value
		? ((props.defaultValue as [number, number] | undefined) ?? [props.min, props.max])
		: [(props.defaultValue as number | undefined) ?? props.min]
	return raw.map((v) => roundFixed(clamp(snapToStep(v, props.min, props.step), props.min, props.max), decimals))
}

const uncontrolled = ref<SliderValue>(makeInitial())

const isControlled = computed(() => props.value !== undefined)
const controlledValue = computed<SliderValue | undefined>(() => {
	if (props.value === undefined) return undefined
	return Array.isArray(props.value) ? props.value : [props.value]
})
const thumbValues = computed<SliderValue>(() => (isControlled.value ? (controlledValue.value as SliderValue) : uncontrolled.value))

const decimals = computed(() => getDecimals(props.step))

function emit(next: SliderValue) {
	const d = getDecimals(props.step)
	const normalized = next.map((v) => roundFixed(clamp(snapToStep(v, props.min, props.step), props.min, props.max), d))
	if (isRange.value && normalized[0] > normalized[1]) [normalized[0], normalized[1]] = [normalized[1], normalized[0]]
	if (arraysEqual(normalized, thumbValues.value)) return
	if (!isControlled.value) uncontrolled.value = normalized
	if (isRange.value) (props.onChange as ((v: [number, number]) => void) | undefined)?.([normalized[0], normalized[1]])
	else (props.onChange as ((v: number) => void) | undefined)?.(normalized[0])
}

// --- Track / thumb interaction ---------------------------------------------
const trackRef = ref<HTMLDivElement | null>(null)
const direction = useDirection(trackRef)
const rtl = computed(() => direction.value === 'rtl')
let dragging: { thumbIndex: number } | null = null

function valueFromPoint(clientX: number, clientY: number): number {
	const el = trackRef.value
	if (!el) return props.min
	const rect = el.getBoundingClientRect()
	const isHorizontal = props.orientation === 'horizontal'
	const start = isHorizontal ? rect.left : rect.top
	const length = isHorizontal ? rect.width : rect.height
	const point = isHorizontal ? clientX : clientY
	let pct = (point - start) / length
	if (!isHorizontal) pct = props.inverted ? pct : 1 - pct // vertical default = bottom→top
	else {
		// In RTL the horizontal axis is mirrored: the track's start (min) sits on
		// the right, so the fraction measured from the physical left must flip.
		const isRtl = getDirection(el) === 'rtl'
		if (props.inverted !== isRtl) pct = 1 - pct
	}
	pct = clamp(pct, 0, 1)
	return props.min + pct * (props.max - props.min)
}

function closestThumb(target: number): number {
	if (!isRange.value) return 0
	const da = Math.abs(target - thumbValues.value[0])
	const db = Math.abs(target - thumbValues.value[1])
	return da <= db ? 0 : 1
}

function updateThumb(thumbIndex: number, target: number) {
	const next = thumbValues.value.slice()
	next[thumbIndex] = target
	emit(next)
}

function handlePointerDown(e: PointerEvent) {
	if (props.disabled) return
	const target = valueFromPoint(e.clientX, e.clientY)
	const thumbIndex = closestThumb(target)
	dragging = { thumbIndex }
	;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
	updateThumb(thumbIndex, target)
}

function handlePointerMove(e: PointerEvent) {
	if (!dragging) return
	const target = valueFromPoint(e.clientX, e.clientY)
	updateThumb(dragging.thumbIndex, target)
}

function handlePointerUp(e: PointerEvent) {
	if (!dragging) return
	;(e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId)
	dragging = null
}

onUnmounted(() => { dragging = null })

// --- Keyboard --------------------------------------------------------------
function onThumbKeyDown(e: KeyboardEvent, thumbIndex: number) {
	if (props.disabled) return
	const horizontal = props.orientation === 'horizontal'
	// RTL mirrors the horizontal axis, so the arrow that increases the value flips.
	const flipH = horizontal && props.inverted !== (getDirection(e.currentTarget as Element) === 'rtl')
	const incKey = horizontal ? (flipH ? 'ArrowLeft' : 'ArrowRight') : (props.inverted ? 'ArrowDown' : 'ArrowUp')
	const decKey = horizontal ? (flipH ? 'ArrowRight' : 'ArrowLeft') : (props.inverted ? 'ArrowUp' : 'ArrowDown')
	const big = props.step * 10

	let delta = 0
	if (e.key === incKey) delta = props.step
	else if (e.key === decKey) delta = -props.step
	else if (e.key === 'PageUp') delta = big
	else if (e.key === 'PageDown') delta = -big
	else if (e.key === 'Home') {
		e.preventDefault()
		updateThumb(thumbIndex, props.min)
		return
	} else if (e.key === 'End') {
		e.preventDefault()
		updateThumb(thumbIndex, props.max)
		return
	} else return

	e.preventDefault()
	updateThumb(thumbIndex, thumbValues.value[thumbIndex] + delta)
}

// --- Render ----------------------------------------------------------------
const pct = computed(() => thumbValues.value.map((v) => ((v - props.min) / (props.max - props.min)) * 100))
const fillStart = computed(() => (isRange.value ? Math.min(pct.value[0], pct.value[1]) : 0))
const fillEnd = computed(() => (isRange.value ? Math.max(pct.value[0], pct.value[1]) : pct.value[0]))
const isHorizontal = computed(() => props.orientation === 'horizontal')

const rootStyle: CSSProperties = { position: 'relative', userSelect: 'none', touchAction: 'none' }

// In RTL the horizontal axis is mirrored. Folding that into `inverted` keeps the
// LTR render path unchanged.
const placeInverted = computed(() => (isHorizontal.value ? props.inverted !== rtl.value : props.inverted))

const fillStyle = computed<CSSProperties>(() => {
	const start = fillStart.value
	const end = fillEnd.value
	if (isHorizontal.value) {
		return placeInverted.value
			? { position: 'absolute', right: `${start}%`, width: `${end - start}%`, top: 0, bottom: 0 }
			: { position: 'absolute', left: `${start}%`, width: `${end - start}%`, top: 0, bottom: 0 }
	}
	return props.inverted
		? { position: 'absolute', top: `${start}%`, height: `${end - start}%`, left: 0, right: 0 }
		: { position: 'absolute', bottom: `${start}%`, height: `${end - start}%`, left: 0, right: 0 }
})

function thumbStyle(i: number): CSSProperties {
	const p = pct.value[i]
	if (isHorizontal.value) {
		return placeInverted.value
			? { position: 'absolute', right: `${p}%`, top: '50%', transform: 'translate(50%, -50%)' }
			: { position: 'absolute', left: `${p}%`, top: '50%', transform: 'translate(-50%, -50%)' }
	}
	return props.inverted
		? { position: 'absolute', top: `${p}%`, left: '50%', transform: 'translate(-50%, -50%)' }
		: { position: 'absolute', bottom: `${p}%`, left: '50%', transform: 'translate(-50%, 50%)' }
}

const ariaLabel = computed(() => (isRange.value ? props['aria-label'] : undefined))
</script>

<template>
	<div
		ref="trackRef"
		:role="isRange ? 'group' : undefined"
		:aria-label="ariaLabel"
		:data-orientation="orientation"
		:data-disabled="disabled ? '' : undefined"
		:style="rootStyle"
		@pointerdown="handlePointerDown"
		@pointermove="handlePointerMove"
		@pointerup="handlePointerUp"
		@pointercancel="handlePointerUp"
	>
		<span data-part="track" :style="{ position: 'absolute', inset: 0 }" />
		<span data-part="fill" :style="fillStyle" />
		<span
			v-for="(v, i) in thumbValues"
			:key="i"
			role="slider"
			:tabindex="disabled ? -1 : 0"
			:aria-valuemin="min"
			:aria-valuemax="max"
			:aria-valuenow="roundFixed(v, decimals)"
			:aria-orientation="orientation"
			:aria-disabled="disabled || undefined"
			data-part="thumb"
			:data-thumb-index="i"
			:data-disabled="disabled ? '' : undefined"
			:style="thumbStyle(i)"
			@keydown="(e: KeyboardEvent) => onThumbKeyDown(e, i)"
		/>
	</div>
</template>
