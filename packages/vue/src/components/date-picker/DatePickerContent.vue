<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useDatePickerContext } from './keys'
import { useFocusTrap } from '@/composables/use-focus-trap'

defineOptions({ name: 'DatePickerContent' })

const ctx = useDatePickerContext()
const contentRef = ref<HTMLElement | null>(null)

// Prefer landing focus on the calendar's active day (the roving-tabindex
// gridcell) rather than the first nav button, per the date-picker dialog
// pattern. The Calendar grid already chooses the cell — selected day, else
// today, else the first selectable day — so we just target it here.
const initialFocus = ref<HTMLElement | null>(null)

function resolveGridCell() {
	initialFocus.value =
		contentRef.value?.querySelector<HTMLElement>('[role="gridcell"][tabindex="0"]') ?? null
}

// Populate the focus target before the trap activates. Both run as post-flush
// effects; registering these before useFocusTrap guarantees they run first so
// the gridcell is resolved by the time the trap reads initialFocus.
onMounted(resolveGridCell)
watch(() => ctx.open.value, (open) => { if (open) resolveGridCell() }, { flush: 'post' })

// Trap focus inside the popover while open and restore it to the trigger on
// close (Escape, outside click, or selection).
useFocusTrap(contentRef, { active: () => ctx.open.value, initialFocus })
</script>

<template>
	<div
		v-if="ctx.open.value"
		:id="ctx.contentId"
		ref="contentRef"
		role="dialog"
		:aria-labelledby="ctx.triggerId"
		:tabindex="-1"
		data-state="open">
		<slot />
	</div>
</template>
