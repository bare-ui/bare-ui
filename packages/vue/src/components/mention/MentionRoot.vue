<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { useControllableState } from '@/composables/use-controllable-state'
import { useId } from '@/composables/use-id'
import { MentionKey } from './keys'
import type { MentionCoords, MentionOption } from './Mention.types'

defineOptions({ name: 'MentionRoot' })

const props = withDefaults(
	defineProps<{
		options: MentionOption[]
		value?: string
		defaultValue?: string
		onChange?: (value: string) => void
		trigger?: string
		filter?: (option: MentionOption, query: string) => boolean
		onSelect?: (option: MentionOption) => void
		appendSpace?: boolean
		disabled?: boolean
	}>(),
	{
		value: undefined,
		defaultValue: '',
		onChange: undefined,
		trigger: '@',
		filter: undefined,
		onSelect: undefined,
		appendSpace: true,
		disabled: false,
	},
)

// ---------------------------------------------------------------------------
// Detection
// ---------------------------------------------------------------------------

interface Detection {
	triggerIndex: number
	query: string
}

/**
 * Looks backwards from the caret for an active trigger token. The trigger must
 * sit at the start of the text or follow whitespace (so `a@b.com` is ignored),
 * and the query (text between trigger and caret) must contain no whitespace.
 */
function detectMention(text: string, caret: number, trigger: string): Detection | null {
	for (let i = caret - 1; i >= 0; i--) {
		const ch = text[i]
		if (ch === trigger) {
			const boundary = i === 0 || /\s/.test(text[i - 1])
			return boundary ? { triggerIndex: i, query: text.slice(i + 1, caret) } : null
		}
		if (/\s/.test(ch)) return null
	}
	return null
}

function defaultFilter(option: MentionOption, query: string) {
	return option.label.toLowerCase().includes(query.trim().toLowerCase())
}

// ---------------------------------------------------------------------------
// Caret coordinates (mirror-div technique)
// ---------------------------------------------------------------------------

const MIRROR_PROPS = [
	'boxSizing',
	'width',
	'height',
	'overflowX',
	'overflowY',
	'borderTopWidth',
	'borderRightWidth',
	'borderBottomWidth',
	'borderLeftWidth',
	'paddingTop',
	'paddingRight',
	'paddingBottom',
	'paddingLeft',
	'fontStyle',
	'fontVariant',
	'fontWeight',
	'fontStretch',
	'fontSize',
	'lineHeight',
	'fontFamily',
	'textAlign',
	'textTransform',
	'textIndent',
	'letterSpacing',
	'wordSpacing',
	'tabSize',
	'whiteSpace',
	'wordWrap',
]

function caretCoordinates(el: HTMLTextAreaElement, position: number): MentionCoords {
	const doc = el.ownerDocument
	if (typeof doc.body === 'undefined') return { top: 0, left: 0 }

	const computed = globalThis.getComputedStyle(el)
	const div = doc.createElement('div')
	const divStyle = div.style as unknown as Record<string, string>
	const computedRecord = computed as unknown as Record<string, string>

	divStyle.position = 'absolute'
	divStyle.visibility = 'hidden'
	divStyle.whiteSpace = 'pre-wrap'
	divStyle.wordWrap = 'break-word'
	for (const prop of MIRROR_PROPS) divStyle[prop] = computedRecord[prop]
	divStyle.overflow = 'hidden'

	div.textContent = el.value.slice(0, position)
	const span = doc.createElement('span')
	span.textContent = el.value.slice(position) || '.'
	div.appendChild(span)
	doc.body.appendChild(div)

	const borderTop = parseInt(computed.borderTopWidth) || 0
	const borderLeft = parseInt(computed.borderLeftWidth) || 0
	const lineHeight = parseInt(computed.lineHeight) || parseInt(computed.fontSize) * 1.2 || 0
	const top = span.offsetTop + borderTop
	const left = span.offsetLeft + borderLeft
	doc.body.removeChild(div)

	return {
		top: el.offsetTop + top + lineHeight - el.scrollTop,
		left: el.offsetLeft + left - el.scrollLeft,
	}
}

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

