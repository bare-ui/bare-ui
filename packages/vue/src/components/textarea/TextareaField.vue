<script setup lang="ts">
import { useAttrs } from 'vue'
import { useTextareaContext } from './keys'

defineOptions({ name: 'TextareaField', inheritAttrs: false })

const ctx = useTextareaContext()
const attrs = useAttrs()

function onInput(e: Event) {
  ctx.handleChange((e.target as HTMLTextAreaElement).value)
}
</script>

<template>
  <textarea
    :id="ctx.textareaId"
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
