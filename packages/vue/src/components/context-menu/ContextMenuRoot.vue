<script setup lang="ts">
import { computed, onMounted, onUnmounted, provide, ref, watch } from 'vue'
import { useControllableState } from '@/composables/use-controllable-state'
import { useKeyboard } from '@/composables/use-keyboard'
import { ContextMenuKey } from './keys'

defineOptions({ name: 'ContextMenuRoot' })

const props = withDefaults(
	defineProps<{
		/** Controlled open state. */
		open?: boolean
		/** Initial open state (uncontrolled). */
		defaultOpen?: boolean
		/** Called when the open state changes (right-click to open, outside click or Escape to close). */
		onOpenChange?: (open: boolean) => void
		/** Disable the context menu so right-click falls back to the native menu. */
		disabled?: boolean
	}>(),
	{
		open: undefined,
		defaultOpen: false,
		disabled: false,
	},
)

const open = useControllableState<boolean>({
	value: () => props.open,
	defaultValue: props.defaultOpen,
	onChange: (next) => props.onOpenChange?.(next),
})

const disabled = computed(() => props.disabled)
const position = ref({ x: 0, y: 0 })

function setOpen(next: boolean) {
	open.value = next
}

function openAt(x: number, y: number) {
	position.value = { x, y }
	setOpen(true)
}

function close() {
	setOpen(false)
}

function isInsideContent(target: EventTarget | null) {
	return target instanceof Element && !!target.closest('[data-context-menu-content]')
}

function onPointer(e: MouseEvent | TouchEvent) {
	if (isInsideContent(e.target)) return
	close()
}

function preventWheel(e: WheelEvent) {
	if (isInsideContent(e.target)) return
	e.preventDefault()
}

function preventTouchMove(e: TouchEvent) {
	if (isInsideContent(e.target)) return
	e.preventDefault()
}

const SCROLL_KEYS = new Set([
	'ArrowUp',
	'ArrowDown',
	'ArrowLeft',
	'ArrowRight',
	'PageUp',
	'PageDown',
	'Home',
	'End',
	' ',
])

function preventScrollKeys(e: KeyboardEvent) {
	if (!SCROLL_KEYS.has(e.key)) return
	const target = e.target as HTMLElement | null
	if (target) {
		const tag = target.tagName
		if (tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable) return
		if (isInsideContent(target)) return
	}
	e.preventDefault()
}

let attached = false
function attachListeners() {
	if (attached) return
	attached = true
	document.addEventListener('mousedown', onPointer)
	document.addEventListener('touchstart', onPointer)
	document.addEventListener('wheel', preventWheel, { passive: false })
	document.addEventListener('touchmove', preventTouchMove, { passive: false })
	document.addEventListener('keydown', preventScrollKeys)
}

function detachListeners() {
	if (!attached) return
	attached = false
	document.removeEventListener('mousedown', onPointer)
	document.removeEventListener('touchstart', onPointer)
	document.removeEventListener('wheel', preventWheel)
	document.removeEventListener('touchmove', preventTouchMove)
	document.removeEventListener('keydown', preventScrollKeys)
}

watch(open, (v) => {
	if (v) attachListeners()
	else detachListeners()
})

useKeyboard(
	{ Escape: () => { if (open.value) close() } },
	{ event: 'keyup' },
)

onMounted(() => {
	if (open.value) attachListeners()
})

onUnmounted(detachListeners)

provide(ContextMenuKey, {
	open,
	disabled,
	position,
	openAt,
	close,
})
</script>

<template>
	<div :data-state="open ? 'open' : 'closed'">
		<slot />
	</div>
</template>
