<script setup lang="ts">
import type { VNode } from 'vue'
import { useInputContext } from './keys'

defineOptions({ name: 'InputError' })

const ctx = useInputContext()
const slots = defineSlots<{ default?: () => VNode[] }>()

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
