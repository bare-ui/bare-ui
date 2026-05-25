import SheetRoot from './SheetRoot.vue';
import SheetTrigger from './SheetTrigger.vue';
import SheetPortal from './SheetPortal.vue';
import SheetOverlay from './SheetOverlay.vue';
import SheetContent from './SheetContent.vue';
import SheetHandle from './SheetHandle.vue';
import SheetTitle from './SheetTitle.vue';
import SheetDescription from './SheetDescription.vue';
import SheetClose from './SheetClose.vue';

export const Sheet = {
	Root: SheetRoot,
	Trigger: SheetTrigger,
	Portal: SheetPortal,
	Overlay: SheetOverlay,
	Content: SheetContent,
	Handle: SheetHandle,
	Title: SheetTitle,
	Description: SheetDescription,
	Close: SheetClose,
};

export type {
	SheetRootProps,
	SheetTriggerProps,
	SheetPortalProps,
	SheetOverlayProps,
	SheetContentProps,
	SheetHandleProps,
	SheetTitleProps,
	SheetDescriptionProps,
	SheetCloseProps,
	SheetSide,
} from './Sheet.types';
