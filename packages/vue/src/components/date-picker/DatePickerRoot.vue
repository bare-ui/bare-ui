<script setup lang="ts">
import { computed, provide, useTemplateRef } from 'vue'
import { useClickOutside } from '@/composables/use-click-outside'
import { useControllableState } from '@/composables/use-controllable-state'
import { useId } from '@/composables/use-id'
import { useKeyboard } from '@/composables/use-keyboard'
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

const value = useControllableState<Date | null>({
	value: () => props.value,
	defaultValue: props.defaultValue ?? null,
	onChange: (next) => props.onChange?.(next),
})

const open = useControllableState<boolean>({
	value: () => props.open,
	defaultValue: props.defaultOpen,
	onChange: (next) => props.onOpenChange?.(next),
})

const disabled = computed(() => props.disabled)
const closeOnSelect = computed(() => props.closeOnSelect)
const locale = computed(() => props.locale)
const formatOptions = computed(() => props.formatOptions ?? DEFAULT_FORMAT)

function setOpen(next: boolean) {
	open.value = next
}

function setValue(next: Date | null) {
	value.value = next
}

const rootRef = useTemplateRef<HTMLDivElement>('rootRef')
useClickOutside(rootRef, () => {
	if (open.value) setOpen(false)
})

useKeyboard(
	{ Escape: () => { if (open.value) setOpen(false) } },
	{ event: 'keyup' },
)

const triggerId = useId('dp-trigger')
const contentId = useId('dp-content')

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
