<script setup lang="ts">
import { useMenuBarMenuContext } from './keys'

defineOptions({ name: 'MenuBarContent' })

const menu = useMenuBarMenuContext()
</script>

<template>
	<div
		v-if="menu.open.value"
		role="menu"
		data-state="open">
		<slot />
	</div>
</template>
