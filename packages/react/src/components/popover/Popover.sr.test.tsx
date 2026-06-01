import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { accessibleNameVia } from '@/test/sr';
import { Popover } from './Popover';

function PopoverHarness() {
	return (
		<Popover.Root>
			<Popover.Trigger>Account</Popover.Trigger>
			<Popover.Content>
				<p>Popover body</p>
				<Popover.Close>Close</Popover.Close>
			</Popover.Content>
		</Popover.Root>
	);
}

describe('Popover — screen reader semantics', () => {
	it('advertises the popup on the trigger via aria-haspopup', () => {
		render(<PopoverHarness />);
		expect(screen.getByRole('button', { name: 'Account' })).toHaveAttribute('aria-haspopup', 'dialog');
	});

	it('toggles aria-expanded on the trigger as the popover opens and closes', async () => {
		render(<PopoverHarness />);
		const trigger = screen.getByRole('button', { name: 'Account' });
		expect(trigger).toHaveAttribute('aria-expanded', 'false');
		await userEvent.click(trigger);
		expect(trigger).toHaveAttribute('aria-expanded', 'true');
		await userEvent.click(trigger);
		expect(trigger).toHaveAttribute('aria-expanded', 'false');
	});

	it('points the trigger at its content via aria-controls', async () => {
		render(<PopoverHarness />);
		const trigger = screen.getByRole('button', { name: 'Account' });
		await userEvent.click(trigger);
		const dialog = screen.getByRole('dialog');
		expect(trigger.getAttribute('aria-controls')).toBe(dialog.id);
		expect(dialog.id).toBeTruthy();
	});

	it('names the content dialog by its trigger via aria-labelledby', async () => {
		render(<PopoverHarness />);
		const trigger = screen.getByRole('button', { name: 'Account' });
		await userEvent.click(trigger);
		const dialog = screen.getByRole('dialog');
		// Content sets aria-labelledby to the trigger's id, so a screen reader reads
		// the dialog's name as the trigger's label.
		expect(dialog.getAttribute('aria-labelledby')).toBe(trigger.id);
		expect(accessibleNameVia(dialog)).toBe('Account');
	});
});
