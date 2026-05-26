import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import type { ToolbarRootProps } from './Toolbar.types';
import { Toolbar } from './Toolbar';

function renderToolbar(props: Partial<ToolbarRootProps> = {}) {
	return render(() => (
		<Toolbar.Root
			aria-label='Formatting'
			{...props}>
			<Toolbar.Button>Bold</Toolbar.Button>
			<Toolbar.Button>Italic</Toolbar.Button>
			<Toolbar.Separator />
			<Toolbar.Button>Underline</Toolbar.Button>
		</Toolbar.Root>
	));
}

describe('Toolbar', () => {
	it('renders a toolbar role with orientation', () => {
		renderToolbar();
		const tb = screen.getByRole('toolbar');
		expect(tb).toHaveAttribute('aria-orientation', 'horizontal');
	});

	it('makes only the first item tabbable initially', () => {
		renderToolbar();
		expect(screen.getByText('Bold')).toHaveAttribute('tabindex', '0');
		expect(screen.getByText('Italic')).toHaveAttribute('tabindex', '-1');
		expect(screen.getByText('Underline')).toHaveAttribute('tabindex', '-1');
	});

	it('moves focus with arrow keys and updates the tabbable item', async () => {
		const user = userEvent.setup();
		renderToolbar();
		screen.getByText('Bold').focus();
		await user.keyboard('{ArrowRight}');
		expect(screen.getByText('Italic')).toHaveFocus();
		expect(screen.getByText('Italic')).toHaveAttribute('tabindex', '0');
		expect(screen.getByText('Bold')).toHaveAttribute('tabindex', '-1');
	});

	it('wraps from first to last with loop enabled', async () => {
		const user = userEvent.setup();
		renderToolbar();
		screen.getByText('Bold').focus();
		await user.keyboard('{ArrowLeft}');
		expect(screen.getByText('Underline')).toHaveFocus();
	});

	it('does not wrap when loop is false', async () => {
		const user = userEvent.setup();
		renderToolbar({ loop: false });
		screen.getByText('Bold').focus();
		await user.keyboard('{ArrowLeft}');
		expect(screen.getByText('Bold')).toHaveFocus();
	});

	it('Home and End jump to the first and last items', async () => {
		const user = userEvent.setup();
		renderToolbar();
		screen.getByText('Bold').focus();
		await user.keyboard('{End}');
		expect(screen.getByText('Underline')).toHaveFocus();
		await user.keyboard('{Home}');
		expect(screen.getByText('Bold')).toHaveFocus();
	});

	it('skips disabled items during navigation', async () => {
		const user = userEvent.setup();
		render(() => (
			<Toolbar.Root aria-label='t'>
				<Toolbar.Button>One</Toolbar.Button>
				<Toolbar.Button disabled>Two</Toolbar.Button>
				<Toolbar.Button>Three</Toolbar.Button>
			</Toolbar.Root>
		));
		screen.getByText('One').focus();
		await user.keyboard('{ArrowRight}');
		expect(screen.getByText('Three')).toHaveFocus();
	});

	it('uses vertical arrow keys when orientation is vertical', async () => {
		const user = userEvent.setup();
		renderToolbar({ orientation: 'vertical' });
		screen.getByText('Bold').focus();
		await user.keyboard('{ArrowDown}');
		expect(screen.getByText('Italic')).toHaveFocus();
	});

	it('throws when Button is used outside Root', () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
		expect(() => render(() => <Toolbar.Button>x</Toolbar.Button>)).toThrow(/Toolbar.Root/);
		spy.mockRestore();
	});
});
