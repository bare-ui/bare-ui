import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'solid-js';
import { FileUpload } from './FileUpload';

function makeFile(name: string, type = 'text/plain', size = 100) {
	return new File(['x'.repeat(size)], name, { type });
}

function renderFU(props: Partial<ComponentProps<typeof FileUpload.Root>> = {}) {
	return render(() => (
		<FileUpload.Root {...props}>
			<FileUpload.Input data-testid='input' />
			<FileUpload.Trigger>Pick</FileUpload.Trigger>
			<FileUpload.Dropzone data-testid='zone'>Drop here</FileUpload.Dropzone>
			<ul data-testid='files'>
				<FileUpload.Items>
					{(file, _i, remove) => (
						<li>
							{file.name}
							<button
								aria-label={`remove ${file.name}`}
								onClick={remove}>
								×
							</button>
						</li>
					)}
				</FileUpload.Items>
			</ul>
		</FileUpload.Root>
	));
}

describe('FileUpload', () => {
	it('adds files via the hidden input', async () => {
		const onChange = vi.fn();
		renderFU({ onChange, multiple: true });
		const input = screen.getByTestId('input') as HTMLInputElement;
		await userEvent.upload(input, [makeFile('a.txt'), makeFile('b.txt')]);
		expect(onChange).toHaveBeenCalled();
		const last = onChange.mock.calls[onChange.mock.calls.length - 1][0] as File[];
		expect(last.map((f) => f.name)).toEqual(['a.txt', 'b.txt']);
	});

	it('non-multiple replaces the prior file', async () => {
		const onChange = vi.fn();
		renderFU({ onChange, multiple: false });
		const input = screen.getByTestId('input') as HTMLInputElement;
		await userEvent.upload(input, makeFile('first.txt'));
		await userEvent.upload(input, makeFile('second.txt'));
		const last = onChange.mock.calls[onChange.mock.calls.length - 1][0] as File[];
		expect(last.map((f) => f.name)).toEqual(['second.txt']);
	});

	it('respects accept and calls onReject', () => {
		const onReject = vi.fn();
		const onChange = vi.fn();
		renderFU({ accept: '.txt', onReject, onChange, multiple: true });
		const input = screen.getByTestId('input') as HTMLInputElement;
		// fireEvent.change with a DataTransfer-style FileList — bypasses userEvent's
		// accept-attribute filtering, since we want to test our own filtering.
		Object.defineProperty(input, 'files', {
			value: [makeFile('a.txt'), makeFile('b.png', 'image/png')],
			configurable: true,
		});
		fireEvent.change(input);
		expect(onReject).toHaveBeenCalled();
		const accepted = onChange.mock.calls[onChange.mock.calls.length - 1][0] as File[];
		expect(accepted.map((f) => f.name)).toEqual(['a.txt']);
	});

	it('respects maxFiles', async () => {
		const onReject = vi.fn();
		renderFU({ maxFiles: 1, onReject, multiple: true });
		const input = screen.getByTestId('input') as HTMLInputElement;
		await userEvent.upload(input, [makeFile('a.txt'), makeFile('b.txt')]);
		const rejected = onReject.mock.calls[0][0];
		expect(rejected.some((r: { reason: string }) => r.reason === 'maxFiles')).toBe(true);
	});

	it('removes files via items render-prop', async () => {
		const onChange = vi.fn();
		renderFU({ onChange, multiple: true });
		const input = screen.getByTestId('input') as HTMLInputElement;
		await userEvent.upload(input, [makeFile('a.txt'), makeFile('b.txt')]);
		await userEvent.click(screen.getByLabelText('remove a.txt'));
		const last = onChange.mock.calls[onChange.mock.calls.length - 1][0] as File[];
		expect(last.map((f) => f.name)).toEqual(['b.txt']);
	});

	it('Dropzone toggles data-dragging on drag events', () => {
		renderFU();
		const zone = screen.getByTestId('zone');
		fireEvent.dragEnter(zone);
		expect(zone).toHaveAttribute('data-dragging', '');
		fireEvent.dragLeave(zone);
		expect(zone).not.toHaveAttribute('data-dragging');
	});
});
