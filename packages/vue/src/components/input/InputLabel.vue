<script setup lang="ts">
import { useInputContext } from './keys'

defineOptions({ name: 'InputLabel' })

const ctx = useInputContext()
</script>

<template>
  <label :for="ctx.inputId">
    <span v-if="ctx.isRequired">*</span>
    <slot />
  </label>
</template>
