import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { h, nextTick } from 'vue';
import { Toolbar } from '.';

function renderToolbar(rootProps: Record<string, unknown> = {}) {
	return render({
		setup() {
			return () =>
				h(Toolbar.Root, { 'aria-label': 'Formatting', ...rootProps }, () => [
					h(Toolbar.Button, null, () => 'Bold'),
					h(Toolbar.Button, null, () => 'Italic'),
					h(Toolbar.Separator),
					h(Toolbar.Button, null, () => 'Underline'),
				]);
		},
	});
}

describe('Toolbar', () => {
	it('renders a toolbar role with orientation', () => {
		renderToolbar();
		const tb = screen.getByRole('toolbar');
		expect(tb).toHaveAttribute('aria-orientation', 'horizontal');
	});

	it('makes only the first item tabbable initially', async () => {
		renderToolbar();
		// Vue batches DOM updates; wait one tick for the roving-tabindex
		// registration (onMounted) to flush into the DOM.
		await nextTick();
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
		render({
			setup() {
				return () =>
					h(Toolbar.Root, { 'aria-label': 't' }, () => [
						h(Toolbar.Button, null, () => 'One'),
						h(Toolbar.Button, { disabled: true }, () => 'Two'),
						h(Toolbar.Button, null, () => 'Three'),
					]);
			},
		});
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
		expect(() =>
			render({
				setup() {
					return () => h(Toolbar.Button, null, () => 'x');
				},
			}),
		).toThrow(/Toolbar\.Root/);
		spy.mockRestore();
	});

	it('Separator has perpendicular orientation to horizontal toolbar', () => {
		render({
			setup() {
				return () =>
					h(Toolbar.Root, { 'aria-label': 'sep-test' }, () => [
						h(Toolbar.Separator),
					]);
			},
		});
		const sep = screen.getByRole('separator');
		expect(sep).toHaveAttribute('aria-orientation', 'vertical');
		expect(sep).toHaveAttribute('data-orientation', 'vertical');
	});

	it('Separator has perpendicular orientation to vertical toolbar', () => {
		render({
			setup() {
				return () =>
					h(Toolbar.Root, { orientation: 'vertical', 'aria-label': 'sep-test' }, () => [
						h(Toolbar.Separator),
					]);
			},
		});
		const sep = screen.getByRole('separator');
		expect(sep).toHaveAttribute('aria-orientation', 'horizontal');
	});

	it('Root has data-orientation attribute', () => {
		render({
			setup() {
				return () => h(Toolbar.Root, { 'data-testid': 'root', orientation: 'vertical', 'aria-label': 't' });
			},
		});
		expect(screen.getByTestId('root')).toHaveAttribute('data-orientation', 'vertical');
	});

	it('Button items have data-toolbar-item attribute', () => {
		renderToolbar();
		const bold = screen.getByText('Bold');
		expect(bold).toHaveAttribute('data-toolbar-item');
	});
});
