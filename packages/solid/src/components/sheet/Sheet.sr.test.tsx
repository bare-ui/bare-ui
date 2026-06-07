import { describe, it, expect } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { accessibleNameVia } from '@/test/sr';
import { Sheet } from './Sheet';

/**
 * Sheet wires the dialog name/description itself: Sheet.Title sets the id that
 * Content references via aria-labelledby, and Sheet.Description the id for
 * aria-describedby. The Trigger advertises the popup via aria-haspopup/expanded.
 */
function SheetHarness() {
	return (
		<Sheet.Root snapPoints={[0.4]}>
			<Sheet.Trigger>Open</Sheet.Trigger>
			<Sheet.Portal>
				<Sheet.Overlay />
				<Sheet.Content>
					<Sheet.Handle />
					<Sheet.Title>Settings</Sheet.Title>
					<Sheet.Description>Adjust your preferences</Sheet.Description>
					<Sheet.Close>Done</Sheet.Close>
				</Sheet.Content>
			</Sheet.Portal>
		</Sheet.Root>
	);
}

describe('Sheet — screen reader semantics', () => {
	it('advertises the dialog on the trigger via aria-haspopup and aria-expanded', async () => {
		render(() => <SheetHarness />);
		const trigger = screen.getByRole('button', { name: 'Open' });
		expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
		expect(trigger).toHaveAttribute('aria-expanded', 'false');
		await userEvent.click(trigger);
		expect(trigger).toHaveAttribute('aria-expanded', 'true');
	});

	it('exposes the content as an aria-modal dialog', async () => {
		render(() => <SheetHarness />);
		await userEvent.click(screen.getByRole('button', { name: 'Open' }));
		const dialog = screen.getByRole('dialog');
		expect(dialog).toHaveAttribute('aria-modal', 'true');
	});

	it('names the dialog by its Title via aria-labelledby', async () => {
		render(() => <SheetHarness />);
		await userEvent.click(screen.getByRole('button', { name: 'Open' }));
		const dialog = screen.getByRole('dialog');
		expect(accessibleNameVia(dialog)).toBe('Settings');
	});

	it('describes the dialog by its Description via aria-describedby', async () => {
		render(() => <SheetHarness />);
		await userEvent.click(screen.getByRole('button', { name: 'Open' }));
		const dialog = screen.getByRole('dialog');
		const describedby = dialog.getAttribute('aria-describedby');
		expect(describedby).toBeTruthy();
		expect(document.getElementById(describedby!)?.textContent).toBe('Adjust your preferences');
	});

	it('moves focus into the dialog on open', async () => {
		render(() => <SheetHarness />);
		const trigger = screen.getByRole('button', { name: 'Open' });
		await userEvent.click(trigger);
		const dialog = screen.getByRole('dialog');
		// jsdom has no layout, so the focus trap focuses the dialog container itself;
		// in a real browser it lands on the first focusable child. Either way focus
		// has left the trigger and is on/inside the dialog.
		expect(trigger).not.toHaveFocus();
		expect(dialog === document.activeElement || dialog.contains(document.activeElement)).toBe(true);
	});

	it('restores focus to the trigger on close', async () => {
		render(() => <SheetHarness />);
		const trigger = screen.getByRole('button', { name: 'Open' });
		await userEvent.click(trigger);
		await userEvent.click(screen.getByRole('button', { name: 'Done' }));
		expect(screen.queryByRole('dialog')).toBeNull();
		expect(trigger).toHaveFocus();
	});

	it('Escape closes the dialog and restores focus to the trigger', async () => {
		render(() => <SheetHarness />);
		const trigger = screen.getByRole('button', { name: 'Open' });
		await userEvent.click(trigger);
		expect(screen.getByRole('dialog')).toBeInTheDocument();
		await userEvent.keyboard('{Escape}');
		expect(screen.queryByRole('dialog')).toBeNull();
		expect(trigger).toHaveFocus();
	});
});
