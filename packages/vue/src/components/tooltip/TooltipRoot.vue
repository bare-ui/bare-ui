<script setup lang="ts">
import { provide, reactive } from 'vue'
import { useControllableState } from '@/composables/use-controllable-state'
import { useTimeout } from '@/composables/use-timeout'
import { TooltipKey } from './keys'

defineOptions({ name: 'TooltipRoot' })

const props = withDefaults(defineProps<{
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (value: boolean) => void
  delayDuration?: number
}>(), { open: undefined, defaultOpen: false, onOpenChange: undefined, delayDuration: 300 })

const isOpen = useControllableState<boolean>({
  value: () => props.open,
  defaultValue: props.defaultOpen,
  onChange: (next) => props.onOpenChange?.(next),
})

const { start, stop } = useTimeout(
  () => { isOpen.value = true },
  () => props.delayDuration,
  { autoStart: false },
)

function setOpen(value: boolean) {
  stop()
  if (value && props.delayDuration > 0) start()
  else isOpen.value = value
}

provide(TooltipKey, reactive({
  open: isOpen,
  setOpen,
}))
</script>

<template>
  <span :style="{ position: 'relative', display: 'inline-block' }">
    <slot />
  </span>
</template>
