<script setup lang="ts">
import { provide, reactive, ref, computed, onUnmounted } from 'vue'
import { TooltipKey } from './keys'

defineOptions({ name: 'TooltipRoot' })

const props = withDefaults(defineProps<{
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (value: boolean) => void
  delayDuration?: number
}>(), { open: undefined, defaultOpen: false, onOpenChange: undefined, delayDuration: 300 })

const uncontrolledOpen = ref(props.defaultOpen)
let timer: ReturnType<typeof setTimeout> | null = null

const isControlled = computed(() => props.open !== undefined)
const isOpen = computed(() => isControlled.value ? props.open! : uncontrolledOpen.value)

function setOpen(value: boolean) {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
  if (value) {
    if (props.delayDuration <= 0) {
      if (!isControlled.value) uncontrolledOpen.value = true
      props.onOpenChange?.(true)
    } else {
      timer = setTimeout(() => {
        if (!isControlled.value) uncontrolledOpen.value = true
        props.onOpenChange?.(true)
      }, props.delayDuration)
    }
  } else {
    if (!isControlled.value) uncontrolledOpen.value = false
    props.onOpenChange?.(false)
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
