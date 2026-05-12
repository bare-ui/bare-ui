<script setup lang="ts">
import { computed, provide, ref, useId } from 'vue'
import { FormFieldKey } from './keys'

defineOptions({ name: 'FormField' })

const props = withDefaults(
	defineProps<{
		name?: string
		invalid?: boolean
		required?: boolean
		disabled?: boolean
	}>(),
	{
		invalid: false,
		required: false,
		disabled: false,
	},
)

const reactId = useId() ?? 'field'
const id = computed(() => (props.name ? `${props.name}-${reactId}` : reactId)).value
const descriptionId = `${id}-description`
const errorId = `${id}-error`

const hasDescription = ref(false)
const hasError = ref(false)

provide(FormFieldKey, {
	id,
	descriptionId,
	errorId,
	name: computed(() => props.name),
	invalid: computed(() => props.invalid),
	required: computed(() => props.required),
	disabled: computed(() => props.disabled),
	hasDescription,
	hasError,
	registerDescription: (present) => (hasDescription.value = present),
	registerError: (present) => (hasError.value = present),
})
</script>

<template>
	<div
		:data-invalid="props.invalid ? '' : undefined"
		:data-required="props.required ? '' : undefined"
		:data-disabled="props.disabled ? '' : undefined">
		<slot />
	</div>
</template>
