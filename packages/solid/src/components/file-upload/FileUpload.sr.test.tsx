/**
 * Screen-reader semantics for FileUpload. Verifies the dropzone exposes itself as
 * a named button (the visually-hidden native input stays out of the SR tree), and
 * that file-list changes / validation errors a consumer surfaces are announced via
 * a live region. Beyond axe's static check.
 */
import { describe, it, expect } from 'vitest';
import { createSignal } from 'solid-js';
import { render, screen, fireEvent } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { FileUpload } from './FileUpload';
import { expectExposedAs, expectAnnounced, liveRegionText } from '@/test/sr';

function makeFile(name: string, type = 'text/plain', size = 100) {
	return new File(['x'.repeat(size)], name, { type });
}

describe('FileUpload — screen reader semantics', () => {
	it('exposes the dropzone as a button named by its content', () => {
		render(() => (
			<FileUpload.Root>
				<FileUpload.Input />
				<FileUpload.Dropzone>Click or drag files here</FileUpload.Dropzone>
			</FileUpload.Root>
		));
		expectExposedAs('button', 'Click or drag files here');
	});

	it('keeps the native file input out of the SR tree (proxied by the dropzone)', () => {
		const { container } = render(() => (
			<FileUpload.Root>
				<FileUpload.Input />
				<FileUpload.Dropzone>Upload</FileUpload.Dropzone>
			</FileUpload.Root>
		));
		const input = container.querySelector('input[type="file"]')!;
		expect(input).toHaveAttribute('aria-hidden', 'true');
		expect(input).toHaveAttribute('tabindex', '-1');
	});

	it('announces the dropzone as disabled when the upload is disabled', () => {
		render(() => (
			<FileUpload.Root disabled>
				<FileUpload.Input />
				<FileUpload.Dropzone>Upload</FileUpload.Dropzone>
			</FileUpload.Root>
		));
		const zone = screen.getByRole('button', { name: 'Upload' });
		expect(zone).toHaveAttribute('aria-disabled', 'true');
		expect(zone).toHaveAttribute('tabindex', '-1');
	});

	it('names the trigger button for SR', () => {
		render(() => (
			<FileUpload.Root>
				<FileUpload.Input />
				<FileUpload.Trigger>Choose files</FileUpload.Trigger>
			</FileUpload.Root>
		));
		expectExposedAs('button', 'Choose files');
	});

	it('announces the added file via a status live region', async () => {
		function WithStatus() {
			const [files, setFiles] = createSignal<File[]>([]);
			return (
				<FileUpload.Root
					multiple
					value={files()}
					onChange={setFiles}>
					<FileUpload.Input data-testid='input' />
					<FileUpload.Dropzone>Upload</FileUpload.Dropzone>
					<div role='status'>
						<FileUpload.Items>{(file) => <span>{file.name} added</span>}</FileUpload.Items>
					</div>
				</FileUpload.Root>
			);
		}
		render(() => <WithStatus />);
		// Nothing to announce until a file is added.
		expect(liveRegionText()).toBe('');
		await userEvent.upload(screen.getByTestId('input') as HTMLInputElement, makeFile('report.pdf'));
		expectAnnounced('report.pdf added');
	});

	it('announces a validation error through an assertive live region', () => {
		function WithError() {
			const [error, setError] = createSignal<string | null>(null);
			return (
				<FileUpload.Root
					accept='.txt'
					multiple
					onReject={(rejected) => setError(`${rejected[0].file.name}: unsupported type`)}>
					<FileUpload.Input data-testid='input' />
					<FileUpload.Dropzone>Upload</FileUpload.Dropzone>
					<div role='alert'>{error()}</div>
				</FileUpload.Root>
			);
		}
		render(() => <WithError />);
		const input = screen.getByTestId('input') as HTMLInputElement;
		Object.defineProperty(input, 'files', {
			value: [makeFile('photo.png', 'image/png')],
			configurable: true,
		});
		expect(liveRegionText()).toBe('');
		fireEvent.change(input);
		expectAnnounced('photo.png: unsupported type');
	});
});
