import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { createSignal, For } from 'solid-js';
import { Select } from './Select';

const meta = {
	title: 'Forms/Select',
	component: Select.Root,
	subcomponents: {
		'Select.Trigger': Select.Trigger,
		'Select.Value': Select.Value,
		'Select.Content': Select.Content,
		'Select.Item': Select.Item,
		'Select.Separator': Select.Separator,
		'Select.Group': Select.Group,
		'Select.GroupLabel': Select.GroupLabel,
	},
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component: 'Custom select dropdown with keyboard navigation and groups.',
			},
		},
	},
} satisfies Meta<typeof Select.Root>;

export default meta;

const frameworks = ['React', 'Vue', 'Angular', 'Svelte', 'Solid'];

const triggerCls =
	'flex w-full items-center justify-between gap-2 rounded-[8px] border border-black bg-white px-3 py-2 text-sm text-black outline-none transition data-[state=open]:ring-2 data-[state=open]:ring-black data-[state=open]:ring-offset-1 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[hover]:bg-[#f5f5f5]';

const contentCls = 'absolute z-50 mt-1 w-full overflow-hidden rounded-[20px] border border-black bg-white py-1';

const itemCls =
	'flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-black outline-none transition data-[hover]:bg-[#f5f5f5] data-[selected]:font-medium data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40';

const ChevronIcon = () => (
	<svg
		class='size-4 shrink-0 text-[#6b7280] transition-transform data-[state=open]:rotate-180'
		viewBox='0 0 20 20'
		fill='currentColor'>
		<path
			fill-rule='evenodd'
			d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
			clip-rule='evenodd'
		/>
	</svg>
);

const CheckIcon = () => (
	<svg
		class='size-4'
		viewBox='0 0 20 20'
		fill='currentColor'>
		<path
			fill-rule='evenodd'
			d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
			clip-rule='evenodd'
		/>
	</svg>
);

export const Default: StoryObj = {
	render: () => {
		const [value, setValue] = createSignal('');

		return (
			<div class='w-64'>
				<Select.Root
					value={value()}
					onChange={setValue}>
					<div class='relative'>
						<Select.Trigger class={triggerCls}>
							<Select.Value
								placeholder='Select a framework'
								class='data-[placeholder]:text-[#6b7280]'
							/>
							<ChevronIcon />
						</Select.Trigger>
						<Select.Content class={contentCls}>
							<For each={frameworks}>
								{(fw) => (
									<Select.Item
										value={fw.toLowerCase()}
										class={itemCls}>
										<span class='flex-1'>{fw}</span>
									</Select.Item>
								)}
							</For>
						</Select.Content>
					</div>
				</Select.Root>
			</div>
		);
	},
};

export const Composed: StoryObj = {
	render: () => {
		const [value, setValue] = createSignal('');

		return (
			<div class='w-64'>
				<Select.Root
					value={value()}
					onChange={setValue}>
					<div class='relative'>
						<Select.Trigger class={triggerCls}>
							<Select.Value
								placeholder='Select a framework'
								class='data-[placeholder]:text-[#6b7280]'
							/>
							<ChevronIcon />
						</Select.Trigger>
						<Select.Content class={contentCls}>
							<For each={frameworks}>
								{(fw) => (
									<Select.Item
										value={fw.toLowerCase()}
										class={itemCls}>
										<span class='flex-1'>{fw}</span>
										<span class='invisible text-black data-[selected]:visible'>
											<CheckIcon />
										</span>
									</Select.Item>
								)}
							</For>
						</Select.Content>
					</div>
				</Select.Root>
			</div>
		);
	},
};

export const Complex: StoryObj = {
	render: () => {
		const [value, setValue] = createSignal('');

		return (
			<div class='w-64'>
				<Select.Root
					value={value()}
					onChange={setValue}>
					<div class='relative'>
						<Select.Trigger class={triggerCls}>
							<Select.Value
								placeholder='Select a framework'
								class='data-[placeholder]:text-[#6b7280]'
							/>
							<ChevronIcon />
						</Select.Trigger>
						<Select.Content class={contentCls}>
							<Select.Group>
								<Select.GroupLabel class='px-3 py-1.5 text-xs font-semibold text-[#6b7280]'>
									Frontend
								</Select.GroupLabel>
								<Select.Item
									value='react'
									class={itemCls}>
									<span class='flex-1'>React</span>
									<span class='invisible text-black data-[selected]:visible'>
										<CheckIcon />
									</span>
								</Select.Item>
								<Select.Item
									value='vue'
									class={itemCls}>
									<span class='flex-1'>Vue</span>
									<span class='invisible text-black data-[selected]:visible'>
										<CheckIcon />
									</span>
								</Select.Item>
								<Select.Item
									value='angular'
									class={itemCls}>
									<span class='flex-1'>Angular</span>
									<span class='invisible text-black data-[selected]:visible'>
										<CheckIcon />
									</span>
								</Select.Item>
							</Select.Group>
							<Select.Separator class='my-1 h-px bg-black' />
							<Select.Group>
								<Select.GroupLabel class='px-3 py-1.5 text-xs font-semibold text-[#6b7280]'>
									Other
								</Select.GroupLabel>
								<Select.Item
									value='svelte'
									class={itemCls}>
									<span class='flex-1'>Svelte</span>
									<span class='invisible text-black data-[selected]:visible'>
										<CheckIcon />
									</span>
								</Select.Item>
								<Select.Item
									value='solid'
									disabled
									class={itemCls}>
									<span class='flex-1'>Solid</span>
									<span class='invisible text-black data-[selected]:visible'>
										<CheckIcon />
									</span>
								</Select.Item>
							</Select.Group>
						</Select.Content>
					</div>
				</Select.Root>
			</div>
		);
	},
};
