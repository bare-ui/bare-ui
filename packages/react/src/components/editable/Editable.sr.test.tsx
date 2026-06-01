/**
 * Screen-reader semantics for Editable. In read mode the preview is exposed as a
 * BUTTON whose accessible name is the current value (so the SR announces "Hello,
 * button"), and activating it swaps the read-mode button out for a named edit
 * field — the SR's focus and announcement move from "button" to "edit field".
 * These tests verify that read/edit MODE transition, the preview's name, its
 * disabled STATE, and that committing returns the user to the named button.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Editable } from './Editable';
import { expectExposedAs } from '@/test/sr';

function renderEditable(props: Partial<React.ComponentProps<typeof Editable.Root>> = {}) {
	return render(
		<Editable.Root
			defaultValue='Hello'
			placeholder='Empty'
			{...props}>
			<Editable.Preview />
			<Editable.Input aria-label='Edit name' />
			<Editable.SubmitTrigger>save</Editable.SubmitTrigger>
			<Editable.CancelTrigger>cancel</Editable.CancelTrigger>
		</Editable.Root>,
	);
}

describe('Editable — screen reader semantics', () => {
	it('exposes the read-mode preview as a button named by its value', () => {
		renderEditable();
		// The SR announces "Hello, button" and there is no edit field yet.
		expectExposedAs('button', 'Hello');
		expect(screen.queryByRole('textbox', { name: 'Edit name' })).toBeNull();
	});

	it('falls back to the placeholder as the preview name when empty', () => {
		renderEditable({ defaultValue: '' });
		expectExposedAs('button', 'Empty');
	});

	it('switches from the preview button to a named edit field on activation', async () => {
		renderEditable();
		await userEvent.click(screen.getByRole('button', { name: 'Hello' }));
		// Mode transition: the button is gone, an edit field is exposed and focused.
		expect(screen.queryByRole('button', { name: 'Hello' })).toBeNull();
		const field = expectExposedAs('textbox', 'Edit name');
		expect(field).toHaveFocus();
	});

	it('returns to a button named by the new value after committing', async () => {
		renderEditable({ submitOnBlur: false });
		await userEvent.click(screen.getByRole('button', { name: 'Hello' }));
		const field = screen.getByRole('textbox', { name: 'Edit name' });
		await userEvent.clear(field);
		await userEvent.type(field, 'World');
		await userEvent.click(screen.getByText('save'));
		expectExposedAs('button', 'World');
		expect(screen.queryByRole('textbox', { name: 'Edit name' })).toBeNull();
	});

	it('exposes the preview as disabled and keeps it out of edit mode', async () => {
		renderEditable({ disabled: true });
		const preview = screen.getByRole('button', { name: 'Hello' });
		expect(preview).toHaveAttribute('aria-disabled', 'true');
		await userEvent.click(preview);
		expect(screen.queryByRole('textbox', { name: 'Edit name' })).toBeNull();
	});
});
