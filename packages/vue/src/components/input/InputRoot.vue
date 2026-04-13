<script setup lang="ts">
import { provide, reactive, ref, computed, toRef } from 'vue'
import { InputKey } from './keys'
import { Helper } from '@/utils/helper'

defineOptions({ name: 'InputRoot' })

const props = withDefaults(defineProps<{
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  onFocus?: () => void
  onBlur?: () => void
  invalidType?: string
  errorMessage?: Record<string, string>
  isRequired?: boolean
  isSuccess?: boolean
  id?: string
}>(), {
  defaultValue: '',
  invalidType: '',
  errorMessage: () => ({}),
  isRequired: false,
  isSuccess: false,
})

const uncontrolledValue = ref(props.defaultValue)
const isActive = ref(false)
const inputId = props.id || Helper.generateUUID()

const isControlled = computed(() => props.value !== undefined)
const currentValue = computed(() => isControlled.value ? props.value! : uncontrolledValue.value)

function handleChange(newValue: string) {
  if (!isControlled.value) uncontrolledValue.value = newValue
  props.onChange?.(newValue)
}

function handleFocus() {
  isActive.value = true
  props.onFocus?.()
}

function handleBlur() {
  isActive.value = false
  props.onBlur?.()
}

provide(InputKey, reactive({
  value: currentValue,
  inputId,
  isActive,
  invalidType: toRef(props, 'invalidType'),
  isSuccess: toRef(props, 'isSuccess'),
  isRequired: toRef(props, 'isRequired'),
  errorMessage: toRef(props, 'errorMessage'),
  handleChange,
  handleFocus,
  handleBlur,
}))
</script>

<template>
  <div><slot /></div>
</template>
