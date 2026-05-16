<script setup lang="ts">
import { provide, reactive, onUnmounted } from 'vue'
import { useControllableState } from '@/composables/use-controllable-state'
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

let timer: ReturnType<typeof setTimeout> | null = null

function setOpen(value: boolean) {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
  if (value && props.delayDuration > 0) {
    timer = setTimeout(() => { isOpen.value = true }, props.delayDuration)
  } else {
    isOpen.value = value
  }
}

onUnmounted(() => { if (timer) clearTimeout(timer) })

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
