import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { expectExposedAs } from '@/test/sr';
import type { ToolbarRootProps } from './Toolbar.types';
import { Toolbar } from './Toolbar';

function renderToolbar(props: Partial<ToolbarRootProps> = {}) {
	return render(() => (
		<Toolbar.Root
			aria-label='Text formatting'
			{...props}>
			<Toolbar.Toggle aria-label='Bold'>
				<b>B</b>
			</Toolbar.Toggle>
			<Toolbar.Toggle
				aria-label='Italic'
				defaultPressed>
				<i>I</i>
			</Toolbar.Toggle>
			<Toolbar.Separator />
			<Toolbar.Button aria-label='Align left'>⬅</Toolbar.Button>
			<Toolbar.Link href='#'>Help</Toolbar.Link>
		</Toolbar.Root>
	));
}

describe('Toolbar — screen reader semantics', () => {
	it('exposes the group as a toolbar with its accessible name and orientation', () => {
		renderToolbar();
		const tb = expectExposedAs('toolbar', 'Text formatting');
		// A screen reader announces "Text formatting, toolbar".
		expect(tb).toHaveAttribute('aria-orientation', 'horizontal');
	});

	it('groups its controls — buttons, toggles and a link — inside the toolbar', () => {
		renderToolbar();
		const tb = screen.getByRole('toolbar');
		expectExposedAs('button', 'Align left', {}, tb);
		expectExposedAs('button', 'Bold', { pressed: false }, tb);
		expectExposedAs('link', 'Help', {}, tb);
	});

	it('exposes a toggle as a pressable button with its pressed state', () => {
		renderToolbar();
		// Off announces "Bold, toggle button, not pressed".
		expectExposedAs('button', 'Bold', { pressed: false });
		// On announces "Italic, toggle button, pressed".
		expectExposedAs('button', 'Italic', { pressed: true });
	});

	it('announces the pressed state transition when a toggle is activated', async () => {
		renderToolbar();
		const bold = screen.getByRole('button', { name: 'Bold' });
		expect(bold).toHaveAttribute('aria-pressed', 'false');
		await userEvent.click(bold);
		expect(bold).toHaveAttribute('aria-pressed', 'true');
		await userEvent.click(bold);
		expect(bold).toHaveAttribute('aria-pressed', 'false');
	});

	it('does not expose a plain button as a toggle (no pressed state)', () => {
		renderToolbar();
		const align = screen.getByRole('button', { name: 'Align left' });
		expect(align).not.toHaveAttribute('aria-pressed');
	});

	it('exposes the separator with its perpendicular orientation', () => {
		renderToolbar();
		const sep = within(screen.getByRole('toolbar')).getByRole('separator');
		expect(sep).toHaveAttribute('aria-orientation', 'vertical');
	});
});
