<script setup lang="ts">
import { onMounted, onUpdated } from 'vue'
import { useComboboxContext } from './keys'
import type { ComboboxOption } from './Combobox.types'

defineOptions({ name: 'ComboboxItems' })

defineSlots<{
	default(props: { option: ComboboxOption; highlighted: boolean; selected: boolean }): unknown
}>()

const ctx = useComboboxContext()

function scrollHighlightedIntoView() {
	if (!ctx.open.value || ctx.highlightedIndex.value < 0) return
	const opt = ctx.filtered.value[ctx.highlightedIndex.value]
	if (!opt) return
	const el = typeof document !== 'undefined' ? document.getElementById(ctx.getOptionId(opt.value)) : null
	if (!el) return

	let container: HTMLElement | null = el.parentElement
	while (container) {
		const overflowY = getComputedStyle(container).overflowY
		if (
			(overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') &&
			container.scrollHeight > container.clientHeight
		) {
			break
		}
		container = container.parentElement
	}
	if (!container) return

	const elRect = el.getBoundingClientRect()
	const containerRect = container.getBoundingClientRect()
	const relativeTop = elRect.top - containerRect.top + container.scrollTop
	const relativeBottom = relativeTop + el.offsetHeight
	const viewTop = container.scrollTop
	const viewBottom = viewTop + container.clientHeight

	if (relativeTop < viewTop) {
		container.scrollTop = relativeTop
	} else if (relativeBottom > viewBottom) {
		container.scrollTop = relativeBottom - container.clientHeight
	}
}

onMounted(scrollHighlightedIntoView)
onUpdated(scrollHighlightedIntoView)
</script>

<template>
	<template
		v-for="(option, index) in ctx.filtered.value"
		:key="option.value">
		<div
			:id="ctx.getOptionId(option.value)"
			role="option"
			class="group"
			:aria-selected="option.value === ctx.selected.value"
			:aria-disabled="option.disabled || undefined"
			:data-highlighted="index === ctx.highlightedIndex.value ? '' : undefined"
			:data-selected="option.value === ctx.selected.value ? '' : undefined"
			:data-disabled="option.disabled ? '' : undefined"
			@mouseenter="ctx.setHighlightedIndex(index)"
			@click="ctx.commitOption(option)">
			<slot
				:option="option"
				:highlighted="index === ctx.highlightedIndex.value"
				:selected="option.value === ctx.selected.value" />
		</div>
	</template>
</template>
