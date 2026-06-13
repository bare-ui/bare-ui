<script setup lang="ts">
import { usePasswordContext } from './keys'
import { useWireUIMessages } from '@/context/wire-ui-context'

defineOptions({ name: 'PasswordToggle' })

const ctx = usePasswordContext()
const messages = useWireUIMessages()

function handleClick() {
  ctx.setVisible(!ctx.visible)
}
</script>

<template>
  <button
    type="button"
    :aria-label="ctx.visible ? messages.password.hide : messages.password.show"
    :data-visible="ctx.visible ? '' : undefined"
    @click="handleClick"
  >
    <slot />
  </button>
</template>
