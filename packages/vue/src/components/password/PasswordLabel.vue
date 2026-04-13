<script setup lang="ts">
import { usePasswordContext } from './keys'

defineOptions({ name: 'PasswordLabel' })

const ctx = usePasswordContext()
</script>

<template>
  <label :for="ctx.inputId">
    <span v-if="ctx.isRequired" aria-hidden="true">*</span>
    <slot />
  </label>
</template>
