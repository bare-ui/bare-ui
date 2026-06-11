<script setup lang="ts">
import { useCheckboxItemContext } from './keys'

defineOptions({ name: 'CheckboxLabel' })

const itemCtx = useCheckboxItemContext()
</script>

<template>
  <label :for="itemCtx.inputId" :data-disabled="itemCtx.disabled ? '' : undefined">
    <slot />
  </label>
</template>
