<script setup lang="ts">
import { useAttrs } from 'vue'
import { usePasswordContext } from './keys'

defineOptions({ name: 'PasswordField', inheritAttrs: false })

const ctx = usePasswordContext()
const attrs = useAttrs()

function onInput(e: Event) {
  ctx.handleChange((e.target as HTMLInputElement).value)
}
</script>

<template>
  <input
    :id="ctx.inputId"
    :value="ctx.value"
    :type="ctx.visible ? 'text' : 'password'"
    :required="ctx.isRequired"
    :aria-required="ctx.isRequired || undefined"
    :aria-invalid="ctx.invalidType ? true : undefined"
    :data-invalid="ctx.invalidType ? '' : undefined"
    :data-visible="ctx.visible ? '' : undefined"
    v-bind="attrs"
    @focus="ctx.handleFocus"
    @blur="ctx.handleBlur"
    @input="onInput"
  />
</template>
