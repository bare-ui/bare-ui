<script setup lang="ts">
import { provide, reactive, ref, toRef } from 'vue'
import { InputKey } from './keys'
import { useControllableState } from '@/composables/use-controllable-state'
import { useId } from '@/composables/use-id'

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

const currentValue = useControllableState<string>({
  value: () => props.value,
  defaultValue: props.defaultValue,
  onChange: (next) => props.onChange?.(next),
})
const isActive = ref(false)
const inputId = useId('input', props.id)

function handleChange(newValue: string) {
  currentValue.value = newValue
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
