<script setup lang="ts">
import { provide, reactive, ref } from 'vue';
import { useClickOutside } from '@/composables/use-click-outside';
import { useControllableState } from '@/composables/use-controllable-state';
import { useId } from '@/composables/use-id';
import { useKeyboard } from '@/composables/use-keyboard';
import { PopoverKey } from './keys';

defineOptions({ name: 'PopoverRoot' })

const props = withDefaults(defineProps<{
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	closeOnOutsideClick?: boolean;
	closeOnEscape?: boolean;
}>(), {
	open: undefined,
	defaultOpen: false,
	onOpenChange: undefined,
	closeOnOutsideClick: true,
	closeOnEscape: true,
})

const rootRef = ref<HTMLElement | null>(null)

const open = useControllableState<boolean>({
	value: () => props.open,
	defaultValue: props.defaultOpen,
	onChange: (value) => props.onOpenChange?.(value),
})

function setOpen(value: boolean) {
	open.value = value
}

useClickOutside(rootRef, () => {
	if (open.value && props.closeOnOutsideClick) setOpen(false)
})

useKeyboard(
	{ Escape: () => { if (open.value) setOpen(false) } },
	{ event: 'keyup', enabled: () => props.closeOnEscape },
)

const triggerId = useId('popover-trigger')
const contentId = useId('popover-content')

provide(PopoverKey, reactive({ open, setOpen, triggerId, contentId }))
</script>

<template>
	<div
		ref="rootRef"
		:data-state="open ? 'open' : 'closed'"
	>
		<slot />
	</div>
</template>
