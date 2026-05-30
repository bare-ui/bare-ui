import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { h, ref } from 'vue';
import { FileUpload } from '.';

const meta = {
	title: 'Forms/FileUpload',
	component: FileUpload.Root,
	subcomponents: {
		'FileUpload.Input': FileUpload.Input,
		'FileUpload.Trigger': FileUpload.Trigger,
		'FileUpload.Dropzone': FileUpload.Dropzone,
		'FileUpload.Items': FileUpload.Items,
	},
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Click-to-pick or drag-and-drop file upload with accept/maxFiles/maxSize validation.',
			},
		},
	},
} satisfies Meta<typeof FileUpload.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const dropzoneCls =
	'flex flex-col items-center justify-center gap-2 rounded-[20px] border border-dashed border-black bg-[#f5f5f5] p-8 text-center text-sm text-black cursor-pointer transition-colors hover:bg-[#e5e5e5] data-[dragging]:bg-[#e5e5e5] data-[dragging]:border-solid data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed';

const triggerCls =
	'inline-flex cursor-pointer items-center rounded-[8px] border border-black bg-black px-4 py-2 text-sm font-medium text-white hover:bg-[#333]';

function formatBytes(bytes: number) {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export const Default: Story = {
	render: () => ({
		setup: () => () =>
			h(FileUpload.Root, { multiple: true }, () => [
				h(FileUpload.Input),
				h(FileUpload.Dropzone, { class: dropzoneCls }, () => [
					h('p', { class: 'font-medium' }, 'Click or drag files here'),
					h('p', { class: 'text-xs text-[#6b7280]' }, 'Any file type accepted'),
				]),
				h('ul', { class: 'mt-3 flex flex-col gap-1 text-sm' }, [
					h(
						FileUpload.Items,
						{},
						({ file, index, remove }: { file: File; index: number; remove: () => void }) =>
							h(
								'li',
								{
									key: index,
									class: 'flex items-center justify-between rounded-[8px] border border-black bg-white px-3 py-2',
								},
								[
									h('span', { class: 'truncate text-black' }, file.name),
									h('div', { class: 'flex items-center gap-3' }, [
										h('span', { class: 'text-xs text-[#6b7280]' }, formatBytes(file.size)),
										h(
											'button',
											{
												onClick: remove,
												'aria-label': `Remove ${file.name}`,
												class: 'cursor-pointer text-sm text-black hover:underline',
											},
											'Remove',
										),
									]),
								],
							),
					),
				]),
			]),
	}),
};

export const Composed: Story = {
	render: () => ({
		setup: () => () =>
			h(
				FileUpload.Root,
				{ accept: 'image/*', maxSize: 2 * 1024 * 1024, multiple: true },
				() => [
					h(FileUpload.Input),
					h('div', { class: 'flex items-center gap-3' }, [
						h(FileUpload.Trigger, { class: triggerCls }, () => 'Choose images'),
						h('span', { class: 'text-xs text-[#6b7280]' }, 'PNG / JPG · max 2 MB each'),
					]),
					h('ul', { class: 'mt-3 flex flex-col gap-1 text-sm' }, [
						h(
							FileUpload.Items,
							{},
							({ file, index, remove }: { file: File; index: number; remove: () => void }) =>
								h(
									'li',
									{
										key: index,
										class: 'flex items-center justify-between rounded-[8px] border border-black bg-white px-3 py-2',
									},
									[
										h('span', { class: 'truncate text-black' }, file.name),
										h(
											'button',
											{ onClick: remove, class: 'text-sm text-black hover:underline' },
											'×',
										),
									],
								),
						),
					]),
				],
			),
	}),
};

export const Complex: Story = {
	render: () => ({
		setup() {
			const errors = ref<string[]>([]);
			return () =>
				h('div', { class: 'flex w-full max-w-md flex-col gap-3' }, [
					h(
						FileUpload.Root,
						{
							accept: '.pdf,.doc,.docx',
							maxFiles: 3,
							maxSize: 5 * 1024 * 1024,
							multiple: true,
							onReject: (rejected: { file: File; reason: 'maxFiles' | 'maxSize' | 'accept' }[]) => {
								const reasons = {
									maxFiles: 'too many files',
									maxSize: 'over 5 MB',
									accept: 'unsupported type',
								};
								errors.value = rejected.map((r) => `${r.file.name}: ${reasons[r.reason]}`);
							},
							onChange: () => (errors.value = []),
						},
						() => [
							h(FileUpload.Input),
							h(FileUpload.Dropzone, { class: dropzoneCls }, () => [
								h(
									'svg',
									{
										class: 'size-8 text-black',
										viewBox: '0 0 24 24',
										fill: 'none',
										stroke: 'currentColor',
										'stroke-width': 1.5,
									},
									[
										h('path', {
											'stroke-linecap': 'round',
											'stroke-linejoin': 'round',
											d: 'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 7.5m0 0L7.5 12M12 7.5v9',
										}),
									],
								),
								h('p', { class: 'font-medium' }, 'Drop documents here'),
								h(
									'p',
									{ class: 'text-xs text-[#6b7280]' },
									'PDF, DOC, DOCX · up to 3 files · 5 MB each',
								),
							]),
							h('ul', { class: 'mt-3 flex flex-col gap-1 text-sm' }, [
								h(
									FileUpload.Items,
									{},
									({
										file,
										index,
										remove,
									}: {
										file: File
										index: number
										remove: () => void
									}) =>
										h(
											'li',
											{
												key: index,
												class: 'flex items-center justify-between rounded-[8px] border border-black bg-white px-3 py-2',
											},
											[
												h('div', { class: 'flex flex-col' }, [
													h(
														'span',
														{ class: 'truncate font-medium text-black' },
														file.name,
													),
													h(
														'span',
														{ class: 'text-xs text-[#6b7280]' },
														formatBytes(file.size),
													),
												]),
												h(
													'button',
													{ onClick: remove, class: 'text-sm text-black hover:underline' },
													'×',
												),
											],
										),
								),
							]),
						],
					),
					errors.value.length > 0
						? h(
								'ul',
								{
									class: 'rounded-[8px] border border-black bg-[#f5f5f5] px-3 py-2 text-xs text-black',
								},
								errors.value.map((err, i) => h('li', { key: i }, `⚠ ${err}`)),
							)
						: null,
				]);
		},
	}),
};
