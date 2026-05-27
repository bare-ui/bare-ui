<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useAttrs, watch } from 'vue';
import { useInteractiveState } from '@/composables/use-interactive-state';
import { useTabsContext } from './keys';

defineOptions({ name: 'TabsTrigger', inheritAttrs: false })

const props = withDefaults(defineProps<{
	value: string;
	disabled?: boolean;
}>(), { disabled: false })

const ctx = useTabsContext()
const { handlers, dataAttributes } = useInteractiveState({ disabled: () => props.disabled })
const attrs = useAttrs()
const el = ref<HTMLButtonElement | null>(null)

const isSelected = computed(() => ctx.value === props.value)
const triggerId = computed(() => `${ctx.baseId}-trigger-${props.value}`)
const contentId = computed(() => `${ctx.baseId}-content-${props.value}`)

onMounted(() => ctx.registerTrigger(props.value, el.value))
onUnmounted(() => ctx.registerTrigger(props.value, null))
watch(() => props.value, (next, prev) => {
	ctx.registerTrigger(prev, null)
	ctx.registerTrigger(next, el.value)
})

// Strip the listeners we manage so they aren't double-bound via fallthrough.
const HANDLED = ['onClick', 'onMouseenter', 'onMouseleave', 'onFocus', 'onBlur', 'onPointerdown', 'onPointerup', 'onKeydown', 'onKeyup']
const rest = computed(() => {
	const out: Record<string, unknown> = {}
	for (const key in attrs) if (!HANDLED.includes(key)) out[key] = attrs[key]
	return out
})

type Listener = ((e: Event) => void) | undefined
function compose(...fns: Listener[]) {
	return (e: Event) => { for (const fn of fns) fn?.(e) }
}

function focusByOffset(offset: number) {
	const order = ctx.getTriggerOrder()
	if (order.length === 0) return
	const currentIndex = order.indexOf(props.value)
	let nextIndex = (currentIndex + offset + order.length) % order.length
	let safety = order.length
	while (safety-- > 0) {
		const candidate = order[nextIndex]
		const node = document.getElementById(`${ctx.baseId}-trigger-${candidate}`) as HTMLButtonElement | null
		if (node && !node.disabled) {
			node.focus()
			if (ctx.activationMode === 'automatic') ctx.setValue(candidate)
			return
		}
		nextIndex = (nextIndex + offset + order.length) % order.length
	}
}

function focusEdge(edge: 'start' | 'end') {
	const order = ctx.getTriggerOrder()
	const ordered = edge === 'start' ? order : order.slice().reverse()
	for (const candidate of ordered) {
		const node = document.getElementById(`${ctx.baseId}-trigger-${candidate}`) as HTMLButtonElement | null
		if (node && !node.disabled) {
			node.focus()
			if (ctx.activationMode === 'automatic') ctx.setValue(candidate)
			return
		}
	}
}

function handleKeyDown(e: KeyboardEvent) {
	handlers.onKeydown(e)
	;(attrs.onKeydown as Listener)?.(e)
	if (e.defaultPrevented) return

	const horizontal = ctx.orientation === 'horizontal'
	const nextKey = horizontal ? 'ArrowRight' : 'ArrowDown'
	const prevKey = horizontal ? 'ArrowLeft' : 'ArrowUp'

	if (e.key === nextKey) {
		e.preventDefault()
		focusByOffset(1)
	} else if (e.key === prevKey) {
		e.preventDefault()
		focusByOffset(-1)
	} else if (e.key === 'Home') {
		e.preventDefault()
		focusEdge('start')
	} else if (e.key === 'End') {
		e.preventDefault()
		focusEdge('end')
	} else if (ctx.activationMode === 'manual' && (e.key === 'Enter' || e.key === ' ')) {
		e.preventDefault()
		ctx.setValue(props.value)
	}
}

function handleFocus(e: FocusEvent) {
	handlers.onFocus(e)
	;(attrs.onFocus as Listener)?.(e)
	if (ctx.activationMode === 'automatic' && !props.disabled) ctx.setValue(props.value)
}

function handleClick(e: Event) {
	if (!props.disabled) ctx.setValue(props.value)
	;(attrs.onClick as Listener)?.(e)
}
</script>

<template>
	<button
		:id="triggerId"
		ref="el"
		type="button"
		role="tab"
		:aria-selected="isSelected"
		:aria-controls="contentId"
		:tabindex="isSelected ? 0 : -1"
		:disabled="disabled"
		:data-state="isSelected ? 'active' : 'inactive'"
		:data-orientation="ctx.orientation"
		v-bind="{ ...rest, ...dataAttributes }"
		@click="handleClick"
		@keydown="handleKeyDown"
		@focus="handleFocus"
		@mouseenter="compose(handlers.onMouseenter, attrs.onMouseenter as Listener)"
		@mouseleave="compose(handlers.onMouseleave, attrs.onMouseleave as Listener)"
		@blur="compose(handlers.onBlur, attrs.onBlur as Listener)"
		@pointerdown="compose(handlers.onPointerdown, attrs.onPointerdown as Listener)"
		@pointerup="compose(handlers.onPointerup, attrs.onPointerup as Listener)"
		@keyup="compose(handlers.onKeyup as Listener, attrs.onKeyup as Listener)"
	>
		<slot />
	</button>
</template>
