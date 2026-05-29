import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { createSignal, For, Show } from 'solid-js';
import { FileUpload } from './FileUpload';

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
				component: 'Click-to-pick or drag-and-drop file upload with accept/maxFiles/maxSize validation.',
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
	render: () => (
		<FileUpload.Root multiple>
			<FileUpload.Input />
			<FileUpload.Dropzone class={dropzoneCls}>
				<p class='font-medium'>Click or drag files here</p>
				<p class='text-xs text-[#6b7280]'>Any file type accepted</p>
			</FileUpload.Dropzone>
			<ul class='mt-3 flex flex-col gap-1 text-sm'>
				<FileUpload.Items>
					{(file, _i, remove) => (
						<li class='flex items-center justify-between rounded-[8px] border border-black bg-white px-3 py-2'>
							<span class='truncate text-black'>{file.name}</span>
							<div class='flex items-center gap-3'>
								<span class='text-xs text-[#6b7280]'>{formatBytes(file.size)}</span>
								<button
									onClick={remove}
									aria-label={`Remove ${file.name}`}
									class='cursor-pointer text-sm text-black hover:underline'>
									Remove
								</button>
							</div>
						</li>
					)}
				</FileUpload.Items>
			</ul>
		</FileUpload.Root>
	),
};

export const Composed: Story = {
	render: () => (
		<FileUpload.Root
			accept='image/*'
			maxSize={2 * 1024 * 1024}
			multiple>
			<FileUpload.Input />
			<div class='flex items-center gap-3'>
				<FileUpload.Trigger class={triggerCls}>Choose images</FileUpload.Trigger>
				<span class='text-xs text-[#6b7280]'>PNG / JPG · max 2 MB each</span>
			</div>
			<ul class='mt-3 flex flex-col gap-1 text-sm'>
				<FileUpload.Items>
					{(file, _i, remove) => (
						<li class='flex items-center justify-between rounded-[8px] border border-black bg-white px-3 py-2'>
							<span class='truncate text-black'>{file.name}</span>
							<button
								onClick={remove}
								class='text-sm text-black hover:underline'>
								×
							</button>
						</li>
					)}
				</FileUpload.Items>
			</ul>
		</FileUpload.Root>
	),
};

export const Complex: Story = {
	render: () => {
		const [errors, setErrors] = createSignal<string[]>([]);
		return (
			<div class='flex w-full max-w-md flex-col gap-3'>
				<FileUpload.Root
					accept='.pdf,.doc,.docx'
					maxFiles={3}
					maxSize={5 * 1024 * 1024}
					multiple
					onReject={(rejected) =>
						setErrors(
							rejected.map((r) => {
								const reasons = { maxFiles: 'too many files', maxSize: 'over 5 MB', accept: 'unsupported type' };
								return `${r.file.name}: ${reasons[r.reason]}`;
							}),
						)
					}
					onChange={() => setErrors([])}>
					<FileUpload.Input />
					<FileUpload.Dropzone class={dropzoneCls}>
						<svg
							class='size-8 text-black'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							stroke-width='1.5'>
							<path
								stroke-linecap='round'
								stroke-linejoin='round'
								d='M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 7.5m0 0L7.5 12M12 7.5v9'
							/>
						</svg>
						<p class='font-medium'>Drop documents here</p>
						<p class='text-xs text-[#6b7280]'>PDF, DOC, DOCX · up to 3 files · 5 MB each</p>
					</FileUpload.Dropzone>
					<ul class='mt-3 flex flex-col gap-1 text-sm'>
						<FileUpload.Items>
							{(file, _i, remove) => (
								<li class='flex items-center justify-between rounded-[8px] border border-black bg-white px-3 py-2'>
									<div class='flex flex-col'>
										<span class='truncate font-medium text-black'>{file.name}</span>
										<span class='text-xs text-[#6b7280]'>{formatBytes(file.size)}</span>
									</div>
									<button
										onClick={remove}
										class='text-sm text-black hover:underline'>
										×
									</button>
								</li>
							)}
						</FileUpload.Items>
					</ul>
				</FileUpload.Root>
				<Show when={errors().length > 0}>
					<ul class='rounded-[8px] border border-black bg-[#f5f5f5] px-3 py-2 text-xs text-black'>
						<For each={errors()}>{(err) => <li>⚠ {err}</li>}</For>
					</ul>
				</Show>
			</div>
		);
	},
};
