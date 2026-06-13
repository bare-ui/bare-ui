<script setup lang="ts">
import { ref, onMounted, onUnmounted, useAttrs } from 'vue'
import { useOTPContext } from './keys'
import { useWireUIMessages } from '@/context/wire-ui-context'

defineOptions({ name: 'OTPSlot', inheritAttrs: false })

const messages = useWireUIMessages()

const props = defineProps<{
  index: number
}>()

const ctx = useOTPContext()
const attrs = useAttrs()
const isFocused = ref(false)
const inputEl = ref<HTMLInputElement | null>(null)

onMounted(() => {
  ctx.registerRef(props.index, inputEl.value)
})

onUnmounted(() => {
  ctx.registerRef(props.index, null)
})

function setRef(el: unknown) {
  inputEl.value = el as HTMLInputElement | null
  ctx.registerRef(props.index, el as HTMLInputElement | null)
}

function onInput(e: Event) {
  const target = e.target as HTMLInputElement
  ctx.handleChange(props.index, target.value)
  target.value = ctx.chars[props.index] ?? ''
}

function onKeydown(e: KeyboardEvent) {
  ctx.handleKeyDown(props.index, e)
}

function onFocus(e: FocusEvent) {
  isFocused.value = true
  ;(e.target as HTMLInputElement).select()
}

function onBlur() {
  isFocused.value = false
}

function onPaste(e: ClipboardEvent) {
  ctx.handlePaste(props.index, e)
}
</script>

<template>
  <input
    :ref="setRef"
    type="text"
    inputmode="numeric"
    autocomplete="one-time-code"
    :maxlength="2"
    :value="ctx.chars[props.index] ?? ''"
    :disabled="ctx.disabled"
    :data-active="isFocused ? '' : undefined"
    :data-filled="ctx.chars[props.index] ? '' : undefined"
    :data-complete="ctx.isComplete ? '' : undefined"
    :data-disabled="ctx.disabled ? '' : undefined"
    :aria-label="messages.otp.digit(props.index + 1)"
    v-bind="attrs"
    @input="onInput"
    @keydown="onKeydown"
    @focus="onFocus"
    @blur="onBlur"
    @paste="onPaste"
  />
</template>
