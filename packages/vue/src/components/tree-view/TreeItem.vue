<script setup lang="ts">
import { computed } from 'vue'
import { useTreeViewContext } from './keys'
import { getDirection } from '@/composables/use-direction'
import type { TreeItemState, TreeNode } from './TreeView.types'

defineOptions({ name: 'TreeItem' })

const props = defineProps<{
	node: TreeNode
	level: number
}>()

defineSlots<{
	default(props: { node: TreeNode; state: TreeItemState }): unknown
}>()

const ctx = useTreeViewContext()

const isExpanded = computed(() => ctx.expanded.value.has(props.node.id))
const isSelected = computed(() => ctx.selected.value.has(props.node.id))
const hasChildren = computed(() => !!(props.node.children && props.node.children.length > 0))
const disabled = computed(() => !!props.node.disabled)

function onKeyDown(e: KeyboardEvent) {
	if (disabled.value) return
	// RTL mirrors the tree: ArrowLeft expands/enters, ArrowRight collapses/exits.
	const rtl = getDirection(e.currentTarget as Element) === 'rtl'
	const expandKey = rtl ? 'ArrowLeft' : 'ArrowRight'
	const collapseKey = rtl ? 'ArrowRight' : 'ArrowLeft'
	switch (e.key) {
		case expandKey:
			e.preventDefault()
			// Collapsed parent: expand. Expanded parent: move into the first child.
			if (hasChildren.value && !isExpanded.value) ctx.toggleExpanded(props.node.id)
			else if (hasChildren.value && isExpanded.value) ctx.focusByOffset(props.node.id, 1)
			break
		case collapseKey:
			e.preventDefault()
			// Expanded parent: collapse. Otherwise move to the parent node.
			if (hasChildren.value && isExpanded.value) ctx.toggleExpanded(props.node.id)
			else ctx.focusParent(props.node.id)
			break
		case 'ArrowDown':
			e.preventDefault()
			ctx.focusByOffset(props.node.id, 1)
			break
		case 'ArrowUp':
			e.preventDefault()
			ctx.focusByOffset(props.node.id, -1)
			break
		case 'Home':
			e.preventDefault()
			ctx.focusEdge('first')
			break
		case 'End':
			e.preventDefault()
			ctx.focusEdge('last')
			break
		case 'Enter':
		case ' ':
			e.preventDefault()
			ctx.selectNode(props.node.id)
			break
	}
}

function onFocus(e: FocusEvent) {
	// Roving tabindex follows focus.
	if (e.target === e.currentTarget) ctx.setActiveId(props.node.id)
}

function onClick(e: MouseEvent) {
	const current = e.currentTarget as HTMLElement
	const target = e.target as HTMLElement | null
	if (current !== target && !target?.closest('[data-tree-toggle]')) {
		return
	}
	e.stopPropagation()
}

const state = computed<TreeItemState>(() => ({
	level: props.level,
	expanded: isExpanded.value,
	selected: isSelected.value,
	hasChildren: hasChildren.value,
	disabled: disabled.value,
	toggle: () => ctx.toggleExpanded(props.node.id),
	select: () => ctx.selectNode(props.node.id),
}))
</script>

<template>
	<div
		role="treeitem"
		:data-id="node.id"
		:tabindex="!disabled && ctx.tabbableId.value === node.id ? 0 : -1"
		:aria-expanded="hasChildren ? isExpanded : undefined"
		:aria-selected="isSelected || undefined"
		:aria-level="level"
		:aria-disabled="disabled || undefined"
		:data-state="isExpanded ? 'open' : 'closed'"
		:data-selected="isSelected ? '' : undefined"
		:data-disabled="disabled ? '' : undefined"
		:data-level="level"
		:data-has-children="hasChildren ? '' : undefined"
		@keydown="onKeyDown"
		@focus="onFocus"
		@click="onClick">
		<slot
			:node="node"
			:state="state" />
	</div>
	<div
		v-if="hasChildren && isExpanded"
		role="group">
		<TreeItem
			v-for="child in node.children"
			:key="child.id"
			:node="child"
			:level="level + 1">
			<template #default="childCtx">
				<slot
					:node="childCtx.node"
					:state="childCtx.state" />
			</template>
		</TreeItem>
	</div>
</template>
