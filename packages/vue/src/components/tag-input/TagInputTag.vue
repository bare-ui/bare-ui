<script setup lang="ts">
import { nextTick } from 'vue'
import type { TagInputTagProps } from './TagInput.types'

defineOptions({ name: 'TagInputTag', inheritAttrs: false })

const props = withDefaults(defineProps<TagInputTagProps>(), {
	removeContent: '×',
})

defineSlots<{
	default(): unknown
	remove(): unknown
}>()

function onRemoveClick(e: MouseEvent) {
	// Identify the adjacent remove button so keyboard focus isn't dropped to
	// <body> when this tag unmounts. The list re-renders after removal, so
	// remember the neighbour and restore focus to it once the DOM updates.
	const button = e.currentTarget as HTMLElement
	const list = button.closest('[data-taginput-tag]')?.parentElement
	const buttons = list
		? Array.from(list.querySelectorAll<HTMLElement>('[data-taginput-remove]'))
		: []
	const idx = buttons.indexOf(button)
	const neighbour = buttons[idx + 1] ?? buttons[idx - 1]
	const neighbourLabel = neighbour?.getAttribute('aria-label') ?? undefined

	props.onRemove()

	if (neighbourLabel && list) {
		void nextTick(() => {
			const next = Array.from(
				list.querySelectorAll<HTMLElement>('[data-taginput-remove]'),
			).find((el) => el.getAttribute('aria-label') === neighbourLabel)
			next?.focus()
		})
	}
}
</script>

<template>
	<span
		data-taginput-tag=""
		v-bind="$attrs">
		<slot>{{ props.label }}</slot>
		<button
			type="button"
			data-taginput-remove=""
			:class="props.removeClassName"
			:aria-label="props.removeLabel ?? `Remove ${props.label}`"
			@click="onRemoveClick">
			<slot name="remove">{{ props.removeContent }}</slot>
		</button>
	</span>
</template>
