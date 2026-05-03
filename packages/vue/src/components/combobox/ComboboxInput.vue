<script setup lang="ts">
import { computed } from 'vue'
import { useComboboxContext } from './keys'

defineOptions({ name: 'ComboboxInput', inheritAttrs: false })

const ctx = useComboboxContext()

const activeId = computed(() => {
	if (ctx.highlightedIndex.value < 0) return undefined
	const opt = ctx.filtered.value[ctx.highlightedIndex.value]
	return opt ? ctx.getOptionId(opt.value) : undefined
})

function onKeyDown(e: KeyboardEvent) {
	if (e.defaultPrevented || ctx.disabled.value) return

	if (e.key === 'ArrowDown') {
		e.preventDefault()
		if (!ctx.open.value) ctx.setOpen(true)
		else ctx.moveHighlight(1)
	} else if (e.key === 'ArrowUp') {
		e.preventDefault()
		if (!ctx.open.value) ctx.setOpen(true)
		else ctx.moveHighlight(-1)
	} else if (e.key === 'Home' && ctx.open.value) {
		e.preventDefault()
		if (ctx.filtered.value.length > 0) ctx.setHighlightedIndex(0)
	} else if (e.key === 'End' && ctx.open.value) {
		e.preventDefault()
		if (ctx.filtered.value.length > 0) ctx.setHighlightedIndex(ctx.filtered.value.length - 1)
	} else if (e.key === 'Enter' && ctx.open.value) {
		if (ctx.highlightedIndex.value >= 0 && ctx.filtered.value[ctx.highlightedIndex.value]) {
			e.preventDefault()
			ctx.commitOption(ctx.filtered.value[ctx.highlightedIndex.value])
		}
	} else if (e.key === 'Escape' && ctx.open.value) {
		e.preventDefault()
		ctx.setOpen(false)
	}
}

function onInput(e: Event) {
	const target = e.target as HTMLInputElement
	ctx.setInputValue(target.value)
	if (!ctx.open.value) ctx.setOpen(true)
}

function onFocus() {
	ctx.registerInputFocus(true)
	if (!ctx.open.value) ctx.setOpen(true)
}

function onBlur() {
	ctx.registerInputFocus(false)
}
</script>

<template>
	<input
		type="text"
		role="combobox"
		autocomplete="off"
		aria-autocomplete="list"
		:aria-expanded="ctx.open.value"
		:aria-controls="ctx.listboxId"
		:aria-activedescendant="activeId"
		:disabled="ctx.disabled.value"
		:value="ctx.inputValue.value"
		v-bind="$attrs"
		@input="onInput"
		@keydown="onKeyDown"
		@focus="onFocus"
		@blur="onBlur" />
</template>
