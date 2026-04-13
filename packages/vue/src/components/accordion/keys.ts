import { inject, type InjectionKey } from 'vue';
import type { AccordionContextValue, AccordionItemContextValue } from './Accordion.types';

export const AccordionKey: InjectionKey<AccordionContextValue> = Symbol('AccordionContext');
export const AccordionItemKey: InjectionKey<AccordionItemContextValue> = Symbol('AccordionItemContext');

export function useAccordionContext() {
	const ctx = inject(AccordionKey);
	if (!ctx) throw new Error('Accordion sub-components must be used within Accordion.Root');
	return ctx;
}

export function useAccordionItemContext() {
	const ctx = inject(AccordionItemKey);
	if (!ctx) throw new Error('Accordion.Trigger/Content must be used within Accordion.Item');
	return ctx;
}
