<script setup lang="ts">
import { useTextareaContext } from './keys'

defineOptions({ name: 'TextareaLabel' })

const ctx = useTextareaContext()
</script>

<template>
  <label :for="ctx.textareaId">
    <span v-if="ctx.isRequired">*</span>
    <slot />
  </label>
</template>
