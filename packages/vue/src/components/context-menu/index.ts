import ContextMenuRoot from './ContextMenuRoot.vue';
import ContextMenuTrigger from './ContextMenuTrigger.vue';
import ContextMenuContent from './ContextMenuContent.vue';
import ContextMenuItem from './ContextMenuItem.vue';
import ContextMenuSeparator from './ContextMenuSeparator.vue';

export const ContextMenu = {
	Root: ContextMenuRoot,
	Trigger: ContextMenuTrigger,
	Content: ContextMenuContent,
	Item: ContextMenuItem,
	Separator: ContextMenuSeparator,
};

export type {
	ContextMenuRootProps,
	ContextMenuTriggerProps,
	ContextMenuContentProps,
	ContextMenuItemProps,
	ContextMenuSeparatorProps,
} from './ContextMenu.types';
