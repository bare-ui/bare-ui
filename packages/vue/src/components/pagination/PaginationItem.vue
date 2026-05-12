<script setup lang="ts">
import { computed } from 'vue'
import { usePaginationContext } from './keys'
import { useInteractiveState } from '@/composables/use-interactive-state'

defineOptions({ name: 'PaginationItem', inheritAttrs: false })

const props = withDefaults(
	defineProps<{
		page: number
		disabled?: boolean
	}>(),
	{
		disabled: false,
	},
)

const ctx = usePaginationContext()
const active = computed(() => ctx.page.value === props.page)
const { handlers, dataAttributes } = useInteractiveState({
	disabled: () => props.disabled,
})

function onClick() {
	ctx.goTo(props.page)
}
</script>

<template>
	<li v-bind="$attrs">
		<button
			type="button"
			:disabled="props.disabled"
			:aria-current="active ? 'page' : undefined"
			:aria-label="`Page ${props.page}`"
			v-bind="dataAttributes"
			:data-active="active ? '' : undefined"
			@click="onClick"
			@mouseenter="handlers.onMouseenter"
			@mouseleave="handlers.onMouseleave"
			@focus="handlers.onFocus"
			@blur="handlers.onBlur"
			@pointerdown="handlers.onPointerdown"
			@pointerup="handlers.onPointerup"
			@keydown="handlers.onKeydown"
			@keyup="handlers.onKeyup">
			<slot>{{ props.page }}</slot>
		</button>
	</li>
</template>
