<script setup lang="ts">
import { provide, reactive } from 'vue'
import { useControllableState } from '@/composables/use-controllable-state'
import { useKeyboard } from '@/composables/use-keyboard'
import { useScrollLock } from '@/composables/use-scroll-lock'
import { DrawerKey } from './keys'

defineOptions({ name: 'DrawerRoot' })

const props = withDefaults(defineProps<{
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (value: boolean) => void
}>(), { open: undefined, defaultOpen: false, onOpenChange: undefined })

const isOpen = useControllableState<boolean>({
  value: () => props.open,
  defaultValue: props.defaultOpen,
  onChange: (value) => props.onOpenChange?.(value),
})

function handleOpenChange(value: boolean) {
  isOpen.value = value
}

useScrollLock(isOpen)

useKeyboard({
  Escape: () => {
    if (isOpen.value) handleOpenChange(false)
  },
})

provide(DrawerKey, reactive({
  open: isOpen,
  onOpenChange: handleOpenChange,
}))
</script>

<template>
  <slot />
</template>
