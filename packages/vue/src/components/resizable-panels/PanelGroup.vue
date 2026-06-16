<script setup lang="ts">
import { computed, provide, ref, useTemplateRef } from 'vue'
import { useEventListener } from '@/composables/use-event-listener'
import { getDirection } from '@/composables/use-direction'
import { PanelGroupKey } from './keys'
import type { PanelConfig, PanelOrientation } from './ResizablePanels.types'

defineOptions({ name: 'PanelGroup' })

const props = withDefaults(
	defineProps<{
		orientation?: PanelOrientation
		sizes?: number[]
		defaultSizes?: number[]
		onSizesChange?: (sizes: number[]) => void
	}>(),
	{
		orientation: 'horizontal',
	},
)

function clamp(v: number, min: number, max: number) {
	return Math.min(Math.max(v, min), max)
}

function distributeRemaining(configs: PanelConfig[]): number[] {
	const explicit = configs.map((p) => p.defaultSize)
	const known = explicit.filter((s): s is number => typeof s === 'number')
	const knownSum = known.reduce((a, b) => a + b, 0)
	const remaining = Math.max(0, 100 - knownSum)
	const unknownCount = configs.length - known.length
	const evenShare = unknownCount > 0 ? remaining / unknownCount : 0
	return explicit.map((s) => (typeof s === 'number' ? s : evenShare))
}

interface PanelEntry {
	id: string
	config: PanelConfig
}

const containerRef = useTemplateRef<HTMLDivElement>('containerRef')
const panels = ref<PanelEntry[]>([])
const handles = ref<string[]>([])

const uncontrolled = ref<number[]>(props.defaultSizes ?? [])
const isControlled = computed(() => props.sizes !== undefined)

const orientation = computed(() => props.orientation)

const sizes = computed<number[]>(() => {
	if (panels.value.length === 0) return []
	if (isControlled.value && props.sizes && props.sizes.length === panels.value.length) {
		return props.sizes
	}
	if (!isControlled.value && uncontrolled.value.length === panels.value.length) {
		return uncontrolled.value
	}
	return distributeRemaining(panels.value.map((p) => p.config))
})

function setSizes(next: number[]) {
	if (!isControlled.value) uncontrolled.value = next
	props.onSizesChange?.(next)
}

function registerPanel(id: string, config: PanelConfig) {
	if (panels.value.some((p) => p.id === id)) return
	panels.value = [...panels.value, { id, config }]
	if (!isControlled.value && uncontrolled.value.length !== panels.value.length) {
		uncontrolled.value = distributeRemaining(panels.value.map((p) => p.config))
	}
}

function updatePanel(id: string, config: PanelConfig) {
	const entry = panels.value.find((p) => p.id === id)
	if (!entry) return
	const same =
		entry.config.defaultSize === config.defaultSize &&
		entry.config.minSize === config.minSize &&
		entry.config.maxSize === config.maxSize
	if (same) return
	entry.config = config
	panels.value = [...panels.value]
}

function unregisterPanel(id: string) {
	panels.value = panels.value.filter((p) => p.id !== id)
}

function registerHandle(id: string) {
	if (handles.value.includes(id)) return
	handles.value = [...handles.value, id]
}

function unregisterHandle(id: string) {
	handles.value = handles.value.filter((h) => h !== id)
}

function getPanelIndex(id: string) {
	return panels.value.findIndex((p) => p.id === id)
}

function getPanelSize(id: string) {
	const idx = panels.value.findIndex((p) => p.id === id)
	if (idx < 0) return 0
	return sizes.value[idx] ?? panels.value[idx].config.defaultSize ?? 0
}

// A handle at index k controls the boundary between panel k and panel k+1.
// Per the ARIA window-splitter pattern, expose the *primary* (preceding) panel's
// current/min/max size as aria-valuenow/min/max so AT can announce the split.
function getHandleValues(id: string) {
	const handleIndex = handles.value.indexOf(id)
	if (handleIndex < 0) return null
	const panel = panels.value[handleIndex]
	if (!panel) return null
	const now = sizes.value[handleIndex] ?? panel.config.defaultSize ?? 0
	const min = panel.config.minSize ?? 0
	const max = panel.config.maxSize ?? 100
	return { now: Math.round(now), min: Math.round(min), max: Math.round(max) }
}

interface DragState {
	handleIndex: number
	startSizes: number[]
	startPos: number
	containerLength: number
	rtl: boolean
}
let dragState: DragState | null = null

function startDrag(handleId: string, pointer: { x: number; y: number }) {
	const rect = containerRef.value?.getBoundingClientRect()
	if (!rect) return
	const handleIndex = handles.value.indexOf(handleId)
	if (handleIndex < 0) return
	const horizontal = orientation.value === 'horizontal'
	dragState = {
		handleIndex,
		startSizes: sizes.value.slice(),
		startPos: horizontal ? pointer.x : pointer.y,
		containerLength: horizontal ? rect.width : rect.height,
		// In an RTL row the first panel sits on the right, so a rightward drag
		// must shrink it — the horizontal delta is inverted.
		rtl: horizontal && getDirection(containerRef.value) === 'rtl',
	}
}

function onPointerMove(e: PointerEvent) {
	if (!dragState) return
	const horizontal = orientation.value === 'horizontal'
	const currentPos = horizontal ? e.clientX : e.clientY
	const deltaPx = currentPos - dragState.startPos
	const deltaPct = ((dragState.rtl ? -deltaPx : deltaPx) / dragState.containerLength) * 100

	const aIdx = dragState.handleIndex
	const bIdx = dragState.handleIndex + 1
	const ps = panels.value
	if (aIdx < 0 || bIdx >= dragState.startSizes.length || bIdx >= ps.length) return

	const aCfg = ps[aIdx].config
	const bCfg = ps[bIdx].config
	const aMin = aCfg.minSize ?? 0
	const aMax = aCfg.maxSize ?? 100
	const bMin = bCfg.minSize ?? 0
	const bMax = bCfg.maxSize ?? 100

	const next = dragState.startSizes.slice()
	let newA = clamp(next[aIdx] + deltaPct, aMin, aMax)
	let newB = next[bIdx] - (newA - next[aIdx])
	if (newB < bMin) {
		newB = bMin
		newA = next[aIdx] + (next[bIdx] - newB)
	} else if (newB > bMax) {
		newB = bMax
		newA = next[aIdx] + (next[bIdx] - newB)
	}
	next[aIdx] = newA
	next[bIdx] = newB
	setSizes(next)
}

function onPointerUp() {
	dragState = null
}

useEventListener('pointermove', onPointerMove)
useEventListener('pointerup', onPointerUp)
useEventListener('pointercancel', onPointerUp)

provide(PanelGroupKey, {
	orientation,
	getPanelSize,
	getPanelIndex,
	getHandleValues,
	registerPanel,
	updatePanel,
	unregisterPanel,
	registerHandle,
	unregisterHandle,
	startDrag,
})

const groupStyle = computed(() => ({
	display: 'flex',
	flexDirection: orientation.value === 'horizontal' ? ('row' as const) : ('column' as const),
	width: '100%',
	height: '100%',
}))
</script>

<template>
	<div
		ref="containerRef"
		:data-orientation="orientation"
		:style="groupStyle">
		<slot />
	</div>
</template>
