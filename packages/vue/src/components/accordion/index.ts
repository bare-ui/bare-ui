import AccordionRoot from './AccordionRoot.vue';
import AccordionItem from './AccordionItem.vue';
import AccordionTrigger from './AccordionTrigger.vue';
import AccordionContent from './AccordionContent.vue';

export const Accordion = { Root: AccordionRoot, Item: AccordionItem, Trigger: AccordionTrigger, Content: AccordionContent };
export type {
	AccordionRootProps,
	AccordionItemProps,
	AccordionTriggerProps,
	AccordionContentProps,
} from './Accordion.types';
