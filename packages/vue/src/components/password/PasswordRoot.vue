<script setup lang="ts">
import { provide, reactive, ref, toRef } from 'vue'
import { PasswordKey } from './keys'
import { useControllableState } from '@/composables/use-controllable-state'
import { useId } from '@/composables/use-id'

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

const currentValue = useControllableState<string>({
  value: () => props.value,
  defaultValue: props.defaultValue,
  onChange: (next) => props.onChange?.(next),
})
const visible = ref(false)
const inputId = useId('password', props.id)

function handleChange(val: string) {
  currentValue.value = val
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
