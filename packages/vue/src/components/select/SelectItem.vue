<script setup lang="ts">
import { computed, watch } from 'vue'
import { useInteractiveState } from '@/composables/use-interactive-state'
import { useSelectContext } from './keys'

defineOptions({ name: 'SelectItem' })

const props = withDefaults(defineProps<{
  value: string
  textValue?: string
  disabled?: boolean
}>(), { disabled: false })

const ctx = useSelectContext()
const { handlers, dataAttributes } = useInteractiveState({ disabled: () => props.disabled })

const label = computed(() => props.textValue ?? props.value)
const isSelected = computed(() => ctx.selectedValue === props.value)

watch(
  () => [props.value, props.textValue],
  () => { ctx.registerItem(props.value, label.value) },
  { immediate: true },
)

function handleClick() {
  if (!props.disabled) ctx.select(props.value, label.value)
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    if (!props.disabled) ctx.select(props.value, label.value)
  }
  handlers.onKeydown(e)
}
</script>

<template>
  <div
    role="option"
    :aria-selected="isSelected"
    :data-selected="isSelected ? '' : undefined"
    v-bind="dataAttributes"
    @mouseenter="handlers.onMouseenter"
    @mouseleave="handlers.onMouseleave"
    @focus="handlers.onFocus"
    @blur="handlers.onBlur"
    @pointerdown="handlers.onPointerdown"
    @pointerup="handlers.onPointerup"
    @keydown="handleKeydown"
    @keyup="handlers.onKeyup"
    @click="handleClick"
  >
    <slot />
  </div>
</template>
