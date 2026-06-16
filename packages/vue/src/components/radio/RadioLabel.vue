<script setup lang="ts">
import { useRadioItemContext } from './keys'

defineOptions({ name: 'RadioLabel' })

const props = defineProps<{
  /** Override the input the label targets; defaults to the item's input. */
  for?: string
}>()

const itemCtx = useRadioItemContext()
</script>

<template>
  <label :for="props.for ?? itemCtx.inputId" :data-disabled="itemCtx.disabled ? '' : undefined">
    <slot />
  </label>
</template>
