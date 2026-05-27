import PopoverRoot from './PopoverRoot.vue';
import PopoverTrigger from './PopoverTrigger.vue';
import PopoverContent from './PopoverContent.vue';
import PopoverClose from './PopoverClose.vue';

export const Popover = { Root: PopoverRoot, Trigger: PopoverTrigger, Content: PopoverContent, Close: PopoverClose };
export type {
	PopoverRootProps,
	PopoverTriggerProps,
	PopoverContentProps,
	PopoverCloseProps,
	PopoverSide,
	PopoverAlign,
} from './Popover.types';
