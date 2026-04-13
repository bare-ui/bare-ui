<script setup lang="ts">
import { provide, reactive, ref, computed, toRef } from 'vue'
import { PasswordKey } from './keys'
import { Helper } from '@/utils/helper'

defineOptions({ name: 'PasswordRoot' })

const props = withDefaults(defineProps<{
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  onFocus?: () => void
  onBlur?: () => void
  isRequired?: boolean
  errorMessage?: Record<string, string>
  invalidType?: string
  id?: string
}>(), {
  defaultValue: '',
  isRequired: false,
  errorMessage: () => ({}),
  invalidType: '',
})

const uncontrolledValue = ref(props.defaultValue)
const visible = ref(false)
const inputId = props.id || Helper.generateUUID()

const isControlled = computed(() => props.value !== undefined)
const currentValue = computed(() => isControlled.value ? props.value! : uncontrolledValue.value)

function handleChange(val: string) {
  if (!isControlled.value) uncontrolledValue.value = val
  props.onChange?.(val)
}

function handleFocus() {
  props.onFocus?.()
}

function handleBlur() {
  props.onBlur?.()
}

provide(PasswordKey, reactive({
  inputId,
  value: currentValue,
  visible,
  isRequired: toRef(props, 'isRequired'),
  invalidType: toRef(props, 'invalidType'),
  errorMessage: toRef(props, 'errorMessage'),
  setVisible: (v: boolean) => { visible.value = v },
  handleChange,
  handleFocus,
  handleBlur,
}))
</script>

<template>
  <div><slot /></div>
</template>
