import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'solid-js';
import { Sheet } from './Sheet';

function renderSheet(rootProps: Partial<ComponentProps<typeof Sheet.Root>> = {}) {
	return render(() => (
		<Sheet.Root
			defaultOpen
			snapPoints={[0.3, 0.9]}
			{...rootProps}>
			<Sheet.Portal>
				<Sheet.Overlay data-testid='overlay' />
				<Sheet.Content data-testid='content'>
					<Sheet.Handle data-testid='handle' />
					<Sheet.Title>Settings</Sheet.Title>
					<Sheet.Description>Adjust your preferences</Sheet.Description>
					<Sheet.Close>Done</Sheet.Close>
				</Sheet.Content>
			</Sheet.Portal>
		</Sheet.Root>
	));
}

describe('Sheet', () => {
	it('opens from a trigger', async () => {
		const user = userEvent.setup();
		render(() => (
			<Sheet.Root>
				<Sheet.Trigger>Open</Sheet.Trigger>
				<Sheet.Portal>
					<Sheet.Content data-testid='content'>hi</Sheet.Content>
				</Sheet.Portal>
			</Sheet.Root>
		));
		expect(screen.queryByTestId('content')).toBeNull();
		await user.click(screen.getByText('Open'));
		expect(screen.getByTestId('content')).toBeInTheDocument();
	});

	it('renders an accessible dialog with side + state', () => {
		renderSheet();
		const content = screen.getByTestId('content');
		expect(content).toHaveAttribute('role', 'dialog');
		expect(content).toHaveAttribute('aria-modal', 'true');
		expect(content).toHaveAttribute('data-side', 'bottom');
		expect(content).toHaveAttribute('data-state', 'open');
		expect(content).toHaveAttribute('aria-labelledby', screen.getByText('Settings').id);
		expect(content).toHaveAttribute('aria-describedby', screen.getByText('Adjust your preferences').id);
	});

	it('positions the content at the active snap offset', () => {
		renderSheet({ defaultActiveSnapPoint: 0 });
		// viewport 768: sizes [230.4, 691.2], maxSize 691.2, offset for snap 0 = 460.8
		expect(screen.getByTestId('content').style.transform).toBe('translateY(460.8px)');
	});

	it('is fully open (offset 0) at the largest snap', () => {
		renderSheet({ defaultActiveSnapPoint: 1 });
		expect(screen.getByTestId('content').style.transform).toBe('translateY(0px)');
	});

	it('closes via the Close button', async () => {
		const user = userEvent.setup();
		const onOpenChange = vi.fn();
		renderSheet({ onOpenChange });
		await user.click(screen.getByText('Done'));
		expect(onOpenChange).toHaveBeenCalledWith(false);
	});

	it('closes when the overlay is clicked', async () => {
		const user = userEvent.setup();
		const onOpenChange = vi.fn();
		renderSheet({ onOpenChange });
		await user.click(screen.getByTestId('overlay'));
		expect(onOpenChange).toHaveBeenCalledWith(false);
	});

	it('does not close on overlay click when not dismissible', async () => {
		const user = userEvent.setup();
		const onOpenChange = vi.fn();
		renderSheet({ onOpenChange, dismissible: false });
		await user.click(screen.getByTestId('overlay'));
		expect(onOpenChange).not.toHaveBeenCalled();
	});

	it('snaps to the nearest point after a drag', () => {
		const onActiveSnapPointChange = vi.fn();
		renderSheet({ defaultActiveSnapPoint: 1, onActiveSnapPointChange });
		const handle = screen.getByTestId('handle');
		fireEvent.pointerDown(handle, { clientX: 0, clientY: 0 });
		fireEvent.pointerMove(handle, { clientX: 0, clientY: 300 });
		fireEvent.pointerUp(handle, { clientX: 0, clientY: 300 });
		// 300 is nearer to snap-0 (offset 460.8) than snap-1 (offset 0)
		expect(onActiveSnapPointChange).toHaveBeenCalledWith(0);
	});

	it('closes when dragged past the smallest snap', () => {
		const onOpenChange = vi.fn();
		renderSheet({ defaultActiveSnapPoint: 1, onOpenChange });
		const handle = screen.getByTestId('handle');
		fireEvent.pointerDown(handle, { clientX: 0, clientY: 0 });
		fireEvent.pointerMove(handle, { clientX: 0, clientY: 650 });
		fireEvent.pointerUp(handle, { clientX: 0, clientY: 650 });
		expect(onOpenChange).toHaveBeenCalledWith(false);
	});

	it('supports a top sheet', () => {
		render(() => (
			<Sheet.Root
				defaultOpen
				side='top'
				snapPoints={[0.5]}>
				<Sheet.Portal>
					<Sheet.Content data-testid='content'>hi</Sheet.Content>
				</Sheet.Portal>
			</Sheet.Root>
		));
		const content = screen.getByTestId('content');
		expect(content).toHaveAttribute('data-side', 'top');
		// fully open at its single snap -> offset 0
		expect(content.style.transform).toBe('translateY(0px)');
	});

	it('throws when Content is used outside Root', () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
		expect(() => render(() => <Sheet.Content />)).toThrow(/Sheet.Root/);
		spy.mockRestore();
	});
});
