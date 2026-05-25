<script setup lang="ts">
import { computed, useAttrs, type ComponentPublicInstance } from 'vue'
import { useMentionContext } from './keys'

defineOptions({ name: 'MentionInput', inheritAttrs: false })

const ctx = useMentionContext()
const attrs = useAttrs()

// Bridge the template ref into the context's shared inputRef so the root can
// measure the caret and refocus after inserting a mention.
function setInputRef(el: ComponentPublicInstance | Element | null) {
	ctx.inputRef.value = el as HTMLTextAreaElement | null
}

const activeId = computed(() =>
	ctx.open.value && ctx.filtered.value[ctx.activeIndex.value] ? ctx.getOptionId(ctx.activeIndex.value) : undefined,
)

function handleKeyDown(e: KeyboardEvent) {
	;(attrs.onKeydown as ((e: KeyboardEvent) => void) | undefined)?.(e)
	if (e.defaultPrevented || !ctx.open.value || ctx.filtered.value.length === 0) return

	if (e.key === 'ArrowDown') {
		e.preventDefault()
		ctx.moveActive(1)
	} else if (e.key === 'ArrowUp') {
		e.preventDefault()
		ctx.moveActive(-1)
	} else if (e.key === 'Enter' || e.key === 'Tab') {
		const option = ctx.filtered.value[ctx.activeIndex.value]
		if (option && !option.disabled) {
			e.preventDefault()
			ctx.select(option)
		}
	} else if (e.key === 'Escape') {
		e.preventDefault()
		ctx.dismiss()
	}
}

function handleInput(e: Event) {
	const target = e.target as HTMLTextAreaElement
	ctx.handleChange(target.value, target.selectionStart ?? target.value.length)
	;(attrs.onInput as ((e: Event) => void) | undefined)?.(e)
}

function handleKeyUp(e: KeyboardEvent) {
	const target = e.currentTarget as HTMLTextAreaElement
	ctx.handleCaret(target.selectionStart ?? 0)
	;(attrs.onKeyup as ((e: KeyboardEvent) => void) | undefined)?.(e)
}

function handleClick(e: MouseEvent) {
	const target = e.currentTarget as HTMLTextAreaElement
	ctx.handleCaret(target.selectionStart ?? 0)
	;(attrs.onClick as ((e: MouseEvent) => void) | undefined)?.(e)
}

function handleBlur(e: FocusEvent) {
	ctx.close()
	;(attrs.onBlur as ((e: FocusEvent) => void) | undefined)?.(e)
}
</script>

<template>
	<textarea
		:ref="setInputRef"
		:value="ctx.text.value"
		:disabled="ctx.disabled.value"
		aria-autocomplete="list"
		:aria-expanded="ctx.open.value"
		:aria-controls="ctx.listboxId"
		:aria-activedescendant="activeId"
		v-bind="attrs"
		@input="handleInput"
		@keydown="handleKeyDown"
		@keyup="handleKeyUp"
		@click="handleClick"
		@blur="handleBlur" />
</template>
