<script setup lang="ts">
import { useFormFieldContext } from './keys'

defineOptions({ name: 'FormLabel', inheritAttrs: false })

withDefaults(
	defineProps<{
		asChild?: boolean
	}>(),
	{
		asChild: false,
	},
)

const ctx = useFormFieldContext()
</script>

<template>
	<slot v-if="asChild" />
	<label
		v-else
		:for="ctx.id"
		v-bind="$attrs"
		:data-invalid="ctx.invalid.value ? '' : undefined"
		:data-required="ctx.required.value ? '' : undefined"
		:data-disabled="ctx.disabled.value ? '' : undefined">
		<slot />
	</label>
</template>
