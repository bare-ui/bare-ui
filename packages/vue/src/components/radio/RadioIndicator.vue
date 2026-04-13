<script setup lang="ts">
import { useRadioItemContext } from './keys'

defineOptions({ name: 'RadioIndicator' })

const itemCtx = useRadioItemContext()
</script>

<template>
  <span v-if="itemCtx.checked" data-checked="">
    <slot />
  </span>
</template>
