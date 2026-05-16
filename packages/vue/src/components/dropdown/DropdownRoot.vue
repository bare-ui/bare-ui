<script setup lang="ts">
import { provide, reactive, ref } from 'vue'
import { useClickOutside } from '@/composables/use-click-outside'
import { useControllableState } from '@/composables/use-controllable-state'
import { useKeyboard } from '@/composables/use-keyboard'
import { DropdownKey } from './keys'

defineOptions({ name: 'DropdownRoot' })

const props = withDefaults(defineProps<{
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (value: boolean) => void
}>(), { open: undefined, defaultOpen: false, onOpenChange: undefined })

const rootRef = ref<HTMLElement | null>(null)

const isOpen = useControllableState<boolean>({
  value: () => props.open,
  defaultValue: props.defaultOpen,
  onChange: (value) => props.onOpenChange?.(value),
})

function handleOpenChange(value: boolean) {
  isOpen.value = value
}

useClickOutside(rootRef, () => { if (isOpen.value) handleOpenChange(false) })

useKeyboard(
  { Escape: () => { if (isOpen.value) handleOpenChange(false) } },
  { event: 'keyup' },
)

provide(DropdownKey, reactive({
  open: isOpen,
  onOpenChange: handleOpenChange,
}))
</script>

<template>
  <div ref="rootRef">
    <slot />
  </div>
</template>
