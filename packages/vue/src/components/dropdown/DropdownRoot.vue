<script setup lang="ts">
import { provide, reactive, ref, computed, onMounted, onUnmounted } from 'vue'
import { useClickOutside } from '@/composables/use-click-outside'
import { DropdownKey } from './keys'

defineOptions({ name: 'DropdownRoot' })

const props = withDefaults(defineProps<{
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (value: boolean) => void
}>(), { open: undefined, defaultOpen: false, onOpenChange: undefined })

const rootRef = ref<HTMLElement | null>(null)
const uncontrolledOpen = ref(props.defaultOpen)
const isControlled = computed(() => props.open !== undefined)
const isOpen = computed(() => isControlled.value ? props.open! : uncontrolledOpen.value)

function handleOpenChange(value: boolean) {
  if (!isControlled.value) uncontrolledOpen.value = value
  props.onOpenChange?.(value)
}

useClickOutside(rootRef, () => { if (isOpen.value) handleOpenChange(false) })

function handleEscape(event: KeyboardEvent) {
  if (event.key === 'Escape' && isOpen.value) handleOpenChange(false)
}

onMounted(() => window.addEventListener('keyup', handleEscape))
onUnmounted(() => window.removeEventListener('keyup', handleEscape))

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
