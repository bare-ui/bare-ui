<script setup lang="ts">
import { usePasswordContext } from './keys'

defineOptions({ name: 'PasswordToggle' })

const ctx = usePasswordContext()

function handleClick() {
  ctx.setVisible(!ctx.visible)
}
</script>

<template>
  <button
    type="button"
    :aria-label="ctx.visible ? 'Hide password' : 'Show password'"
    :data-visible="ctx.visible ? '' : undefined"
    @click="handleClick"
  >
    <slot />
  </button>
</template>
