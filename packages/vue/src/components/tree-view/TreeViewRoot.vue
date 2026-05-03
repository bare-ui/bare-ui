<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { TreeViewKey } from './keys'
import TreeItem from './TreeItem.vue'
import type { TreeItemState, TreeNode, TreeSelectionMode } from './TreeView.types'

defineOptions({ name: 'TreeViewRoot' })

const props = withDefaults(
	defineProps<{
		nodes: TreeNode[]
		expanded?: string[]
		defaultExpanded?: string[]
		onExpandedChange?: (expanded: string[]) => void
		selectionMode?: TreeSelectionMode
		selected?: string[]
		defaultSelected?: string[]
		onSelectionChange?: (selected: string[]) => void
	}>(),
	{
		selectionMode: 'none',
	},
)

defineSlots<{
	default(props: { node: TreeNode; state: TreeItemState }): unknown
}>()

const uncontrolledExpanded = ref<string[]>(props.defaultExpanded ?? [])
const isExpControlled = computed(() => props.expanded !== undefined)
const expandedArr = computed(() =>
	isExpControlled.value ? (props.expanded as string[]) : uncontrolledExpanded.value,
)
const expanded = computed(() => new Set(expandedArr.value))

const uncontrolledSelected = ref<string[]>(props.defaultSelected ?? [])
const isSelControlled = computed(() => props.selected !== undefined)
const selectedArr = computed(() =>
	isSelControlled.value ? (props.selected as string[]) : uncontrolledSelected.value,
)
const selected = computed(() => new Set(selectedArr.value))

const selectionMode = computed(() => props.selectionMode)

function toggleExpanded(id: string) {
	const next = new Set(expanded.value)
	if (next.has(id)) next.delete(id)
	else next.add(id)
	const arr = Array.from(next)
	if (!isExpControlled.value) uncontrolledExpanded.value = arr
	props.onExpandedChange?.(arr)
}

function selectNode(id: string) {
	if (selectionMode.value === 'none') return
	let next: string[]
	if (selectionMode.value === 'single') {
		next = selected.value.has(id) ? [] : [id]
	} else {
		const set = new Set(selected.value)
		if (set.has(id)) set.delete(id)
		else set.add(id)
		next = Array.from(set)
	}
	if (!isSelControlled.value) uncontrolledSelected.value = next
	props.onSelectionChange?.(next)
}

provide(TreeViewKey, {
	expanded,
	selected,
	selectionMode,
	toggleExpanded,
	selectNode,
})
</script>

<template>
	<div
		role="tree"
		:aria-multiselectable="selectionMode === 'multiple' ? true : undefined">
		<TreeItem
			v-for="node in nodes"
			:key="node.id"
			:node="node"
			:level="1">
			<template #default="ctx">
				<slot
					:node="ctx.node"
					:state="ctx.state" />
			</template>
		</TreeItem>
	</div>
</template>
