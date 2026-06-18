<script setup lang="ts">
import { computed, provide, ref, useTemplateRef } from 'vue'
import { TreeViewKey } from './keys'
import TreeItem from './TreeItem.vue'
import type { TreeItemState, TreeNode, TreeSelectionMode } from './TreeView.types'

/** Flattened, display-order list of the rows a user can currently see/navigate. */
interface VisibleEntry {
	id: string
	parentId: string | null
	disabled: boolean
}

function flattenVisible(
	nodes: TreeNode[],
	expanded: Set<string>,
	parentId: string | null = null,
): VisibleEntry[] {
	const out: VisibleEntry[] = []
	for (const node of nodes) {
		out.push({ id: node.id, parentId, disabled: !!node.disabled })
		if (node.children && node.children.length > 0 && expanded.has(node.id)) {
			out.push(...flattenVisible(node.children, expanded, node.id))
		}
	}
	return out
}

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
const expandedSet = computed(() => new Set(expandedArr.value))

const uncontrolledSelected = ref<string[]>(props.defaultSelected ?? [])
const isSelControlled = computed(() => props.selected !== undefined)
const selectedArr = computed(() =>
	isSelControlled.value ? (props.selected as string[]) : uncontrolledSelected.value,
)
const selectedSet = computed(() => new Set(selectedArr.value))

const selectionMode = computed(() => props.selectionMode)

function toggleExpanded(id: string) {
	const next = new Set(expandedSet.value)
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
		next = selectedSet.value.has(id) ? [] : [id]
	} else {
		const set = new Set(selectedSet.value)
		if (set.has(id)) set.delete(id)
		else set.add(id)
		next = Array.from(set)
	}
	if (!isSelControlled.value) uncontrolledSelected.value = next
	props.onSelectionChange?.(next)
}

const rootRef = useTemplateRef<HTMLDivElement>('rootRef')

// Flattened display order of currently-visible rows — the basis for arrow,
// Home/End, and parent navigation, and for the roving tabindex.
const visible = computed(() => flattenVisible(props.nodes, expandedSet.value))
const enabledVisible = computed(() => visible.value.filter((v) => !v.disabled))

const activeId = ref<string | null>(null)

// Exactly one node is tabbable: the focused node if it's still visible/enabled,
// otherwise the first enabled row, so Tab always reaches (and exits) the tree.
const tabbableId = computed<string | null>(() => {
	const id = activeId.value
	const enabled = enabledVisible.value
	if (id && enabled.some((v) => v.id === id)) return id
	return enabled[0]?.id ?? null
})

function setActiveId(id: string) {
	activeId.value = id
}

function focusId(id: string) {
	const el = rootRef.value?.querySelector<HTMLElement>(
		`[role="treeitem"][data-id="${CSS.escape(id)}"]`,
	)
	el?.focus()
}

function focusByOffset(fromId: string, delta: number) {
	const enabled = enabledVisible.value
	const idx = enabled.findIndex((v) => v.id === fromId)
	if (idx < 0) return
	const target = enabled[idx + delta]
	if (target) {
		setActiveId(target.id)
		focusId(target.id)
	}
}

function focusEdge(edge: 'first' | 'last') {
	const enabled = enabledVisible.value
	const target = edge === 'first' ? enabled[0] : enabled[enabled.length - 1]
	if (target) {
		setActiveId(target.id)
		focusId(target.id)
	}
}

function focusParent(fromId: string) {
	const entry = visible.value.find((v) => v.id === fromId)
	if (entry?.parentId) {
		setActiveId(entry.parentId)
		focusId(entry.parentId)
	}
}

provide(TreeViewKey, {
	expanded: expandedSet,
	selected: selectedSet,
	selectionMode,
	toggleExpanded,
	selectNode,
	tabbableId,
	setActiveId,
	focusByOffset,
	focusEdge,
	focusParent,
})
</script>

<template>
	<div
		ref="rootRef"
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
