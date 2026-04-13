<script setup lang="ts">
import { useAttrs } from 'vue'
import { useInputContext } from './keys'

defineOptions({ name: 'InputField', inheritAttrs: false })

const ctx = useInputContext()
const attrs = useAttrs()

function onInput(e: Event) {
  ctx.handleChange((e.target as HTMLInputElement).value)
}
</script>

<template>
  <input
    :id="ctx.inputId"
    :value="ctx.value"
    :required="ctx.isRequired"
    :aria-required="ctx.isRequired || undefined"
    :aria-invalid="ctx.invalidType ? true : undefined"
    :data-invalid="ctx.invalidType ? '' : undefined"
    :data-active="ctx.isActive ? '' : undefined"
    :data-success="ctx.isSuccess ? '' : undefined"
    v-bind="attrs"
    @focus="ctx.handleFocus"
    @blur="ctx.handleBlur"
    @input="onInput"
  />
</template>
