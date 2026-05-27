import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { h } from 'vue';
import { Popover } from '.';

function renderPopover(props: Record<string, unknown> = {}) {
	return render({
		setup() {
			return () =>
				h(Popover.Root, props, () => [
					h(Popover.Trigger, null, () => 'Open'),
					h(Popover.Content, null, () => [
						h('p', null, 'Popover body'),
						h(Popover.Close, null, () => 'Close'),
					]),
				]);
		},
	});
}

describe('Popover', () => {
	it('starts closed by default', () => {
		renderPopover();
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Open' })).toHaveAttribute('aria-expanded', 'false');
	});

	it('opens on trigger click and shows content with role=dialog', async () => {
		renderPopover();
		await userEvent.click(screen.getByRole('button', { name: 'Open' }));
		expect(screen.getByRole('dialog')).toBeInTheDocument();
		expect(screen.getByText('Popover body')).toBeInTheDocument();
	});

	it('closes when Popover.Close is clicked', async () => {
		renderPopover();
		await userEvent.click(screen.getByRole('button', { name: 'Open' }));
		await userEvent.click(screen.getByRole('button', { name: 'Close' }));
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	it('closes on Escape', async () => {
		renderPopover();
		await userEvent.click(screen.getByRole('button', { name: 'Open' }));
		await userEvent.keyboard('{Escape}');
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	it('controlled mode reflects open prop and calls onOpenChange', async () => {
		const onOpenChange = vi.fn();
		render({
			setup() {
				return () =>
					h(Popover.Root, { open: true, onOpenChange }, () => [
						h(Popover.Trigger, null, () => 'Open'),
						h(Popover.Content, null, () => 'Body'),
					]);
			},
		});
		expect(screen.getByRole('dialog')).toBeInTheDocument();
		await userEvent.click(screen.getByRole('button', { name: 'Open' }));
		expect(onOpenChange).toHaveBeenCalledWith(false);
	});

	it('Content gets data-side and data-align', () => {
		render({
			setup() {
				return () =>
					h(Popover.Root, { defaultOpen: true }, () => [
						h(Popover.Trigger, null, () => 'Open'),
						h(Popover.Content, { side: 'right', align: 'start' }, () => 'Body'),
					]);
			},
		});
		const dialog = screen.getByRole('dialog');
		expect(dialog).toHaveAttribute('data-side', 'right');
		expect(dialog).toHaveAttribute('data-align', 'start');
	});

	it('forwards consumer onClick exactly once and class to the trigger', async () => {
		const onClick = vi.fn();
		render({
			setup() {
				return () =>
					h(Popover.Root, null, () => [
						h(Popover.Trigger, { onClick, class: 'trg' }, () => 'Open'),
						h(Popover.Content, null, () => 'Body'),
					]);
			},
		});
		const trigger = screen.getByRole('button', { name: 'Open' });
		expect(trigger).toHaveClass('trg');
		await userEvent.click(trigger);
		expect(onClick).toHaveBeenCalledTimes(1);
	});
});
