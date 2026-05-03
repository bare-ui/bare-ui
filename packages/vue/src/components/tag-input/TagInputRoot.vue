<script setup lang="ts">
import { computed, provide, ref, toRef } from 'vue'
import { TagInputKey } from './keys'

defineOptions({ name: 'TagInputRoot' })

const props = withDefaults(
	defineProps<{
		value?: string[]
		defaultValue?: string[]
		onChange?: (value: string[]) => void
		disabled?: boolean
		maxTags?: number
		allowDuplicates?: boolean
		commitKeys?: string[]
		validate?: (tag: string, current: string[]) => boolean
	}>(),
	{
		disabled: false,
		allowDuplicates: false,
	},
)

const uncontrolled = ref<string[]>([...(props.defaultValue ?? [])])
const isControlled = computed(() => props.value !== undefined)
const tags = computed(() => (isControlled.value ? (props.value as string[]) : uncontrolled.value))
const commitKeys = computed(() => props.commitKeys ?? ['Enter', ','])

function setTags(next: string[]) {
	if (!isControlled.value) uncontrolled.value = next
	props.onChange?.(next)
}

function addTag(raw: string): boolean {
	if (props.disabled) return false
	const trimmed = raw.trim()
	if (!trimmed) return false
	if (props.maxTags !== undefined && tags.value.length >= props.maxTags) return false
	if (!props.allowDuplicates && tags.value.includes(trimmed)) return false
	if (props.validate && !props.validate(trimmed, tags.value)) return false
	setTags([...tags.value, trimmed])
	return true
}

function removeTag(index: number) {
	if (props.disabled) return
	setTags(tags.value.filter((_, i) => i !== index))
}

provide(TagInputKey, {
	tags,
	disabled: toRef(props, 'disabled'),
	maxTags: toRef(props, 'maxTags'),
	commitKeys,
	addTag,
	removeTag,
})
</script>

<template>
	<div :data-disabled="props.disabled ? '' : undefined">
		<slot />
	</div>
</template>
