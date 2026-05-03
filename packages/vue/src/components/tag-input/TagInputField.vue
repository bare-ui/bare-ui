<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTagInputContext } from './keys'

defineOptions({ name: 'TagInputField', inheritAttrs: false })

const props = defineProps<{
	placeholder?: string
}>()

const ctx = useTagInputContext()
const text = ref('')

const atMax = computed(
	() => ctx.maxTags.value !== undefined && ctx.tags.value.length >= ctx.maxTags.value,
)

const effectivePlaceholder = computed(() => (atMax.value ? undefined : props.placeholder))

function onKeyDown(e: KeyboardEvent) {
	if (e.defaultPrevented) return
	if (ctx.commitKeys.value.includes(e.key)) {
		if (text.value.trim()) {
			e.preventDefault()
			if (ctx.addTag(text.value)) text.value = ''
		}
	} else if (e.key === 'Backspace' && text.value === '' && ctx.tags.value.length > 0) {
		e.preventDefault()
		ctx.removeTag(ctx.tags.value.length - 1)
	}
}

function onBlur() {
	if (text.value.trim()) {
		ctx.addTag(text.value)
		text.value = ''
	}
}
</script>

<template>
	<input
		v-model="text"
		type="text"
		:disabled="ctx.disabled.value || atMax"
		:placeholder="effectivePlaceholder"
		v-bind="$attrs"
		@keydown="onKeyDown"
		@blur="onBlur" />
</template>
