<script setup lang="ts">
import { provide, reactive, computed, toRef } from 'vue'
import { useInteractiveState } from '@/composables/use-interactive-state'
import { useId } from '@/composables/use-id'
import { RadioItemKey, useRadioContext } from './keys'

defineOptions({ name: 'RadioItem' })

const props = withDefaults(defineProps<{
  /** This item's value; becomes the group's value when selected. */
  value: string | number
  /** Disable this radio item. */
  disabled?: boolean
  /** Optional explicit id for the hidden input (so a label can target it). */
  id?: string
}>(), { disabled: false })

const ctx = useRadioContext()
const { handlers, dataAttributes } = useInteractiveState({ disabled: () => props.disabled })

const checked = computed(() => ctx.isSelected(props.value))

// Stable id shared with Radio.Label so the label's `for` targets this input,
// giving the visually-hidden radio an accessible name.
const inputId = useId(undefined, props.id)

provide(RadioItemKey, reactive({
  value: toRef(props, 'value'),
  disabled: toRef(props, 'disabled'),
  checked,
  inputId,
}))

function handleClick() {
  if (!props.disabled) ctx.select(props.value)
}

const hiddenStyle = { position: 'absolute' as const, opacity: 0, pointerEvents: 'none' as const, width: 0, height: 0 }
</script>

<template>
  <div
    :data-checked="checked ? '' : undefined"
    v-bind="dataAttributes"
    @mouseenter="handlers.onMouseenter"
    @mouseleave="handlers.onMouseleave"
    @pointerdown="handlers.onPointerdown"
    @pointerup="handlers.onPointerup"
    @click="handleClick"
  >
    <input
      :id="inputId"
      type="radio"
      :name="ctx.name"
      :value="String(props.value)"
      :checked="checked"
      :disabled="props.disabled"
      :style="hiddenStyle"
      @change="handleClick"
      @focus="handlers.onFocus"
      @blur="handlers.onBlur"
      @keydown="handlers.onKeydown"
      @keyup="handlers.onKeyup"
    />
    <slot />
  </div>
</template>
