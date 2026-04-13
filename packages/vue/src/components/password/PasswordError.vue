<script setup lang="ts">
import { useSlots } from 'vue'
import { usePasswordContext } from './keys'

defineOptions({ name: 'PasswordError' })

const ctx = usePasswordContext()
const slots = useSlots()

function hasSlotContent() {
  const children = slots.default?.()
  return children && children.length > 0
}
</script>

<template>
  <small v-if="ctx.invalidType" role="alert">
    <template v-if="hasSlotContent()">
      <slot />
    </template>
    <template v-else>{{ ctx.errorMessage[ctx.invalidType] }}</template>
  </small>
</template>
