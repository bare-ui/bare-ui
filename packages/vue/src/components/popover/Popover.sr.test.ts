import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { nextTick } from 'vue';
import { accessibleNameVia } from '@/test/sr';
import { Popover } from '.';

const { Root: PopoverRoot, Trigger: PopoverTrigger, Content: PopoverContent, Close: PopoverClose } = Popover;

function renderHarness() {
	return render({
		template: `
			<PopoverRoot>
				<PopoverTrigger>Account</PopoverTrigger>
				<PopoverContent>
					<p>Popover body</p>
					<PopoverClose>Close</PopoverClose>
				</PopoverContent>
			</PopoverRoot>
		`,
		components: { PopoverRoot, PopoverTrigger, PopoverContent, PopoverClose },
	});
}

describe('Popover — screen reader semantics', () => {
	it('advertises the popup on the trigger via aria-haspopup', () => {
		renderHarness();
		expect(screen.getByRole('button', { name: 'Account' })).toHaveAttribute('aria-haspopup', 'dialog');
	});

	it('toggles aria-expanded on the trigger as the popover opens and closes', async () => {
		renderHarness();
		const trigger = screen.getByRole('button', { name: 'Account' });
		expect(trigger).toHaveAttribute('aria-expanded', 'false');
		await userEvent.click(trigger);
		expect(trigger).toHaveAttribute('aria-expanded', 'true');
		await userEvent.click(trigger);
		expect(trigger).toHaveAttribute('aria-expanded', 'false');
	});

	it('points the trigger at its content via aria-controls', async () => {
		renderHarness();
		const trigger = screen.getByRole('button', { name: 'Account' });
		await userEvent.click(trigger);
		const dialog = screen.getByRole('dialog');
		expect(trigger.getAttribute('aria-controls')).toBe(dialog.id);
		expect(dialog.id).toBeTruthy();
	});

	it('names the content dialog by its trigger via aria-labelledby', async () => {
		renderHarness();
		const trigger = screen.getByRole('button', { name: 'Account' });
		await userEvent.click(trigger);
		const dialog = screen.getByRole('dialog');
		// Content sets aria-labelledby to the trigger's id, so a screen reader reads
		// the dialog's name as the trigger's label.
		expect(dialog.getAttribute('aria-labelledby')).toBe(trigger.id);
		expect(accessibleNameVia(dialog)).toBe('Account');
	});
});

describe('Popover — focus management', () => {
	it('moves focus into the dialog on open', async () => {
		renderHarness();
		const trigger = screen.getByRole('button', { name: 'Account' });
		await userEvent.click(trigger);
		await nextTick();
		await nextTick();
		// Focus should have left the trigger and moved into the dialog.
		const dialog = screen.getByRole('dialog');
		expect(trigger).not.toHaveFocus();
		expect(dialog === document.activeElement || dialog.contains(document.activeElement)).toBe(true);
	});

	it('restores focus to the trigger on close', async () => {
		renderHarness();
		const trigger = screen.getByRole('button', { name: 'Account' });
		await userEvent.click(trigger);
		await nextTick();
		await nextTick();
		// Close via the Close button inside the popover.
		await userEvent.click(screen.getByRole('button', { name: 'Close' }));
		await nextTick();
		expect(screen.queryByRole('dialog')).toBeNull();
		expect(trigger).toHaveFocus();
	});

	it('Tab exits the popover without closing it (non-modal — trap: false)', async () => {
		renderHarness();
		const trigger = screen.getByRole('button', { name: 'Account' });
		await userEvent.click(trigger);
		await nextTick();
		// Popover is a non-modal dialog; Tab should NOT cycle focus inside it.
		// The dialog should still be present after Tab.
		await userEvent.keyboard('{Tab}');
		expect(screen.getByRole('dialog')).toBeInTheDocument();
	});
});
