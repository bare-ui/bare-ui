/**
 * Screen-reader semantics for FileUpload. Verifies the dropzone exposes itself as
 * a named button (the visually-hidden native input stays out of the SR tree), and
 * that file-list changes / validation errors a consumer surfaces are announced via
 * a live region. Beyond axe's static check.
 */
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { ref, nextTick } from 'vue';
import { expectExposedAs, expectAnnounced, liveRegionText } from '@/test/sr';
import { FileUpload } from '.';

const {
	Root: FileUploadRoot,
	Input: FileUploadInput,
	Trigger: FileUploadTrigger,
	Dropzone: FileUploadDropzone,
	Items: FileUploadItems,
} = FileUpload;

function makeFile(name: string, type = 'text/plain', size = 100) {
	return new File(['x'.repeat(size)], name, { type });
}

describe('FileUpload — screen reader semantics', () => {
	it('exposes the dropzone as a button named by its content', () => {
		render({
			template: `
				<FileUploadRoot>
					<FileUploadInput />
					<FileUploadDropzone>Click or drag files here</FileUploadDropzone>
				</FileUploadRoot>
			`,
			components: { FileUploadRoot, FileUploadInput, FileUploadDropzone },
		});
		expectExposedAs('button', 'Click or drag files here');
	});

	it('keeps the native file input out of the SR tree (proxied by the dropzone)', () => {
		const { container } = render({
			template: `
				<FileUploadRoot>
					<FileUploadInput />
					<FileUploadDropzone>Upload</FileUploadDropzone>
				</FileUploadRoot>
			`,
			components: { FileUploadRoot, FileUploadInput, FileUploadDropzone },
		});
		const input = container.querySelector('input[type="file"]')!;
		expect(input).toHaveAttribute('aria-hidden', 'true');
		expect(input).toHaveAttribute('tabindex', '-1');
	});

	it('announces the dropzone as disabled when the upload is disabled', () => {
		render({
			template: `
				<FileUploadRoot :disabled="true">
					<FileUploadInput />
					<FileUploadDropzone>Upload</FileUploadDropzone>
				</FileUploadRoot>
			`,
			components: { FileUploadRoot, FileUploadInput, FileUploadDropzone },
		});
		const zone = screen.getByRole('button', { name: 'Upload' });
		expect(zone).toHaveAttribute('aria-disabled', 'true');
		expect(zone).toHaveAttribute('tabindex', '-1');
	});

	it('names the trigger button for SR', () => {
		render({
			template: `
				<FileUploadRoot>
					<FileUploadInput />
					<FileUploadTrigger>Choose files</FileUploadTrigger>
				</FileUploadRoot>
			`,
			components: { FileUploadRoot, FileUploadInput, FileUploadTrigger },
		});
		expectExposedAs('button', 'Choose files');
	});

	it('announces the added file via a status live region', async () => {
		render({
			template: `
				<FileUploadRoot :multiple="true" :value="files" :onChange="onChangeFiles">
					<FileUploadInput data-testid="input" />
					<FileUploadDropzone>Upload</FileUploadDropzone>
					<div role="status">
						<FileUploadItems v-slot="{ file }">
							<span>{{ file.name }} added</span>
						</FileUploadItems>
					</div>
				</FileUploadRoot>
			`,
			components: { FileUploadRoot, FileUploadInput, FileUploadDropzone, FileUploadItems },
			setup() {
				const files = ref<File[]>([]);
				function onChangeFiles(updated: File[]) {
					files.value = updated;
				}
				return { files, onChangeFiles };
			},
		});

		expect(liveRegionText()).toBe('');
		await userEvent.upload(screen.getByTestId('input') as HTMLInputElement, makeFile('report.pdf'));
		expectAnnounced('report.pdf added');
	});

	it('announces a validation error through an assertive live region', async () => {
		render({
			template: `
				<FileUploadRoot accept=".txt" :multiple="true" :onReject="onReject">
					<FileUploadInput data-testid="input" />
					<FileUploadDropzone>Upload</FileUploadDropzone>
					<div role="alert">{{ error }}</div>
				</FileUploadRoot>
			`,
			components: { FileUploadRoot, FileUploadInput, FileUploadDropzone },
			setup() {
				const error = ref<string | null>(null);
				function onReject(rejected: { file: File; reason: string }[]) {
					error.value = `${rejected[0].file.name}: unsupported type`;
				}
				return { error, onReject };
			},
		});

		const input = screen.getByTestId('input') as HTMLInputElement;
		Object.defineProperty(input, 'files', {
			value: [makeFile('photo.png', 'image/png')],
			configurable: true,
		});
		expect(liveRegionText()).toBe('');
		fireEvent.change(input);
		await nextTick();
		expectAnnounced('photo.png: unsupported type');
	});
});
