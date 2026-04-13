<script setup lang="ts">
import { useCheckboxItemContext } from './keys'

defineOptions({ name: 'CheckboxIndicator' })

const itemCtx = useCheckboxItemContext()
</script>

<template>
  <span v-if="itemCtx.checked" data-checked="">
    <slot />
  </span>
</template>
