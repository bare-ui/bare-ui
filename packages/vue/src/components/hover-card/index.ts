import HoverCardRoot from './HoverCardRoot.vue';
import HoverCardTrigger from './HoverCardTrigger.vue';
import HoverCardContent from './HoverCardContent.vue';

export const HoverCard = { Root: HoverCardRoot, Trigger: HoverCardTrigger, Content: HoverCardContent };
export type {
	HoverCardRootProps,
	HoverCardTriggerProps,
	HoverCardContentProps,
	HoverCardSide,
} from './HoverCard.types';
