<script setup lang="ts">
import { provide, reactive, ref, computed, onMounted, onUnmounted } from 'vue'
import { ModalKey } from './keys'

defineOptions({ name: 'ModalRoot' })

const props = withDefaults(defineProps<{
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (value: boolean) => void
}>(), { open: undefined, defaultOpen: false, onOpenChange: undefined })

const uncontrolledOpen = ref(props.defaultOpen)
const isControlled = computed(() => props.open !== undefined)
const isOpen = computed(() => isControlled.value ? props.open! : uncontrolledOpen.value)

function handleOpenChange(value: boolean) {
  if (!isControlled.value) uncontrolledOpen.value = value
  props.onOpenChange?.(value)
}

function handleEscape(event: KeyboardEvent) {
  if (event.key === 'Escape' && isOpen.value) handleOpenChange(false)
}

onMounted(() => window.addEventListener('keydown', handleEscape))
onUnmounted(() => window.removeEventListener('keydown', handleEscape))

provide(ModalKey, reactive({
  open: isOpen,
  onOpenChange: handleOpenChange,
}))
</script>

<template>
  <slot />
</template>
