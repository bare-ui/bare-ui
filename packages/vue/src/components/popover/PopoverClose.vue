<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { useInteractiveState } from '@/composables/use-interactive-state';
import { usePopoverContext } from './keys';

defineOptions({ name: 'PopoverClose', inheritAttrs: false })

const ctx = usePopoverContext()
const { handlers, dataAttributes } = useInteractiveState()
const attrs = useAttrs()

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

function handleClick(e: Event) {
	ctx.setOpen(false)
	;(attrs.onClick as Listener)?.(e)
}
</script>

<template>
	<button
		type="button"
		v-bind="{ ...rest, ...dataAttributes }"
		@click="handleClick"
		@mouseenter="compose(handlers.onMouseenter, attrs.onMouseenter as Listener)"
		@mouseleave="compose(handlers.onMouseleave, attrs.onMouseleave as Listener)"
		@focus="compose(handlers.onFocus as Listener, attrs.onFocus as Listener)"
		@blur="compose(handlers.onBlur, attrs.onBlur as Listener)"
		@pointerdown="compose(handlers.onPointerdown, attrs.onPointerdown as Listener)"
		@pointerup="compose(handlers.onPointerup, attrs.onPointerup as Listener)"
		@keydown="compose(handlers.onKeydown as Listener, attrs.onKeydown as Listener)"
		@keyup="compose(handlers.onKeyup as Listener, attrs.onKeyup as Listener)"
	>
		<slot />
	</button>
</template>
