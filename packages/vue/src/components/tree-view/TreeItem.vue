<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
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
const itemRef = useTemplateRef<HTMLDivElement>('itemRef')

const isExpanded = computed(() => ctx.expanded.value.has(props.node.id))
const isSelected = computed(() => ctx.selected.value.has(props.node.id))
const hasChildren = computed(() => !!(props.node.children && props.node.children.length > 0))
const disabled = computed(() => !!props.node.disabled)

function focusSibling(offset: 1 | -1) {
	const root = itemRef.value?.closest('[role="tree"]')
	if (!root) return
	const all = Array.from(root.querySelectorAll<HTMLElement>('[role="treeitem"]'))
	const idx = all.indexOf(itemRef.value as HTMLElement)
	const target = all[idx + offset]
	if (target) target.focus()
}

function onKeyDown(e: KeyboardEvent) {
	if (disabled.value) return
	// RTL mirrors the tree: ArrowLeft expands/enters, ArrowRight collapses/exits.
	const rtl = getDirection(e.currentTarget as Element) === 'rtl'
	const expandKey = rtl ? 'ArrowLeft' : 'ArrowRight'
	const collapseKey = rtl ? 'ArrowRight' : 'ArrowLeft'
	switch (e.key) {
		case expandKey:
			e.preventDefault()
			if (hasChildren.value && !isExpanded.value) ctx.toggleExpanded(props.node.id)
			else if (hasChildren.value && isExpanded.value) focusSibling(1)
			break
		case collapseKey:
			e.preventDefault()
			if (hasChildren.value && isExpanded.value) ctx.toggleExpanded(props.node.id)
			else focusSibling(-1)
			break
		case 'ArrowDown':
			e.preventDefault()
			focusSibling(1)
			break
		case 'ArrowUp':
			e.preventDefault()
			focusSibling(-1)
			break
		case 'Enter':
		case ' ':
			e.preventDefault()
			ctx.selectNode(props.node.id)
			break
	}
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
		ref="itemRef"
		role="treeitem"
		:tabindex="disabled ? -1 : 0"
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
