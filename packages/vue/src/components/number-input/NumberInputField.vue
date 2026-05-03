<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useNumberInputContext } from './keys'

defineOptions({ name: 'NumberInputField', inheritAttrs: false })

const ctx = useNumberInputContext()
const text = ref<string>(ctx.value.value === null ? '' : String(ctx.value.value))

watch(
	() => ctx.value.value,
	(v) => {
		text.value = v === null ? '' : String(v)
	},
)

const ariaValueNow = computed(() => ctx.value.value ?? undefined)
const ariaValueMin = computed(() => (Number.isFinite(ctx.min.value) ? ctx.min.value : undefined))
const ariaValueMax = computed(() => (Number.isFinite(ctx.max.value) ? ctx.max.value : undefined))

function onKeyDown(e: KeyboardEvent) {
	if (e.defaultPrevented || ctx.disabled.value || ctx.readOnly.value) return
	if (e.key === 'ArrowUp') {
		e.preventDefault()
		ctx.stepBy(ctx.step.value)
	} else if (e.key === 'ArrowDown') {
		e.preventDefault()
		ctx.stepBy(-ctx.step.value)
	} else if (e.key === 'PageUp') {
		e.preventDefault()
		ctx.stepBy(ctx.step.value * 10)
	} else if (e.key === 'PageDown') {
		e.preventDefault()
		ctx.stepBy(-ctx.step.value * 10)
	} else if (e.key === 'Home' && Number.isFinite(ctx.min.value)) {
		e.preventDefault()
		ctx.setValue(ctx.min.value)
	} else if (e.key === 'End' && Number.isFinite(ctx.max.value)) {
		e.preventDefault()
		ctx.setValue(ctx.max.value)
	}
}

function commitText(raw: string) {
	const trimmed = raw.trim()
	if (trimmed === '' || trimmed === '-' || trimmed === '.') {
		ctx.setValue(null)
		text.value = ''
		return
	}
	const parsed = Number(trimmed)
	if (Number.isNaN(parsed)) {
		text.value = ctx.value.value === null ? '' : String(ctx.value.value)
		return
	}
	ctx.setValue(parsed)
}

function onBlur() {
	commitText(text.value)
}
</script>

<template>
	<input
		v-model="text"
		type="text"
		inputmode="decimal"
		role="spinbutton"
		:aria-valuenow="ariaValueNow"
		:aria-valuemin="ariaValueMin"
		:aria-valuemax="ariaValueMax"
		:disabled="ctx.disabled.value"
		:readonly="ctx.readOnly.value"
		v-bind="$attrs"
		@keydown="onKeyDown"
		@blur="onBlur" />
</template>
