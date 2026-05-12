<script setup lang="ts">
import { cloneVNode, computed, type VNode } from 'vue'
import { useFormFieldContext } from './keys'

defineOptions({ name: 'FormControl' })

const slots = defineSlots<{ default?: () => VNode[] }>()
const ctx = useFormFieldContext()

const describedBy = computed(() => {
	const parts = [
		ctx.hasDescription.value ? ctx.descriptionId : null,
		ctx.hasError.value ? ctx.errorId : null,
	].filter(Boolean) as string[]
	return parts.length > 0 ? parts.join(' ') : undefined
})

function renderControl(): VNode {
	const nodes = slots.default?.()
	if (!nodes || nodes.length === 0) {
		throw new Error('Form.Control requires exactly one child element.')
	}
	const child = nodes[0]
	return cloneVNode(child, {
		id: ctx.id,
		name: ctx.name.value,
		'aria-invalid': ctx.invalid.value || undefined,
		'aria-required': ctx.required.value || undefined,
		'aria-describedby': describedBy.value,
		disabled: ctx.disabled.value || undefined,
		'data-invalid': ctx.invalid.value ? '' : undefined,
		'data-required': ctx.required.value ? '' : undefined,
		'data-disabled': ctx.disabled.value ? '' : undefined,
	})
}
</script>

<template>
	<component :is="renderControl" />
</template>
