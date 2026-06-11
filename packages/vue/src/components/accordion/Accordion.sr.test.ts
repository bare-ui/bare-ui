/**
 * Screen-reader semantics for Accordion. Each header is a button that announces
 * its expanded/collapsed state and controls a region named by that header.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { expectExposedAs, accessibleNameVia } from '@/test/sr';
import { Accordion } from '.';

const { Root: AccordionRoot, Item: AccordionItem, Trigger: AccordionTrigger, Content: AccordionContent } = Accordion;

function renderAccordion() {
	return render({
		template: `
			<AccordionRoot type="single" :collapsible="true">
				<AccordionItem value="shipping">
					<AccordionTrigger>Shipping</AccordionTrigger>
					<AccordionContent>Ships in 2 days</AccordionContent>
				</AccordionItem>
				<AccordionItem value="returns">
					<AccordionTrigger>Returns</AccordionTrigger>
					<AccordionContent>30 day returns</AccordionContent>
				</AccordionItem>
			</AccordionRoot>
		`,
		components: { AccordionRoot, AccordionItem, AccordionTrigger, AccordionContent },
	});
}

describe('Accordion — screen reader semantics', () => {
	it('announces each trigger as a collapsed button by name', () => {
		renderAccordion();
		const shipping = expectExposedAs('button', 'Shipping');
		expect(shipping).toHaveAttribute('aria-expanded', 'false');
	});

	it('updates the expanded state announcement on toggle', async () => {
		renderAccordion();
		await userEvent.click(screen.getByRole('button', { name: 'Shipping' }));
		expect(screen.getByRole('button', { name: 'Shipping' })).toHaveAttribute('aria-expanded', 'true');
	});

	it('exposes the revealed content as a region named by its trigger', async () => {
		renderAccordion();
		await userEvent.click(screen.getByRole('button', { name: 'Shipping' }));
		const region = screen.getByRole('region');
		expect(accessibleNameVia(region)).toBe('Shipping');
	});

	it('points the trigger at the region it controls via aria-controls', async () => {
		renderAccordion();
		const trigger = screen.getByRole('button', { name: 'Shipping' });
		await userEvent.click(trigger);
		const region = screen.getByRole('region');
		expect(trigger.getAttribute('aria-controls')).toBe(region.id);
	});
});