import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { createSignal } from 'solid-js';
import { Command } from './Command';

const meta = {
	title: 'Overlays/Command',
	component: Command.Root,
	subcomponents: {
		'Command.Input': Command.Input,
		'Command.List': Command.List,
		'Command.Group': Command.Group,
		'Command.Item': Command.Item,
		'Command.Separator': Command.Separator,
		'Command.Empty': Command.Empty,
	},
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'A command palette (cmdk/kbar-style): grouped, filterable actions with keyboard navigation and an optional global hotkey. Distinct from Combobox — it selects actions, not form values.',
			},
		},
	},
} satisfies Meta<typeof Command.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const paletteCls = 'w-full max-w-md overflow-hidden rounded-xl border border-[#e5e7eb] bg-white shadow-xl';
const inputCls =
	'w-full border-b border-[#e5e7eb] px-4 py-3 text-sm text-black outline-none placeholder:text-[#9ca3af]';
const listCls = 'max-h-72 overflow-auto p-2';
const headingCls = 'px-2 py-1.5 text-xs font-medium text-[#9ca3af]';
const itemCls =
	'flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-black data-[active]:bg-[#f3f4f6] data-[disabled]:opacity-40';

export const Default: Story = {
	render: () => (
		<Command.Root class={paletteCls}>
			<Command.Input
				placeholder='Type a command or search…'
				class={inputCls}
			/>
			<Command.List class={listCls}>
				<Command.Empty class='py-6 text-center text-sm text-[#9ca3af]'>No results found.</Command.Empty>
				<Command.Item
					value='New File'
					keywords={['create', 'document']}
					class={itemCls}>
					📄 New File
				</Command.Item>
				<Command.Item
					value='Search Docs'
					keywords={['find', 'help']}
					class={itemCls}>
					🔍 Search Docs
				</Command.Item>
				<Command.Item
					value='Open Settings'
					keywords={['preferences']}
					class={itemCls}>
					⚙️ Open Settings
				</Command.Item>
			</Command.List>
		</Command.Root>
	),
};

export const Composed: Story = {
	render: () => (
		<Command.Root
			class={paletteCls}
			onSelect={(v) => console.log('selected', v)}>
			<Command.Input
				placeholder='Type a command or search…'
				class={inputCls}
			/>
			<Command.List class={listCls}>
				<Command.Empty class='py-6 text-center text-sm text-[#9ca3af]'>No results found.</Command.Empty>
				<Command.Group
					heading='Suggestions'
					class='[&[hidden]]:hidden'>
					<div class={headingCls}>Suggestions</div>
					<Command.Item
						value='New File'
						keywords={['create', 'document']}
						class={itemCls}>
						📄 New File
					</Command.Item>
					<Command.Item
						value='Search Docs'
						keywords={['find', 'help']}
						class={itemCls}>
						🔍 Search Docs
					</Command.Item>
				</Command.Group>
				<Command.Separator class='my-1 h-px bg-[#f3f4f6]' />
				<Command.Group class='[&[hidden]]:hidden'>
					<div class={headingCls}>Settings</div>
					<Command.Item
						value='Profile'
						class={itemCls}>
						👤 Profile
					</Command.Item>
					<Command.Item
						value='Appearance'
						keywords={['theme', 'dark mode']}
						class={itemCls}>
						🎨 Appearance
					</Command.Item>
					<Command.Item
						value='Billing'
						disabled
						class={itemCls}>
						💳 Billing (disabled)
					</Command.Item>
				</Command.Group>
			</Command.List>
		</Command.Root>
	),
};

export const Complex: Story = {
	render: () => {
		const [open, setOpen] = createSignal(false);
		return (
			<div class='flex h-64 items-start justify-center'>
				<p class='text-sm text-[#6b7280]'>
					Press <kbd class='rounded border border-[#d1d5db] px-1.5'>⌘</kbd>
					<kbd class='rounded border border-[#d1d5db] px-1.5'>K</kbd> to open the palette.
				</p>
				<Command.Root
					open={open()}
					onOpenChange={setOpen}
					shortcut='mod+k'
					class={`fixed left-1/2 top-[12vh] z-50 -translate-x-1/2 ${paletteCls}`}>
					<Command.Input
						placeholder='Type a command or search…'
						class={inputCls}
					/>
					<Command.List class={listCls}>
						<Command.Empty class='py-6 text-center text-sm text-[#9ca3af]'>
							No results found.
						</Command.Empty>
						<Command.Group
							heading='Suggestions'
							class='[&[hidden]]:hidden'>
							<div class={headingCls}>Suggestions</div>
							<Command.Item
								value='New File'
								keywords={['create', 'document']}
								class={itemCls}>
								📄 New File
							</Command.Item>
							<Command.Item
								value='Search Docs'
								keywords={['find', 'help']}
								class={itemCls}>
								🔍 Search Docs
							</Command.Item>
						</Command.Group>
						<Command.Separator class='my-1 h-px bg-[#f3f4f6]' />
						<Command.Group class='[&[hidden]]:hidden'>
							<div class={headingCls}>Settings</div>
							<Command.Item
								value='Profile'
								class={itemCls}>
								👤 Profile
							</Command.Item>
							<Command.Item
								value='Appearance'
								keywords={['theme', 'dark mode']}
								class={itemCls}>
								🎨 Appearance
							</Command.Item>
							<Command.Item
								value='Billing'
								disabled
								class={itemCls}>
								💳 Billing (disabled)
							</Command.Item>
						</Command.Group>
					</Command.List>
				</Command.Root>
			</div>
		);
	},
};
