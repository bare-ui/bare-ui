import MenuBarRoot from './MenuBarRoot.vue';
import MenuBarMenu from './MenuBarMenu.vue';
import MenuBarTrigger from './MenuBarTrigger.vue';
import MenuBarContent from './MenuBarContent.vue';
import MenuBarItem from './MenuBarItem.vue';
import MenuBarSeparator from './MenuBarSeparator.vue';

export const MenuBar = {
	Root: MenuBarRoot,
	Menu: MenuBarMenu,
	Trigger: MenuBarTrigger,
	Content: MenuBarContent,
	Item: MenuBarItem,
	Separator: MenuBarSeparator,
};

export type {
	MenuBarRootProps,
	MenuBarMenuProps,
	MenuBarTriggerProps,
	MenuBarContentProps,
	MenuBarItemProps,
	MenuBarSeparatorProps,
} from './MenuBar.types';
