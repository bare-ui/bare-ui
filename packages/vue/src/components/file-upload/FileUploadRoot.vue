<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { FileUploadKey } from './keys'

defineOptions({ name: 'FileUploadRoot' })

const props = withDefaults(
	defineProps<{
		value?: File[]
		defaultValue?: File[]
		onChange?: (files: File[]) => void
		multiple?: boolean
		accept?: string
		maxFiles?: number
		maxSize?: number
		disabled?: boolean
		onReject?: (rejected: { file: File; reason: 'maxFiles' | 'maxSize' | 'accept' }[]) => void
	}>(),
	{
		multiple: false,
		disabled: false,
	},
)

function matchesAccept(file: File, accept: string | undefined): boolean {
	if (!accept) return true
	const tokens = accept
		.split(',')
		.map((t) => t.trim().toLowerCase())
		.filter(Boolean)
	if (tokens.length === 0) return true
	const name = file.name.toLowerCase()
	const type = file.type.toLowerCase()
	return tokens.some((token) => {
		if (token.startsWith('.')) return name.endsWith(token)
		if (token.endsWith('/*')) return type.startsWith(token.slice(0, -1))
		return type === token
	})
}

const uncontrolled = ref<File[]>(props.defaultValue ?? [])
const isControlled = computed(() => props.value !== undefined)
const files = computed<File[]>(() => (isControlled.value ? (props.value as File[]) : uncontrolled.value))

const disabled = computed(() => props.disabled)
const multiple = computed(() => props.multiple)
const accept = computed(() => props.accept)
const maxFiles = computed(() => props.maxFiles)
const maxSize = computed(() => props.maxSize)
const isDragging = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

function setFiles(next: File[]) {
	if (!isControlled.value) uncontrolled.value = next
	props.onChange?.(next)
}

function addFiles(incoming: File[]) {
	if (props.disabled) return
	const accepted: File[] = []
	const rejected: { file: File; reason: 'maxFiles' | 'maxSize' | 'accept' }[] = []
	const base = props.multiple ? files.value : []
	const slotsAvailable =
		props.maxFiles !== undefined ? Math.max(0, props.maxFiles - base.length) : Infinity

	for (const file of incoming) {
		if (!matchesAccept(file, props.accept)) {
			rejected.push({ file, reason: 'accept' })
			continue
		}
		if (props.maxSize !== undefined && file.size > props.maxSize) {
			rejected.push({ file, reason: 'maxSize' })
			continue
		}
		if (accepted.length >= slotsAvailable) {
			rejected.push({ file, reason: 'maxFiles' })
			continue
		}
		accepted.push(file)
		if (!props.multiple) break
	}

	if (rejected.length > 0) props.onReject?.(rejected)
	if (accepted.length > 0) setFiles(props.multiple ? [...base, ...accepted] : accepted)
}

function removeFile(index: number) {
	if (props.disabled) return
	setFiles(files.value.filter((_, i) => i !== index))
}

function openPicker() {
	if (props.disabled) return
	inputRef.value?.click()
}

function registerInput(el: HTMLInputElement | null) {
	inputRef.value = el
}

function setDragging(v: boolean) {
	isDragging.value = v
}

provide(FileUploadKey, {
	files,
	disabled,
	multiple,
	accept,
	maxFiles,
	maxSize,
	isDragging,
	addFiles,
	removeFile,
	openPicker,
	registerInput,
	setDragging,
})
</script>

<template>
	<div :data-disabled="props.disabled ? '' : undefined">
		<slot />
	</div>
</template>
