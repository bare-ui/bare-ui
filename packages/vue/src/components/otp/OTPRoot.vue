<script setup lang="ts">
import { provide, reactive, ref, computed, toRef } from 'vue'
import { OTPKey } from './keys'
import { getDirection } from '@/composables/use-direction'

defineOptions({ name: 'OTPRoot' })

const props = withDefaults(defineProps<{
  length?: number
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  onComplete?: (value: string) => void
  pattern?: 'numeric' | 'alphanumeric'
  disabled?: boolean
}>(), {
  length: 6,
  defaultValue: '',
  pattern: 'numeric',
  disabled: false,
})

function toChars(value: string, length: number): string[] {
  return value.split('').slice(0, length).concat(Array<string>(length).fill('')).slice(0, length)
}

const uncontrolledChars = ref<string[]>(toChars(props.defaultValue, props.length))
const inputRefs: (HTMLInputElement | null)[] = Array(props.length).fill(null)

const isControlled = computed(() => props.value !== undefined)
const chars = computed(() => isControlled.value ? toChars(props.value!, props.length) : uncontrolledChars.value)
const isComplete = computed(() => chars.value.every((c) => c !== ''))

function isAllowed(char: string) {
  if (props.pattern === 'numeric') return /^[0-9]$/.test(char)
  return /^[0-9a-zA-Z]$/.test(char)
}

function commit(newChars: string[]) {
  if (!isControlled.value) uncontrolledChars.value = newChars
  const value = newChars.join('')
  props.onChange?.(value)
  if (newChars.every((c) => c !== '')) props.onComplete?.(value)
}

function registerRef(index: number, el: HTMLInputElement | null) {
  inputRefs[index] = el
}

function handleChange(index: number, raw: string) {
  const char = raw.slice(-1)
  if (char && !isAllowed(char)) return

  const next = [...chars.value]
  next[index] = char
  commit(next)

  if (char && index < props.length - 1) {
    inputRefs[index + 1]?.focus()
  }
}

function handleKeyDown(index: number, e: KeyboardEvent) {
  if (e.key === 'Backspace') {
    e.preventDefault()
    if (chars.value[index]) {
      const next = [...chars.value]
      next[index] = ''
      commit(next)
    } else if (index > 0) {
      const next = [...chars.value]
      next[index - 1] = ''
      commit(next)
      inputRefs[index - 1]?.focus()
    }
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    e.preventDefault()
    // In RTL the slots read right-to-left, so ArrowLeft advances and ArrowRight retreats.
    const rtl = getDirection(e.currentTarget as Element) === 'rtl'
    const forward = e.key === (rtl ? 'ArrowLeft' : 'ArrowRight')
    const target = forward ? index + 1 : index - 1
    if (target >= 0 && target < props.length) inputRefs[target]?.focus()
  }
}

function handlePaste(index: number, e: ClipboardEvent) {
  e.preventDefault()
  const pasted = (e.clipboardData?.getData('text') ?? '')
    .split('')
    .filter((c) => isAllowed(c))
    .slice(0, props.length - index)

  if (pasted.length === 0) return

  const next = [...chars.value]
  pasted.forEach((c, i) => {
    if (index + i < props.length) next[index + i] = c
  })
  commit(next)

  const nextFocus = Math.min(index + pasted.length, props.length - 1)
  inputRefs[nextFocus]?.focus()
}

provide(OTPKey, reactive({
  chars,
  length: toRef(props, 'length'),
  disabled: toRef(props, 'disabled'),
  isComplete,
  registerRef,
  handleChange,
  handleKeyDown,
  handlePaste,
}))
</script>

<template>
  <div
    :data-complete="isComplete ? '' : undefined"
    :data-disabled="props.disabled ? '' : undefined"
  >
    <slot />
  </div>
</template>
