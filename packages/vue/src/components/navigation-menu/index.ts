import NavigationMenuRoot from './NavigationMenuRoot.vue';
import NavigationMenuList from './NavigationMenuList.vue';
import NavigationMenuItem from './NavigationMenuItem.vue';
import NavigationMenuTrigger from './NavigationMenuTrigger.vue';
import NavigationMenuContent from './NavigationMenuContent.vue';
import NavigationMenuLink from './NavigationMenuLink.vue';

export const NavigationMenu = {
	Root: NavigationMenuRoot,
	List: NavigationMenuList,
	Item: NavigationMenuItem,
	Trigger: NavigationMenuTrigger,
	Content: NavigationMenuContent,
	Link: NavigationMenuLink,
};

export type {
	NavigationMenuRootProps,
	NavigationMenuListProps,
	NavigationMenuItemProps,
	NavigationMenuTriggerProps,
	NavigationMenuContentProps,
	NavigationMenuLinkProps,
} from './NavigationMenu.types';
