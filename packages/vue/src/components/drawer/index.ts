import DrawerRoot from './DrawerRoot.vue';
import DrawerPortal from './DrawerPortal.vue';
import DrawerOverlay from './DrawerOverlay.vue';
import DrawerContent from './DrawerContent.vue';
import DrawerHeader from './DrawerHeader.vue';
import DrawerClose from './DrawerClose.vue';

export const Drawer = { Root: DrawerRoot, Portal: DrawerPortal, Overlay: DrawerOverlay, Content: DrawerContent, Header: DrawerHeader, Close: DrawerClose };
export type {
	DrawerRootProps,
	DrawerPortalProps,
	DrawerOverlayProps,
	DrawerContentProps,
	DrawerHeaderProps,
	DrawerCloseProps,
} from './Drawer.types';