interface MentionState {
	open: boolean
	query: string
	triggerIndex: number
	coords: MentionCoords
}

const CLOSED: MentionState = { open: false, query: '', triggerIndex: -1, coords: { top: 0, left: 0 } }

const text = useControllableState<string>({
	value: () => props.value,
	defaultValue: props.defaultValue,
	onChange: (next) => props.onChange?.(next),
})

const state = ref<MentionState>({ ...CLOSED })
const activeIndex = ref(0)
const inputRef = ref<HTMLTextAreaElement | null>(null)
let prevQuery: string | null = null
// Trigger index currently dismissed via Escape — suppresses re-opening
// until the text changes or the caret leaves the token.
let dismissedIndex: number | null = null
let triggerIndexCurrent = -1

const baseId = useId('mention')
const listboxId = `${baseId}-listbox`
function getOptionId(index: number) {
	return `${baseId}-opt-${index}`
}

const options = computed(() => props.options)
const disabled = computed(() => props.disabled)

const filtered = computed(() => {
	if (!state.value.open) return []
	const filterFn = props.filter ?? defaultFilter
	return props.options.filter((o) => filterFn(o, state.value.query))
})

function close() {
	prevQuery = null
	if (state.value.open) state.value = { ...CLOSED }
}

function detect(value: string, caret: number) {
	if (props.disabled) {
		close()
		return
	}
	const found = detectMention(value, caret, props.trigger)
	if (!found) {
		dismissedIndex = null
		close()
		return
	}
	triggerIndexCurrent = found.triggerIndex
	if (found.triggerIndex === dismissedIndex) {
		close()
		return
	}
	const el = inputRef.value
	const coords = el ? caretCoordinates(el, found.triggerIndex) : { top: 0, left: 0 }
	if (prevQuery !== found.query) activeIndex.value = 0
	prevQuery = found.query
	state.value = { open: true, query: found.query, triggerIndex: found.triggerIndex, coords }
}

function dismiss() {
	dismissedIndex = triggerIndexCurrent
	close()
}

function handleChange(value: string, caret: number) {
	dismissedIndex = null
	text.value = value
	detect(value, caret)
}

function handleCaret(caret: number) {
	detect(text.value, caret)
}

function setActiveIndex(index: number) {
	activeIndex.value = index
}

function moveActive(delta: number) {
	const list = filtered.value
	if (list.length === 0) return
	let i = activeIndex.value
	for (let attempt = 0; attempt < list.length; attempt++) {
		i = (i + delta + list.length) % list.length
		if (!list[i].disabled) {
			activeIndex.value = i
			return
		}
	}
}

function select(option: MentionOption) {
	if (option.disabled) return
	const el = inputRef.value
	const ti = state.value.triggerIndex
	if (ti < 0) {
		close()
		return
	}
	const caret = el?.selectionStart ?? ti + 1 + state.value.query.length
	const inserted = `${props.trigger}${option.value ?? option.label}${props.appendSpace ? ' ' : ''}`
	const next = text.value.slice(0, ti) + inserted + text.value.slice(caret)
	text.value = next
	props.onSelect?.(option)
	close()

	const newCaret = ti + inserted.length
	globalThis.requestAnimationFrame(() => {
		if (el) {
			el.focus()
			el.setSelectionRange(newCaret, newCaret)
		}
	})
}

provide(MentionKey, {
	text,
	options,
	filtered,
	open: computed(() => state.value.open),
	query: computed(() => state.value.query),
	activeIndex,
	disabled,
	coords: computed(() => state.value.coords),
	listboxId,
	getOptionId,
	inputRef,
	setActiveIndex,
	moveActive,
	select,
	close,
	dismiss,
	handleChange,
	handleCaret,
})
</script>

<template>
	<div :data-disabled="props.disabled ? '' : undefined">
		<slot />
	</div>
</template>
