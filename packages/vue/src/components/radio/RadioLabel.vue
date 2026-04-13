<script setup lang="ts">
import { useRadioItemContext } from './keys'

defineOptions({ name: 'RadioLabel' })

const itemCtx = useRadioItemContext()
</script>

<template>
  <label :data-disabled="itemCtx.disabled ? '' : undefined">
    <slot />
  </label>
</template>
