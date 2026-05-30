<script setup lang="ts">
import { provide, reactive, ref, toRef } from 'vue'
import { TextareaKey } from './keys'
import { useControllableState } from '@/composables/use-controllable-state'
import { useId } from '@/composables/use-id'

defineOptions({ name: 'TextareaRoot' })

const props = withDefaults(defineProps<{
  /** Controlled textarea value. */
  value?: string
  /** Initial textarea value (uncontrolled). */
  defaultValue?: string
  /** Called with the new value on every change. */
  onChange?: (value: string) => void
  /** Called when the field gains focus. */
  onFocus?: () => void
  /** Called when the field loses focus. */
  onBlur?: () => void
  /** Set by the consumer to show an error state. Use the key in errorMessage to display the message. */
  invalidType?: string
  /** Map of `invalidType` keys to the error message shown for each. */
  errorMessage?: Record<string, string>
  /** Mark the field as required. */
  isRequired?: boolean
  /** Show a success (valid) state. */
  isSuccess?: boolean
  /** Id applied to the textarea; auto-generated when omitted. */
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
const textareaId = useId('textarea', props.id)

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

provide(TextareaKey, reactive({
  value: currentValue,
  textareaId,
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
