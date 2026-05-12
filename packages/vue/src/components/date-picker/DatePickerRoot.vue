<script setup lang="ts">
import { computed, onMounted, onUnmounted, provide, ref, useId, useTemplateRef } from 'vue'
import { useClickOutside } from '@/composables/use-click-outside'
import { DatePickerKey, DEFAULT_FORMAT } from './keys'

defineOptions({ name: 'DatePickerRoot' })

const props = withDefaults(
	defineProps<{
		value?: Date | null
		defaultValue?: Date | null
		onChange?: (date: Date | null) => void
		open?: boolean
		defaultOpen?: boolean
		onOpenChange?: (open: boolean) => void
		disabled?: boolean
		closeOnSelect?: boolean
		locale?: string
		formatOptions?: Intl.DateTimeFormatOptions
	}>(),
	{
		value: undefined,
		defaultValue: null,
		open: undefined,
		defaultOpen: false,
		disabled: false,
		closeOnSelect: true,
		locale: 'en-US',
	},
)

const uncontrolledValue = ref<Date | null>(props.defaultValue ?? null)
const isValueControlled = computed(() => props.value !== undefined)
const value = computed<Date | null>(() =>
	isValueControlled.value ? (props.value as Date | null) : uncontrolledValue.value,
)

const uncontrolledOpen = ref<boolean>(props.defaultOpen)
const isOpenControlled = computed(() => props.open !== undefined)
const open = computed<boolean>(() =>
	isOpenControlled.value ? (props.open as boolean) : uncontrolledOpen.value,
)

const disabled = computed(() => props.disabled)
const closeOnSelect = computed(() => props.closeOnSelect)
const locale = computed(() => props.locale)
const formatOptions = computed(() => props.formatOptions ?? DEFAULT_FORMAT)

function setOpen(next: boolean) {
	if (!isOpenControlled.value) uncontrolledOpen.value = next
	props.onOpenChange?.(next)
}

function setValue(next: Date | null) {
	if (!isValueControlled.value) uncontrolledValue.value = next
	props.onChange?.(next)
}

const rootRef = useTemplateRef<HTMLDivElement>('rootRef')
useClickOutside(rootRef, () => {
	if (open.value) setOpen(false)
})

function onKeyUp(e: KeyboardEvent) {
	if (e.key === 'Escape' && open.value) setOpen(false)
}

onMounted(() => window.addEventListener('keyup', onKeyUp))
onUnmounted(() => window.removeEventListener('keyup', onKeyUp))

const triggerId = useId() ?? `dp-trigger-${Math.random().toString(36).slice(2)}`
const contentId = useId() ?? `dp-content-${Math.random().toString(36).slice(2)}`

provide(DatePickerKey, {
	value,
	open,
	disabled,
	closeOnSelect,
	locale,
	formatOptions,
	setOpen,
	setValue,
	triggerId,
	contentId,
})
</script>

<template>
	<div
		ref="rootRef"
		:data-state="open ? 'open' : 'closed'"
		:data-disabled="props.disabled ? '' : undefined">
		<slot />
	</div>
</template>
