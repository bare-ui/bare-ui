<script setup lang="ts">
import { provide, reactive, ref, computed } from 'vue'
import { RadioKey } from './keys'
import { Helper } from '@/utils/helper'

defineOptions({ name: 'RadioRoot' })

const props = withDefaults(defineProps<{
  value?: string | number
  defaultValue?: string | number
  onChange?: (value: string | number) => void
  name?: string
}>(), {})

const uncontrolledValue = ref(props.defaultValue)
const groupName = props.name || Helper.generateUUID()
const isControlled = computed(() => props.value !== undefined)
const selectedValue = computed(() => isControlled.value ? props.value : uncontrolledValue.value)

function isSelected(itemValue: string | number) {
  const sv = selectedValue.value
  if (sv === undefined || sv === null) return false
  return String(sv) === String(itemValue)
}

function select(itemValue: string | number) {
  if (!isControlled.value) uncontrolledValue.value = itemValue
  props.onChange?.(itemValue)
}

provide(RadioKey, reactive({ selectedValue, name: groupName, select, isSelected }))
</script>

<template>
  <div role="radiogroup"><slot /></div>
</template>
