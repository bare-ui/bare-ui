<script setup lang="ts">
import { computed, onMounted, onUnmounted, provide, ref, watch } from 'vue'
import { ContextMenuKey } from './keys'

defineOptions({ name: 'ContextMenuRoot' })

const props = withDefaults(
	defineProps<{
		open?: boolean
		defaultOpen?: boolean
		onOpenChange?: (open: boolean) => void
		disabled?: boolean
	}>(),
	{
		open: undefined,
		defaultOpen: false,
		disabled: false,
	},
)

const uncontrolledOpen = ref<boolean>(props.defaultOpen)
const isControlled = computed(() => props.open !== undefined)
const open = computed<boolean>(() =>
	isControlled.value ? (props.open as boolean) : uncontrolledOpen.value,
)
const disabled = computed(() => props.disabled)
const position = ref({ x: 0, y: 0 })

function setOpen(next: boolean) {
	if (!isControlled.value) uncontrolledOpen.value = next
	props.onOpenChange?.(next)
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

function onKeyUp(e: KeyboardEvent) {
	if (e.key === 'Escape' && open.value) close()
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

onMounted(() => {
	window.addEventListener('keyup', onKeyUp)
	if (open.value) attachListeners()
})

onUnmounted(() => {
	window.removeEventListener('keyup', onKeyUp)
	detachListeners()
})

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
